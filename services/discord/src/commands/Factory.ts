import { JoinVoiceChannel } from "./JoinVoiceChannel";
import { Command } from "./Command";
import { Message, PartialMessage, Client } from "discord.js";

export const createCommand = (
  client: Client,
  message: Message | PartialMessage
): Command | null => {
  const { content } = message;
  if (typeof content !== "string") {
    return null;
  }

  if (content.startsWith("^join")) {
    return new JoinVoiceChannel(client);
  }

  return null;
};
