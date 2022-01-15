const { MessageEmbed } = require("discord.js");
const botChannel = process.env['botChannelId'];

module.exports = {
  name: "help",
  description: "Display all commands and descriptions",
  usage: "Usage: " + `Send \`+%name%\` In <#${botChannel}>`,
  execute(message, args) {
    if (!args[0]) {
      let helpEmbed = new MessageEmbed()
        .setTitle("Available Commands for " + message.client.user.username)
        .setDescription("For more info on a specific command, use +help <command>")
        .setColor("#4287f5");
      message.client.commands.each((cmd) => {
        helpEmbed.addField(
          `**+${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}**`,
          `${cmd.description}`,
          true
        );
      });

      helpEmbed.addField("** More Passive Stuffs (Mostly For Fun)**", " These are automatically executed, or look for usage", false)
      message.client.functions.each((cmd) => {
        if (!cmd.hidden)
          helpEmbed.addField(
            `**${cmd.name}**`,
            `${cmd.description}`,
            true
          );
      });
      return message.reply({ embeds: [helpEmbed] });
    }

    /*
    * Send detailed description for each one seperately
    */
    let cmd =
      message.client.commands.get(args[0]) ||
      message.client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(args[0]));
    if (!cmd) {
      cmd = message.client.functions.get(args[0].toLowerCase()) ||
        message.client.functions.find((cmd) => cmd.name.toLowerCase().startsWith(args[0].toLowerCase()));
    }
    if (!cmd) return message.reply("Don't do fake, do real")
    if (cmd.hidden) return message.reply("Ssssh.. you're not supposed to see that")
    if (!cmd.usage) return message.reply("This is not a thing to use, It happens automatically upon certain condition")

    let helpEmbed = new MessageEmbed()
      .setTitle("Detailed Description For ``" + cmd.name + "``")
      .setColor("#4287f5");
    helpEmbed.addField(
      `**+${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}**`,
      `${cmd.description}`,
      true
    );
    helpEmbed.addField(
      "**Usage:**",
      cmd.usage.replace("%name%", cmd.name).replace("Usage:", ""),
      true
    );
    return message.reply({ embeds: [helpEmbed] });
  }
};