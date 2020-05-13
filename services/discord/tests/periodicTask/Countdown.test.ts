const momentMock = {
  add: jest.fn(),
  diff: jest.fn()
};

import { Countdown } from "../../src/periodicTask/Countdown";
import { Message, TextChannel } from "discord.js";
import moment from "moment";

jest.mock("winston", () => ({
  createLogger: jest.fn().mockReturnValue({
    error: jest.fn()
  })
}));

jest.mock("discord.js");
jest.mock("moment", () => () => momentMock);
const message = new (Message as jest.Mock<Message>)();

afterEach(() => jest.resetAllMocks());

describe("execute", () => {
  it("is sucessfull when remaining time is > 0 ", async () => {
    const countdown = new Countdown(message, 60);
    countdown.getRemainingTime = jest.fn();
    countdown.updateCountdownMessage = jest.fn();
    const shouldStop = await countdown.execute();
    expect(shouldStop).toBe(false);
    expect(countdown.updateCountdownMessage).toBeCalled();
  });

  it.each([0, -1, -10])(
    "calls updateCountdownMessage when remaining time is <= 0 ",
    async remainingTime => {
      const countdown = new Countdown(message, 60);
      countdown.getRemainingTime = jest.fn().mockReturnValue(remainingTime);
      countdown.updateCountdownMessage = jest.fn();
      const shouldStop = await countdown.execute();
      expect(shouldStop).toBe(true);
      expect(countdown.updateCountdownMessage).toBeCalled();
    }
  );
});

describe("updateCountdownMessage", () => {
  it("sends new message", async () => {
    const sentMessage = new (Message as jest.Mock<Message>)();
    const channel = new (TextChannel as jest.Mock<TextChannel>)();
    channel.send = jest.fn().mockReturnValue(sentMessage);
    message["channel"] = channel;

    const countdown = new Countdown(message, 60);
    const embed = jest.fn();
    countdown.createEmbedForRemainingTime = jest.fn().mockReturnValue(embed);

    await countdown.updateCountdownMessage();
    expect(channel.send).toBeCalledWith(embed);
    expect(countdown["countDownMessage"]).toBe(sentMessage);
  });

  it("can update existing messsage", async () => {
    const countdown = new Countdown(message, 60);
    const embed = jest.fn();
    countdown.createEmbedForRemainingTime = jest.fn().mockReturnValue(embed);
    countdown["countDownMessage"] = new (Message as jest.Mock<Message>)();

    countdown.updateCountdownMessage();
    expect(countdown["countDownMessage"].edit).toBeCalledWith(embed);
  });
});

describe("getRemainingTime", () => {
  it("calls moment.diff()", () => {
    const countdown = new Countdown(message, 60);
    countdown.endTime = moment() as jest.Mocked<moment.Moment>;

    countdown.getRemainingTime();
    expect(countdown.endTime.diff).toBeCalledWith(momentMock, "seconds");
  });
});

describe("createEmbedForRemainingTime", () => {
  it("returns an embed", async () => {
    const countdown = new Countdown(message, 60);

    countdown.getRemainingTime = jest.fn().mockReturnValue(100);
    countdown.getFormattedRemainingTime = jest.fn().mockReturnValue("1m 05s");
    const embed = countdown.createEmbedForRemainingTime();

    expect(embed.setTitle).toBeCalledWith("Countdown timer");
    expect(embed.setColor).toBeCalledWith(0xa8ffa8);
    expect(embed.setDescription).toBeCalledWith("Remaining time: 1m 05s");
  });
});

describe("getFormattedRemainingTime", () => {
  it.each([
    [0, "0m 00s"],
    [30, "0m 30s"],
    [45, "0m 45s"],
    [60, "1m 00s"],
    [100, "1m 40s"],
    [150, "2m 30s"],
    [180, "3m 00s"],
    [300, "5m 00s"],
    [2000, "33m 20s"],
    [3000, "50m 00s"]
  ])("formats correctly", (time, formatted) => {
    const countdown = new Countdown(message, 60);
    countdown.getRemainingTime = jest.fn().mockReturnValue(time);

    expect(countdown.getFormattedRemainingTime()).toBe(formatted);
  });
});
