const axios = require("axios");
const db = require('../../start/Core/databaseManager'); 

// Message memory for conversation context
let messageMemory = new Map();
const MAX_MEMORY = 150;

function updateMemory(chatId, message, isUser = true) {
    if (!messageMemory.has(chatId)) {
        messageMemory.set(chatId, []);
    }
    
    const chatMemory = messageMemory.get(chatId);
    chatMemory.push({
        role: isUser ? "user" : "assistant",
        content: message,
        timestamp: Date.now()
    });
    
    if (chatMemory.length > MAX_MEMORY) {
        messageMemory.set(chatId, chatMemory.slice(-MAX_MEMORY));
    }
}

async function handleAIChatbot(m, conn, body, from, isGroup, botNumber, isCmd, prefix) {
    try {
        const AI_CHAT = await db.get(botNumber, 'AI_CHAT', false);
        if (!AI_CHAT) return false;

        if (!body || m.key.fromMe || body.startsWith(prefix)) return false;
        
        // Check ignored numbers - handle all formats
        const senderJid = m.sender;
        const senderNumber = senderJid.replace(/[^0-9]/g, "");
        
        const ignoredNumbers = ['256742932677', '256755585369'];
        const isIgnored = ignoredNumbers.some(num => {
            const normalizedNum = num.replace(/[^0-9]/g, "");
            return senderNumber === normalizedNum;
        });
        
        if (isIgnored) return false;

        let shouldRespond = true;
        
        if (isGroup) {
            const mentionedJids = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            const isMentioned = mentionedJids.some(jid => {
                const normalizedJid = jid.replace(/[^0-9]/g, "");
                const normalizedBot = botNumber.replace(/[^0-9]/g, "");
                return normalizedJid === normalizedBot;
            });
            
            const isReplyToBot = m.message?.extendedTextMessage?.contextInfo?.participant === botNumber;
            
            if (!isMentioned && !isReplyToBot) return false;
            shouldRespond = true;
        }

        if (!shouldRespond) return false;

        await conn.sendPresenceUpdate('composing', from);
        updateMemory(from, body, true);

        let response = null;
        
        try {
            const keithUrl = `https://apiskeith.top/ai/gpt?q=${encodeURIComponent(body)}`;
            const { data } = await axios.get(keithUrl, { timeout: 10000 });
            if (data.status && data.result) response = data.result;
        } catch (keithError) {}
        
        if (!response) {
            try {
                const context = messageMemory.has(from) 
                    ? messageMemory.get(from).map(msg => `${msg.role}: ${msg.content}`).join('\n')
                    : `user: ${body}`;

                const prompt = `Previous conversation context:
${context}

Current message: ${body}

Respond as a helpful assistant:`;

                const apiUrl = `https://malvin-api.vercel.app/ai/venice?text=${encodeURIComponent(prompt)}`;
                const { data } = await axios.get(apiUrl, { timeout: 15000 });
                if (data && data.result) response = data.result;
                else if (data && data.message) response = data.message;
            } catch (malvinError) {}
        }
        
        if (!response) {
            response = "I'm sorry, I'm having trouble responding right now. Please try again later.";
        }

        updateMemory(from, response, false);
        
        await conn.sendMessage(from, { text: response }, { quoted: m });
        return true;

    } catch (err) {
        return false;
    }
}

module.exports = { handleAIChatbot };