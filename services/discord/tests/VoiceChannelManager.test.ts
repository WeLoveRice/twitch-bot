import { VoiceChannelManager } from "./../src/VoiceChannelManager";
import { createLogger } from "winston";
import { VoiceChannel } from "discord.js";

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

it("starts a periodic start when joinChannel is called", () => {
  const voiceChannelManager = new VoiceChannelManager(logger);

  voiceChannelManager.joinChannel(voiceChannel);
  expect(logger.error).toBeCalledTimes(0);
});
