import swaggerAutoGen from "swagger-autogen";

const doc = {
  info: {
    title: "Stateful authentication",
    description: "Stateful authentication API documentation",
    version: "1.0.0"
  },
  host: "localhost:9000",
  schemes: ["http"]
};

const outputFile = "./src/docs/swagger.json"; // Output file for the generated docs
const endpointsFiles = ["./src/routes/*.ts"]; // Endpoints files to be parsed

swaggerAutoGen(outputFile, endpointsFiles, doc);
