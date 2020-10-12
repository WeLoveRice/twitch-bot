import { GuildMember } from "discord.js";

export const isAdmin = (member: GuildMember): boolean => {
  return member.permissions.has("ADMINISTRATOR");
};
