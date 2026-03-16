import swaggerAutoGen from "swagger-autogen";

const doc = {
  info: {
    title: "Prisma MongoDB Starter",
    description: "Prisma MongoDB Starter",
    version: "1.0.0"
  },
  host: `localhost:3000`,
  schemes: ["http"]
};

const outputFile = "./src/docs/swagger.json";
const endpointsFiles = ["./src/routes/*.ts"];

swaggerAutoGen(outputFile, endpointsFiles, doc);
