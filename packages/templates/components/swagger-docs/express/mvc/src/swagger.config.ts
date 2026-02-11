import swaggerAutoGen from "swagger-autogen";

const doc = {
  info: {
    title: "Stateless Auth API",
    description: "Stateless Auth API",
    version: "1.0.0"
  },
  host: "localhost:8000",
  schemes: ["http"]
};

const outputFile = "./docs/swagger.json"; // Output file for the generated docs
const endpointsFiles = ["./routes/*.ts"]; // Endpoints files to be parsed

swaggerAutoGen(outputFile, endpointsFiles, doc);
