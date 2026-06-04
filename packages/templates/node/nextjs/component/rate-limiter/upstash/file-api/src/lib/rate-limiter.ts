import { Ratelimit } from "@upstash/ratelimit";

import redis from "@/configs/redis";

export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(100, "10 s"), //* 100 requests per 10 seconds
  ephemeralCache: new Map(), //* cache for the ratelimit
  prefix: "@servercn/ratelimit" //* prefix for the ratelimit
});

/**
 * ? Usage:
 
import { ratelimit } from "@/lib/rate-limiter";

* * 1. proxy.ts (middleware)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "127.0.0.1";

  const { success, limit, remaining } = await ratelimit.limit(ip);
  const response = NextResponse.next();

  if (!success) {
    response.headers.set("X-RateLimit-Success", success.toString());
    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"]
};

* * 2. API Routes

export const POST = async (req: NextRequest) => {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";

  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      {
        message: "Too many requests, please try again later."
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString()
        }
      }
    );
  }

  //* Your API logic here
};

** Official Docs:
* https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted
* https://github.com/upstash/ratelimit-js/tree/main/examples/nextjs
* https://github.com/upstash/ratelimit-js/tree/main/examples/nextjs-middleware
**/
