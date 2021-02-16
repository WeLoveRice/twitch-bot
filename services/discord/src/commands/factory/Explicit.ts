import { Command } from "../../enum/CommandEnum";
import { JoinVoiceChannel } from "../JoinVoiceChannel";
import { Message } from "discord.js";
import { AbstractCommand } from "../AbstractCommand";
import { SoundList } from "../../commands/explicit/SoundList";
import { CoinFlip } from "../../commands/explicit/CoinFlip";
import { MuteAll } from "../../commands/explicit/MuteAll";
import path from "path";
import fs from "mz/fs";

const isCommand = (message: Message): boolean => {
  const { content } = message;

  if (!content.startsWith(Command.PREFIX)) {
    return false;
  }

  return content.length > 1;
};

const findCommandInDir = async (
  message: Message
): Promise<AbstractCommand | null> => {
  const explicitDir = path.join(__dirname, "..", "explicit");
  const files = await fs.readdir(explicitDir);
  // Need to somehow initalise the class given the command string
  const match = files.filter(
    file => file.replace(".ts", "").toLowerCase() === message.content.substr(1)
  );
  console.log(match[0]);
  if (match.length > 0) {
    const imports = await import(`../explicit/${match[0]}`);
    const command = Object.keys(imports)[0];
    return new imports[command](message);
  }

  return null;
};

export const createExplicitCommand = async (
  message: Message
): Promise<AbstractCommand | null> => {
  if (!isCommand(message)) {
    return null;
  }
  const { content } = message;
  const command = content.substr(1);

  switch (command) {
    case Command.MUTEALL:
      return new MuteAll(message, true);
    case Command.UNMUTEALL:
      return new MuteAll(message, false);
    default:
      return findCommandInDir(message);
  }
};
