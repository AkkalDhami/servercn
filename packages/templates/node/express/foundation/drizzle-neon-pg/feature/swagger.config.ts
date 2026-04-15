import swaggerAutoGen from "swagger-autogen";

const doc = {
  info: {
    title: "Drizzle + Neon + PostgreSQL Starter",
    description: "Drizzle + Neon + PostgreSQL Starter",
    version: "1.0.0"
  },
  host: "localhost:9000",
  schemes: ["http"]
};

const outputFile = "./src/docs/swagger.json";
const endpointsFiles = ["./src/routes/*.ts"];

swaggerAutoGen(outputFile, endpointsFiles, doc);
