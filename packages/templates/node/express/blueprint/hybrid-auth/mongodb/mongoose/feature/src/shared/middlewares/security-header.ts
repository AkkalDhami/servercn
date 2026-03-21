import { NextFunction, Request, Response } from "express";
import cors from "cors";
import { Express } from "express";
import helmet from "helmet";
import env from "../configs/env";

export const configureSecurityHeaders = (app: Express) => {
  // Use Helmet to set various security-related HTTP headers
  app.use(helmet());

  // Configure CORS
  app.use(
    cors({
      origin: env.CORS_ORIGIN || "*",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
    })
  );

  // Additional custom security headers
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
  });
};
