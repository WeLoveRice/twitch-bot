import { createClient } from "async-redis";
import { createLogger } from "../Logger";

const logger = createLogger();
export const redis = createClient(6379, "redis");

redis.on("error", error => {
  logger.error(`redis error: ${error}`);
});

redis.on("ready", async () => {
  await redis.flushall();
});
