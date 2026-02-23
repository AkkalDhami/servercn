import swaggerAutoGen from "swagger-autogen";

const doc = {
  info: {
    title: "ServerCN Express API",
    description: "ServerCN Express API documentation",
    version: "1.0.0"
  },
  host: "localhost:8000",
  schemes: ["http"]
};

const outputFile = "./docs/swagger.json"; // Output file for the generated docs
const endpointsFiles = ["./routes/*.ts"]; // Endpoints files to be parsed

swaggerAutoGen(outputFile, endpointsFiles, doc);
