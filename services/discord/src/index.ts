import { createLogger } from "./Logger";
import discord from "./api/discord";
import { Redis } from "./api/redis";

export const main = async (): Promise<void> => {
  try {
    Redis.connect();
    discord.connect();
  } catch (e) {
    const logger = createLogger();
    logger.error(e);
    throw e;
  }
};

main();
