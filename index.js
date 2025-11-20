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
const config = require('./setting/config');

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

const Database = require('better-sqlite3');
const db = require('./start/lib/database/database');

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
handleAutoReact,
checkAndHandleLinks,
detectUrls,
saveDatabase,
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

async function getSessionData() {
    try {
        if (!settings.SESSION_ID) {
            console.warn("[ ⏳ ] No SESSION_ID provided - Falling back to QR or pairing code");
            return null;
        }
        
        console.log("[ 📥 ] Fetching session from server...");
        const response = await fetch(`https://veronica-ai-production.up.railway.app/session?session=${settings.SESSION_ID}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const sessionData = await response.json();
        console.log("[ ✅ ] Session data fetched successfully from server");
        return sessionData;
        
    } catch (error) {
        console.error("[ ❌ ] Error fetching session from server:", error.message);
        console.info("[ 😑 ] Will attempt pairing code login");
        return null;
    }
}

function initSession(sessionData) {
    if (!sessionData) {
        console.log('No session data from server');
        return null;
    }
    
    const crypto = require('crypto');
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(sessionData.key, 'hex');
    const iv = Buffer.from(sessionData.iv, 'hex');
    
    try {
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(sessionData.data, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        const data = JSON.parse(decrypted);
        
        // Ensure session directory exists
        if (!fs.existsSync(SESSION_DIR)) {
            fs.mkdirSync(SESSION_DIR, { recursive: true });
        }
        
        // Save credentials
        fs.writeFileSync(CREDS_PATH, JSON.stringify(data.creds, null, 2));
        
        // Save sync keys if they exist
        if (data.syncKeys) {
            for (const [filename, syncKeyData] of Object.entries(data.syncKeys)) {
                fs.writeFileSync(path.join(SESSION_DIR, filename), JSON.stringify(syncKeyData, null, 2));
            }
        }
        
        console.log('[ ✅ ] Session decrypted and saved successfully');
        return data;
        
    } catch (error) {
        console.error('[ ❌ ] Error decrypting session:', error.message);
        return null;
    }
}

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
    // Ensure session directory exists
    if (!fs.existsSync(SESSION_DIR)) {
        fs.mkdirSync(SESSION_DIR, { recursive: true });
    }

    // Get session data from server
    const serverSessionData = await getSessionData();
    let decryptedSession = null;
    
    if (serverSessionData) {
        decryptedSession = initSession(serverSessionData);
    }

    // Use multi-file auth state
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
    
    // Fetch latest WhatsApp Web version with fallback
    let waVersion;
    try {
        const { version } = await fetchLatestBaileysVersion();
        waVersion = version;
        console.log(chalk.green(`[✅] Using Baileys version: ${waVersion}`));
    } catch (error) {
        console.log(chalk.yellow(`[⚠️] Using stable fallback version`));
        waVersion = [2, 3000, 1017546695];
    }

   // FORCE CONNECTION - NO QR CODE
const conn = makeWASocket({
    // Force disable QR code
    printQRInTerminal: false,
    syncFullHistory: false,
    markOnlineOnConnect: true,
    
    // Extended timeouts
    connectTimeoutMs: 120000,
    defaultQueryTimeoutMs: 60000,
    keepAliveIntervalMs: 30000,
    maxRetries: 10,
    
    // Performance optimizations
    generateHighQualityLinkPreview: false,
    linkPreviewImageThumbnailWidth: 64,
    
    version: waVersion,
    browser: ["Ubuntu", "Chrome", "120.0.0.0"],
    logger: pino({ level: 'silent' }),
    
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino().child({
            level: 'silent',
            stream: 'store'
        })),
    },
    
    // Force connection behavior
    fireInitQueries: false,
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

// LOAD PERSISTENT SETTINGS ON STARTUP
try {
    const { loadPersistentSettings, startAutoSave } = require('./vinic');
    await loadPersistentSettings(conn);
    startAutoSave();
} catch (error) {
    const { initializeDatabase } = require('./vinic');
    initializeDatabase(null, botNumber);
}

    // Run cleanup every 30 minutes
    setInterval(cleanupTmpFiles, 30 * 60 * 1000);

    // Monitor memory every 10 minutes
    setInterval(monitorResources, 10 * 60 * 1000);
    
    const { makeInMemoryStore } = require("./start/lib/store/");
    const store = makeInMemoryStore({
        logger: pino().child({
            level: 'silent',
            stream: 'store'
        })
    });
    
    store.bind(conn.ev);

   

// 1. AUTO-RECONNECT WITH BACKOFF
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 50; // Much higher limit

conn.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (connection === 'close') {
        const shouldReconnect = 
            lastDisconnect?.error?.output?.statusCode !== 401 && // Logged out
            reconnectAttempts < MAX_RECONNECT_ATTEMPTS;
        
        if (shouldReconnect) {
            reconnectAttempts++;
            const backoffTime = Math.min(1000 * Math.pow(1.5, reconnectAttempts), 300000); // Max 5 minutes
            console.log(`🔁 Force reconnection attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} in ${backoffTime/1000}s...`);
            
            setTimeout(clientstart, backoffTime);
        } else {
            console.log('❌ Max reconnection attempts reached or logged out');
            // Force restart after longer delay
            setTimeout(clientstart, 600000); // 10 minutes
        }
    }
    
    if (connection === 'open') {
        console.log('✅ Connection stabilized - Bot should stay online longer');
        reconnectAttempts = 0; // Reset on successful connection
        
        // Send periodic presence updates to stay active
        setInterval(() => {
            try {
                conn.sendPresenceUpdate('available');
            } catch (e) {
                // Silent fail
            }
        }, 60000); // Every minute
    }
    
    // Handle pairing code if needed (instead of QR)
    if (qr) {
        console.log('🔄 Pairing code required - connection will proceed automatically');
        // The connection will automatically handle pairing without showing QR
    }
    
    if (connection === 'connecting') {
        console.log('🔄 Force connecting to WhatsApp...');
    }
});

    // 2. MEMORY MANAGEMENT
    setInterval(() => {
        if (global.gc) {
            global.gc();
        }
        // Clear any large caches periodically
        if (global.db && global.db.data && Object.keys(global.db.data).length > 1000) {
            // Simple cache cleanup - keep only recent data
            for (let key in global.db.data) {
                if (key.startsWith('temp_')) {
                    delete global.db.data[key];
                }
            }
        }
    }, 10 * 60 * 1000); // Every 10 minutes

    // 3. PERSISTENT SESSION SAVING
    setInterval(async () => {
        try {
            await saveDatabase();
            // Force save credentials periodically
            if (typeof saveCreds === 'function') {
                await saveCreds();
            }
        } catch (error) {
            console.log('Auto-save skipped:', error.message);
        }
    }, 2 * 60 * 1000); // Every 2 minutes

    // 4. NETWORK KEEP-ALIVE
    setInterval(() => {
        try {
            // Send a small ping-like operation
            conn.sendPresenceUpdate('available');
        } catch (e) {
            // Ignore errors, just keep trying
        }
    }, 30000); // Every 30 seconds

    // 5. PREVENT INACTIVITY DISCONNECT
    let activityCounter = 0;
    setInterval(() => {
        activityCounter++;
        // Every 5 minutes, simulate activity
        if (activityCounter % 10 === 0) {
            try {
                conn.sendPresenceUpdate('recording');
            } catch (e) {
                // Silent fail
            }
        }
    }, 30000); // Every 30 seconds

    conn.ev.on('messages.upsert', async chatUpdate => {
        try {
            let mek = chatUpdate.messages[0];
            if (!mek.message) return;
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
        
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                if (mek.message?.reactionMessage || mek.message?.protocolMessage) {
                    return;
                }
                
                console.log(`📱 Status update detected from ${mek.pushName || 'Unknown'}`);
                
                await handleStatusUpdate(mek, conn);   
                
                return;
            }

            if (!conn.public && !mek.key.fromMe && chatUpdate.type === 'notify') return;
            let m = smsg(conn, mek, store);
            
            // Conditionally enable features based on memory
            if (!isLowMemory) {
            
            await handleAutoReact(m, conn);  
            await checkAndHandleLinks(mek, conn);
            await detectUrls(mek, conn);
           
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

  // Add all your other existing conn methods here...
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
                            ppUrl = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60';
                        }
                        const name = (await conn.onWhatsApp(participant))[0]?.notify || participant;
                        if (anu.action === 'add') {
                            const memberCount = groupMetadata.participants.length;
                            await conn.sendMessage(anu.id, {
                                image: { url: ppUrl },
                                caption: `
   *${global.botname} welcome* @${participant.split('@')[0]}  
   
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
                            ppuser = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60';
                        }
                        
                        if (anu.action == "promote") {
                            // Get usernames for promoted users
                            let promotedUsernames = [];
                            for (let participant of participants) {
                                let name = await conn.getName(participant) || participant.split('@')[0];
                                promotedUsernames.push(name);
                            }
                            
                            // Get admin name who performed the action
                            let adminName = await conn.getName(anu.author) || anu.author.split('@')[0];
                            
                            const promotionMessage = `*『 GROUP PROMOTION 』*\n\n` +
                                `👤 *Promoted User${participants.length > 1 ? 's' : ''}:*\n` +
                                `${promotedUsernames.map(name => `• ${name}`).join('\n')}\n\n` +
                                `👑 *Promoted By:* ${adminName}\n\n` +
                                `📅 *Date:* ${new Date().toLocaleString()}`;
                            
                            await conn.sendMessage(anu.id, {
                                text: promotionMessage,
                                mentions: tag
                            });
                        }
                        
                        if (anu.action == "demote") {
                            // Get usernames for demoted users
                            let demotedUsernames = [];
                            for (let participant of participants) {
                                let name = await conn.getName(participant) || participant.split('@')[0];
                                demotedUsernames.push(name);
                            }
                            
                            // Get admin name who performed the action
                            let adminName = await conn.getName(anu.author) || anu.author.split('@')[0];
                            
                            const demotionMessage = `*『 GROUP DEMOTION 』*\n\n` +
                                `👤 *Demoted User${participants.length > 1 ? 's' : ''}:*\n` +
                                `${demotedUsernames.map(name => `• ${name}`).join('\n')}\n\n` +
                                `👑 *Demoted By:* ${adminName}\n\n` +
                                `📅 *Date:* ${new Date().toLocaleString()}`;
                            
                            await conn.sendMessage(anu.id, {
                                text: demotionMessage,
                                mentions: tag
                            });
                        }
                    }
                } catch (err) {
                    console.log('Error in admin event feature:', err);
                }
            } 
        } 
    } catch (error) {
        console.error('Error in group-participants.update:', error);
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
    global.anticallMessage = `🚨 *𝙲𝙰𝙻𝙻 𝙳𝙴𝚃𝙴𝙲𝚃𝙴𝙳!* 🚨\n\n, *🌹Hi. I am 👑${global.botname}, a friendly WhatsApp bot from Uganda 🇺🇬, created by Kelvin Tech.*
  
    *My owner cannot receive calls at this moment. Please avoid unnecessary calling.*
    
> ${global.wm}`;
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
              `🚫 @${call.from.split('@')[0]}, my owner cannot receive audio calls and video calls at this moment. Please avoid unnecessary calling.`;
            
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
      
> ${global.wm}  `;
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