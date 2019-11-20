import { JoinVoiceChannel } from "./JoinVoiceChannel";
import { Message } from "discord.js";
import { AbstractCommand } from "./AbstractCommand";
import { createLogger } from "winston";

export const createCommand = (message: Message): AbstractCommand | null => {
  const { content } = message;
  if (typeof content !== "string") {
    return null;
  }

  const logger = createLogger();
  if (content.startsWith("^join")) {
    return new JoinVoiceChannel(message, logger);
  }

  return null;
};
