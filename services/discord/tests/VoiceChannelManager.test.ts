import { VoiceChannelManager } from "./../src/VoiceChannelManager";
import { VoiceChannel } from "discord.js";
import { Logger, createLogger } from "winston";
import * as Runner from "../src/periodicTask/Runner";
import * as winston from "winston";

jest.mock("winston", () => ({
  createLogger: jest.fn().mockReturnValue({
    error: jest.fn()
  })
}));
jest.mock("discord.js");
jest.mock("../src/periodicTask/VoiceChannelDisconnect");
jest.mock("../src/periodicTask/Runner");

const mockedRunner = Runner as jest.Mocked<typeof Runner>;
const voiceChannel = new (VoiceChannel as jest.Mock<VoiceChannel>)();
const logger = winston.createLogger();

afterEach(() => {
  jest.resetAllMocks();
});

it("does not error when voiceChannel.join() returns true", async () => {
  voiceChannel.join = jest.fn().mockReturnValue(true);
  const voiceChannelManager = new VoiceChannelManager(logger);
  await voiceChannelManager.joinChannel(voiceChannel);

  expect(logger.error).toBeCalledTimes(0);
});

it("logs an error when voiceChannel.join() does not return a voiceChannel", async () => {
  voiceChannel.join = jest.fn().mockReturnValue(null);
  const voiceChannelManager = new VoiceChannelManager(logger);
  await voiceChannelManager.joinChannel(voiceChannel);

  expect(logger.error).toBeCalledTimes(1);
  expect(logger.error).toBeCalledWith(
    "An error occured when trying to join a voice channel"
  );
});

it("clears previous runner before starting a new periodicTask", async () => {
  voiceChannel.join = jest.fn().mockReturnValue(true);
  const voiceChannelManager = new VoiceChannelManager(logger);

  await voiceChannelManager.joinChannel(voiceChannel);
  await voiceChannelManager.joinChannel(voiceChannel);

  expect(voiceChannel.join).toBeCalledTimes(2);
  expect(logger.error).toBeCalledTimes(0);
  expect(mockedRunner.Runner.mock.instances[0].stop).toBeCalledTimes(1);
});
