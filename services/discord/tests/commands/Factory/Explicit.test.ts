import { JoinVoiceChannel } from "../../../src/commands/JoinVoiceChannel";
import { createExplicitCommand } from "../../../src/commands/Factory/Explicit";
import { Message } from "discord.js";
import { Command } from "../../../src/enum/CommandEnum";
import { SoundList } from "../../../src/commands/SoundList";

jest.mock("discord.js");
jest.mock("../../../src/Logger", () => ({
  createLogger: jest.fn()
}));

const message = new (Message as jest.Mock<Message>)();

afterEach(() => jest.resetAllMocks());

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
  [Command.SOUNDS, SoundList]
])(
  `when command is ${Command.PREFIX}%s returns %s`,
  (commandString, commandClass) => {
    message.content = `${Command.PREFIX}${commandString}`;
    const command = createExplicitCommand(message);
    expect(command).toBeInstanceOf(commandClass);
  }
);
