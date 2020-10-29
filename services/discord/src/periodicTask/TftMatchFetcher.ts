import { Logger } from "winston";
import { PeriodicTask } from ".";
import { getMatchDetail, getParticipantFromMatch } from "../api/riot";
import { createLogger } from "../Logger";
import {
  fetchLatestUnprocessedMatch,
  findSummonerByName,
  insertMatchDetail,
  insertMatchHistory,
  insertParticipantResult,
  matchDetailExists
} from "../tft/database";

export class TftMatchFetcher implements PeriodicTask {
  summonerName: string;
  interval = 30 * 1000;
  logger: Logger;
  public constructor(summonerName: string) {
    this.summonerName = summonerName;
    this.logger = createLogger();
  }

  async execute(): Promise<boolean> {
    const summoner = await findSummonerByName(this.summonerName);
    const latestMatch = await fetchLatestUnprocessedMatch(summoner);
    if (!latestMatch) {
      return false;
    }

    const match = await getMatchDetail(latestMatch);
    if (!(await matchDetailExists(match))) {
      await insertMatchDetail(match);
    }
    const participant = await getParticipantFromMatch(match, summoner);
    const participantResult = await insertParticipantResult(
      participant,
      summoner
    );
    await insertMatchHistory(participantResult, match, summoner);
    return false;
  }
}
