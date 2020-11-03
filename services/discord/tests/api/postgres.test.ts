import postgres from "../../src/api/postgres";
import * as Sequelize from "sequelize";
import { initModels } from "../../models/init-models";
import { mocked } from "ts-jest/utils";

jest.mock("discord.js");
jest.mock("../../src/Logger");
jest.mock("sequelize");
jest.mock("../../models/init-models");

const sequelizeMock = Sequelize as jest.Mocked<typeof Sequelize>;
const mockedInitModels = mocked(initModels);

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
    expect(sequelizeMock.Sequelize.mock.instances[0].authenticate).toBeCalled();
    expect(mockedInitModels).toBeCalled();
  });
});
