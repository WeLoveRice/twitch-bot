import { Logger } from "winston";
import { PeriodicTask } from ".";
import { VoiceChannel } from "discord.js";
import { Bot } from "../enum/Bot";

export class VoiceChannelDisconnect implements PeriodicTask {
  public readonly interval: number;
  private voiceChannel: VoiceChannel;
  private logger: Logger;

  public constructor(voiceChannel: VoiceChannel, logger: Logger) {
    this.voiceChannel = voiceChannel;
    this.logger = logger;
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
