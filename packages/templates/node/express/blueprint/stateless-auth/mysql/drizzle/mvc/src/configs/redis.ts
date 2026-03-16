import { createClient } from "redis";
import env from "./env";
import { logger } from "../utils/logger";

let redisUrl: string = env.REDIS_URL!;

if (!redisUrl) {
  throw new Error("REDIS_URL is not defined");
}

const redis = createClient({
  url: redisUrl
});

export default redis;

export function connectRedis() {
  redis
    .connect()
    .then(() => {
      logger.info("Redis connected");
    })
    .catch(err => {
      logger.error(err, "Redis connection error!");
    });
}
