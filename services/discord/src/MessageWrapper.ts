import { logger } from "./Logger";
import { Message, GuildMember, VoiceChannel } from "discord.js";
import { Logger } from "winston";
export class MessageWrapper {
  public message: Message;
  private logger: Logger;
  public constructor(message: Message) {
    this.message = message;
    this.logger = logger;
  }

  public async getMemberVoiceChannel(): Promise<VoiceChannel | null> {
    const { member } = this.message;
    if (!(member instanceof GuildMember)) {
      this.logger.error("Expected message to be of type message");
      return null;
    }

    const { voice } = member;
    const { channel } = voice;
    if (!(channel instanceof VoiceChannel)) {
      this.message.reply("You must be in a voice channel");
      return null;
    }

    return channel;
  }
}
