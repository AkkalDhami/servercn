import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import Routes from "./routes/index";

import "./shared/configs/passport";
import { configureSecurityHeaders } from "./shared/middlewares/security-header";
import { notFoundHandler } from "./shared/middlewares/not-found-handler";
import { errorHandler } from "./shared/middlewares/error-handler";
import env from "./shared/configs/env";

const app: Express = express();

//? Apply security headers before other middlewares and routes
configureSecurityHeaders(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

//? Routes
app.get("/", (req: Request, res: Response) => {
  res.redirect("/api/v1/health");
});

app.use("/api", Routes);

//? Not-found-handler (should be after routes)
app.use(notFoundHandler);

//? Global error handler (should be last)
app.use(errorHandler);

export default app;
