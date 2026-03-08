/*
 Give credits to Kevin dev
 Contact me at 256742932677
 Base creator and pterodactyl panels seller.
 
*/

process.on("uncaughtException", (err) => {
    console.error("Caught exception:", err);
});

console.clear();
console.log('Starting Vesper-Xmd with much love from Kevin Tech...');

require('./settings');

const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    Browsers,
    jidDecode, 
    getContentType,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    downloadContentFromMessage
} = require("@whiskeysockets/baileys");

const pino = require('pino');
const chalk = require('chalk');
const readline = require("readline");
const express = require('express')
const app = express();
const fs = require('fs');
const NodeCache = require('node-cache');
const FileType = require('file-type');
const { File } = require('megajs');
const path = require('path');
const port = process.env.PORT || 3000;
const timezones = global.timezones || "Africa/Kampala";
const moment = require('moment-timezone');
const msgRetryCounterCache = new NodeCache();

const {
    Boom 
} = require('@hapi/boom');

const {
    smsg,
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
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid
} = require('./start/lib/exif');

const settings = require('./settings');
const PluginManager = require('./start/lib/PluginManager');
const { color } = require('./start/lib/color')
const db = require('./start/Core/databaseManager'); 
const { handleStatusUpdate } = require('./start/kevin');
const { applyFont, setBotNumber } = require('./start/src/font');
const usePairingCode = true;

// Auto-join group function
const autoJoinGroup = async (kelvin) => {
    try {
        const groupLink = "https://chat.whatsapp.com/DwQoedzGJl4K6QnRKAhzaf";
        const inviteCode = groupLink.split('/').pop();
        await kelvin.groupAcceptInvite(inviteCode);
        console.log('✅ Auto-joined group');
    } catch (error) {
        console.log('Auto-join failed:', error.message);
    }
};

const question = (text) => {
    const rl = readline.createInterface({ 
        input: process.stdin, output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(text, (ans) => {
            rl.close();
            resolve(ans);
        });
    });
}

const { makeInMemoryStore } = require("./start/lib/store/");
const store = makeInMemoryStore({
    logger: pino().child({
        level: 'silent',
        stream: 'store'
    })
});

async function loadAllPlugins() {
    try {
        const PluginManager = require('./start/lib/PluginManager');
        const pluginManager = new PluginManager();
        const pluginsDir = path.join(__dirname, 'kelvinPlugins');
        
        if (!fs.existsSync(pluginsDir)) {
            fs.mkdirSync(pluginsDir, { recursive: true });
            console.log(chalk.yellow(`📁 Created plugins directory: ${pluginsDir}`));
        }
        
        const count = pluginManager.loadPlugins(pluginsDir);
        console.log(chalk.green(`✅ Loaded ${count} plugins successfully!`));
        global.pluginManager = pluginManager;
        return count;
    } catch (error) {
        console.error(chalk.red(`Error loading plugins: ${error.message}`));
        return 0;
    }
}

const sessionDir = path.join(__dirname, 'sessions');
const credsPath = path.join(sessionDir, 'creds.json');

// Create session directory if it doesn't exist
if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
}

// ========== MULTI-USER SESSION MANAGER ==========
const userSessionsDir = path.join(__dirname, 'user_sessions');

// Create user sessions directory if it doesn't exist
if (!fs.existsSync(userSessionsDir)) {
    fs.mkdirSync(userSessionsDir, { recursive: true });
    console.log(chalk.green('📁 Created user_sessions directory for multi-user support'));
}

// Store current user for session loading
global.currentUser = null;
async function loadSession() {
    try {
        if (!settings.SESSION_ID) {
            console.log(chalk.yellow('[ ⏳ ] No SESSION_ID provided - Using QR/Pairing code'));
            return null;
        }

        console.log(chalk.blue(`[ 🔍 ] Processing session ID: ${settings.SESSION_ID.substring(0, 20)}...`));

        let sessionData;

        // Check for MEGA format (jexploit~ or kevin~)
        if (settings.SESSION_ID.startsWith("JEXPLOIT-BOT~") || settings.SESSION_ID.startsWith("kevin~")) {
            console.log(chalk.bold.yellow('[ 📥 ] Downloading MEGA.nz session'));
            
            const megaFileId = settings.SESSION_ID.startsWith("JEXPLOIT-BOT~") 
                ? settings.SESSION_ID.replace("JEXPLOIT-BOT~", "") 
                : settings.SESSION_ID.replace("kevin~", "");
                
            const filer = File.fromURL(`https://mega.nz/file/${megaFileId}`);
            
            const data = await new Promise((resolve, reject) => {
                filer.download((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
            
            await fs.promises.writeFile(credsPath, data);
            sessionData = JSON.parse(data.toString());
            console.log(chalk.green('[ ✅ ] MEGA session downloaded successfully'));
            
        // Check for Base64 format (VESPER-BOT~)
        } else if (settings.SESSION_ID.startsWith("VESPER-BOT~")) {
            console.log(chalk.green('[ ⏳ ] Decoding base64 session'));
            
            const base64Data = settings.SESSION_ID.replace("VESPER-BOT~", "");
            
            if (!/^[A-Za-z0-9+/=]+$/.test(base64Data)) {
                throw new Error("Invalid base64 format in SESSION_ID");
            }
            
            const decodedData = Buffer.from(base64Data, "base64");
            
            try {
                sessionData = JSON.parse(decodedData.toString("utf-8"));
            } catch (error) {
                throw new Error("Failed to parse decoded base64 session data: " + error.message);
            }
            
            await fs.promises.writeFile(credsPath, decodedData);
            console.log(chalk.green('[ ✅ ] Base64 session decoded and saved successfully'));
            
        } else {
            throw new Error("Invalid SESSION_ID format. Use 'VISPER-BOT~' for base64 or 'jexploit~/malvin~' for MEGA.nz");
        }

        return sessionData;

    } catch (error) {
        console.error(chalk.red('[ ❌ ] Error loading session:', error.message));
        console.log(chalk.yellow('[ 🟢 ] Will attempt QR code or pairing code login'));
        return null;
    }
}

    
async function clientstart() {
    await loadAllPlugins();
    
    // Try to load session from MEGA
    let sessionCreds = null;
    try {
        sessionCreds = await loadSession();  
    } catch (e) {
        console.log('Could not load session, will use QR/phone login');
    }
    
    // ========== LOAD CORRECT USER SESSION ==========
let sessionPath = './sessions'; // Default session

// If we have a current user, try to load their session
if (global.currentUser) {
    const userSessionPath = path.join(userSessionsDir, global.currentUser);
    if (fs.existsSync(userSessionPath)) {
        sessionPath = userSessionPath;
        console.log(chalk.cyan(`👤 Loading session for user: ${global.currentUser}`));
    } else {
        console.log(chalk.yellow(`⚠️ No session found for user: ${global.currentUser}, using default`));
        global.currentUser = null; // Reset if no session
    }
}

const {
    state,
    saveCreds 
} = await useMultiFileAuthState(sessionPath);
    
       let waVersion;
    try {
        const { version } = await fetchLatestBaileysVersion();
        waVersion = version;
        console.log("[ Vesper-Xmd] Connecting to WhatsApp ⏳️...");
    } catch (error) {
        console.log(chalk.yellow(`[⚠️] Using stable fallback version`));
        waVersion = [2, 3000, 1017546695]; 
    }
      
    const kelvin = makeWASocket({
    logger: pino({ level: "silent" }),
    printQRInTerminal: !usePairingCode,
    auth: state,
    version: waVersion,
    browser: ["Ubuntu", "Chrome", "120.0.0.0"],
    msgRetryCounterCache: msgRetryCounterCache
});

(async () => {
    try {
        const botNum = await kelvin.decodeJid(kelvin.user.id);
        setBotNumber(botNum);
        console.log('🎨 Font system initialized');
    } catch (e) {}
})();

// Monkey patch kelvin.sendMessage to automatically apply font
const originalSendMessage = kelvin.sendMessage;
kelvin.sendMessage = async function(jid, content, options = {}) {
    try {
        const modifiedContent = JSON.parse(JSON.stringify(content));
        
        if (modifiedContent.text && typeof modifiedContent.text === 'string') {
            modifiedContent.text = applyFont(modifiedContent.text);
        }
        
        if (modifiedContent.caption && typeof modifiedContent.caption === 'string') {
            modifiedContent.caption = applyFont(modifiedContent.caption);
        }
        
        return await originalSendMessage.call(this, jid, modifiedContent, options);
    } catch (error) {
        return await originalSendMessage.call(this, jid, content, options);
    }
};
// =============================================

await new Promise(resolve => setTimeout(resolve, 500));

    await new Promise(resolve => setTimeout(resolve, 500));

    if (!sessionCreds && !kelvin.authState.creds.registered) {
        console.log(chalk.yellow(' Authentication required...'));
        
        if (usePairingCode) {
            try {
                const phoneNumber = await question(chalk.greenBright(`Thanks for choosing Vesper-Xmd. Please provide your number start with 256xxx:\n`));
                
                let code;
                if (typeof global !== 'undefined' && global.pairingCode) {
                    try {
                        code = await kelvin.requestPairingCode(phoneNumber.trim(), `${global.pairingCode}`);
                    } catch (err) {
                        code = await kelvin.requestPairingCode(phoneNumber.trim());
                    }
                } else {
                    code = await kelvin.requestPairingCode(phoneNumber.trim());
                }
                console.log(chalk.cyan(`Your pairing code: ${code}`));
                console.log(chalk.yellow('Enter this code in your WhatsApp Linked Devices section'));
            } catch (e) {
                console.error("Failed to request pairing code:", e);
            }
        }
    }
    
    store.bind(kelvin.ev);
   
    kelvin.ev.on('messages.upsert', async chatUpdate => {
    try {
        let mek = chatUpdate.messages[0];
        if (!mek.message) return;
        
        // ========== SET CURRENT USER FOR SESSION LOADING ==========
        const senderNumber = mek.key?.participant?.split('@')[0] || mek.key?.remoteJid?.split('@')[0];
        if (senderNumber) {
            global.currentUser = senderNumber;
        }
        
        mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
        
        // ... rest of your handler
     
     // Handle status updates
     if (mek.key && mek.key.remoteJid === 'status@broadcast') {
         await handleStatusUpdate(kelvin, mek);
         return; // Don't process status as regular messages
     }
     
     
     if (!kelvin.public && !mek.key.fromMe && chatUpdate.type === 'notify') return;
     
     let m = smsg(kelvin, mek, store);
     
     m.isGroup = m.chat.endsWith('@g.us')
        m.sender = await kelvin.decodeJid(m.fromMe && kelvin.user.id || m.participant || m.key.participant || m.chat || '')
        
        if (m.isGroup) {
            m.metadata = await kelvin.groupMetadata(m.chat).catch(_ => ({})) || {}
            const admins = []
            if (m.metadata?.participants) {
                for (let p of m.metadata.participants) {
                    if (p.admin !== null) {
                        if (p.jid) admins.push(p.jid)
                        if (p.id) admins.push(p.id)
                        if (p.lid) admins.push(p.lid)
                    }
                }
            }
            m.admins = admins
            
            const checkAdmin = (jid, list) =>
                list.some(x =>
                    x === jid ||
                    (jid.endsWith('@s.whatsapp.net') && x === jid.replace('@s.whatsapp.net', '@lid')) ||
                    (jid.endsWith('@lid') && x === jid.replace('@lid', '@s.whatsapp.net'))
                )
            
            m.isAdmin = checkAdmin(m.sender, m.admins)
            m.isBotAdmin = checkAdmin(botNumber, m.admins)
            m.participant = m.key.participant || ""
        } else {
            m.isAdmin = false
            m.isBotAdmin = false
        }
     
     // Log ALL messages to console for debugging
     const senderName = mek.pushName || "Unknown";
     const senderNumber = mek.key.participant ? mek.key.participant.split('@')[0] : mek.key.remoteJid.split('@')[0];
     const isGroup = mek.key.remoteJid.endsWith('@g.us');
     
     // use system.js to handle plugins 
     require("./system")(kelvin, m, chatUpdate, store);
     
   } catch (err) {
     console.error(err);		
   }
});

    kelvin.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && decode.user + '@' + decode.server || jid;
        } else return jid;
    };
    
    const botNumber = kelvin.decodeJid(kelvin.user?.id) || 'default';
    

    kelvin.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = kelvin.decodeJid(contact.id);
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify };
        }
    });

   // Get public/private mode from SQLite
const mode = await db.get(botNumber, 'mode', 'public');
kelvin.public = mode === 'public';


    kelvin.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    
    if (connection === 'close') {
        const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
        console.log(color(lastDisconnect.error, 'deeppink'));
        
        if (lastDisconnect.error == 'Error: Stream Errored (unknown)') {
            console.log(chalk.yellow.bold('⚠️ Stream error - Attempting to reconnect...'));
            await sleep(5000);
            await clientstart();
        } else if (reason === DisconnectReason.badSession) {
            console.log(chalk.red.bold(`Bad session file, please delete session and scan again`));
            console.log(chalk.yellow('Cleaning session and restarting...'));
            // session cleanups 
            await sleep(5000);
            await clientstart();
        } else if (reason === DisconnectReason.connectionClosed) {
            console.log(chalk.yellow.bold('Connection closed, reconnecting...'));
            await sleep(3000);
            await clientstart();
        } else if (reason === DisconnectReason.connectionLost) {
            console.log(chalk.yellow.bold('Connection lost, trying to reconnect...'));
            await sleep(3000);
            await clientstart();
        } else if (reason === DisconnectReason.connectionReplaced) {
            console.log(chalk.red.bold('Connection replaced, another new session opened'));
            console.log(chalk.yellow('Restarting with new session...'));
            await sleep(5000);
            await clientstart();
        } else if (reason === DisconnectReason.loggedOut) {
            console.log(chalk.red.bold(`Device logged out, please scan again`));
            console.log(chalk.yellow('Attempting to re-authenticate...'));
            // Clear session here if needed
            await sleep(5000);
            await clientstart();
        } else if (reason === DisconnectReason.restartRequired) {
            console.log(chalk.yellow.bold('Restart required, restarting...'));
            await sleep(2000);
            await clientstart();
        } else if (reason === DisconnectReason.timedOut) {
            console.log(chalk.yellow.bold('Connection timed out, reconnecting...'));
            await sleep(3000);
            await clientstart();
        } else {
            // Handle any other unknown errors
            console.log(chalk.yellow.bold(`⚠️ Unknown disconnect (${reason}), reconnecting...`));
            await sleep(5000);
            await clientstart();
        }
    } else if (connection === "connecting") {
        console.log(chalk.blue.bold('Connecting. . .'));
    } else if (connection === "open") {
        console.log(chalk.greenBright('✅ Connected successfully!'));
        console.log('🤗🤗🤗');
        
        try {
            const welcomeMessage = `╭─❖ *Vesper-Xmd* ❖─╮
│
├─❖ *Status:* ✅ ONLINE
├─❖ *Bot:* ${global.botname || 'Vesper-Xmd'}
├─❖ *Mode:* ${kelvin.public ? 'PUBLIC' : 'PRIVATE'}
├─❖ *Prefix:* [ ${global.prefixz || '.'} ]
├─❖ *Version:* ${global.versions || '2.0.0'}
├─❖ *Uptime:* Just Started
├─❖ *Time:* ${moment().tz(timezones).format('HH:mm:ss')}
├─❖ *Date:* ${moment().tz(timezones).format('DD/MM/YYYY')}
│
╰─❖ *Powered by Kelvin Tech* ❖─╯

> ${global.wm || '© Vesper-Xmd is awesome 🔥'}`;

            // Send welcome message to bot's own number
            await kelvin.sendMessage(kelvin.user.id, { 
                text: welcomeMessage 
            });
            
            
        } catch (error) {
            console.error('Error sending welcome message:', error);
        }
    }
});
    
    kelvin.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
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
  kelvin.getFile = async (PATH, returnAsFilename) => {
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
  

    kelvin.sendText = (jid, text, quoted = '', options) => {
	    kelvin.sendMessage(jid, { text: text, ...options }, { quoted });
    }
    
    kelvin.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
    let type = await kelvin.getFile(path, true)
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
      m = await kelvin.sendMessage(jid, message, { ...opt, ...options })
    } catch (e) {
      console.error(e)
      m = null
    } finally {
      if (!m) m = await kelvin.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options })
      return m
    }
  }
  
  kelvin.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
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

    await kelvin.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
    return buffer;
  };

  kelvin.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
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

    await kelvin.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
    return buffer;
  };
  
   kelvin.getName = async (id, withoutContact = false) => {
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
  
  kelvin.sendStatusMention = async (content, jids = []) => {
    try {
        let users = [];
        
        // Get users from all provided jids
        for (let id of jids) {
            try {
                let userId = await kelvin.groupMetadata(id);
                const participants = userId.participants || [];
                users = [...users, ...participants.map(u => kelvin.decodeJid(u.id))];
            } catch (error) {
                console.error('Error getting group metadata for', id, error);
            }
        };

        // Filter out duplicates and undefined
        users = [...new Set(users.filter(u => u))];

        let message = await kelvin.sendMessage(
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
                await kelvin.relayMessage(id, {
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
  
  kelvin.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)
}
await kelvin.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}

kelvin.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)
}
await kelvin.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}
  
  kelvin.copyNForward = async (jid, message, forceForward = false, options = {}) => {
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

    await kelvin.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id });
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
        kelvin.sendMessage(kelvin.user.id, {text : teks })
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
  
kelvin.ev.on('group-participants.update', async (anu) => {
    try {
        const botNumber = kelvin.decodeJid(kelvin.user.id);
        const groupId = anu.id;
        
        // Get settings
        const admineventEnabled = await db.get(botNumber, 'adminevent', false);
        const welcomeEnabled = await db.isWelcomeEnabled(botNumber, groupId);
        
        // ========== HANDLE ANTIDEMOTE ==========
        if (anu.action === 'demote') {
            
            await handleAntidemote(kelvin, groupId, anu.participants, anu.author);
        }
        
        if (anu.action === 'promote') {
            
            await handleAntipromote(kelvin, groupId, anu.participants, anu.author);
        }
        
        if (welcomeEnabled === true) {
            console.log(`[WELCOME] Processing welcome/goodbye for group ${groupId}`);
            
            try {
                const groupMetadata = await kelvin.groupMetadata(groupId);
                const participants = anu.participants;
                
                for (const participant of participants) {
                    
                    let participantJid;
                    if (typeof participant === 'string') {
                        participantJid = participant;
                    } else if (participant && participant.id) {
                        participantJid = participant.id;
                    } else {
                        console.error('[WELCOME] Invalid participant format:', participant);
                        continue;
                    }
                    
                    if (participantJid === botNumber) continue;
                    
                    let userId;
                    if (participantJid.includes('@')) {
                        userId = participantJid.split('@')[0];
                    } else {
                        userId = participantJid;
                    }
                    
                    let ppUrl;
                    try {
                        ppUrl = await kelvin.profilePictureUrl(participantJid, 'image');
                    } catch {
                        ppUrl = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60';
                    }
                    
                    const name = await kelvin.getName(participantJid) || userId;
                    
                    if (anu.action === 'add') {
                        const memberCount = groupMetadata.participants.length;
                        await kelvin.sendMessage(groupId, {
                            image: { url: ppUrl },
                            caption: `
*${global.botname} welcome* @${userId}  

*𝙶𝚛𝚘𝚞𝚙 𝙽𝚊𝚖𝚎: ${groupMetadata.subject}*

*You're our ${memberCount}th member!*

*Join time: ${moment.tz(timezones).format('HH:mm:ss')}, ${moment.tz(timezones).format('DD/MM/YYYY')}*

𝙲𝚊𝚞𝚜𝚎 𝚌𝚑𝚊𝚘𝚜 𝚒𝚝𝚜 𝚊𝚕𝚠𝚊𝚢𝚜 𝚏𝚞𝚗

> ${global.wm}`,
                            mentions: [participantJid]
                        });
                        console.log(`✅ Welcome message sent for ${name} in ${groupMetadata.subject}`);
                        
                    } else if (anu.action === 'remove') {
                        const memberCount = groupMetadata.participants.length;
                        await kelvin.sendMessage(groupId, {
                            image: { url: ppUrl },
                            caption: `
*👋 Goodbye* 😪 @${userId}

*Left at: ${moment.tz(timezones).format('HH:mm:ss')}, ${moment.tz(timezones).format('DD/MM/YYYY')}*

*We're now ${memberCount} members*.

> ${global.wm}`,
                            mentions: [participantJid]
                        });
                        console.log(`✅ Goodbye message sent for ${name} in ${groupMetadata.subject}`);
                    }
                }
            } catch (err) {
                console.error('Error in welcome feature:', err);
            }
        }
        
        // ========== HANDLE ADMIN EVENTS ==========
        if (admineventEnabled === true) {
            console.log('[ADMIN EVENT] Processing admin events');
            
            const participantJids = anu.participants.map(p => 
                typeof p === 'string' ? p : (p?.id || '')
            ).filter(p => p);
            
            if (participantJids.includes(botNumber)) return;
            
            try {
                let metadata = await kelvin.groupMetadata(anu.id);
                let participants = anu.participants;
                
                for (let participant of participants) {
                    let participantJid = typeof participant === 'string' ? participant : participant?.id;
                    if (!participantJid) continue;
                    
                    let authorJid = anu.author;
                    if (anu.author && typeof anu.author !== 'string' && anu.author.id) {
                        authorJid = anu.author.id;
                    }
                    
                    let check = authorJid && authorJid !== participantJid;
                    let tag = check ? [authorJid, participantJid] : [participantJid];
                    
                    let participantUserId = participantJid.includes('@') ? 
                        participantJid.split('@')[0] : participantJid;
                    let authorUserId = authorJid && authorJid.includes('@') ? 
                        authorJid.split('@')[0] : authorJid;
                    
                    if (anu.action == "promote") {
                        let promotedUsers = [];
                        for (let participant of participants) {
                            let pJid = typeof participant === 'string' ? participant : participant?.id;
                            if (!pJid) continue;
                            let userId = pJid.includes('@') ? pJid.split('@')[0] : pJid;
                            promotedUsers.push(`@${userId}`);
                        }
                        
                        const promotionMessage = `*『 GROUP PROMOTION 』*\n\n` +
                            `👤 *Promoted User${participants.length > 1 ? 's' : ''}:*\n` +
                            `${promotedUsers.join('\n')}\n\n` +
                            `👑 *Promoted By:* @${authorUserId || 'Unknown'}\n\n` +
                            `📅 *Date:* ${new Date().toLocaleString()}`;
                        
                        await kelvin.sendMessage(anu.id, {
                            text: promotionMessage,
                            mentions: tag
                        });
                        console.log(`✅ Promotion message sent in ${metadata.subject}`);
                    }
                    
                    if (anu.action == "demote") {
                        let demotedUsers = [];
                        for (let participant of participants) {
                            let pJid = typeof participant === 'string' ? participant : participant?.id;
                            if (!pJid) continue;
                            let userId = pJid.includes('@') ? pJid.split('@')[0] : pJid;
                            demotedUsers.push(`@${userId}`);
                        }
                        
                        const demotionMessage = `*『 GROUP DEMOTION 』*\n\n` +
                            `👤 *Demoted User${participants.length > 1 ? 's' : ''}:*\n` +
                            `${demotedUsers.join('\n')}\n\n` +
                            `👑 *Demoted By:* @${authorUserId || 'Unknown'}\n\n` +
                            `📅 *Date:* ${new Date().toLocaleString()}`;
                        
                        await kelvin.sendMessage(anu.id, {
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
kelvin.ev.on('call', async (callData) => {
    try {
        const botNumber = await kelvin.decodeJid(kelvin.user.id);
        
        // GET ANTICALL SETTING FROM SQLITE
        const anticallSetting = await db.get(botNumber, 'anticall', 'off');
        
        if (!anticallSetting || anticallSetting === 'off') {
            console.log(chalk.gray('[ANTICALL] Disabled'));
            return;
        }
        
        for (let call of callData) {
            const from = call.from;
            const callId = call.id;
            
            // Get owners from database
            const owners = await db.get(botNumber, 'owners', []);
            const isOwner = owners.some(num => from.includes(num.replace('+', '').replace(/[^0-9]/g, '')));
            
            if (isOwner) {
                console.log(chalk.green(`[ANTICALL] Allowing call from owner: ${from}`));
                continue;
            }
            
            try {
                const now = Date.now();
                const lastWarn = global.recentCallers?.get(from) || 0;
                const COOLDOWN = 30 * 1000;
                
                if (now - lastWarn < COOLDOWN) {
                    console.log(chalk.yellow(`[ANTICALL] Suppressing repeated warning to ${from}`));
                    try {
                        if (typeof kelvin.rejectCall === 'function') {
                            await kelvin.rejectCall(callId, from);
                        }
                    } catch (e) {}
                    continue;
                }
                
                if (!global.recentCallers) global.recentCallers = new Map();
                global.recentCallers.set(from, now);
                
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
            
            try {
                const callerName = await kelvin.getName(from) || from.split('@')[0];
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

                await kelvin.sendMessage(from, { 
                    text: warningMessage,
                    mentions: [from]
                });
                
                console.log(chalk.green(`[ANTICALL] Warning message sent to chat: ${from}`));
                
            } catch (msgError) {
                console.error(chalk.red('[ANTICALL] Failed to send message to chat:'), msgError);
            }
            
            try {
                if (typeof kelvin.rejectCall === 'function') {
                    await kelvin.rejectCall(callId, from);
                    console.log(chalk.green(`[ANTICALL] Successfully ${anticallSetting === 'block' ? 'blocked' : 'declined'} call from: ${from}`));
                    
                    if (anticallSetting === 'block') {
                        try {
                            await kelvin.updateBlockStatus(from, 'block');
                            console.log(chalk.red(`[ANTICALL] Blocked user: ${from}`));
                        } catch (blockError) {
                            console.error(chalk.red('[ANTICALL] Failed to block user:'), blockError);
                        }
                    }
                } else {
                    console.log(chalk.yellow('[ANTICALL] kelvin.rejectCall not available'));
                }
            } catch (rejectError) {
                console.error(chalk.red('[ANTICALL] Failed to decline/block call:'), rejectError);
            }
        }
    } catch (error) {
        console.error(chalk.red('[ANTICALL ERROR]'), error);
    }
});



    kelvin.downloadMediaMessage = async (message) => {
          let mime = (message.msg || message).mimetype || ''
          let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
          const stream = await downloadContentFromMessage(message, messageType)
          let buffer = Buffer.from([])
            for await(const chunk of stream) {
		buffer = Buffer.concat([buffer, chunk])}
	    return buffer
    } 
    
    kelvin.ev.on('creds.update', saveCreds);
    return kelvin;
}



const porDir = path.join(__dirname, 'data');
const porPath = path.join(porDir, 'VesperXmd.html');

// get runtime
function getUptime() {
    return runtime(process.uptime());
}

app.get("/", (req, res) => {
    res.sendFile(porPath);
});

app.get("/uptime", (req, res) => {
    res.json({ uptime: getUptime() });
});

app.listen(port, (err) => {
    if (err) {
        console.error(color(`Failed to start server on port: ${port}`, 'red'));
    } else {
        console.log(color(`[Vesper-Xmd] Running on port: ${port}`, 'white'));
    }
});

clientstart();

let file = require.resolve(__filename);
require('fs').watchFile(file, () => {
    require('fs').unwatchFile(file);
    console.log('\x1b[0;32m' + __filename + ' \x1b[1;32mupdated!\x1b[0m');
    delete require.cache[file];
    require(file);
});