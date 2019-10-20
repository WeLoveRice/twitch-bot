import { Logger } from "winston";
import { logger } from "../Logger";
export abstract class AbstractCommand {
  protected logger: Logger;

  public constructor() {
    this.logger = logger;
  }
}
