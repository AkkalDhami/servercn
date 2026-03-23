import swaggerUi from "swagger-ui-express";
import { Express } from "express";

import swaggerDocument from "../../docs/swagger.json";

export const setupSwagger = (app: Express) => {
  if (process.env.ENABLE_SWAGGER !== "true") return;
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
