import { MuteAll } from "../../src/commands/MuteAll";
import { GuildMember, Message, VoiceState } from "discord.js";
import { Bot } from "../../src/enum/Bot";
import * as VoiceChannel from "../../src/api/discord/VoiceChannel";

jest.mock("../../src/api/discord/VoiceChannel");
jest.mock("discord.js");

const message = new (Message as jest.Mock<Message>)();

describe("isValid", () => {
  it.each([
    [false, false],
    [false, true],
    [true, false],
    [true, true]
  ])("mute: %s isAdmin: %s", async (mute, isAdmin) => {
    const permissions = { has: jest.fn().mockReturnValue(isAdmin) };
    const member = new (GuildMember as jest.Mock<GuildMember>)();
    Object.defineProperty(member, "permissions", {
      value: permissions,
      configurable: true
    });
    Object.defineProperty(message, "member", {
      value: member,
      configurable: true
    });
    const muteAll = new MuteAll(message, mute);

    expect(await muteAll.isValid()).toBe(isAdmin);
    expect(message.member?.permissions.has).toBeCalledWith("ADMINISTRATOR");
  });
});

describe("execute", () => {
  it.each([true, false])("mute: %s", async mute => {
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

    const muteAll = new MuteAll(message, mute);
    muteAll.isValid = jest.fn().mockReturnValue(Promise.resolve(true));

    await muteAll.execute();
    members.forEach(member => {
      expect(member.voice.setMute).toBeCalledWith(mute);
    });
  });
});
