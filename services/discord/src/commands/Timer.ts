import { Countdown } from "../periodicTask/Countdown";
import { Runner } from "../periodicTask/Runner";
import { Message } from "discord.js";
import { AbstractCommand } from "./AbstractCommand";
import { redis } from "../api/redis";
import { promisify } from "util";

export class Timer extends AbstractCommand {
  private runner: Runner;

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

    const getAsync = promisify(redis.get).bind(redis);
    if (await getAsync(this.message.author.id)) {
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

    const countdown = new Countdown(this.message, secondsToRun);
    this.runner.start(countdown);
    this.logger.info(`Countdown started for ${secondsToRun} seconds`);
    redis.SETEX(this.message.author.id, secondsToRun, "true");

    return;
  }
}
