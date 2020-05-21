import { Command } from "../../enum/CommandEnum";
import { JoinVoiceChannel } from "../JoinVoiceChannel";
import { Message } from "discord.js";
import { AbstractCommand } from "../AbstractCommand";
import { SoundList } from "../../commands/SoundList";
import { CoinFlip } from "../../commands/CoinFlip";

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
  message: Message
): AbstractCommand | null => {
  if (!isCommand(message)) {
    return null;
  }
  const command = extractCommandFromContent(message);

  switch (command) {
    case Command.JOIN:
      return new JoinVoiceChannel(message);
    case Command.SOUNDS:
      return new SoundList(message);
    case Command.COINFLIP:
      return new CoinFlip(message);
    default:
      return null;
  }
};
