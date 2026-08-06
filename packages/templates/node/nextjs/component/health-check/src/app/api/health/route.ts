import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    success: true,
    statusCode: 200,
    status: "healthy",
    service: process.env.SERVICE_NAME ?? "nextjs-api",
    version: process.env.npm_package_version ?? "1.0.0",
    message: "Service is up and running",
    timestamp: new Date().toISOString()
  });
}
