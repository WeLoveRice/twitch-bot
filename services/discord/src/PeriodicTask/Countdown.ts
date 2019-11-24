import { Message, RichEmbed } from "discord.js";
import { PeriodicTask } from ".";
import moment, { Moment } from "moment";

export class Countdown implements PeriodicTask {
  public readonly interval: number;
  private message: Message;

  private endTime: Moment | null;
  private secondsToCountdown: number;
  private countDownMessage: Message | null;

  constructor(message: Message, secondsToCountdown: number) {
    this.interval = 2 * 1000;
    this.message = message;
    this.endTime = null;
    this.secondsToCountdown = secondsToCountdown;
    this.countDownMessage = null;
  }

  private getRemainingTime(): number | null {
    if (this.endTime === null) {
      return null;
    }
    return this.endTime.diff(moment(), "seconds");
  }

  private createEmbedForRemainingTime(): RichEmbed {
    const remainingTime = this.getRemainingTime();
    const embed = new RichEmbed()
      // Set the title of the field
      .setTitle("A slick little embed")
      // Set the color of the embed
      .setColor(0xff0000)
      // Set the main content of the embed
      .setDescription(remainingTime);

    return embed;
  }

  private async updateCountdownMessage(): Promise<void> {
    const embed = this.createEmbedForRemainingTime();
    if (this.countDownMessage === null) {
      const { channel } = this.message;
      this.countDownMessage = await channel.sendEmbed(embed);
    } else {
      this.countDownMessage = await this.countDownMessage.edit(embed);
    }
  }

  public async execute(): Promise<boolean> {
    if (this.endTime === null) {
      this.endTime = moment().add(this.secondsToCountdown, "seconds");
    }

    console.log(this.endTime);
    const remainingTime = this.getRemainingTime();
    console.log(`Remaining time ${remainingTime}`);
    if (remainingTime === null || remainingTime <= 0) {
      return true;
    }

    this.updateCountdownMessage();
    return false;
  }
}
