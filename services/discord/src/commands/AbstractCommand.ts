import { createLogger } from "./../Logger";
import { Client } from "discord.js";
import { Logger } from "winston";

export abstract class AbstractCommand {
  protected client: Client;
  protected logger: Logger;

  public constructor(client: Client) {
    this.client = client;
    this.logger = createLogger();
  }
}
