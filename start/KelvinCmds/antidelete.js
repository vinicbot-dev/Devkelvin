const timezones = global.timezones || "Africa/Kampala"; // Default to Uganda timezone
const moment = require("moment-timezone")
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

const { 
loadStoredMessages,
saveStoredMessages,
storeMessage } = require('../../vinic');

async function handleAntiDelete(m, conn) {
    try {
        const botNumber = await conn.decodeJid(conn.user.id);
        
        // Get anti-delete setting from JSON manager
        const antideleteSetting = global.settingsManager?.getSetting(botNumber, 'antidelete', 'off');
        
        // Check if anti-delete is enabled
        if (!antideleteSetting || antideleteSetting === 'off') {
            console.log("❌ Anti-delete disabled");
            return;
        }

        let messageId = m.message.protocolMessage.key.id;
        let chatId = m.chat;
        let deletedBy = m.sender;
        const isGroup = chatId.endsWith('@g.us');

        

        let storedMessages = loadStoredMessages();
        let deletedMsg = storedMessages[chatId]?.[messageId];

        if (!deletedMsg) {
            console.log("⚠️ Deleted message not found in database.");
            return;
        }

        let sender = deletedMsg.key.participant || deletedMsg.key.remoteJid;

        let chatName;
        if (deletedMsg.key.remoteJid === 'status@broadcast') {
            chatName = "Status Update";
        } else if (isGroup) {
            try {
                const groupInfo = await conn.groupMetadata(chatId);
                chatName = groupInfo.subject || "Group Chat";
            } catch {
                chatName = "Group Chat";
            }
        } else {
            chatName = deletedMsg.pushName || m.pushName || "Private Chat";
        }

        let xtipes = moment(deletedMsg.messageTimestamp * 1000).tz(`${timezones}`).locale('en').format('HH:mm z');
        let xdptes = moment(deletedMsg.messageTimestamp * 1000).tz(`${timezones}`).format("DD/MM/YYYY");

        // Determine target chat based on antidelete mode
        let targetChat;
        if (antideleteSetting === 'private') {
            targetChat = conn.user.id; // Bot owner's inbox
           
        } else if (antideleteSetting === 'chat') {
            targetChat = chatId; // Same chat where deletion happened
            
        } else {
            console.log("❌ Invalid anti-delete mode");
            return;
        }

        // Handle media messages
        if (!deletedMsg.message.conversation && !deletedMsg.message.extendedTextMessage) {
            try {
                let forwardedMsg = await conn.sendMessage(
                    targetChat,
                    { 
                        forward: deletedMsg,
                        contextInfo: { isForwarded: false }
                    },
                    { quoted: deletedMsg }
                );
                
                let mediaInfo = `🚨 *𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙼𝙴𝙳𝙸𝙰!* 🚨
${readmore}
• 𝙲𝙷𝙰𝚃: ${chatName}
• 𝚂𝙴𝙽𝚃 𝙱𝚈: @${sender.split('@')[0]} 
• 𝚃𝙸𝙼𝙴: ${xtipes}
• 𝙳𝙰𝚃𝙴: ${xdptes}
• 𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙱𝚈: @${deletedBy.split('@')[0]}`;

                await conn.sendMessage(
                    targetChat, 
                    { text: mediaInfo, mentions: [sender, deletedBy] },
                    { quoted: forwardedMsg }
                );
                
            } catch (mediaErr) {
                console.error("Media recovery failed:", mediaErr);
                let replyText = `🔮 *𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴!* 🔮
${readmore}
• 𝙲𝙷𝙰𝚃: ${chatName}
• 𝚂𝙴𝙽𝚃 𝙱𝚈: @${sender.split('@')[0]} 
• 𝚃𝙸𝙼𝙴: ${xtipes}
• 𝙳𝙰𝚃𝙴: ${xdptes}
• 𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙱𝚈: @${deletedBy.split('@')[0]}

• 𝙼𝙴𝚂𝚂𝙰𝙶𝙴: [Unsupported media content]`;

                let quotedMessage = {
                    key: {
                        remoteJid: chatId,
                        fromMe: sender === conn.user.id,
                        id: messageId,
                        participant: sender
                    },
                    message: { conversation: "Media recovery failed" }
                };

                await conn.sendMessage(
                    targetChat,
                    { text: replyText, mentions: [sender, deletedBy] },
                    { quoted: quotedMessage }
                );
            }
        } 
        // Handle text messages
        else {
            let text = deletedMsg.message.conversation || 
                      deletedMsg.message.extendedTextMessage?.text;

            let replyText = `🔮 *𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴!* 🔮
${readmore}
• 𝙲𝙷𝙰𝚃: ${chatName}
• 𝚂𝙴𝙽𝚃 𝙱𝚈: @${sender.split('@')[0]} 
• 𝚃𝙸𝙼𝙴: ${xtipes}
• 𝙳𝙰𝚃𝙴: ${xdptes}
• 𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙱𝚈: @${deletedBy.split('@')[0]}

• 𝙼𝙴𝚂𝚂𝙰𝙶𝙴: ${text}`;

            let quotedMessage = {
                key: {
                    remoteJid: chatId,
                    fromMe: sender === conn.user.id,
                    id: messageId,
                    participant: sender
                },
                message: {
                    conversation: text 
                }
            };

            await conn.sendMessage(
                targetChat,
                { text: replyText, mentions: [sender, deletedBy] },
                { quoted: quotedMessage }
            );
        }

        

    } catch (err) {
        console.error("❌ Error processing deleted message:", err);
    }
}

module.exports = { handleAntiDelete };