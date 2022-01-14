module.exports = {
  name: "Mike",
  description: "Mike is mongass sus",
  async execute(message) {
    if (!message.content.toLowerCase().includes("mike")) return;
    await message.react(":regional_indicator_m: ").catch(console.error);
    await message.react(":regional_indicator_i: ").catch(console.error);
    await message.react(":regional_indicator_k: ").catch(console.error);
    await message.react(":regional_indicator_e: ").catch(console.error);
  }
};