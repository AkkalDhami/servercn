import prompts from "prompts";

const TOOLING_MAP = {
  prettier: ["prettier"],

  eslint: [
    "eslint",
    "@typescript-eslint/parser",
    "@typescript-eslint/eslint-plugin",
    "eslint-plugin-prettier"
  ],

  typescript: ["typescript", "tsx", "tsc-alias", "@types/node"],

  husky: ["husky"],

  "lint-staged": ["lint-staged"],

  commitlint: ["@commitlint/cli", "@commitlint/config-conventional"]
} as const;

export type ToolingKey = keyof typeof TOOLING_MAP;

const TOOLING_CHOICES = [
  { title: "Prettier", value: "prettier" },
  { title: "ESLint", value: "eslint" },
  { title: "TypeScript", value: "typescript" },
  { title: "Husky", value: "husky" },
  { title: "Lint Staged", value: "lint-staged" },
  { title: "Commitlint", value: "commitlint" }
];

const RECOMMENDED_TOOLING: ToolingKey[] = ["prettier", "eslint", "typescript"];

export async function getToolingChoices(): Promise<ToolingKey[]> {
  const { enable } = await prompts({
    type: "toggle",
    name: "enable",
    message: "Would you like to set up development tooling?",
    initial: true,
    active: "yes",
    inactive: "no"
  });

  if (!enable) return [];

  const { mode } = await prompts({
    type: "select",
    name: "mode",
    message: "Choose tooling setup:",
    choices: [
      {
        title: "Prettier + ESLint + TypeScript",
        value: "recommended"
      },
      {
        title: "All (Prettier + ESLint + TypeScript + Husky + Lint Staged + Commitlint)",
        value: "all"
      },
      { title: "Custom", value: "custom" }
    ]
  });

  if (mode === "recommended") {
    return RECOMMENDED_TOOLING;
  }

  if (mode === "all") {
    return Object.keys(TOOLING_MAP) as ToolingKey[];
  }

  const { tooling } = await prompts({
    type: "multiselect",
    name: "tooling",
    message: "Select the tooling you want to use:",
    choices: TOOLING_CHOICES,
    hint: "- Space to select. Return to submit"
  });

  return tooling ?? [];
}

export function getToolingDepsFromChoices(
  choices: ToolingKey[] = []
): string[] {
  const deps = new Set<string>();

  choices.forEach(tool => {
    TOOLING_MAP[tool]?.forEach(dep => deps.add(dep));
  });

  return Array.from(deps);
}
