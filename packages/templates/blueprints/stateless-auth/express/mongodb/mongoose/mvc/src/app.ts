import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { notFoundHandler } from "./middlewares/not-found-handler";
import { errorHandler } from "./middlewares/error-handler";
import env from "./configs/env";
import { configureSecurityHeaders } from "./middlewares/security-header";

import Routes from "./routes/index";

import "./configs/passport";

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
