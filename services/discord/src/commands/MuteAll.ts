import { Message } from "discord.js";
import { getVoiceChannelFromMessage } from "../api/discord/VoiceChannel";
import { AbstractCommand } from "./AbstractCommand";

export class MuteAll extends AbstractCommand {
  private unmute: boolean;

  public constructor(message: Message, mute: boolean) {
    super(message);
    this.unmute = mute;
  }

  async isValid(): Promise<boolean> {
    if (!this.message.member) {
      return false;
    }

    return this.message.member.permissions.has("ADMINISTRATOR");
  }
  protected async run(): Promise<void> {
    const channel = getVoiceChannelFromMessage(this.message);
    channel?.members.forEach(async member => {
      await member.voice.setMute(this.unmute);
    });
  }
}
