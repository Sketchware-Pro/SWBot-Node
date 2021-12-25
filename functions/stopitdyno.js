module.exports = {
  name: "Stop It Dyno",
  description: "Dyno should get some help",
  async execute(message) {
    if (message.author.id != 155149108183695360) return; //Dyno AKA SWProBot
    if (message.content.endsWith("Watch your language.")) {
      message.channel.send("Dyno, stop it, get some help")
        .then(msg => {
          setTimeout(() => msg.delete(), 5000)
        })
        .catch(console.error);
    }
    return;
  }
};