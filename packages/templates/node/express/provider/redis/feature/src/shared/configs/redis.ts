import { createClient } from "redis";
import { env } from "./env.ts";

const redisClient = createClient({
  url: env.REDIS_URL
});

export default redisClient;

export const setCache = async (
  key: string,
  value: string,
  expireInSeconds?: number,
  expireInMS?: number
) => {
  if (expireInSeconds) {
    await redisClient.set(key, value, {
      expiration: {
        type: "EX",
        value: expireInSeconds
      }
    });
  } else if (expireInMS) {
    await redisClient.set(key, value, {
      expiration: {
        type: "PX",
        value: expireInMS
      }
    });
  } else {
    await redisClient.set(key, value);
  }
};

export const getCache = async (key: string) => {
  return await redisClient.get(key);
};

export const deleteCache = async (key: string) => {
  return await redisClient.del(key);
};

// await setCache("otp", "123456", 300);
// const otp = await getCache("otp");
// await deleteCache("otp");
