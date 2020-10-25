import { createLogger } from "./Logger";
import discord from "./api/discord";
import postgres from "./api/postgres";
import redis from "./api/redis";
import { initialiseSummoners } from "./DataInitialization";

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
initialiseSummoners();
