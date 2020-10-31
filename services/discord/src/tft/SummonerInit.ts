import sleep from "sleep-promise";
import { TftSummoner } from "../../models/TftSummoner";
import { getSummoner } from "../api/riot";
import { createLogger } from "../Logger";

export const initSummoner = async (summonerName: string) => {
  const { response } = await getSummoner(summonerName);
  const count = await TftSummoner.count({ where: { riotId: response.id } });
  if (count > 0) {
    return;
  }

  await TftSummoner.create({
    puuid: response.puuid,
    name: response.name,
    riotId: response.id
  });

  const logger = createLogger();
  logger.info(`${summonerName} added to db`);
};

export const initialiseSummoners = async () => {
  const logger = createLogger();

  logger.info(`Initialising Summoners: ${process.env.LOL_USERS}`);
  if (!process.env.LOL_USERS) {
    return;
  }

  const summoners = process.env.LOL_USERS.split(",");
  for await (const summonerName of summoners) {
    await initSummoner(summonerName);
    await sleep(1000);
  }
};
