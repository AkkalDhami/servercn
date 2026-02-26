import swaggerAutoGen from "swagger-autogen";

const doc = {
  info: {
    title: "Stateless Auth API",
    description: "Stateless Auth API",
    version: "1.0.0",
  },
  host: "localhost:8000",
  schemes: ["http"],
};

const outputFile = "./docs/swagger.json";
const endpointsFiles = ["./routes/*.ts"];

swaggerAutoGen(outputFile, endpointsFiles, doc);
