import { Message, VoiceChannel, VoiceConnection } from "discord.js";
import { Bot } from "../../enum/Bot";
import { JoinVoiceChannel } from "../../commands/JoinVoiceChannel";

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
  if (!message.member?.voice?.channel?.members) {
    return false;
  }

  const { channel } = message.member.voice;
  return channel.members.has(Bot.USER_ID);
};

export const getBotVoiceConnection = async (
  message: Message
): Promise<VoiceConnection | null> => {
  const user = message.client.user;
  if (!user) {
    return null;
  }

  const botMember = message.guild?.member(user);
  if (!botMember) {
    return null;
  }
  return botMember.voice.connection;
};

export const joinVoiceChannel = async (
  message: Message
): Promise<VoiceConnection | null> => {
  const voiceConnection = await getBotVoiceConnection(message);
  if (!voiceConnection) {
    const command = new JoinVoiceChannel(message);
    await command.execute();
    return getBotVoiceConnection(message);
  }

  return voiceConnection;
};
