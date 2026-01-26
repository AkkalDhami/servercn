import "dotenv/config";

interface Config {
  PORT: number;
  NODE_ENV: string;
  LOG_LEVEL: string;
  DATABASE_URL: string;
}

const env: Config = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  DATABASE_URL: process.env.DATABASE_URL!
};

export default env;
