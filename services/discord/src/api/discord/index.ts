import { Client } from "discord.js";
import { createCommand } from "../../commands/factory";
import { createLogger } from "../../Logger";

const connect = () => {
  const logger = createLogger();
  const discord = new Client();

  discord.on("ready", () => {
    const { user } = discord;
    if (!user) {
      return;
    }
    console.log(`Logged in as ${user.tag}!`);
    logger.info("Connected to discord");
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
    logger.error(`discord error ${error}`);
    process.exit(1);
  });

  discord.login(process.env.DISCORD_TOKEN);
};

export default { connect };
