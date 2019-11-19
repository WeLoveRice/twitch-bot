import { JoinVoiceChannel } from "./JoinVoiceChannel";
import { Message, Client } from "discord.js";
import { AbstractCommand } from "./AbstractCommand";

export const createCommand = (
  client: Client,
  message: Message
): AbstractCommand | null => {
  const { content } = message;
  if (typeof content !== "string") {
    return null;
  }

  if (content.startsWith("^join")) {
    return new JoinVoiceChannel(client, message);
  }

  return null;
};
