import { Logger } from "winston";
import { PeriodicTask } from ".";
import {
  TftMatchDetails,
  TftMatchHistory,
  TftParticipantResult
} from "../../models/init-models";
import { TftSummoner } from "../../models/TftSummoner";
import { getMatchDetail, getMatchHistory } from "../api/riot";
import { createLogger } from "../Logger";

export class TftMatchFetcher implements PeriodicTask {
  summonerName: string;
  interval = 30 * 1000;
  logger: Logger;
  public constructor(summonerName: string) {
    this.summonerName = summonerName;
    this.logger = createLogger();
  }

  async execute(): Promise<boolean> {
    const summoner = await TftSummoner.findOne({
      where: { name: this.summonerName }
    });

    if (!summoner || !summoner.puuid) {
      throw new Error(`Cannot find summoner by name ${this.summonerName}`);
    }

    const matches = await getMatchHistory(summoner.puuid);
    const matchInDb = await TftMatchDetails.count({
      where: { riotId: matches.response[0] }
    });
    this.logger.info(`Match ${matches.response[0]} already in DB, skipping`);
    if (matchInDb > 0) {
      return false;
    }

    const match = await getMatchDetail(matches.response[0]);
    const matchDetailResult = await TftMatchDetails.create({
      startTime: new Date(match.response.info.game_datetime),
      duration: Math.round(match.response.info.game_length),
      riotId: match.response.metadata.match_id
    });
    this.logger.info(`Inserted match_detail with ID: ${matchDetailResult.id}`);

    const participantIndex = match.response.metadata.participants.findIndex(
      id => id == summoner.puuid
    );

    const participant = match.response.info.participants[participantIndex];
    const participantResult = await TftParticipantResult.create({
      goldLeft: participant.gold_left,
      placement: participant.gold_left,
      lastRound: participant.last_round,
      tftSummonerRiotId: summoner.riotId,
      postMatchTier: "PLATINUM",
      postMatchRank: "III",
      postMatchLp: 50
    });
    this.logger.info(
      `Inserted participant_detail with ID: ${participantResult.id}`
    );

    await TftMatchHistory.create({
      tftParticipantResultId: participantResult.id,
      tftMatchDetailsRiotId: match.response.metadata.match_id
    });
    return false;
  }
}
