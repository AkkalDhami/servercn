import express, { Express } from "express";

import { notFoundHandler } from "./shared/middlewares/not-found-handler";
import { errorHandler } from "./shared/middlewares/error-handler";

import Routes from "./routes/index";

import "./shared/configs/passport";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", Routes);

// Not found handler (should be after routes)
app.use(notFoundHandler);

// Global error handler (should be last)
app.use(errorHandler);

export default app;
