import { VoiceChannelDisconnect } from "./../../src/PeriodicTask/VoiceChannelDisconnect";
import { createLogger } from "winston";
import { VoiceChannel } from "discord.js";

jest.mock("discord.js");
jest.mock("winston", () => ({
  createLogger: jest.fn().mockReturnValue({
    warning: jest.fn()
  })
}));

const MockedVoiceChannel = VoiceChannel as jest.Mock<VoiceChannel>;
let voiceChannel = new MockedVoiceChannel();
let logger = createLogger();
let voiceChannelDisconnect = new VoiceChannelDisconnect(voiceChannel, logger);

it("returns true when no one is left in channel", async () => {
  voiceChannel = new MockedVoiceChannel();
  Object.defineProperty(voiceChannel, "members", { value: new Map() });
  logger = createLogger();
  voiceChannelDisconnect = new VoiceChannelDisconnect(voiceChannel, logger);
  const shouldStop = await voiceChannelDisconnect.execute();

  expect(shouldStop).toBe(true);
  expect(logger.warning).toBeCalledTimes(1);
  expect(logger.warning).toBeCalledWith("Bot no longer in channel");
});
