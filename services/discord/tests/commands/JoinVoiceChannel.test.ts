import { JoinVoiceChannel } from "./../../src/commands/JoinVoiceChannel";
import { Message, VoiceChannel, GuildMember } from "discord.js";
import { createLogger } from "../../src/Logger";

jest.mock("discord.js");
jest.mock("../../src/Logger", () => ({
  createLogger: jest.fn().mockReturnValue({
    error: jest.fn()
  })
}));
jest.mock("./../../src/VoiceChannelManager");

const mockedMessage = Message as jest.Mock<Message>;
let message = new mockedMessage();
let logger = createLogger();

beforeEach(() => {
  message = new mockedMessage();
  logger = createLogger();
  logger.error = jest.fn();
});

describe("JoinVoiceChannel Test", () => {
  it("logs error when member is not of type GuildMember", async () => {
    const joinVoiceChannel = new JoinVoiceChannel(message, logger);

    await joinVoiceChannel.execute();
    expect(logger.error).toBeCalledTimes(1);
    expect(logger.error).toBeCalledWith(
      "Expected member of message to be of type GuildMember"
    );
  });

  it("replies with message when voice channel is not of type VoiceChannel", async () => {
    const mockedMember = GuildMember as jest.Mock<GuildMember>;
    const guildMember = new mockedMember();
    message.member = guildMember;

    const mockedReply = jest.fn();
    message.reply = mockedReply;

    const joinVoiceChannel = new JoinVoiceChannel(message, logger);
    await joinVoiceChannel.execute();

    expect(mockedReply).toBeCalledTimes(1);
    expect(mockedReply).toBeCalledWith(
      "You must be in a voice channel for me to join"
    );
  });

  it("does not log error when member and voice channel are correct types", async () => {
    const mockedVoiceChannel = VoiceChannel as jest.Mock<VoiceChannel>;
    const voiceChannel = new mockedVoiceChannel();
    // Can't define normally as voiceChannel.members is a discord class that needs mocked
    // However this class extends Map so we can use that here instead
    Object.defineProperty(voiceChannel, "members", { value: new Map() });

    const mockedMember = GuildMember as jest.Mock<GuildMember>;
    const guildMember = new mockedMember();

    // Can't define normally as guildMember.voiceChannel is a readonly property
    Object.defineProperty(guildMember, "voiceChannel", { value: voiceChannel });
    message.member = guildMember;

    const joinVoiceChannel = new JoinVoiceChannel(message, logger);
    await joinVoiceChannel.execute();
    expect(logger.error).toBeCalledTimes(0);
  });
});
