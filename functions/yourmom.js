module.exports = {
  async execute(message) {
    if (message.content.toLowerCase() == ("geh")) return message.reply("you're mom").catch(console.error);
  }
};