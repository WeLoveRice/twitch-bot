import * as Implicit from "./../../../src/commands/Factory/Implicit";
import { Message } from "discord.js";
import * as TimerMocked from "../../../src/commands/Timer";
import * as SoundMocked from "../../../src/commands/Sound";

jest.mock("discord.js");
jest.mock("../../../src/commands/Timer");
jest.mock("../../../src/commands/Sound");
jest.mock("async-redis", () => ({
  createClient: jest.fn().mockReturnValue({
    on: jest.fn(),
    get: jest.fn(),
    setex: jest.fn()
  })
}));

const message = new (Message as jest.Mock<Message>)();

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

describe("Factory Tests", () => {
  it("returns Timer command when isTimer returns true", async () => {
    jest.spyOn(Implicit, "isTimer").mockReturnValue(true);
    const command = await Implicit.createImplicitCommand(message);

    expect(command).toBeInstanceOf(TimerMocked.Timer);
  });

  it("returns Sound command when doesExist returns true", async () => {
    jest
      .spyOn(SoundMocked, "doesSoundExist")
      .mockReturnValue(Promise.resolve(true));

    const command = await Implicit.createImplicitCommand(message);
    expect(command).toBeInstanceOf(SoundMocked.Sound);
  });

  it("returns null when all not matching anything", async () => {
    jest.spyOn(Implicit, "isTimer").mockReturnValue(false);
    jest
      .spyOn(SoundMocked, "doesSoundExist")
      .mockReturnValue(Promise.resolve(false));

    const command = await Implicit.createImplicitCommand(message);
    expect(command).toBeNull();
  });
});
