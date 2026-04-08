import { STATUS_CODES } from "@/constants/status-codes";
import { logger } from "@/utils/logger";
import { NextRequest } from "next/server";

type HandlerContext = {
  params?: Record<string, string>;
};

type RouteHandlerFn = (
  req: NextRequest,
  ctx?: HandlerContext
) => Promise<Response>;

export function RouteHandler(fn: RouteHandlerFn) {
  return async (req: NextRequest, ctx?: HandlerContext): Promise<Response> => {
    try {
      return await fn(req, ctx);
    } catch (error: unknown) {
      logger.error(error, "API Error");

      let message = "Internal Server Error";
      let status = STATUS_CODES.INTERNAL_SERVER_ERROR;

      if (error instanceof Error) {
        message = error.message;

        if ("status" in error && typeof (error as any).status === "number") {
          status = (error as any).status;
        }
      }

      return new Response(
        JSON.stringify({
          success: false,
          message
        }),
        {
          status,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
  };
}

/**
 * ? USAGE:

  export const GET = RouteHandler(async () => {
    return new Response(JSON.stringify({ success: true }));
  });

  export const DELETE = RouteHandler(
    async (
      req: NextRequest,
      { params }: { params: Promise<{ id: string }> }
    ) => {
      const { id } = await params;
      // logic
    }
  );

 */