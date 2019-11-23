import { VoiceChannelManager } from "./../src/VoiceChannelManager";
import { VoiceChannel } from "discord.js";
import { createLogger } from "winston";

jest.mock("winston", () => ({
  createLogger: jest.fn().mockReturnValue({
    error: jest.fn()
  })
}));
jest.mock("discord.js");
jest.mock("../src/periodicTask/VoiceChannelDisconnect");
jest.mock("../src/periodicTask/Runner");

const mockVoiceChannel = VoiceChannel as jest.Mock<VoiceChannel>;
let voiceChannel = new mockVoiceChannel();
let logger = createLogger();

beforeEach(() => {
  logger = createLogger();
  voiceChannel = new mockVoiceChannel();
});

it("error is not called when voiceChannel.join() returns true", async () => {
  voiceChannel.join = jest.fn().mockReturnValue(new mockVoiceChannel());
  const voiceChannelManager = new VoiceChannelManager(logger);
  await voiceChannelManager.joinChannel(voiceChannel);
  expect(logger.error).toBeCalledTimes(0);
});

it("logs an error when voiceChannel.join() does not return a voiceChannel", async () => {
  voiceChannel.join = jest.fn().mockReturnValue(false);
  const voiceChannelManager = new VoiceChannelManager(logger);
  await voiceChannelManager.joinChannel(voiceChannel);
  expect(logger.error).toBeCalledTimes(1);
  expect(logger.error).toBeCalledWith(
    "An error occured when trying to join a voice channel"
  );
});
