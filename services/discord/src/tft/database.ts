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

export const fetchLatestUnprocessedMatchId = async (
  summoner: TftSummoner
): Promise<string | null> => {
  const matches = await getMatchHistory(summoner.puuid);
  const result = await TftMatchHistory.count({
    where: {
      tftMatchDetailsRiotId: matches.response[0],
      tftSummonerId: summoner.id
    }
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
  const [result] = await TftMatchDetails.upsert({
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

  const { response } = await fetchLeagueBySummoner(summoner);
  const { tier, rank, leaguePoints } = response[0];

  const participantResult = await TftParticipantResult.create({
    goldLeft: participant.gold_left,
    placement: participant.placement,
    lastRound: participant.last_round,
    postMatchTier: tier,
    postMatchRank: rank,
    postMatchLp: leaguePoints
  });
  logger.info(`Inserted participant_detail with ID: ${participantResult.id}`);

  return participantResult;
};

export const insertMatchHistory = async (
  { id }: TftParticipantResult,
  { response }: ApiResponseDTO<MatchTFTDTO>,
  summoner: TftSummoner
): Promise<TftMatchHistory> => {
  const logger = createLogger();
  const result = await TftMatchHistory.create({
    tftParticipantResultId: id,
    tftMatchDetailsRiotId: response.metadata.match_id,
    tftSummonerId: summoner.id
  });

  logger.info(`Inserted match_history with ID: ${result.id}`);

  return result;
};
