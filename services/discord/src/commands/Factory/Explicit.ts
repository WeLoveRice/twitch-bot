import { Command } from "../../enum/CommandEnum";
import { JoinVoiceChannel } from "../JoinVoiceChannel";
import { Message } from "discord.js";
import { AbstractCommand } from "../AbstractCommand";
import { Logger } from "winston";
import { SoundList } from "../../commands/SoundList";

const isCommand = (message: Message): boolean => {
  const { content } = message;
  if (!content.startsWith(Command.PREFIX)) {
    return false;
  }

  return content.length > 1;
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
    case Command.SOUNDS:
      return new SoundList(message, logger);
    default:
      return null;
  }
};
