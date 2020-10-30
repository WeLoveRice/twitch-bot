import { Logger } from "winston";
import { PeriodicTask } from ".";
import { TftSummoner } from "../../models/TftSummoner";
import { getMatchDetail, getParticipantFromMatch } from "../api/riot";
import { createLogger } from "../Logger";
import {
  fetchLatestUnprocessedMatchId,
  findSummonerByName,
  insertMatchDetail,
  insertMatchHistory,
  insertParticipantResult,
  matchDetailExists
} from "../tft/database";

export class TftMatchFetcher implements PeriodicTask {
  summonerName: string;
  summoner!: TftSummoner;
  interval = 30 * 1000;
  logger: Logger;

  public constructor(summonerName: string) {
    this.summonerName = summonerName;
    this.logger = createLogger();
  }

  async initialiseSummoner(): Promise<void> {
    if (!this.summoner) {
      this.summoner = await findSummonerByName(this.summonerName);
    }
  }
  async insertDataForMatch(matchId: string): Promise<void> {
    const match = await getMatchDetail(matchId);
    if (!(await matchDetailExists(match))) {
      await insertMatchDetail(match);
    }
    const participant = await getParticipantFromMatch(match, this.summoner);
    const participantResult = await insertParticipantResult(
      participant,
      this.summoner
    );
    await insertMatchHistory(participantResult, match, this.summoner);
  }

  async execute(): Promise<boolean> {
    await this.initialiseSummoner();
    const matchId = await fetchLatestUnprocessedMatchId(this.summoner);
    if (!matchId) {
      return false;
    }

    await this.insertDataForMatch(matchId);
    return false;
  }
}
