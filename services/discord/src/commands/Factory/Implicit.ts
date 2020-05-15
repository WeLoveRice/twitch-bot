import { Message } from "discord.js";
import { Logger } from "winston";
import { Timer } from "../Timer";
import { AbstractCommand } from "../AbstractCommand";
import { Sound } from "../Sound";
import path from "path";
import fs from "mz/fs";

export const isTimer = ({ content }: Message): boolean => {
  const regex = /(\d{1,2}\s?(sec|min))/;
  return regex.test(content);
};

export const doesSoundExist = async ({
  content
}: Message): Promise<boolean> => {
  try {
    const file = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "sounds",
      `${content}.mp3`
    );
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
};

export const createImplicitCommand = async (
  message: Message,
  logger: Logger
): Promise<AbstractCommand | null> => {
  if (isTimer(message)) {
    return new Timer(message, logger);
  }

  if (await doesSoundExist(message)) {
    return new Sound(message, logger);
  }

  return null;
};
