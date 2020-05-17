import { AbstractCommand } from "./AbstractCommand";
import path from "path";
import fs from "mz/fs";

export class SoundList extends AbstractCommand {
  public async isValid(): Promise<boolean> {
    return true;
  }

  protected async run(): Promise<void> {
    const soundDir = path.join(__dirname, "..", "..", "sounds");
    const files = await fs.readdir(soundDir);

    const soundsFormatted = files
      .map(file => {
        return file.match(/(.*?).mp3/)?.[1];
      })
      .map((name, index) => {
        return `${index + 1}. ${name}`;
      });

    await this.message.reply(`\n ${soundsFormatted.join("\n")}`);
  }
}
