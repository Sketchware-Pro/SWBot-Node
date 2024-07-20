const { MessageEmbed } = require("discord.js");
const { snipeDB, isNumber } = require("../utils.js");
const HISTORY_SIZE = 500;

module.exports = {
  name: "snipe",
  anychannel: true,
  usage: "+snipe",
  description: "Get the last deleted message with author and image (if any)",
  async execute(message) {
    if (!message.content.startsWith(`+${this.name}`)) return;

    const snipeList = await snipeDB.get("snipe" + message.channel.id);

    if (!Array.isArray(snipeList) || snipeList.length == 0) {
      return message.reply("There's nothing to snipe!");
    }

    if (message.author.id == "672844584941912087") {
      return message.reply("You're not allowed to use this command.");
    }

    let snipeIndex = message.content.split(" ")[1];
    if (snipeIndex !== undefined) {
      if (!isNumber(snipeIndex)) {
        return message.reply("Invalid snipe index provided.");
      } else if (snipeIndex >= snipeList.length || snipeIndex < 0) {
        return message.reply("Invalid snipe index provided.");
      }
    } else {
      snipeIndex = 0;
    }

    let snipe = snipeList[snipeIndex];
    if (!snipe) {
      return message.reply(`Snipe ${snipeIndex} doesn't exist.`);
    }

    const embed = new MessageEmbed()
      .setAuthor(snipe.author.tag, snipe.author.avatarURL())
      .setFooter(`#${message.channel.name}`)
      .setTimestamp(snipe.createdAt);
    
    if (snipe.content) {
      embed.setDescription(snipe.content);
    }
    
    if (snipe.image) {
      embed.setImage(snipe.image);
    }

    const snipeMessage = await message.reply({ embeds: [embed] });

    // Listen for message deletion
    const messageDeleteListener = async (deletedMessage) => {
      if (deletedMessage.id === message.id) {
        // Delete the bot's response
        await snipeMessage.delete();
        // Remove listener to avoid unnecessary checks
        message.client.off('messageDelete', messageDeleteListener);
      }
    };

    message.client.on('messageDelete', messageDeleteListener);
  },

  saveSnipeMessage(message) {
    // content is null or deleted embed
    if (message.partial || (message.embeds.length && !message.content)) {
      return;
    }
    if (message.author.bot) {
      return; // Ignore bots deletion
    }

    let snipeList = snipeDB.get("snipe" + message.channel.id);
    if (!Array.isArray(snipeList)) {
      snipeList = [];
    }

    snipeList.unshift({
      author: message.author,
      content: message.content,
      createdAt: message.createdTimestamp,
      image: message.attachments.first() ? message.attachments.first().proxyURL : null,
    });

    // Save only up to HISTORY_SIZE items
    if (snipeList.length > HISTORY_SIZE) {
      snipeList.length = HISTORY_SIZE;
    }
    
    snipeDB.set("snipe" + message.channel.id, snipeList);
  },
};
