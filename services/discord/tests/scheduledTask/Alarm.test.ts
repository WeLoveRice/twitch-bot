const momentMock = {
  add: jest.fn(),
  diff: jest.fn(),
  format: jest.fn(),
  tz: jest.fn()
};

import { Alarm } from "../../src/scheduledTask/Alarm";
import { Message } from "discord.js";
import moment from "moment-timezone";
import { Sound } from "../../src/commands/Sound";

jest.mock("discord.js");
jest.mock("moment-timezone", () => () => momentMock);
jest.mock("../../src/Logger");
jest.mock("../../src/commands/Sound");
jest.useFakeTimers();

const message = new (Message as jest.Mock<Message>)();

afterEach(() => jest.resetAllMocks());

describe("getTimeUntilExecution", () => {
  it("calls moment.diff()", () => {
    const alarm = new Alarm(message, 60);
    alarm.scheduledDate = moment();

    alarm.getTimeUntilExecution();
    expect(alarm.scheduledDate.diff).toBeCalledWith(momentMock, "seconds");
  });

  it("returns 0 when moment.diff returns < 0", () => {
    const alarm = new Alarm(message, 0);
    alarm.scheduledDate = moment();

    expect(alarm.getTimeUntilExecution()).toBe(0);
  });
});

describe("getFormattedScheduledDate", () => {
  it("formats correctly", () => {
    const alarm = new Alarm(message, 60);
    alarm.scheduledDate = moment();
    alarm.scheduledDate.tz = jest.fn().mockReturnValue(moment());
    alarm.getFormattedScheduledDate();

    expect(alarm.scheduledDate.tz).toBeCalledWith("Europe/London");
    expect(moment().format).toBeCalledWith("HH:mm:ss");
  });
});

describe("createEmbedForRemainingTime", () => {
  it("returns an embed", async () => {
    const alarm = new Alarm(message, 60);

    alarm.getTimeUntilExecution = jest.fn().mockReturnValue(100);
    alarm.getFormattedScheduledDate = jest.fn().mockReturnValue("09:00:15");
    const embed = alarm.createEmbedForRemainingTime();

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

describe("sendAlarmMessage", () => {
  it("sends the correct message", async () => {
    const alarm = new Alarm(message, 60);

    await alarm.sendAlarmMessage(alarm.message);
    expect(message.reply).toBeCalledWith("Time up yo");
    expect(Sound);
  });
});

describe("start", () => {
  it.each([10, 100, 1000])("schdules correctly", async scheduledTime => {
    const alarm = new Alarm(message, scheduledTime);
    alarm.sendAlarmMessage = jest.fn();
    alarm.getTimeUntilExecution = jest.fn().mockReturnValue(scheduledTime);
    alarm.createEmbedForRemainingTime = jest.fn();

    await alarm.start();
    jest.runAllTimers();

    expect(setTimeout).toBeCalledWith(
      expect.any(Function),
      scheduledTime * 1000
    );
  });
});
