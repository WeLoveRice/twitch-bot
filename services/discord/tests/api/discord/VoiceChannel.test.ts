import { Message, GuildMember, VoiceChannel, VoiceState } from "discord.js";
import {
  isMemberInVoiceChannel,
  getVoiceChannelFromMessage,
  isBotInMemberChannel
} from "../../../src/api/discord/VoiceChannel";
import { Bot } from "../../../src/enum/Bot";

jest.mock("discord.js");

const message = new (Message as jest.Mock<Message>)();

afterEach(() => {
  jest.resetAllMocks();
});

const createMessageWithMember = () => {
  const message = new (Message as jest.Mock<Message>)();
  const member = new (GuildMember as jest.Mock<GuildMember>)();
  Object.defineProperty(message, "member", { value: member });
  return message;
};

const createMessageWithVoice = () => {
  const message = createMessageWithMember();
  const voice = new (VoiceState as jest.Mock<VoiceState>)();
  Object.defineProperty(message.member, "voice", { value: voice });

  return message;
};

const createMessageWithChannel = () => {
  const message = createMessageWithVoice();
  const channel = new (VoiceChannel as jest.Mock<VoiceChannel>)();
  Object.defineProperty(message?.member?.voice, "channel", { value: channel });

  return message;
};

const createMessageWithBotInSameChannel = () => {
  const message = createMessageWithChannel();
  Object.defineProperty(message?.member?.voice.channel, "members", {
    value: new Map([[Bot.USER_ID, true]])
  });

  return message;
};

describe("isMemberInVoiceChannel", () => {
  it.each([
    [message, false],
    [createMessageWithMember(), false],
    [createMessageWithVoice(), false],
    [createMessageWithChannel(), true]
  ])("should return expected", async (input, expected) => {
    expect(await isMemberInVoiceChannel(input)).toBe(expected);
  });
});

describe("getVoiceChannelFromMessage", () => {
  it.each([[message], [createMessageWithMember()], [createMessageWithVoice()]])(
    "should return false on input",
    async input => {
      expect(await getVoiceChannelFromMessage(input)).toBe(null);
    }
  );

  it("returns instance of VoiceChannel on valid input", async () => {
    expect(
      await getVoiceChannelFromMessage(createMessageWithChannel())
    ).toBeInstanceOf(VoiceChannel);
  });
});

describe("isBotInMemberChannel", () => {
  it.each([
    [message, false],
    [createMessageWithMember(), false],
    [createMessageWithVoice(), false],
    [createMessageWithChannel(), false],
    [createMessageWithBotInSameChannel(), true]
  ])("returns false message is invalid", async (input, expected) => {
    const result = await isBotInMemberChannel(input);
    expect(result).toBe(expected);
  });
});
