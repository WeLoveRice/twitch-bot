import { Message, GuildMember, VoiceChannel } from "discord.js";
import { Logger } from "winston";
import { createLogger } from "./Logger";
export class MessageWrapper {
  public message: Message;
  private logger: Logger;
  public constructor(message: Message) {
    this.message = message;
    this.logger = createLogger();
  }

  public async getMemberVoiceChannel(): Promise<VoiceChannel | null> {
    const { member } = this.message;
    if (!(member instanceof GuildMember)) {
      this.logger.error("Expected member of message to be of type GuildMember");
      return null;
    }

    const { voiceChannel } = member;
    if (!(voiceChannel instanceof VoiceChannel)) {
      await this.message.reply("You must be in a voice channel for me to join");
      return null;
    }

    return voiceChannel;
  }
}
