import { TftApi } from "twisted";
export const getTftApi = () => {
  if (!process.env.RIOT_API) {
    throw "RIOT_API env not defined";
  }

  return new TftApi(process.env.RIOT_API);
};

//   const summoner = await api.Summoner.getByName(
//     "DFTskillz",
//     Constants.Regions.EU_WEST
//   );
//   const list = await api.Match.list(
//     summoner.response.puuid,
//     Constants.TftRegions.EUROPE,
//     { count: 1 }
//   );
//   console.log(list.response);
//   const result = await pool.query(
//     "SELECT * FROM tft_match_history WHERE tft_match_details_riot_id=$1",
//     [list.response[0]]
//   );
//   console.log(result);
