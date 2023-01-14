const fetch = require("node-fetch");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
let autoResponsesList;
var responseTimeout = 60000; //1min

async function updateAutoResopnseData() {
  try {
    const autoResponseDataUrl =
      "https://raw.githubusercontent.com/khaled-0/SWBot-Node/main/autoresponse/AutoResponseData.json";

    const response = await fetch(autoResponseDataUrl);
    const AutoResponseDataJSON = await response.text();
    autoResponsesList = JSON.parse(AutoResponseDataJSON);
    console.log("Autoresponse data loaded");
    return true;
  } catch (error) {
    console.log("Autoresponse data error. " + error.message);
    return error;
  }
}
updateAutoResopnseData();

module.exports = {
  async execute(message) {
    //Don't reply to bots
    if (message.author.bot) return;

    let embed = new MessageEmbed().setColor("#202225");

    /**
     * Check if message is a command and execute (only from mods & admins)
     *
     */
    if (
      message.content.startsWith("+autoresponse") &&
      message.member.permissions.has("MANAGE_MESSAGES")
    ) {
      //Reload data manually
      if (message.content == "+autoresponse reload") {
        let autoresponseLoaded = await updateAutoResopnseData();
        if (!autoresponseLoaded) {
          return await message.reply(
            "Autoresponse loading failed. " + autoresponseLoaded.message
          );
        }
        return await message.reply("Autoresponses reloaded");
      }
      require("./listall").execute(message, autoResponsesList);
    }

    /* ************************************************************* */

    /**
     * Match the message and reply
     */

    let messageBody = message.content.replace("\n", "");
    for (let keyword in autoResponsesList) {
      let pattern = new RegExp(keyword, "i");
      if (messageBody.match(pattern)) {
        //Check if theres an ignore list and if the current channel is in it then return
        if (
          autoResponsesList[keyword].ignoredChannels &&
          autoResponsesList[keyword].ignoredChannels.includes(
            message.channel.id
          )
        )
          return;

        let responseContent = autoResponsesList[keyword].response.replaceAll(
          "%author",
          `<@${message.author.id}>`
        );
        if (responseContent.startsWith("{") && responseContent.endsWith("}")) {
          embed.setDescription(
            responseContent.substr(1, responseContent.length - 2)
          );
          return await message.reply({ embeds: [embed] });
        }
        return await message.reply(responseContent);
      }
    }
  },
};
