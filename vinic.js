
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

//================== [ FUNCTION ] ==================//
async function setHerokuEnvVar(varName, varValue) {
  const apiKey = process.env.HEROKU_API_KEY;
  const appName = process.env.HEROKU_APP_NAME;
  
  try {
    const response = await axios.patch(`https://api.heroku.com/apps/${appName}/config-vars`, {
      [varName]: varValue
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error setting env var:', error);
    throw new Error(`Failed to set environment variable, please make sure you've entered heroku api key and app name correctly.`);
  }
}

async function getHerokuEnvVars() {
  const apiKey = process.env.HEROKU_API_KEY;
  const appName = process.env.HEROKU_APP_NAME;

  try {
    const response = await axios.get(`https://api.heroku.com/apps/${appName}/config-vars`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting env vars:', error);
    throw new Error('Failed to get environment variables');
  }
}

async function deleteHerokuEnvVar(varName) {
  const apiKey = process.env.HEROKU_API_KEY;
  const appName = process.env.HEROKU_APP_NAME;

  try {
    const response = await axios.patch(`https://api.heroku.com/apps/${appName}/config-vars`, {
      [varName]: null
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting env var:', error);
    throw new Error(`Failed to set environment variable, please make sure you've entered heroku api key and app name correctly`); 
  }
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
// function for getting activeusers in groups 
async function getActiveUsers(groupId) {
    try {
        const timePeriod = 24 * 60 * 60 * 1000; // Last 24 hours
        const cutoffTime = Date.now() - timePeriod;
        
        // Get all messages from your messages array/object
        const allMessages = await getMessages(); // Your function to get messages
        
        const userCounts = {};
        
        // Filter messages for this group and time period, then count
        allMessages
            .filter(msg => msg.groupId === groupId && msg.timestamp >= cutoffTime)
            .forEach(msg => {
                userCounts[msg.sender] = (userCounts[msg.sender] || 0) + 1;
            });
        
        // Convert to array and sort
        return Object.entries(userCounts)
            .map(([jid, count]) => ({ jid, count }))
            .sort((a, b) => b.count - a.count);
        
    } catch (error) {
        console.error('Error getting active users:', error);
        return [];
    }
}

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
    
    // Initialize config properties - ADD AUTOREACT HERE
    if (!("prefix" in setting.config)) setting.config.prefix = "."; // Default prefix
    if (!("statusantidelete" in setting.config)) setting.config.statusantidelete = false;
    if (!("autobio" in setting.config)) setting.config.autobio = false;
    if (!("autorecord" in setting.config)) setting.config.autorecord = false;
    if (!("autoviewstatus" in setting.config)) setting.config.autoviewstatus = false;
    if (!("autoreactstatus" in setting.config)) setting.config.autoreactstatus = false;
    if (!("antiedit" in setting.config)) setting.config.antiedit = false;
    if (!("anticall" in setting.config)) setting.config.anticall = false; // false, "decline", or "block"
    if (!("ownernumber" in setting.config)) setting.config.ownernumber = global.ownernumber || '';

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

//================== [ DATABASE SAVE FUNCTION ] ==================//
async function saveDatabase() {
  try {
    fs.writeFileSync("./start/lib/database/database.json", JSON.stringify(global.db.data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving database:', error);
    return false;
  }
}
//========[ FUNCTION FOR SAVED MESSAGES]=========
function saveStoredMessage(message) {
    try {
        let storedMessages = loadStoredMessages();
        const chatId = message.key.remoteJid;
        const messageId = message.key.id;
        
        if (!storedMessages[chatId]) {
            storedMessages[chatId] = {};
        }
        
        // Enhanced message storage with edit tracking
        storedMessages[chatId][messageId] = {
            key: { ...message.key },
            message: { ...message.message },
            messageTimestamp: message.messageTimestamp || Date.now(),
            pushName: message.pushName || "Unknown",
            sender: message.key.participant || message.key.remoteJid,
            text: extractMessageText(message.message), // Extract text for easy access
            hasMedia: hasMediaMessage(message.message), // Check if media message
            storedAt: Date.now() // Track when message was stored
        };
        
        // Clean up old messages (keep only last 100 messages per chat)
        const messageKeys = Object.keys(storedMessages[chatId]);
        if (messageKeys.length > 100) {
            const sortedMessages = messageKeys.map(id => ({
                id,
                timestamp: storedMessages[chatId][id].messageTimestamp || 0
            })).sort((a, b) => a.timestamp - b.timestamp);
            
            // Remove oldest 20 messages
            sortedMessages.slice(0, 20).forEach(msg => {
                delete storedMessages[chatId][msg.id];
            });
        }
        
        fs.writeFileSync('./start/lib/database/store.json', JSON.stringify(storedMessages, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving message:', error);
        return false;
    }
}

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
    }
    return "";
}

// Helper function to check if message has media
function hasMediaMessage(message) {
    return !!(message?.imageMessage || message?.videoMessage || message?.audioMessage || 
              message?.documentMessage || message?.stickerMessage);
}
// ========== ENHANCED ANTI-EDIT HANDLER ==========
async function handleAntiEdit(m, conn) {
    try {
        const botNumber = await conn.decodeJid(conn.user.id);
        
        // Check if anti-edit is enabled
        if (!global.db.data.settings || !global.db.data.settings[botNumber] || 
            !global.db.data.settings[botNumber].config || 
            !global.db.data.settings[botNumber].config.antiedit) {
            return;
        }

        const config = global.db.data.settings[botNumber].config;

        // Check if this is an edited message
        if (!m.message?.protocolMessage || 
            m.message.protocolMessage.type !== 14) { // Type 14 = message edit
            return;
        }

        const editData = m.message.protocolMessage;
        if (!editData.key) return;

        const messageId = editData.key.id;
        const chatId = m.key.remoteJid;
        const editedBy = m.key.participant || m.key.remoteJid;

        console.log(`✏️ Processing edit for message ${messageId} in ${chatId}`);

        // Load stored messages
        const storedMessages = loadStoredMessages();
        const originalMsg = storedMessages[chatId]?.[messageId];

        if (!originalMsg) {
            console.log("⚠️ Original message not found for edit detection");
            return;
        }

        // Get original text
        const originalText = originalMsg.text || "[No text content]";
        const newText = extractMessageText(editData.editedMessage) || "[No text content]";

        // Don't process if text hasn't actually changed
        if (originalText === newText) {
            return;
        }

        const sender = originalMsg.sender;
        let chatName = "Unknown Chat";

        if (chatId === 'status@broadcast') {
            chatName = "Status Update";
        } else if (chatId.endsWith('@g.us')) {
            try {
                const groupInfo = await conn.groupMetadata(chatId).catch(() => null);
                chatName = groupInfo?.subject || "Group Chat";
            } catch {
                chatName = "Group Chat";
            }
        } else {
            chatName = originalMsg.pushName || "Private Chat";
        }

        const originalTime = moment((originalMsg.messageTimestamp || Date.now()) * 1000)
            .tz(timezones || "Africa/Kampala")
            .format('HH:mm');
            
        const editTime = moment(Date.now())
            .tz(timezones || "Africa/Kampala")
            .format('HH:mm');

        const mentions = [sender, editedBy].filter(Boolean);

        // DETERMINE WHERE TO SEND NOTIFICATION BASED ON SETTING
        let targetChat;
        let notificationType = "";

        // Check if private mode is enabled for anti-edit
        if (config.antieditprivate) {
            // OPTION 1: Send to your inbox (private mode)
            targetChat = botNumber; // Send to bot owner's inbox
            notificationType = "Private Inbox";
            
            // Enhanced private notification with more details
            const privateEditNotification = `🚨 *𝙴𝙳𝙸𝚃 𝙳𝙴𝚃𝙴𝙲𝚃𝙴𝙳 - 𝙿𝚁𝙸𝚅𝙰𝚃𝙴 𝙼𝙾𝙳𝙴* 🚨
${readmore}
💬 𝙲𝙷𝙰𝚃: ${chatName}
👤 𝙾𝚁𝙸𝙶𝙸𝙽𝙰𝙻 𝚂𝙴𝙽𝙳𝙴𝚁: ${sender.split('@')[0]}
✏️ 𝙴𝙳𝙸𝚃𝙴𝙳 𝙱𝚈: ${editedBy.split('@')[0]}
📱 𝙲𝙷𝙰𝚃 𝙸𝙳: ${chatId}
⏰ 𝙾𝚁𝙸𝙶𝙸𝙽𝙰𝙻 𝚃𝙸𝙼𝙴: ${originalTime}
🕒 𝙴𝙳𝙸𝚃 𝚃𝙸𝙼𝙴: ${editTime}

📝 *𝙾𝚁𝙸𝙶𝙸𝙽𝙰𝙻 𝙼𝙴𝚂𝚂𝙰𝙶𝙴*:
${originalText}

✏️ *𝙴𝙳𝙸𝚃𝙴𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴*:
${newText}`;

            await conn.sendMessage(
                targetChat,
                { 
                    text: privateEditNotification
                }
            );
        } else {
            // OPTION 2: Send to same chat (chat mode)
            targetChat = chatId; // Send to same chat where edit occurred
            notificationType = "Same Chat";
            
            const editNotification = `🚨 *𝙴𝙳𝙸𝚃𝙴𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴!* 🚨
${readmore}
𝙲𝙷𝙰𝚃: ${chatName}
𝙾𝚁𝙸𝙶𝙸𝙽𝙰𝙻 𝚂𝙴𝙽𝙳𝙴𝚁: @${sender.split('@')[0]}
𝙴𝙳𝙸𝚃𝙴𝙳 𝙱𝚈: @${editedBy.split('@')[0]}
𝙾𝚁𝙸𝙶𝙸𝙽𝙰𝙻 𝚃𝙸𝙼𝙴: ${originalTime}
𝙴𝙳𝙸𝚃 𝚃𝙸𝙼𝙴: ${editTime}

📝 *𝙾𝚁𝙸𝙶𝙸𝙽𝙰𝙻 𝙼𝙴𝚂𝚂𝙰𝙶𝙴*:
${originalText}

✏️ *𝙴𝙳𝙸𝚃𝙴𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴*:
${newText}`;

            await conn.sendMessage(
                targetChat,
                { 
                    text: editNotification, 
                    mentions: mentions
                }
            );
        }

        console.log(`✅ Anti-edit triggered for message ${messageId} in ${chatName}`);
        console.log(`📍 ${notificationType}: ${targetChat === botNumber ? 'Owner Inbox' : 'Same Chat'}`);

    } catch (err) {
        console.error("❌ Error processing edited message:", err);
    }
}
// ========== FIXED ANTI-DELETE FUNCTIONALITY WITH MEDIA SUPPORT ==========
async function handleAntiDelete(m, conn) {
    try {
        // More reliable check for deleted messages
        if (!m.message?.protocolMessage || 
            m.message.protocolMessage.type !== 0) { // Type 0 = message delete
            return;
        }

        if (!m.message.protocolMessage.key) {
            return;
        }

        const messageId = m.message.protocolMessage.key.id;
        const chatId = m.key.remoteJid;
        const deletedBy = m.key.participant || m.key.remoteJid;

        console.log(`🗑️ Processing delete for message ${messageId} in ${chatId}`);

        const storedMessages = loadStoredMessages();
        const deletedMsg = storedMessages[chatId]?.[messageId];

        if (!deletedMsg) {
            console.log("⚠️ Deleted message not found in database.");
            return;
        }

        const botNumber = await conn.decodeJid(conn.user.id);
        
        let targetChat;
        if (global.antidelete === 'private') {
            targetChat = botNumber;
        } else if (global.antidelete === 'chat') {
            targetChat = chatId;
        } else {
            return;
        }

        const sender = deletedMsg.sender;
        let chatName = "Unknown Chat";

        if (chatId === 'status@broadcast') {
            chatName = "Status Update";
        } else if (chatId.endsWith('@g.us')) {
            try {
                const groupInfo = await conn.groupMetadata(chatId).catch(() => null);
                chatName = groupInfo?.subject || "Group Chat";
            } catch {
                chatName = "Group Chat";
            }
        } else {
            chatName = deletedMsg.pushName || "Private Chat";
        }

        const xtipes = moment((deletedMsg.messageTimestamp || Date.now()) * 1000)
            .tz(timezones || "Africa/Kampala")
            .locale('en')
            .format('HH:mm z');
            
        const xdptes = moment((deletedMsg.messageTimestamp || Date.now()) * 1000)
            .tz(timezones || "Africa/Kampala")
            .format("DD/MM/YYYY");

        // Check if it's a media message first
        if (deletedMsg.message?.imageMessage || 
            deletedMsg.message?.videoMessage || 
            deletedMsg.message?.audioMessage || 
            deletedMsg.message?.documentMessage || 
            deletedMsg.message?.stickerMessage) {
            
            // Handle media message recovery
            try {
                console.log(`🔄 Attempting to recover media message...`);
                
                let mediaBuffer;
                let mediaType = "Unknown";
                let caption = "";
                
                // Determine media type and prepare for download
                if (deletedMsg.message?.imageMessage) {
                    mediaType = "Image";
                    caption = deletedMsg.message.imageMessage.caption || "";
                } else if (deletedMsg.message?.videoMessage) {
                    mediaType = "Video";
                    caption = deletedMsg.message.videoMessage.caption || "";
                } else if (deletedMsg.message?.audioMessage) {
                    mediaType = "Audio";
                } else if (deletedMsg.message?.documentMessage) {
                    mediaType = "Document";
                    caption = deletedMsg.message.documentMessage.caption || "";
                } else if (deletedMsg.message?.stickerMessage) {
                    mediaType = "Sticker";
                }

                // Download the media
                try {
                    mediaBuffer = await downloadMediaMessage(conn, {
                        key: deletedMsg.key,
                        message: deletedMsg.message
                    });
                    console.log(`✅ Successfully downloaded ${mediaType}`);
                    
                } catch (downloadError) {
                    console.error(`❌ Failed to download ${mediaType}:`, downloadError.message);
                    // Send fallback message for failed media recovery
                    const mediaInfo = `🚨 *𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙼𝙴𝙳𝙸𝙰!* 🚨
${readmore}
𝙲𝙷𝙰𝚃: ${chatName}
𝚃𝚈𝙿𝙴: ${mediaType}
𝚂𝙴𝙽𝚃 𝙱𝚈: @${sender.split('@')[0]}
𝚃𝙸𝙼𝙴: ${xtipes}
𝙳𝙰𝚃𝙴: ${xdptes}
𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙱𝚈: @${deletedBy.split('@')[0]}
${caption ? `📝 𝙲𝙰𝙿𝚃𝙸𝙾𝙽: ${caption}` : ''}

❌ Could not recover the deleted ${mediaType.toLowerCase()}.`;

                    await conn.sendMessage(
                        targetChat,
                        { 
                            text: mediaInfo, 
                            mentions: [sender, deletedBy] 
                        }
                    );
                    return;
                }

                // Prepare media info text
                const mediaInfo = `🚨 *𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙼𝙴𝙳𝙸𝙰!* 🚨
${readmore}
𝙲𝙷𝙰𝚃: ${chatName}
𝚃𝚈𝙿𝙴: ${mediaType}
𝚂𝙴𝙽𝚃 𝙱𝚈: @${sender.split('@')[0]}
𝚃𝙸𝙼𝙴: ${xtipes}
𝙳𝙰𝚃𝙴: ${xdptes}
𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙱𝚈: @${deletedBy.split('@')[0]}`;

                // Send recovered media with info
                if (mediaType === "Image") {
                    await conn.sendMessage(targetChat, { 
                        image: mediaBuffer, 
                        caption: mediaInfo,
                        mentions: [sender, deletedBy]
                    });
                    
                } else if (mediaType === "Video") {
                    await conn.sendMessage(targetChat, { 
                        video: mediaBuffer, 
                        caption: mediaInfo,
                        mentions: [sender, deletedBy]
                    });
                    
                } else if (mediaType === "Audio") {
                    // Check if it's voice note or regular audio
                    const audioMsg = deletedMsg.message.audioMessage;
                    if (audioMsg.ptt) {
                        await conn.sendMessage(targetChat, { 
                            audio: mediaBuffer, 
                            ptt: true,
                            mimetype: 'audio/ogg; codecs=opus'
                        });
                        // Send info separately for voice notes
                        await conn.sendMessage(targetChat, {
                            text: mediaInfo,
                            mentions: [sender, deletedBy]
                        });
                    } else {
                        await conn.sendMessage(targetChat, { 
                            audio: mediaBuffer,
                            mimetype: audioMsg.mimetype || 'audio/mpeg'
                        });
                        // Send info separately for audio files
                        await conn.sendMessage(targetChat, {
                            text: mediaInfo,
                            mentions: [sender, deletedBy]
                        });
                    }
                    
                } else if (mediaType === "Document") {
                    const docMsg = deletedMsg.message.documentMessage;
                    await conn.sendMessage(targetChat, { 
                        document: mediaBuffer,
                        fileName: docMsg.fileName || "recovered-file",
                        mimetype: docMsg.mimetype || 'application/octet-stream'
                    });
                    // Send info separately for documents
                    await conn.sendMessage(targetChat, {
                        text: mediaInfo,
                        mentions: [sender, deletedBy]
                    });
                    
                } else if (mediaType === "Sticker") {
                    await conn.sendMessage(targetChat, { 
                        sticker: mediaBuffer 
                    });
                    // Send info separately for stickers
                    await conn.sendMessage(targetChat, {
                        text: mediaInfo,
                        mentions: [sender, deletedBy]
                    });
                }
                
                console.log(`✅ Successfully recovered and resent ${mediaType}`);
                
            } catch (mediaError) {
                console.error(`❌ Error recovering media:`, mediaError);
                // Send error notification
                await conn.sendMessage(
                    targetChat,
                    { 
                        text: `❌ Failed to recover the deleted media.\nError: ${mediaError.message}`,
                        mentions: [sender, deletedBy]
                    }
                );
            }
            
        } else {
            // Handle text message (second part)
            let messageContent = "";
            let messageType = "Text";
            
            // Extract text content
            if (deletedMsg.message?.conversation) {
                messageContent = deletedMsg.message.conversation;
            } else if (deletedMsg.message?.extendedTextMessage?.text) {
                messageContent = deletedMsg.message.extendedTextMessage.text;
            } else {
                messageContent = "[Unsupported message type]";
            }

            const replyText = `🚨 *𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴!* 🚨
${readmore}
𝙲𝙷𝙰𝚃: ${chatName}
𝚃𝚈𝙿𝙴: ${messageType}
𝚂𝙴𝙽𝚃 𝙱𝚈: @${sender.split('@')[0]}
𝚃𝙸𝙼𝙴 𝚂𝙴𝙽𝚃: ${xtipes}
𝙳𝙰𝚃𝙴 𝚂𝙴𝙽𝚃: ${xdptes}
𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙱𝚈: @${deletedBy.split('@')[0]}

📝 *𝙲𝙾𝙽𝚃𝙴𝙽𝚃*:
${messageContent}`;

            const mentions = [sender, deletedBy].filter(Boolean);

            // Send the text message notification
            await conn.sendMessage(
                targetChat,
                { 
                    text: replyText, 
                    mentions: mentions
                }
            );

            console.log(`✅ Anti-delete triggered for ${messageType} message ${messageId} in ${chatName}`);
        }

        console.log(`📍 Notification sent to: ${targetChat === botNumber ? 'Private' : 'Same Chat'}`);

    } catch (err) {
        console.error("❌ Error processing deleted message:", err);
    }
}


// ========== ENHANCED MESSAGE SAVING FUNCTION ==========
function saveStoredMessage(message) {
    try {
        let storedMessages = loadStoredMessages();
        const chatId = message.key.remoteJid;
        const messageId = message.key.id;
        
        if (!storedMessages[chatId]) {
            storedMessages[chatId] = {};
        }
        
        // Enhanced message storage with better media handling
        storedMessages[chatId][messageId] = {
            key: { ...message.key },
            message: { ...message.message },
            messageTimestamp: message.messageTimestamp || Date.now(),
            pushName: message.pushName || "Unknown",
            sender: message.key.participant || message.key.remoteJid
        };
        
        // Extract text content
        let textContent = "";
        if (message.message?.conversation) {
            textContent = message.message.conversation;
        } else if (message.message?.extendedTextMessage?.text) {
            textContent = message.message.extendedTextMessage.text;
        } else if (message.message?.imageMessage?.caption) {
            textContent = message.message.imageMessage.caption;
        } else if (message.message?.videoMessage?.caption) {
            textContent = message.message.videoMessage.caption;
        } else if (message.message?.documentMessage?.caption) {
            textContent = message.message.documentMessage.caption;
        }
        
        storedMessages[chatId][messageId].text = textContent;
        
        // Check if media key exists for media messages
        if (message.message?.imageMessage) {
            storedMessages[chatId][messageId].hasMediaKey = !!(message.message.imageMessage.mediaKey);
        } else if (message.message?.videoMessage) {
            storedMessages[chatId][messageId].hasMediaKey = !!(message.message.videoMessage.mediaKey);
        } else if (message.message?.audioMessage) {
            storedMessages[chatId][messageId].hasMediaKey = !!(message.message.audioMessage.mediaKey);
        } else if (message.message?.documentMessage) {
            storedMessages[chatId][messageId].hasMediaKey = !!(message.message.documentMessage.mediaKey);
        } else if (message.message?.stickerMessage) {
            storedMessages[chatId][messageId].hasMediaKey = !!(message.message.stickerMessage.mediaKey);
        }
        
        // Clean up old messages (keep only last 100 messages per chat)
        const messageKeys = Object.keys(storedMessages[chatId]);
        if (messageKeys.length > 100) {
            const sortedMessages = messageKeys.map(id => ({
                id,
                timestamp: storedMessages[chatId][id].messageTimestamp || 0
            })).sort((a, b) => a.timestamp - b.timestamp);
            
            // Remove oldest 20 messages
            sortedMessages.slice(0, 20).forEach(msg => {
                delete storedMessages[chatId][msg.id];
            });
        }
        
        fs.writeFileSync('./start/lib/database/store.json', JSON.stringify(storedMessages, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving message:', error);
        return false;
    }
}
// ========== LOAD STORED MESSAGES FUNCTION ==========
function loadStoredMessages() {
    try {
        // Ensure directory exists
        const dirPath = './start/lib/database';
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        
        const filePath = './start/lib/database/store.json';
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading stored messages:', error);
    }
    return {};
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
                
                // For status updates, we need to use the correct key format
                // Status messages are broadcast messages, so we need to handle them differently
                if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                    // Create a proper reaction for status
                    await conn.sendMessage(mek.key.remoteJid, {
                        react: {
                            text: randomReaction,
                            key: mek.key
                        }
                    });
                    
                    console.log(`🎭 Auto-reacted "${randomReaction}" to status from ${mek.pushName || 'Unknown'}`);
                }
            } catch (reactError) {
                console.error('Error auto-reacting to status:', reactError);
                // Log more details for debugging
                console.log('Status message structure:', {
                    key: mek.key,
                    remoteJid: mek.key?.remoteJid,
                    id: mek.key?.id
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

module.exports = {
  fetchMp3DownloadUrl,
  fetchVideoDownloadUrl,
  fetchJson,
  acr,
  obfus,
  handleAntiDelete,
  handleAntiEdit,
  handleStatusUpdate,
  saveStoredMessage,
  handleAutoReact,
  saveStatusMessage,
  handleLinkViolation,
  detectUrls,
  checkAndHandleLinks,
  ephoto,
  loadBlacklist,
  getActiveUsers,
  initializeDatabase,
  delay,
  saveDatabase,
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