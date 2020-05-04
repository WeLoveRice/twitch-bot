import { Message, User } from "discord.js";
import { createLogger, Logger } from "winston";
import { Timer } from "../../src/commands/Timer";

jest.mock("discord.js");
jest.mock("winston", () => ({
  createLogger: jest.fn().mockReturnValue({
    warning: jest.fn()
  })
}));

let message = new (Message as jest.Mock<Message>)();
let logger = createLogger();

beforeEach(() => {
  message = new (Message as jest.Mock<Message>)();
  logger = createLogger();
});

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
])("command is valid when message content is %s", async (content: string) => {
  message.content = content;
  message.author = new (User as jest.Mock<User>)();
  message.author.bot = false;

  const timer = new Timer(message, logger);
  const isValid = await timer.isValid();

  expect(isValid).toBe(true);
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
])("command is invalid when message content is %s", async (content: string) => {
  message.content = content;
  message.author = new (User as jest.Mock<User>)();
  message.author.bot = false;

  const timer = new Timer(message, logger);
  const isValid = await timer.isValid();

  expect(isValid).toBe(false);
});

it("Ignores bot user", async () => {
  message.content = "Test";
  message.author = new (User as jest.Mock<User>)();
  message.author.bot = false;

  const timer = new Timer(message, logger);
  const isValid = await timer.isValid();

  expect(isValid).toBe(false);
});
