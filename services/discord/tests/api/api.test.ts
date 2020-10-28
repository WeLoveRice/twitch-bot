import { TftApi } from "twisted";
import { getTftApi } from "../../src/api/riot";

describe("getTftpi", () => {
  it("throws an error when RIOT_API key is not set", async () => {
    expect(getTftApi).toThrow("RIOT_API env not defined");
  });

  it("returns a TftApi instance", () => {
    process.env.RIOT_API = "test_api_key";
    const tftApi = getTftApi();
    expect(tftApi).toBeInstanceOf(TftApi);
  });
});
