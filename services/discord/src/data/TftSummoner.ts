import sleep from "sleep-promise";
import { TftSummoner } from "../../models/TftSummoner";
import { getSummoner } from "../api/riot";
import { createLogger } from "../Logger";

export const initialiseSummoners = async () => {
  const logger = createLogger();

  logger.info(`Initialising Summoners: ${process.env.LOL_USERS}`);
  if (!process.env.LOL_USERS) {
    return;
  }
  const summoners = process.env.LOL_USERS.split(",");
  for await (const summonerName of summoners) {
    const { id, puuid, name } = await getSummoner(summonerName);
    const count = await TftSummoner.count({ where: { riotId: id } });
    if (count > 0) {
      continue;
    }

    await TftSummoner.create({ puuid: puuid, name: name, riotId: id });
    await sleep(2000);
    logger.info(`${summonerName} added to db`);
  }
};
