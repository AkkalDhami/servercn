import express, { type Application } from "express";
import dotenv from "dotenv-flow";
dotenv.config();
import UserRouter from "./routes/user.routes";

const app: Application = express();

app.use(express.json());

// routes here
app.use("/api/v1/users", UserRouter);

export default app;
