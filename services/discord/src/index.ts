import Discord from "discord.js";

const client = new Discord.Client();

client.on("ready", () => {
  const { user } = client;
  if (!user) {
    return;
  }
  console.log(`Logged in as ${user.tag}!`);
});

client.on("message", msg => {
  if (typeof msg.reply !== "function") {
    return;
  }
  if (msg.content === "ping") {
    msg.reply("pong");
  }
});

client.login("NjM1NDcwMjg0MTI3ODYyNzk1.Xaxi3Q.NwIPq5f0eucSvLByAZxSJCprmiI");
