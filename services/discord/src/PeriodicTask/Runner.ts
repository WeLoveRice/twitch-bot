import { PeriodicTask } from ".";

export class Runner {
  private periodicTask: PeriodicTask;
  private timer: NodeJS.Timeout | null;

  constructor(periodicTask: PeriodicTask) {
    this.periodicTask = periodicTask;
    this.timer = null;
  }

  public start(): void {
    this.timer = setInterval(async () => {
      const shouldStop = await this.periodicTask.execute();
      if (shouldStop) {
        this.stop();
      }
    }, this.periodicTask.interval);
  }

  public stop(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
