import { createImplicitCommand } from "./Implicit";
import { createExplicitCommand } from "./Explicit";
import { Command } from "../../enum/CommandEnum";
import { Message } from "discord.js";
import { AbstractCommand } from "../AbstractCommand";
import { Logger } from "winston";

export const createCommand = async (
  message: Message
): Promise<AbstractCommand | null> => {
  const { content } = message;

  if (content.startsWith(Command.PREFIX)) {
    return createExplicitCommand(message);
  }
  return createImplicitCommand(message);
};
