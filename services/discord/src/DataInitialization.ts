import { Constants } from "twisted";
import { SummonerV4DTO } from "twisted/dist/models-dto";
import { getTftApi } from "./api/riot";
import sleep from "sleep-promise";
import { TftSummoner } from "../models/TftSummoner";

const getSummoner = async (summonerName: string) => {
  const api = getTftApi();
  const summoner = await api.Summoner.getByName(
    summonerName,
    Constants.Regions.EU_WEST
  );

  return summoner.response;
};

const doesSummonerExistInDb = async (summoner: SummonerV4DTO) => {
  const result = await TftSummoner.count({ where: { riotId: summoner.id } });

  return result > 0;
};

const addSummoner = async (summoner: SummonerV4DTO) => {
  const { id, puuid, name } = summoner;
  await TftSummoner.create({ puuid: puuid, name: name, riotId: id });
};

export const initialiseSummoners = async () => {
  console.log(process.env.LOL_USERS);
  if (!process.env.LOL_USERS) {
    return;
  }
  const summoners = process.env.LOL_USERS.split(",");
  for await (const summonerName of summoners) {
    const summoner = await getSummoner(summonerName);

    if (await doesSummonerExistInDb(summoner)) {
      console.log(summoner);
      continue;
    }

    await addSummoner(summoner);
    await sleep(2000);
  }
};
