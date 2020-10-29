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
import { fetchLeagueBySummoner, getMatchHistory } from "../api/riot";
import { createLogger } from "../Logger";

export const findSummonerByName = async (
  name: string
): Promise<TftSummoner> => {
  const summoner = await TftSummoner.findOne({
    where: { name }
  });

  if (!summoner) {
    throw new Error(`Cannot find summoner by name ${name}`);
  }

  return summoner;
};

export const fetchLatestUniqueMatch = async (
  summoner: TftSummoner
): Promise<string | null> => {
  const matches = await getMatchHistory(summoner.puuid);
  const result = await TftMatchDetails.count({
    where: { riotId: matches.response[0] }
  });

  if (result > 0) {
    return null;
  }

  return matches.response[0];
};

export const matchDetailExists = async ({
  response
}: ApiResponseDTO<MatchTFTDTO>): Promise<boolean> => {
  const result = await TftMatchDetails.count({
    where: {
      riotId: response.metadata.match_id
    }
  });

  return result > 0;
};

export const insertMatchDetail = async ({
  response
}: ApiResponseDTO<MatchTFTDTO>): Promise<TftMatchDetails> => {
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
): Promise<TftParticipantResult> => {
  const logger = createLogger();

  const {
    response: { tier, rank, leaguePoints }
  } = await fetchLeagueBySummoner(summoner);

  const participantResult = await TftParticipantResult.create({
    goldLeft: participant.gold_left,
    placement: participant.placement,
    lastRound: participant.last_round,
    tftSummonerRiotId: summoner.riotId,
    postMatchTier: tier,
    postMatchRank: rank,
    postMatchLp: leaguePoints
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
