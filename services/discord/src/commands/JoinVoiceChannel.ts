import { GuildMember, VoiceChannel } from "discord.js";
import { AbstractCommand } from "./AbstractCommand";
import { VoiceChannelManager } from "../VoiceChannelManager";

export class JoinVoiceChannel extends AbstractCommand {
  private getVoiceChannelFromMessage(): VoiceChannel {
    const { member } = this.message;
    const { voiceChannel } = member;
    return voiceChannel;
  }

  protected async validate(): Promise<boolean> {
    const { member } = this.message;
    if (!(member instanceof GuildMember)) {
      this.logger.error("Expected member of message to be of type GuildMember");
      return false;
    }

    const { voiceChannel } = member;
    if (!(voiceChannel instanceof VoiceChannel)) {
      await this.message.reply("You must be in a voice channel for me to join");
      return false;
    }

    return true;
  }

  protected async run(): Promise<void> {
    try {
      const voiceChannel = this.getVoiceChannelFromMessage();
      const voiceChannelManager = new VoiceChannelManager();
      voiceChannelManager.joinChannel(voiceChannel);
    } catch (e) {
      this.logger.error(
        `Something went wrong when trying to join a voice channel: ${e}`
      );
    }
  }
}
