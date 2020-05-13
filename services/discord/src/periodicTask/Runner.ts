import { PeriodicTask } from ".";

export class Runner {
  private _timer: NodeJS.Timeout | null;

  constructor() {
    this._timer = null;
  }

  public start(periodicTask: PeriodicTask): void {
    this._timer = setInterval(async () => {
      const shouldStop = await periodicTask.execute();

      if (shouldStop) {
        this.stop();
      }
    }, periodicTask.interval);
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
