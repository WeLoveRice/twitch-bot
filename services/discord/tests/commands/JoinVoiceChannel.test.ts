import { JoinVoiceChannel } from "./../../src/commands/JoinVoiceChannel";
import { Message, VoiceChannel } from "discord.js";
import { createLogger } from "../../src/Logger";
import * as VCM from "../../src/api/discord/VoiceChannelManager";
import * as VC from "../../src/api/discord/VoiceChannel";

jest.mock("discord.js");
jest.mock("../../src/Logger", () => ({
  createLogger: jest.fn().mockReturnValue({
    error: jest.fn()
  })
}));
jest.mock("../../src/api/discord/VoiceChannelManager");
jest.mock("../../src/api/discord/VoiceChannel");

const message = new (Message as jest.Mock<Message>)();
const logger = createLogger();
const joinVoiceChannel = new JoinVoiceChannel(message);

afterEach(() => {
  jest.resetAllMocks();
});

describe("isValid", () => {
  it.each([
    [false, false],
    [true, true]
  ])(
    "returns %s when isMemberInVoiceChannel returns %",
    async (expected, input) => {
      jest
        .spyOn(VC, "isMemberInVoiceChannel")
        .mockReturnValue(Promise.resolve(input));

      const result = await joinVoiceChannel.isValid();
      expect(result).toBe(expected);
    }
  );
});

describe("execute", () => {
  it("does not run when isValid is false", async () => {
    jest
      .spyOn(joinVoiceChannel, "isValid")
      .mockReturnValue(Promise.resolve(false));

    const getVoiceChannelFromMessage = jest.spyOn(
      VC,
      "getVoiceChannelFromMessage"
    );
    await joinVoiceChannel.execute();
    expect(getVoiceChannelFromMessage).not.toBeCalled();
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
    jest
      .spyOn(joinVoiceChannel, "isValid")
      .mockReturnValue(Promise.resolve(true));

    jest
      .spyOn(VC, "getVoiceChannelFromMessage")
      .mockReturnValue(new (VoiceChannel as jest.Mock<VoiceChannel>)());

    await joinVoiceChannel.execute();
    expect(message.reply).not.toBeCalled();
    expect(VCM.VoiceChannelManager.prototype.joinChannel).toBeCalled();
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
});
