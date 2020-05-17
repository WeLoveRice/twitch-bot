import { SoundList } from "../../src/commands/SoundList";
import { Message } from "discord.js";
import { createLogger, Logger } from "winston";
import fs from "mz/fs";

jest.mock("discord.js");
jest.mock("winston");
jest.mock("mz/fs");

const message = new (Message as jest.Mock<Message>)();
const logger = (createLogger as jest.Mock<Logger>)();
const soundList = new SoundList(message, logger);

afterEach(() => {
  jest.resetAllMocks();
});

describe("isValid", () => {
  it("should always return true", async () => {
    const isValid = await soundList.isValid();
    expect(isValid).toBe(true);
  });
});

describe("execute", () => {
  it("should run", async () => {
    const soundFiles = ["test.mp3", "sound.mp3", "hero.mp3"];
    const soundNames = soundFiles.map(file => {
      return file.match(/(.*?).mp3/)?.[1];
    });
    const formattedSounds = soundNames.map((name, index) => {
      return `${index + 1}. ${name}`;
    });
    jest.spyOn(soundList, "isValid").mockReturnValue(Promise.resolve(true));
    fs.readdir = jest.fn().mockReturnValue(Promise.resolve(soundFiles));

    await soundList.execute();
    expect(fs.readdir).toBeCalledWith(
      expect.stringMatching(/\/services\/discord\/sounds/)
    );

    expect(message.reply).toBeCalledWith(`\n ${formattedSounds.join("\n")}`);
  });
});
