import express, { Express } from "express";

import { notFoundHandler } from "./shared/middlewares/not-found-handler";
import { errorHandler } from "./shared/middlewares/error-handler";

import AuthRoutes from "./routes/index.ts";

import "./configs/passport";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", AuthRoutes);

// Not found handler (should be after routes)
app.use(notFoundHandler);

// Global error handler (should be last)
app.use(errorHandler);

export default app;
