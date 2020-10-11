import { getVoiceChannelFromMessage } from "../api/discord/VoiceChannel";
import { AbstractCommand } from "./AbstractCommand";

export class UnmuteAll extends AbstractCommand {
  async isValid(): Promise<boolean> {
    return true;
  }

  protected async run(): Promise<void> {
    const channel = getVoiceChannelFromMessage(this.message);
    channel?.members.forEach(async member => {
      await member.voice.setMute(false);
    });
  }
}
