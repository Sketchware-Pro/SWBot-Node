const {
  MessageEmbed
} = require("discord.js");
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
  usage: "Usage: " + `Send \`+%name% your idea\` In <#${botChannel}> To `,
  async execute(message) {
    if (message.content.startsWith(`+${this.name}`)) {

      if (message.content.substring(5).trim() == "") return message.reply(this.usage.replace("%name%", this.name)).catch(console.error);

      let timeout = await db.get(message.author.id + this.name);
      if (timeout > Date.now()) {
        let waitTime = msToTime(timeout - Date.now())
        message.reply(`Slow down! You need to wait ${waitTime} more.`).catch(console.error);
      } else {
        try {
          let ideaEmbed = new MessageEmbed()
          .setAuthor(message.author.username, message.author.avatarURL())
          .setDescription("**Idea:** " + message.content.substring(5).trim() + 
          `\n\nSend \`+${this.name} your idea\` In <#${botChannel}> To Do This`)
          .setColor("#4287f5")
          var ideaMsg = await message.client.channels.cache.get(ideaChannel).send(ideaEmbed).catch(console.error);
          await ideaMsg.react("<:upvote:833702317098008646>")
          await ideaMsg.react("<:downvote:833702170306150440>")
          await message.delete();
          await db.set(message.author.id + this.name, Date.now()+ideaTimeout);
        } catch (error) {
          console.error(error);
        }
      }
    }

  }
};