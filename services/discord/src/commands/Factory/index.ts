import { createImplicitCommand } from "./Implicit";
import { createExplicitCommand } from "./Explicit";
import { Command } from "./../../enum/Command";
import { Message } from "discord.js";
import { AbstractCommand } from "../AbstractCommand";
import { Logger } from "winston";

export const createCommand = (
  message: Message,
  logger: Logger
): AbstractCommand | null => {
  const { content } = message;

  if (content.startsWith(Command.PREFIX)) {
    return createExplicitCommand(message, logger);
  }

  return createImplicitCommand(message, logger);
};
