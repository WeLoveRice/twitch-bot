import { Countdown } from "../../src/periodicTask/Countdown";
import {
  Message,
  MessageEmbed,
  Channel,
  VoiceChannel,
  TextChannel
} from "discord.js";

jest.mock("winston", () => ({
  createLogger: jest.fn().mockReturnValue({
    error: jest.fn()
  })
}));
jest.mock("discord.js");

const message = new (Message as jest.Mock<Message>)();

afterEach(() => jest.resetAllMocks());

it("can call execute", async () => {
  const countdown = new Countdown(message, 60);
  countdown.getRemainingTime = jest.fn();
  countdown.updateCountdownMessage = jest.fn();
  await countdown.execute();
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
