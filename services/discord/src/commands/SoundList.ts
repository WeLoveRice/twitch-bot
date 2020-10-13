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
      .filter(file => {
        return file.endsWith(".mp3");
      })
      .map((file, index) => {
        const fileName = file.match(/(.*?).mp3/)?.[1];
        return `${index + 1}. ${fileName}`;
      });

    await this.message.reply(`\n ${soundsFormatted.join("\n")}`);
  }
}
