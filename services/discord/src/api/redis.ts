import { createClient, RedisClient } from "redis";
import { createLogger } from "../Logger";

const logger = createLogger();
export const redis: RedisClient = createClient(6379, "redis");

redis.on("error", error => {
  logger.error(`redis error: ${error}`);
});
