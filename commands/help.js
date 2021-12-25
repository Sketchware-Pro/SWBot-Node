const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  description: "Display all commands and descriptions",
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

      helpEmbed.addField("** More Passive Stuffs**", " These are automatically executed", false)
      message.client.functions.each((cmd) => {
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
    const cmd =
      message.client.commands.get(args[0]) ||
      message.client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(args[0]));
    if (!cmd) return message.reply("Don't do fake, do real")
    let helpEmbed = new MessageEmbed()
      .setTitle("Detailed Description For ``" + args[0] + "``")
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