
const {
  generateWAMessageFromContent,
  proto,
  downloadContentFromMessage,
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
 
//================== [ CHATBOT FUNCTION ] ==================//
async function handleChatbot(m, conn, Access, command) {
    if (
        global.chatbot && global.chatbot === 'true' && 
        (m.message.extendedTextMessage?.text || m.message.conversation) && 
        !isCreator && !m.isGroup && !command
    ) {
        try {
            const userId = m.sender; 
            const userMessage = m.message.extendedTextMessage?.text || m.message.conversation || ''; 

            if (!userMessage.trim()) {
                return; 
            }

            await conn.sendPresenceUpdate('composing', m.chat);

            const callFallbackAPI = async () => {
                const apiUrl = `https://bk9.fun/ai/GPT4o`;
                const params = {
                    q: userMessage.trim(),
                    userId: userId,
                };
                return axios.get(apiUrl, { params });
            };

            const callPrimaryAPI = async () => {
                const apiUrl = `https://bk9.fun/ai/Llama3`;
                const params = {
                    q: userMessage.trim(),
                    userId: userId,
                };
                return axios.get(apiUrl, { params });
            };

            try {
                const response = await callPrimaryAPI();
                const botResponse = response.data?.BK9;

                if (botResponse) {
                    await conn.sendMessage(m.chat, { text: `${botResponse}` }, { quoted: m });
                }
            } catch (primaryError) {
                console.error('Primary API request failed:', primaryError);

                try {
                    const response = await callFallbackAPI();
                    const botResponse = response.data?.BK9;

                    if (botResponse) {
                        await conn.sendMessage(m.chat, { text: `${botResponse}` }, { quoted: m });
                    }
                } catch (fallbackError) {
                    console.error('Fallback API request failed:', fallbackError); 
                }
            }
        } catch (err) {
            console.error('Error processing chatbot request:', err);
        }
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

//================== [ DATABASE INITIALIZATION ] ==================//
function initializeDatabase(from, botNumber) {
  try {
    if (from && from.endsWith('@g.us')) { 
      let chats = global.db.data.chats[from];
      if (typeof chats !== "object") global.db.data.chats[from] = {};
      chats = global.db.data.chats[from]; 
      if (!("antibot" in chats)) chats.antibot = false;
      if (!("antilink" in chats)) chats.antilink = false;
      if (!("badword" in chats)) chats.badword = false; 
      if (!("antilinkgc" in chats)) chats.antilinkgc = false;
      if (!("antilinkkick" in chats)) chats.antilinkkick = false;
      if (!("badwordkick" in chats)) chats.badwordkick = false; 
      if (!("antilinkgckick" in chats)) chats.antilinkgckick = false;
    }

    let setting = global.db.data.settings[botNumber];
    if (typeof setting !== "object") global.db.data.settings[botNumber] = {};
    setting = global.db.data.settings[botNumber]; 
    if (!("autobio" in setting)) setting.autobio = false;
    if (!("autotype" in setting)) setting.autotype = false;
    if (!("autoread" in setting)) setting.autoread = false; 
    if (!("autorecord" in setting)) setting.autorecord = false; 
    if (!("autorecordtype" in setting)) setting.autorecordtype = false;

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

        let messageContent = "";
        let messageType = "Unknown";
        let mediaData = null;
        let hasMediaKey = false;
        
        // Extract message content and prepare media data
        if (deletedMsg.message?.conversation) {
            messageContent = deletedMsg.message.conversation;
            messageType = "Text";
        } else if (deletedMsg.message?.extendedTextMessage?.text) {
            messageContent = deletedMsg.message.extendedTextMessage.text;
            messageType = "Text";
        } else if (deletedMsg.message?.imageMessage) {
            messageContent = deletedMsg.message.imageMessage.caption || "[Image Message]";
            messageType = "Image";
            mediaData = deletedMsg.message.imageMessage;
            hasMediaKey = !!(mediaData.mediaKey || mediaData.url || mediaData.directPath);
        } else if (deletedMsg.message?.videoMessage) {
            messageContent = deletedMsg.message.videoMessage.caption || "[Video Message]";
            messageType = "Video";
            mediaData = deletedMsg.message.videoMessage;
            hasMediaKey = !!(mediaData.mediaKey || mediaData.url || mediaData.directPath);
        } else if (deletedMsg.message?.audioMessage) {
            const audioMsg = deletedMsg.message.audioMessage;
            const duration = audioMsg.seconds ? ` (${Math.round(audioMsg.seconds)} seconds)` : '';
            messageContent = `🔊 Audio Message${duration}`;
            messageType = "Audio";
            mediaData = deletedMsg.message.audioMessage;
            hasMediaKey = !!(mediaData.mediaKey || mediaData.url || mediaData.directPath);
        } else if (deletedMsg.message?.documentMessage) {
            const docMsg = deletedMsg.message.documentMessage;
            messageContent = docMsg.fileName || "[Document]";
            messageType = "Document";
            if (docMsg.fileLength) {
                messageContent += ` (${formatSize(docMsg.fileLength)})`;
            }
            mediaData = deletedMsg.message.documentMessage;
            hasMediaKey = !!(mediaData.mediaKey || mediaData.url || mediaData.directPath);
        } else if (deletedMsg.message?.stickerMessage) {
            messageContent = "[Sticker]";
            messageType = "Sticker";
            mediaData = deletedMsg.message.stickerMessage;
            hasMediaKey = !!(mediaData.mediaKey || mediaData.url || mediaData.directPath);
        } else {
            messageContent = "[Media Message]";
            messageType = "Media";
        }

        const senderMention = sender ? `@${sender.split('@')[0]}` : 'Unknown';
        const deletedByMention = deletedBy ? `@${deletedBy.split('@')[0]}` : 'Unknown';

        const replyText = `🚨 *𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴!* 🚨
${readmore}
𝙲𝙷𝙰𝚃: ${chatName}
𝚃𝚈𝙿𝙴: ${messageType}
𝚂𝙴𝙽𝚃 𝙱𝚈: ${senderMention}
𝚃𝙸𝙼𝙴 𝚂𝙴𝙽𝚃: ${xtipes}
𝙳𝙰𝚃𝙴 𝚂𝙴𝙽𝚃: ${xdptes}
𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙱𝚈: ${deletedByMention}

📝 *𝙲𝙾𝙽𝚃𝙴𝙽𝚃*:
${messageContent}`;

        const mentions = [sender, deletedBy].filter(Boolean);

        // Send the notification message first
        await conn.sendMessage(
            targetChat,
            { 
                text: replyText, 
                mentions: mentions
            }
        );

        // Now handle media message recovery and resend - ONLY IF MEDIA KEY EXISTS
        if (mediaData && messageType !== "Text" && hasMediaKey) {
            try {
                console.log(`🔄 Attempting to recover ${messageType} message...`);
                
                let mediaBuffer;
                let mediaOptions = {};
                
                // Download the media with proper error handling
                try {
                    // Create a proper message object for downloading
                    const downloadMessage = {
                        key: deletedMsg.key,
                        message: deletedMsg.message
                    };
                    
                    mediaBuffer = await downloadMediaMessage(conn, downloadMessage);
                    console.log(`✅ Successfully downloaded ${messageType}`);
                    
                } catch (downloadError) {
                    console.error(`❌ Failed to download ${messageType}:`, downloadError.message);
                    // Send fallback message
                    await conn.sendMessage(
                        targetChat,
                        { 
                            text: `⚠️ Could not recover the deleted ${messageType.toLowerCase()}.\n` +
                                  `Media may have expired or been removed from server.\n` +
                                  `Original caption: ${messageContent}`
                        }
                    );
                    return;
                }

                // Prepare media options based on type
                if (messageType === "Image") {
                    const caption = messageContent && messageContent !== "[Image Message]" 
                        ? `📸 Deleted Image Recovery\nCaption: ${messageContent}`
                        : "📸 Deleted Image Recovery";
                    
                    await conn.sendMessage(targetChat, { 
                        image: mediaBuffer, 
                        caption: caption 
                    });
                    
                } else if (messageType === "Video") {
                    const caption = messageContent && messageContent !== "[Video Message]" 
                        ? `🎥 Deleted Video Recovery\nCaption: ${messageContent}`
                        : "🎥 Deleted Video Recovery";
                    
                    await conn.sendMessage(targetChat, { 
                        video: mediaBuffer, 
                        caption: caption 
                    });
                    
                } else if (messageType === "Audio") {
                    // Check if it's voice note or regular audio
                    if (mediaData.ptt) {
                        await conn.sendMessage(targetChat, { 
                            audio: mediaBuffer, 
                            ptt: true,
                            mimetype: 'audio/ogg; codecs=opus'
                        });
                    } else {
                        await conn.sendMessage(targetChat, { 
                            audio: mediaBuffer,
                            mimetype: mediaData.mimetype || 'audio/mpeg'
                        });
                    }
                    
                } else if (messageType === "Document") {
                    mediaOptions.fileName = mediaData.fileName || "recovered-file";
                    mediaOptions.mimetype = mediaData.mimetype || 'application/octet-stream';
                    
                    await conn.sendMessage(targetChat, { 
                        document: mediaBuffer, 
                        ...mediaOptions 
                    });
                    
                } else if (messageType === "Sticker") {
                    await conn.sendMessage(targetChat, { 
                        sticker: mediaBuffer 
                    });
                }
                
                console.log(`✅ Successfully recovered and resent ${messageType}`);
                
            } catch (mediaError) {
                console.error(`❌ Error recovering ${messageType}:`, mediaError);
                // Send error notification
                await conn.sendMessage(
                    targetChat,
                    { 
                        text: `❌ Failed to recover the deleted ${messageType.toLowerCase()}.\n` +
                              `Error: ${mediaError.message}`
                    }
                );
            }
        } else if (mediaData && !hasMediaKey) {
            // Media exists but no valid media key
            console.log(`⚠️ Media ${messageType} found but no valid media key for recovery`);
            await conn.sendMessage(
                targetChat,
                { 
                    text: `⚠️ Could not recover the deleted ${messageType.toLowerCase()}.\n` +
                          `Media key is missing or expired.\n` +
                          `Original caption: ${messageContent}`
                }
            );
        }

        console.log(`✅ Anti-delete triggered for ${messageType} message ${messageId} in ${chatName}`);
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

// ========== FIXED MEDIA DOWNLOAD FUNCTION ==========
async function downloadMediaMessage(conn, message) {
    try {
        let mime = '';
        let messageType = '';
        
        // Determine message type and mime type
        if (message.message?.imageMessage) {
            mime = message.message.imageMessage.mimetype || 'image/jpeg';
            messageType = 'image';
        } else if (message.message?.videoMessage) {
            mime = message.message.videoMessage.mimetype || 'video/mp4';
            messageType = 'video';
        } else if (message.message?.audioMessage) {
            mime = message.message.audioMessage.mimetype || 'audio/mpeg';
            messageType = 'audio';
        } else if (message.message?.documentMessage) {
            mime = message.message.documentMessage.mimetype || 'application/octet-stream';
            messageType = 'document';
        } else if (message.message?.stickerMessage) {
            mime = message.message.stickerMessage.mimetype || 'image/webp';
            messageType = 'sticker';
        } else {
            throw new Error('Unsupported media type');
        }

        // Use the proper download function from baileys
        const stream = await downloadContentFromMessage(message, messageType);
        let buffer = Buffer.from([]);
        
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        
        if (buffer.length === 0) {
            throw new Error('Downloaded media is empty');
        }
        
        return buffer;
        
    } catch (error) {
        console.error('Error in downloadMediaMessage:', error);
        throw new Error(`Failed to download media: ${error.message}`);
    }
}

module.exports = {
  fetchMp3DownloadUrl,
  fetchVideoDownloadUrl,
  fetchJson,
  acr,
  obfus,
  handleAntiDelete,
  saveStoredMessage,
  ephoto,
  loadBlacklist,
  handleChatbot,
  initializeDatabase,
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