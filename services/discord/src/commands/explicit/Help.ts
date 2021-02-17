import { Command } from "../../enum/CommandEnum";
import { AbstractCommand } from "../AbstractCommand";

export class Help extends AbstractCommand {
  public async isValid(): Promise<boolean> {
    return true;
  }
  protected async run(): Promise<void> {
    const formattedList = Object.values(Command)
      .filter(value => value != Command.PREFIX)
      .map((value, index) => `${index + 1}. ${Command.PREFIX}${value}`)
      .join("\n");

    await this.message.reply(`\n${formattedList}`);
  }
}
