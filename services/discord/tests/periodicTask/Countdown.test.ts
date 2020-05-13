import { Countdown } from "../../src/periodicTask/Countdown";
import { Message } from "discord.js";

jest.mock("winston", () => ({
  createLogger: jest.fn().mockReturnValue({
    error: jest.fn()
  })
}));
jest.mock("discord.js");

const message = new (Message as jest.Mock<Message>)();

afterEach(() => jest.resetAllMocks());

it("can run execute", async () => {
  const countdown = new Countdown(message, 60);
  countdown.getRemainingTime = jest.fn();
  countdown.updateCountdownMessage = jest.fn();
  await countdown.execute();
});
