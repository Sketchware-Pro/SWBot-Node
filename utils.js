/**
*Util Class
*/
const snipeDB = new Map();
module.exports = {
  msToTime(ms) {
    let seconds = (ms / 1000).toFixed(1);
    let minutes = (ms / (1000 * 60)).toFixed(1);
    let hours = (ms / (1000 * 60 * 60)).toFixed(1);
    let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
    if (seconds < 60) return seconds + " Sec";
    else if (minutes < 60) return minutes + " Min";
    else if (hours < 24) return hours + " Hrs";
    else return days + " Days";
  },



  escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  },

  
  async getWebHook(client, channelId) {
    channel = client.channels.cache.get(channelId)
    // Fetch webhook
    hooks = await channel.fetchWebhooks();
    for (let hook of hooks) {
      if (hook[1].name.startsWith("SWBot")) return hook[1].url;
    }
    // Else Create a webhook for the current channel
    hook = await channel.createWebhook("SWBot")
    return hook.url;
  },

snipeDB

};