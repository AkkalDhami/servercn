import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import Routes from "./routes/index";

import { errorHandler } from "./shared/middlewares/error-handler";
import { notFoundHandler } from "./shared/middlewares/not-found-handler";
import env from "./shared/configs/env";

import "source-map-support/register";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true
  })
);
app.use(helmet());
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

// Routes

app.get("/", (req: Request, res: Response) => {
  res.redirect("/api/v1/health");
});

app.use("/api/v1", Routes);

// Not found handler (should be after routes)
app.use(notFoundHandler);

// Global error handler (should be last)
app.use(errorHandler);

export default app;
