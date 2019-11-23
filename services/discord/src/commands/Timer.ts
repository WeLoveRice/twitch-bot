import { Countdown } from "./../PeriodicTask/Countdown";
import { AbstractCommand } from "./AbstractCommand";
import { Runner } from "../periodicTask/Runner";

export class Timer extends AbstractCommand {
  private parseSecondsToRun(): number | null {
    const { content } = this.message;
    const results = content.match(/\d+/);
    if (results === null) {
      return null;
    }

    const number = parseInt(results[0]);
    if (content.includes("min")) {
      return number * 60;
    }

    if (content.includes("sec")) {
      return number;
    }

    return null;
  }

  protected async isValid(): Promise<boolean> {
    const secondsToRun = this.parseSecondsToRun();
    console.log(`Seconds to run: ${secondsToRun}`);
    if (secondsToRun === null) {
      return false;
    }

    return secondsToRun <= 3600;
  }

  protected async run(): Promise<void> {
    const secondsToRun = this.parseSecondsToRun();
    if (secondsToRun === null) {
      return;
    }
    const countdown = new Countdown(this.message, secondsToRun);
    const runner = new Runner(countdown);
    runner.start();
  }
}
