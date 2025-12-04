/*

  -! Credits By Voyage tech 
  Thanks to caltech 
  https://wa.me/256760672406

*/


console.clear();
console.log('starting...');
require('../setting/config');
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
makeInMemoryStore,
getContentType,
jidDecode,
MessageRetryMap,
getAggregateVotesInPollMessage,
proto,
delay
} = require("@whiskeysockets/baileys")

const pino = require('pino');
const readline = require("readline");
const fs = require('fs');
const chalk = require('chalk')
const _ = require('lodash')
const util = require('util')
const fetch = require('node-fetch')
const FileType = require('file-type');
const { Boom } = require('@hapi/boom');
const NodeCache = require("node-cache");
const PhoneNumber = require('awesome-phonenumber');
const msgRetryCounterCache = new NodeCache()
const retryCache = new NodeCache({ stdTTL: 30, checkperiod: 20 })
const sendCache= new NodeCache({ stdTTL: 30, checkperiod: 20 })
const { color } = require('./lib/color');
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
} = require('./lib/myfunction');

const { 
imageToWebp,
videoToWebp,
writeExifImg,
writeExifVid 
} = require('./lib/exif')

const usePairingCode = true;

const question = (text) => {
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});
return new Promise((resolve) => {
rl.question(text, resolve)
})
};

const yargs = require('yargs/yargs');

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())

const jadibot = async (conn, m, from) => {
conn.client = conn.client ? conn.client : {}
const {
state,
saveCreds
} = await useMultiFileAuthState(`./start/lib/database/jadibot/${m.sender.split("@")[0]}`)
conn.client[from] = makeWASocket({
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
version: (await (await fetch('https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/baileys-version.json')).json()).version,
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
if (!conn.client[from].authState.creds.registered) {
setTimeout(async () => {
const code = await conn.client[from].requestPairingCode(m.sender.split("@")[0])
let teks = `${code}`
m.reply(teks)
}, 3000)
}

 const store = makeInMemoryStore({
logger: pino().child({
level: 'silent',
stream: 'store'
})
})

store.bind(conn.client[from].ev);

conn.client[from].ev.on('messages.upsert', async chatUpdate => {
try {
let mek = chatUpdate.messages[0]
if (!mek.message) return
mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (mek.key && mek.key.remoteJid === 'status@broadcast') return
let m = smsg(conn.client[from], mek, store)
require("./system")(conn.client[from], m, chatUpdate, mek, store)
} catch (err) {
console.log(chalk.yellow.bold("[ ERROR ] system.js :\n") + chalk.redBright(util.format(err)))
}
})


conn.client[from].ev.on("connection.update", async (update) => {
const {
connection,
lastDisconnect
} = update;
if (connection === "close") {
let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
if (reason === DisconnectReason.badSession) {
conn.sendMessage(m.chat, { text: `Kesalahan Pada Sessions, Hapus Sessions Dan Coba Lagi...` })
stopjadibot(conn, m, from)
} else if (reason === DisconnectReason.connectionClosed) {
conn.sendMessage(m.chat, { text: "Koneksi Ditutup, Menghubungkan Ulang...." })
jadibot(conn, m, from)
} else if (reason === DisconnectReason.connectionLost) {
conn.sendMessage(m.chat, { text: "Koneksi Hilang dari Server, Menghubungkan Ulang..." })
jadibot(conn, m, from)
} else if (reason === DisconnectReason.connectionReplaced) {
conn.sendMessage(m.chat, { text: "Sessions Terkoneksi Dengan Server Lain, Please Restart Bot." })
stopjadibot(conn, m, from)
} else if (reason === DisconnectReason.loggedOut) {
conn.sendMessage(m.chat, { text: `Perangkat Keluar, Silakan Hapus Sesi Folder dan Pindai Lagi.` })
stopjadibot(conn, m, from)
} else if (reason === DisconnectReason.restartRequired) {
conn.sendMessage(m.chat, { text: "Memuat Ulang Koneksi, Mulai Ulang..." })
jadibot(conn, m, from)
} else if (reason === DisconnectReason.timedOut) {
conn.sendMessage(m.chat, { text: "Waktu Koneksi Habis, Menyambungkan Kembali..." })
jadibot(conn, m, from)
} else {
console.log(`Unknown DisconnectReason: ${reason}|${connection}`);
jadibot(conn, m, from)
}
} else if (connection === "open") {
console.log('Connected...', update)
}
});


conn.client[from].decodeJid = (jid) => {
if (!jid) return jid;
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {};
return decode.user && decode.server && decode.user + '@' + decode.server || jid;
} else return jid;
};

conn.client[from].ev.on('contacts.update', update => {
for (let contact of update) {
let id = conn.client[from].decodeJid(contact.id);
if (store && store.contacts) store.contacts[id] = { id, name: contact.notify };
}
});

conn.client[from].sendTextWithMentions = async (jid, text, quoted, options = {}) =>
conn.client[from].sendMessage(jid, { 
text: text,
contextInfo: {
mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(
(v) => v[1] + "@s.whatsapp.net",
),
},
...options,
},
{ quoted },
);

conn.client[from].sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path)
? path
: /^data:.*?\/.*?;base64,/i.test(path)
? Buffer.from(path.split`, `[1], 'base64')
: /^https?:\/\//.test(path)
? await (await getBuffer(path))
: fs.existsSync(path)
? fs.readFileSync(path)
: Buffer.alloc(0);

let buffer;
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options);
} else {
buffer = await imageToWebp(buff);
}

await conn.client[from].sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
return buffer;
};

conn.client[from].sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path)
? path
: /^data:.*?\/.*?;base64,/i.test(path)
? Buffer.from(path.split`, `[1], 'base64')
: /^https?:\/\//.test(path)
? await (await getBuffer(path))
: fs.existsSync(path)
? fs.readFileSync(path)
: Buffer.alloc(0);

let buffer;
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options);
} else {
buffer = await videoToWebp(buff);
}

await conn.client[from].sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
return buffer;
};

conn.client[from].downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
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
let trueFileName = attachExtension ? filename + "." + type.ext : filename;
await fs.writeFileSync(trueFileName, buffer);

return trueFileName;
};

conn.client[from].getName = (jid, withoutContact = false) => {
let id = conn.client[from].decodeJid(jid);
withoutContact = conn.client[from].withoutContact || withoutContact;
let v;
if (id.endsWith("@g.us"))
return new Promise(async (resolve) => {
v = store.contacts[id] || {};
if (!(v.name || v.subject)) v = conn.client[from].groupMetadata(id) || {};
resolve(
v.name ||
v.subject ||
PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber(
"international",
),
);
});
else
v =
id === "0@s.whatsapp.net"
? {
id,
name: "WhatsApp",
}
: id === conn.client[from].decodeJid(conn.client[from].user.id)
? conn.client[from].user
: store.contacts[id] || {};
return (
(withoutContact ? "" : v.name) ||
v.subject ||
v.verifiedName ||
PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber(
"international",
)
);
};

conn.client[from].sendContact = async (jid, kon, quoted = '', opts = {}) => {
let list = []
for (let i of kon) {
list.push({
displayName: await conn.client[from].getName(i),
vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await conn.client[from].getName(i)}\nFN:${await conn.client[from].getName(i)}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:jangan spam bang\nitem2.EMAIL;type=INTERNET:kyuurzy\nitem2.X-ABLabel:YouTube\nitem3.URL:kyuurzy.tech\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
})
}
conn.client[from].sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted })
}

conn.client[from].copyNForward = async (jid, message, forceForward = false, options = {}) => {
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

await conn.client[from].relayMessage(jid, waMessage.message, { messageId: waMessage.key.id });
return waMessage;
};

function getTypeMessage(message) {
const type = Object.keys(message)
var restype = (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(type[0]) && type[0]) ||
(type.length >= 3 && type[1] !== 'messageContextInfo' && type[1]) || 
type[type.length - 1] || Object.keys(message)[0]
return restype
}

const uploadFile = {
upload: conn.client[from].waUploadToServer
};
conn.client[from].prefa = 'hah?'
conn.client[from].public = global.status;
conn.client[from].serializeM = (m) => smsg(conn.client[from], m, store)

conn.client[from].ev.on('group-participants.update', async (anu) => {
if (global.welcome) {
console.log(anu)
let botNumber = await conn.client[from].decodeJid(conn.client[from].user.id)
if (anu.participants.includes(botNumber)) return
try {
let metadata = await conn.client[from].groupMetadata(anu.id)
let namagc = metadata.subject
let participants = anu.participants
for (let num of participants) {
let check = anu.author !== num && anu.author.length > 1
let tag = check ? [anu.author, num] : [num]
try {
ppuser = await conn.client[from].profilePictureUrl(num, 'image')
} catch {
ppuser = 'https://telegra.ph/file/de7c8230aff02d7bd1a93.jpg'
}

if (anu.action == 'add') {
conn.client[from].sendMessage(anu.id, { 
text: check ? `hello @${num.split("@")[0]} welcome to *${namagc}*` : `hello @${num.split("@")[0]} welcome to *${namagc}*`, 
contextInfo: {
mentionedJid: [...tag], 
externalAdReply: { 
thumbnail: ppuser, 
title: '© Welcome Message', 
body: '', 
renderLargerThumbnail: true,
sourceUrl: global.linkch,
mediaType: 1
}
}
}
 )
} 
if (anu.action == 'remove') { 
conn.client[from].sendMessage(anu.id, {
text: check ? `@${num.split("@")[0]} has left group *${namagc}*` : `@${num.split("@")[0]} has left group *${namagc}*`, 
contextInfo: {
mentionedJid: [...tag], 
externalAdReply: {
thumbnail: ppuser, 
title: '© Leaving Message', 
body: '', 
renderLargerThumbnail: true,
sourceUrl: global.linkch,
mediaType: 1
}
}
 }
 )
 }
 if (anu.action == "promote") {
 conn.client[from].sendMessage(anu.id, {
 text: `@${anu.author.split("@")[0]} has made @${num.split("@")[0]} as admin of this group`, 
 contextInfo: {
 mentionedJid: [...tag],
 externalAdReply: {
 thumbnailUrl: "https://pomf2.lain.la/f/ibiu2td5.jpg",
 title: '© Promote Message', 
 body: '',
 renderLargerThumbnail: true,
 sourceUrl: global.linkch,
 mediaType: 1
 }
 }
 }
 )
 }
if (anu.action == "demote") {
conn.client[from].sendMessage(anu.id, {
text: `@${anu.author.split("@")[0]} has removed @${num.split("@")[0]} as admin of this group`, 
contextInfo: {
mentionedJid: [...tag],
externalAdReply: { 
thumbnailUrl: "https://pomf2.lain.la/f/papz9tat.jpg",
title: '© Demote Message', 
body: '', 
renderLargerThumbnail: true,
sourceUrl: global.linkch,
mediaType: 1
}
}
}
)
}
} 
 } catch (err) {
 console.log(err)
 }
}
 }
)

conn.client[from].sendButtonImg = async (jid, buttons = [], text, image, footer, quoted = '', options = {}) => {
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
}

conn.client[from].sendMessage(jid, buttonMessage, { quoted })
}

conn.client[from].sendList = async (jid, title, footer, btn, quoted = '', options = {}) => {
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
footer: proto.Message.InteractiveMessage.Footer.create({ text: footer || "puqi" }),
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
}, { quoted })
return await conn.client[from].relayMessage(msg.key.remoteJid, msg.message, {
messageId: msg.key.id
})
}

conn.client[from].sendButtonProto = async (jid, title, footer, buttons = [], quoted = '', options = {}) => {
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
footer: proto.Message.InteractiveMessage.Footer.create({ text: footer || "puqi" }),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
buttons: buttons
})
})
}
}
}, { quoted })
return await conn.client[from].relayMessage(msg.key.remoteJid, msg.message, {
messageId: msg.key.id
})
}
 
conn.client[from].ments = (teks = '') => {
return teks.match('@') ? [...teks.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net') : []
};

conn.client[from].cMod = (jid, copy, text = '', sender = conn.client[from].user.id, options = {}) => {
let mtype = Object.keys(copy.message)[0];
let isEphemeral = mtype === 'ephemeralMessage';
if (isEphemeral) {
mtype = Object.keys(copy.message.ephemeralMessage.message)[0];
}
let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message;
let content = msg[mtype];
if (typeof content === 'string') msg[mtype] = text || content;
else if (content.caption) content.caption = text || content.caption;
else if (content.text) content.text = text || content.text;
if (typeof content !== 'string') msg[mtype] = {
...content,
...options
};
if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid;
else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid;
copy.key.remoteJid = jid;
copy.key.fromMe = sender === conn.client[from].user.id;
return proto.WebMessageInfo.fromObject(copy);
}

conn.client[from].sendText = (jid, text, quoted = '', options) => conn.client[from].sendMessage(jid, { text: text, ...options }, { quoted });

conn.client[from].deleteMessage = async (chatId, key) => {
try {
await conn.client[from].sendMessage(chatId, { delete: key });
console.log(`Pesan dihapus: ${key.id}`);
} catch (error) {
console.error('Gagal menghapus pesan:', error);
}
};

conn.client[from].downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
return buffer
} 

conn.client[from].ev.on('creds.update', saveCreds);
conn.client[from].serializeM = (m) => smsg(conn.client[from], m, store);
return conn.client[from];
}

const stopjadibot = async (conn, m, from) => {
if (!conn.client[from]) return m.reply("*Tidak ada bot yang sedang terkoneksi*")
fs.rm(`./start/lib/database/jadibot/${m.sender.split("@")[0]}`, { recursive: true, force: true }, (err) => {
if (err) {
return console.error(err);
}
m.reply("Sessions berhasil dihapus")
});
delete conn.client[from]
m.reply("*Bot Stopped*")
}

async function listjadibot(conn, m) {
let from = m.key.remoteJid
let mentions = []
let text = "List Jadi Bot :\n"
for (let jadibot of Object.keys(conn.client)) {
mentions.push(jadibot)
text += ` × ${jadibot}\n`
}
return conn.sendMessage(from, { text: text.trim(), mentions, })
}


module.exports = { jadibot, stopjadibot, listjadibot }

let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update ${__filename}`))
delete require.cache[file]
require(file)
})
