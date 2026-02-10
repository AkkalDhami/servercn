import express from "express";
import { setupSwagger } from "./shared/configs/swagger";

const app = express();

// Initialize Swagger
setupSwagger(app);

app.listen(8000, () => {
  console.log("Server started on port 8000");
  console.log("Swagger docs available at http://localhost:8000/api/docs");
});
