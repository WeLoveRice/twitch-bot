import * as riotApi from "../../src/api/riot";
import * as summonerInit from "../../src/tft/SummonerInit";
import * as TftSummoner from "../../models/TftSummoner";
import { mocked } from "ts-jest/utils";

const mockRiotApi = mocked(riotApi);
const mockTftSummoner = mocked(TftSummoner);

jest.mock("sleep-promise");
jest.mock("../../src/Logger", () => ({
  createLogger: jest.fn().mockReturnValue({
    info: jest.fn()
  })
}));
jest.mock("../../src/api/riot");
jest.mock("../../models/TftSummoner");

describe("initialiseSummoners", () => {
  const initSummoner = jest
    .spyOn(summonerInit, "initSummoner")
    .mockImplementation();
  afterAll(() => {
    initSummoner.mockRestore();
  });
  it.each(["Test1", "Test1,Test2", "Test1,Test2,Test3"])(
    "should call init summoner for %s",
    async summoners => {
      process.env.LOL_USERS = summoners;

      await summonerInit.initialiseSummoners();
      expect(initSummoner).toBeCalledTimes(summoners.split(",").length);
      initSummoner.mockReset();
    }
  );
  it("does not run when LOL_USERS is not set", async () => {
    await summonerInit.initialiseSummoners();
    expect(riotApi.getSummoner).not.toBeCalled();
  });
});

describe("initSummoner", () => {
  it("does not createSummoner when already exists", async () => {
    mockRiotApi.getSummoner = jest.fn().mockReturnValue(
      Promise.resolve({
        response: {
          id: "TEST_1"
        }
      })
    );

    mockTftSummoner.TftSummoner.count = jest
      .fn()
      .mockReturnValue(Promise.resolve(1));

    await summonerInit.initSummoner("SUMMONER_NAME");
    expect(mockRiotApi.getSummoner).toBeCalledWith("SUMMONER_NAME");
    expect(mockTftSummoner.TftSummoner.count).toBeCalledWith({
      where: { riotId: "TEST_1" }
    });
    expect(mockTftSummoner.TftSummoner.create).not.toBeCalled();
  });

  it("calls create when summoner does not exist", async () => {
    const response = {
      id: "TEST_1",
      name: "TESTER",
      puuid: "abc123"
    };
    mockRiotApi.getSummoner = jest
      .fn()
      .mockReturnValue(Promise.resolve({ response }));

    mockTftSummoner.TftSummoner.count = jest
      .fn()
      .mockReturnValue(Promise.resolve(0));

    await summonerInit.initSummoner("SUMMONER_NAME");
    expect(mockTftSummoner.TftSummoner.create).toBeCalledWith({
      puuid: response.puuid,
      name: response.name,
      riotId: response.id
    });
  });
});
