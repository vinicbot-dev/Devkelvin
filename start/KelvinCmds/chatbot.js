const axios = require("axios");
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const db = require('../../start/Core/databaseManager'); 
const { sendPTT } = require('../../start/utility/kevptt');
const googleTTS = require('google-tts-api');

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

// Meta API Configuration (kept, no longer called - see handleAIChatbot)
const META_API_URL = 'https://meta-api.zone.id/ai/chatgptfree';

// PrinceTech API Configuration (kept, no longer called - see handleAIChatbot)
const PRINCETECH_API_KEY = 'prince';
const PRINCETECH_API_URL = 'https://api.princetechn.com/api/ai/chat';

// Gemini Lite API (sole active text provider - global.KevinApi is set in config.js)
// NOTE: as of Aug 2026 this endpoint has been observed returning the same
// generic, non-specific text for unrelated prompts (verified against a
// "capital of France" test) rather than an answer grounded in the actual
// question. Kept as the only provider per explicit request.
const GEMINI_API_URL = 'https://api.malvin.gleeze.com/api/ai/gemini-lite';
const GEMINI_MODEL = 'gemini-2.0-flash-lite';

function updateMemory(chatId, message, isUser = true) {
    try {
        if (!chatId) return;
        
        if (!messageMemory.has(chatId)) {
            messageMemory.set(chatId, []);
        }
        
        const chatMemory = messageMemory.get(chatId);
        
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

// Meta API for text responses (kept, no longer called - see handleAIChatbot)
async function callMetaAPI(message) {
    try {
        const apiUrl = `${META_API_URL}?prompt=${encodeURIComponent(message)}&model=chatgpt4`;
        
        console.log('[CHATBOT] Sending request to Meta API');
        
        const response = await axios.get(apiUrl, {
            timeout: 30000
        });
        
        if (response.data && response.data.answer) {
            return response.data.answer;
        }
        
        return null;
        
    } catch (error) {
        console.error('Meta API error:', error.message);
        return null;
    }
}

// PrinceTech API for text responses (kept, no longer called - see handleAIChatbot)
async function callPrinceTechAI(message) {
    try {
        const apiUrl = `${PRINCETECH_API_URL}?apikey=${PRINCETECH_API_KEY}&text=${encodeURIComponent(message)}`;
        
        console.log('[CHATBOT] Sending request to PrinceTech API (fallback)');
        
        const response = await axios.get(apiUrl, {
            timeout: 30000
        });
        
        if (response.data && response.data.success === true && response.data.result) {
            return response.data.result;
        }
        
        return null;
        
    } catch (error) {
        console.error('PrinceTech API error:', error.message);
        return null;
    }
}

// Gemini Lite API for text responses (sole active provider)
async function callGeminiLite(message) {
    try {
        const apiUrl = `${GEMINI_API_URL}?prompt=${encodeURIComponent(message)}&model=${GEMINI_MODEL}&apikey=${global.KevinApi}`;

        console.log('[CHATBOT] Sending request to Gemini Lite API');

        const response = await axios.get(apiUrl, {
            timeout: 30000
        });

        const parts = response.data?.data?.parts;
        if (response.data?.status && Array.isArray(parts) && parts.length) {
            const combined = parts.map(p => p.text || '').join('').trim();
            return combined || null;
        }

        return null;

    } catch (error) {
        console.error('Gemini Lite API error:', error.message);
        return null;
    }
}

// Google TTS (Primary for voice)
async function callGoogleTTS(text) {
    try {
        const ttsData = await googleTTS.getAllAudioBase64(text, {
            lang: "en",
            slow: false,
            host: "https://translate.google.com",
            timeout: 10000,
        });

        if (!ttsData.length) return null;

        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
        
        const tempFiles = [];
        for (let i = 0; i < ttsData.length; i++) {
            let filePath = path.join(tempDir, `tts_part${i}.mp3`);
            fs.writeFileSync(filePath, Buffer.from(ttsData[i].base64, "base64"));
            tempFiles.push(filePath);
        }

        const mergedFile = path.join(tempDir, `tts_merged_${Date.now()}.mp3`);
        const ffmpegCommand = `ffmpeg -i "concat:${tempFiles.join('|')}" -acodec copy "${mergedFile}"`;
        
        return new Promise((resolve, reject) => {
            exec(ffmpegCommand, async (err) => {
                if (err) {
                    console.error("FFmpeg error:", err);
                    tempFiles.forEach(file => {
                        try { fs.unlinkSync(file); } catch(e) {}
                    });
                    reject(err);
                    return;
                }

                const audioBuffer = fs.readFileSync(mergedFile);
                
                tempFiles.forEach(file => {
                    try { fs.unlinkSync(file); } catch(e) {}
                });
                try { fs.unlinkSync(mergedFile); } catch(e) {}
                
                resolve(audioBuffer);
            });
        });
    } catch (error) {
        console.error('Google TTS error:', error.message);
        return null;
    }
}

// Fallback TTS (if Google fails)
async function callFallbackTTS(text) {
    try {
        const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
        const response = await axios.get(fallbackUrl, {
            responseType: 'arraybuffer',
            timeout: 30000
        });
        
        if (response.data) {
            return Buffer.from(response.data);
        }
        return null;
    } catch (error) {
        console.error('Fallback TTS error:', error.message);
        return null;
    }
}

async function getVoiceAudio(text) {
    let audioBuffer = await callGoogleTTS(text);
    if (audioBuffer) {
        console.log('✅ Using Google TTS for voice');
        return audioBuffer;
    }
    
    audioBuffer = await callFallbackTTS(text);
    if (audioBuffer) {
        console.log('✅ Using fallback TTS');
        return audioBuffer;
    }
    
    return null;
}

async function sendVoiceResponse(conn, chatId, text, quoted) {
    try {
        const audioBuffer = await getVoiceAudio(text);
        
        if (!audioBuffer) {
            console.log('❌ All TTS services failed');
            return false;
        }
        
        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
        const tempFile = path.join(tempDir, `tts_response_${Date.now()}.mp3`);
        
        fs.writeFileSync(tempFile, audioBuffer);
        
        await sendPTT(conn, chatId, tempFile, quoted);
        
        console.log('✅ Voice message sent successfully');
        
        try {
            fs.unlinkSync(tempFile);
        } catch (e) {}
        
        return true;
    } catch (error) {
        console.error('Send voice response error:', error);
        return false;
    }
}

async function handleAIChatbot(m, conn, body, from, isGroup, botNumber, isCmd, prefix) {
    try {
        const AI_CHAT_TEXT = await db.get(botNumber, 'AI_CHAT_TEXT', false);
        const AI_CHAT_VOICE = await db.get(botNumber, 'AI_CHAT_VOICE', false);
        
        if (!AI_CHAT_TEXT && !AI_CHAT_VOICE) return false;

        if (!body || m.key.fromMe || body.startsWith(prefix)) return false;
        
        const senderJid = m.sender;
        if (isOwner(senderJid)) return false;

        let shouldRespond = true;
        
        if (isGroup) {
            const mentionedJids = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            const isBotMentioned = mentionedJids.includes(botNumber);
            
            if (!isBotMentioned) return false;
            shouldRespond = true;
        }

        if (!shouldRespond) return false;

        if (AI_CHAT_VOICE && !AI_CHAT_TEXT) {
            await conn.sendPresenceUpdate('recording', from);
        } else {
            await conn.sendPresenceUpdate('composing', from);
        }
        
        updateMemory(from, body, true);

        let response = null;
        
        const isAskingAboutCreator = /(who made you|who created you|who is your (creator|developer|owner)|who are you|what are you|your developer|your creator)/i.test(body);
        
        if (isAskingAboutCreator) {
            response = "I was created by Kelvin Tech, a skilled developer from Uganda with exceptional coding abilities. I'm powered by Gemini AI! 🤖";
        } else {
            response = await callGeminiLite(body);

            if (response) {
                console.log('✅ Gemini Lite API responded');
                response = cleanResponse(response);
            }
        }

        if (!response) {
            response = "I'm having trouble responding right now. Please try again later.";
        }

        updateMemory(from, response, false);
        
        const typingDelay = Math.random() * 2000 + 1000;
        await new Promise(resolve => setTimeout(resolve, typingDelay));
        
        if (AI_CHAT_TEXT) {
            await conn.sendMessage(from, { text: response }, { quoted: m });
            console.log('✅ Text message sent successfully');
        }
        
        if (AI_CHAT_VOICE) {
            const voiceSent = await sendVoiceResponse(conn, from, response, m);
            if (!voiceSent && !AI_CHAT_TEXT) {
                await conn.sendMessage(from, { text: response }, { quoted: m });
                console.log('✅ Text message sent successfully (voice fallback)');
            }
        }
        
        return true;

    } catch (err) {
        console.error('Chatbot error:', err);
        return false;
    }
}

module.exports = { handleAIChatbot };