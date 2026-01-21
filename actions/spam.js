require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const recentMessages = new Map();
const SPAM_CHANNEL_ID = process.env["botChannelId"];
const TIMEOUT_DURATION = 2 * 60 * 1000;

module.exports = {
    name: "Spam",
    description: "Advanced AI Algorithms to automatically prevent spam in the server.",
    async execute(message) {
        if (message.author.bot) return;

        const member = message.member;
        const now = Date.now();

        const hasHyperlink = message.content.includes('http://') || message.content.includes('https://');
        const hasAttachment = message.attachments.size > 0; 

        if (hasHyperlink || hasAttachment) {
            const userId = message.author.id;
            const messageData = {
                content: message.content,
                channelId: message.channel.id,
                timestamp: now,
                id: message.id
            };

            if (!recentMessages.has(userId)) {
                recentMessages.set(userId, []);
            }

            const userMessages = recentMessages.get(userId);
            userMessages.push(messageData);

            const recentSpams = userMessages.filter(msg => now - msg.timestamp <= 30 * 1000);
            const uniqueLinks = new Set(recentSpams.map(msg => msg.content));

            if (uniqueLinks.size === 1 && recentSpams.length >= 6) {
                
                const messagesByChannel = new Map();
                
                recentSpams.forEach(msg => {
                    if (!messagesByChannel.has(msg.channelId)) {
                        messagesByChannel.set(msg.channelId, []);
                    }
                    messagesByChannel.get(msg.channelId).push(msg.id);
                });

                const deletePromises = [];

                for (const [channelId, messageIds] of messagesByChannel) {
                    const channel = message.guild.channels.cache.get(channelId);
                    if (channel) {
                        deletePromises.push(
                            channel.bulkDelete(messageIds, true).catch(err => console.error(err))
                        );
                    }
                }

                await Promise.all(deletePromises);

                const embed = new MessageEmbed()
                    .setColor('#FF0000')
                    .setDescription(`User ${member} was timed out for 2 minutes for: Spamming`)
                    .setFooter('NikaTech Spam Protection Gen 2');

                try {
                    await member.timeout(TIMEOUT_DURATION, 'Spamming');
                    
                    const logChannel = message.guild.channels.cache.get(SPAM_CHANNEL_ID);
                    if (logChannel) logChannel.send({ embeds: [embed] });
                    
                } catch (timeoutError) {
                    embed.setDescription(`Mute/Delete permission missing. Unable to timeout ${member}.`);
                    
                    const logChannel = message.guild.channels.cache.get(SPAM_CHANNEL_ID);
                    if (logChannel) logChannel.send({ embeds: [embed] });
                    
                    console.error(timeoutError);
                }

                recentMessages.delete(userId);
            }
            
            recentMessages.set(userId, recentSpams);
        }
    }
};