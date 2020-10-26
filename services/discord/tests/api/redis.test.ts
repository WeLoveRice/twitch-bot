import { Redis as RedisApi } from "../../src/api/redis";
import * as Redis from "ioredis";

jest.mock("discord.js");
jest.mock("../../src/Logger");
jest.mock("ioredis");

describe("connect", () => {
  it("runs as expected", async () => {
    expect(RedisApi.connect()).toBeInstanceOf(Redis.default);

    const ioredisMock = Redis as jest.Mocked<typeof Redis>;

    expect(ioredisMock).toBeCalledWith(6379, "redis");

    const poolInstance = ioredisMock.default.mock.instances[0];
    expect(poolInstance.on).toBeCalledWith("ready", expect.any(Function));
    expect(poolInstance.on).toBeCalledWith("error", expect.any(Function));
  });
});

describe("getConnection", () => {
  it("returns a redis connection", () => {
    expect(RedisApi.getConnection()).toBeInstanceOf(Redis.default);
  });
});
