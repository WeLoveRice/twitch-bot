import { JoinVoiceChannel } from "./JoinVoiceChannel";
import { Message } from "discord.js";
import { AbstractCommand } from "./AbstractCommand";

export const createCommand = (message: Message): AbstractCommand | null => {
  const { content } = message;
  if (typeof content !== "string") {
    return null;
  }

  if (content.startsWith("^join")) {
    return new JoinVoiceChannel(message);
  }

  return null;
};
