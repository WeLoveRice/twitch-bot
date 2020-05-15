import {
  Message,
  GuildMember,
  VoiceChannel,
  VoiceState,
  Guild,
  ClientUser,
  User
} from "discord.js";
import {
  isMemberInVoiceChannel,
  getVoiceChannelFromMessage,
  isBotInMemberChannel,
  getBotVoiceConnection
} from "../../../src/api/discord/VoiceChannel";
import { Bot } from "../../../src/enum/Bot";
import { mocked } from "ts-jest/utils";

jest.mock("discord.js");

let message = new (Message as jest.Mock<Message>)();

afterEach(() => {
  jest.resetAllMocks();
  message = new (Message as jest.Mock<Message>)();
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
  const createMessageWithBotInSameChannel = () => {
    const message = createMessageWithChannel();
    Object.defineProperty(message?.member?.voice.channel, "members", {
      value: new Map([[Bot.USER_ID, true]])
    });

    return message;
  };

  it.each([
    [message, false],
    [createMessageWithMember(), false],
    [createMessageWithVoice(), false],
    [createMessageWithChannel(), false],
    [createMessageWithBotInSameChannel(), true]
  ])("returns false when message is invalid", async (input, expected) => {
    const result = await isBotInMemberChannel(input);
    expect(result).toBe(expected);
  });
});

describe("getBotVoiceConnection", () => {
  it("returns false when user doesn't exist", async () => {
    Object.defineProperty(message, "client", { value: jest.fn() });
    Object.defineProperty(message.client, "user", {
      value: jest.fn().mockReturnValue(null)
    });

    const result = await getBotVoiceConnection(message);
    expect(result).toBeNull();
  });

  it("returns false when can't find bot's guild member", async () => {
    Object.defineProperty(message, "client", { value: jest.fn() });

    message.client.user = new (User as jest.Mock<ClientUser>)();
    Object.defineProperty(message, "guild", { value: jest.fn() });
    Object.defineProperty(message.guild, "member", {
      value: jest.fn().mockReturnValue(null)
    });

    const result = await getBotVoiceConnection(message);
    expect(result).toBeNull();
  });

  it("returns an instance of VoiceConnection when message is valid", async () => {
    Object.defineProperty(message, "client", { value: jest.fn() });
    Object.defineProperty(message.client, "user", {
      value: jest.fn().mockReturnValue(true)
    });

    const connection = jest.fn();
    const voiceState = new (VoiceState as jest.Mock<VoiceState>)();
    Object.defineProperty(voiceState, "connection", { value: connection });
    const botMember = new (GuildMember as jest.Mock<GuildMember>)();
    Object.defineProperty(botMember, "voice", { value: voiceState });
    const guild = new (Guild as jest.Mock<Guild>)();
    guild.member = jest.fn().mockReturnValue(botMember);
    Object.defineProperty(message, "guild", { value: guild });

    const result = await getBotVoiceConnection(message);
    expect(result).toBe(connection);
  });
});
