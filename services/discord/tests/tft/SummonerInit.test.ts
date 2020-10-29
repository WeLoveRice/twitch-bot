import * as riotApi from "../../src/api/riot";
import { initialiseSummoners } from "../../src/tft/SummonerInit";

jest.mock("sleep-promise");
jest.mock("../../src/Logger", () => ({
  createLogger: jest.fn().mockReturnValue({
    info: jest.fn(),
    error: jest.fn()
  })
}));
jest.mock("../../src/api/riot");
jest.mock("../../models/TftSummoner");

describe("initialiseSummoners", () => {
  it("does not run when LOL_USERS is not set", async () => {
    await initialiseSummoners();
    expect(riotApi.getSummoner).not.toBeCalled();
  });
});
