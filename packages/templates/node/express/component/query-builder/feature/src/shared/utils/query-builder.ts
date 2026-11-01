import { ApiError } from "../errors/api-error";

export type FieldType = "string" | "number" | "boolean" | "date";

export type FilterOp =
  | "eq"
  | "ne"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "in"
  | "nin"
  | "contains"
  | "startsWith"
  | "endsWith";

export type Scalar = string | number | boolean | Date;

export interface QueryConfig {
  /** Fields clients may filter on, with the type used to coerce values. */
  filterable?: Record<string, FieldType>;
  /** Fields clients may sort by. */
  sortable?: string[];
  /** Fields clients may request via `?fields=`. */
  selectable?: string[];
  /** Fields that `?search=` looks at. */
  searchable?: string[];
  /** Applied when `?sort=` is missing, e.g. "-createdAt,name". */
  defaultSort?: string;
  defaultLimit?: number;
  maxLimit?: number;
  /** Max number of values in an `in` / `nin` list. */
  maxInValues?: number;
}

export interface Filter {
  field: string;
  op: FilterOp;
  value: Scalar | Scalar[];
}

export interface SortItem {
  field: string;
  order: "asc" | "desc";
}

export interface ParsedQuery {
  filters: Filter[];
  sort: SortItem[];
  select?: string[];
  search?: { term: string; fields: string[] };
  page: number;
  limit: number;
  /** (page - 1) * limit, ready for offset-based pagination. */
  skip: number;
}

const RESERVED_KEYS = new Set(["sort", "fields", "search", "page", "limit"]);

const OPS_BY_TYPE: Record<FieldType, readonly FilterOp[]> = {
  string: [
    "eq",
    "ne",
    "in",
    "nin",
    "contains",
    "startsWith",
    "endsWith"
  ],
  number: ["eq", "ne", "gt", "gte", "lt", "lte", "in", "nin"],
  date: ["eq", "ne", "gt", "gte", "lt", "lte", "in", "nin"],
  boolean: ["eq", "ne"]
};

const MAX_SEARCH_LENGTH = 100;
const MAX_SORT_FIELDS = 5;

const badRequest = (message: string) => new ApiError(400, message);

const has = (obj: object | undefined, key: string): boolean =>
  !!obj && Object.prototype.hasOwnProperty.call(obj, key);

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

function coerce(field: string, type: FieldType, raw: string): Scalar {
  switch (type) {
    case "string":
      return raw;
    case "number": {
      const n = Number(raw);
      if (raw.trim() === "" || !Number.isFinite(n)) {
        throw badRequest(`"${field}" must be a number`);
      }
      return n;
    }
    case "boolean": {
      if (raw === "true") return true;
      if (raw === "false") return false;
      throw badRequest(`"${field}" must be "true" or "false"`);
    }
    case "date": {
      const m = raw.match(
        /^(\d{4})-(\d{2})-(\d{2})(?:T(?:\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:?\d{2})?)?)?$/
      );
      if (!m) {
        throw badRequest(`"${field}" must be a valid ISO date`);
      }
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) {
        throw badRequest(`"${field}" must be a valid ISO date`);
      }
      // Rejects dates that Date silently normalizes (e.g. February 30).
      const year = Number(m[1]);
      const month = Number(m[2]);
      const day = Number(m[3]);
      const normalized = new Date(Date.UTC(year, month - 1, day));
      if (normalized.getUTCMonth() !== month - 1) {
        throw badRequest(`"${field}" must be a valid ISO date`);
      }
      return d;
    }
  }
}

/** Reads a query param that must be a single string (not repeated / nested). */
function single(name: string, value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    throw badRequest(`"${name}" must be a single value`);
  }
  return value;
}

function positiveInt(name: string, value: string | undefined, fallback: number) {
  if (value === undefined || value === "") return fallback;
  const n = Number(value);
  if (!/^\d+$/.test(value) || n < 1 || !Number.isSafeInteger(n)) {
    throw badRequest(`"${name}" must be a positive integer`);
  }
  return n;
}

/** Validates client-provided sort values; `allowed = null` trusts server defaults. */
function parseSort(value: string, allowed: string[] | null): SortItem[] {
  const items: SortItem[] = [];
  const seen = new Set<string>();

  for (const part of value.split(",")) {
    const token = part.trim();
    if (!token) continue;

    const order = token.startsWith("-") ? "desc" : "asc";
    const field = token.replace(/^-/, "");

    if (allowed && !allowed.includes(field)) {
      throw badRequest(`Sorting by "${field}" is not allowed`);
    }
    if (seen.has(field)) continue;
    seen.add(field);
    items.push({ field, order });
  }

  if (items.length > MAX_SORT_FIELDS) {
    throw badRequest(`You can sort by at most ${MAX_SORT_FIELDS} fields`);
  }
  return items;
}

/**
 * Declare what a list endpoint accepts. Anything not declared is rejected,
 * so clients can't filter or sort on private columns or inject operators.
 */
export function defineQuery(config: QueryConfig = {}) {
  const {
    filterable = {},
    sortable = [],
    selectable,
    searchable = [],
    defaultSort,
    defaultLimit = 20,
    maxLimit = 100,
    maxInValues = 50
  } = config;

  if (!Number.isSafeInteger(defaultLimit) || defaultLimit < 1) {
    throw new RangeError('"defaultLimit" must be a positive integer');
  }
  if (!Number.isSafeInteger(maxLimit) || maxLimit < 1) {
    throw new RangeError('"maxLimit" must be a positive integer');
  }

  function buildFilter(field: string, op: string, raw: unknown): Filter {
    if (field.startsWith("$") || op.startsWith("$")) {
      throw badRequest("Invalid query parameter");
    }
    if (!has(filterable, field)) {
      throw badRequest(`Filtering by "${field}" is not allowed`);
    }

    const type = filterable[field];
    const allowed = OPS_BY_TYPE[type];
    if (!(allowed as readonly string[]).includes(op)) {
      throw badRequest(
        `Operator "${op}" is not supported for "${field}" (${type}). Use: ${allowed.join(", ")}`
      );
    }
    const typedOp = op as FilterOp;

    if (typedOp === "in" || typedOp === "nin") {
      const parts: unknown[] = Array.isArray(raw)
        ? raw
        : typeof raw === "string"
          ? raw.split(",")
          : [];
      const values = parts
        .map(p => (typeof p === "string" ? p.trim() : p))
        .filter(p => p !== "");

      if (values.length === 0) {
        throw badRequest(`"${field}[${op}]" needs at least one value`);
      }
      if (values.length > maxInValues) {
        throw badRequest(
          `"${field}[${op}]" accepts at most ${maxInValues} values`
        );
      }
      return {
        field,
        op: typedOp,
        value: values.map(v => {
          if (typeof v !== "string") {
            throw badRequest(`"${field}[${op}]" has an invalid value`);
          }
          return coerce(field, type, v);
        })
      };
    }

    if (typeof raw !== "string") {
      throw badRequest(`"${field}[${op}]" must be a single value`);
    }
    return { field, op: typedOp, value: coerce(field, type, raw) };
  }

  /**
   * @param query `req.query`. Supports `age[gte]=18` (when Express parses
   * brackets) and the same key arriving as a flat string `"age[gte]"`.
   */
  function parse(query: Record<string, unknown> = {}): ParsedQuery {
    const filters: Filter[] = [];

    for (const [key, value] of Object.entries(query)) {
      if (RESERVED_KEYS.has(key)) continue;

      if (key.startsWith("$")) {
        throw badRequest("Invalid query parameter");
      }

      const flat = key.match(/^([\w.-]+)\[(\w+)\]$/);
      if (flat) {
        filters.push(buildFilter(flat[1], flat[2], value));
      } else if (isPlainObject(value)) {
        const operators = Object.entries(value);
        if (operators.length === 0) {
          throw badRequest(`"${key}" needs at least one operator`);
        }
        for (const [op, v] of operators) {
          filters.push(buildFilter(key, op, v));
        }
      } else if (Array.isArray(value)) {
        filters.push(buildFilter(key, "in", value));
      } else {
        filters.push(buildFilter(key, "eq", value));
      }
    }

    const sortRaw = single("sort", query.sort);
    const sort = sortRaw
      ? parseSort(sortRaw, sortable)
      : defaultSort
        ? parseSort(defaultSort, null)
        : [];

    let select: string[] | undefined;
    const fieldsRaw = single("fields", query.fields);
    if (fieldsRaw) {
      if (!selectable) {
        throw badRequest("Field selection is not enabled for this endpoint");
      }
      select = [
        ...new Set(
          fieldsRaw
            .split(",")
            .map(f => f.trim())
            .filter(Boolean)
        )
      ];
      for (const f of select) {
        if (!selectable.includes(f)) {
          throw badRequest(`Selecting "${f}" is not allowed`);
        }
      }
      if (select.length === 0) select = undefined;
    }

    let search: ParsedQuery["search"];
    const searchRaw = single("search", query.search)?.trim();
    if (searchRaw) {
      if (searchable.length === 0) {
        throw badRequest("Search is not enabled for this endpoint");
      }
      if (searchRaw.length > MAX_SEARCH_LENGTH) {
        throw badRequest(
          `"search" must be at most ${MAX_SEARCH_LENGTH} characters`
        );
      }
      search = { term: searchRaw, fields: searchable };
    }

    const page = positiveInt("page", single("page", query.page), 1);
    const limit = Math.min(
      positiveInt("limit", single("limit", query.limit), defaultLimit),
      maxLimit
    );
    const skip = (page - 1) * limit;
    if (!Number.isSafeInteger(skip)) {
      throw badRequest('"page" is too large');
    }

    return { filters, sort, select, search, page, limit, skip };
  }

  return { parse };
}

export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/** Pagination metadata to return alongside a page of results. */
export function buildPageMeta(
  total: number,
  query: Pick<ParsedQuery, "page" | "limit">
): PageMeta {
  const totalPages = Math.ceil(total / query.limit);
  return {
    total,
    page: query.page,
    limit: query.limit,
    totalPages,
    hasNext: query.page < totalPages,
    hasPrev: query.page > 1
  };
}