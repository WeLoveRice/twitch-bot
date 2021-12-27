import { AbstractCommand } from "../AbstractCommand";
import {
  isMemberInVoiceChannel,
  joinVoiceChannel
} from "../../api/discord/VoiceChannel";
import { VoiceConnection } from "discord.js";
import { downloadVideo } from "../../api/youtubeDl";
export class Play extends AbstractCommand {
  async isValid(): Promise<boolean> {
    if (!(await isMemberInVoiceChannel(this.message))) {
      await this.message.reply("You must be in a voice channel to play music");
      return false;
    }
    // if url is invalid reply and return false
    const url = this.message.content.split(" ")[1];
    if (!url.startsWith("https://www.youtube.com/watch?v=")) {
      await this.message.reply(
        "Url should start with https://www.youtube.com/watch?v="
      );
      return false;
    }

    return true;
  }
  async run(): Promise<void> {
    const url = this.message.content.split(" ")[1];
    try {
      const videoPath = await downloadVideo(url, this.message);
      const voiceConnection = await this.getVoiceConnection();
      await voiceConnection?.play(videoPath);
    } catch (e) {
      await this.message.reply("Error downloading video " + e);
      return;
    }
  }

  private async getVoiceConnection(): Promise<VoiceConnection | undefined> {
    const voiceConnection = await joinVoiceChannel(this.message);
    if (!voiceConnection) {
      await this.message.reply("Error getting voice connection");
      return;
    }

    return voiceConnection;
  }
}
