import { VoiceChannelDisconnect } from "../../src/periodicTask/VoiceChannelDisconnect";
import { Runner } from "../../src/periodicTask/Runner";

jest.mock("./../../src/periodicTask/VoiceChannelDisconnect");

const mockPeriodicTask = VoiceChannelDisconnect as jest.Mock<
  VoiceChannelDisconnect
>;
let periodicTask = new mockPeriodicTask();
let runner = new Runner();

beforeEach(() => {
  jest.useFakeTimers();
  mockPeriodicTask.mockClear();
});

it("starts the timer when start is called", () => {
  // For some reason, can't mock periodic task execute to return a promise
  // and then assert the runner timer is null
  periodicTask = new mockPeriodicTask();
  runner = new Runner();

  expect(runner.timer).toBe(null);
  runner.start(periodicTask);

  jest.runOnlyPendingTimers();
  expect(runner.timer).not.toBe(null);
  expect(periodicTask.execute).toBeCalledTimes(1);

  runner.stop();
  expect(runner.timer).toBe(null);
});
