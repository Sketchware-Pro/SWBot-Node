module.exports = {
  async execute(message) {
    if (message.content.length < 8) return;//Why 8? :thenking:
    if (message.content.toLowerCase().includes("petition")){
        await message.react('<:upvote:833702317098008646>').catch(console.error);
        await message.react('<:downvote:833702170306150440>').catch(console.error);
    } return;
  }
};