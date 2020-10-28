import { createLogger } from "./Logger";
import discord from "./api/discord";
import postgres from "./api/postgres";
import { Redis } from "./api/redis";
import { initialiseSummoners } from "./data/TftSummoner";

export const main = async (): Promise<void> => {
  try {
    await postgres.connect();
    Redis.connect();
    discord.connect();

    initialiseSummoners();
  } catch (e) {
    const logger = createLogger();
    logger.error(e);
    throw e;
  }
};

main();
