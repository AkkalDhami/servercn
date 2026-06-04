import { NextRequest } from "next/server";

export const RATE_LIMIT_WINDOW = 1 * 60 * 1000; // 1 minute
export const RATE_LIMIT_MAX_REQUESTS = 5 as const;

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export function resetRateLimit(clientIP: string) {
  rateLimitStore.delete(clientIP);
}
type RateLimit = {
  allowed: boolean;
  remaining: number;
  resetTime: number;
};

export function checkRateLimit(clientIP: string): RateLimit {
  const now = Date.now();
  const data = rateLimitStore.get(clientIP);

  if (!data || now > data.resetTime) {
    rateLimitStore.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS - 1,
      resetTime: data?.resetTime || 0
    };
  }

  if (data.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetTime: data?.resetTime || 0 };
  }

  data.count++;
  rateLimitStore.set(clientIP, data);

  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - data.count,
    resetTime: data?.resetTime || 0
  };
}

/**
 * ? Usage:
export const POST = async (req: NextRequest) => {
  const clientIP = getClientIP(req);
  const rateLimit = checkRateLimit(clientIP);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        message: "Too many requests, please try again later."
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": RATE_LIMIT_MAX_REQUESTS.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": new Date(rateLimit.resetTime)
            .toISOString()
            .substring(0, 19)
            .replace("T", " ")
            .toString()
        }
      }
    );
  }
  
  //* Your API logic here
};
*/
