const momentMock = {
  add: jest.fn(),
  diff: jest.fn()
};

import { Alarm } from "../../src/scheduledTask/Alarm";
import { Message } from "discord.js";
import moment from "moment";
import { Sound } from "../../src/commands/Sound";

jest.mock("discord.js");
jest.mock("moment", () => () => momentMock);
jest.mock("../../src/Logger");
jest.mock("../../src/commands/Sound");

const message = new (Message as jest.Mock<Message>)();

afterEach(() => jest.resetAllMocks());

describe("execute", () => {
  it("is sucessfull when remaining time is > 0 ", async () => {
    const countdown = new Alarm(message, 60);
    countdown.getTimeUntilExecution = jest.fn();

    const shouldStop = await countdown.execute();
    expect(shouldStop).toBe(false);
  });

  it.each([0, -1, -10])(
    "calls updateCountdownMessage when remaining time is <= 0 ",
    async remainingTime => {
      const countdown = new Alarm(message, 60);
      countdown.getTimeUntilExecution = jest
        .fn()
        .mockReturnValue(remainingTime);
      countdown.sendFinalMessage = jest.fn();

      const shouldStop = await countdown.execute();
      expect(shouldStop).toBe(true);
      expect(countdown.sendFinalMessage).toBeCalled();
    }
  );
});

describe("sendFinalMessage", () => {
  it("sends the correct message", async () => {
    const countdown = new Alarm(message, 60);

    await countdown.sendFinalMessage();
    expect(message.reply).toBeCalledWith("Time up yo");
    expect(Sound);
  });
});

describe("getRemainingTime", () => {
  it("calls moment.diff()", () => {
    const countdown = new Alarm(message, 60);
    countdown.endTime = moment() as jest.Mocked<moment.Moment>;

    countdown.getTimeUntilExecution();
    expect(countdown.endTime.diff).toBeCalledWith(momentMock, "seconds");
  });

  it("returns 0 when moment.diff returns < 0", () => {
    const countdown = new Alarm(message, 0);
    countdown.endTime = moment() as jest.Mocked<moment.Moment>;

    expect(countdown.getTimeUntilExecution()).toBe(0);
  });
});

describe("createEmbedForRemainingTime", () => {
  it("returns an embed", async () => {
    const countdown = new Alarm(message, 60);

    countdown.getTimeUntilExecution = jest.fn().mockReturnValue(100);
    countdown.getFormattedScheduledDate = jest.fn().mockReturnValue("1m 05s");
    const embed = countdown.createEmbedForRemainingTime();

    expect(embed.setURL).toBeCalledWith(
      "https://github.com/WeLoveRice/twitch-bot"
    );
    expect(embed.setTitle).toBeCalledWith("Check me out on GitHub!");
    expect(embed.setColor).toBeCalledWith(0xa8ffa8);
    expect(embed.setDescription).toBeCalledWith(
      "A countdown because people can't keep track of time"
    );
    expect(embed.addField).toBeCalledWith("Remaining time", "1m 05s");
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
    const countdown = new Alarm(message, 60);
    countdown.getTimeUntilExecution = jest.fn().mockReturnValue(time);

    expect(countdown.getFormattedScheduledDate()).toBe(formatted);
  });
});
