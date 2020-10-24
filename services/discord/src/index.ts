import { createLogger } from "./Logger";
import postgres from "./api/postgres";
import discord from "./api/discord";
import redis from "./api/redis";

export const redisClient = redis.connect();
export const main = async (): Promise<void> => {
  try {
    await postgres.connect();
    discord.connect();
  } catch (e) {
    const logger = createLogger();
    logger.error(e);
  }
};

main();
