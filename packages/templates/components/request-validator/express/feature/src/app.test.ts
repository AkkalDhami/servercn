import express, { type Application } from "express";
import Routes from "./routes/index";

const app: Application = express();

app.use(express.json());

// routes here
app.use("/api", Routes);

export default app;
