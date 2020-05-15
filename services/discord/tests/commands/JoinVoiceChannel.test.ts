import { JoinVoiceChannel } from "./../../src/commands/JoinVoiceChannel";
import { Message, VoiceChannel, GuildMember } from "discord.js";
import { createLogger } from "../../src/Logger";
import { Bot } from "../../src/enum/Bot";
import * as VCM from "../../src/VoiceChannelManager";

jest.mock("discord.js");
jest.mock("../../src/Logger", () => ({
  createLogger: jest.fn().mockReturnValue({
    error: jest.fn()
  })
}));
jest.mock("../../src/VoiceChannelManager");

const VCMMock = VCM as jest.Mocked<typeof VCM>;
let message = new (Message as jest.Mock<Message>)();
const logger = createLogger();

afterEach(() => {
  jest.resetAllMocks();
  message = new (Message as jest.Mock<Message>)();
});

it("replies with message when voice channel is not of type VoiceChannel", async () => {
  const guildMember = new (GuildMember as jest.Mock<GuildMember>)();
  Object.defineProperty(guildMember, "voice", { value: { channel: null } });
  Object.defineProperty(message, "member", { value: guildMember });

  const mockedReply = jest.fn();
  message.reply = mockedReply;

  const joinVoiceChannel = new JoinVoiceChannel(message, logger);
  await joinVoiceChannel.execute();

  expect(mockedReply).toBeCalledTimes(1);
  expect(mockedReply).toBeCalledWith(
    "You must be in a voice channel for me to join"
  );
});

it("is successful when member and voice channel are correct types", async () => {
  const voiceChannel = new (VoiceChannel as jest.Mock<VoiceChannel>)();
  // Can't define normally as voiceChannel.members is a discord class that needs mocked
  // However this class extends Map so we can use that here instead
  Object.defineProperty(voiceChannel, "members", { value: new Map() });

  const guildMember = new (GuildMember as jest.Mock<GuildMember>)();

  // Can't define normally as guildMember.voiceChannel is a readonly property
  Object.defineProperty(guildMember, "voice", {
    value: { channel: voiceChannel }
  });
  Object.defineProperty(message, "member", { value: guildMember });

  const joinVoiceChannel = new JoinVoiceChannel(message, logger);
  await joinVoiceChannel.execute();
  expect(logger.error).toBeCalledTimes(0);
});

it("does not join channel again when the bot is already in the channel", async () => {
  const voiceChannel = new (VoiceChannel as jest.Mock<VoiceChannel>)();
  // Can't define normally as voiceChannel.members is a discord class that needs mocked
  // However this class extends Map so we can use that here instead
  Object.defineProperty(voiceChannel, "members", {
    value: new Map([[Bot.USER_ID, true]])
  });

  const guildMember = new (GuildMember as jest.Mock<GuildMember>)();

  // Can't define normally as guildMember.voiceChannel is a readonly property
  Object.defineProperty(guildMember, "voice", {
    value: { channel: voiceChannel }
  });
  Object.defineProperty(message, "member", { value: guildMember });

  const joinVoiceChannel = new JoinVoiceChannel(message, logger);
  await joinVoiceChannel.execute();
  expect(logger.error).toBeCalledTimes(0);
  expect(message.reply).toHaveBeenCalledWith("Already in channel");
  expect(VCMMock.VoiceChannelManager.mock.instances[0]).toBeUndefined();
});

it("logs error when an exception is thrown", async () => {
  const voiceChannel = new (VoiceChannel as jest.Mock<VoiceChannel>)();
  // Can't define normally as voiceChannel.members is a discord class that needs mocked
  // However this class extends Map so we can use that here instead
  Object.defineProperty(voiceChannel, "members", {
    value: new Map()
  });
  JoinVoiceChannel.prototype.getVoiceChannelFromMessage = jest
    .fn()
    .mockReturnValue(voiceChannel);
  VCMMock.VoiceChannelManager.mockImplementation(() => {
    const voiceChannelManager = new (jest.fn() as jest.Mock<
      VCM.VoiceChannelManager
    >)();

    voiceChannelManager.joinChannel = jest.fn().mockImplementation(() => {
      throw new Error("Test");
    });

    return voiceChannelManager;
  });
  const joinVoiceChannel = new JoinVoiceChannel(message, logger);
  jest.spyOn(joinVoiceChannel, "isValid").mockImplementation(async () => true);
  await joinVoiceChannel.execute();
  expect(logger.error).toBeCalledWith(
    "Something went wrong when trying to join a voice channel: Error: Test"
  );
});
