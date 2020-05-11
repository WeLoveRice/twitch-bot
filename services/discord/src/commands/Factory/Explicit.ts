import { Command } from "../../enum/CommandEnum";
import { JoinVoiceChannel } from "../JoinVoiceChannel";
import { Message } from "discord.js";
import { AbstractCommand } from "../AbstractCommand";
import { createLogger, Logger } from "winston";

const isCommand = (message: Message): boolean => {
  const { content } = message;
  if (typeof content !== "string" || content === "") {
    return false;
  }

  if (!content.startsWith(Command.PREFIX)) {
    return false;
  }

  // When the message string is just the command prefix
  if (content.length === 1) {
    return false;
  }

  return true;
};

const extractCommandFromContent = ({ content }: Message): string | null => {
  const splitString = content.split(" ");

  return splitString[0].substr(1);
};

export const createExplicitCommand = (
  message: Message,
  logger: Logger
): AbstractCommand | null => {
  if (!isCommand(message)) {
    return null;
  }
  const command = extractCommandFromContent(message);

  switch (command) {
    case Command.JOIN:
      return new JoinVoiceChannel(message, logger);
    default:
      return null;
  }
};
