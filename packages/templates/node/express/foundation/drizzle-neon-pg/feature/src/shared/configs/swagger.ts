import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import env from "./env";

import swaggerDocument from "../../docs/swagger.json";

export const setupSwagger = (app: Express) => {
  if (env.NODE_ENV !== "development") return;
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
