import { Redis as RedisApi } from "../../src/api/redis";
import Redis, * as IORedis from "ioredis";

jest.mock("discord.js");
jest.mock("../../src/Logger");
jest.mock("ioredis");

beforeEach(() => {
  jest.resetAllMocks();
});
describe("connect", () => {
  it("runs as expected", async () => {
    expect(RedisApi.connect()).toBeInstanceOf(Redis);

    const ioredisMock = IORedis as jest.Mocked<typeof IORedis>;

    expect(ioredisMock).toBeCalledWith(6379, "redis");

    const poolInstance = ioredisMock.default.mock.instances[0];
    expect(poolInstance.on).toBeCalledWith("ready", expect.any(Function));
    expect(poolInstance.on).toBeCalledWith("error", expect.any(Function));
  });
});

describe("getConnection", () => {
  it("creates connection when not exist", () => {
    RedisApi.connect = jest.fn().mockReturnValue(new Redis());
    expect(RedisApi.getConnection()).toBeInstanceOf(Redis);
    expect(RedisApi.connect).toBeCalled();
  });

  it("returns redis connection if already exist", () => {
    RedisApi.connection = new Redis();
    expect(RedisApi.getConnection()).toBeInstanceOf(Redis);
    expect(Redis).toBeCalledWith();
  });
});
