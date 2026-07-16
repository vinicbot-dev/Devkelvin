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

// PrinceTech API Configuration
const PRINCETECH_API_KEY = 'prince_cam';
const PRINCETECH_API_URL = 'https://api.princetechn.com/api/ai/chat';

// MalvinAI API Configuration
const MALVIN_API_KEY = 'mvn_988e8fc44c89ad6e537bb683e681afe6';
const MALVIN_API_URL = 'https://api.malvin.gleeze.com/ai/malvinai';

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

// PrinceTech API for text responses (Primary)
async function callPrinceTechAI(message) {
    try {
        const apiUrl = `${PRINCETECH_API_URL}?apikey=${PRINCETECH_API_KEY}&q=${encodeURIComponent(message)}`;
        
        console.log('[CHATBOT] Sending request to PrinceTech API');
        
        const response = await axios.get(apiUrl, {
            timeout: 30000
        });
        
        if (response.data && response.data.success && response.data.result) {
            return response.data.result;
        }
        
        return null;
        
    } catch (error) {
        console.error('PrinceTech API error:', error.message);
        if (error.response?.status === 403) {
            console.error('API key invalid or expired');
        }
        return null;
    }
}

// MalvinAI API for text responses (Fallback)
async function callMalvinAI(message) {
    try {
        const apiUrl = `${MALVIN_API_URL}?apikey=${MALVIN_API_KEY}&text=${encodeURIComponent(message)}`;
        
        console.log('[CHATBOT] Sending request to MalvinAI API (fallback)');
        
        const response = await axios.get(apiUrl, {
            timeout: 15000
        });
        
        if (response.data && response.data.status === true && response.data.result) {
            return response.data.result;
        } else if (response.data && response.data.message) {
            return response.data.message;
        }
        
        return null;
        
    } catch (error) {
        console.error('MalvinAI API error:', error.message);
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
        // Try using a free TTS API as fallback
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
    // First try Google TTS
    let audioBuffer = await callGoogleTTS(text);
    if (audioBuffer) {
        console.log('✅ Using Google TTS for voice');
        return audioBuffer;
    }
    
    // Fallback to direct Google TTS
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

        // Show recording status for voice, typing for text
        if (AI_CHAT_VOICE && !AI_CHAT_TEXT) {
            await conn.sendPresenceUpdate('recording', from);
        } else {
            await conn.sendPresenceUpdate('composing', from);
        }
        
        updateMemory(from, body, true);

        let response = null;
        
        const isAskingAboutCreator = /(who made you|who created you|who is your (creator|developer|owner)|who are you|what are you|your developer|your creator)/i.test(body);
        
        if (isAskingAboutCreator) {
            response = "I was created by Kelvin Tech, a skilled developer from Uganda with exceptional coding abilities. I'm powered by PrinceTech AI! 🤖";
        } else {
            // FIRST PRIORITY: Try PrinceTech API
            response = await callPrinceTechAI(body);
            
            if (response) {
                console.log('✅ PrinceTech API responded');
                response = cleanResponse(response);
            } else {
                // SECOND PRIORITY: Fallback to MalvinAI API
                console.log('PrinceTech failed, trying MalvinAI...');
                response = await callMalvinAI(body);
                
                if (response) {
                    console.log('✅ MalvinAI API responded');
                    response = cleanResponse(response);
                } else {
                    response = "I'm having trouble connecting right now. Please try again later.";
                }
            }
        }

        if (!response) {
            response = "I'm having trouble responding right now. Please try again later.";
        }

        updateMemory(from, response, false);
        
        // Random delay to simulate human response time (1-3 seconds)
        const typingDelay = Math.random() * 2000 + 1000;
        await new Promise(resolve => setTimeout(resolve, typingDelay));
        
        // Send text response if enabled
        if (AI_CHAT_TEXT) {
            await conn.sendMessage(from, { text: response }, { quoted: m });
            console.log('✅ Text message sent successfully');
        }
        
        // Send voice response if enabled
        if (AI_CHAT_VOICE) {
            const voiceSent = await sendVoiceResponse(conn, from, response, m);
            if (!voiceSent && !AI_CHAT_TEXT) {
                // Fallback: send text if voice fails and text is disabled
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