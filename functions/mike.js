module.exports = {
  name: "Mike",
  description: "Mike is mongass sus",
  async execute(message) {
    if (!message.content.toLowerCase().includes("mike")) return;
    await message.react("🇲").catch(console.error);
    await message.react("🇦").catch(console.error);
    await message.react("🇾").catch(console.error);
    await message.react("🇰").catch(console.error);
  }
};