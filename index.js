console.clear();
console.log('Starting Vinic-Xmd with Enhanced Longevity...');
// Environment detection for cloud optimization
const isProduction = process.env.NODE_ENV === 'production';
const isLowMemory = process.env.MEMORY_LIMIT < 512 || isProduction;
const chalk = require('chalk');

// Optimize memory usage
if (isLowMemory) {
  console.log(chalk.yellow('🚀 Running in optimized mode for cloud/low memory environment'));
}

const settings = require('./settings');
const config = require('./setting/config');

// Enhanced error handling for cloud stability
process.on("uncaughtException", (error) => {
  console.error(chalk.red('Uncaught Exception:'), error);
  // Don't exit in cloud environments
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('Unhandled Rejection at:'), promise, chalk.red('reason:'), reason);
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
const db = require('./start/KelvinCmds/core/databases');

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
checkAndHandleLinks,
detectUrls,
handleStatusUpdate
 } = require('./vinic');

const {
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid
} = require('./start/lib/exif');

// Initialize database
if (!global.db) {
    try {
        initializeDatabase();
        console.log(chalk.yellow('✅ Database initialized successfully'));
        
        const { loadAllSettings, loadAllGroupSettings } = require('./start/KelvinCmds/core/databases');
        loadAllSettings(); // Load bot settings
        loadAllGroupSettings(); // Load group settings
        
    } catch (error) {
        console.error(chalk.red('❌ Database initialization failed:'), error);
        
        global.db = {
            data: {
                settings: {},
                users: {},
                chats: {},
                groups: {} 
            },
            saveSettings: (botNumber, config) => {
                if (!global.db.data.settings[botNumber]) {
                    global.db.data.settings[botNumber] = {};
                }
                global.db.data.settings[botNumber] = config;
            },
            getSettings: (botNumber) => {
                return global.db.data.settings[botNumber] || {};
            },
            saveGroupSettings: (groupJid, settings) => {
                if (!global.db.data.groups) global.db.data.groups = {};
                global.db.data.groups[groupJid] = settings;
            },
            getGroupSettings: (groupJid) => {
                if (!global.db.data.groups) global.db.data.groups = {};
                return global.db.data.groups[groupJid] || {};
            }
        };
    }
}

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
            console.warn(chalk.yellow("[ ⏳ ] No SESSION_ID provided - Falling back to QR or pairing code"));
            return null;
        }
        
        console.log(chalk.blue("[ 📥 ] Fetching session from server..."));
        const response = await fetch(`https://vinic-xmd-pairing-site-dsf-crew-devs.onrender.com/session?session=${settings.SESSION_ID}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const sessionData = await response.json();
        console.log("[VINIC-XMD] Session data fetched successfully from server");
        return sessionData;
        
    } catch (error) {
        console.error(chalk.red("[ ❌ ] Error fetching session from server:"), error.message);
        console.info(chalk.yellow("[ 😑 ] Will attempt pairing code login"));
        return null;
    }
}

function initSession(sessionData) {
    if (!sessionData) {
        console.log(chalk.yellow('No session data from server'));
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
        
        console.log('[VINIC-XMD] Session decrypted and saved successfully');
        return data;
        
    } catch (error) {
        console.error(chalk.red('[ ❌ ] Error decrypting session:'), error.message);
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
        console.log(chalk.blue(`🧹 Cleaned up ${deletedCount} temporary files`));
      }
    }
  } catch (error) {
    console.log(chalk.yellow('Cleanup error:'), error.message);
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
      console.warn(chalk.yellow('⚠️ High memory usage:'), memoryUsage);
      if (global.gc) {
        global.gc();
        console.log(chalk.blue('🗑️ Garbage collection triggered'));
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
        console.log("[ VINIC-XMD] Connecting to WhatsApp ⏳️...");
        
    } catch (error) {
        console.log(chalk.blue(`[⚠️] Using stable fallback version`));
        waVersion = [2, 3000, 1017546695];
    }

    // OPTIMIZED CONNECTION FOR LONG-LIVED STABILITY
    const conn = makeWASocket({
        // Critical stability settings
        printQRInTerminal: !decryptedSession,
        syncFullHistory: false, // Disable to save memory
        markOnlineOnConnect: true,
        
        // Extended timeouts for server stability
        connectTimeoutMs: 120000, // 2 minutes
        defaultQueryTimeoutMs: 60000, // 1 minute
        keepAliveIntervalMs: 30000, // 30 seconds
        maxRetries: 10,
        
        // Disable heavy features
        generateHighQualityLinkPreview: false,
        linkPreviewImageThumbnailWidth: 64, // Smaller thumbnails
        
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
    
    const { makeInMemoryStore } = require("./start/lib/store/");
    const store = makeInMemoryStore({
        logger: pino().child({
            level: 'silent',
            stream: 'store'
        })
    });
    
    store.bind(conn.ev);

    const MAX_RECONNECT_ATTEMPTS = 50; // Much higher limit
    
    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (connection === 'close') {
            const shouldReconnect = 
                lastDisconnect?.error?.output?.statusCode !== 401; // Logged out
            
            if (shouldReconnect) {
                console.log(chalk.yellow(`🔁 Reconnection in progress...`));
                
                setTimeout(clientstart, 5000);
            } else {
                console.log(chalk.red('❌ Max reconnection attempts reached or logged out'));
            }
        }
        
        if (connection === 'open') {
            console.log(' [VINIC-XMD] Connection stabilized ');
            
            // Send periodic presence updates to stay active
            setInterval(() => {
                try {
                    conn.sendPresenceUpdate('available');
                } catch (e) {
                    // Silent fail
                }
            }, 60000); // Every minute
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
            console.log(chalk.yellow('Auto-save skipped:'), error.message);
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
                
                console.log(chalk.blue(`📱 Status update detected from ${mek.pushName || 'Unknown'}`));
                
                await handleStatusUpdate(mek, conn);   
                
                return;
            }

            if (!conn.public && !mek.key.fromMe && chatUpdate.type === 'notify') return;
            let m = smsg(conn, mek, store);
            
            // Conditionally enable features based on memory
            if (!isLowMemory) {
            
            
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
        
        // Get welcome setting from database
        const settings = global.db.getSettings(botNumber);
        const welcomeSetting = settings?.welcome || false;
        const admineventSetting = settings?.adminevent || false;
        
        // WELCOME FEATURE
        if (welcomeSetting) {
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
        if (admineventSetting) {
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
    } catch (error) {
        console.error('Error in group-participants.update:', error);
    }
});

  // Initialize global variables for anticall feature
if (!global.recentCallers) {
  global.recentCallers = new Map();
}

// Anticall handler with clear messages
conn.ev.on('call', async (callData) => {
  try {
    const botNumber = await conn.decodeJid(conn.user.id);
    const config = global.db.data.settings[botNumber]?.config;
    
    // Check if anticall is enabled from database
    if (!config || !config.anticall) {
      console.log(chalk.blue('[ANTICALL] Anticall is disabled in database'));
      return;
    }
    
    for (let call of callData) {
      const from = call.from;
      const callerNumber = from.split('@')[0];
      const callId = call.id;
      
      // Check if caller is owner
      if (Array.isArray(global.ownernumber) && global.ownernumber.includes(callerNumber)) {
        console.log(chalk.green(`[ANTICALL] ✅ Allowing call from owner: ${from}`));
        continue;
      }
      
      // Cooldown check
      const now = Date.now();
      const lastWarn = global.recentCallers.get(from) || 0;
      const COOLDOWN = 30 * 1000; // 30 seconds cooldown per caller
      
      if (now - lastWarn < COOLDOWN) {
        console.log(chalk.yellow(`[ANTICALL] ⏳ Suppressing repeated warning to ${from} (in cooldown)`));
        continue;
      }
      
      global.recentCallers.set(from, now);
      setTimeout(() => global.recentCallers.delete(from), COOLDOWN);
      
      console.log(chalk.yellow(`[ANTICALL] 🚨 Call detected from: ${from} | Mode: ${config.anticall}`));
      
      // Handle based on anticall mode from database
      if (config.anticall === "decline") {
        await handleDeclineMode(from, callerNumber, callId, conn);
      } else if (config.anticall === "block") {
        await handleBlockMode(from, callerNumber, callId, conn);
      } else if (config.anticall === "decline_block") {
        await handleDeclineAndBlockMode(from, callerNumber, callId, conn);
      }
    }
  } catch (error) {
    console.error(chalk.red('[ANTICALL ERROR] ❌'), error);
  }
});

// Handle Decline Mode
async function handleDeclineMode(from, callerNumber, callId, conn) {
  try {
    // Message to caller
    const callerMessage = `🚫 *Call Declined*\n\n` +
      `Dear @${callerNumber},\n\n` +
      `*${global.botname}* is an automated WhatsApp bot and cannot receive calls.\n\n` +
      `📞 *Call Type:* ${getCallType(callId)}\n` +
      `⏰ *Time:* ${new Date().toLocaleString()}\n\n` +
      `Please contact my owner via text message instead.\n\n` +
      `> ${global.wm}`;

    // Message to bot owner
    const ownerMessage = `📞 *Call Declined Notification*\n\n` +
      `👤 *Caller:* @${callerNumber}\n` +
      `📞 *Call Type:* ${getCallType(callId)}\n` +
      `⏰ *Time:* ${new Date().toLocaleString()}\n` +
      `🛡️ *Action:* Call was automatically declined\n\n` +
      `The caller has been notified that this is a bot account.`;

    // Send message to caller
    await conn.sendMessage(from, { 
      text: callerMessage,
      mentions: [from]
    });
    console.log(chalk.green(`[ANTICALL] 📩 Decline message sent to caller: ${from}`));

    // Send notification to all owners
    if (global.ownernumber && Array.isArray(global.ownernumber)) {
      for (let owner of global.ownernumber) {
        const ownerJid = owner.includes('@s.whatsapp.net') ? owner : owner + '@s.whatsapp.net';
        await conn.sendMessage(ownerJid, { 
          text: ownerMessage,
          mentions: [from]
        });
      }
      console.log(chalk.green(`[ANTICALL] 📨 Owner notified about declined call from: ${from}`));
    }

    // Decline the call
    if (typeof conn.rejectCall === 'function') {
      await conn.rejectCall(callId, from);
      console.log(chalk.green(`[ANTICALL] ✅ Successfully declined call from: ${from}`));
    }

  } catch (error) {
    console.error(chalk.red('[ANTICALL DECLINE ERROR] ❌'), error);
  }
}

// Handle Block Mode
async function handleBlockMode(from, callerNumber, callId, conn) {
  try {
    // Message to caller before blocking
    const blockMessage = `🚫 *Account Blocked*\n\n` +
      `Dear @${callerNumber},\n\n` +
      `You have been *blocked* for calling *${global.botname}*.\n\n` +
      `📞 *Call Type:* ${getCallType(callId)}\n` +
      `⏰ *Time:* ${new Date().toLocaleString()}\n` +
      `🛡️ *Reason:* Unauthorized call to bot account\n\n` +
      `This bot does not accept calls. Repeated calling violations may result in permanent blocking.\n\n` +
      `> ${global.wm}`;

    // Message to bot owner
    const ownerMessage = `📞 *Call Blocked Notification*\n\n` +
      `👤 *Caller:* @${callerNumber}\n` +
      `📞 *Call Type:* ${getCallType(callId)}\n` +
      `⏰ *Time:* ${new Date().toLocaleString()}\n` +
      `🛡️ *Action:* Caller has been BLOCKED\n\n` +
      `The caller has been blocked for attempting to call the bot.`;

    // Send message to caller first
    await conn.sendMessage(from, { 
      text: blockMessage,
      mentions: [from]
    });
    console.log(chalk.green(`[ANTICALL] 📩 Block warning sent to: ${from}`));

    // Wait a moment to ensure message is delivered
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Block the user
    await conn.updateBlockStatus(from, "block");
    console.log(chalk.green(`[ANTICALL] ✅ Successfully blocked caller: ${from}`));

    // Notify owners
    if (global.ownernumber && Array.isArray(global.ownernumber)) {
      for (let owner of global.ownernumber) {
        const ownerJid = owner.includes('@s.whatsapp.net') ? owner : owner + '@s.whatsapp.net';
        await conn.sendMessage(ownerJid, { 
          text: ownerMessage,
          mentions: [from]
        });
      }
      console.log(chalk.green(`[ANTICALL] 📨 Owner notified about blocked caller: ${from}`));
    }

  } catch (error) {
    console.error(chalk.red('[ANTICALL BLOCK ERROR] ❌'), error);
  }
}

// Handle Decline and Block Mode
async function handleDeclineAndBlockMode(from, callerNumber, callId, conn) {
  try {
    // Message to caller
    const callerMessage = `🚫 *Call Declined & Account Blocked*\n\n` +
      `Dear @${callerNumber},\n\n` +
      `Your call has been *declined* and your number has been *blocked*.\n\n` +
      `📞 *Call Type:* ${getCallType(callId)}\n` +
      `⏰ *Time:* ${new Date().toLocaleString()}\n` +
      `🛡️ *Action:* Call declined + Account blocked\n\n` +
      `*${global.botname}* is an automated bot and does not accept calls.\n\n` +
      `> ${global.wm}`;

    // Message to bot owner
    const ownerMessage = `📞 *Call Declined & Blocked Notification*\n\n` +
      `👤 *Caller:* @${callerNumber}\n` +
      `📞 *Call Type:* ${getCallType(callId)}\n` +
      `⏰ *Time:* ${new Date().toLocaleString()}\n` +
      `🛡️ *Action:* Call declined + Caller BLOCKED\n\n` +
      `The caller has been blocked for attempting to call the bot.`;

    // Send message to caller
    await conn.sendMessage(from, { 
      text: callerMessage,
      mentions: [from]
    });
    console.log(chalk.green(`[ANTICALL] 📩 Decline+Block message sent to: ${from}`));

    // Decline the call first
    if (typeof conn.rejectCall === 'function') {
      await conn.rejectCall(callId, from);
      console.log(chalk.green(`[ANTICALL] ✅ Call declined from: ${from}`));
    }

    // Wait a moment then block
    await new Promise(resolve => setTimeout(resolve, 1000));
    await conn.updateBlockStatus(from, "block");
    console.log(chalk.green(`[ANTICALL] ✅ Caller blocked: ${from}`));

    // Notify owners
    if (global.ownernumber && Array.isArray(global.ownernumber)) {
      for (let owner of global.ownernumber) {
        const ownerJid = owner.includes('@s.whatsapp.net') ? owner : owner + '@s.whatsapp.net';
        await conn.sendMessage(ownerJid, { 
          text: ownerMessage,
          mentions: [from]
        });
      }
      console.log(chalk.green(`[ANTICALL] 📨 Owner notified about decline+block: ${from}`));
    }

  } catch (error) {
    console.error(chalk.red('[ANTICALL DECLINE+BLOCK ERROR] ❌'), error);
  }
}

// Helper function to get call type
function getCallType(callId) {
  // This is a simplified version - you might need to detect call type from call data
  return "Voice/Video Call";
}

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