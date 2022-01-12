const fs = require('fs');
let dataPath = "./autoresponse/_data.json"

module.exports = {
  async execute(message, autoResponsesList, updateAutoResopnseData, responseTimeout) {
    //Edit an autoresponse
    if (!message.content.startsWith("+autoresponse edit")) return;

    let pattern;
    const msg_filter = (m) => m.author.id === message.author.id;

    var editIndex = message.content.replace("+autoresponse edit", "").trim()
    if (editIndex.length && !isNaN(editIndex)) {
      pattern = Object.keys(autoResponsesList)[parseInt(editIndex)];
      if (!pattern) return await message.reply("Failed to edit autoresponse! Reason: Non existent index")

    } else {

      await message.reply(`Please send the \`Pattern\` of the autoresponse you want to edit.`);

      const collectedPattern = await message.channel.awaitMessages({ filter: msg_filter, max: 1, time: responseTimeout });

      if (!collectedPattern.first()) return message.reply('Autoresponse edit failed! Reason: Timeout');

      pattern = collectedPattern.first().content

      if (!autoResponsesList[pattern]) return await message.reply("Failed to edit autoresponse! Reason: Not found")
    }

    let oldResponse = autoResponsesList[pattern].response
    await message.reply(`Received Pattern \`${pattern}\`, Which has the following response:\n \`${oldResponse}\`\nPlease send new response for the pattern.`);

    const collectedNewResponse = await message.channel.awaitMessages({ filter: msg_filter, max: 1, time: responseTimeout * 5 })

    if (!collectedNewResponse.first()) return message.reply('Autoresponse edit failed! Reason: Timeout');

    let newResponse = collectedNewResponse.first().content

    await message.reply(`Received new response \`${newResponse}\`, For the pattern:\n \`${pattern}\`\nSave it?  \`Y\` / \`N\``);

    const collectedConfirmation = await message.channel.awaitMessages({ filter: msg_filter, max: 1, time: responseTimeout })

    if (!collectedConfirmation.first()) return message.reply('Autoresponse edit failed! Reason: Timeout');

    let confirmation = collectedConfirmation.first().content
    if (confirmation.toUpperCase() == "Y") {
      let ignoredChannels = autoResponsesList[pattern].response
      if (ignoredChannels) {
        autoResponsesList[pattern] = {
          "response": newResponse,
          "ignoredChannels": ignoredChannels
        }
      } else {
        autoResponsesList[pattern] = {
          "response": newResponse
        }
      }

      fs.writeFile(dataPath, JSON.stringify(autoResponsesList), async function(err) {
        if (err) {
          await message.reply("Autoresponse edit failed! Reason: Error")
          if (ignoredChannels) {
            autoResponsesList[pattern] = {
              "response": newResponse,
              "ignoredChannels": ignoredChannels
            }
          } else {
            autoResponsesList[pattern] = {
              "response": newResponse
            }
          }
          return console.log(err)
        }
        updateAutoResopnseData()
        return await message.reply("Autoresponse edit complete.")
      });
    } else {
      return await message.reply("Autoresponse edit aborted")
    }
  }
}