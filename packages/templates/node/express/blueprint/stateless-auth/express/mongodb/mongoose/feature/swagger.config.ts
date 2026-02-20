import swaggerAutoGen from "swagger-autogen";

const doc = {
  info: {
    title: "Stateless Auth API",
    description: "Stateless Auth API",
    version: "1.0.0"
  },
  host: `localhost:${process.env.PORT || 8000}`,
  schemes: ["http"]
};

const outputFile = "./src/docs/swagger.json";
const endpointsFiles = ["./src/routes/*.ts"];

swaggerAutoGen(outputFile, endpointsFiles, doc);
