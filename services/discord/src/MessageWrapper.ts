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
