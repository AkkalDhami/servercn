import express, { type Application } from "express";
import "dotenv/config";
import { logger } from "./shared/utils/pino-logger";
import { httpLogger } from "./shared/middlewares/logger.middleware";

const app: Application = express();

app.use(express.json());

// routes here
// ....

// pino logger usage

app.use(httpLogger);

logger.info("Server started successfully");
logger.warn("Disk space running low");
logger.error("Failed to connect to database");

export default app;
