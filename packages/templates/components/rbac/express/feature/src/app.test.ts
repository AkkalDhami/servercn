import express, { type Application } from "express";
import "dotenv/config";
import { errorHandler } from "./shared/middlewares/error-handler";

import Routes from "./routes/index";

const app: Application = express();

app.use(express.json());

// routes here
app.use("/api", Routes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
