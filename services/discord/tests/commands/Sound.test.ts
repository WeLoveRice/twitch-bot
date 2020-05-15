import { Message } from "discord.js";
import { createLogger, Logger } from "winston";
import * as Sound from "../../src/commands/Sound";
import path from "path";
import fs from "mz/fs";

jest.mock("discord.js");
jest.mock("winston", () => ({
  createLogger: jest.fn().mockReturnValue({
    warning: jest.fn()
  })
}));

jest.mock("path");
jest.mock("mz/fs");

const message = new (Message as jest.Mock<Message>)();
const logger = (createLogger as jest.Mock<Logger>)();

afterEach(() => {
  jest.resetAllMocks();
});

describe("Sound tests", () => {
  it.each(["test", "one", "two"])(
    "plays sound for files that exist",
    async (content: string) => {
      message.content = content;

      const doesSoundExist = await Sound.doesSoundExist(message);
      expect(doesSoundExist).toBe(true);
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
      const doesSoundExist = await Sound.doesSoundExist(message);
      expect(doesSoundExist).toBe(false);
    }
  );
});
