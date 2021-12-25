const { WebhookClient, Attachment } = require("discord.js");
const swbChannel = process.env['swbChannelId']
const botChannel = process.env['botChannelId']

const {
  getWebHook
} = require("../utils");

module.exports = {
  name: "shareswb",
  description: "Send Your Sketchware Pro Projects(.swb) To A Dedicated Channel",
  usage: "Usage: " + `Send \`+%name% <optional description>\` In <#${botChannel}> with your .swb file attached`,
  async execute(message, args) {
    if (!message.content.startsWith(`+${this.name}`)) return;
    let attachmentObj = message.attachments.first()
    let swbDescription = args.length != 0 ?
      args.toString().replaceAll(",", " ") : "I would like to present an swb to everyone"


    if (!attachmentObj)
      return await message.reply("You need to attach an swb file")
    if (!attachmentObj.name.endsWith(".swb"))
      return await message.reply("For God's sake, You need to attach an swb file")

    //Get Webhook for Project Channel
    const webhook = await getWebHook(message.client, swbChannel).then((hookUrl) => (new WebhookClient({ url: hookUrl })));
    const attachment = new Attachment(attachmentObj.url, attachmentObj.name)

    //Send Embed using Webhook
    await webhook.send({
      username: message.author.username,
      avatarURL: message.author.avatarURL(),
      content: swbDescription,
      files: [attachment]
    })

    await message.delete();
  }
};