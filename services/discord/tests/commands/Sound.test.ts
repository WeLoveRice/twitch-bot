import {
  Message,
  VoiceConnection,
  Speaking,
  StreamDispatcher
} from "discord.js";
import * as Sound from "../../src/commands/Sound";
import path from "path";
import fs from "mz/fs";
import * as VC from "../../src/api/discord/VoiceChannel";
import { createMock } from "ts-auto-mock";

jest.mock("discord.js");
jest.mock("path");
jest.mock("mz/fs");
jest.mock("../../src/api/discord/VoiceChannel");
jest.mock("../../src/commands/explicit/Join");
jest.mock("../../src/Logger");

const message = new (Message as jest.Mock<Message>)();
let sound = new Sound.Sound(message);

afterEach(() => {
  jest.resetAllMocks();
  sound = new Sound.Sound(message);
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

describe("playSound", () => {
  it("plays sound", async () => {
    const event = createMock<StreamDispatcher>();
    const voiceConnection = createMock<VoiceConnection>();
    voiceConnection.play = jest.fn().mockReturnValue(event);

    const file = "test file";
    jest.spyOn(Sound, "getSoundPath").mockReturnValue(file);

    sound.playSound(voiceConnection);
    expect(voiceConnection.play).toBeCalledWith(file);
  });
});

describe("run", () => {
  beforeEach(() => {
    jest.spyOn(sound, "isValid").mockReturnValue(Promise.resolve(true));
  });

  it("does not play anything if voiceconnection is null", async () => {
    jest.spyOn(VC, "joinVoiceChannel").mockReturnValue(Promise.resolve(null));
    const playSound = jest.spyOn(sound, "playSound");
    await sound.execute();
    expect(playSound).not.toBeCalled();
  });

  it("does not play sound again if sound is already playing", async () => {
    const voiceConnection = createMock<VoiceConnection>();
    voiceConnection.speaking = createMock<Speaking>();
    jest.spyOn(voiceConnection.speaking, "has").mockReturnValue(true);
    jest
      .spyOn(VC, "joinVoiceChannel")
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
      .spyOn(VC, "joinVoiceChannel")
      .mockReturnValue(Promise.resolve(voiceConnection));
    const playSound = jest.spyOn(sound, "playSound");

    await sound.execute();
    expect(playSound).toBeCalled();
  });
});
