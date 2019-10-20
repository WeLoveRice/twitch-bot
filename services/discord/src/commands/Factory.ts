import { JoinVoiceChannel } from "./JoinVoiceChannel";
import { Command } from "./Command";
import { Message, PartialMessage } from "discord.js";

export const createCommand = (
  message: Message | PartialMessage
): Command | null => {
  const { content } = message;
  if (typeof content !== "string") {
    return null;
  }

  if (content.startsWith("^join")) {
    return new JoinVoiceChannel();
  }

  return null;
};
