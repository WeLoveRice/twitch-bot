const logger = {
  info: jest.fn(),
  warn: jest.fn()
};

import { VoiceChannelDisconnect } from "../../src/periodicTask/VoiceChannelDisconnect";
import { VoiceChannel } from "discord.js";
import { Bot } from "../../src/enum/Bot";

jest.mock("discord.js");
jest.mock("../../src/Logger", () => ({
  createLogger: jest.fn(() => logger)
}));

afterEach(() => {
  logger.info.mockReset();
  logger.warn.mockReset();
});

it("returns true when no one is left in channel", async () => {
  Object.defineProperty(voiceChannel, "members", { value: new Map() });
  const voiceChannelDisconnect = new VoiceChannelDisconnect(voiceChannel);

  const shouldStop = await voiceChannelDisconnect.execute();

  expect(shouldStop).toBe(true);
  expect(logger.warn).toBeCalledWith("Bot no longer in channel");
});

it("leaves the voice channel when no members are present", async () => {
  const members = new Map();
  members.set(Bot.USER_ID, true);
  members.set("Test", true);
  const voiceChannel = new (VoiceChannel as jest.Mock<VoiceChannel>)();
  Object.defineProperty(voiceChannel, "members", {
    value: members
  });
  const voiceChannelDisconnect = new VoiceChannelDisconnect(voiceChannel);

  let shouldStop = await voiceChannelDisconnect.execute();

  expect(logger.warn).toBeCalledTimes(0);
  expect(shouldStop).toBe(false);

  members.delete("Test");
  shouldStop = await voiceChannelDisconnect.execute();
  expect(shouldStop).toBe(true);
  expect(logger.info).toBeCalledWith(
    "No one left in channel, now disconnecting."
  );
});

it("Does not leave the voice channel when members are still present", async () => {
  const members = new Map();
  members.set(Bot.USER_ID, true);
  members.set("Test", true);
  const voiceChannel = new (VoiceChannel as jest.Mock<VoiceChannel>)();
  Object.defineProperty(voiceChannel, "members", {
    value: members
  });
  const voiceChannelDisconnect = new VoiceChannelDisconnect(voiceChannel);

  let shouldStop = await voiceChannelDisconnect.execute();

  expect(shouldStop).toBe(false);
  expect(logger.warn).toBeCalledTimes(0);
  expect(logger.info).toBeCalledTimes(0);

  shouldStop = await voiceChannelDisconnect.execute();
  expect(shouldStop).toBe(false);
});
