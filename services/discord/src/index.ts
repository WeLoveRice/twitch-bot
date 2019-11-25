import { createCommand } from "./commands/Factory/index";
import { createLogger } from "./Logger";
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
  const logger = createLogger();
  const command = createCommand(message, logger);
  if (command === null) {
    return;
  }
  console.log(command.constructor.name);
  command.execute();
});

client.on("error", error => {
  const logger = createLogger();
  logger.error(error);
  process.exit(1);
});

client.login("NjM1NDcwMjg0MTI3ODYyNzk1.Xaxi3Q.NwIPq5f0eucSvLByAZxSJCprmiI");
