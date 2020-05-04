import { Message } from "discord.js";
import { Logger } from "winston";
import { Timer } from "../Timer";
import { AbstractCommand } from "../AbstractCommand";

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
