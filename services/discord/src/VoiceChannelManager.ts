import { VoiceChannelDisconnect } from "./PeriodicTask/VoiceChannelDisconnect";
import { Logger } from "winston";
import { createLogger } from "./Logger";
import { VoiceChannel } from "discord.js";
import { Runner } from "./PeriodicTask/Runner";

export class VoiceChannelManager {
  private logger: Logger;
  private runner: Runner | null;

  public constructor() {
    this.logger = createLogger();
    this.runner = null;
  }

  public async joinChannel(voiceChannel: VoiceChannel): Promise<void> {
    if (this.runner instanceof Runner) {
      this.runner.stop();
    }

    const voiceConnection = await voiceChannel.join();
    if (!voiceConnection) {
      this.logger.error("An error occured when trying to join a voice channel");
    }

    const periodicTask = new VoiceChannelDisconnect(voiceChannel, this.logger);
    this.runner = new Runner(periodicTask);
    this.runner.start();
  }
}
