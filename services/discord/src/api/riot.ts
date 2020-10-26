import { TftApi, Constants } from "twisted";

export const getTftApi = () => {
  if (!process.env.RIOT_API) {
    throw "RIOT_API env not defined";
  }
  return new TftApi(process.env.RIOT_API);
};

export const getSummoner = async (summonerName: string) => {
  const api = getTftApi();
  const summoner = await api.Summoner.getByName(
    summonerName,
    Constants.Regions.EU_WEST
  );

  return summoner.response;
};
