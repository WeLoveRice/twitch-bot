import { JoinVoiceChannel } from "./../../src/commands/JoinVoiceChannel";
import { Message, VoiceChannel } from "discord.js";
import { createLogger } from "../../src/Logger";
import { Bot } from "../../src/enum/Bot";
import * as VCM from "../../src/VoiceChannelManager";
import * as VC from "../../src/api/discord/VoiceChannel";

jest.mock("discord.js");
jest.mock("../../src/Logger", () => ({
  createLogger: jest.fn().mockReturnValue({
    error: jest.fn()
  })
}));
jest.mock("../../src/VoiceChannelManager");
jest.mock("../../src/api/discord/VoiceChannel");

const message = new (Message as jest.Mock<Message>)();
const logger = createLogger();
const joinVoiceChannel = new JoinVoiceChannel(message, logger);

afterEach(() => {
  jest.resetAllMocks();
});

it("replies when user is not in a voice channel", async () => {
  jest
    .spyOn(joinVoiceChannel, "isValid")
    .mockReturnValue(Promise.resolve(true));
  jest.spyOn(VC, "getVoiceChannelFromMessage").mockReturnValue(null);

  await joinVoiceChannel.execute();
  expect(message.reply).toBeCalledWith(
    "You must be in a voice channel for me to join"
  );
});

it("is successful when member and voice channel are correct types", async () => {
  await joinVoiceChannel.execute();
  expect(logger.error).toBeCalledTimes(0);
});

it("logs error when an exception is thrown", async () => {
  jest
    .spyOn(joinVoiceChannel, "isValid")
    .mockReturnValue(Promise.resolve(true));
  jest.spyOn(VC, "getVoiceChannelFromMessage").mockImplementation(() => {
    throw new Error("Test");
  });
  await joinVoiceChannel.execute();
  expect(logger.error).toBeCalledWith(
    "Something went wrong when trying to join a voice channel: Error: Test"
  );
});
