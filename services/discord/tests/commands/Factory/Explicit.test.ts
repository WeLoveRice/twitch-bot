import { JoinVoiceChannel } from "../../../src/commands/JoinVoiceChannel";
import { createExplicitCommand } from "../../../src/commands/Factory/Explicit";
import { Message } from "discord.js";
import { Command } from "../../../src/enum/CommandEnum";
import { createLogger } from "winston";
import { SoundList } from "../../../src/commands/SoundList";

jest.mock("discord.js");
jest.mock("winston", () => ({
  createLogger: jest.fn()
}));

const message = new (Message as jest.Mock<Message>)();
const logger = createLogger();

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
  const command = createExplicitCommand(message, logger);
  expect(command).toBe(null);
});

it.each([
  [Command.JOIN, JoinVoiceChannel],
  [Command.SOUNDS, SoundList]
])(
  `when command is ${Command.PREFIX}%s returns %s`,
  (commandString, commandClass) => {
    message.content = `${Command.PREFIX}${commandString}`;
    const command = createExplicitCommand(message, logger);
    expect(command).toBeInstanceOf(commandClass);
  }
);
