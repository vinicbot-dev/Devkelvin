
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
const process = require('process');
const moment = require("moment-timezone")
const os = require('os');
const speed = require('performance-now')
const timezones = global.timezones || "Africa/Kampala";
const yts = require("yt-search")
const jsobfus = require("javascript-obfuscator");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
const timestampp = speed();
const latensi = speed() - timestampp

const { smsg, sendGmail, formatSize, isUrl, generateMessageTag, CheckBandwidth, getBuffer, getSizeMedia, runtime, fetchJson, sleep, getRandom } = require('./start/lib/myfunction')

const db = require('./start/lib/sqlite')

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
global.db.data = JSON.parse(fs.readFileSync("./start/lib/database/database.json")) || {};

if (global.db.data) {
  global.db.data = {
    chats: {},
    settings: {},
    blacklist: { blacklisted_numbers: [] }, 
    ...(global.db.data || {}),
  };
}


// Function to fetch MP3 download URL
async function fetchMp3DownloadUrl(link) {
  const fetchDownloadUrl1 = async (videoUrl) => {
    const apiUrl = `https://api.giftedtech.my.id/api/download/dlmp3?apikey=${dlkey}&url=${videoUrl}`;
    try {
      const response = await axios.get(apiUrl);
      if (response.status !== 200 || !response.data.success) {
        throw new Error('Failed to fetch from GiftedTech API');
      }
      return response.data.result.download_url;
    } catch (error) {
      console.error('Error with GiftedTech API:', error.message);
      throw error;
    }
  };

  const fetchDownloadUrl2 = async (videoUrl) => {
    const format = 'mp3';
    const url = `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(videoUrl)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      if (!response.data || !response.data.success) throw new Error('Failed to fetch from API2');

      const { id } = response.data;
      while (true) {
        const progress = await axios.get(`https://p.oceansaver.in/ajax/progress.php?id=${id}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        if (progress.data && progress.data.success && progress.data.progress === 1000) {
          return progress.data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error('Error with API2:', error.message);
      throw error;
    }
  };

  try {
    let downloadUrl;
    try {
      downloadUrl = await fetchDownloadUrl1(link);
    } catch (error) {
      console.log('Falling back to second API...');
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
// ===== function for active members =====
const GroupDB = {
  addMessage: (groupJid, userJid) => {
    try {
      // Check if db is properly initialized
      if (!db || typeof db.prepare !== 'function') {
        console.error('❌ Database not properly initialized');
        return;
      }
      
      // Use the dedicated method from SQLiteDB class
      db.addGroupMessage(groupJid, userJid);
    } catch (err) {
      console.error('Error inserting message:', err);
    }
  },

  getActiveUsers: (groupJid) => {
    try {
      // Check if db is properly initialized
      if (!db || typeof db.prepare !== 'function') {
        console.error('❌ Database not properly initialized');
        return [];
      }
      
      // Use the dedicated method from SQLiteDB class
      return db.getActiveUsers(groupJid);
    } catch (err) {
      console.error('Error getting active users:', err);
      return [];
    }
  }
};
//obfuscator 
async function obfus(query) {
      return new Promise((resolve, reject) => {
        try {
          const obfuscationResult = jsobfus.obfuscate(query, {
            compact: false,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            numbersToExpressions: true,
            simplify: true,
            stringArrayShuffle: true,
            splitStrings: true,
            stringArrayThreshold: 1,
          });
          const result = {
            status: 200,
            author: `${ownername}`,
            result: obfuscationResult.getObfuscatedCode(),
          };
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    }

const pickRandom = (arr) => {
return arr[Math.floor(Math.random() * arr.length)]
}

function initializeDatabase(from, botNumber) {
  try {
    if (from && from.endsWith('@g.us')) { 
      // ... existing group settings code ...
    }

    let setting = global.db.data.settings[botNumber];
    if (typeof setting !== "object") global.db.data.settings[botNumber] = {};
    setting = global.db.data.settings[botNumber]; 
    
    // Add config section
    if (!setting.config || typeof setting.config !== "object") {
      setting.config = {};
    }
    
    // Initialize config properties
    if (!("prefix" in setting.config)) setting.config.prefix = ".";
    if (!("statusantidelete" in setting.config)) setting.config.statusantidelete = false;
    if (!("autobio" in setting.config)) setting.config.autobio = false;
    if (!("autorecord" in setting.config)) setting.config.autorecord = false;
    if (!("autoviewstatus" in setting.config)) setting.config.autoviewstatus = false;
    if (!("autoreactstatus" in setting.config)) setting.config.autoreactstatus = false;
    if (!("antiedit" in setting.config)) setting.config.antiedit = false;
    if (!("anticall" in setting.config)) setting.config.anticall = false;
    if (!("AI_CHAT" in setting.config)) setting.config.AI_CHAT = false;
    if (!("antibug" in setting.config)) setting.config.antibug = false;
    if (!("ownernumber" in setting.config)) setting.config.ownernumber = global.ownernumber || '';
    
    // Initialize group chats with allowedUsers for permanent permissions
    if (from && from.endsWith('@g.us')) {
      if (!global.db.data.chats) global.db.data.chats = {};
      if (!global.db.data.chats[from]) global.db.data.chats[from] = {};
      if (!global.db.data.chats[from].allowedUsers) global.db.data.chats[from].allowedUsers = {};
    }
    
    let blacklist = global.db.data.blacklist;
    if (!blacklist || typeof blacklist !== "object") global.db.data.blacklist = { blacklisted_numbers: [] };

  } catch (err) {
    console.error("Error initializing database:", err);
  }
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


async function saveDatabase() {
  try {
    // Save to JSON file for backup
    fs.writeFileSync("./start/lib/database/database.json", JSON.stringify(global.db.data, null, 2));
    
    // Save all settings to SQLite
    if (global.db.data.settings) {
      for (const [botNumber, settings] of Object.entries(global.db.data.settings)) {
        if (settings.config) {
          db.saveSettings(botNumber, settings.config);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error saving database:', error);
    return false;
  }
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
        
        // ========== IMPROVED STATUS DETECTION ==========
        const isStatusMessage = 
            chatId === 'status@broadcast' || 
            (messageData.key && messageData.key.remoteJid === 'status@broadcast') ||
            (messageData.message && Object.keys(messageData.message).some(key => 
                key.includes('protocolMessage') || key.includes('broadcast')
            ));
        
        if (isStatusMessage) {
            console.log(`📱 STATUS DETECTED - Chat: ${chatId}, Type: ${msgType}`);
        }
        
        if (msgType === 'conversation') {
            textContent = messageData.message.conversation;
        } else if (msgType === 'extendedTextMessage') {
            textContent = messageData.message.extendedTextMessage?.text || "";
        } else if (msgType === 'imageMessage') {
            textContent = messageData.message.imageMessage?.caption || "[Image Status]";
            mediaType = "image";
        } else if (msgType === 'videoMessage') {
            textContent = messageData.message.videoMessage?.caption || "[Video Status]";
            mediaType = "video";
        } else if (msgType === 'audioMessage') {
            textContent = "[Audio Status]";
            mediaType = "audio";
        } else if (msgType === 'stickerMessage') {
            textContent = "[Sticker Status]";
            mediaType = "sticker";
        } else {
            textContent = `[${msgType} Status]`;
        }
        
        storedMessages[chatId][messageId] = {
            key: messageData.key,
            message: messageData.message,
            messageTimestamp: messageData.messageTimestamp,
            pushName: messageData.pushName,
            text: textContent,
            mediaType: mediaType,
            storedAt: Date.now(),
            // CRITICAL: Mark status messages properly
            isStatus: isStatusMessage,
            remoteJid: messageData.key?.remoteJid || chatId
        };
        
        // Limit storage per chat to prevent memory issues
        const chatMessages = Object.keys(storedMessages[chatId]);
        if (chatMessages.length > 100) {
            const oldestMessageId = chatMessages[0];
            delete storedMessages[chatId][oldestMessageId];
        }
        
        saveStoredMessages(storedMessages);
        
        // Debug log for status messages
        if (isStatusMessage) {
            console.log(`✅ STATUS STORED - ID: ${messageId}, Type: ${msgType}, Content: ${textContent.substring(0, 50)}...`);
        }
        
    } catch (error) {
        console.error("Error storing message:", error);
    }
}
// ========== FIXED ANTI-EDIT HANDLER ==========
async function handleAntiEdit(m, conn) {
    try {
        // Check if anti-edit is enabled and we have an edited message
        if (!global.antiedit || !m.message?.protocolMessage?.editedMessage) {
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

        let replyText = `🚨 *𝙴𝙳𝙸𝚃𝙴𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴!* 🚨
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

        // Determine target based on mode
        let targetChat;
        if (global.antiedit === 'private') {
            targetChat = conn.user.id; // Send to bot owner
            console.log(`📤 Anti-edit: Sending to bot owner's inbox`);
        } else if (global.antiedit === 'chat') {
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

        console.log(`✅ Edited message captured and sent to: ${global.antiedit === 'private' ? 'bot owner' : 'same chat'}`);

    } catch (err) {
        console.error("❌ Error processing edited message:", err);
    }
}
// ========== FIXED STATUS UPDATE HANDLER ==========
async function handleStatusUpdate(mek, conn) {
    try {
        const botNumber = await conn.decodeJid(conn.user.id);
        if (!global.db.data.settings || !global.db.data.settings[botNumber]) return;
        
        const setting = global.db.data.settings[botNumber];
        if (!setting.config) return;

        // Auto view status
        if (setting.config.autoviewstatus) {
            try {
                // Correct way to mark status as viewed in Baileys
                await conn.readMessages([mek.key]);
                console.log(`👀 Auto-viewed status from ${mek.pushName || 'Unknown'}`);
            } catch (viewError) {
                console.error('Error auto-viewing status:', viewError);
            }
        }

        // Auto react to status - FIXED VERSION
        if (setting.config.autoreactstatus) {
            try {
                const reactions = ['👍', '❤️', '😂', '😮', '😢', '🔥', '👏', '🎉'];
                const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
                
                // For status updates, we need to use the correct approach
                // Status messages are broadcast messages with special handling
                if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                    // Create a proper reaction for status using the status message key
                    const reactionMessage = {
                        react: {
                            text: randomReaction,
                            key: mek.key
                        }
                    };
                    
                    // Send reaction to the status
                    await conn.sendMessage(mek.key.remoteJid, reactionMessage);
                    
                    console.log(`🎭 Auto-reacted "${randomReaction}" to status from ${mek.pushName || 'Unknown'}`);
                    
                    // Add a small delay to avoid rate limiting
                    await delay(1000);
                }
            } catch (reactError) {
                console.error('Error auto-reacting to status:', reactError);
                // Log more details for debugging
                console.log('Status message structure:', {
                    key: mek.key,
                    remoteJid: mek.key?.remoteJid,
                    id: mek.key?.id,
                    participant: mek.key?.participant
                });
            }
        }
    } catch (error) {
        console.error('Error in status handler:', error);
    }
}
// ========== FIXED ANTI-LINK DETECTION FUNCTION ==========
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
    
    // Enhanced URL detection pattern
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    
    const matches = text.match(urlRegex);
    return matches ? matches : [];
}

// ========== ADMIN-ONLY ANTI-LINK HANDLER ==========
async function handleLinkViolation(message, conn) {
    try {
        const chatId = message.key.remoteJid;
        const sender = message.key.participant || message.key.remoteJid;
        const botNumber = await conn.decodeJid(conn.user.id);

        // ========== FIXED: CHECK IF USER IS ALLOWED TO SEND LINKS FIRST ==========
        if (isUserAllowedToSendLinks(chatId, sender)) {
            // User is allowed, decrement their allowance
            decrementLinkAllowance(chatId, sender);
            
            // Optional: Notify user about remaining chances
            const remaining = global.db.data.chats[chatId]?.allowedUsers?.[sender] || 0;
            if (remaining > 0) {
                await conn.sendMessage(chatId, {
                    text: `✅ @${sender.split('@')[0]}, your link was allowed. Remaining chances: ${remaining}`,
                    mentions: [sender]
                });
            }
            return; // Allow the message - EXIT EARLY
        }
        // ========== END FIXED CODE ==========

        // Get group settings
        if (!global.db.data.settings || !global.db.data.settings[botNumber] || 
            !global.db.data.settings[botNumber].config) {
            return;
        }
        
        const config = global.db.data.settings[botNumber].config;
        
        // Check if group settings exist and anti-link is enabled
        if (!config.groupSettings || !config.groupSettings[chatId] || !config.groupSettings[chatId].antilink) {
            return;
        }
        
        const groupSettings = config.groupSettings[chatId];
        const action = groupSettings.antilinkaction || "delete";

        // Check if this is a media message without links in caption
        const urls = detectUrls(message.message);
        if (urls.length === 0) {
            return; // Don't process messages without links
        }

        // Get group metadata to check admin status
        const groupMetadata = await conn.groupMetadata(chatId).catch(() => null);
        if (!groupMetadata) {
            return; // Can't get group info
        }

        // Check if sender is admin (allow admins to post links)
        const participant = groupMetadata.participants.find(p => p.id === sender);
        if (participant && (participant.admin === 'admin' || participant.admin === 'superadmin')) {
            return; // Allow admins to post links - NO ACTION TAKEN
        }

        // If we reach here, it means:
        // 1. Anti-link is enabled for this group
        // 2. Message contains URLs
        // 3. Sender is NOT an admin
        // 4. Sender is NOT in allowed users list
        // So we take action against regular members

        // Delete the message containing the link
        try {
            await conn.sendMessage(chatId, {
                delete: {
                    remoteJid: chatId,
                    fromMe: false,
                    id: message.key.id,
                    participant: sender
                }
            });
        } catch (deleteError) {
            // Silently handle delete errors
        }

        // Store warning count per user
        if (!global.linkWarnings) global.linkWarnings = new Map();
        
        const userWarnings = global.linkWarnings.get(sender) || { count: 0, lastWarning: 0 };
        const now = Date.now();
        const warningCooldown = 30000;
        
        let responseMessage = "";
        
        // Take action based on setting
        if (action === "warn") {
            if (now - userWarnings.lastWarning > warningCooldown) {
                userWarnings.count++;
                userWarnings.lastWarning = now;
                global.linkWarnings.set(sender, userWarnings);
                
                responseMessage = `⚠️ @${sender.split('@')[0]}, only admins are allowed to send links in this group!\nYour message has been deleted. Warning ${userWarnings.count}/3.`;
                
                // Auto-kick after 3 warnings
                if (userWarnings.count >= 3) {
                    try {
                        await conn.groupParticipantsUpdate(chatId, [sender], "remove");
                        responseMessage = `🚫 @${sender.split('@')[0]} has been removed for repeatedly posting links.`;
                        global.linkWarnings.delete(sender);
                    } catch (kickError) {
                        responseMessage = `⚠️ @${sender.split('@')[0]}, links are not allowed! (Failed to remove user after 3 warnings)`;
                    }
                }
            } else {
                return; // Skip warning to avoid spam
            }
            
        } else if (action === "kick") {
            try {
                // Kick the user immediately for kick mode
                await conn.groupParticipantsUpdate(chatId, [sender], "remove");
                responseMessage = `🚫 @${sender.split('@')[0]} has been removed for posting links in the group. Only admins can share links.`;
                
                // Reset warnings for this user
                global.linkWarnings.delete(sender);
            } catch (kickError) {
                responseMessage = `⚠️ @${sender.split('@')[0]}, only admins can send links! (Failed to remove user)`;
            }
        } else {
            // Default: delete only (no warning)
            return; // Don't send any message for delete-only mode
        }

        // Send notification message
        if (responseMessage) {
            await conn.sendMessage(chatId, {
                text: responseMessage,
                mentions: [sender]
            });
        }
        
    } catch (error) {
        // Silently handle errors
    }
}

// ========== SIMPLIFIED LINK CHECKING FUNCTION ==========
async function checkAndHandleLinks(message, conn) {
    try {
        // Only check group messages
        if (!message.key.remoteJid.endsWith('@g.us')) return;
        
        // Ignore messages from the bot itself
        const botNumber = await conn.decodeJid(conn.user.id);
        const sender = message.key.participant || message.key.remoteJid;
        if (sender === botNumber) return;
        
        const chatId = message.key.remoteJid;
        
        // Initialize database for this chat
        initializeDatabase(chatId, botNumber);
        
        // Detect URLs in the message first (for efficiency)
        const urls = detectUrls(message.message);
        if (urls.length === 0) return;
        
        // Now check anti-link settings
        await handleLinkViolation(message, conn);
        
    } catch (error) {
        // Silently handle errors
    }
}
// ========== AUTO-REACT FUNCTION ==========
async function handleAutoReact(m, conn) {
    try {
        const botNumber = await conn.decodeJid(conn.user.id);
        
        // Check if auto-react is enabled in settings
        if (!global.db.data.settings || !global.db.data.settings[botNumber]) return;
        
        const setting = global.db.data.settings[botNumber];
        if (!setting.config || !setting.config.autoreact) return;
        
        // Don't react to bot's own messages
        const sender = m.key.participant || m.key.remoteJid;
        if (sender === botNumber) return;
        
        // List of common emoji reactions
        const reactions = ['👍', '❤️', '😂', '😮', '😢', '🔥', '👏', '🎉', '🤩', '🙏', '💯', '👀', '✨', '🥳', '😎'];
        
        // Pick a random reaction
        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
        
        // Send the reaction
        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: randomReaction,
                key: m.key
            }
        });
        
        console.log(`🎭 Auto-reacted "${randomReaction}" to message from ${m.pushName || 'Unknown'}`);
        
    } catch (error) {
        console.error('❌ Error in auto-react:', error);
    }
}
// ========== UPDATED HELPER FUNCTIONS ==========
function isUserAllowedToSendLinks(chatId, userId) {
    try {
        // Check if user exists in allowedUsers with true value
        return !!global.db.data.chats?.[chatId]?.allowedUsers?.[userId];
    } catch (error) {
        return false;
    }
}


module.exports = {
  fetchMp3DownloadUrl,
  fetchVideoDownloadUrl,
  fetchJson,
  acr,
  obfus,
  handleAntiEdit,
  handleStatusUpdate,
  handleAutoReact,
  saveStatusMessage,
  handleLinkViolation,
  detectUrls,
  loadStoredMessages,
  saveStoredMessages,
  storeMessage,
  checkAndHandleLinks,
  ephoto,
  loadBlacklist,
  GroupDB,
  initializeDatabase,
  delay,
  saveDatabase,
  recordError,
  shouldLogError,
  pickRandom,
  isUserAllowedToSendLinks
  
};

let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(`Updated '${__filename}'`)
  delete require.cache[file]
  require(file)
})