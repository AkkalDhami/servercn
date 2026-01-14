import express, { type Application } from "express";
import "dotenv/config";
import { errorHandler } from "./shared/middlewares/error-handler";
import { notFoundHandler } from "./shared/middlewares/not-found-handler";

const app: Application = express();

app.use(express.json());

// routes here
// ...

// Not found handler (should be after routes)
app.use(notFoundHandler);

// Global error handler (should be last)
app.use(errorHandler);

export default app;
