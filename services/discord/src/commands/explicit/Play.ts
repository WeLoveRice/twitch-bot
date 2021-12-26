import { AbstractCommand } from "../AbstractCommand";
import ytdl from "ytdl-core";

export class Play extends AbstractCommand {
  async isValid(): Promise<boolean> {
    return true;
  }
  async run(): Promise<void> {
    console.log(this.message.content);
    return;
  }
}
