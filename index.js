console.clear();
console.log('Starting Vinic-Xmd with Enhanced Longevity...');

// Environment detection for cloud optimization
const isProduction = process.env.NODE_ENV === 'production';
const isLowMemory = process.env.MEMORY_LIMIT < 512 || isProduction;

// Optimize memory usage
if (isLowMemory) {
  console.log('🚀 Running in optimized mode for cloud/low memory environment');
}

const settings = require('./settings');
const config = require('./config');

// Enhanced error handling for cloud stability
process.on("uncaughtException", (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit in cloud environments
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

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
  browsers,
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


const db = require('./data/database.json');

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
} = require('./start/lib/myfunction');

const {
detectUrls,
handleStatusUpdate
 } = require('./Jex');
 


const {
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid
} = require('./start/lib/exif');




// Use system temp directory for cloud platforms
const TMP_DIR = isProduction 
  ? path.join(os.tmpdir(), 'vinic-bot-tmp')
  : path.join(__dirname, 'tmp');

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

//=========SESSION-AUTH=====================

const sessionDir = path.join(__dirname, 'sessions');
const credsPath = path.join(sessionDir, 'creds.json');

// Create session directory if it doesn't exist
if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
}

async function loadSession() {
    try {
        if (!settings.SESSION_ID) {
            console.log('No SESSION_ID provided - QR login will be generated');
            return null;
        }

        console.log('[ ⏳ ] Downloading creds data...');
        console.log('[ 🆔️ ] Downloading MEGA.nz session...');
        
        // Remove "malvin~" prefix if present, otherwise use full SESSION_ID
        const megaFileId = settings.SESSION_ID.startsWith('Jexploit~') 
            ? settings.SESSION_ID.replace("Jexploit~", "") 
            : settings.SESSION_ID;

        const filer = File.fromURL(`https://mega.nz/file/${megaFileId}`);
            
        const data = await new Promise((resolve, reject) => {
            filer.download((err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
        
        fs.writeFileSync(credsPath, data);
        console.log('[ ✅ ] MEGA session downloaded successfully');
        return JSON.parse(data.toString());
    } catch (error) {
        console.error('❌ Error loading session:', error.message);
        console.log('Will generate QR code instead');
        return null;
    }
}

//=======SESSION-AUTH==============


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Enhanced cleanup function for cloud
function cleanupTmpFiles() {
  try {
    if (fs.existsSync(TMP_DIR)) {
      const files = fs.readdirSync(TMP_DIR);
      let deletedCount = 0;
      files.forEach(file => {
        try {
          const filePath = path.join(TMP_DIR, file);
          const stats = fs.statSync(filePath);
          // Delete files older than 30 minutes in production, 1 hour in development
          const maxAge = isProduction ? 30 * 60 * 1000 : 60 * 60 * 1000;
          if (Date.now() - stats.mtime.getTime() > maxAge) {
            fs.unlinkSync(filePath);
            deletedCount++;
          }
        } catch (e) {
          // Ignore file errors during cleanup
        }
      });
      if (deletedCount > 0) {
        console.log(`🧹 Cleaned up ${deletedCount} temporary files`);
      }
    }
  } catch (error) {
    console.log('Cleanup error:', error.message);
  }
}

// Memory monitoring
function monitorResources() {
  if (isLowMemory) {
    const used = process.memoryUsage();
    const memoryUsage = {
      rss: Math.round(used.rss / 1024 / 1024 * 100) / 100,
      heapTotal: Math.round(used.heapTotal / 1024 / 1024 * 100) / 100,
      heapUsed: Math.round(used.heapUsed / 1024 / 1024 * 100) / 100,
      external: Math.round(used.external / 1024 / 1024 * 100) / 100
    };
    
    if (memoryUsage.heapUsed > 150) { // 150MB threshold for low memory
      console.warn('⚠️ High memory usage:', memoryUsage);
      if (global.gc) {
        global.gc();
        console.log('🗑️ Garbage collection triggered');
      }
    }
  }
}

async function clientstart() {
    

   // Check and download session data
      const creds = await loadSession();
      



    // Use multi-file auth state
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    
    // Fetch latest WhatsApp Web version with fallback
    let waVersion;
    try {
        const { version } = await fetchLatestBaileysVersion();
        waVersion = version;
        console.log("[ JEXPLOIT] Connecting to WhatsApp ⏳️...");
        
    } catch (error) {
        console.log(chalk.yellow(`[⚠️] Using stable fallback version`));
        waVersion = [2, 3000, 1017546695];
    }

      const conn = makeWASocket({
    // Connection settings
    printQRInTerminal: !usePairingCode,
    syncFullHistory: false,
    markOnlineOnConnect: true,
    connectTimeoutMs: 60000, // Reduced for faster connection
    defaultQueryTimeoutMs: 30000,
    keepAliveIntervalMs: 25000,
    maxRetries: 5,
    
    // Performance optimizations
    generateHighQualityLinkPreview: false,
    linkPreviewImageThumbnailWidth: 64,

        
        version: waVersion,
        
        // Lightweight browser
        browser: ["Ubuntu", "Chrome", "120.0.0.0"],
        
        // Minimal logging
        logger: pino({ level: 'silent' }),
        
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino().child({
                level: 'silent',
                stream: 'store'
            })),
        },
        
        // Connection resilience
        fireInitQueries: false, // Reduce initial load
        emitOwnEvents: true,
        defaultCongestionControl: 1,
    });

    // Define decodeJid immediately after connection
    conn.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && decode.user + '@' + decode.server || jid;
        } else return jid;
    };

const botNumber = conn.decodeJid(conn.user?.id) || 'default';



    // Run cleanup every 30 minutes
    setInterval(cleanupTmpFiles, 30 * 60 * 1000);

    // Monitor memory every 10 minutes
    setInterval(monitorResources, 10 * 60 * 1000);
    
    if (!creds && !conn.authState.creds.registered) {
    const phoneNumber = await question(chalk.greenBright(`Thanks for choosing Jexploit-bot. Please provide your number start with 256xxx:\n`));
    const code = await conn.requestPairingCode(phoneNumber.trim());
    console.log(chalk.cyan(`Code: ${code}`));
    console.log(chalk.cyan(`Jexploit: Please use this code to connect your WhatsApp account.`));
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
        
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                if (mek.message?.reactionMessage || mek.message?.protocolMessage) {
                    return;
                }
                
               
            await detectUrls(mek, conn);
                
                
                
                return;
            }

            if (!conn.public && !mek.key.fromMe && chatUpdate.type === 'notify') return;
            let m = smsg(conn, mek, store);
            
            // Conditionally enable features based on memory
            if (!isLowMemory) {
            
             
            await handleStatusUpdate(mek, conn); 
            
            }
            
            require("./start/kevin")(conn, m, chatUpdate, mek, store);
        } catch (err) {
            console.log(chalk.yellow.bold("[ ERROR ] kevin.js :\n") + chalk.redBright(util.format(err)));
        }
 });
 
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

  conn.getName = async (id, withoutContact = false) => {
    // id can be a LID (e.g., 'xxxx@lid') or a PN (e.g., 'xxxx@s.whatsapp.net')
    let v;
    if (id.endsWith('@g.us')) {
        // ... (your group metadata logic)
    } else {
        // V7 CHANGE: Contacts may have 'id', 'lid', or 'phoneNumber' fields
        v = store.contacts[id] || {};
        return v.name || v.notify || v.verifiedName || id.split('@')[0];
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
    let savePath = path.join(__dirname, 'tmp', trueFileName);

    await fs.writeFileSync(savePath, buffer);
    return savePath;
  };
  

conn.sendStatusMention = async (content, jids = []) => {
    try {
        let users = [];
        
        // Get users from all provided jids
        for (let id of jids) {
            try {
                let userId = await conn.groupMetadata(id);
                const participants = userId.participants || [];
                users = [...users, ...participants.map(u => conn.decodeJid(u.id))];
            } catch (error) {
                console.error('Error getting group metadata for', id, error);
            }
        };

        // Filter out duplicates and undefined
        users = [...new Set(users.filter(u => u))];

        let message = await conn.sendMessage(
            "status@broadcast", 
            content, 
            {
                backgroundColor: "#000000",
                font: Math.floor(Math.random() * 9),
                statusJidList: users,
                additionalNodes: [
                    {
                        tag: "meta",
                        attrs: {},
                        content: [
                            {
                                tag: "mentioned_users",
                                attrs: {},
                                content: jids.map((jid) => ({
                                    tag: "to",
                                    attrs: { jid },
                                    content: undefined,
                                })),
                            },
                        ],
                    },
                ],
            }
        );

        // Broadcast to all groups
        for (let id of jids) {
            try {
                await conn.relayMessage(id, {
                    groupStatusMentionMessage: {
                        message: {
                            protocolMessage: {
                                key: message.key,
                                type: 25,
                            },
                        },
                    },
                }, {});
                await delay(2500); // Use your existing delay function
            } catch (error) {
                console.error('Error relaying message to', id, error);
            }
        }
        
        return message;
    } catch (error) {
        console.error('Error in sendStatusMention:', error);
        throw error;
    }
};

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

  conn.prefa = settings.prefa;
  conn.public = config.autoviewstatus || true;
  conn.serializeM = (m) => smsg(conn, m, store);

  conn.ev.on('connection.update', async (update) => {
    let { Connecting } = require("./connect");
    Connecting({ update, conn, Boom, DisconnectReason, sleep, color, clientstart });
  });
  
// In the group-participants.update event handler
conn.ev.on('group-participants.update', async (anu) => {
    try {
        const botNumber = await conn.decodeJid(conn.user.id);
        
        // Get settings from JSON manager
        const welcomeEnabled = global.settingsManager?.getSetting(botNumber, 'welcome', true);
        const admineventEnabled = global.settingsManager?.getSetting(botNumber, 'adminevent', true);
        
        // WELCOME FEATURE - USING JSON SETTINGS
        if (welcomeEnabled) {
            try {
                const groupMetadata = await conn.groupMetadata(anu.id);
                const participants = anu.participants;
                
                for (const participant of participants) {
                    let ppUrl;
                    try {
                        ppUrl = await conn.profilePictureUrl(participant, 'image');
                    } catch {
                        ppUrl = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60';
                    }
                    
                    // Extract user ID from both formats: @s.whatsapp.net and @lid
                    let userId;
                    if (participant.endsWith('@s.whatsapp.net')) {
                        userId = participant.split('@')[0];
                    } else if (participant.endsWith('@lid')) {
                        // For @lid format, get the actual number if possible
                        try {
                            const userInfo = await conn.decodeJid(participant);
                            userId = userInfo.split('@')[0] || participant.split('@')[0];
                        } catch {
                            userId = participant.split('@')[0];
                        }
                    } else {
                        userId = participant.split('@')[0];
                    }
                    
                    const name = await conn.getName(participant) || userId;
                    
                    if (anu.action === 'add') {
                        const memberCount = groupMetadata.participants.length;
                        await conn.sendMessage(anu.id, {
                            image: { url: ppUrl },
                            caption: `
*${global.botname} welcome* @${userId}  

*𝙶𝚛𝚘𝚞𝚙 𝙽𝚊𝚖𝚎: ${groupMetadata.subject}*

*You're our ${memberCount}th member!*

*Join time: ${moment.tz(timezones).format('HH:mm:ss')}, ${moment.tz(timezones).format('DD/MM/YYYY')}*

𝙲𝚊𝚞𝚜𝚎 𝚌𝚑𝚊𝚘𝚜 𝚒𝚝𝚜 𝚊𝚕𝚠𝚊𝚢𝚜 𝚏𝚞𝚗

> ${global.wm}`,
                            mentions: [participant]
                        });
                        console.log(`✅ Welcome message sent for ${name} in ${groupMetadata.subject}`);
                        
                    } else if (anu.action === 'remove') {
                        const memberCount = groupMetadata.participants.length;
                        await conn.sendMessage(anu.id, {
                            image: { url: ppUrl },
                            caption: `
*👋 Goodbye* 😪 @${userId}

*Left at: ${moment.tz(timezones).format('HH:mm:ss')}, ${moment.tz(timezones).format('DD/MM/YYYY')}*

*We're now ${memberCount} members*.

> ${global.wm}`,
                            mentions: [participant]
                        });
                        console.log(`✅ Goodbye message sent for ${name} in ${groupMetadata.subject}`);
                    }
                }
            } catch (err) {
                console.error('Error in welcome feature:', err);
            }
        }
        
        // ADMIN EVENT FEATURE - USING JSON SETTINGS
        if (admineventEnabled) {
            console.log('Admin event detected:', anu);
            if (anu.participants.includes(botNumber)) return;
            
            try {
                let metadata = await conn.groupMetadata(anu.id);
                let participants = anu.participants;
                
                for (let num of participants) {
                    let check = anu.author !== num && anu.author && anu.author.length > 1;
                    let tag = check ? [anu.author, num] : [num];
                    
                    if (anu.action == "promote") {
                        // Get user IDs for promoted users (handling both formats)
                        let promotedUsers = [];
                        for (let participant of participants) {
                            let userId;
                            if (participant.endsWith('@s.whatsapp.net')) {
                                userId = participant.split('@')[0];
                            } else if (participant.endsWith('@lid')) {
                                try {
                                    const userInfo = await conn.decodeJid(participant);
                                    userId = userInfo.split('@')[0] || participant.split('@')[0];
                                } catch {
                                    userId = participant.split('@')[0];
                                }
                            } else {
                                userId = participant.split('@')[0];
                            }
                            promotedUsers.push(`@${userId}`);
                        }
                        
                        // Get admin user ID
                        let adminUserId;
                        if (anu.author.endsWith('@s.whatsapp.net')) {
                            adminUserId = anu.author.split('@')[0];
                        } else if (anu.author.endsWith('@lid')) {
                            try {
                                const adminInfo = await conn.decodeJid(anu.author);
                                adminUserId = adminInfo.split('@')[0] || anu.author.split('@')[0];
                            } catch {
                                adminUserId = anu.author.split('@')[0];
                            }
                        } else {
                            adminUserId = anu.author.split('@')[0];
                        }
                        
                        const promotionMessage = `*『 GROUP PROMOTION 』*\n\n` +
                            `👤 *Promoted User${participants.length > 1 ? 's' : ''}:*\n` +
                            `${promotedUsers.join('\n')}\n\n` +
                            `👑 *Promoted By:* @${adminUserId}\n\n` +
                            `📅 *Date:* ${new Date().toLocaleString()}`;
                        
                        await conn.sendMessage(anu.id, {
                            text: promotionMessage,
                            mentions: tag
                        });
                        console.log(`✅ Promotion message sent in ${metadata.subject}`);
                    }
                    
                    if (anu.action == "demote") {
                        // Get user IDs for demoted users (handling both formats)
                        let demotedUsers = [];
                        for (let participant of participants) {
                            let userId;
                            if (participant.endsWith('@s.whatsapp.net')) {
                                userId = participant.split('@')[0];
                            } else if (participant.endsWith('@lid')) {
                                try {
                                    const userInfo = await conn.decodeJid(participant);
                                    userId = userInfo.split('@')[0] || participant.split('@')[0];
                                } catch {
                                    userId = participant.split('@')[0];
                                }
                            } else {
                                userId = participant.split('@')[0];
                            }
                            demotedUsers.push(`@${userId}`);
                        }
                        
                        // Get admin user ID
                        let adminUserId;
                        if (anu.author.endsWith('@s.whatsapp.net')) {
                            adminUserId = anu.author.split('@')[0];
                        } else if (anu.author.endsWith('@lid')) {
                            try {
                                const adminInfo = await conn.decodeJid(anu.author);
                                adminUserId = adminInfo.split('@')[0] || anu.author.split('@')[0];
                            } catch {
                                adminUserId = anu.author.split('@')[0];
                            }
                        } else {
                            adminUserId = anu.author.split('@')[0];
                        }
                        
                        const demotionMessage = `*『 GROUP DEMOTION 』*\n\n` +
                            `👤 *Demoted User${participants.length > 1 ? 's' : ''}:*\n` +
                            `${demotedUsers.join('\n')}\n\n` +
                            `👑 *Demoted By:* @${adminUserId}\n\n` +
                            `📅 *Date:* ${new Date().toLocaleString()}`;
                        
                        await conn.sendMessage(anu.id, {
                            text: demotionMessage,
                            mentions: tag
                        });
                        console.log(`✅ Demotion message sent in ${metadata.subject}`);
                    }
                }
            } catch (err) {
                console.log('Error in admin event feature:', err);
            }
        }
    } catch (error) {
        console.error('Error in group-participants.update:', error);
    }
});
conn.ev.on('call', async (callData) => {
    try {
        const botNumber = await conn.decodeJid(conn.user.id);
        
        // Get anticall setting from JSON manager
        const anticallSetting = global.settingsManager?.getSetting(botNumber, 'anticall', 'off');
        
        // Check if anticall is enabled (off, decline, or block)
        if (!anticallSetting || anticallSetting === 'off') {
            console.log(chalk.gray('[ANTICALL] Disabled'));
            return;
        }
        
        for (let call of callData) {
            const from = call.from;
            const callId = call.id;
            
            // Check if caller is owner (allow calls from owner)
            const ownerNumbers = global.owner || [];
            const isOwner = ownerNumbers.some(num => from.includes(num.replace('+', '').replace(/[^0-9]/g, '')));
            
            if (isOwner) {
                console.log(chalk.green(`[ANTICALL] Allowing call from owner: ${from}`));
                continue;
            }
            
            // Safe check for recentCallers with initialization fallback
            try {
                const now = Date.now();
                const lastWarn = global.recentCallers?.get(from) || 0;
                const COOLDOWN = 30 * 1000; // 30 seconds cooldown per caller
                
                if (now - lastWarn < COOLDOWN) {
                    console.log(chalk.yellow(`[ANTICALL] Suppressing repeated warning to ${from}`));
                    // Still attempt to reject/block silently
                    try {
                        if (typeof conn.rejectCall === 'function') {
                            await conn.rejectCall(callId, from);
                        }
                    } catch (e) {}
                    continue;
                }
                
                if (!global.recentCallers) global.recentCallers = new Map();
                global.recentCallers.set(from, now);
                
                // Auto cleanup after cooldown
                setTimeout(() => {
                    if (global.recentCallers?.has(from)) {
                        global.recentCallers.delete(from);
                    }
                }, COOLDOWN);
                
            } catch (e) {
                console.error(chalk.red('[ANTICALL] recentCallers check failed:'), e);
                if (!global.recentCallers) global.recentCallers = new Map();
            }
            
            console.log(chalk.yellow(`[ANTICALL] ${anticallSetting} call from: ${from}`));
            
            // ========== SEND MESSAGE TO CHAT ==========
            try {
                const callerName = await conn.getName(from) || from.split('@')[0];
                let warningMessage = '';
                
                if (anticallSetting === 'block') {
                    warningMessage = `🚫 *CALL BLOCKED*\n\n` +
                        `*Caller:* @${from.split('@')[0]}\n` +
                        `*Time:* ${moment().tz(timezones).format('HH:mm:ss')}\n` +
                        `*Date:* ${moment().tz(timezones).format('DD/MM/YYYY')}\n\n` +
                        `*🌹 Hi, I am ${global.botname}, a friendly WhatsApp bot from Uganda 🇺🇬, created by Kelvin Tech.*\n\n` +
                        `*My owner cannot receive calls at this moment. Calls are automatically blocked.*\n\n` +
                        `> ${global.wm}`;
                } else {
                    warningMessage = `🚫 *CALL DECLINED*\n\n` +
                        `*Caller:* @${from.split('@')[0]}\n` +
                        `*Time:* ${moment().tz(timezones).format('HH:mm:ss')}\n` +
                        `*Date:* ${moment().tz(timezones).format('DD/MM/YYYY')}\n\n` +
                        `*🌹 Hi, I am ${global.botname}, a friendly WhatsApp bot from Uganda 🇺🇬, created by Kelvin Tech.*\n\n` +
                        `*My owner cannot receive calls at this moment. Please avoid unnecessary calling.*\n\n` +
                        `> ${global.wm}`;
                }

                // Send message to the caller's chat
                await conn.sendMessage(from, { 
                    text: warningMessage,
                    mentions: [from]
                });
                
                console.log(chalk.green(`[ANTICALL] Warning message sent to chat: ${from}`));
                
            } catch (msgError) {
                console.error(chalk.red('[ANTICALL] Failed to send message to chat:'), msgError);
            }
            
            // Decline or block the call
            try {
                if (typeof conn.rejectCall === 'function') {
                    await conn.rejectCall(callId, from);
                    console.log(chalk.green(`[ANTICALL] Successfully ${anticallSetting === 'block' ? 'blocked' : 'declined'} call from: ${from}`));
                    
                    // If mode is block, also block the user
                    if (anticallSetting === 'block') {
                        try {
                            await conn.updateBlockStatus(from, 'block');
                            console.log(chalk.red(`[ANTICALL] Blocked user: ${from}`));
                        } catch (blockError) {
                            console.error(chalk.red('[ANTICALL] Failed to block user:'), blockError);
                        }
                    }
                } else {
                    console.log(chalk.yellow('[ANTICALL] conn.rejectCall not available'));
                }
            } catch (rejectError) {
                console.error(chalk.red('[ANTICALL] Failed to decline/block call:'), rejectError);
            }
        }
    } catch (error) {
        console.error(chalk.red('[ANTICALL ERROR]'), error);
    }
});

  conn.getFile = async (PATH, returnAsFilename) => {
    let res, filename;
    const data = Buffer.isBuffer(PATH) 
        ? PATH 
        : /^data:.*?\/.*?;base64,/i.test(PATH) 
        ? Buffer.from(PATH.split`, `[1], 'base64') 
        : /^https?:\/\//.test(PATH) 
        ? await (res = await fetch(PATH)).buffer() 
        : fs.existsSync(PATH) 
        ? (filename = PATH, fs.readFileSync(PATH)) 
        : typeof PATH === 'string' 
        ? PATH 
        : Buffer.alloc(0);

    if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer');
    
    const type = await FileType.fromBuffer(data) || { mime: 'application/octet-stream', ext: '.bin' };
    
    if (returnAsFilename && !filename) {
        filename = path.join(__dirname, './tmp/' + new Date() * 1 + '.' + type.ext);
        await fs.promises.writeFile(filename, data);
    }
    
    const deleteFile = async () => {
        if (filename && fs.existsSync(filename)) {
            await fs.promises.unlink(filename).catch(() => {}); 
        }
    };

    setImmediate(deleteFile);
    data.fill(0); 
    
    return { res, filename, ...type, data, deleteFile };
  };

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
    let savePath = path.join(__dirname, 'tmp', trueFileName);

    await fs.writeFileSync(savePath, buffer);
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