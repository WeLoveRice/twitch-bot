import { MessageWrapper } from "./../MessageWrapper";
import { Command } from "./Command";
import { Message } from "discord.js";
import { AbstractCommand } from "./AbstractCommand";

export class JoinVoiceChannel extends AbstractCommand implements Command {
  async execute(message: Message): Promise<void> {
    const wrapper = new MessageWrapper(message);
    const voiceChannel = await wrapper.getMemberVoiceChannel();

    if (voiceChannel === null) {
      return;
    }
    await voiceChannel.join();
    // TODO: Disconnect from the channel if no one is present for > 5mins
  }
}
