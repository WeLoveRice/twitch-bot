import { PeriodicTask } from ".";
import { TftSummoner } from "../../models/TftSummoner";

export class TftMatchFetcher implements PeriodicTask {
  summonerName: string;
  interval = 30 * 1000;
  public constructor(summonerName: string) {
    this.summonerName = summonerName;
  }

  async execute(): Promise<boolean> {
    const summoner = await TftSummoner.findOne({
      where: { name: this.summonerName }
    });

    if (!summoner) {
      throw new Error(`Cannot find summoner by name ${this.summonerName}`);
    }

    return false;
  }
}
