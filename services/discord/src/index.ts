import { createLogger } from "./Logger";
import { createCommand } from "./commands/Factory";
import Discord from "discord.js";

const client = new Discord.Client();

client.on("ready", () => {
  const { user } = client;
  if (!user) {
    return;
  }
  console.log(`Logged in as ${user.tag}!`);
  const logger = createLogger();
  logger.info("Started");
});

client.on("message", message => {
  const command = createCommand(client, message);
  if (command === null) {
    return;
  }

  command.execute();
});

client.login("NjM1NDcwMjg0MTI3ODYyNzk1.Xaxi3Q.NwIPq5f0eucSvLByAZxSJCprmiI");
