import postgres from "../../src/api/postgres";
import * as Sequelize from "sequelize";

jest.mock("discord.js");
jest.mock("../../src/Logger");
jest.mock("sequelize");

const sequelizeMock = Sequelize as jest.Mocked<typeof Sequelize>;

describe("connect", () => {
  it("connect calls expected", async () => {
    process.env.POSTGRES_HOST = "TEST_HOST";
    process.env.POSTGRES_DB = "TEST_DB";
    process.env.POSTGRES_USER = "TEST_USER";
    process.env.POSTGRES_PASSWORD = "TEST_PASS";
    await postgres.connect();

    expect(sequelizeMock.Sequelize).toBeCalledWith(
      "TEST_DB",
      "TEST_USER",
      "TEST_PASS",
      { host: "TEST_HOST", dialect: "postgres", logging: expect.any(Function) }
    );
  });
});
