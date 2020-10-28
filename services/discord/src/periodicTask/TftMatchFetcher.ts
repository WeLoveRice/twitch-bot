import { PeriodicTask } from ".";

export class TftMatchFetcher implements PeriodicTask {
  interval = 10 * 1000;
  execute(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
