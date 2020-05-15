import { Bot } from "./../enum/Bot";
import { GuildMember, VoiceChannel, Message } from "discord.js";
import { AbstractCommand } from "./AbstractCommand";
import { VoiceChannelManager } from "../VoiceChannelManager";

export const isMemberInVoiceChannel = async (
  message: Message
): Promise<boolean> => {
  if (!message.member) {
    return false;
  }

  const { channel } = message.member.voice;
  if (!(channel instanceof VoiceChannel)) {
    await message.reply("You must be in a voice channel for me to join");
    return false;
  }

  return true;
};

export class JoinVoiceChannel extends AbstractCommand {
  public getVoiceChannelFromMessage(): VoiceChannel {
    if (!this.message.member?.voice?.channel) {
      throw new ReferenceError(
        "member or voice does does not exist on message"
      );
    }

    return this.message.member.voice.channel;
  }

  public async isValid(): Promise<boolean> {
    return isMemberInVoiceChannel(this.message);
  }

  protected async run(): Promise<void> {
    try {
      const channel = this.getVoiceChannelFromMessage();

      if (channel.members.has(Bot.USER_ID)) {
        this.message.reply("Already in channel");
        return;
      }

      const voiceChannelManager = new VoiceChannelManager(this.logger);
      voiceChannelManager.joinChannel(channel);
    } catch (e) {
      this.logger.error(
        `Something went wrong when trying to join a voice channel: ${e}`
      );
    }
  }
}
