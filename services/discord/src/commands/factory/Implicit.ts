import { Message } from "discord.js";
import { Timer } from "../Timer";
import { AbstractCommand } from "../AbstractCommand";
import { Sound, doesSoundExist } from "../Sound";

export const isTimer = ({ content }: Message): boolean => {
  const regex = /(\d{1,2}\s?(sec|min))/;
  return regex.test(content);
};

export const createImplicitCommand = async (
  message: Message
): Promise<AbstractCommand | null> => {
  if (isTimer(message)) {
    return new Timer(message);
  }

  if (await doesSoundExist(message)) {
    return new Sound(message);
  }

  return null;
};
