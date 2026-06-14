import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

redis.on("error", err => console.log("Redis Client Error:", err));

export default redis;
