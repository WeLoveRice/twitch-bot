import { VoiceChannelDisconnect } from "../../src/periodicTask/VoiceChannelDisconnect";
import { createLogger } from "winston";
import { VoiceChannel, GuildMember } from "discord.js";
import { Bot } from "../../src/enum/Bot";

jest.mock("discord.js");
jest.mock("winston", () => ({
  createLogger: jest.fn().mockReturnValue({
    info: jest.fn(),
    warn: jest.fn()
  })
}));

const MockedVoiceChannel = VoiceChannel as jest.Mock<VoiceChannel>;
const MockedGuildMember = GuildMember as jest.Mock<GuildMember>;

let voiceChannel = new MockedVoiceChannel();
let logger = createLogger();
let voiceChannelDisconnect = new VoiceChannelDisconnect(voiceChannel, logger);

beforeEach(() => {
  voiceChannel = new MockedVoiceChannel();
  logger = createLogger();
  logger.info = jest.fn();
  logger.warn = jest.fn();
});

it("returns true when no one is left in channel", async () => {
  Object.defineProperty(voiceChannel, "members", { value: new Map() });
  voiceChannelDisconnect = new VoiceChannelDisconnect(voiceChannel, logger);
  const shouldStop = await voiceChannelDisconnect.execute();

  expect(shouldStop).toBe(true);
  expect(logger.warn).toBeCalledTimes(1);
  expect(logger.warn).toBeCalledWith("Bot no longer in channel");
});

it("leaves the voice channel when no members are present", async () => {
  const members = new Map();
  members.set(Bot.USER_ID, new MockedGuildMember());
  members.set("Test", new MockedGuildMember());
  Object.defineProperty(voiceChannel, "members", { value: members });

  voiceChannelDisconnect = new VoiceChannelDisconnect(voiceChannel, logger);
  let shouldStop = await voiceChannelDisconnect.execute();

  expect(shouldStop).toBe(false);
  expect(logger.warn).toBeCalledTimes(0);

  members.delete("Test");
  shouldStop = await voiceChannelDisconnect.execute();
  expect(shouldStop).toBe(true);
  expect(logger.info).toBeCalledTimes(1);
  expect(logger.info).toBeCalledWith(
    "No one left in channel, now disconnecting."
  );
});

it("Does not leave the voice channel when members are still present", async () => {
  const members = new Map();
  members.set(Bot.USER_ID, new MockedGuildMember());
  members.set("Test", new MockedGuildMember());
  Object.defineProperty(voiceChannel, "members", { value: members });

  voiceChannelDisconnect = new VoiceChannelDisconnect(voiceChannel, logger);
  let shouldStop = await voiceChannelDisconnect.execute();

  expect(shouldStop).toBe(false);
  expect(logger.warn).toBeCalledTimes(0);
  expect(logger.info).toBeCalledTimes(0);

  shouldStop = await voiceChannelDisconnect.execute();
  expect(shouldStop).toBe(false);
});
