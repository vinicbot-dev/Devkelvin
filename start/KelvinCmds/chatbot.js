const axios = require("axios");
const fs = require('fs');
const db = require('../../start/Core/databaseManager'); 

// Message memory for conversation context
let messageMemory = new Map();
const MAX_MEMORY = 150;

// DEV_JIDS (Owner LIDs and Numbers)
const DEV_JIDS = [
    '256742932677@s.whatsapp.net',
    '256755585369@s.whatsapp.net',
    '38161203904689@lid',
    '96491339264216@lid'
];

function updateMemory(chatId, message, isUser = true) {
    try {
        if (!chatId) return;
        
        // Initialize if not exists - FIXED
        if (!messageMemory.has(chatId)) {
            messageMemory.set(chatId, []);
        }
        
        const chatMemory = messageMemory.get(chatId);
        
        // Ensure chatMemory is an array - FIXED
        if (!Array.isArray(chatMemory)) {
            messageMemory.set(chatId, []);
            return;
        }
        
        chatMemory.push({
            role: isUser ? "user" : "assistant",
            content: message || "",
            timestamp: Date.now()
        });
        
        if (chatMemory.length > MAX_MEMORY) {
            messageMemory.set(chatId, chatMemory.slice(-MAX_MEMORY));
        }
    } catch (err) {
        console.error('UpdateMemory error:', err);
    }
}

function cleanResponse(text) {
    if (!text) return text;
    
    const patterns = [
        /^Hello!.*?I'm.*?AI.*?\./i,
        /^Hi!.*?I'm.*?AI.*?\./i,
        /^Hey!.*?I'm.*?AI.*?\./i,
        /^I'm.*?AI.*?\./i,
        /^Hello! How can I assist you.*?\./i,
        /^Hi there!.*?\./i,
        /^Greetings!.*?\./i,
        /^I'm an AI assistant.*?\./i,
        /^I'm here to help.*?\./i,
        /^What can I help you with\?\s*/i,
        /^How can I assist you today\?\s*/i,
        /^What's on your mind\?\s*/i
    ];
    
    let cleaned = text;
    for (const pattern of patterns) {
        cleaned = cleaned.replace(pattern, '');
    }
    
    return cleaned.trim() || text;
}

function isOwner(senderJid) {
    if (!senderJid) return false;
    if (DEV_JIDS.includes(senderJid)) return true;
    
    try {
        const ownerData = JSON.parse(fs.readFileSync('./data/owner.json'));
        const ownerList = ownerData.owner || [];
        if (ownerList.includes(senderJid)) return true;
    } catch (e) {}
    
    return false;
}

async function callLevanterAPI(message, id) {
    try {
        const response = await axios.post('https://levanter.onrender.com/chat', {
            message: message,
            id: id
        }, {
            headers: { 'content-type': 'application/json' },
            timeout: 15000
        });
        return response.data?.result;
    } catch (error) {
        console.log('Levanter API error:', error.message);
        return null;
    }
}

async function callBrainshopAPI(text, participant) {
    try {
        const bid = "159413";
        const key = "LwSCGzmC2qZcqy8k";
        
        const url = `http://api.brainshop.ai/get?bid=${bid}&key=${key}&uid=[${participant}]&msg=[${encodeURIComponent(text)}]`;
        const { data } = await axios.get(url, { timeout: 10000 });
        return data?.cnt;
    } catch (error) {
        console.log('Brainshop API error:', error.message);
        return null;
    }
}

async function callGeminiAPI(text) {
    try {
        const apiUrl = `https://api.nexray.eu.cc/ai/gemini?text=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl, { timeout: 15000 });
        if (data && data.status === true && data.result) {
            return data.result;
        }
        return null;
    } catch (error) {
        console.log('Gemini API error:', error.message);
        return null;
    }
}

async function handleAIChatbot(m, conn, body, from, isGroup, botNumber, isCmd, prefix) {
    try {
        const AI_CHAT = await db.get(botNumber, 'AI_CHAT', false);
        if (!AI_CHAT) return false;

        if (!body || m.key.fromMe || body.startsWith(prefix)) return false;
        
        const senderJid = m.sender;
        if (isOwner(senderJid)) return false;

        let shouldRespond = true;
        
        if (isGroup) {
            // Get mentioned JIDs from the message
            const mentionedJids = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            
            console.log('[CHATBOT] mentionedJids:', mentionedJids);
            
            // Check if bot is in mentioned JIDs
            const isBotMentioned = mentionedJids.includes(botNumber);
            
            console.log('[CHATBOT] isBotMentioned:', isBotMentioned);
            
            // Only respond if bot is mentioned
            if (!isBotMentioned) return false;
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
            const conversationId = isGroup ? `${from}+${m.sender}` : from;
            
            response = await callLevanterAPI(body, conversationId);
            
            if (!response) {
                response = await callBrainshopAPI(body, m.sender);
            }
            
            if (!response) {
                response = await callGeminiAPI(body);
            }
            
            if (!response) {
                response = "I'm having trouble connecting right now. Please try again later.";
            } else {
                response = cleanResponse(response);
            }
        }

        if (!response) {
            response = "I'm having trouble responding right now. Please try again later.";
        }

        updateMemory(from, response, false);
        
        await conn.sendMessage(from, { text: response }, { quoted: m });
        return true;

    } catch (err) {
        console.error('Chatbot error:', err);
        return false;
    }
}

module.exports = { handleAIChatbot };