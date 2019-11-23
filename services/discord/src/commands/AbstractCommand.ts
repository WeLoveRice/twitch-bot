import { Message } from "discord.js";
import { Logger } from "winston";

export abstract class AbstractCommand {
  protected message: Message;
  protected logger: Logger;

  public constructor(message: Message, logger: Logger) {
    this.message = message;
    this.logger = logger;
  }

  protected abstract isValid(): Promise<boolean>;
  protected abstract run(): Promise<void>;

  public async execute(): Promise<void> {
    const isValid = await this.isValid();
    console.log(`IS valid: ${isValid}`);
    if (!isValid) {
      return;
    }

    return this.run();
  }
}
