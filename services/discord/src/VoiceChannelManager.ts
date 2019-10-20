import { Logger } from 'winston';
import { createLogger } from './Logger';
import { VoiceChannel } from "discord.js";

export class VoiceChannelManager {
  private logger: Logger;
  private INTERVAL_DURATION = 1 * 60 * 1000;
  public constructor () {
    this.logger = createLogger()
  }

   public async joinChannel(voiceChannel: VoiceChannel): Promise<void> {
    await voiceChannel.join();
    this.disconnectInterval(voiceChannel)
  }

  private async disconnectInterval(voiceChannel: VoiceChannel) {
    // Disconnect from the channel if no one is present for > 5mins
    const interval = await setInterval(async () => {
      const { members } = voiceChannel;

      // Bot is no longer in the channel
      if (!members.has('635470284127862795')) {
        this.logger.warning('Bot no longer in channel, clearing interval.')
        clearInterval(interval);
      }
      // Bot is the only one in channel
      if (members.size === 1) {
        this.logger.info('No one left in channel, now disconnecting.')
        await voiceChannel.leave();
        clearInterval(interval);
      }
    }, this.INTERVAL_DURATION);
  }
}
