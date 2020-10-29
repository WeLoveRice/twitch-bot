import { TftApi, Constants } from "twisted";
import {
  ApiResponseDTO,
  MatchTFTDTO,
  ParticipantDto,
  SummonerV4DTO
} from "twisted/dist/models-dto";
import { TftSummoner } from "../../models/TftSummoner";

export const getTftApi = () => {
  if (!process.env.RIOT_API) {
    throw "RIOT_API env not defined";
  }
  return new TftApi(process.env.RIOT_API);
};

export const getSummoner = async (
  summonerName: string
): Promise<ApiResponseDTO<SummonerV4DTO>> => {
  const api = getTftApi();
  const summoner = await api.Summoner.getByName(
    summonerName,
    Constants.Regions.EU_WEST
  );

  return summoner;
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

export const getParticipantFromMatch = (
  match: ApiResponseDTO<MatchTFTDTO>,
  summoner: TftSummoner
): ParticipantDto => {
  const participantIndex = match.response.metadata.participants.findIndex(
    id => id == summoner.puuid
  );

  return match.response.info.participants[participantIndex];
};
