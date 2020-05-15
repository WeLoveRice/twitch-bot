import { Message, VoiceChannel } from "discord.js";
import { Bot } from "../../enum/Bot";

export const getVoiceChannelFromMessage = (
  message: Message
): VoiceChannel | null => {
  if (!message.member?.voice?.channel) {
    return null;
  }

  return message.member.voice.channel;
};

export const isMemberInVoiceChannel = async (
  message: Message
): Promise<boolean> => {
  if (!message.member?.voice?.channel) {
    return false;
  }
  const { channel } = message.member.voice;
  return channel instanceof VoiceChannel;
};

export const isBotInMemberChannel = async (
  message: Message
): Promise<boolean> => {
  if (!message?.member?.voice?.channel?.members) {
    return false;
  }

  const { channel } = message.member.voice;
  return channel.members.has(Bot.USER_ID);
};
