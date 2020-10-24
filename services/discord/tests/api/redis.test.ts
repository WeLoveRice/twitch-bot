import redis from "../../src/api/redis";
import * as ioredis from "ioredis";

jest.mock("discord.js");
jest.mock("../../src/Logger");
jest.mock("ioredis");

it("runs as expected", async () => {
  expect(await redis.connect()).toBeInstanceOf(ioredis.default);

  const ioredisMock = ioredis as jest.Mocked<typeof ioredis>;

  expect(ioredisMock.default).toBeCalledWith(6379, "redis");

  const poolInstance = ioredisMock.default.mock.instances[0];
  expect(poolInstance.on).toBeCalledWith("ready", expect.any(Function));
  expect(poolInstance.on).toBeCalledWith("error", expect.any(Function));
});
