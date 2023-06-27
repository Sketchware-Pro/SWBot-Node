const { MessageEmbed } = require("discord.js");
const { snipeDB, isNumber } = require("../utils.js");
const HISTORY_SIZE = 500;

module.exports = {
  name: "snipe",
  anychannel: true,
  usage: "Send ``+snipe`` in the targeted channel",
  description:
    "Get last message which is deleted with message Author and Image(If any)",
  async execute(message) {
    if (!message.content.startsWith(`+${this.name}`)) return;
    const snipeList = await snipeDB.get("snipe" + message.channel.id);

    if (!Array.isArray(snipeList) || snipeList.length == 0)
      return message.reply("There's nothing to snipe!");

    let snipeIndex = message.content.split(" ")[1];
    if (snipeIndex !== undefined) {
      if (!isNumber(snipeIndex))
        return message.reply(`||joe mama||`);
      else if (snipeIndex > HISTORY_SIZE || snipeIndex < 0)
        return message.reply(`||joe mama||`);
    } else snipeIndex = 0;

    let snipe = snipeList[snipeIndex];
    if (!snipe) return message.reply(`Snipe ${snipeIndex} doesn't exist yet!`);

    const embed = new MessageEmbed()
      .setAuthor(snipe.author.tag, snipe.author.avatarURL)
      .setFooter(`#${message.channel.name}`)
      .setTimestamp(snipe.createdAt);
    snipe.content ? embed.setDescription(snipe.content) : null;
    snipe.image ? embed.setImage(snipe.image) : null;

    await message.reply({ embeds: [embed] });
  },

  saveSnipeMessage(message) {
    // content is null or deleted embed
    if (message.partial || (message.embeds.length && !message.content)) return;
    if (message.author.bot) return; // Ignore bots deletion

    let snipeList = snipeDB.get("snipe" + [message.channel.id]);
    if (!Array.isArray(snipeList)) snipeList = new Array();

    snipeList.unshift({
      author: message.author,
      content: message.content,
      createdAt: message.createdTimestamp,
      image: message.attachments.first()
        ? message.attachments.first().proxyURL
        : null,
    });

    //Save only upto HISTORY_SIZE items
    if (snipeList.length > HISTORY_SIZE) snipeList.length = HISTORY_SIZE;
    snipeDB.set("snipe" + [message.channel.id], snipeList);
  },
};
