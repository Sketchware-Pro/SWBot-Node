const { WebhookClient, MessageEmbed } = require("discord.js");
const ideaChannel = process.env['ideaserverChn']
const botChannel = process.env['botChannelId']
const {
  msToTime, getWebHook, snipeDB
} = require("../utils.js");
const ideaTimeout = 43200000; //12 hrs
const db = snipeDB;

module.exports = {
  name: "ideaserver",
  description: "Send Your Server Related Ideas To A Dedicated Channel",
  usage: "Usage: " + `Send \`+%name% your idea\` In <#${botChannel}>`,
  async execute(message) {
    if (!message.content.startsWith(`+${this.name}`))

      if (message.content.substring(11).trim() == "") return message.reply(this.usage.replace("%name%", this.name)).catch(console.error);

    let timeout = await db.get(message.author.id + this.name);
    if (timeout > Date.now()) {
      let waitTime = msToTime(timeout - Date.now())
      message.reply(`Slow down! You need to wait ${waitTime} more.`).catch(console.error);
    } else {
      //Create Embed
      let ideaEmbed = new MessageEmbed()
        .setDescription("**Idea:** " + message.content.substring(this.name.length + 1).trim() +
          `\n\nSend \`+${this.name} your idea\` In <#${botChannel}> To Do This`)
        .setColor("#4287f5")

      //Get Webhook for Idea Channel
      const webhook = await getWebHook(message.client, ideaChannel).then((hookUrl) => (new WebhookClient({ url: hookUrl })));
      //Send Embed using Webhook
      let response = await webhook.send({
        username: message.author.username,
        avatarURL: message.author.avatarURL(),
        embeds: [ideaEmbed]
      })
      //Fetch the Sent Embed From response ID
      let ideaMsg = await message.client.channels.cache.get(ideaChannel).messages.fetch(response.id).catch(console.error);

      await ideaMsg.react("<:upvote:833702317098008646>")
      await ideaMsg.react("<:downvote:833702170306150440>")
      await message.channel.send(`<@${message.author.id}>! Your idea had been posted to <#${ideaChannel}>`)
            .then(msg => {
                   setTimeout(() => msg.delete(), 8000)
                }).catch(console.error);
      await message.delete();
      if (!message.member.permissions.has('MANAGE_MESSAGES'))
        await db.set(message.author.id + this.name, Date.now() + ideaTimeout);
    }
  }
};
