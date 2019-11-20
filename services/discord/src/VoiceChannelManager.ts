import { Logger } from "winston";
import { createLogger } from "./Logger";
import { VoiceChannel } from "discord.js";
import { Bot } from "./enum/Bot";

export class VoiceChannelManager {
  private logger: Logger;
  private INTERVAL_DURATION = 1 * 60 * 1000;
  private interval: NodeJS.Timeout | null;

  public constructor() {
    this.logger = createLogger();
    this.interval = null;
  }

  public async joinChannel(voiceChannel: VoiceChannel): Promise<void> {
    this.clearLeaveTimer();
    await voiceChannel.join();
    await this.startLeaveTimer(voiceChannel);
  }

  private shouldBotLeaveChannel({ members }: VoiceChannel): boolean {
    if (members.size === 1) {
      this.logger.info("No one left in channel, now disconnecting.");
      return true;
    }

    return false;
  }
  private async startLeaveTimer(voiceChannel: VoiceChannel): Promise<void> {
    const { members } = voiceChannel;
    // Disconnect from the channel if no one is present for > 5mins
    this.interval = await setInterval(async () => {
      if (!members.has(Bot.USER_ID)) {
        this.logger.warning("Bot no longer in channel, clearing interval.");
        this.clearLeaveTimer();
        return;
      }

      if (this.shouldBotLeaveChannel(voiceChannel)) {
        voiceChannel.leave();
        this.clearLeaveTimer();
        return;
      }
    }, this.INTERVAL_DURATION);
  }

  private clearLeaveTimer(): void {
    if (this.interval === null) {
      return;
    }
    clearInterval(this.interval);
    this.interval = null;
  }
}
