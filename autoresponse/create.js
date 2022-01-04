const fs = require('fs');
let dataPath = "./autoresponse/_data.json"

module.exports = {
  async execute(message, autoResponsesList, updateAutoResopnseData, responseTimeout) {
    //Create new autoresponse
    if (message.content != "+autoresponse create") return;

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
      autoResponsesList[pattern] = {
        "response": response
      }

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
}