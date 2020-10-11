import { Alarm } from "../scheduledTask/Alarm";
import { Runner } from "../periodicTask/Runner";
import { Message } from "discord.js";
import { AbstractCommand } from "./AbstractCommand";
import { redis } from "../api/redis";

export class Timer extends AbstractCommand {
  runner: Runner;

  public constructor(message: Message) {
    super(message);
    this.runner = new Runner();
  }

  public parseSecondsToRun(): number | null {
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

  public async isValid(): Promise<boolean> {
    if (this.message.author.bot) {
      return false;
    }

    if (await redis.get(this.message.author.id)) {
      return false;
    }

    const secondsToRun = this.parseSecondsToRun();
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

    const alarm = new Alarm(this.message, secondsToRun);
    await alarm.start();
    this.logger.info(`Countdown started for ${secondsToRun} seconds`);
    await redis.setex(this.message.author.id, secondsToRun, "true");
  }
}
