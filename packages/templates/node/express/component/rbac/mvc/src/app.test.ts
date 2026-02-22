import express, { type Application } from "express";
import "dotenv/config";
import { errorHandler } from "./middlewares/error-handler";

import UserRouter from "./routes/user.routes";

const app: Application = express();

app.use(express.json());

// routes here
app.use("/api/v1/users", UserRouter);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
