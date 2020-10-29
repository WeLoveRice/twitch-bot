import { Logger } from "winston";
import { PeriodicTask } from ".";
import { getMatchDetail, getParticipantFromMatch } from "../api/riot";
import { createLogger } from "../Logger";
import {
  fetchLatestUniqueMatch,
  findSummonerByName,
  insertMatchDetail,
  insertMatchHistory,
  insertParticipantResult
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
    const latestMatch = await fetchLatestUniqueMatch(summoner);
    if (!latestMatch) {
      return false;
    }

    const match = await getMatchDetail(latestMatch);
    await insertMatchDetail(match);

    const participant = await getParticipantFromMatch(match, summoner);
    const participantResult = await insertParticipantResult(
      participant,
      summoner
    );
    await insertMatchHistory(participantResult, match);
    return false;
  }
}
