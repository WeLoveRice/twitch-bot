import { AbstractCommand } from "./AbstractCommand";

export class CoinFlip extends AbstractCommand {
  async isValid(): Promise<boolean> {
    return true;
  }
  async run(): Promise<void> {
    if (Math.random() >= 0.5) {
      await this.message.reply("You got heads! :regional_indicator_h:");
    } else {
      await this.message.reply("You got tails! :regional_indicator_h:");
    }
    return;
  }
}
