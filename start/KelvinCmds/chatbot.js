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

// Function to clean response from introduction text
function cleanResponse(text) {
    if (!text) return text;
    
    const patterns = [
        /^Hello!.*?I'm Keith AI.*?\./i,
        /^Hi!.*?I'm Keith AI.*?\./i,
        /^Hey!.*?I'm Keith AI.*?\./i,
        /^I'm Keith AI.*?\./i,
        /^Hello! How can I assist you.*?\./i,
        /^Hi there!.*?\./i,
        /^Greetings!.*?\./i,
        /^I'm an AI assistant.*?\./i,
        /^I'm here to help.*?\./i,
        /^I'm Keith AI.*?created by Keithkeizzah.*?\./i,
        /^Hi, I'm Keith AI.*?\./i,
        /^I'm your AI assistant.*?\./i
    ];
    
    let cleaned = text;
    for (const pattern of patterns) {
        cleaned = cleaned.replace(pattern, '');
    }
    
    cleaned = cleaned.replace(/^What can I help you with\?\s*/i, '');
    cleaned = cleaned.replace(/^How can I assist you today\?\s*/i, '');
    cleaned = cleaned.replace(/^What's on your mind\?\s*/i, '');
    
    return cleaned.trim() || text;
}

async function handleAIChatbot(m, conn, body, from, isGroup, botNumber, isCmd, prefix) {
    try {
        const AI_CHAT = await db.get(botNumber, 'AI_CHAT', false);
        if (!AI_CHAT) return false;

        if (!body || m.key.fromMe || body.startsWith(prefix)) return false;
        
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
        
        // Check if asking about creator/developer
        const isAskingAboutCreator = /(who made you|who created you|who is your (creator|developer|owner)|who are you|what are you|your developer|your creator)/i.test(body);
        
        if (isAskingAboutCreator) {
            response = "I was created by Kelvin Tech, a skilled developer from Uganda with exceptional coding abilities.";
        } else {
            // Try Malvin Copilot API first
            try {
                const copilotUrl = `https://api.malvin.gleeze.com/ai/copilot?text=${encodeURIComponent(body)}`;
                const { data } = await axios.get(copilotUrl, { timeout: 10000 });
                if (data && data.result) {
                    response = data.result;
                } else if (data && data.response) {
                    response = data.response;
                }
            } catch (copilotError) {}
            
            // Try Keith API second
            if (!response) {
                try {
                    const keithUrl = `https://apiskeith.top/ai/gpt?q=${encodeURIComponent(body)}`;
                    const { data } = await axios.get(keithUrl, { timeout: 10000 });
                    if (data.status && data.result) {
                        response = cleanResponse(data.result);
                    }
                } catch (keithError) {}
            }
            
            // Fallback to Malvin Venice API
            if (!response) {
                try {
                    const context = messageMemory.has(from) 
                        ? messageMemory.get(from).map(msg => `${msg.role}: ${msg.content}`).join('\n')
                        : `user: ${body}`;

                    const prompt = `Previous conversation context:
${context}

Current message: ${body}

Respond briefly and directly as a helpful assistant:`;

                    const apiUrl = `https://malvin-api.vercel.app/ai/venice?text=${encodeURIComponent(prompt)}`;
                    const { data } = await axios.get(apiUrl, { timeout: 15000 });
                    if (data && data.result) response = data.result;
                    else if (data && data.message) response = data.message;
                } catch (malvinError) {}
            }
        }
        
        if (!response) {
            response = "I'm having trouble responding right now. Please try again later.";
        }

        updateMemory(from, response, false);
        
        await conn.sendMessage(from, { text: response }, { quoted: m });
        return true;

    } catch (err) {
        return false;
    }
}

module.exports = { handleAIChatbot };