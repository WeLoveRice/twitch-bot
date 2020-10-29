import {
  ApiResponseDTO,
  MatchTFTDTO,
  ParticipantDto
} from "twisted/dist/models-dto";
import {
  TftMatchDetails,
  TftMatchHistory,
  TftParticipantResult,
  TftSummoner
} from "../../models/init-models";
import { getMatchHistory } from "../api/riot";
import { createLogger } from "../Logger";

export const findSummonerByName = async (name: string) => {
  const summoner = await TftSummoner.findOne({
    where: { name }
  });

  if (!summoner) {
    throw new Error(`Cannot find summoner by name ${name}`);
  }

  return summoner;
};
export const fetchLatestUniqueMatch = async (summoner: TftSummoner) => {
  if (!summoner.puuid) {
    throw new Error(`Puuid is null for ${summoner.name}`);
  }

  const matches = await getMatchHistory(summoner.puuid);
  const result = await TftMatchDetails.count({
    where: { riotId: matches.response[0] }
  });

  if (result > 0) {
    return null;
  }

  return matches.response[0];
};

export const insertMatchDetail = async ({
  response
}: ApiResponseDTO<MatchTFTDTO>) => {
  const logger = createLogger();
  const result = await TftMatchDetails.create({
    startTime: new Date(response.info.game_datetime),
    duration: Math.round(response.info.game_length),
    riotId: response.metadata.match_id
  });

  logger.info(`Inserted match_detail with ID: ${result.id}`);

  return result;
};

export const insertParticipantResult = async (
  participant: ParticipantDto,
  summoner: TftSummoner
) => {
  const logger = createLogger();

  const participantResult = await TftParticipantResult.create({
    goldLeft: participant.gold_left,
    placement: participant.gold_left,
    lastRound: participant.last_round,
    tftSummonerRiotId: summoner.riotId,
    postMatchTier: "PLATINUM",
    postMatchRank: "III",
    postMatchLp: 50
  });
  logger.info(`Inserted participant_detail with ID: ${participantResult.id}`);

  return participantResult;
};

export const insertMatchHistory = async (
  { id }: TftParticipantResult,
  { response }: ApiResponseDTO<MatchTFTDTO>
): Promise<TftMatchHistory> => {
  const logger = createLogger();
  const result = await TftMatchHistory.create({
    tftParticipantResultId: id,
    tftMatchDetailsRiotId: response.metadata.match_id
  });

  logger.info(`Inserted match_history with ID: ${result.id}`);

  return result;
};
