import { PeriodicTask } from ".";

export class Runner {
  private periodicTask: PeriodicTask;
  private _timer: NodeJS.Timeout | null;

  constructor(periodicTask: PeriodicTask) {
    this.periodicTask = periodicTask;
    this._timer = null;
  }

  public start(): void {
    this._timer = setInterval(async () => {
      const shouldStop = await this.periodicTask.execute();

      if (shouldStop) {
        this.stop();
      }
    }, this.periodicTask.interval);
  }

  public stop(): void {
    if (this._timer !== null) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  public get timer(): NodeJS.Timeout | null {
    return this._timer;
  }
}
