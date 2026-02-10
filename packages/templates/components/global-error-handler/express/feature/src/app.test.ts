import express, { type Application } from "express";
import "dotenv/config";
import { errorHandler } from "./shared/middlewares/error-handler";

const app: Application = express();

app.use(express.json());

// routes here
// ...

// Global error handler (should be last)
app.use(errorHandler);

export default app;
