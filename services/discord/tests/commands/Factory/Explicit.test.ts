import { JoinVoiceChannel } from "../../../src/commands/JoinVoiceChannel";
import { createExplicitCommand } from "../../../src/commands/Factory/Explicit";
import { Message } from "discord.js";
import { Command } from "../../../src/enum/Command";
jest.mock("discord.js");

const MockedMessage = Message as jest.Mock<Message>;
let message = new MockedMessage();

beforeEach(() => {
  message = new MockedMessage();
});

it.each([
  "hello",
  "test",
  Command.PREFIX,
  Command.PREFIX.repeat(2),
  Command.JOIN
])("returns null when message content is %s", content => {
  message.content = content;
  const command = createExplicitCommand(message);
  expect(command).toBe(null);
});

it(`returns voice when command is ${Command.PREFIX}${Command.JOIN}`, () => {
  message.content = `${Command.PREFIX}${Command.JOIN}`;
  const command = createExplicitCommand(message);
  expect(command).toBeInstanceOf(JoinVoiceChannel);
});
