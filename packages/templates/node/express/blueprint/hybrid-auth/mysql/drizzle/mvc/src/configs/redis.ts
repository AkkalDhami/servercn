import { createClient } from "redis";
import { env } from "./env";

const redisClient = createClient({
  url: env.REDIS_URL
});

export default redisClient;
