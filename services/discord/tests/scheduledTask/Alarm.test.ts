const momentMock = {
  add: jest.fn(),
  diff: jest.fn(),
  format: jest.fn()
};

import { Alarm } from "../../src/scheduledTask/Alarm";
import { Message } from "discord.js";
import moment from "moment";
import { Sound } from "../../src/commands/Sound";

jest.mock("discord.js");
jest.mock("moment", () => () => momentMock);
jest.mock("../../src/Logger");
jest.mock("../../src/commands/Sound");
jest.useFakeTimers();

const message = new (Message as jest.Mock<Message>)();

afterEach(() => jest.resetAllMocks());

describe("start", () => {
  it.each([10, 100, 1000])("schdules correctly", async scheduledTime => {
    const alarm = new Alarm(message, scheduledTime);
    alarm.sendFinalMessage = jest.fn();
    alarm.getTimeUntilExecution = jest.fn().mockReturnValue(scheduledTime);

    await alarm.start();

    expect(setTimeout).toBeCalledWith(
      expect.any(Function),
      scheduledTime * 1000
    );
  });
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
    countdown.scheduledDate = moment() as jest.Mocked<moment.Moment>;

    countdown.getTimeUntilExecution();
    expect(countdown.scheduledDate.diff).toBeCalledWith(momentMock, "seconds");
  });

  it("returns 0 when moment.diff returns < 0", () => {
    const countdown = new Alarm(message, 0);
    countdown.scheduledDate = moment() as jest.Mocked<moment.Moment>;

    expect(countdown.getTimeUntilExecution()).toBe(0);
  });
});

describe("createEmbedForRemainingTime", () => {
  it("returns an embed", async () => {
    const countdown = new Alarm(message, 60);

    countdown.getTimeUntilExecution = jest.fn().mockReturnValue(100);
    countdown.getFormattedScheduledDate = jest.fn().mockReturnValue("09:00:15");
    const embed = countdown.createEmbedForRemainingTime();

    expect(embed.setURL).toBeCalledWith(
      "https://github.com/WeLoveRice/twitch-bot"
    );
    expect(embed.setTitle).toBeCalledWith("Check me out on GitHub!");
    expect(embed.setColor).toBeCalledWith(0xa8ffa8);
    expect(embed.setDescription).toBeCalledWith(
      "An alarm because people can't keep track of time"
    );
    expect(embed.addField).toBeCalledWith("Alarm will ring at: ", "09:00:15");
  });
});

describe("getFormattedScheduledDate", () => {
  it("formats correctly", () => {
    const alarm = new Alarm(message, 60);
    alarm.scheduledDate = moment() as jest.Mocked<moment.Moment>;

    alarm.getFormattedScheduledDate();
    expect(alarm.scheduledDate.format).toBeCalledWith("HH:mm:ss");
  });
});
