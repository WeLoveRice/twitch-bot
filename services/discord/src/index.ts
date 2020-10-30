import { createLogger } from "./Logger";
import discord from "./api/discord";
import postgres from "./api/postgres";
import { Redis } from "./api/redis";
import { initialiseSummoners } from "./tft/SummonerInit";
import { Runner } from "./periodicTask/Runner";
import { TftMatchFetcher } from "./periodicTask/TftMatchFetcher";
import sleep from "sleep-promise";

export const main = async (): Promise<void> => {
  try {
    await postgres.connect();
    Redis.connect();
    discord.connect();

    await initialiseSummoners();
    if (!process.env.LOL_USERS) {
      return;
    }

    const summoners = process.env.LOL_USERS.split(",");
    for (const summonerName of summoners) {
      const runner = new Runner();
      const matchFetcher = new TftMatchFetcher(summonerName);
      runner.start(matchFetcher);
      await sleep(1000);
    }
  } catch (e) {
    const logger = createLogger();
    logger.error(e);
    throw e;
  }
};

main();
