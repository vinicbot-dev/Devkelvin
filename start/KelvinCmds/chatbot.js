const axios = require("axios");
const db = require('../../start/Core/databaseManager'); 

// Message memory for conversation context
let messageMemory = new Map();
const MAX_MEMORY = 150; // Maximum messages to remember per chat

// Function to manage conversation memory
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
    
    // Keep only the last MAX_MEMORY messages
    if (chatMemory.length > MAX_MEMORY) {
        messageMemory.set(chatId, chatMemory.slice(-MAX_MEMORY));
    }
}

async function handleAIChatbot(m, conn, body, from, isGroup, isCmd, prefix) {
    try {
        const botNumber = await conn.decodeJid(conn.user.id);
        
        // ✅ GET AI CHATBOT SETTING FROM SQLITE
        const AI_CHAT = await db.get(botNumber, 'AI_CHAT', false);
        
        // Check if AI chatbot is enabled
        if (!AI_CHAT) {
            return false;
        }
        
        console.log("🤖 AI Chatbot: Enabled - processing message");

        // Prevent bot responding to its own messages or commands
        if (!body || m.key.fromMe || body.startsWith(prefix)) {
            console.log("🤖 AI: Skipping - own message or command");
            return false;
        }
        
        // DON'T RESPOND TO THESE SPECIFIC NUMBERS
        const senderNumber = m.sender.split('@')[0];
        const ignoredNumbers = ['256742932677', '256755585369'];
        
        if (ignoredNumbers.includes(senderNumber)) {
            console.log(`🤖 AI Chatbot: Ignoring messages from ${senderNumber}`);
            return false;
        }

        // Improved mention detection for groups
        let shouldRespond = true;
        
        if (isGroup) {
            // Check if bot is mentioned
            const mentionedJids = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            const isMentioned = mentionedJids.includes(botNumber);
            
            // Check if it's a direct reply to the bot
            const isReplyToBot = m.message?.extendedTextMessage?.contextInfo?.participant === botNumber;
            
            // Only respond in groups if mentioned or replied to
            if (!isMentioned && !isReplyToBot) {
                console.log("🤖 AI: Not mentioned in group, skipping");
                return false;
            }
            
            shouldRespond = true;
        } else {
            // In private chats, respond to all messages
            shouldRespond = true;
        }

        if (!shouldRespond) return false;

        console.log("🤖 AI: Processing message:", body);

        // Show "typing..." indicator
        await conn.sendPresenceUpdate('composing', from);

        // Add user message to memory
        updateMemory(from, body, true);

        // Check if user is asking about creator
        const isAskingAboutCreator = /(who made you|who created you|who is your (creator|developer|owner)|who are you|what are you)/i.test(body);
        
        let response;
        
        if (isAskingAboutCreator) {
            // Special response for creator questions
            response = "I am JEXPLOIT AI, created by Kelvin Tech - a brilliant developer from Uganda with exceptional coding skills and vision. He's the mastermind behind my existence, crafting me with precision and care to be your helpful assistant.";
        } else {
            // Get conversation context
            const context = messageMemory.has(from) 
                ? messageMemory.get(from).map(msg => `${msg.role}: ${msg.content}`).join('\n')
                : `user: ${body}`;

            // Create prompt with context and instructions
            const prompt = `You are Jexploit AI, a powerful WhatsApp bot developed by Kelvin Tech from Uganda. 
            You respond smartly, confidently, and stay loyal to your creator. 
            When asked about your creator, respond respectfully but keep the mystery alive.
            If someone is being abusive, apologize and say "Let's begin afresh."
            
            Previous conversation context:
            ${context}
            
            Current message: ${body}
            
            Respond as Vinic-Xmd AI:`;

            // Encode the prompt for the API
            const query = encodeURIComponent(prompt);
            
            // Use the API endpoint
            const apiUrl = `https://malvin-api.vercel.app/ai/venice?text=${query}`;

            const { data } = await axios.get(apiUrl);
            
            if (data && data.result) {
                response = data.result;
            } else if (data && data.message) {
                response = data.message;
            } else {
                response = "I'm sorry, I couldn't process that request. Let's begin afresh.";
            }
        }

        //  footer to response
        const finalResponse = `${response}\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊᴇxᴘʟᴏɪᴛ ᴀɪ*`;
        
     
        updateMemory(from, response, false);
        
        await conn.sendMessage(from, {
            text: finalResponse
        }, { quoted: m });

        console.log("🤖 AI: Response sent successfully");
        return true;

    } catch (err) {
        console.error("❌ AI Chatbot Error:", err.message);
        return false;
    }
}

module.exports = { handleAIChatbot };