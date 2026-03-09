
const {
  generateWAMessageFromContent,
  proto,
  downloadContentFromMessage,
  downloadMedaiMesaage
} = require("@whiskeysockets/baileys");
const { exec, spawn, execSync } = require("child_process")
const util = require('util')
const fetch = require('node-fetch')
const path = require('path')
const fs = require('fs');
const axios = require('axios')
const acrcloud = require ('acrcloud');
const FormData = require('form-data');
const cheerio = require('cheerio')
const { performance } = require("perf_hooks");
const moment = require("moment-timezone")
const os = require('os');
const speed = require('performance-now')
const timezones = global.timezones || "Africa/Kampala";
const yts = require("yt-search")
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
const timestampp = speed();
const latensi = speed() - timestampp

const { smsg, sendGmail, formatSize, isUrl, generateMessageTag, CheckBandwidth, getBuffer, getSizeMedia, runtime, fetchJson, sleep, getRandom } = require('./start/lib/myfunction')


//delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//error handling
const errorLog = new Map();
const ERROR_EXPIRY_TIME = 60000; // 60 seconds

const recordError = (error) => {
  const now = Date.now();
  errorLog.set(error, now);
  setTimeout(() => errorLog.delete(error), ERROR_EXPIRY_TIME);
};

const shouldLogError = (error) => {
  const now = Date.now();
  if (errorLog.has(error)) {
    const lastLoggedTime = errorLog.get(error);
    if (now - lastLoggedTime < ERROR_EXPIRY_TIME) {
      return false;
    }
  }
  return true;
};

//Version
const versions = require("./package.json").version;
const db = require('./start/Core/databaseManager');
const dlkey = '_0x5aff35,_0x1876stqr';

//badwords
const bad = JSON.parse(fs.readFileSync("./start/lib/database/badwords.json")); 

//Shazam
const acr = new acrcloud({
    host: 'identify-eu-west-1.acrcloud.com',
    access_key: '882a7ef12dc0dc408f70a2f3f4724340',
    access_secret: 'qVvKAxknV7bUdtxjXS22b5ssvWYxpnVndhy2isXP'
});

//database 
global.db = { data: {} };
global.db.data = JSON.parse(fs.readFileSync("./data/database.json")) || {};

if (global.db.data) {
  global.db.data = {
    chats: {},
    settings: {},
    blacklist: { blacklisted_numbers: [] }, 
    ...(global.db.data || {}),
  };
}

const UPTIME_FILE = path.join(__dirname, 'data', 'server_uptime.json');

// Create data folder if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Get or create server start time
function getServerStartTime() {
    try {
        if (fs.existsSync(UPTIME_FILE)) {
            const data = JSON.parse(fs.readFileSync(UPTIME_FILE, 'utf8'));
            return data.startTime;
        }
    } catch (e) {
        console.log('Creating new uptime file in data folder...');
    }
    
    // Create new uptime file with current time
    const startTime = Date.now();
    fs.writeFileSync(UPTIME_FILE, JSON.stringify({ startTime, createdAt: new Date().toISOString() }));
    return startTime;
}

const SERVER_START_TIME = getServerStartTime();

// Function to get server uptime
function getServerUptime() {
    const uptimeMs = Date.now() - SERVER_START_TIME;
    const uptimeSeconds = Math.floor(uptimeMs / 1000);
    return runtime(uptimeSeconds);
}

// Function to fetch MP3 download URL
async function fetchMp3DownloadUrl(link) {
  const fetchDownloadUrl1 = async (videoUrl) => {
    const apiUrl = `https://veron-apis.zone.id/downloader/youtube?url=${encodeURIComponent(videoUrl)}`;
    try {
      const response = await axios.get(apiUrl);

      if (!response.data || !response.data.result) {
        throw new Error('Failed to fetch from kayiza api');
      }

      return response.data.result.mp3 
          || response.data.result.download 
          || response.data.result.url;

    } catch (error) {
      console.error('Error with Veron API:', error.message);
      throw error;
    }
  };
  const fetchDownloadUrl2 = async (videoUrl) => {
    const apiUrl = `https://meta-api.zone.id/downloader/youtube?url=${encodeURIComponent(videoUrl)}&format=mp3`;
    try {
      const response = await axios.get(apiUrl);

      if (!response.data || !response.data.result) {
        throw new Error('Failed to fetch from kayiza apis');
      }

      return response.data.result.mp3 
          || response.data.result.download 
          || response.data.result.url;

    } catch (error) {
      console.error('Error with Meta API:', error.message);
      throw error;
    }
  };

  // MAIN HANDLER
  try {
    let downloadUrl;
    try {
      downloadUrl = await fetchDownloadUrl1(link);
    } catch (error) {
      console.log('Falling back to Meta API...');
      downloadUrl = await fetchDownloadUrl2(link);
    }
    return downloadUrl;
  } catch (error) {
    throw error;
  }
}

async function fetchVideoDownloadUrl(link) {
  const apiUrl = `https://api.giftedtech.my.id/api/download/dlmp4?apikey=${dlkey}&url=${encodeURIComponent(link)}`;
  
  try {
    const response = await axios.get(apiUrl);
    if (response.status !== 200 || !response.data.success) {
      throw new Error('Failed to retrieve the video!');
    }
    return response.data.result;
  } catch (error) {
    console.error('Error fetching video download URL:', error.message);
    throw error;
  }
}

async function saveStatusMessage(m) {
  try {
    if (!m.quoted || m.quoted.chat !== 'status@broadcast') {
      return reply('*Please reply to a status message!*');
    }
    await m.quoted.copyNForward(m.chat, true);
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    console.log('Status saved successfully!');
  } catch (error) {
    console.error('Failed to save status message:', error);
    reply(`Error: ${error.message}`);
  }
}

async function ephoto(url, texk) {
      let form = new FormData();
      let gT = await axios.get(url, {
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
        },
      });
      let $ = cheerio.load(gT.data);
      let text = texk;
      let token = $("input[name=token]").val();
      let build_server = $("input[name=build_server]").val();
      let build_server_id = $("input[name=build_server_id]").val();
      form.append("text[]", text);
      form.append("token", token);
      form.append("build_server", build_server);
      form.append("build_server_id", build_server_id);
      let res = await axios({
        url: url,
        method: "POST",
        data: form,
        headers: {
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.9",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
          cookie: gT.headers["set-cookie"]?.join("; "),
          "Content-Type": "multipart/form-data",
        },
      });
      let $$ = cheerio.load(res.data);
      let json = JSON.parse($$("input[name=form_value_input]").val());
      json["text[]"] = json.text;
      delete json.text;
      let { data } = await axios.post(
        "https://en.ephoto360.com/effect/create-image",
        new URLSearchParams(json),
        {
          headers: {
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
            cookie: gT.headers["set-cookie"].join("; "),
          },
        }
      );
      return build_server + data.image;
 }


const pickRandom = (arr) => {
return arr[Math.floor(Math.random() * arr.length)]
}

//================== [ MESSAGE HANDLING FUNCTIONS ] ==================//
function loadBlacklist() {
    if (!global.db.data.blacklist) {
        global.db.data.blacklist = { blacklisted_numbers: [] };
    }
    return global.db.data.blacklist;
}
// ========== HELPER FUNCTIONS ==========

// Helper function to extract text from message
function extractMessageText(message) {
    if (!message) return "";
    
    if (message.conversation) {
        return message.conversation;
    } else if (message.extendedTextMessage?.text) {
        return message.extendedTextMessage.text;
    } else if (message.imageMessage?.caption) {
        return message.imageMessage.caption;
    } else if (message.videoMessage?.caption) {
        return message.videoMessage.caption;
    } else if (message.documentMessage?.caption) {
        return message.documentMessage.caption;
    } else if (message.protocolMessage?.editedMessage) {
        // Handle edited messages recursively
        return extractMessageText(message.protocolMessage.editedMessage);
    }
    return "";
}



// ========== MESSAGE STORAGE FOR ANTI-DELETE ==========
function loadStoredMessages() {
    try {
        if (fs.existsSync('./start/lib/database/deleted_messages.json')) {
            const data = fs.readFileSync('./start/lib/database/deleted_messages.json', 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading stored messages:', error);
    }
    return {};
}

function saveStoredMessages(messages) {
    try {
        const dir = './start/lib/database';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync('./start/lib/database/deleted_messages.json', JSON.stringify(messages, null, 2));
    } catch (error) {
        console.error('Error saving stored messages:', error);
    }
}

function storeMessage(chatId, messageId, messageData) {
    try {
        const storedMessages = loadStoredMessages();
        
        if (!storedMessages[chatId]) {
            storedMessages[chatId] = {};
        }
        
        // Extract text content and detect media type
        let textContent = "";
        let mediaType = "text";
        const msgType = Object.keys(messageData.message || {})[0];
        
        if (msgType === 'conversation') {
            textContent = messageData.message.conversation;
        } else if (msgType === 'extendedTextMessage') {
            textContent = messageData.message.extendedTextMessage?.text || "";
        } else if (msgType === 'imageMessage') {
            textContent = messageData.message.imageMessage?.caption || "";
            mediaType = "image";
        } else if (msgType === 'videoMessage') {
            textContent = messageData.message.videoMessage?.caption || "";
            mediaType = "video";
        } else if (msgType === 'audioMessage') {
            textContent = "";
            mediaType = "audio";
        } else if (msgType === 'stickerMessage') {
            textContent = "";
            mediaType = "sticker";
        } else {
            textContent = "";
        }
        
        storedMessages[chatId][messageId] = {
            key: messageData.key,
            message: messageData.message,
            messageTimestamp: messageData.messageTimestamp,
            pushName: messageData.pushName,
            text: textContent,
            mediaType: mediaType,
            storedAt: Date.now(),
            remoteJid: messageData.key?.remoteJid || chatId
        };
        
        // Limit storage per chat to prevent memory issues
        const chatMessages = Object.keys(storedMessages[chatId]);
        if (chatMessages.length > 100) {
            const oldestMessageId = chatMessages[0];
            delete storedMessages[chatId][oldestMessageId];
        }
        
        saveStoredMessages(storedMessages);
        
    } catch (error) {
        console.error("Error storing message:", error);
    }
}
async function handleAntiEdit(m, conn) {
    try {
        // Get bot number
        const botNumber = await conn.decodeJid(conn.user.id);
        
        const antieditSetting = await db.get(botNumber, 'antiedit', 'off');
        
        // Check if anti-edit is enabled and we have an edited message
        if (!antieditSetting || antieditSetting === 'off' || !m.message?.protocolMessage?.editedMessage) {
            return;
        }

        let messageId = m.message.protocolMessage.key.id;
        let chatId = m.chat;
        let editedBy = m.sender;

        let storedMessages = loadStoredMessages();
        let originalMsg = storedMessages[chatId]?.[messageId];

        if (!originalMsg) {
            console.log("⚠️ Original message not found in store.json.");
            return;
        }

        let sender = originalMsg.key?.participant || originalMsg.key?.remoteJid;
        
        // Get chat name
        let chatName;
        if (chatId.endsWith("@g.us")) {
            try {
                const groupInfo = await conn.groupMetadata(chatId);
                chatName = groupInfo.subject || "Group Chat";
            } catch {
                chatName = "Group Chat";
            }
        } else {
            chatName = originalMsg.pushName || "Private Chat";
        }

        let xtipes = moment(originalMsg.messageTimestamp * 1000).tz(`${timezones}`).locale('en').format('HH:mm z');
        let xdptes = moment(originalMsg.messageTimestamp * 1000).tz(`${timezones}`).format("DD/MM/YYYY");

        // Get original text
        let originalText = originalMsg.message?.conversation || 
                          originalMsg.message?.extendedTextMessage?.text ||
                          originalMsg.text ||
                          "[Text not available]";

        // Get edited text
        let editedText = m.message.protocolMessage?.editedMessage?.conversation || 
                        m.message.protocolMessage?.editedMessage?.extendedTextMessage?.text ||
                        "[Edit content not available]";

        let replyText = `🔮 *𝙴𝙳𝙸𝚃𝙴𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴!* 🔮
${readmore}
• 𝙲𝙷𝙰𝚃: ${chatName}
• 𝚂𝙴𝙽𝚃 𝙱𝚈: @${sender.split('@')[0]} 
• 𝚃𝙸𝙼𝙴: ${xtipes}
• 𝙳𝙰𝚃𝙴: ${xdptes}
• 𝙴𝙳𝙸𝚃𝙴𝙳 𝙱𝚈: @${editedBy.split('@')[0]}

• 𝙾𝚁𝙸𝙶𝙸𝙽𝙰𝙻: ${originalText}

• 𝙴𝙳𝙸𝚃𝙴𝙳 𝚃𝙾: ${editedText}`;

        let quotedMessage = {
            key: {
                remoteJid: chatId,
                fromMe: sender === conn.user.id,
                id: messageId,
                participant: sender
            },
            message: {
                conversation: originalText 
            }
        };

        // Determine target based on mode from SQLite settings
        let targetChat;
        if (antieditSetting === 'private') {
            targetChat = conn.user.id; // Send to bot owner
            console.log(`📤 Anti-edit: Sending to bot owner's inbox`);
        } else if (antieditSetting === 'chat') {
            targetChat = chatId; // Send to same chat
            console.log(`📤 Anti-edit: Sending to same chat`);
        } else {
            console.log("❌ Invalid anti-edit mode");
            return;
        }

        await conn.sendMessage(
            targetChat, 
            { text: replyText, mentions: [sender, editedBy] }, 
            { quoted: quotedMessage }
        );

    } catch (err) {
        console.error("❌ Error processing edited message:", err);
    }
}
// Function to handle status updates
async function handleStatusUpdate(conn, status) {
    try {
        // Check if this is a status update
        let msgKey = null;
        let isStatus = false;
        
        // Handle different status update formats
        if (status.messages && status.messages.length > 0) {
            const msg = status.messages[0];
            if (msg.key && msg.key.remoteJid === 'status@broadcast') {
                // Check if this is from the bot itself - IGNORE!
                if (msg.key.fromMe) {
                    return; // Don't process bot's own status reactions
                }
                msgKey = msg.key;
                isStatus = true;
            }
        } else if (status.key && status.key.remoteJid === 'status@broadcast') {
            // Check if this is from the bot itself - IGNORE!
            if (status.key.fromMe) {
                return; // Don't process bot's own status reactions
            }
            msgKey = status.key;
            isStatus = true;
        } else if (status.reaction && status.reaction.key && status.reaction.key.remoteJid === 'status@broadcast') {
            // Check if this is from the bot itself - IGNORE!
            if (status.reaction.key.fromMe) {
                return; // Don't process bot's own status reactions
            }
            msgKey = status.reaction.key;
            isStatus = true;
        }
        
        if (!isStatus || !msgKey) return;
        
        // Get bot number
        const botNumber = await conn.decodeJid(conn.user.id);
        
        // Get settings from database
        const autoviewstatus = await db.get(botNumber, 'autoviewstatus', false);
        const autoreactstatus = await db.get(botNumber, 'autoreactstatus', false);
        const statusemoji = await db.get(botNumber, 'statusemoji', '💚');
        
        // If both are disabled, return
        if (!autoviewstatus && !autoreactstatus) return;
        
        console.log(`📱 Status update detected - View: ${autoviewstatus}, React: ${autoreactstatus}`);
        
        // Add small delay to prevent rate limiting
        await sleep(2000);
        
        // View the status first (always view if either is enabled)
        if (autoviewstatus || autoreactstatus) {
            try {
                await conn.readMessages([msgKey]);
                console.log('✅ Status viewed');
            } catch (viewError) {
                console.log('⚠️ Error viewing status:', viewError.message);
            }
        }
        
        // React to status if enabled
        if (autoreactstatus) {
            try {
                // Add another small delay before reacting
                await sleep(1500);
                
                // Determine emoji to use
                let emoji = statusemoji;
                
                // If emoji is still the default '💚' or not set, use random
                if (emoji === '💚' || !emoji) {
                    const emojis = ['❤️','😂','😮','😢','🔥','👏','🎉','🤔','👍','👎','😍','🤯','😡','🥰','😎','🤩','🥳','😭','🙏','💯'];
                    emoji = emojis[Math.floor(Math.random() * emojis.length)];
                }
                
                await conn.sendMessage(msgKey.remoteJid, { 
                    react: { 
                        text: emoji, 
                        key: msgKey 
                    } 
                });
                console.log(`✅ Status reacted with ${emoji}`);
                
            } catch (reactError) {
                if (reactError.message?.includes('rate-overlimit')) {
                    console.log('⚠️ Rate limited, waiting before retry...');
                    await sleep(5000);
                    try {
                        let emoji = statusemoji;
                        if (emoji === '💚' || !emoji) {
                            const emojis = ['❤️','😂','😮','😢','🔥','👏','🎉','🤔','👍','👎','😍','🤯','😡','🥰','😎','🤩','🥳','😭','🙏','💯'];
                            emoji = emojis[Math.floor(Math.random() * emojis.length)];
                        }
                        await conn.sendMessage(msgKey.remoteJid, { 
                            react: { text: emoji, key: msgKey } 
                        });
                        console.log('✅ Status reacted on retry');
                    } catch (retryError) {
                        console.log('❌ Still rate limited, skipping this status');
                    }
                } else {
                    console.log('❌ Error reacting to status:', reactError.message);
                }
            }
        }
        
    } catch (error) {
        console.error('❌ Error in handleStatusUpdate:', error.message);
    }
}

// antilink section 
function detectUrls(message) {
    if (!message) return [];
    
    let text = "";
    
    // Extract text from different message types
    if (message.conversation) {
        text = message.conversation;
    } else if (message.extendedTextMessage && message.extendedTextMessage.text) {
        text = message.extendedTextMessage.text;
    } else if (message.imageMessage && message.imageMessage.caption) {
        text = message.imageMessage.caption;
    } else if (message.videoMessage && message.videoMessage.caption) {
        text = message.videoMessage.caption;
    } else if (message.documentMessage && message.documentMessage.caption) {
        text = message.documentMessage.caption;
    }
    
    if (!text || typeof text !== 'string') return [];
    
    const urlRegex = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    
    const matches = text.match(urlRegex);
    return matches ? matches : [];
}

async function handleLinkViolation(conn, m, message, botNumber) {
    try {
        if (!message || !message.key || !message.key.remoteJid) {
            return;
        }
        
        const chatId = message.key.remoteJid;
        const sender = message.key.participant || message.key.remoteJid;
        const messageId = message.key.id;
        const isGroup = chatId.endsWith('@g.us');

        // Only works in groups
        if (!isGroup) return;
     
        // Skip if sender is admin
        if (m.isAdmin) {
            return;
        }
        
        const isEnabled = await db.getGroupSetting(botNumber, chatId, 'antilink', false);
        const mode = await db.getGroupSetting(botNumber, chatId, 'antilinkmode', 'delete'); // Changed to antilinkmode
        const allowlink = await db.getGroupSetting(botNumber, chatId, 'allowlink', []); 
        
        // Check if sender is allowed to post links
        if (allowlink.includes(sender)) {
            console.log(`✅ ${sender} is allowed to post links`);
            return;
        }
        
        if (!isEnabled) return;
        
        // Detect URLs in the message
        const urls = detectUrls(message.message);
        if (urls.length === 0) return;

        // Delete the message
        try {
            await conn.sendMessage(chatId, {
                delete: {
                    id: messageId,
                    remoteJid: chatId,
                    fromMe: false,
                    participant: sender
                }
            });
            
            console.log(`✅ Link message deleted from ${sender} in ${chatId}`);
            
        } catch (deleteError) {
            console.log('❌ Failed to delete message - Bot may need admin permissions');
            return;
        }

        // Handle based on mode
        switch(mode) {
            case 'warn': {
                // Initialize warnings map if not exists
                if (!global.linkWarnings) global.linkWarnings = new Map();
                
                const warningKey = `${chatId}:${sender}`;
                const userWarnings = global.linkWarnings.get(warningKey) || { count: 0, lastWarning: 0 };
                
                userWarnings.count++;
                userWarnings.lastWarning = Date.now();
                global.linkWarnings.set(warningKey, userWarnings);
                
                let responseMessage = `⚠️ @${sender.split('@')[0]}, links are not allowed in this group!\nWarning: *${userWarnings.count}/3*`;
                
                // Auto-kick after 3 warnings
                if (userWarnings.count >= 3) {
                    try {
                        await conn.groupParticipantsUpdate(chatId, [sender], "remove");
                        responseMessage = `🚫 @${sender.split('@')[0]} *has been removed for posting links*.`;
                        global.linkWarnings.delete(warningKey);
                    } catch (kickError) {
                        responseMessage = `⚠️ @${sender.split('@')[0]}, links are not allowed! (Failed to remove - check bot permissions)`;
                    }
                }
                
                await delay(1000);
                await conn.sendMessage(chatId, {
                    text: responseMessage,
                    mentions: [sender]
                });
                break;
            }
            
            case 'kick': {
                try {
                    await conn.groupParticipantsUpdate(chatId, [sender], "remove");
                    await delay(1000);
                    await conn.sendMessage(chatId, {
                        text: `🚫 @${sender.split('@')[0]} *has been removed for posting links*.`,
                        mentions: [sender]
                    });
                } catch (kickError) {
                    await delay(1000);
                    await conn.sendMessage(chatId, {
                        text: `⚠️ @${sender.split('@')[0]}, links are not allowed! (Failed to remove - check bot permissions)`,
                        mentions: [sender]
                    });
                }
                break;
            }
            
            case 'delete':
            default: {
                // Just delete the message, no warning
                break;
            }
        }
        
    } catch (error) {
        console.error('❌ Error in handleLinkViolation:', error);
    }
}
async function handleAntiTag(conn, m, botNumber) {
    try {
        if (!m || !m.isGroup || !m.message || m.key.fromMe) {
            return;
        }

        const chatId = m.chat;
        const sender = m.sender;

        // Skip if sender is admin
        if (m.isAdmin) {
            return;
        }
        
        // Get antitag settings - NO ALLOWLIST
        const isEnabled = await db.getGroupSetting(botNumber, chatId, 'antitag', false);
        const mode = await db.getGroupSetting(botNumber, chatId, 'antitagmode', 'delete');
        
        if (!isEnabled) return;
        
        // Check if user tagged someone
        const mentionedUsers = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        
        if (mentionedUsers.length > 0) {
            // Delete the message
            try {
                await conn.sendMessage(chatId, { delete: m.key });
                console.log(`✅ Deleted tag message from ${sender} in ${chatId}`);
            } catch (deleteError) {
                console.log('❌ Failed to delete message - Bot may need admin permissions');
                return;
            }
            
            // Handle based on mode
            switch(mode) {
                case 'warn': {
                    // Initialize warnings map if not exists
                    if (!global.tagWarnings) global.tagWarnings = new Map();
                    
                    // Get or create user warnings for this specific group
                    const warningKey = `${chatId}:${sender}`;
                    const userWarnings = global.tagWarnings.get(warningKey) || { count: 0, lastWarning: 0 };
                    
                    userWarnings.count++;
                    userWarnings.lastWarning = Date.now();
                    global.tagWarnings.set(warningKey, userWarnings);
                    
                    let responseMessage = `⚠️ @${sender.split('@')[0]}, tagging members is not allowed in this group!\nWarning: *${userWarnings.count}/3*`;
                    
                    // Auto-kick after 3 warnings
                    if (userWarnings.count >= 3) {
                        try {
                            await conn.groupParticipantsUpdate(chatId, [sender], "remove");
                            responseMessage = `🚫 @${sender.split('@')[0]} *has been removed for excessive tagging*.`;
                            global.tagWarnings.delete(warningKey);
                        } catch (kickError) {
                            responseMessage = `⚠️ @${sender.split('@')[0]}, tagging is not allowed! (Failed to remove - check bot permissions)`;
                        }
                    }
                    
                    await conn.sendMessage(chatId, {
                        text: responseMessage,
                        mentions: [sender]
                    });
                    break;
                }
                
                case 'kick': {
                    try {
                        await conn.groupParticipantsUpdate(chatId, [sender], "remove");
                        await conn.sendMessage(chatId, {
                            text: `🚫 @${sender.split('@')[0]} *has been removed for tagging members*.`,
                            mentions: [sender]
                        });
                    } catch (kickError) {
                        await conn.sendMessage(chatId, {
                            text: `⚠️ @${sender.split('@')[0]}, tagging is not allowed! (Failed to remove - check bot permissions)`,
                            mentions: [sender]
                        });
                    }
                    break;
                }
                
                case 'delete':
                default: {
                    // Just delete, no message
                    break;
                }
            }
        }
        
    } catch (error) {
        console.error('Anti-tag error:', error);
    }
}

async function handleAntiTagAdmin(conn, m) {
    try {
        if (!m || !m.isGroup || !m.message || m.key.fromMe) {
            return;
        }

        const botNumber = await conn.decodeJid(conn.user.id);
        const chatId = m.chat;
        const sender = m.sender;
        const message = m.message;
        
        // Get antitag admin settings - NO ALLOWLIST
        const isEnabled = await db.getGroupSetting(botNumber, chatId, 'antitagadmin', false);
        const action = await db.getGroupSetting(botNumber, chatId, 'antitagadminaction', 'warn');
        
        if (!isEnabled) return;
        
        // Skip if sender is admin
        if (m.isAdmin) {
            return;
        }
        
        // Get group admins
        const groupMetadata = await conn.groupMetadata(chatId);
        const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
        
        // Check if message contains @admin or tags admin
        const messageText = extractMessageText(message);
        const mentionedUsers = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        
        // Check for @admin mentions
        const hasAdminMention = messageText.toLowerCase().includes('@admin') || 
                               messageText.toLowerCase().includes('@admins');
        
        // Check if any mentioned user is an admin
        const isTaggingAdmin = mentionedUsers.some(user => admins.includes(user));
        
        if (hasAdminMention || isTaggingAdmin) {
            // Delete the message
            try {
                await conn.sendMessage(chatId, { delete: m.key });
                console.log(`✅ Deleted admin tag message from ${sender} in ${chatId}`);
            } catch (deleteError) {
                console.log('❌ Failed to delete message - Bot may need admin permissions');
                return;
            }
            
            // Handle based on action setting
            switch(action) {
                case 'warn': {
                    // Initialize warnings map if not exists
                    if (!global.adminTagWarnings) global.adminTagWarnings = new Map();
                    
                    // Get or create user warnings for this specific group
                    const warningKey = `${chatId}:${sender}`;
                    const userWarnings = global.adminTagWarnings.get(warningKey) || { count: 0, lastWarning: 0 };
                    
                    userWarnings.count++;
                    userWarnings.lastWarning = Date.now();
                    global.adminTagWarnings.set(warningKey, userWarnings);
                    
                    let responseMessage = `⚠️ @${sender.split('@')[0]}, tagging admins is NOT allowed!\nWarning: *${userWarnings.count}/3*`;
                    
                    // Auto-kick after 3 warnings
                    if (userWarnings.count >= 3) {
                        try {
                            await conn.groupParticipantsUpdate(chatId, [sender], "remove");
                            responseMessage = `🚫 @${sender.split('@')[0]} *has been removed for repeatedly tagging admins*.`;
                            global.adminTagWarnings.delete(warningKey);
                        } catch (kickError) {
                            responseMessage = `⚠️ @${sender.split('@')[0]}, tagging admins is not allowed! (Failed to remove - check bot permissions)`;
                        }
                    }
                    
                    await conn.sendMessage(chatId, {
                        text: responseMessage,
                        mentions: [sender]
                    });
                    break;
                }
                
                case 'kick': {
                    try {
                        await conn.groupParticipantsUpdate(chatId, [sender], "remove");
                        await conn.sendMessage(chatId, {
                            text: `🚫 @${sender.split('@')[0]} *has been removed for tagging admins*.`,
                            mentions: [sender]
                        });
                    } catch (kickError) {
                        await conn.sendMessage(chatId, {
                            text: `⚠️ @${sender.split('@')[0]}, tagging admins is not allowed! (Failed to remove - check bot permissions)`,
                            mentions: [sender]
                        });
                    }
                    break;
                }
                
                case 'delete':
                default: {
                    // Just delete the message, no warning
                    break;
                }
            }
        }
        
    } catch (error) {
        console.error('Anti-tag admin error:', error);
    }
}


/**
 * ANTIDEMOTE COMMAND
 * Prevents admins from being demoted
 */
async function antidemoteCommand(conn, m, args, Access, botNumber) {
    try {
        const chatId = m.chat;
        
        // Check if sender is admin using m.isAdmin
        if (!m.isAdmin && !Access) {
            await conn.sendMessage(chatId, { text: '❌ For Group Admins Only' }, { quoted: m });
            return;
        }

        const action = args[0]?.toLowerCase();

        if (!action) {
            const usage = `🛡️ *ANTIDEMOTE*\n\n` +
                `• ${m.prefix}antidemote on\n` +
                `• ${m.prefix}antidemote off\n` +
                `• ${m.prefix}antidemote status`;
            await conn.sendMessage(chatId, { text: usage }, { quoted: m });
            return;
        }

        switch (action) {
            case 'on':
                await db.setAntidemote(botNumber, chatId, true);
                await conn.sendMessage(chatId, { 
                    text: '✅ *antidemote enabled successfully*'
                }, { quoted: m });
                break;

            case 'off':
                await db.setAntidemote(botNumber, chatId, false);
                await conn.sendMessage(chatId, { 
                    text: '*antidemote disabled successfully*' 
                }, { quoted: m });
                break;

            case 'status':
                const enabled = await db.getAntidemote(botNumber, chatId);
                await conn.sendMessage(chatId, { 
                    text: `📊 Status: ${enabled ? 'ON' : 'OFF'}` 
                }, { quoted: m });
                break;

            default:
                await conn.sendMessage(chatId, { 
                    text: '❌ Use: on, off, status' 
                }, { quoted: m });
        }
    } catch (error) {
        console.error('❌ Error in antidemote command:', error);
        await conn.sendMessage(m.chat, { 
            text: '❌ An error occurred' 
        }, { quoted: m });
    }
}

/**
 * HANDLE ANTIDEMOTE EVENT
 * Re-promotes admins when demoted
 */
async function handleAntidemote(conn, chatId, participants, author) {
    try {
        const botNumber = await conn.decodeJid(conn.user.id);
        const enabled = await db.getAntidemote(botNumber, chatId);
        
        if (!enabled) return false;

        // Get group metadata
        const groupMetadata = await conn.groupMetadata(chatId);
        
        let reproMotedCount = 0;
        
        // Re-promote each demoted participant
        for (const participant of participants) {
            await conn.groupParticipantsUpdate(chatId, [participant], 'promote');
            console.log(`[ANTIDEMOTE] ✅ Re-promoted ${participant}`);
            reproMotedCount++;
        }
        
        // Send notification
        if (reproMotedCount > 0) {
            await conn.sendMessage(chatId, {
                text: `🛡️ Admin re-promoted`
            });
        }

        return reproMotedCount > 0;
    } catch (error) {
        console.error('❌ Error in handleAntidemote:', error);
        return false;
    }
}

/**
 * ANTIPROMOTE COMMAND
 * Prevents unauthorized promotions
 */
async function antipromoteCommand(conn, m, args, Access, botNumber) {
    try {
        const chatId = m.chat;
        
        // Check if sender is admin using m.isAdmin
        if (!m.isAdmin && !Access) {
            await conn.sendMessage(chatId, { text: '❌ For Group Admins Only' }, { quoted: m });
            return;
        }

        const action = args[0]?.toLowerCase();

        if (!action) {
            const usage = `*ANTIPROMOTE*\n\n` +
                `• ${m.prefix}antipromote on\n` +
                `• ${m.prefix}antipromote off\n` +
                `• ${m.prefix}antipromote status`;
            await conn.sendMessage(chatId, { text: usage }, { quoted: m });
            return;
        }

        switch (action) {
            case 'on':
                await db.setAntipromote(botNumber, chatId, true);
                await conn.sendMessage(chatId, { 
                    text: '✅ *Successfully enabled antipromote*' 
                }, { quoted: m });
                break;

            case 'off':
                await db.setAntipromote(botNumber, chatId, false);
                await conn.sendMessage(chatId, { 
                    text: 'Successfully disabled antipromote*' 
                }, { quoted: m });
                break;

            case 'status':
                const enabled = await db.getAntipromote(botNumber, chatId);
                await conn.sendMessage(chatId, { 
                    text: `📊 Status: ${enabled ? 'ON' : 'OFF'}` 
                }, { quoted: m });
                break;

            default:
                await conn.sendMessage(chatId, { 
                    text: '❌ Use: on, off, status' 
                }, { quoted: m });
        }
    } catch (error) {
        console.error('❌ Error in antipromote command:', error);
        await conn.sendMessage(m.chat, { 
            text: '❌ An error occurred' 
        }, { quoted: m });
    }
}

/**
 * HANDLE ANTIPROMOTE EVENT
 * Demotes users promoted by non-admins
 */
async function handleAntipromote(conn, chatId, participants, author) {
    try {
        const botNumber = await conn.decodeJid(conn.user.id);
        const enabled = await db.getAntipromote(botNumber, chatId);
        
        if (!enabled) return false;

        // Check if author is admin using existing admin check
        // We'll rely on the event data - if author is not admin, they shouldn't be promoting
        
        let demotedCount = 0;
        
        // Demote all promoted participants
        for (const participant of participants) {
            await conn.groupParticipantsUpdate(chatId, [participant], 'demote');
            console.log(`[ANTIPROMOTE] ✅ Demoted ${participant}`);
            demotedCount++;
        }
        
        // Send notification
        if (demotedCount > 0) {
            await conn.sendMessage(chatId, {
                text: `🛡️ Unauthorized promotion reversed`
            });
        }

        return demotedCount > 0;
    } catch (error) {
        console.error('❌ Error in handleAntipromote:', error);
        return false;
    }
}

async function handleBadword(conn, m, botNumber) {
    try {
        if (!m || !m.isGroup || !m.message || m.key.fromMe) {
            return;
        }

        const chatId = m.chat;
        const sender = m.sender;
        const messageText = extractMessageText(m.message);

        if (!messageText) return;

        // Skip if sender is admin
        if (m.isAdmin) {
            return;
        }

        // Get antibadword settings
        const isEnabled = await db.getGroupSetting(botNumber, chatId, 'antibadword', false);
        if (!isEnabled) return;

        const badwords = await db.getGroupSetting(botNumber, chatId, 'badwords', []);
        if (badwords.length === 0) return;

        const action = await db.getGroupSetting(botNumber, chatId, 'badwordaction', 'delete');

        // Check if message contains any badword
        const foundBadword = badwords.some(word => 
            messageText.toLowerCase().includes(word.toLowerCase())
        );

        if (!foundBadword) return;

        console.log(`🔴 Badword detected from ${sender} in ${chatId} - Action: ${action}`);

        // Delete the message
        try {
            await conn.sendMessage(chatId, { delete: m.key });
            console.log(`✅ Deleted badword message from ${sender} in ${chatId}`);
        } catch (deleteError) {
            console.log('❌ Failed to delete message - Bot may need admin permissions');
            return;
        }

        // Handle based on action
        switch(action) {
            case 'warn': {
                // Initialize warnings map if not exists
                if (!global.badwordWarnings) global.badwordWarnings = new Map();
                
                const warningKey = `${chatId}:${sender}`;
                const userWarnings = global.badwordWarnings.get(warningKey) || { count: 0, lastWarning: 0 };
                
                userWarnings.count++;
                userWarnings.lastWarning = Date.now();
                global.badwordWarnings.set(warningKey, userWarnings);
                
                let responseMessage = `⚠️ @${sender.split('@')[0]}, inappropriate words are not allowed in this group!\nWarning: *${userWarnings.count}/3*`;
                
                // Auto-kick after 3 warnings
                if (userWarnings.count >= 3) {
                    try {
                        await conn.groupParticipantsUpdate(chatId, [sender], "remove");
                        responseMessage = `🚫 @${sender.split('@')[0]} *has been removed for using inappropriate words*.`;
                        global.badwordWarnings.delete(warningKey);
                    } catch (kickError) {
                        responseMessage = `⚠️ @${sender.split('@')[0]}, inappropriate words are not allowed! (Failed to remove - check bot permissions)`;
                    }
                }
                
                await sleep(1000);
                await conn.sendMessage(chatId, {
                    text: responseMessage,
                    mentions: [sender]
                });
                break;
            }
            
            case 'kick': {
                try {
                    await conn.groupParticipantsUpdate(chatId, [sender], "remove");
                    await sleep(1000);
                    await conn.sendMessage(chatId, {
                        text: `🚫 @${sender.split('@')[0]} *has been removed for using inappropriate words*.`,
                        mentions: [sender]
                    });
                } catch (kickError) {
                    await sleep(1000);
                    await conn.sendMessage(chatId, {
                        text: `⚠️ @${sender.split('@')[0]}, inappropriate words are not allowed! (Failed to remove - check bot permissions)`,
                        mentions: [sender]
                    });
                }
                break;
            }
            
            case 'delete':
            default: {
                // Just delete the message, no warning
                break;
            }
        }

    } catch (error) {
        console.error('❌ Error in handleBadword:', error);
    }
}

async function handleAntisticker(conn, m, botNumber) {
    try {
        if (!m || !m.isGroup || !m.message || m.key.fromMe) {
            return;
        }

        const chatId = m.chat;
        const sender = m.sender;

        // Skip if sender is admin
        if (m.isAdmin) {
            return;
        }

        // Check if message is a sticker
        const isSticker = m.mtype === 'stickerMessage' || 
                          m.message?.stickerMessage || 
                          (m.quoted && m.quoted.mtype === 'stickerMessage');

        if (!isSticker) return;

        // Get antisticker settings
        const isEnabled = await db.getGroupSetting(botNumber, chatId, 'antisticker', false);
        if (!isEnabled) return;

        const action = await db.getGroupSetting(botNumber, chatId, 'antistickeraction', 'delete');

        console.log(`🖼️ Sticker detected from ${sender} in ${chatId} - Action: ${action}`);

        // Delete the sticker message
        try {
            await conn.sendMessage(chatId, { delete: m.key });
            console.log(`✅ Deleted sticker message from ${sender} in ${chatId}`);
        } catch (deleteError) {
            console.log('❌ Failed to delete sticker - Bot may need admin permissions');
            return;
        }

        // Handle based on action
        switch(action) {
            case 'warn': {
                // Initialize warnings map if not exists
                if (!global.stickerWarnings) global.stickerWarnings = new Map();
                
                const warningKey = `${chatId}:${sender}`;
                const userWarnings = global.stickerWarnings.get(warningKey) || { count: 0, lastWarning: 0 };
                
                userWarnings.count++;
                userWarnings.lastWarning = Date.now();
                global.stickerWarnings.set(warningKey, userWarnings);
                
                let responseMessage = `⚠️ @${sender.split('@')[0]}, stickers are not allowed in this group!\nWarning: *${userWarnings.count}/3*`;
                
                // Auto-kick after 3 warnings
                if (userWarnings.count >= 3) {
                    try {
                        await conn.groupParticipantsUpdate(chatId, [sender], "remove");
                        responseMessage = `🚫 @${sender.split('@')[0]} *has been removed for sending stickers*.`;
                        global.stickerWarnings.delete(warningKey);
                    } catch (kickError) {
                        responseMessage = `⚠️ @${sender.split('@')[0]}, stickers are not allowed! (Failed to remove - check bot permissions)`;
                    }
                }
                
                await sleep(1000);
                await conn.sendMessage(chatId, {
                    text: responseMessage,
                    mentions: [sender]
                });
                break;
            }
            
            case 'kick': {
                try {
                    await conn.groupParticipantsUpdate(chatId, [sender], "remove");
                    await sleep(1000);
                    await conn.sendMessage(chatId, {
                        text: `🚫 @${sender.split('@')[0]} *has been removed for sending stickers*.`,
                        mentions: [sender]
                    });
                } catch (kickError) {
                    await sleep(1000);
                    await conn.sendMessage(chatId, {
                        text: `⚠️ @${sender.split('@')[0]}, stickers are not allowed! (Failed to remove - check bot permissions)`,
                        mentions: [sender]
                    });
                }
                break;
            }
            
            case 'delete':
            default: {
                // Just delete the sticker, no warning
                break;
            }
        }

    } catch (error) {
        console.error('❌ Error in handleAntisticker:', error);
    }
}


module.exports = {
  fetchMp3DownloadUrl,
  fetchVideoDownloadUrl,
  fetchJson,
  acr,
  handleAntiEdit,
  saveStatusMessage,
  handleLinkViolation,
  handleAntidemote,
  handleAntipromote,
  antipromoteCommand,
  antidemoteCommand,
  handleStatusUpdate,
  handleBadword,
  handleAntisticker,
  handleAntiTagAdmin,
  detectUrls,
  loadStoredMessages,
  saveStoredMessages,
  storeMessage,
  getServerUptime,
  getServerStartTime,
  ephoto,
  loadBlacklist,
  handleAntiTag,
  delay,
  recordError,
  shouldLogError,
  pickRandom
};

let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(`Updated '${__filename}'`)
  delete require.cache[file]
  require(file)
})