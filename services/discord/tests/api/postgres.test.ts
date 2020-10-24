import postgres from "../../src/api/postgres";
import * as Postgres from "pg";

jest.mock("discord.js");
jest.mock("../../src/Logger");
jest.mock("pg");

it("runs as expected", async () => {
  process.env.POSTGRES_DB = "TEST_DB";
  process.env.POSTGRES_USER = "TEST_USER";
  process.env.POSTGRES_PASSWORD = "TEST_PASS";

  await postgres.connect();

  const postgresMock = Postgres as jest.Mocked<typeof Postgres>;

  expect(postgresMock.Pool).toBeCalledWith({
    host: "postgres",
    database: "TEST_DB",
    user: "TEST_USER",
    password: "TEST_PASS"
  });

  const poolInstance = postgresMock.Pool.mock.instances[0];
  expect(poolInstance.on).toBeCalledWith("connect", expect.any(Function));
  expect(poolInstance.on).toBeCalledWith("error", expect.any(Function));
  expect(poolInstance.connect).toBeCalled();
});
