import { MessageWrapper } from "./../MessageWrapper";
import { Command } from "./Command";
import { Message } from "discord.js";
import { AbstractCommand } from "./AbstractCommand";
import { VoiceChannelManager } from "../VoiceChannelManager";

export class JoinVoiceChannel extends AbstractCommand implements Command {
  async execute(message: Message): Promise<void> {
    const wrapper = new MessageWrapper(message);
    const voiceChannel = await wrapper.getMemberVoiceChannel();

    if (voiceChannel === null) {
      return;
    }

    const voiceChannelManager = new VoiceChannelManager();
    voiceChannelManager.joinChannel(voiceChannel);
  }
}
