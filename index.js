const { Client,Collection } = require("discord.js");
const botChannelId = process.env['botChannelId'];
const { readdirSync } = require("fs");
const { join } = require("path");
const { escapeRegex } = require("./utils");
const  PRUNING = process.env['PRUNING'];

const client = new Client({
  disableMentions: "everyone",
  restTimeOffset: 0
});

const TOKEN = process.env['TOKEN']
client.login(TOKEN);
client.commands = new Collection();
client.functions = new Collection();

/**
* Client Events
*/
client.on("ready", () => {
  console.log(`${client.user.username} ready!`);
  client.user.setActivity("Sketchware Pro Bot Scuffed Version");
});


/**
* Import all commands
*/
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

/**
* Import all functions
*/
const funcFiles = readdirSync(join(__dirname, "functions")).filter((file) => file.endsWith(".js"));
for (const file of funcFiles) {
  const funct = require(join(__dirname, "functions", `${file}`));
  client.functions.set(funct,funct);
}



client.on("message", async (message) => {
  if (message.author.id == client.user.id) return;
  if (!message.guild) return;

  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex("+")})\\s*`);
  if (prefixRegex.test(message.content)) {
    const [,
      matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
    if (command) {
      if (message.channel.id != botChannelId) {
        if (PRUNING) {
          return message.reply(`Use <#${botChannelId}> else Nub`).then(msg => {
            msg.delete({
              timeout: 12000
            });
          });
        }
        return message.reply(`Use <#${botChannelId}> else Nub`);
      }
      return command.execute(message, args);
    }
    return;
  }

  client.functions.forEach(func=> {
    func.execute(message);
  });
});
//KeepAlive
require("http").createServer((_, res) => res.end("Alive")).listen(8080)