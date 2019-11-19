import { createLogger } from "./../Logger";
import { Client, Message } from "discord.js";
import { Logger } from "winston";

export abstract class AbstractCommand {
  protected client: Client;
  protected message: Message;
  protected logger: Logger;

  public constructor(client: Client, message: Message) {
    this.client = client;
    this.message = message;
    this.logger = createLogger();
  }

  protected abstract validate(): Promise<boolean>;
  protected abstract run(): Promise<void>;

  public async execute(): Promise<void> {
    const isValid = await this.validate();
    if (!isValid) {
      return;
    }

    await this.run();
  }
}
