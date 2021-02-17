import { AbstractCommand } from "../AbstractCommand";
import {
  isMemberInVoiceChannel,
  getVoiceChannelFromMessage
} from "../../api/discord/VoiceChannel";
import { VoiceChannelManager } from "../../api/discord/VoiceChannelManager";

export class JoinVoiceChannel extends AbstractCommand {
  public async isValid(): Promise<boolean> {
    return isMemberInVoiceChannel(this.message);
  }

  protected async run(): Promise<void> {
    try {
      const channel = getVoiceChannelFromMessage(this.message);
      if (!channel) {
        await this.message.reply(
          "You must be in a voice channel for me to join"
        );
        return;
      }

      const voiceChannelManager = new VoiceChannelManager();
      await voiceChannelManager.joinChannel(channel);
    } catch (e) {
      this.logger.error(
        `Something went wrong when trying to join a voice channel: ${e}`
      );
    }
  }
}
