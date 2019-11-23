import { Message } from "discord.js";
import { AbstractCommand } from "../AbstractCommand";
import { Timer } from "../Timer";
import { Logger } from "winston";

const isTimer = ({ content }: Message): boolean => {
  const regex = /(\d{1,2}\s?(sec|min))/;
  return regex.test(content);
};

export const createImplicitCommand = (
  message: Message,
  logger: Logger
): AbstractCommand | null => {
  if (isTimer(message)) {
    return new Timer(message, logger);
  }
  return null;
};
