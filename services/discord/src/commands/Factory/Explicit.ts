import { Command } from "../../enum/CommandEnum";
import { JoinVoiceChannel } from "../JoinVoiceChannel";
import { Message } from "discord.js";
import { AbstractCommand } from "../AbstractCommand";
import { SoundList } from "../../commands/SoundList";
import { CoinFlip } from "../../commands/CoinFlip";
import { MuteAll } from "../../commands/MuteAll";
import { UnmuteAll } from "../../commands/UnmuteAll";

const isCommand = (message: Message): boolean => {
  const { content } = message;

  if (!content.startsWith(Command.PREFIX)) {
    return false;
  }

  return content.length > 1;
};

const extractCommandFromContent = ({ content }: Message): string | null => {
  return content.substr(1);
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
    case Command.MUTEALL:
      return new MuteAll(message);
    case Command.UNMUTEALL:
      return new UnmuteAll(message);
    default:
      return null;
  }
};
