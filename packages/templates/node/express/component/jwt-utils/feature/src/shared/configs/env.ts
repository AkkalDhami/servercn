interface Config {
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_SECRET: string;
}

const env: Config = {
  JWT_REFRESH_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!
};

export default env;
