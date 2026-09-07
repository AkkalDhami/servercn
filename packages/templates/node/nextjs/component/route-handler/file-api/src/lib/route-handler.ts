import { STATUS_CODES, type StatusCode } from "@/constants/status-codes";
import { NextRequest, NextResponse } from "next/server";

type RouteContext<
  TParams extends Record<string, string> = Record<string, string>
> = {
  params: Promise<TParams>;
};

type RouteHandlerFn<
  TParams extends Record<string, string> = Record<string, string>
> = (req: NextRequest, ctx: RouteContext<TParams>) => Promise<Response>;

type ErrorWithStatus = Error & {
  status?: unknown;
};

function isErrorWithStatus(error: unknown): error is ErrorWithStatus {
  return error instanceof Error && "status" in error;
}

function isStatusCode(value: unknown): value is StatusCode {
  return (
    typeof value === "number" &&
    Object.values(STATUS_CODES).includes(value as StatusCode)
  );
}

export function RouteHandler<
  TParams extends Record<string, string> = Record<string, string>
>(handler: RouteHandlerFn<TParams>) {
  return async (
    req: NextRequest,
    ctx: RouteContext<TParams>
  ): Promise<Response> => {
    try {
      return await handler(req, ctx);
    } catch (error: unknown) {
      console.error("API Error:", error);

      let message = "Internal Server Error";
      let status: StatusCode = STATUS_CODES.INTERNAL_SERVER_ERROR;

      if (error instanceof Error) {
        message = error.message;
      }

      if (isErrorWithStatus(error) && isStatusCode(error.status)) {
        status = error.status;
      }

      return NextResponse.json(
        {
          success: false,
          message
        },
        { status }
      );
    }
  };
}
