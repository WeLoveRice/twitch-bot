import { GuildMember } from "discord.js";

export const isAdmin = (member: GuildMember) => {
  return member.permissions.has("ADMINISTRATOR");
};
