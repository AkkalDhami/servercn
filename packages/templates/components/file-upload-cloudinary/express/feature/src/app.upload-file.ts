import express, { Application } from "express";
import "dotenv/config";

import { errorHandler } from "./shared/middlewares/error-handler";
import { logger } from "./shared/utils/logger";

import Routes from "./routes/index";
import env from "./shared/configs/env";

const app: Application = express();

const PORT = env.PORT;

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.use("/api", Routes);

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
