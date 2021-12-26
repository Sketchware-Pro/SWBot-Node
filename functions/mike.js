module.exports = {
  name: "Mike",
  description: "Mike is mongass sus",
  async execute(message) {
    if (message.content.toLowerCase() != ("mike")) return;
    await message.react("<a:mongass:872257017018982461>").catch(console.error);
  }
};