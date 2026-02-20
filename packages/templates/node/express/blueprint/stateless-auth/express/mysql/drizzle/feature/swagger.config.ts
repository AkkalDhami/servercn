import swaggerAutoGen from "swagger-autogen";

import env from "./src/shared/configs/env";

const doc = {
  info: {
    title: "Stateless Auth API",
    description: "Stateless Auth API",
    version: "1.0.0"
  },
  host: `localhost:${env.PORT}`,
  schemes: ["http"]
};

const outputFile = "./src/docs/swagger.json";
const endpointsFiles = ["./src/routes/*.ts"];

swaggerAutoGen(outputFile, endpointsFiles, doc);
