const { Client, Collection, Intents, WebhookClient } = require("discord.js");
const botChannelId = process.env['botChannelId'];
const { readdirSync } = require("fs");
const { join } = require("path");
const { escapeRegex, getWebHook } = require("./utils");
const replitDB = require("@replit/database");
const guildID = process.env['guildID']

const client = new Client({
  restTimeOffset: 0,
  intents: new Intents(32767) //Intents.ALL , yea im lazy 😔
});
const db = new replitDB()
const TOKEN = process.env['TOKEN']
client.login(TOKEN);
client.commands = new Collection();
client.functions = new Collection();

/**
* Client Events
*/

client.on("ready", () => {
  console.log(`${client.user.username} ready!`);
  client.user.setActivity("with your life | +help");
  updateMembers(client.guilds.cache.get(guildID))
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
  client.functions.set(funct, funct);
}

/**
* Members Counter
*/
const counterChannelId = process.env['memberCounterChannelId']
const updateMembers = (guild) => {
  client.channels.fetch(counterChannelId).then(channel => {
    channel.setName(`${guild.memberCount.toLocaleString()}-members`) //Allowed only 2 times every 10 min lol
  })
}

client.on('guildMemberAdd', (member) => updateMembers(member.guild))
client.on('guildMemberRemove', (member) => updateMembers(member.guild))

/**
* Store Deleted Messages for Expo.. Umm, Sniping Purposes
*/

client.on('messageDelete', (message) => {
  // content is null or deleted embed
  if (message.partial ||
    (message.embeds.length && !message.content)) return;
  if (message.author.bot) return; // Ignore bots deletion


  db.set("snipe" + [message.channel.id],
    {
      author: message.author,
      content: message.content,
      createdAt: message.createdTimestamp,
      image: message.attachments.first()
        ? message.attachments.first().proxyURL
        : null
    }
  );
});

/**
* Handle & Execute Messages
*/
client.on("messageCreate", async (message) => {
  if (message.author.id == client.user.id) return;
  if (!message.guild) return;

  /**
  * Firstly looping through all the functions
  */
  client.functions.forEach(func => {
    func.execute(message);
  });

  /**
  * Begin parsing if message is command
  */
  //This basically means prefix is +
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex("+")})\\s*`);
  if (!prefixRegex.test(message.content)) return;

  //TODO: Understand what this part does
  const [, matchedPrefix] = message.content.match(prefixRegex);
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (command) {
    if (!command.anychannel && message.channel.id != botChannelId) {
      if (!false) return message.reply(`Use <#${botChannelId}> else Nub`);
      return message.reply(`Use <#${botChannelId}> else Nub`).then(msg => {
        msg.delete({
          timeout: 12000
        });
      });
    }
    return command.execute(message, args);
  }
});

/*
* Prevents bot from crashing if exception occurs
*/
process.on('uncaughtException', function(error) {
  console.log(error.stack);
});

//KeepAlive
require("http").createServer((_, res) => res.end("Alive")).listen(8080)