const { MessageEmbed } = require("discord.js");

function get_algorithomic_gay_count(input) {
  input = input.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace("&", "")
  if (input.match(/^[0-9]+$/))
    return (input.substring(6, 9) * input.substring(4, 12)) % 101
  //not a mention, returning random
  return Math.floor(Math.random() * 101)
}

module.exports = {
  name: "howgay",
  description: "self-explanatory",
  usage: "Usage: " + `\`+%name% <@some g*h ppl>\``,
  async execute(message) {
    if (!message.content.startsWith(`+${this.name}`)) return;
     const args = message.content.slice(this.name.length + 1).trim().split(/ +/);

    let who = args[0];
    who = who ? who : `<@${message.author.id}>`;
    gay = get_algorithomic_gay_count(who)
    let description;
    if (gay == 69)
      description = `${who} IS ${gay}% GAY!?.!?. w.- T. F.?.!1?!?1..!? :flushed: :flushed: <:uhm:815635169616068609> <:uhm:815635169616068609> `
    else if (0 < gay < 25)
      description = `${who} is ${gay}% gay <:heheboi:792845251302654013>`
    else if (24 < gay < 50)
      description = `${who} is ${gay}% gay.. <:bruh:792845069879083069>`
    else if (49 < gay < 75)
      description = `${who} is ${gay}% gay! :flushed:`
    else if (gay == 101)
      description = `OMG RUNNNN ${who} IS ${gay}% GAY !! AAAAA <:jerryshock:798202239784583198>`
    else
      description = `${who} is ${gay}% gay!!! :flushed: <:uhm:815635169616068609>`

    let embed = new MessageEmbed()
      .setTitle("Gay Detector Machine")
      .setDescription(description)
      .setColor("#eb0fc6")
    await message.reply({ embeds: [embed] })
  }
};