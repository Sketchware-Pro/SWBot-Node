module.exports = {
  name: "You're mom",
  description: "is g**",
  async execute(message) {
    if (message.content.toLowerCase() == ("geh")) return message.reply("you're mom").catch(console.error);
  }
};