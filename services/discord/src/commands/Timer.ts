import { Countdown } from "./../PeriodicTask/Countdown";
import { Runner } from "../periodicTask/Runner";
import { Command } from "./Command";
import { Message } from "discord.js";
import { Logger } from "winston";

export class Timer implements Command {
  private message: Message;
  private logger: Logger;
  private runner: Runner;

  public constructor(message: Message, logger: Logger, runner = new Runner()) {
    this.message = message;
    this.logger = logger;
    this.runner = runner;
  }

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

  public async isValid(): Promise<boolean> {
    const secondsToRun = this.parseSecondsToRun();
    if (secondsToRun === null) {
      return false;
    }

    return secondsToRun <= 3600;
  }

  public async execute(): Promise<boolean> {
    const secondsToRun = this.parseSecondsToRun();
    if (secondsToRun === null) {
      return false;
    }
    const countdown = new Countdown(this.message, secondsToRun);
    this.runner.start(countdown);
    this.logger.info(`Countdown started for ${secondsToRun} seconds`);

    return true;
  }
}
