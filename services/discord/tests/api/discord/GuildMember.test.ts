import { GuildMember, Permissions } from "discord.js";
import { isAdmin } from "../../../src/api/discord/GuildMember";

jest.mock("discord.js");

it.each([true, false])(
  "returns %s when is admin is %s",
  async expectedAdmin => {
    const member = new (GuildMember as jest.Mock<GuildMember>)();
    Object.defineProperty(member, "permissions", {
      value: { has: jest.fn().mockReturnValue(expectedAdmin) }
    });

    expect(isAdmin(member)).toBe(expectedAdmin);
  }
);
