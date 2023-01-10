const { MessageEmbed } = require("discord.js")
const { snipeDB } = require("../utils.js")

module.exports = {
  name: "snipe",
  anychannel: true,
  usage: "Send ``+snipe`` in the targeted channel",
  description: "Get last message which is deleted with message Author and Image(If any)",
  async execute(message) {
    if (!message.content.startsWith(`+${this.name}`)) return;

    let deleted = snipeDB[0]
    let snipe = await deleted.get("snipe" + message.channel.id)

    let parts = message.content.split(" ");
    let number = parts[1];
    if (number) {
        deleted = snipeDB[number-1]
        snipe = await deleted.get("snipe" + message.channel.id)
    }

    if (!snipe) return message.reply("There's nothing to snipe!")
    const embed = new MessageEmbed()
              .setAuthor(snipe.author.tag, snipe.author.avatarURL)
              .setFooter(`#${message.channel.name}`)
              .setTimestamp(snipe.createdAt);
            snipe.content ? embed.setDescription(snipe.content) : null;
            snipe.image ? embed.setImage(snipe.image) : null;

            await message.reply({ embeds: [embed] });
  }
}
