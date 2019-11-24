import { createImplicitCommand } from "./../../../src/commands/Factory/Implicit";
import { Message } from "discord.js";
import { createLogger, Logger } from "winston";
import { Timer } from "../../../src/commands/Timer";

jest.mock("discord.js");
jest.mock("winston", () => ({
  createLogger: jest.fn().mockReturnValue({
    warning: jest.fn()
  })
}));

const MockedMessage = Message as jest.Mock<Message>;
const mockCreateLogger = createLogger as jest.Mock<Logger>;

let message = new MockedMessage();
let logger = createLogger();

beforeEach(() => {
  MockedMessage.mockClear();
  mockCreateLogger.mockClear();
  message = new MockedMessage();
  logger = createLogger();
});

describe("Timer test", () => {
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
  ])("should return timer when message content is %s", (content: string) => {
    message.content = content;
    const implicitCommand = createImplicitCommand(message, logger);
    expect(implicitCommand).toBeInstanceOf(Timer);
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
    "should not return timer when message content is %s",
    (content: string) => {
      message.content = content;
      const implicitCommand = createImplicitCommand(message, logger);
      expect(implicitCommand).not.toBeInstanceOf(Timer);
    }
  );
});
