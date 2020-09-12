import { createCommand } from "./commands/Factory/index";
import { createLogger } from "./Logger";
import Discord from "discord.js";

const logger = createLogger();
const discord = new Discord.Client();

discord.on("ready", () => {
  const { user } = discord;
  if (!user) {
    return;
  }
  console.log(`Logged in as ${user.tag}!`);
  logger.info("Started");
});

discord.on("message", async message => {
  const command = await createCommand(message);
  if (command === null) {
    return;
  }
  await command.execute();
});

discord.on("error", error => {
  const logger = createLogger();
  logger.error(error);
  process.exit(1);
});

discord.login(process.env.DISCORD_TOKEN);
