const { MessageEmbed } = require("discord.js");

module.exports = {
  async execute(message, autoResponsesList) {
    //Get list of all autoresponses
    if (message.content != "+autoresponse list") return;
    let embed = new MessageEmbed()
    var n = 0;
    for (let ares in autoResponsesList) {
      embed.addField(
        `**${n}. ${ares}**`,
        `${autoResponsesList[ares].response} ${autoResponsesList[ares].ignoredChannels ? ("\n\n**Ignored in:** " + autoResponsesList[ares].ignoredChannels) : ""}`,
        true
      ); n++
    }
    embed.setTitle("List Of All Automated Responses")
    return await message.reply({ embeds: [embed] })
  }
}