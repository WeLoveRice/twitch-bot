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
    if (this.message.member?.permissions.has("ADMINISTRATOR")) {
      return true;
    }

    if (!this.message.member?.permissions.has("ADMINISTRATOR")) {
      await this.message.reply(
        "You must have adminstrator permissions to use this command"
      );
    }

    return false;
  }
  protected async run(): Promise<void> {
    const channel = getVoiceChannelFromMessage(this.message);
    if (!channel) {
      return;
    }

    const promises = channel.members.map(member => {
      return member.voice.setMute(this.unmute);
    });
    await Promise.all(promises);
  }
}
