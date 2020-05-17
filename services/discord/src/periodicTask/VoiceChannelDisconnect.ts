import { Logger } from "winston";
import { PeriodicTask } from ".";
import { VoiceChannel } from "discord.js";
import { Bot } from "../enum/Bot";
import { createLogger } from "../Logger";

export class VoiceChannelDisconnect implements PeriodicTask {
  public readonly interval: number;
  voiceChannel: VoiceChannel;
  logger: Logger;

  public constructor(voiceChannel: VoiceChannel) {
    this.voiceChannel = voiceChannel;
    this.logger = createLogger();
    this.interval = 60 * 1000;
  }

  public async execute(): Promise<boolean> {
    const { members } = this.voiceChannel;
    // Disconnect from the channel if no one is present for > 5mins
    if (!members.has(Bot.USER_ID)) {
      this.logger.warn("Bot no longer in channel");
      return true;
    }

    if (members.size === 1) {
      this.logger.info("No one left in channel, now disconnecting.");
      this.voiceChannel.leave();
      return true;
    }

    return false;
  }
}
