import swaggerAutoGen from "swagger-autogen";

const doc = {
  info: {
    title: "Hybrid Auth API",
    description: "Hybrid Auth API",
    version: "1.0.0"
  },
  host: "localhost:9000/api",
  schemes: ["http"]
};

const outputFile = "./src/docs/swagger.json";
const endpointsFiles = ["./src/routes/*.ts"];

swaggerAutoGen(outputFile, endpointsFiles, doc);
