module.exports = {
  name: "React to messages",
  hidden: true,
  async execute(message) {
    if (!message.member.permissions.has('MANAGE_MESSAGES')) return;
    if (!message.content.toLowerCase().startsWith("+r")) return;
    const args = message.content.slice(2).trim().split(/ +/);
    if (!args[0] || !args[1]) return message.reply("Usage: ``+r <reaction> <messageid>`` \n Make sure to execute it in the same channel as the message")

    let reaction = args[0]
    let msgId = args[1]

    message.channel.messages.fetch(msgId).then(m => {
      m.react(reaction);
    }).then(function() {
      message.delete();
    });
  }
};