import { getVideoTitle, titleToSafePath } from "../../src/api/youtubeDl";
import { exec } from "mz/child_process";
import path from "path";

jest.mock("discord.js");
jest.mock("mz/child_process", () => ({
  exec: jest.fn()
}));
beforeEach(() => {
  jest.resetAllMocks();
});

describe("getVideoTitle", () => {
  it("calls the correct command", async () => {
    (exec as jest.MockedFunction<typeof exec>).mockResolvedValueOnce([
      "hello",
      "world"
    ]);
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const videoTitle = await getVideoTitle(url);

    expect(exec).toBeCalledWith(`youtube-dl --get-title ${url}`);
    expect(videoTitle).toBe("hello");
  });
});

describe("titleToSafePath", () => {
  it.each([
    ["The Greatest Showman", "The Greatest Showman"],
    [
      "【热爱105°C的你 / 阿肆 Super Idol】Japanese Cover",
      "【热爱105°C的你 | 阿肆 Super Idol】Japanese Cover"
    ],
    [
      "K/DA - MORE ft. Madison Beer, (G)I-DLE, Lexie Liu, Jaira Burns, Seraphine (Official Music Video)",
      "K|DA - MORE ft. Madison Beer, (G)I-DLE, Lexie Liu, Jaira Burns, Seraphine (Official Music Video)"
    ]
  ])("converts a title to a safe file path", (originalTitle, expectedTitle) => {
    const safePath = titleToSafePath(originalTitle);

    const expectedPath = path.join(
      __dirname,
      "..",
      "..",
      "music",
      `${expectedTitle}.mp3`
    );

    expect(safePath).toBe(expectedPath);
  });
});
