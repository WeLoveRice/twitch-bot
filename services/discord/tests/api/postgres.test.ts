import postgres, { pool } from "../../src/api/postgres";
import * as Postgres from "pg";

jest.mock("discord.js");
jest.mock("../../src/Logger");
jest.mock("pg");

const postgresMock = Postgres as jest.Mocked<typeof Postgres>;
describe("pool", () => {
  it("calls returns instanceof Pool", () => {
    expect(pool).toBeInstanceOf(Postgres.Pool);
  });
});

describe("connect", () => {
  it("connect calls expected", async () => {
    await postgres.connect();

    const poolInstance = postgresMock.Pool.mock.instances[0];
    expect(poolInstance.on).toBeCalledWith("connect", expect.any(Function));
    expect(poolInstance.on).toBeCalledWith("error", expect.any(Function));
    expect(poolInstance.connect).toBeCalled();
  });
});
