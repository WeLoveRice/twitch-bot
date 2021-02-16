import { Message } from "discord.js";
import { Command } from "../../../src/enum/CommandEnum";
import { JoinVoiceChannel } from "../../../src/commands/JoinVoiceChannel";
import { createExplicitCommand } from "../../../src/commands/factory/Explicit";
import { SoundList } from "../../../src/commands/explicit/SoundList";
import { CoinFlip } from "../../../src/commands/explicit/CoinFlip";
import { MuteAll } from "../../../src/commands/explicit/MuteAll";

jest.mock("discord.js");
jest.mock("../../../src/commands/explicit/MuteAll");

const message = new (Message as jest.Mock<Message>)();

afterEach(() => jest.resetAllMocks());

describe("extractCommandFromContent", () => {
  it.each([Command.PREFIX]);
});
describe("createExplicitCommand", () => {
  it.each([
    "",
    "5",
    "''",
    "hello",
    "test",
    Command.PREFIX,
    Command.PREFIX.repeat(2),
    Command.JOIN,
    Command.SOUNDS
  ])("returns null when message content is %s", content => {
    message.content = content;
    const command = createExplicitCommand(message);
    expect(command).toBe(null);
  });

  it.each([
    [Command.JOIN, JoinVoiceChannel],
    [Command.SOUNDS, SoundList],
    [Command.COINFLIP, CoinFlip]
  ])(
    `when command is ${Command.PREFIX}%s returns expected class`,
    (commandString, commandClass) => {
      message.content = `${Command.PREFIX}${commandString}`;
      const command = createExplicitCommand(message);
      expect(command).toBeInstanceOf(commandClass);
    }
  );

  it.each([
    [Command.MUTEALL, true],
    [Command.UNMUTEALL, false]
  ])(
    `when command is ${Command.PREFIX}%s muteall is called with %s`,
    (commandString, mute) => {
      message.content = `${Command.PREFIX}${commandString}`;
      const command = createExplicitCommand(message);
      expect(command).toBeInstanceOf(MuteAll);
      expect(MuteAll).toBeCalledWith(message, mute);
    }
  );
});
