import { UnmuteAll } from "../../src/commands/UnmuteAll";
import { GuildMember, Message, VoiceState } from "discord.js";
import { Bot } from "../../src/enum/Bot";
import * as VoiceChannel from "../../src/api/discord/VoiceChannel";

jest.mock("../../src/api/discord/VoiceChannel");
jest.mock("discord.js");

const message = new (Message as jest.Mock<Message>)();

it("runs correctly", async () => {
  const memberMock = new (GuildMember as jest.Mock<GuildMember>)();

  Object.defineProperty(memberMock, "voice", {
    value: new (VoiceState as jest.Mock<VoiceState>)()
  });

  const members = new Map();
  members.set(Bot.USER_ID, memberMock);
  members.set("Test", memberMock);
  members.set("Cheese", memberMock);

  Object.defineProperty(VoiceChannel, "getVoiceChannelFromMessage", {
    value: jest.fn().mockReturnValue({ members })
  });

  const muteAll = new UnmuteAll(message);

  await muteAll.execute();
  members.forEach(member => {
    expect(member.voice.setMute).toBeCalledWith(false);
  });
});
