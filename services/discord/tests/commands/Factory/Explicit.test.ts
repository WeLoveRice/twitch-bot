import { JoinVoiceChannel } from "../../../src/commands/JoinVoiceChannel";
import { createExplicitCommand } from "../../../src/commands/Factory/Explicit";
import { Message } from "discord.js";
import { Command } from "../../../src/enum/CommandEnum";
import { createLogger } from "winston";

jest.mock("discord.js");
jest.mock("winston", () => ({
  createLogger: jest.fn()
}));

const MockedMessage = Message as jest.Mock<Message>;

let message = new MockedMessage();
let logger = createLogger();

beforeEach(() => {
  message = new MockedMessage();
  logger = createLogger();
});

it.each([
  "hello",
  "test",
  Command.PREFIX,
  Command.PREFIX.repeat(2),
  Command.JOIN
])("returns null when message content is %s", content => {
  message.content = content;
  const command = createExplicitCommand(message, logger);
  expect(command).toBe(null);
});

it(`returns voice when command is ${Command.PREFIX}${Command.JOIN}`, () => {
  message.content = `${Command.PREFIX}${Command.JOIN}`;
  const command = createExplicitCommand(message, logger);
  expect(command).toBeInstanceOf(JoinVoiceChannel);
});
