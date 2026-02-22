import express, { type Application } from "express";
import "dotenv/config";
import Routes from "./routes";

const app: Application = express();

app.use(express.json());

// Health check routes
app.use("/api", Routes);

// Other routes here
// ...

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
