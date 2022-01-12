const fs = require('fs');
let dataPath = "./autoresponse/_data.json"

module.exports = {
  async execute(message, autoResponsesList, updateAutoResopnseData, responseTimeout) {
    //Edit an autoresponse
    if (!message.content.startsWith("+autoresponse setignore")) return;

    let pattern;
    const msg_filter = (m) => m.author.id === message.author.id;

    var editIndex = message.content.replace("+autoresponse setignore", "").trim()
    if (editIndex.length && !isNaN(editIndex)) {
      pattern = Object.keys(autoResponsesList)[parseInt(editIndex)];
      if (!pattern) return await message.reply("Failed to edit autoresponse ignoring! Reason: Non existent index")

    } else {

      await message.reply(`Please send the \`Pattern\` of the autoresponse you want to edit ignore list of.`);

      const collectedPattern = await message.channel.awaitMessages({ filter: msg_filter, max: 1, time: responseTimeout });

      if (!collectedPattern.first()) return message.reply('Setting autoresponse ignore failed! Reason: Timeout');

      pattern = collectedPattern.first().content

      if (!autoResponsesList[pattern]) return await message.reply("Setting autoresponse ignore failed! Reason: Not found")
    }

    let oldIgnoreList = autoResponsesList[pattern].ignoreList ? autoResponsesList[pattern].ignoreList : "None"

    await message.reply(`Received Pattern \`${pattern}\`, Which has the following ignored channels:\n \`${oldIgnoreList}\`\nPlease send new channels mention. ${(oldIgnoreList != 'None') ? "or send \`rm\` to remove currently ignored channels" : ""}`);

    const collectedNewResponse = await message.channel.awaitMessages({ filter: msg_filter, max: 1, time: responseTimeout * 5 })

    if (!collectedNewResponse.first()) return message.reply('Setting autoresponse ignore failed! Reason: Timeout');

    let newResponse = collectedNewResponse.first().content

    if (newResponse == "rm" && oldIgnoreList != 'None') {
      autoResponsesList[pattern] = {
        "ignoredChannels": ""
      }
      await message.reply('Autoresponse ignore list reset for ``' + pattern + "``");
    } else {

      await message.reply(`Received new ignored channel list \`${newResponse}\`, For the pattern:\n \`${pattern}\`\nSave it?  \`Y\` / \`N\``);

      const collectedConfirmation = await message.channel.awaitMessages({ filter: msg_filter, max: 1, time: responseTimeout })

      if (!collectedConfirmation.first()) return message.reply('Setting autoresponse ignore failed! Reason: Timeout');

      let confirmation = collectedConfirmation.first().content
      if (confirmation.toUpperCase() != "Y") {
        return await message.reply("Setting autoresponse ignore aborted")
      }
      autoResponsesList[pattern] = {
        "ignoredChannels": newResponse,
        "response": autoResponsesList[pattern].response
      }
    }
    fs.writeFile(dataPath, JSON.stringify(autoResponsesList), async function(err) {
      if (err) {
        await message.reply("Setting autoresponse ignore failed! Reason: Error")
        autoResponsesList[pattern] = {
          "response": oldResponse
        }
        return console.log(err)
      }
      updateAutoResopnseData()
      return await message.reply("Setting autoresponse ignore complete.")
    });
  }
}