import { main } from "../src/index";
import postgres from "../src/api/postgres";
import discord from "../src/api/discord";
import redis from "../src/api/redis";

jest.mock("../src/Logger", () => ({
  createLogger: jest.fn().mockReturnValue({
    info: jest.fn(),
    error: jest.fn()
  })
}));
jest.mock("../src/api/postgres");
jest.mock("../src/api/discord");
jest.mock("../src/api/redis");

it("runs expected", async () => {
  await main();

  expect(postgres.connect).toBeCalled();
  expect(discord.connect).toBeCalled();
  expect(redis.connect).toBeCalled();
});
