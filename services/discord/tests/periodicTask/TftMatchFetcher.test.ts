import { TftMatchFetcher } from "../../src/periodicTask/TftMatchFetcher";
import * as TftDatabase from "../../src/tft/database";
import * as riotApi from "../../src/api/riot";
import { TftSummoner } from "../../models/TftSummoner";
import { mocked } from "ts-jest/utils";

jest.mock("../../src/Logger");
jest.mock("../../src/tft/database");
jest.mock("../../src/api/riot");
jest.mock("../../models/TftSummoner");

const summonerName = "tester";
const mockTftDatabase = TftDatabase as jest.Mocked<typeof TftDatabase>;
const mockRiotApi = riotApi as jest.Mocked<typeof riotApi>;
const tftMatchFetcher = new TftMatchFetcher(summonerName);

afterEach(() => jest.resetAllMocks());

describe("execute", () => {
  it("calls insertDataForMatch", async () => {
    mockTftDatabase.fetchLatestUnprocessedMatchId.mockReturnValue(
      Promise.resolve("test_id")
    );
    await tftMatchFetcher.execute();
    expect(riotApi.getMatchDetail).toBeCalledWith("test_id");
  });

  it("does not call insertDataForMatch when matchId is null", async () => {
    await tftMatchFetcher.execute();
    expect(riotApi.getMatchDetail).not.toBeCalled();
  });
});

describe("insertDataForMatch", () => {
  it("inserts match detail when not exist", async () => {
    mockTftDatabase.matchDetailExists.mockReturnValue(Promise.resolve(false));
    await tftMatchFetcher.insertDataForMatch("test_id");

    expect(mockTftDatabase.insertMatchDetail).toBeCalled();
  });

  it("does not insert match detail when exists", async () => {
    mockTftDatabase.matchDetailExists.mockReturnValue(Promise.resolve(true));
    await tftMatchFetcher.insertDataForMatch("test_id");

    expect(mockTftDatabase.insertMatchDetail).not.toBeCalled();
  });
});
