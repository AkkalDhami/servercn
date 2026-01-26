interface Config {
  PORT: number;
  NODE_ENV: string;
  LOG_LEVEL: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
}

const env: Config = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!
};

export default env;
