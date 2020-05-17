import { VoiceChannelManager } from "./../src/VoiceChannelManager";
import { VoiceChannel } from "discord.js";
import * as Runner from "../src/periodicTask/Runner";
import { createLogger } from "../src/Logger";

jest.mock("../src/Logger", () => ({
  createLogger: jest.fn().mockReturnValue({
    error: jest.fn()
  })
}));
jest.mock("discord.js");
jest.mock("../src/periodicTask/VoiceChannelDisconnect");
jest.mock("../src/periodicTask/Runner");

const mockedRunner = Runner as jest.Mocked<typeof Runner>;
const voiceChannel = new (VoiceChannel as jest.Mock<VoiceChannel>)();
const logger = createLogger();

afterEach(() => {
  jest.resetAllMocks();
});

it("does not error when voiceChannel.join() returns true", async () => {
  voiceChannel.join = jest.fn().mockReturnValue(true);
  const voiceChannelManager = new VoiceChannelManager();
  await voiceChannelManager.joinChannel(voiceChannel);

  expect(logger.error).toBeCalledTimes(0);
});

it("clears previous runner before starting a new periodicTask", async () => {
  voiceChannel.join = jest.fn().mockReturnValue(true);
  const voiceChannelManager = new VoiceChannelManager();

  await voiceChannelManager.joinChannel(voiceChannel);
  await voiceChannelManager.joinChannel(voiceChannel);

  expect(voiceChannel.join).toBeCalledTimes(2);
  expect(logger.error).toBeCalledTimes(0);
  expect(mockedRunner.Runner.mock.instances[0].stop).toBeCalledTimes(1);
});
