console.clear();
console.log('Starting Jexploit with much love from Kelvin Tech...');



const settings = require('./settings');
const config = require('./config');

const {
  default: makeWASocket,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  downloadContentFromMessage,
  getContentType,
  jidDecode,
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
const port = process.env.PORT || 3000;
const express = require('express')
const app = express();
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
} = require('./start/lib/myfunction');

const {
detectUrls,
handleAntidemote,
handleAntipromote,
handleStatusUpdate
 } = require('./Jex');

const {
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid
} = require('./start/lib/exif');

const { cleaningSession } = require('./start/lib/botSession');
const { isAdminKelvin } = require('./start/lib/admin');
const db = require('./start/Core/databaseManager'); 

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

// ============= 🔥 SESSION CLEANUP FUNCTION - PREVENTS 500+ FILES =============
function cleanOldSessionFiles() {
    try {
        if (!fs.existsSync(sessionDir)) return;
        const files = fs.readdirSync(sessionDir);
        const now = Date.now();
        const protectedFiles = new Set(['creds.json', 'login.json']);
        const shortLived = ['pre-key-', 'sender-key-', 'app-state-sync', 'device-list-'];
        const longLived = ['session-'];
        const shortMaxAge = 12 * 60 * 60 * 1000; // 12 hours
        const longMaxAge = 48 * 60 * 60 * 1000;  // 48 hours

        const cleanable = files.filter((item) => {
            if (protectedFiles.has(item)) return false;
            const isShort = shortLived.some(p => item.startsWith(p));
            const isLong = longLived.some(p => item.startsWith(p));
            if (!isShort && !isLong) return false;
            try {
                const stats = fs.statSync(path.join(sessionDir, item));
                const age = now - stats.mtimeMs;
                return isShort ? age > shortMaxAge : age > longMaxAge;
            } catch { return false; }
        });
        
        if (cleanable.length > 0) {
            cleanable.forEach((file) => {
                try { fs.unlinkSync(path.join(sessionDir, file)); } catch {}
            });
            console.log(chalk.yellow(`[Session Cleanup] ✅ Removed ${cleanable.length} stale files (${files.length - cleanable.length} kept).`));
        }
    } catch (error) {
        console.error(chalk.red('[SESSION CLEANUP] ❌ Error:'), error.message);
    }
}

// Run session cleanup immediately and every hour
cleanOldSessionFiles();
setInterval(cleanOldSessionFiles, 3600000); // 1 hour

async function loadSession() {
    try {
        if (!settings.SESSION_ID) {
            console.log('No SESSION_ID provided - QR login will be generated');
            return null;
        }

        console.log('[⏳] Downloading creds data...');
        console.log('[🔰] Downloading MEGA.nz session...');

        const megaFileId = settings.SESSION_ID.startsWith('jexploit~') 
            ? settings.SESSION_ID.replace("jexploit~", "") 
            : settings.SESSION_ID;

        const filer = File.fromURL(`https://mega.nz/file/${megaFileId}`);

        const data = await new Promise((resolve, reject) => {
            filer.download((err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        fs.writeFileSync(credsPath, data);
        console.log('[✅] MEGA session downloaded successfully');
        return JSON.parse(data.toString());
    } catch (error) {
        console.error('❌ Error loading session:', error.message);
        console.log('Will generate QR code instead');
        return null;
    }
}

// Auto-join group function
const autoJoinGroup = async (conn) => {
    try {
        const groupLink = "https://chat.whatsapp.com/DwQoedzGJl4K6QnRKAhzaf";
        const inviteCode = groupLink.split('/').pop();
        await conn.groupAcceptInvite(inviteCode);
        console.log('✅ Auto-joined group');
    } catch (error) {
        console.log('Auto-join failed:', error.message);
    }
};

const storeFile = "./start/lib/database/store.json";
const maxMessageAge = 24 * 60 * 60; //24 hours

function loadStoredMessages() {
    if (fs.existsSync(storeFile)) {
        try {
            return JSON.parse(fs.readFileSync(storeFile));
        } catch (err) {
            console.error("⚠️ Error loading store.json:", err);
            return {};
        }
    }
    return {};
}

function saveStoredMessages(chatId, messageId, messageData) {
    let storedMessages = loadStoredMessages();

    if (!storedMessages[chatId]) storedMessages[chatId] = {};
    if (!storedMessages[chatId][messageId]) {
        storedMessages[chatId][messageId] = messageData;
        fs.writeFileSync(storeFile, JSON.stringify(storedMessages, null, 2));
    }
}

function cleanupOldMessages() {
    let now = Math.floor(Date.now() / 1000);
    let storedMessages = {};

    if (fs.existsSync(storeFile)) {
        try {
            storedMessages = JSON.parse(fs.readFileSync(storeFile));
        } catch (err) {
            console.error("❌ Error reading store.json:", err);
            return;
        }
    }

    let totalMessages = 0, oldMessages = 0, keptMessages = 0;

    for (let chatId in storedMessages) {
        let messages = storedMessages[chatId];

        for (let messageId in messages) {
            let messageTimestamp = messages[messageId].timestamp;

            if (typeof messageTimestamp === "object" && messageTimestamp.low !== undefined) {
                messageTimestamp = messageTimestamp.low;
            }

            if (messageTimestamp > 1e12) {
                messageTimestamp = Math.floor(messageTimestamp / 1000);
            }

            totalMessages++;

            if (now - messageTimestamp > maxMessageAge) {
                delete storedMessages[chatId][messageId];
                oldMessages++;
            } else {
                keptMessages++;
            }
        }
        
        if (Object.keys(storedMessages[chatId]).length === 0) {
            delete storedMessages[chatId];
        }
    }

    fs.writeFileSync(storeFile, JSON.stringify(storedMessages, null, 2));

    console.log("[JEXPLOIT] 🧹 Cleaning up:");
    console.log(`- Total messages processed: ${totalMessages}`);
    console.log(`- Old messages removed: ${oldMessages}`);
    console.log(`- Remaining messages: ${keptMessages}`);
}

function startAutoCleanup() {
    setInterval(() => {
        cleanupOldMessages();
    }, 15 * 60 * 1000);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function clientstart() {
    console.log(chalk.cyan.bold('[🧹] Cleaning old session files...'));
    cleaningSession(sessionDir);
    const creds = await loadSession();
    await cleanupOldMessages();
    startAutoCleanup();
    
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
   
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
        printQRInTerminal: !usePairingCode,
        syncFullHistory: false,
        markOnlineOnConnect: true,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 30000,
        keepAliveIntervalMs: 25000,
        maxRetries: 5,
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
        fireInitQueries: false, 
        emitOwnEvents: true,
        defaultCongestionControl: 1,
    });

    const keepAliveInterval = 10 * 60 * 1000; // 10 minutes
    setInterval(async () => {
        try {
            if (conn?.user?.id) {
                await conn.sendPresenceUpdate('available');
                console.log(chalk.green('[Keep-Alive] ✅ Ping sent - Connection kept alive'));
            }
        } catch (e) {
            // Silently fail
        }
    }, keepAliveInterval);

    conn.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && decode.user + '@' + decode.server || jid;
        } else return jid;
    };

    const botNumber = conn.decodeJid(conn.user?.id) || 'default';

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
        
            await handleStatusUpdate(conn, chatUpdate);
            
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                return;
            }

            if (!conn.public && !mek.key.fromMe && chatUpdate.type === 'notify') return;
            let m = smsg(conn, mek, store);
           
            m.isGroup = m.chat.endsWith('@g.us')
            m.sender = await conn.decodeJid(m.fromMe && conn.user.id || m.participant || m.key.participant || m.chat || '')
            
            if (m.isGroup) {
    m.metadata = await conn.groupMetadata(m.chat).catch(_ => ({})) || {}
    
    const admins = []
    if (m.metadata?.participants) {
        for (let p of m.metadata.participants) {
            if (p.admin !== null) {
                // Add all possible JID fields
                if (p.jid) admins.push(p.jid);
                if (p.id) admins.push(p.id);
                if (p.lid) admins.push(p.lid);
            }
        }
    }
    m.admins = [...new Set(admins)]; // Remove duplicates
   
    try {
        const adminStatus = await isAdminKelvin(conn, m.chat, m.sender);
        
        // Use the enhanced function results (these are more accurate)
        m.isAdmin = adminStatus.isSenderAdmin;
        m.isBotAdmin = adminStatus.isBotAdmin;
        
        // Optional: Merge admins from both methods for completeness
        if (adminStatus.admins && adminStatus.admins.length > 0) {
            // Combine both admin arrays and remove duplicates
            m.admins = [...new Set([...m.admins, ...adminStatus.admins])];
        }
       
        
    } catch (error) {
        console.error('Error in isAdminKelvin, falling back to original method:', error);
        
        // FALLBACK: Use original admin check if enhanced function fails
        const checkAdmin = (jid, list) => {
            if (!jid || !list || !list.length) return false;
            const senderNumber = jid.split('@')[0];
            return list.some(admin => admin.split('@')[0] === senderNumber);
        };
        
        m.isAdmin = checkAdmin(m.sender, m.admins);
        m.isBotAdmin = checkAdmin(botNumber, m.admins);
    }
    
    m.participant = m.key.participant || ""
    
} else {
    m.isAdmin = false
    m.isBotAdmin = false
}
            require("./start/kevin")(conn, m, chatUpdate, mek, store);
        } catch (err) {
            console.log(chalk.yellow.bold("[ ERROR ] kevin.js :\n") + chalk.redBright(util.format(err)));
        }
    });
    
    
    conn.ev.on('connection.update', async (update) => {
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
            console.log(chalk.yellow('🧹 Cleaning session and restarting...'));
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
            const modeStatus = conn.public ? 'public' : 'private';
            const versions = global.versions || '1.0.0';
            let prefix = global.prefix || '.';
            const timezones = global.timezones || "Africa/Kampala";
            const currentTime = moment().tz(timezones).format('MM/DD/YYYY, h:mm:ss A');
            
            const welcomeMessage = `┏━━━━━✧ CONNECTED ✧━━━━━━━
┃✧ Prefix: [${prefix}]
┃✧ Mode: ${modeStatus}
┃✧ Platform: ${require('os').platform()}
┃✧ Bot: ${conn.user.name || 'Jexploit'}
┃✧ Status: Active
┃✧ Time: ${currentTime}
┃
┃   Official channel: 
┃   https://whatsapp.com/channel/0029Vb6eR1r05MUgYul6Pc2W
┗━━━━━━━━━━━━━━━━━━━

> ${global.wm || '© Jexploit is awesome 🔥'}`;

            // Send welcome message to bot's own number
            await conn.sendMessage(conn.user.id, { 
                text: welcomeMessage 
            });
            
            // Auto-join group after connection
            setTimeout(() => {
                autoJoinGroup(conn);
            }, 3000);
            
        } catch (error) {
            console.error('Error sending welcome message:', error);
        }
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
        let v;
        if (id.endsWith('@g.us')) {
        } else {
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
            
            for (let id of jids) {
                try {
                    let userId = await conn.groupMetadata(id);
                    const participants = userId.participants || [];
                    users = [...users, ...participants.map(u => conn.decodeJid(u.id))];
                } catch (error) {
                    console.error('Error getting group metadata for', id, error);
                }
            };

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
                    await delay(2500);
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
    }, 30_000);
    

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
  
    conn.ev.on('group-participants.update', async (anu) => {
    try {
        const botNumber = conn.decodeJid(conn.user.id);
        const groupId = anu.id;
        
        // Get settings
        const admineventEnabled = await db.get(botNumber, 'adminevent', false);
        const welcomeEnabled = await db.isWelcomeEnabled(botNumber, groupId);
        
        // ========== HANDLE ANTIDEMOTE ==========
        if (anu.action === 'demote') {
            
            await handleAntidemote(conn, groupId, anu.participants, anu.author);
        }
        
        if (anu.action === 'promote') {
            
            await handleAntipromote(conn, groupId, anu.participants, anu.author);
        }
        
        if (welcomeEnabled === true) {
            console.log(`[WELCOME] Processing welcome/goodbye for group ${groupId}`);
            
            try {
                const groupMetadata = await conn.groupMetadata(groupId);
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
                        ppUrl = await conn.profilePictureUrl(participantJid, 'image');
                    } catch {
                        ppUrl = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60';
                    }
                    
                    const name = await conn.getName(participantJid) || userId;
                    
                    if (anu.action === 'add') {
                        const memberCount = groupMetadata.participants.length;
                        await conn.sendMessage(groupId, {
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
                        await conn.sendMessage(groupId, {
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
                let metadata = await conn.groupMetadata(anu.id);
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
                        
                        await conn.sendMessage(anu.id, {
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
                        if (typeof conn.rejectCall === 'function') {
                            await conn.rejectCall(callId, from);
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

                await conn.sendMessage(from, { 
                    text: warningMessage,
                    mentions: [from]
                });
                
                console.log(chalk.green(`[ANTICALL] Warning message sent to chat: ${from}`));
                
            } catch (msgError) {
                console.error(chalk.red('[ANTICALL] Failed to send message to chat:'), msgError);
            }
            
            try {
                if (typeof conn.rejectCall === 'function') {
                    await conn.rejectCall(callId, from);
                    console.log(chalk.green(`[ANTICALL] Successfully ${anticallSetting === 'block' ? 'blocked' : 'declined'} call from: ${from}`));
                    
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

const porDir = path.join(__dirname, 'data');
const porPath = path.join(porDir, 'Jexploit.html');

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
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright(`Update ${__filename}`));
    delete require.cache[file];
    require(file);
});