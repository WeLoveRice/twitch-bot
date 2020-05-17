import { Message, Speaking, VoiceConnection } from "discord.js";
import { AbstractCommand } from "./AbstractCommand";
import path from "path";
import fs from "mz/fs";
import {
  isMemberInVoiceChannel,
  getBotVoiceConnection,
  joinVoiceChannel
} from "../api/discord/VoiceChannel";

export const getSoundPath = (content: string): string => {
  return path.join(__dirname, "..", "..", "sounds", `${content}.mp3`);
};

export const doesSoundExist = async ({
  content
}: Message): Promise<boolean> => {
  try {
    await fs.access(getSoundPath(content));
    return true;
  } catch {
    return false;
  }
};

export class Sound extends AbstractCommand {
  public async isValid(): Promise<boolean> {
    if (!(await isMemberInVoiceChannel(this.message))) {
      await this.message.reply(
        "You must be in a voice channel to play a sound"
      );
      return false;
    }

    return doesSoundExist(this.message);
  }

  async playSound(voiceConnection: VoiceConnection): Promise<void> {
    const file = getSoundPath(this.message.content);
    voiceConnection.play(file);
  }

  protected async run(): Promise<void> {
    const voiceConnection = await joinVoiceChannel(this.message);
    if (!voiceConnection) {
      return;
    }

    if (voiceConnection.speaking.has(Speaking.FLAGS.SPEAKING)) {
      await this.message.reply("Sound already playing");
      return;
    }

    await this.playSound(voiceConnection);
  }
}
