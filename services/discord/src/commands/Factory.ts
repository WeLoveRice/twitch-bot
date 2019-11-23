import { Command } from "./../enum/Command";
import { JoinVoiceChannel } from "./JoinVoiceChannel";
import { Message } from "discord.js";
import { AbstractCommand } from "./AbstractCommand";
import { createLogger } from "winston";

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

const extractCommandFromContent = ({ content }: Message): string => {
  const splitString = content.split(" ");
  if (splitString.length === 0) {
    throw Error(`Expected to be able to split the string: ${splitString}`);
  }

  const command = splitString[0];
  if (command.charAt(0) === Command.PREFIX) {
    return command.substr(1);
  }

  return command;
};

export const createCommand = (message: Message): AbstractCommand | null => {
  if (!isCommand(message)) {
    return null;
  }

  const logger = createLogger();
  const command = extractCommandFromContent(message);

  switch (command) {
    case Command.JOIN:
      return new JoinVoiceChannel(message, logger);
    default:
      return null;
  }
};
