import { Message, User } from "discord.js";
import { redis } from "../../src/api/redis";
import { Timer } from "../../src/commands/Timer";
import * as Countdown from "../../src/periodicTask/Countdown";

jest.mock("discord.js");
jest.mock("../../src/Logger", () => ({
  createLogger: jest.fn().mockReturnValue({
    info: jest.fn(),
    error: jest.fn()
  })
}));
jest.mock("../../src/periodicTask/Runner");
jest.mock("../../src/periodicTask/Countdown");
jest.mock("../../src/api/redis");

const countdownMock = Countdown as jest.Mocked<typeof Countdown>;
const message = new (Message as jest.Mock<Message>)();
const timer = new Timer(message);

afterEach(() => {
  jest.resetAllMocks();
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

  const isValid = await timer.isValid();
  timer.execute();

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

  const isValid = await timer.isValid();

  expect(isValid).toBe(false);
});

it("ignores bot user", async () => {
  message.content = "Test";
  message.author = new (User as jest.Mock<User>)();
  message.author.bot = true;

  const isValid = await timer.isValid();
  expect(isValid).toBe(false);
});

it("ignores timer when user already has one running", async () => {
  message.content = "5 mins";
  message.author = new (User as jest.Mock<User>)();
  message.author.bot = false;

  redis.GET = jest.fn().mockReturnValue(true);
  const isValid = await timer.isValid();
  expect(isValid).toBe(false);
  expect(redis.GET).toBeCalledWith(message.author.id);
});

it("does not run when parseSecondsToRun is null", async () => {
  jest.spyOn(timer, "isValid").mockReturnValue(Promise.resolve(true));
  jest.spyOn(timer, "parseSecondsToRun").mockReturnValue(null);
  timer.execute();

  expect(countdownMock.Countdown.mock.instances[0]).toBeUndefined;
});
