const {
  generateWAMessageFromContent,
  proto,
  downloadContentFromMessage,
  generateWAMessageContent
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
const crypto = require('crypto');
const ffmpeg = require('fluent-ffmpeg');
const { PassThrough } = require('stream');

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

// Function to fetch MP3 download URL
async function fetchMp3DownloadUrl(link) {
  const fetchDownloadUrl1 = async (videoUrl) => {
    const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/play/v1?q=${encodeURIComponent(videoUrl)}`;
    try {
      const response = await axios.get(apiUrl);
      if (response.status !== 200 || !response.data.success) {
        throw new Error('Failed to fetch from NekoLabs API');
      }
      return response.data.result.downloadUrl;
    } catch (error) {
      console.error('Error with NekoLabs API:', error.message);
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

const pickRandom = (arr) => {
return arr[Math.floor(Math.random() * arr.length)]
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
    } else if (message.protocolMessage?.editedMessage) {
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
        
        let textContent = "";
        let mediaType = "text";
        const msgType = Object.keys(messageData.message || {})[0];
        
        const isStatusMessage = 
            chatId === 'status@broadcast' || 
            (messageData.key && messageData.key.remoteJid === 'status@broadcast');
        
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
            isStatus: isStatusMessage,
            remoteJid: messageData.key?.remoteJid || chatId
        };
        
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
        const botNumber = await conn.decodeJid(conn.user.id);
        const antieditSetting = global.settingsManager?.getSetting(botNumber, 'antiedit', 'off');
        
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

        let originalText = originalMsg.message?.conversation || 
                          originalMsg.message?.extendedTextMessage?.text ||
                          originalMsg.text ||
                          "[Text not available]";

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

        let targetChat;
        if (antieditSetting === 'private') {
            targetChat = conn.user.id;
        } else if (antieditSetting === 'chat') {
            targetChat = chatId;
        } else {
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

async function handleStatusUpdate(mek, conn) {
    try {
        const botNumber = await conn.decodeJid(conn.user.id);
        const autoviewstatus = global.settingsManager?.getSetting(botNumber, 'autoviewstatus', false);
        const autoreactstatus = global.settingsManager?.getSetting(botNumber, 'autoreactstatus', false);
        const statusemoji = global.settingsManager?.getSetting(botNumber, 'statusemoji', '💚');
        
        const isStatusMessage = mek.key && mek.key.remoteJid === 'status@broadcast';
        
        if (!isStatusMessage) return;

        if (autoviewstatus) {
            try {
                if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                    await conn.readMessages([mek.key]);
                }
            } catch (viewError) {}
        }

        if (autoreactstatus) {
            try {
                let reactionEmoji = statusemoji || '💚';
                
                if (statusemoji === 'random' || statusemoji === 'rand') {
                    const reactions = ['👍', '❤️', '😂', '😮', '😢', '🔥', '👏', '🎉'];
                    reactionEmoji = reactions[Math.floor(Math.random() * reactions.length)];
                }
                
                if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                    const reactionMessage = {
                        react: {
                            text: reactionEmoji,
                            key: mek.key
                        }
                    };
                    
                    await conn.sendMessage('status@broadcast', reactionMessage);
                    await delay(1000);
                }
            } catch (reactError) {}
        }
    } catch (error) {}
}

// antilink section 
function detectUrls(message) {
    if (!message) return [];
    
    let text = "";
    
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

async function handleLinkViolation(message, conn) {
    try {
        const botNumber = await conn.decodeJid(conn.user.id);
        const chatId = message.key.remoteJid;
        const sender = message.key.participant || message.key.remoteJid;
        const messageId = message.key.id;

        const isEnabled = global.settingsManager?.getSetting(botNumber, 'antilinkdelete', true);
        const mode = global.settingsManager?.getSetting(botNumber, 'antilinkaction', 'delete');
        
        if (!isEnabled) return;

        const groupMetadata = await conn.groupMetadata(chatId).catch(() => null);
        if (!groupMetadata) return;

        const botParticipant = groupMetadata.participants.find(p => p.id === botNumber);
        if (!botParticipant || !['admin', 'superadmin'].includes(botParticipant.admin)) {
            return;
        }

        const participant = groupMetadata.participants.find(p => p.id === sender);
        if (participant && (participant.admin === 'admin' || participant.admin === 'superadmin')) {
            return;
        }

        try {
            await conn.sendMessage(chatId, {
                delete: {
                    id: messageId,
                    remoteJid: chatId,
                    fromMe: false,
                    participant: sender
                }
            });
            
            console.log(`✅ Link message deleted from ${sender}`);
            
        } catch (deleteError) {
            return;
        }

        switch(mode) {
            case 'warn': {
                if (!global.linkWarnings) global.linkWarnings = new Map();
                const userWarnings = global.linkWarnings.get(sender) || { count: 0, lastWarning: 0 };
                
                userWarnings.count++;
                userWarnings.lastWarning = Date.now();
                global.linkWarnings.set(sender, userWarnings);
                
                let responseMessage = `⚠️ @${sender.split('@')[0]}, only admins can send links!\nWarning: *${userWarnings.count}/3*`;
                
                if (userWarnings.count >= 3) {
                    try {
                        await conn.groupParticipantsUpdate(chatId, [sender], "remove");
                        responseMessage = `🚫 @${sender.split('@')[0]} *has been removed for repeatedly posting links*.`;
                        global.linkWarnings.delete(sender);
                    } catch (kickError) {
                        responseMessage = `⚠️ @${sender.split('@')[0]}, links are not allowed! (Failed to remove)`;
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
                        text: `⚠️ @${sender.split('@')[0]}, links are not allowed! (Failed to remove)`,
                        mentions: [sender]
                    });
                }
                break;
            }
            
            case 'delete':
            default: {
                break;
            }
        }
        
    } catch (error) {
        console.error('❌ Error in handleLinkViolation:', error);
    }
}

async function checkAndHandleLinks(message, conn) {
    try {
        if (!message.key.remoteJid.endsWith('@g.us')) return;
        
        const botNumber = await conn.decodeJid(conn.user.id);
        const sender = message.key.participant || message.key.remoteJid;
        if (sender === botNumber) return;
        
        const urls = detectUrls(message.message);
        if (urls.length === 0) return;
        
        await handleLinkViolation(message, conn);
        
    } catch (error) {}
}

async function handleAntiTag(m, conn) {
    try {
        if (!m.isGroup) return;
        
        const botNumber = await conn.decodeJid(conn.user.id);
        const chatId = m.chat;
        const sender = m.sender;
        
        const isEnabled = global.settingsManager?.getSetting(botNumber, 'antitag', false);
        const mode = global.settingsManager?.getSetting(botNumber, 'antitagaction', 'delete');
        
        if (!isEnabled) return;
        
        const groupMetadata = await conn.groupMetadata(chatId);
        const groupAdmins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
        const isBotAdmin = groupAdmins.includes(botNumber);
        const isSenderAdmin = groupAdmins.includes(sender);
        
        const mentionedUsers = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        
        if (mentionedUsers.length > 0 && !isSenderAdmin && isBotAdmin) {
            try {
                await conn.sendMessage(chatId, { delete: m.key });
                console.log(`✅ Deleted tag message from ${sender}`);
            } catch (deleteError) {
                return;
            }
            
            switch(mode) {
                case 'warn': {
                    await conn.sendMessage(chatId, {
                        text: `⚠️ @${sender.split('@')[0]}, tagging members is not allowed!`,
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
                            text: `⚠️ @${sender.split('@')[0]}, tagging is not allowed! (Failed to remove)`,
                            mentions: [sender]
                        });
                    }
                    break;
                }
                
                case 'delete':
                default: {
                    break;
                }
            }
        }
        
    } catch (error) {
        console.error('Anti-tag error:', error);
    }
}

// ========== GROUP STATUS COMMAND FUNCTIONS ==========

async function sendGroupStatus(conn, jid, content) {
    const inside = await generateWAMessageContent(content, { upload: conn.waUploadToServer });
    const messageSecret = crypto.randomBytes(32);

    const m = generateWAMessageFromContent(jid, {
        messageContextInfo: { messageSecret },
        groupStatusMessageV2: { message: { ...inside, messageContextInfo: { messageSecret } } }
    }, {});

    await conn.relayMessage(jid, m.message, { messageId: m.key.id });
    return m;
}

async function toVN(inputBuffer) {
    return new Promise((resolve, reject) => {
        const inStream = new PassThrough();
        inStream.end(inputBuffer);
        const outStream = new PassThrough();
        const chunks = [];

        ffmpeg(inStream)
            .noVideo()
            .audioCodec("libopus")
            .format("ogg")
            .audioBitrate("48k")
            .audioChannels(1)
            .audioFrequency(48000)
            .on("error", reject)
            .on("end", () => resolve(Buffer.concat(chunks)))
            .pipe(outStream, { end: true });

        outStream.on("data", chunk => chunks.push(chunk));
    });
}

async function downloadToBuffer(message, type) {
    const stream = await downloadContentFromMessage(message, type);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
    return buffer;
}

function detectMediaType(quotedMessage) {
    if (!quotedMessage) return 'Text';
    if (quotedMessage.videoMessage) return 'Video';
    if (quotedMessage.imageMessage) return 'Image';
    if (quotedMessage.audioMessage) return 'Audio';
    if (quotedMessage.stickerMessage) return 'Sticker';
    return 'Text';
}

async function buildPayloadFromQuoted(quotedMessage) {
    if (quotedMessage.videoMessage) {
        const buffer = await downloadToBuffer(quotedMessage.videoMessage, 'video');
        return { 
            video: buffer, 
            caption: quotedMessage.videoMessage.caption || '',
            gifPlayback: quotedMessage.videoMessage.gifPlayback || false,
            mimetype: quotedMessage.videoMessage.mimetype || 'video/mp4'
        };
    }
    else if (quotedMessage.imageMessage) {
        const buffer = await downloadToBuffer(quotedMessage.imageMessage, 'image');
        return { 
            image: buffer, 
            caption: quotedMessage.imageMessage.caption || ''
        };
    }
    else if (quotedMessage.audioMessage) {
        const buffer = await downloadToBuffer(quotedMessage.audioMessage, 'audio');
        
        if (quotedMessage.audioMessage.ptt) {
            const audioVn = await toVN(buffer);
            return { 
                audio: audioVn, 
                mimetype: "audio/ogg; codecs=opus", 
                ptt: true 
            };
        } else {
            return { 
                audio: buffer, 
                mimetype: quotedMessage.audioMessage.mimetype || 'audio/mpeg',
                ptt: false 
            };
        }
    }
    else if (quotedMessage.stickerMessage) {
        const buffer = await downloadToBuffer(quotedMessage.stickerMessage, 'sticker');
        return { 
            sticker: buffer,
            mimetype: quotedMessage.stickerMessage.mimetype || 'image/webp'
        };
    }
    else if (quotedMessage.conversation || quotedMessage.extendedTextMessage?.text) {
        const textContent = quotedMessage.conversation || quotedMessage.extendedTextMessage?.text || '';
        return { text: textContent };
    }
    return null;
}

function getHelpText() {
    return `📌 *Group Status Command*\n\n` +
           `*Commands:*\n` +
           `• \`!togstatus\` or \`.tosgroup\` - Send group status\n\n` +
           `*Usage:*\n` +
           `• \`.tosgroup Hello family\` - Send text status\n` +
           `• Reply to a video with \`.tosgroup\` - Send video status\n` +
           `• Reply to a video with \`.tosgroup My caption\` - Send video with caption\n` +
           `• Reply to an image with \`.tosgroup\` - Send image status\n` +
           `• Reply to an image with \`.tosgroup My caption\` - Send image with caption\n` +
           `• Reply to audio with \`.tosgroup\` - Send audio status\n` +
           `• Reply to sticker with \`.tosgroup\` - Send sticker status\n` +
           `• Reply to text with \`.tosgroup\` - Send quoted text as status\n\n` +
           `*Note:* Captions are supported for videos and images.`;
}

async function setGroupStatusCommand(conn, m) {
    try {
        // ✅ Owner check
        if (!m.key.fromMe) {
            return conn.sendMessage(m.chat, { text: '❌ Only the owner can use this command!' });
        }

        const messageText = m.message?.conversation || m.message?.extendedTextMessage?.text || '';
        const quotedMessage = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        // ✅ Support multiple command formats
        const commandRegex = /^[.!#/]?(togstatus|swgc|groupstatus|tosgroup)\s*/i;

        // ✅ Show help if only command is typed without quote or text
        if (!quotedMessage && (!messageText.trim() || messageText.trim().match(commandRegex))) {
            return conn.sendMessage(m.chat, { text: getHelpText() });
        }

        let payload = null;
        
        // ✅ Extract caption if provided after command
        let textAfterCommand = '';
        if (messageText.trim()) {
            const match = messageText.match(commandRegex);
            if (match) {
                textAfterCommand = messageText.slice(match[0].length).trim();
            }
        }

        // ✅ Handle quoted message
        if (quotedMessage) {
            payload = await buildPayloadFromQuoted(quotedMessage);
            
            // ✅ Add caption from command text if provided
            if (textAfterCommand && payload && (payload.video || payload.image)) {
                if (payload.video) {
                    payload.caption = textAfterCommand;
                } else if (payload.image) {
                    payload.caption = textAfterCommand;
                }
            }
        } 
        // ✅ Handle plain text command
        else if (messageText.trim()) {
            if (textAfterCommand) {
                payload = { text: textAfterCommand };
            } else {
                return conn.sendMessage(m.chat, { text: getHelpText() });
            }
        }

        if (!payload) {
            return conn.sendMessage(m.chat, { text: getHelpText() });
        }

        // ✅ Send group status
        await sendGroupStatus(conn, m.chat, payload);

        const mediaType = detectMediaType(quotedMessage);
        let successMsg = `✅ ${mediaType} status sent successfully!`;
        
        if (payload.caption) {
            successMsg += `\nCaption: "${payload.caption}"`;
        }
        
        await conn.sendMessage(m.chat, { text: successMsg });

    } catch (error) {
        console.error('Error in group status command:', error);
        await conn.sendMessage(m.chat, { text: `❌ Failed: ${error.message}` });
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
  detectUrls,
  loadStoredMessages,
  saveStoredMessages,
  storeMessage,
  handleStatusUpdate,
  ephoto,
  loadBlacklist,
  handleAntiTag,
  delay,
  recordError,
  shouldLogError,
  pickRandom,
  setGroupStatusCommand
};

let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(`Updated '${__filename}'`)
  delete require.cache[file]
  require(file)
})
