import { Message } from "discord.js";
import { AbstractCommand } from "../AbstractCommand";
import { Timer } from "../Timer";
import { Logger } from "winston";

const isTimer = ({ content }: Message): boolean => {
  const regex = new RegExp("(d{1,2}\\ ?(sec|min))");
  return regex.test(content);
};

export const createImplicitCommand = (
  message: Message,
  logger: Logger
): AbstractCommand | null => {
  console.log(isTimer(message));
  if (isTimer(message)) {
    return new Timer(message, logger);
  }
  return null;
};
