const {
  MessageEmbed
} = require("discord.js");
const client = require("../index");
const ideaChannel = process.env['ideaChn']
const botChannel = process.env['botChannelId']
const replitDB = require("@replit/database");
const {
  msToTime
} = require("../utils");
const db = new replitDB();
const ideaTimeout = 43200000; //12 hrs

module.exports = {
  name: "idea",
  description: "Send Your Sketchware Pro Ideas To A Dedicated Channel",
  async execute(message) {
    if (message.content.startsWith('+idea') && message.content.substring(5).trim() != "") {
      let timeout = await db.get(message.author.id +"idea");
      if (timeout == Date.now()) {
        let waitTime = msToTime(timeout - Date.now())
        message.reply(`Slow down! You need to wait ${waitTime} more.`);
      } else {
        try {
          let helpEmbed = new MessageEmbed()
          .setAuthor(message.author.username, message.author.avatarURL())
          .setDescription("**Idea:** " + message.content.substring(5).trim())
          .setColor("#4287f5")
          .setFooter(`Send +idea your idea In <#${botChannel}> To Do This`);
          var ideaMsg = await client.sendMessage(ideaChannel, helpEmbed).catch(console.error);
          await ideaMsg.react("<:upvote:833702317098008646>")
          await ideaMsg.react("<:downvote:833702170306150440>")
          await message.delete();
          await db.set(message.author.id +"idea", Date.now()+ideaTimeout);
        } catch (error) {
          console.error(error);
        }
      }
    }

  }
};