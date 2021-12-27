import { Message } from "discord.js";
import { fs } from "mz";
import { exec } from "mz/child_process";
import path from "path";

export const getVideoTitle = async (url: string) => {
  const [stdout, stderr] = await exec(`youtube-dl --get-title ${url}`);

  return stdout;
};

export const titleToSafePath = (title: string) => {
  const safeTitle = title.normalize().replace(/\//g, "|");

  return path.join(__dirname, "..", "..", "music", `${safeTitle}.mp3`);
};

export const downloadVideo = async (url: string, message: Message) => {
  const videoTitle = await getVideoTitle(url);
  const safePath = titleToSafePath(videoTitle);

  // if savepath file already exists
  // return savepath
  if (await fs.exists(safePath)) {
    return safePath;
  }

  await message.reply("Downloading video, this may take a while...");
  await exec(`youtube-dl -x --audio-format mp3 -o '${safePath}' ${url}`);

  return safePath;
};
