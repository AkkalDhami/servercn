import swaggerAutoGen from "swagger-autogen";

const doc = {
  info: {
    title: "Bank Application",
    description: "Bank Application",
    version: "1.0.0"
  },
  host: `localhost:${process.env.PORT || 9000}`,
  schemes: ["http"]
};

const outputFile = "./src/docs/swagger.json";
const endpointsFiles = ["./src/routes/*.ts"];

swaggerAutoGen(outputFile, endpointsFiles, doc);
