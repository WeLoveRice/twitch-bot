import { Message } from "discord.js";
import { Logger } from "winston";

export abstract class AbstractCommand {
  protected message: Message;
  protected logger: Logger;

  public constructor(message: Message, logger: Logger) {
    this.message = message;
    this.logger = logger;
  }

  protected abstract validate(): Promise<boolean>;
  protected abstract run(): Promise<boolean>;

  public async execute(): Promise<boolean> {
    const isValid = await this.validate();
    if (!isValid) {
      return false;
    }

    return this.run();
  }
}
