import {
  Message,
  VoiceConnection,
  Speaking,
  StreamDispatcher
} from "discord.js";
import { createLogger, Logger } from "winston";
import * as Sound from "../../src/commands/Sound";
import path from "path";
import fs from "mz/fs";
import * as JVC from "../../src/commands/JoinVoiceChannel";
import * as VC from "../../src/api/discord/VoiceChannel";
import { createMock } from "ts-auto-mock";

jest.mock("discord.js");
jest.mock("winston", () => ({
  createLogger: jest.fn().mockReturnValue({
    warning: jest.fn()
  })
}));

jest.mock("path");
jest.mock("mz/fs");
jest.mock("../../src/api/discord/VoiceChannel");
jest.mock("../../src/commands/JoinVoiceChannel");

const message = new (Message as jest.Mock<Message>)();
const logger = (createLogger as jest.Mock<Logger>)();
let sound = new Sound.Sound(message, logger);

afterEach(() => {
  jest.resetAllMocks();
  sound = new Sound.Sound(message, logger);
});

describe("doesSoundExist", () => {
  it.each(["test", "one", "two"])(
    "plays sound for files that exist",
    async (content: string) => {
      message.content = content;

      const result = await Sound.doesSoundExist(message);
      expect(result).toBe(true);
      expect(path.join).toBeCalledWith(
        expect.stringMatching(/\/services\/discord\/src\/commands/),
        "..",
        "..",
        "sounds",
        `${content}.mp3`
      );
    }
  );

  it.each(["null", "nonexist", "zero"])(
    "does not play sound for files that don't exist",
    async (content: string) => {
      message.content = content;
      jest.spyOn(fs, "access").mockImplementation(() => {
        throw new Error("test");
      });
      const result = await Sound.doesSoundExist(message);
      expect(result).toBe(false);
    }
  );
});

describe("isValid", () => {
  it("returns false if member is not in a voice channel", async () => {
    jest
      .spyOn(VC, "isMemberInVoiceChannel")
      .mockReturnValue(Promise.resolve(false));

    expect(await sound.isValid()).toBe(false);
    expect(VC.isMemberInVoiceChannel).toBeCalledWith(message);
    expect(message.reply).toBeCalledWith(
      "You must be in a voice channel to play a sound"
    );
  });

  it("returns true when member is in voice channel and doesSoundExist returns true", async () => {
    jest
      .spyOn(VC, "isMemberInVoiceChannel")
      .mockReturnValue(Promise.resolve(true));

    jest.spyOn(Sound, "doesSoundExist").mockReturnValue(Promise.resolve(true));

    expect(await sound.isValid()).toBe(true);
  });
});

describe("joinVoiceChannel", () => {
  const sound = new Sound.Sound(message, logger);
  it("rejoins when voiceconnection is null but the bot is present in the voice channel", async () => {
    const voiceConnection = createMock<VoiceConnection>();
    jest
      .spyOn(VC, "getBotVoiceConnection")
      .mockReturnValueOnce(Promise.resolve(null))
      .mockReturnValueOnce(Promise.resolve(voiceConnection));

    const result = await sound.joinVoiceChannel();
    expect(JVC.JoinVoiceChannel.prototype.execute).toBeCalled();
    expect(result).toBe(voiceConnection);
  });

  it("returns a voiceconnection when it exists", async () => {
    const voiceConnection = createMock<VoiceConnection>();
    jest
      .spyOn(VC, "getBotVoiceConnection")
      .mockReturnValueOnce(Promise.resolve(voiceConnection));

    const result = await sound.joinVoiceChannel();
    expect(JVC.JoinVoiceChannel.prototype.execute).not.toBeCalled();
    expect(result).toBe(voiceConnection);
  });
});

describe("playSound", () => {
  it("plays sound", async () => {
    const event = createMock<StreamDispatcher>();
    const voiceConnection = createMock<VoiceConnection>();
    voiceConnection.play = jest.fn().mockReturnValue(event);

    const file = "test file";
    jest.spyOn(Sound, "getSoundPath").mockReturnValue(file);

    sound.playSound(voiceConnection);
    expect(voiceConnection.play).toBeCalledWith(file);
    expect(event.on).toBeCalledWith("finish", expect.any(Function));
  });
});

describe("run", () => {
  beforeEach(() => {
    jest.spyOn(sound, "isValid").mockReturnValue(Promise.resolve(true));
  });

  it("does not play anything if voiceconnection is null", async () => {
    jest
      .spyOn(sound, "joinVoiceChannel")
      .mockReturnValue(Promise.resolve(null));
    const playSound = jest.spyOn(sound, "playSound");
    await sound.execute();
    expect(playSound).not.toBeCalled();
  });

  it("does not play sound again if sound is already playing", async () => {
    const voiceConnection = createMock<VoiceConnection>();
    voiceConnection.speaking = createMock<Speaking>();
    jest.spyOn(voiceConnection.speaking, "has").mockReturnValue(true);
    jest
      .spyOn(sound, "joinVoiceChannel")
      .mockReturnValue(Promise.resolve(voiceConnection));
    const playSound = jest.spyOn(sound, "playSound");

    await sound.execute();
    expect(message.reply).toBeCalledWith("Sound already playing");
    expect(playSound).not.toBeCalled();
  });

  it("plays sound if voiceconnection is valid and is not speaking", async () => {
    const voiceConnection = createMock<VoiceConnection>();
    voiceConnection.speaking = createMock<Speaking>();
    jest.spyOn(voiceConnection.speaking, "has").mockReturnValue(false);
    jest
      .spyOn(sound, "joinVoiceChannel")
      .mockReturnValue(Promise.resolve(voiceConnection));
    const playSound = jest.spyOn(sound, "playSound");

    await sound.execute();
    expect(playSound).toBeCalled();
  });
});
