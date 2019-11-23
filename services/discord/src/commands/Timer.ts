import { AbstractCommand } from "./AbstractCommand";
import { Message } from "discord.js";

export class Timer extends AbstractCommand {
  private parseSecondsToRun(): number | null {
    const { content } = this.message;
    const results = content.match(/\d+/);
    if (results === null) {
      return null;
    }

    const number = parseInt(results[0]);
    if (number >= 60) {
      return null;
    }

    if (content.includes("min")) {
      return number * 60;
    }

    if (content.includes("sec")) {
      return number;
    }

    return null;
  }

  protected validate(): Promise<boolean> {
    this.message;
    throw new Error("Method not implemented.");
  }

  protected run(): Promise<void> {
    const secondsToRun = this.parseSecondsToRun();
    throw new Error("Method not implemented.");
  }
}
