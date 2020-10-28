import { TftApi, Constants } from "twisted";

export const getTftApi = () => {
  console.log(process.env.RIOT_API);
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

export const getMatchHistory = async (summonerPUUID: string) => {
  const api = getTftApi();
  const matches = await api.Match.list(
    summonerPUUID,
    Constants.TftRegions.EUROPE
  );
  return matches;
};

export const getMatchDetail = async (matchId: string) => {
  const api = getTftApi();
  const match = await api.Match.get(matchId, Constants.TftRegions.EUROPE);
  return match;
};
