import { VoiceChannelDisconnect } from "./../../src/PeriodicTask/VoiceChannelDisconnect";
import { Runner } from "../../src/periodicTask/Runner";

jest.mock("./../../src/PeriodicTask/VoiceChannelDisconnect");

const mockPeriodicTask = VoiceChannelDisconnect as jest.Mock<
  VoiceChannelDisconnect
>;
let periodicTask = new mockPeriodicTask();
let runner = new Runner(periodicTask);

beforeEach(() => {
  jest.useFakeTimers();
  mockPeriodicTask.mockClear();
});

describe("Runner Test", () => {
  it("starts the timer when start is called", () => {
    periodicTask = new mockPeriodicTask();
    runner = new Runner(periodicTask);

    expect(runner.timer).toBe(null);
    runner.start();

    jest.runOnlyPendingTimers();
    expect(runner.timer).not.toBe(null);
    expect(periodicTask.execute).toBeCalledTimes(1);

    runner.stop();
    expect(runner.timer).toBe(null);
  });
});
