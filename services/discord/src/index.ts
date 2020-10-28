import { createLogger } from "./Logger";
import discord from "./api/discord";
import postgres from "./api/postgres";
import { Redis } from "./api/redis";
import { initialiseSummoners } from "./data/TftSummoner";
import { getMatchDetail, getMatchHistory } from "./api/riot";
import { Runner } from "./periodicTask/Runner";
import { TftMatchFetcher } from "./periodicTask/TftMatchFetcher";

export const main = async (): Promise<void> => {
  try {
    await postgres.connect();
    Redis.connect();
    discord.connect();

    const runner = new Runner();
    const matchFetcher = new TftMatchFetcher("DFTskillz");
    runner.start(matchFetcher);
  } catch (e) {
    const logger = createLogger();
    logger.error(e);
    throw e;
  }
};

main();
