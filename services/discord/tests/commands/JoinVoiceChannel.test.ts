import { JoinVoiceChannel } from "./../../src/commands/JoinVoiceChannel";
import { Message, VoiceChannel, GuildMember } from "discord.js";
import { createLogger } from "../../src/Logger";

jest.mock("discord.js");
jest.mock("./../../src/VoiceChannelManager");

const mockedMessage = Message as jest.Mock<Message>;
let message = new mockedMessage();
let logger = createLogger();

beforeEach(() => {
  message = new mockedMessage();
  logger = createLogger();
});

describe("JoinVoiceChannel Test", () => {
  it("returns false when member is not of type GuildMember", async () => {
    const errorMocked = jest.fn();
    logger.error = errorMocked;
    const joinVoiceChannel = new JoinVoiceChannel(message, logger);

    const result = await joinVoiceChannel.execute();
    expect(result).toBe(false);
    expect(errorMocked).toBeCalledTimes(1);
    expect(errorMocked).toBeCalledWith(
      "Expected member of message to be of type GuildMember"
    );
  });

  it("returns false when voice channel is not of type VoiceChannel", async () => {
    const mockedMember = GuildMember as jest.Mock<GuildMember>;
    const guildMember = new mockedMember();
    message.member = guildMember;

    const joinVoiceChannel = new JoinVoiceChannel(message, logger);
    const result = await joinVoiceChannel.execute();

    expect(result).toBe(false);
  });

  it("returns true when member and voice channel are correct types", async () => {
    const mockedVoiceChannel = VoiceChannel as jest.Mock<VoiceChannel>;
    const voiceChannel = new mockedVoiceChannel();

    const mockedMember = GuildMember as jest.Mock<GuildMember>;
    const guildMember = new mockedMember();

    // Can't define normally as guildMember.voiceChannel is a readonly property
    Object.defineProperty(guildMember, "voiceChannel", { value: voiceChannel });
    message.member = guildMember;

    const joinVoiceChannel = new JoinVoiceChannel(message, logger);
    const result = await joinVoiceChannel.execute();
    expect(result).toBe(true);
  });
});
