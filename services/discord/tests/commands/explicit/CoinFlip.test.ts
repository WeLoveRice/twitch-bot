import { CoinFlip } from "../../../src/commands/explicit/CoinFlip";
import { Message } from "discord.js";

jest.mock("discord.js");
jest.mock("../../../src/Logger");

const message = new (Message as jest.Mock<Message>)();
const coinFlip = new CoinFlip(message);

afterEach(() => {
  jest.resetAllMocks();
});

test("isValid returns true", async () => {
  expect(await coinFlip.isValid()).toBe(true);
});

describe("execute", () => {
  it("replies heads or tails evenly", async () => {
    jest.spyOn(coinFlip, "isValid").mockReturnValue(Promise.resolve(true));
    const reply = jest.spyOn(message, "reply");

    const flips = { heads: 0, tails: 0 };

    for (let i = 0; i < 1000; i++) {
      await coinFlip.execute();

      const content = reply.mock.calls[i][0] as string;
      content.includes("heads") ? flips.heads++ : flips.tails++;
    }

    expect(flips.heads).toBeGreaterThan(400);
    expect(flips.tails).toBeGreaterThan(400);
  });
});
