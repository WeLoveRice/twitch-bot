import { Message } from "discord.js";
import { Help } from "../../../src/commands/explicit/Help";

jest.mock("discord.js");
jest.mock("../../../src/Logger");

const message = new (Message as jest.Mock<Message>)();
const help = new Help(message);

afterEach(() => {
  jest.resetAllMocks();
});

test("isValid returns true", async () => {
  expect(await help.isValid()).toBe(true);
});

describe("execute", () => {
  it("returns list of commands", async () => {
    jest.spyOn(help, "isValid").mockReturnValue(Promise.resolve(true));

    await help.execute();
    expect(message.reply).toBeCalledWith(`
1. ^join
2. ^sounds
3. ^coinflip
4. ^help
5. ^muteall
6. ^unmuteall`);
  });
});
