const fs = require('fs');
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
let dataPath = "./autoresponse/_data.json"
let autoResponsesList = updateAutoResopnseData();
var responseTimeout = 60000; //1min

function updateAutoResopnseData() {
  fs.readFile(dataPath, (err, data) => {
    if (err) return console.error(err);
    try {
      autoResponsesList = JSON.parse(data);
      console.log('Autoresponse data loaded');
    } catch (e) {
      return console.error(e);
    }
  });
}

module.exports = {
  async execute(message) {
    let embed = new MessageEmbed()
      .setColor("#202225");

    /**
     * Check if message is a command and execute (only from mods & admins) 
     *
     */
    if ((message.content.startsWith("+autoresponse"))
      && (message.member.permissions.has('MANAGE_MESSAGES'))) {

      //Reload data from file (unnecessary)
      if (message.content == "+autoresponse reload") {
        updateAutoResopnseData()
        return await message.reply("Autoresponses reloaded")
      }

      require("./create").execute(message, autoResponsesList, updateAutoResopnseData, responseTimeout)
      require("./delete").execute(message, autoResponsesList, updateAutoResopnseData, responseTimeout)
      require("./edit").execute(message, autoResponsesList, updateAutoResopnseData, responseTimeout)
      require("./setignored").execute(message, autoResponsesList, updateAutoResopnseData, responseTimeout)
      require("./help").execute(message, autoResponsesList, responseTimeout)
      require("./listall").execute(message, autoResponsesList)

    }

    /* ************************************************************* */

    /**
    * Match the message and reply
    */

    let messageBody = message.content.replace("\n", "");
    for (let keyword in autoResponsesList) {
      let pattern = new RegExp(keyword, 'i');
      if (messageBody.match(pattern)) {

        //Check if theres an ignore list and if the current channel is in it then return
        if (autoResponsesList[keyword].ignoredChannels && autoResponsesList[keyword].ignoredChannels.includes(message.channel.id)) return;

        let responseContent = autoResponsesList[keyword].response.replaceAll("%author", `<@${message.author.id}>`) //.replaceAll(/{#(.*?)}/gm, "<#$1>")
        if (responseContent.startsWith("{") && responseContent.endsWith("}")) {
          embed.setDescription(responseContent.substr(1, (responseContent.length - 2)))
          return await message.reply({ embeds: [embed] })
        }
        return await message.reply(responseContent)
      }
    }
  }
}
