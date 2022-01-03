const fs = require('fs');
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
let dataPath = "./autoresponse/data.json"
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

function getAutoResponseHelp() {
  return ("help me help me")
}

module.exports = {
  async execute(message) {
    let embed = new MessageEmbed()
      .setColor("#202225");

    /**
     * Check if message is a command and execute (only from mods & admins)
     */
    if (message.member.permissions.has('MANAGE_MESSAGES')) {

      //Help about autoresponses
      if (message.content == "+autoresponse help") {
        embed.setTitle("Automated Responses Help & Usages")
        embed.setDescription(getAutoResponseHelp())
        return await message.reply({ embeds: [embed] })
      }

      //Reload data from file (unnecessary)
      if (message.content == "+autoresponse reload") {
        updateAutoResopnseData()
        return await message.reply("Autoresponses reloaded")
      }

      //Create new autoresponse
      if (message.content == "+autoresponse create") {

        await message.reply(`Creating a new autoresponse. Please send the \`Pattern(Regex)\``);
        const msg_filter = (m) => m.author.id === message.author.id;
        const collectedPattern = await message.channel.awaitMessages({ filter: msg_filter, max: 1, time: responseTimeout });

        if (!collectedPattern.first()) return message.reply('Autoresponse creation failed! Reason: Timeout');

        let pattern = collectedPattern.first().content

        await message.reply(`Received Pattern \`${pattern}\`, Please send the \`Response\``);
        const collectedResponse = await message.channel.awaitMessages({ filter: msg_filter, max: 1, time: responseTimeout * 5 });

        if (!collectedResponse.first()) return message.reply('Autoresponse creation failed! Reason: Timeout');

        let response = collectedResponse.first().content
        await message.reply(`Received Response \`${response}\` for pattern \`${pattern}\`. Create Autoresponse? \`Y\` / \`N\` `);

        const collectedConfirmation = await message.channel.awaitMessages({ filter: msg_filter, max: 1, time: responseTimeout });

        if (!collectedConfirmation.first()) return message.reply('Autoresponse creation failed! Reason: Timeout');

        let confirmation = collectedConfirmation.first().content

        if (confirmation.toUpperCase() == "Y") {
          autoResponsesList[pattern] = response
          fs.writeFile(dataPath, JSON.stringify(autoResponsesList), async function(err) {
            if (err) {
              await message.reply("Autoresponse creation failed! Reason: Error")
              delete autoResponsesList[pattern]
              return console.log(err)
            }
            updateAutoResopnseData()
            return await message.reply("Autoresponse creation complete.")
          });
        } else {
          return await message.reply("Autoresponse creation aborted")
        }
      }

      //Delete an autoresponse
      if (message.content.startsWith("+autoresponse delete")) {
        await message.reply(`Please send the \`Pattern\` of the autoresponse you want to delete.`);
        const msg_filter = (m) => m.author.id === message.author.id;
        const collectedPattern = await message.channel.awaitMessages({ filter: msg_filter, max: 1, time: responseTimeout });

        if (!collectedPattern.first()) return message.reply('Autoresponse deletion failed! Reason: Timeout');

        let pattern = collectedPattern.first().content

        if (!autoResponsesList[pattern]) return await message.reply("Failed to delete autoresponse! Reason: Not found")

        let autoResponse = autoResponsesList[pattern]
        await message.reply(`Received Pattern \`${pattern}\`, Which has the following response:\n \`${autoResponse}\`\nDelete it?  \`Y\` / \`N\``);
        const collectedConfirmation = await message.channel.awaitMessages({ filter: msg_filter, max: 1, time: responseTimeout })

        if (!collectedConfirmation.first()) return message.reply('Autoresponse deletion failed! Reason: Timeout');

        let confirmation = collectedConfirmation.first().content
        if (confirmation.toUpperCase() == "Y") {

          delete autoResponsesList[pattern]
          fs.writeFile(dataPath, JSON.stringify(autoResponsesList), async function(err) {
            if (err) {
              await message.reply("Autoresponse deletion failed! Reason: Error")
              autoResponsesList[pattern] = autoResponse
              return console.log(err)
            }
            updateAutoResopnseData()
            return await message.reply("Autoresponse deleted.")
          });

        } else {
          return await message.reply("Autoresponse deletion Aborted")
        }
      }

      //Get list of all autoresponses
      if (message.content == "+autoresponse list") {
        for (let ares in autoResponsesList) {
          embed.addField(
            `**${ares}**`,
            `${autoResponsesList[ares]}`,
            true
          );
        }
        embed.setTitle("List Of All Automated Responses")
        return await message.reply({ embeds: [embed] })
      }
    }

    /* ************************************************************* */

    /**
    * Match the message and reply
    */
    let messageBody = message.content.replace("\n", "");
    for (let keyword in autoResponsesList) {
      let pattern = new RegExp(keyword, 'i');
      if (messageBody.match(pattern)) {
        let responseContent = autoResponsesList[keyword].replaceAll("%author", `<@${message.author.id}>`) //.replaceAll(/{#(.*?)}/gm, "<#$1>")
        if (responseContent.startsWith("{") && responseContent.endsWith("}")) {
          embed.setDescription(responseContent.substr(1, (responseContent.length - 2)))
          return await message.reply({ embeds: [embed] })
        }
        return await message.reply(responseContent)
      }
    }
  }
}
