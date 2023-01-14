module.exports = {
  name: "Petition",
  description: "For holding petitions I guess",
  async execute(message) {
    if (message.content.length < 8) return;
    if (!message.content.match(/\b(petition)\b/i)) return;
    await message.react("<:upvote:833702317098008646>").catch(console.error);
    await message.react('<:downvote:833702170306150440>').catch(console.error);
  }
};