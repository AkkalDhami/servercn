import express, { type Application } from "express";
import "dotenv/config";
import { logger } from "./utils/pino-logger";
import { httpLogger } from "./middlewares/logger.middleware";

const app: Application = express();

app.use(express.json());

// routes here
// ....

// pino logger middleware
app.use(httpLogger);

// pino logger usage

logger.info("Server started");
logger.warn({ userId: "123" }, "Suspicious activity detected");
logger.error({ err: "Database connection failed" }, "Database connection failed");

export default app;
