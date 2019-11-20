import { JoinVoiceChannel } from "./../../src/commands/JoinVoiceChannel";
import { Message, Client, VoiceChannel, GuildMember } from "discord.js";
jest.mock("discord.js");
jest.mock("./../../src/VoiceChannelManager");

const mockedClient = (Client as unknown) as jest.Mock<Client>;
const mockedMessage = Message as jest.Mock<Message>;

let client = new mockedClient();
let message = new mockedMessage();

beforeEach(() => {
  client = new mockedClient();
  message = new mockedMessage();
});

describe("JoinVoiceChannel Test", () => {
  it("returns false when member is not of type GuildMember", async () => {
    const joinVoiceChannel = new JoinVoiceChannel(client, message);

    const result = await joinVoiceChannel.execute();
    expect(result).toBe(false);
  });

  it("returns false when voice channel is not of type VoiceChannel", async () => {
    const mockedMember = GuildMember as jest.Mock<GuildMember>;
    const guildMember = new mockedMember();
    message.member = guildMember;

    const joinVoiceChannel = new JoinVoiceChannel(client, message);
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

    const joinVoiceChannel = new JoinVoiceChannel(client, message);
    const result = await joinVoiceChannel.execute();
    expect(result).toBe(true);
  });
});
