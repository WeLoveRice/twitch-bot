import { createLogger } from "../Logger";
import Redis from "ioredis";

const connect = () => {
  const logger = createLogger();
  const redis = new Redis(6379, "redis");

  redis.on("error", error => {
    logger.error(`redis error: ${error}`);
  });

  redis.on("ready", async () => {
    await redis.flushall();
    logger.info("Connected to redis");
  });
  return redis;
};

export default { connect };
