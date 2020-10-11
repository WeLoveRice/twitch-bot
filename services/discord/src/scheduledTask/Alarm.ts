import { Message, MessageEmbed } from "discord.js";
import moment, { Moment } from "moment-timezone";
import { ScheduledTask } from ".";

export class Alarm implements ScheduledTask {
  message: Message;
  scheduledDate: Moment;

  constructor(message: Message, secondsToCountdown: number) {
    this.message = message;
    this.scheduledDate = moment().add(secondsToCountdown, "seconds");
  }

  getTimeUntilExecution(): number {
    const diff = this.scheduledDate.diff(moment(), "seconds");

    return diff > 0 ? diff : 0;
  }

  getFormattedScheduledDate(): string {
    return this.scheduledDate.tz("Europe/London").format("HH:mm:ss");
  }

  createEmbedForRemainingTime(): MessageEmbed {
    const embed = new MessageEmbed();

    embed.setURL("https://github.com/WeLoveRice/twitch-bot");
    embed.setTitle("Check me out on GitHub!");
    embed.setDescription("An alarm because people can't keep track of time");
    embed.addField("Alarm will ring at: ", this.getFormattedScheduledDate());
    embed.setColor(0xa8ffa8);

    return embed;
  }

  async sendAlarmMessage(): Promise<void> {
    await this.message.reply("Time up yo");
  }

  async start(): Promise<void> {
    const embed = this.createEmbedForRemainingTime();
    await this.message.reply(embed);
    setTimeout(this.sendAlarmMessage, this.getTimeUntilExecution() * 1000);
  }
}
