import express, { type Application } from "express";
import "dotenv/config";
import { logger } from "./utils/logger";

const app: Application = express();

app.use(express.json());

// routes here
// ....

// winston logger usage

logger.info("Server started successfully");
logger.warn("Disk space running low");
logger.error("Failed to connect to database");

export default app;
