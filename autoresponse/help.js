const { MessageEmbed } = require("discord.js");

module.exports = {
 async execute(message) {
    //Help about autoresponses
    if (message.content != "+autoresponse help") return;
    let embed = new MessageEmbed()
      .setColor("#202225")
      .setTitle("Automated Responses Help & Usages")
      .setDescription("help me help me");

    return await message.reply({ embeds: [embed] })
  }
}