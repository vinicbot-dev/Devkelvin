console.clear();
console.log('Starting Vinic-Xmd...');
const settings = require('./settings');
const config = require('./setting/config');
process.on("uncaughtException", console.error);

const {
  default: makeWASocket,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  generateMessageID,
  downloadContentFromMessage,
  getContentType,
  jidDecode,
  MessageRetryMap,
  getAggregateVotesInPollMessage,
  proto,
  delay
} = require("@whiskeysockets/baileys");

const pino = require('pino');
const readline = require("readline");
const fs = require('fs');
const os = require('os');
const path = require('path')
const more = String.fromCharCode(8206);
const chalk = require('chalk');
const _ = require('lodash');
const NodeCache = require("node-cache");
const lolcatjs = require('lolcatjs');
const readmore = more.repeat(4001);
const util = require('util');
const axios = require('axios');
const fetch = require('node-fetch');
const timezones = global.timezones || "Africa/Kampala";
const moment = require('moment-timezone');
const FileType = require('file-type');
const { Boom } = require('@hapi/boom');
const PhoneNumber = require('awesome-phonenumber');
const { File } = require('megajs');
const { color } = require('./start/lib/color');

const {
  smsg,
  sendGmail,
  formatSize,
  isUrl,
  generateMessageTag,
  getBuffer,
  getSizeMedia,
  runtime,
  fetchJson,
  sleep
} = require('./start/lib/myfunction');

const {
handleAntiDelete,
handleAntiEdit,
saveStoredMessage,
handleAutoReact,
checkAndHandleLinks,
handleLinkViolation,
detectUrls,
handleStatusUpdate
 } = require('./vinic');

const {
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid
} = require('./start/lib/exif');

// Define constants for session handling
const SESSION_DIR = './session';
const CREDS_PATH = `${SESSION_DIR}/creds.json`;

const usePairingCode = true;

const question = (text) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(text, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

const yargs = require('yargs/yargs');

async function downloadSessionData() {
    console.log("[DEBUG] SESSION_ID:", settings.SESSION_ID);
    try {
        if (typeof settings.SESSION_ID === 'undefined') {
            throw new Error("SESSION_ID is undefined in settings");
        }
        if (!settings.SESSION_ID) {
            console.warn("[ ⏳ ] No SESSION_ID provided - Falling back to QR or pairing code");
            return null;
        }
        if (settings.SESSION_ID.startsWith("starcore~")) {
            console.info("[ ⏳ ] Decoding base64 session");
            const base64Data = settings.SESSION_ID.replace("starcore~", "");
            
            // FIX: Clean the base64 data by removing invalid characters
            const cleanedBase64Data = base64Data.replace(/[^A-Za-z0-9+/=]/g, '');
            
            // Check if I have valid base64 after cleaning
            if (!/^[A-Za-z0-9+/=]+$/.test(cleanedBase64Data)) {
                throw new Error("Invalid base64 format after cleaning");
            }
            
            const decodedData = Buffer.from(cleanedBase64Data, "base64");
            let sessionData;
            try {
                sessionData = JSON.parse(decodedData.toString("utf-8"));
            } catch (error) {
                throw new Error("Failed to parse decoded base64 session data: " + error.message);
            }
            fs.writeFileSync(CREDS_PATH, JSON.stringify(sessionData, null, 2));
            console.log("[ ✅ ] Base64 session decoded and saved successfully");
            return sessionData;
        } else if (settings.SESSION_ID.startsWith("malvin~")) {
            console.info("[ 📥 ] Downloading MEGA.nz session");
            const megaFileId = settings.SESSION_ID.replace("malvin~", "");
            const filer = File.fromURL(`https://mega.nz/file/${megaFileId}`);
            const data = await new Promise((resolve, reject) => {
                filer.download((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
            fs.writeFileSync(CREDS_PATH, data);
            console.log("[ ✅ ] MEGA session downloaded successfully");
            return JSON.parse(data.toString());
        } else {
            throw new Error("Invalid SESSION_ID format. Use 'starcore~' for base64 or 'malvin~' for MEGA.nz");
        }
    } catch (error) {
        console.error("[ ❌ ] Error loading session", { Error: error.message, Stack: error.stack });
        console.info("[ 😑 ] Will attempt pairing code login");
        return null;
    }
}
async function clientstart() {
  // Ensure session directory exists
  if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR);
  }

  // Check and download session data
  const sessionExists = await downloadSessionData();
  


const { state, saveCreds } = await useMultiFileAuthState("./session");
  const conn = makeWASocket({
    printQRInTerminal: !usePairingCode,
    syncFullHistory: true,
    markOnlineOnConnect: true,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 0,
    keepAliveIntervalMs: 10000,
    generateHighQualityLinkPreview: true,
    patchMessageBeforeSending: (message) => {
      const requiresPatch = !!(
        message.buttonsMessage ||
        message.templateMessage ||
        message.listMessage
      );
      if (requiresPatch) {
        message = {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadataVersion: 2,
                deviceListMetadata: {},
              },
              ...message,
            },
          },
        };
      }
      return message;
    },
    version: (await (await fetch('https://github.com/kiuur/bails/raw/refs/heads/master/lib/Defaults/baileys-version.json')).json()).version,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    logger: pino({
      level: 'fatal'
    }),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino().child({
        level: 'silent',
        stream: 'store'
      })),
    }
  });

  if (!sessionExists && !conn.authState.creds.registered) {
    const phoneNumber = await question(chalk.greenBright(`Thanks for choosing Vinic-Xmd. Please provide your number start with 256xxx:\n`));
    const code = await conn.requestPairingCode(phoneNumber.trim());
    console.log(chalk.cyan(`Code: ${code}`));
    console.log(chalk.cyan(`Vinic-Xmd: Please use this code to connect your WhatsApp account.`));
  }

  const { makeInMemoryStore } = require("./start/lib/store/");
  const store = makeInMemoryStore({
    logger: pino().child({
      level: 'silent',
      stream: 'store'
    })
  });
  

  store.bind(conn.ev);

conn.ev.on('messages.upsert', async chatUpdate => {
    try {
        let mek = chatUpdate.messages[0];
        if (!mek.message) return;
        mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;

        // ========== STATUS UPDATE HANDLING ==========
        if (mek.key && mek.key.remoteJid === 'status@broadcast') {
            // Skip if this is a reaction or view confirmation (not an actual status update)
            if (mek.message?.reactionMessage || mek.message?.protocolMessage) {
                return;
            }
            
            console.log(`📱 Status update detected from ${mek.pushName || 'Unknown'}`);
            
            // Handle status viewing and reacting
            await handleStatusUpdate(mek, conn);   
          // Save status for anti-delete functionality
            saveStoredMessage(mek);
            return; // Skip further processing for status messages
        }

        if (!conn.public && !mek.key.fromMe && chatUpdate.type === 'notify') return;
        let m = smsg(conn, mek, store);
        
        // Save all incoming messages for anti-delete/anti-edit
        saveStoredMessage(mek);
        
        
        // Handle deleted messages (anti-delete) - PASS THE CORRECT PARAMETERS
        await handleAntiDelete(mek, conn);
        
        // handleAntiEdit messages 
        await handleAntiEdit(mek, conn);
        
        
        // handle links in groups 
                    await checkAndHandleLinks(mek, conn);
                   
                    await handleAutoReact(m, conn);
            
            await detectUrls(mek, conn);
            
            await handleLinkViolation(mek, conn);
            
             
        
        // Process commands as usual
        require("./start/kevin")(conn, m, chatUpdate, mek, store);
    } catch (err) {
        console.log(chalk.yellow.bold("[ ERROR ] kevin.js :\n") + chalk.redBright(util.format(err)));
    }
});
  conn.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return decode.user && decode.server && decode.user + '@' + decode.server || jid;
    } else return jid;
  };

conn.ev.on('contacts.update', update => {
    for (let contact of update) {
      let id = conn.decodeJid(contact.id);
      if (store && store.contacts) store.contacts[id] = { id, name: contact.notify };
    }
  });

  conn.sendTextWithMentions = async (jid, text, quoted, options = {}) => {
    const mentionedJid = [...text.matchAll(/@(\d{0,16})/g)].map(
      (v) => v[1] + "@s.whatsapp.net",
    );
    return conn.sendMessage(jid, {
      text: text,
      contextInfo: {
        mentionedJid: mentionedJid,
      },
      ...options,
    }, { quoted });
  };

  conn.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    let buff;
    try {
      buff = Buffer.isBuffer(path)
        ? path
        : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`,`[1], 'base64')
        : /^https?:\/\//.test(path)
        ? await (await getBuffer(path))
        : fs.existsSync(path)
        ? fs.readFileSync(path)
        : Buffer.alloc(0);
    } catch (e) {
      console.error('Error getting buffer:', e);
      buff = Buffer.alloc(0);
    }

    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImg(buff, options);
    } else {
      buffer = await imageToWebp(buff);
    }

    await conn.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
    return buffer;
  };

  conn.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
    let buff;
    try {
      buff = Buffer.isBuffer(path)
        ? path
        : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`,`[1], 'base64')
        : /^https?:\/\//.test(path)
        ? await (await getBuffer(path))
        : fs.existsSync(path)
        ? fs.readFileSync(path)
        : Buffer.alloc(0);
    } catch (e) {
      console.error('Error getting buffer:', e);
      buff = Buffer.alloc(0);
    }

    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifVid(buff, options);
    } else {
      buffer = await videoToWebp(buff);
    }

    await conn.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
    return buffer;
  };

  conn.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];

    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    let type = await FileType.fromBuffer(buffer);
    let trueFileName = attachExtension ? (filename + "." + (type ? type.ext : 'bin')) : filename;
    await fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
  };

  conn.getName = async (jid, withoutContact = false) => {
    let id = conn.decodeJid(jid);
    withoutContact = conn.withoutContact || withoutContact;
    let v;
    if (id.endsWith("@g.us")) {
      return new Promise(async (resolve) => {
        try {
          v = store.contacts[id] || {};
          if (!(v.name || v.subject)) v = await conn.groupMetadata(id) || {};
          resolve(
            v.name ||
            v.subject ||
            PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber("international")
          );
        } catch (e) {
          resolve(PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber("international"));
        }
      });
    } else {
      v = id === "0@s.whatsapp.net"
        ? { id, name: "WhatsApp" }
        : id === conn.decodeJid(conn.user.id)
        ? conn.user
        : store.contacts[id] || {};
      return (
        (withoutContact ? "" : v.name) ||
        v.subject ||
        v.verifiedName ||
        PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international")
      );
    }
  };

  conn.sendContact = async (jid, kon, quoted = '', opts = {}) => {
    let list = [];
    for (let i of kon) {
      const name = await conn.getName(i);
      list.push({
        displayName: name,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nFN:${name}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:jangan spam bang\nitem2.EMAIL;type=INTERNET:Zuurzyen\nitem2.X-ABLabel:YouTube\nitem3.URL:Zuuryzen.tech\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
      });
    }
    conn.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted });
  };
//. fixed line for conn
conn.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
let type = await conn.getFile(path, true)
let { res, data: file, filename: pathFile } = type
if (res && res.status !== 200 || file.length <= 65536) {
try { throw { json: JSON.parse(file.toString()) } }
catch (e) { if (e.json) throw e.json }
}
let opt = { filename }
if (quoted) opt.quoted = quoted
if (!type) options.asDocument = true
let mtype = '', mimetype = type.mime, convert
if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
else if (/video/.test(type.mime)) mtype = 'video'
else if (/audio/.test(type.mime)) (
convert = await (ptt ? toPTT : toAudio)(file, type.ext),
file = convert.data,
pathFile = convert.filename,
mtype = 'audio',
mimetype = 'audio/ogg; codecs=opus'
)
else mtype = 'document'
if (options.asDocument) mtype = 'document'

let message = {
...options,
caption,
ptt,
[mtype]: { url: pathFile },
mimetype
}
let m
try {
m = await conn.sendMessage(jid, message, { ...opt, ...options })
} catch (e) {
console.error(e)
m = null
} finally {
if (!m) m = await conn.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options })
return m
}
} 

conn.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];

    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }

    let type = await FileType.fromBuffer(buffer);
    let trueFileName = attachExtension ? (filename + '.' + type.ext) : filename;
    let savePath = path.join(__dirname, 'tmp', trueFileName); // Save to 'tmp' folder

    await fs.writeFileSync(savePath, buffer);

    buffer = null; 
    global.gc?.(); 

    return savePath;
};
// end of fixed line 
  conn.serializeM = (m) => smsg(conn, m, store);

  conn.copyNForward = async (jid, message, forceForward = false, options = {}) => {
    let vtype;
    if (options.readViewOnce) {
      message.message = message.message?.ephemeralMessage?.message || message.message;
      vtype = Object.keys(message.message.viewOnceMessage.message)[0];
      delete message.message.viewOnceMessage.message[vtype].viewOnce;
      message.message = { ...message.message.viewOnceMessage.message };
    }

    let mtype = Object.keys(message.message)[0];
    let content = await generateForwardMessageContent(message, forceForward);
    let ctype = Object.keys(content)[0];
    let context = {};

    if (mtype != "conversation") {
      context = message.message[mtype].contextInfo;
    }

    content[ctype].contextInfo = {
      ...context,
      ...content[ctype].contextInfo,
    };

    const waMessage = await generateWAMessageFromContent(
      jid,
      content,
      options
        ? {
            ...content[ctype],
            ...options,
            ...(options.contextInfo
              ? {
                  contextInfo: {
                    ...content[ctype].contextInfo,
                    ...options.contextInfo,
                  },
                }
              : {}),
          }
        : {}
    );

    await conn.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id });
    return waMessage;
  };
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// some added functions 
function createTmpFolder() {
const folderName = "tmp";
const folderPath = path.join(__dirname, folderName);

if (!fs.existsSync(folderPath)) {
fs.mkdirSync(folderPath);
   }
 }
 
createTmpFolder();

setInterval(() => {
let directoryPath = path.join();
fs.readdir(directoryPath, async function (err, files) {
var filteredArray = await files.filter(item =>
item.endsWith("gif") ||
item.endsWith("png") || 
item.endsWith("mp3") ||
item.endsWith("mp4") || 
item.endsWith("opus") || 
item.endsWith("jpg") ||
item.endsWith("webp") ||
item.endsWith("webm") ||
item.endsWith("zip") 
)
if(filteredArray.length > 0){
let teks =`Detected ${filteredArray.length} junk files,\nJunk files have been deleted🚮`
conn.sendMessage(conn.user.id, {text : teks })
setInterval(() => {
if(filteredArray.length == 0) return console.log("Junk files cleared")
filteredArray.forEach(function (file) {
let sampah = fs.existsSync(file)
if(sampah) fs.unlinkSync(file)
})
}, 15_000)
}
});
}, 30_000)

  function getTypeMessage(message) {
    if (!message) return 'unknown';
    const type = Object.keys(message);
    var restype = (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(type[0]) && type[0]) ||
      (type.length >= 3 && type[1] !== 'messageContextInfo' && type[1]) ||
      type[type.length - 1] || Object.keys(message)[0];
    return restype;
  }

  conn.prefa = settings.prefa; // Use prefa from settings.js
  conn.public = config.autoviewstatus || true;
  conn.serializeM = (m) => smsg(conn, m, store);

  conn.ev.on('connection.update', async (update) => {
    let { Connecting } = require("./start/lib/connection/connect.js");
    Connecting({ update, conn, Boom, DisconnectReason, sleep, color, clientstart });
  });
  

conn.ev.on('group-participants.update', async (anu) => {
    try {
        const botNumber = await conn.decodeJid(conn.user.id);
        
        // Check welcome setting from config
        if (global.db.data.settings && global.db.data.settings[botNumber] && global.db.data.settings[botNumber].config) {
            const config = global.db.data.settings[botNumber].config;
            
            // WELCOME FEATURE
            if (config.welcome) {
                try {
                    const groupMetadata = await conn.groupMetadata(anu.id);
                    const participants = anu.participants;
                    for (const participant of participants) {
                        let ppUrl;
                        try {
                            ppUrl = await conn.profilePictureUrl(participant, 'image');
                        } catch {
                            ppUrl = 'https://i.ibb.co/sFjX3nP/default.jpg';
                        }
                        const name = (await conn.onWhatsApp(participant))[0]?.notify || participant;
                        if (anu.action === 'add') {
                            const memberCount = groupMetadata.participants.length;
                            await conn.sendMessage(anu.id, {
                                image: { url: ppUrl },
                                caption: `
   *${config.botname} welcome* @${participant.split('@')[0]}  
   
   *𝙶𝚛𝚘𝚞𝚙𝙽𝚊𝚖𝚎: ${groupMetadata.subject}*
   
  *You're our ${memberCount}th member!*
  
  *Join time: ${moment.tz(`${timezones}`).format('HH:mm:ss')},  ${moment.tz(`${timezones}`).format('DD/MM/YYYY')}*

𝙲𝚊𝚞𝚜𝚎 𝚌𝚑𝚊𝚘𝚜 𝚒𝚝𝚜 𝚊𝚕𝚠𝚊𝚢𝚜 𝚏𝚞𝚗

> ${global.wm}`,
                                mentions: [participant]
                            });
                        } else if (anu.action === 'remove') {
                            const memberCount = groupMetadata.participants.length;
                            await conn.sendMessage(anu.id, {
                                image: { url: ppUrl },
                                caption: `
  *👋 Goodbye* 😪 @${participant.split('@')[0]}
  
  *Left at: ${moment.tz(timezones).format('HH:mm:ss')},  ${moment.tz(timezones).format('DD/MM/YYYY')}*
  
  *We're now ${memberCount} members*.
  
> ${global.wm}`,
                                mentions: [participant]
                            });
                        }
                    }
                } catch (err) {
                    console.error('Error in welcome feature:', err);
                }
            }
            
            // ADMIN EVENT FEATURE
            if (config.adminevent) {
                console.log(anu);
                if (anu.participants.includes(botNumber)) return;
                try {
                    let metadata = await conn.groupMetadata(anu.id);
                    let participants = anu.participants;
                    for (let num of participants) {
                        let check = anu.author !== num && anu.author && anu.author.length > 1;
                        let tag = check ? [anu.author, num] : [num];
                        let ppuser;
                        try {
                            ppuser = await conn.profilePictureUrl(num, 'image');
                        } catch {
                            ppuser = 'https://telegra.ph/file/de7c8230aff02d7bd1a93.jpg';
                        }
                        if (anu.action == "promote") {
                            conn.sendMessage(anu.id, {
                                text: `*@${anu.author.split("@")[0]} Has promoted  @${num.split("@")[0]} As admin*`,
                                mentions: tag
                            });
                        }
                        if (anu.action == "demote") {
                            conn.sendMessage(anu.id, {
                                text: `@${anu.author.split("@")[0]} *Has demoted @${num.split("@")[0]} *Has admin*`,
                                mentions: tag
                            });
                        }
                    }
                } catch (err) {
                    console.log('Error in admin event feature:', err);
                }
            }
        }
    } catch (err) {
        console.error('Error in group-participants.update:', err);
    }
});
// Initialize global variables for anticall feature
if (!global.recentCallers) {
  global.recentCallers = new Map();
}

// Initialize anticall variables with safe defaults
if (typeof global.anticall === 'undefined') {
  global.anticall = true; // Enable anticall by default
}

if (!global.anticallMessage) {
  global.anticallMessage = `🚫, *🌹Hi. I am 👑VINIC-XMD, a friendly WhatsApp bot from Uganda 🇺🇬, created by Kelvin Tech.*
  
    *My owner cannot receive calls at this moment. Please avoid unnecessary calling.*
    
  ${global.wm}`;
}


// Updated Anticall handler
conn.ev.on('call', async (callData) => {
  try {
    const botNumber = await conn.decodeJid(conn.user.id);
    const config = global.db.data.settings[botNumber]?.config;
    
    // Check if anticall is enabled
    if (!config || !config.anticall) return;
    
    for (let call of callData) {
      const from = call.from;
      const callId = call.id;
      
      // Check if caller is owner
      if (Array.isArray(global.ownernumber) && global.ownernumber.includes(from.split('@')[0])) {
        console.log(chalk.green(`[ANTICALL] Allowing call from owner: ${from}`));
        continue;
      }
      
      // Safe check for recentCallers with initialization fallback
      try {
        const now = Date.now();
        const lastWarn = global.recentCallers.get(from) || 0;
        const COOLDOWN = 30 * 1000; // 30 seconds cooldown per caller
        if (now - lastWarn < COOLDOWN) {
          console.log(chalk.yellow(`[ANTICALL] Suppressing repeated warning to ${from}`));
          // still attempt to reject/block silently
          try {
            if (config.anticall === "decline" && typeof conn.rejectCall === 'function') {
              await conn.rejectCall(callId, from);
            } else if (config.anticall === "block") {
              await conn.updateBlockStatus(from, "block");
            }
          } catch (e) {}
          continue;
        }
        global.recentCallers.set(from, now);
        // auto cleanup after cooldown
        setTimeout(() => global.recentCallers.delete(from), COOLDOWN);
      } catch (e) {
        console.error(chalk.red('[ANTICALL] recentCallers check failed:'), e);
        // Initialize if it's still not working
        if (!global.recentCallers) global.recentCallers = new Map();
      }
      
      console.log(chalk.yellow(`[ANTICALL] ${config.anticall === "block" ? "Blocking" : "Declining"} call from: ${from}`));
      
      // Handle based on anticall mode
      if (config.anticall === "decline") {
        // DECLINE MODE: Send warning message and decline call
        try {
          const warningMessage = global.anticallMessage || 
            `@${call.from.split('@')[0]}, my owner cannot receive audio calls and video calls at this moment. Please avoid unnecessary calling.`;
          
          await conn.sendMessage(from, { text: warningMessage });
          console.log(chalk.green(`[ANTICALL] Warning message sent to: ${from}`));
        } catch (msgError) {
          console.error(chalk.red('[ANTICALL] Failed to send message:'), msgError);
        }
        
        try {
          // Reject the call
          if (typeof conn.rejectCall === 'function') {
            await conn.rejectCall(callId, from);
            console.log(chalk.green(`[ANTICALL] Successfully declined call from: ${from}`));
          } else {
            console.log(chalk.yellow('[ANTICALL] conn.rejectCall not available on this baileys build.'));
          }
        } catch (rejectError) {
          console.error(chalk.red('[ANTICALL] Failed to decline call:'), rejectError);
        }
        
      } else if (config.anticall === "block") {
        // BLOCK MODE: Send message FIRST, then block
        try {
          // SEND MESSAGE BEFORE BLOCKING - THIS IS THE KEY FIX
          const blockMessage = `@${call.from.split('@')[0]},*🌹Hi. I am 👑VINIC-XMD, a friendly WhatsApp bot from Uganda 🇺🇬, created by Kelvin Tech.
          
    You have been blocked for calling. My owner does not accept calls.*
    
  ${global.wm}  `;
          await conn.sendMessage(from, { text: blockMessage });
          console.log(chalk.green(`[ANTICALL] Block warning sent to: ${from}`));
          
          // Add a small delay to ensure message is sent before blocking
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // NOW BLOCK THE USER
          await conn.updateBlockStatus(from, "block");
          console.log(chalk.green(`[ANTICALL] Successfully blocked caller: ${from}`));
          
        } catch (blockError) {
          console.error(chalk.red('[ANTICALL] Failed to block caller:'), blockError);
          
          // Fallback to decline if block fails
          try {
            if (typeof conn.rejectCall === 'function') {
              await conn.rejectCall(callId, from);
              console.log(chalk.yellow(`[ANTICALL] Fallback: Declined call after block failed: ${from}`));
            }
          } catch (fallbackError) {
            console.error(chalk.red('[ANTICALL] Fallback decline also failed:'), fallbackError);
          }
        }
      }
    }
  } catch (error) {
    console.error(chalk.red('[ANTICALL ERROR]'), error);
  }
});

conn.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];

    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }

    let type = await FileType.fromBuffer(buffer);
    let trueFileName = attachExtension ? (filename + '.' + type.ext) : filename;
    let savePath = path.join(__dirname, 'tmp', trueFileName); // Save to 'tmp' folder

    await fs.writeFileSync(savePath, buffer);

    buffer = null; 
    global.gc?.(); 

    return savePath;
};

  conn.sendButtonImg = async (jid, buttons = [], text, image, footer, quoted = '', options = {}) => {
    const buttonMessage = {
      image: { url: image },
      caption: text,
      footer: footer,
      buttons: buttons.map(button => ({
        buttonId: button.id || '',
        buttonText: { displayText: button.text || 'Button' },
        type: button.type || 1
      })),
      headerType: 1,
      viewOnce: options.viewOnce || false,
    };
    conn.sendMessage(jid, buttonMessage, { quoted });
  };

  conn.sendList = async (jid, title, footer, btn, quoted = '', options = {}) => {
    let msg = generateWAMessageFromContent(jid, {
      viewOnceMessage: {
        message: {
          "messageContextInfo": {
            "deviceListMetadata": {},
            "deviceListMetadataVersion": 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            ...options,
            body: proto.Message.InteractiveMessage.Body.create({ text: title }),
            footer: proto.Message.InteractiveMessage.Footer.create({ text: footer || config.botname }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  "name": "single_select",
                  "buttonParamsJson": JSON.stringify(btn)
                },
              ]
            })
          })
        }
      }
    }, { quoted });
    return await conn.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id
    });
  };

  conn.sendButtonProto = async (jid, title, footer, buttons = [], quoted = '', options = {}) => {
    let msg = generateWAMessageFromContent(jid, {
      viewOnceMessage: {
        message: {
          "messageContextInfo": {
            "deviceListMetadata": {},
            "deviceListMetadataVersion": 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            ...options,
            body: proto.Message.InteractiveMessage.Body.create({ text: title }),
            footer: proto.Message.InteractiveMessage.Footer.create({ text: footer || config.botname }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: buttons
            })
          })
        }
      }
    }, { quoted });
    return await conn.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id
    });
  };

  conn.ments = (teks = '') => {
    if (!teks || typeof teks !== 'string') return [];
    return teks.match('@') ? [...teks.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net') : [];
};

  conn.cMod = (jid, copy, text = '', sender = conn.user.id, options = {}) => {
    if (!copy || !copy.message) return copy;
    let mtype = Object.keys(copy.message)[0];
    let isEphemeral = mtype === 'ephemeralMessage';
    if (isEphemeral) {
      mtype = Object.keys(copy.message.ephemeralMessage.message)[0];
    }
    let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message;
    let content = msg[mtype];
    if (typeof content === 'string') msg[mtype] = text || content;
    else if (content && content.caption) content.caption = text || content.caption;
    else if (content && content.text) content.text = text || content.text;
    if (typeof content !== 'string') msg[mtype] = {
      ...content,
      ...options
    };
    if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
    else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
    if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid;
    else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid;
    copy.key.remoteJid = jid;
    copy.key.fromMe = sender === conn.user.id;
    return proto.WebMessageInfo.fromObject(copy);
  };

  conn.sendText = (jid, text, quoted = '', options) => conn.sendMessage(jid, { text: text, ...options }, { quoted });

  conn.deleteMessage = async (chatId, key) => {
    try {
      await conn.sendMessage(chatId, { delete: key });
      console.log(`Pesan dihapus: ${key.id}`);
    } catch (error) {
      console.error('Gagal menghapus pesan:', error);
    }
  };

  conn.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
  };

  conn.ev.on('creds.update', saveCreds);
  conn.serializeM = (m) => smsg(conn, m, store);
  return conn;
}

clientstart();

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});