import * as Implicit from "./../../../src/commands/Factory/Implicit";
import { Message } from "discord.js";
import { createLogger, Logger } from "winston";
import { Timer } from "../../../src/commands/Timer";
import { Sound } from "../../../src/commands/Sound";
import path from "path";
import * as fs from "mz/fs";

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

describe("Timer tests", () => {
  it.each([
    "1sec",
    "2secs",
    "3seconds",
    "4 sec",
    "5 secs",
    "6 seconds",
    "10 seconds",
    "59 seconds",
    "1min",
    "2mins",
    "3minutes",
    "4 min",
    "5 mins",
    "6 minutes",
    "59 minutes",
    "Can't start 2 mins",
    "Wait 2 mins I go shower",
    "brb 05 mins"
  ])("should return true when message content is %s", (content: string) => {
    message.content = content;
    expect(Implicit.isTimer(message)).toBe(true);
  });

  it.each([
    "hello world",
    "whats up",
    "good morning",
    "about 5 apples",
    "2s",
    "10m",
    "10 years",
    "500"
  ])(
    "should not return false when message content is %s",
    (content: string) => {
      message.content = content;
      expect(Implicit.isTimer(message)).toBe(false);
    }
  );
});

describe("Sound tests", () => {
  it.each(["test", "one", "two"])(
    "plays sound for files that exist",
    async (content: string) => {
      message.content = content;

      const doesSoundExist = await Implicit.doesSoundExist(message);
      expect(doesSoundExist).toBe(true);
      expect(path.join).toBeCalledWith(
        expect.stringMatching(
          /\/twitch-bot\/services\/discord\/src\/commands\/Factory/
        ),
        "..",
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
      const doesSoundExist = await Implicit.doesSoundExist(message);
      expect(doesSoundExist).toBe(false);
    }
  );
});

describe("Factory Tests", () => {
  it("returns Timer command when isTimer returns true", async () => {
    jest.spyOn(Implicit, "isTimer").mockReturnValue(true);
    const command = await Implicit.createImplicitCommand(message, logger);

    expect(command).toBeInstanceOf(Timer);
  });

  it("returns Sound command when doesExist returns true", async () => {
    jest
      .spyOn(Implicit, "doesSoundExist")
      .mockReturnValue(Promise.resolve(true));

    const command = await Implicit.createImplicitCommand(message, logger);
    expect(command).toBeInstanceOf(Sound);
  });

  it("returns null when all not matching anything", async () => {
    jest.spyOn(Implicit, "isTimer").mockReturnValue(false);
    jest
      .spyOn(Implicit, "doesSoundExist")
      .mockReturnValue(Promise.resolve(false));

    const command = await Implicit.createImplicitCommand(message, logger);
    expect(command).toBeNull();
  });
});
