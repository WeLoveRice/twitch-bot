import { main } from "../src/index";

jest.mock("../src/Logger", () => ({
  createLogger: jest.fn().mockReturnValue({
    info: jest.fn(),
    error: jest.fn()
  })
}));
jest.mock("../src/api/postgres");
jest.mock("../src/api/discord");
jest.mock("../src/api/redis");

it("runs expected", async () => {
  await main();
});
