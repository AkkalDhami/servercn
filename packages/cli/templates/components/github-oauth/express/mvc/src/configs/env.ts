import "dotenv/config";

interface Config {
  PORT: number;
  NODE_ENV: string;
  LOG_LEVEL: string;
  CORS_ORIGIN: string;

  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GITHUB_REDIRECT_URI: string;
}

const env: Config = {
  PORT: Number(process.env.PORT) || 1111,
  NODE_ENV: process.env.NODE_ENV || "development",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",

  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID!,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET!,
  GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI!
};

export default env;
