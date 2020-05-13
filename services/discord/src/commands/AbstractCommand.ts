import { Message } from "discord.js";
import { Logger } from "winston";

export abstract class AbstractCommand {
  protected message: Message;
  protected logger: Logger;

  public constructor(message: Message, logger: Logger) {
    this.message = message;
    this.logger = logger;
  }

  public abstract isValid(): Promise<boolean>;
  protected abstract run(): Promise<void>;

  public async execute(): Promise<void> {
    if (!(await this.isValid())) {
      return;
    }

    await this.run();
  }
}
