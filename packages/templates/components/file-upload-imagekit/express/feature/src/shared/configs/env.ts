import "dotenv/config";

interface Config {
  PORT: number;
  NODE_ENV: string;
  LOG_LEVEL: string;

  IMAGEKIT_PRIVATE_KEY: string;
}

const env: Config = {
  PORT: Number(process.env.PORT) || 1111,
  NODE_ENV: process.env.NODE_ENV || "development",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",

  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY!
};

export default env;
