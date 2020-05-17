import { Message } from "discord.js";
import { Logger } from "winston";
import { createLogger } from "../Logger";

export abstract class AbstractCommand {
  protected message: Message;
  protected logger: Logger;

  public constructor(message: Message) {
    this.message = message;
    this.logger = createLogger();
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
