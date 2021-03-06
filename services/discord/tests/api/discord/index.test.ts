import * as Discord from "discord.js";
import discordApi from "../../../src/api/discord";

jest.mock("discord.js");
jest.mock("../../../src/commands/factory");
jest.mock("../../../src/Logger");

it("runs as expected", () => {
  discordApi.connect();

  const discordMock = Discord as jest.Mocked<typeof Discord>;
  const clientEventListener = discordMock.Client.mock.instances[0].on;

  expect(clientEventListener).toBeCalledWith("ready", expect.any(Function));
  expect(clientEventListener).toBeCalledWith("message", expect.any(Function));
  expect(clientEventListener).toBeCalledWith("error", expect.any(Function));
});
