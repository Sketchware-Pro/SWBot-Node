const { WebhookClient } = require("discord.js");
const { getWebHook } = require("../utils");

module.exports = {
  name: "Vxtwitter",
  description: "Replace twitter/x.com links with vxtwitter.com for better embeds",
  usage: "Just send a twitter or x.com link",
  async execute(message) {
    const regex = /https?:\/\/(?:www\.)?(twitter|x)\.com\//gm;
    
    if (regex.test(message.content)) {
      const newContent = message.content.replace(regex, function(match, p1) {
          return match.replace(p1, 'vxtwitter');
      });
      
      const webhook = await getWebHook(message.client, message.channel.id)
      	.then((hookUrl) => (new WebhookClient({ url: hookUrl })));
      
      await webhook.send({
      	content: newContent,
        username: message.author.username,
        avatarURL: message.author.avatarURL(),
      })

      return await message.delete();
    }
  },
};
