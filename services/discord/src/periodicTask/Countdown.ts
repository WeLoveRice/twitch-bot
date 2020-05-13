import { Message, MessageEmbed } from "discord.js";
import { PeriodicTask } from ".";
import moment, { Moment } from "moment";

export class Countdown implements PeriodicTask {
  interval = 2000;
  message: Message;

  endTime: Moment;
  private secondsToCountdown: number;
  private countDownMessage: Message | null;

  constructor(message: Message, secondsToCountdown: number) {
    this.message = message;
    this.endTime = moment().add(secondsToCountdown, "seconds");
    this.secondsToCountdown = secondsToCountdown;
    this.countDownMessage = null;
  }

  getRemainingTime(): number {
    return this.endTime.diff(moment(), "seconds");
  }

  getFormattedRemainingTime(): string {
    const remainingTime = this.getRemainingTime();

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return `${minutes}m ${seconds == 0 ? "00" : seconds}s`;
  }

  createEmbedForRemainingTime(): MessageEmbed {
    const embed = new MessageEmbed();

    embed.setTitle("Countdown timer");
    embed.setColor(0xa8ffa8);
    embed.setDescription(`Remaining time: ${this.getFormattedRemainingTime()}`);

    return embed;
  }

  async updateCountdownMessage(): Promise<void> {
    const embed = this.createEmbedForRemainingTime();
    if (this.countDownMessage === null) {
      const { channel } = this.message;
      this.countDownMessage = await channel.send(embed);
    } else {
      this.countDownMessage = await this.countDownMessage.edit(embed);
    }
  }

  async execute(): Promise<boolean> {
    const remainingTime = this.getRemainingTime();
    if (remainingTime === null) {
      return true;
    }

    if (remainingTime <= 0) {
      this.updateCountdownMessage();
      return true;
    }

    this.updateCountdownMessage();
    return false;
  }
}
