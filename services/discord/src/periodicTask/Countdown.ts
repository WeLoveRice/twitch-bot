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
    const diff = this.endTime.diff(moment(), "seconds");

    return diff > 0 ? diff : 0;
  }

  getFormattedRemainingTime(): string {
    const remainingTime = this.getRemainingTime();

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return `${minutes}m ${seconds == 0 ? "00" : seconds}s`;
  }

  createEmbedForRemainingTime(): MessageEmbed {
    const embed = new MessageEmbed();

    embed.setURL("https://github.com/ColinCee/twitch-bot");
    embed.setTitle("Check me out on GitHub!");
    embed.setDescription("A countdown because people can't keep track of time");
    embed.addField("Remaining time", this.getFormattedRemainingTime());
    embed.setColor(0xa8ffa8);

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

  async sendFinalMessage(): Promise<void> {
    await this.updateCountdownMessage();
    await this.message.reply("Time up yo");
    return;
  }

  async execute(): Promise<boolean> {
    const remainingTime = this.getRemainingTime();
    if (remainingTime === null) {
      return true;
    }

    if (remainingTime <= 0) {
      await this.sendFinalMessage();
      return true;
    }

    await this.updateCountdownMessage();
    return false;
  }
}
