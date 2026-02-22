import { Request, Response } from "express";
import { ApiResponse } from "../utils/api-response";

/**
 * Basic health check endpoint
 * GET /api/health
 */
export const healthCheck = async (_req: Request, res: Response) => {
  return ApiResponse.Success(res, "Service is healthy", {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
};

/**
 * Detailed health check with system information
 * GET /api/health/detailed
 */
export const detailedHealthCheck = async (_req: Request, res: Response) => {
  const healthData = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
    memory: {
      used:
        Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total:
        Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
      unit: "MB"
    },
    cpu: {
      usage: process.cpuUsage()
    }
  };

  return ApiResponse.Success(res, "Service is healthy", healthData);
};
