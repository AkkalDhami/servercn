import express, { Application } from "express";
import "dotenv/config";

import { errorHandler } from "./middlewares/error-handler";
import { logger } from "./utils/logger";

import uploadRoutes from "./routes/upload.routes";
import env from "./configs/env";

const app: Application = express();

const PORT = env.PORT;

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.use("/api/uploads", uploadRoutes);

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
