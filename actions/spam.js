const recentMessages = new Map(); // Store recent messages with user ID and timestamp
// not to flex but this is by @NiceSapien
module.exports = {
    name: "Spam",
    description: "Advanced AI Algorithms to automatically prevent spam in the server.",
    async execute(message) {
        const member = message.member;
        const joinTime = member.joinedTimestamp;
        const now = Date.now();
        const joinAge = now - joinTime;
        const hasHyperlink = message.content.includes('http://') || message.content.includes('https://');
        if (hasHyperlink && joinAge < 10 * 60 * 1000) {
            const userId = message.author.id;
            const messageData = {
                content: message.content,
                channelId: message.channel.id,
                timestamp: now,
              };
            if (!recentMessages.has(userId)) {
                recentMessages.set(userId, []);
            }

            const userMessages = recentMessages.get(userId);
            userMessages.push(messageData);
            const uniqueChannels = new Set(userMessages.map((msg) => msg.channelId));
            if (uniqueChannels.size >= 2) {
                try {
                    member.send("You were banned for spamming hyperlinks. If you think this was a mistake, please rejoin in an hour. If you can't find the link to join, check out https://sketchware.pro")
                    await member.ban({ reason: 'Spamming hyperlinks after joining recently.', deleteMessageSeconds: 1000 * 60 * 10 });
                    console.log(`Banned ${message.author.tag} for spamming hyperlinks.`);
                    message.channel.send(`${message.author} has been banned by NiceSapien Tech. Advanced Security Systems & Advanced Safety Algorithms 2.0 for **1 hour for spamming hyperlinks** after joining recently.`);

                    // Unban after 1 hour
                    setTimeout(async () => {
                        try {
                            await message.guild.members.unban(userId, 'Automatic unban after 1 hour.');
                            console.log(`Unbanned ${message.author.tag}.`);
                        } catch (unbanError) {
                            console.error(`Error unbanning ${message.author.tag}:`, unbanError);
                        }
                    }, 60 * 60 * 1000);

                } catch (banError) {
                    console.error(`Error banning ${message.author.tag}:`, banError);
                }

                // Clear the user's recent messages to prevent immediate re-bans
                recentMessages.delete(userId);
            }
        }
    }
};