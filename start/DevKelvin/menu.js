const os = require('os');
const fs = require('fs');
const path = require('path');
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
const { sendButtons } = require('gifted-btns');
const moment = require('moment-timezone');
const { performance } = require("perf_hooks");
const speed = require('performance-now')
const fetch = require('node-fetch');
const axios = require('axios');
const checkDiskSpace = require('check-disk-space').default;

const db = require('../../start/Core/databaseManager');
const { getServerStartTime, getServerUptime } = require('../../Jex');
const { sendPTT } = require('../../start/utility/kevptt');
const { runtime, formatSize } = require('../../start/lib/myfunction')

// File to store menu configuration - using temp directory
const menuConfigPath = path.join(__dirname, '../temp/menu_config.json');

// Menu style types
const MENU_STYLES = {
    DEFAULT: 'default',    // Original format
    AWESOME: 'awesome'     // New format
};

// Default menu style
const defaultMenuStyle = MENU_STYLES.DEFAULT;

// Load menu configuration
function loadMenuConfig() {
    try {
        if (fs.existsSync(menuConfigPath)) {
            const config = JSON.parse(fs.readFileSync(menuConfigPath, 'utf8'));
            return {
                style: config.style || defaultMenuStyle
            };
        }
    } catch (error) {
        console.error('Error loading menu config:', error);
    }
    return { 
        style: defaultMenuStyle 
    };
}

// Save menu configuration
function saveMenuConfig(config) {
    try {
        const dir = path.dirname(menuConfigPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(menuConfigPath, JSON.stringify(config, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving menu config:', error);
        return false;
    }
}

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

// Platform detection 
const detectPlatform = () => {
  // Check for Railway platform
  if (process.env.RAILWAY_ENVIRONMENT || 
      process.env.RAILWAY_SERVICE_NAME || 
      process.env.RAILWAY_PROJECT_NAME || 
      process.env.RAILWAY_STATIC_URL ||
      process.env.RAILWAY_PUBLIC_DOMAIN ||
      process.env.RAILWAY_PROJECT_ID ||
      process.env.RAILWAY_ENVIRONMENT_ID ||
      (process.env.HOSTNAME && process.env.HOSTNAME.includes('railway'))) {
    return "Railway ";
  }
  if (process.env.DYNO) return "Heroku";
  if (process.env.RENDER) return "Render";
  if (process.env.PREFIX && process.env.PREFIX.includes("termux")) return "Termux";
  if (process.env.PORTS && process.env.CYPHERX_HOST_ID) return "CypherX Platform";
  if (process.env.P_SERVER_UUID) return "Panel";
  if (process.env.LXC) return "Linux Container (LXC)";
  
  switch (os.platform()) {
    case "win32": return "🪟 Windows";
    case "darwin": return "🍎 macOS";
    case "linux": return "🐧 Linux";
    default: return "❓ Unknown";
  }
};

// Get all buttons for menu (only Bot Repo and WhatsApp Channel)
function getAllButtons(menuId) {
  return [
    {
      name: 'cta_url',
      buttonParamsJson: JSON.stringify({
        display_text: '💻 Bot Repo',
        url: 'https://github.com/Kevintech-hub/Jexploit-Bot'
      })
    },
    {
      name: 'cta_url',
      buttonParamsJson: JSON.stringify({
        display_text: '📢 WhatsApp Channel',
        url: 'https://whatsapp.com/channel/0029Vb725SbIyPtOEG92nA04'
      })
    }
  ];
}

// Function to generate the menu
async function generateMenu(conn, m, prefix, global) {
    const botNumber = await conn.decodeJid(conn.user.id);

    // Load current menu configuration
    const menuConfig = loadMenuConfig();
    const currentStyle = menuConfig.style || defaultMenuStyle;

    // Calculate memory usage
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const systemUsedMemory = totalMemory - freeMemory;

    // Fixed menu order (no presets)
    const currentOrder = [
        'header', 'ai', 'audio', 'cmdTool', 'convert', 'currency', 'download', 'education', 
        'ephoto', 'features', 'fun', 'group', 'helpers', 
        'image', 'other', 'owner', 'reaction', 'religion', 'search', 
        'sports'
    ];

    const menuSections = {
        header: {
            title: '🔥JEXPLOIT 🔮',
            content: [
    `*Usᴇʀ*: ${await db.get(botNumber, 'ownername', 'Not set')}`,
    `*Nᴀᴍᴇ*: ${global.botname}`,
    `*Mᴏᴅᴇ*: ${conn.public ? 'ᴘᴜʙʟɪᴄ' : 'ᴘʀɪᴠᴀᴛᴇ'}`,
    `*Hᴏsᴛ*: ${detectPlatform()}`,
    `*Pʀᴇғɪx*: [ ${prefix} ]`,
    `*Cᴏᴍᴍᴀɴᴅs*: 100+`,
    `*Vᴇʀsɪᴏɴ*: ${global.versions}`,
    `*Rᴀᴍ*: ${progressBar(systemUsedMemory, totalMemory)}`,
    ``,
],
        },
        ai: {
            title: ' *AI MENU*',
            commands: ['claude', 'gpt4nano', 'bard', 'perplexity', 'kelvinai',  'phiai', 'glm', 'gemini', 'gpt'],
        },
        audio: {
            title: ' *AUDIO MENU*',
            commands: ['bass', 'treble', 'blown', 'robot', 'reverse', 'instrumental', 'nightcore', 'echo',
                      'vocalremove', 'karaoke', 'volaudio', 'fast', 'slow'],
        },
        cmdTool: {
            title: ' *BOTSTATUS MENU* ',
            commands: ['ping', 'pair', 'uptime',  'bothosting', 'repo', 'botstatus', 'botinfo', 'sc', 
                      'serverinfo', 'alive'],
        },
        convert: {
            title: ' *CONVERT MENU* ',
            commands: ['toaudio', 'toimage', 'url', 'tovideo', 'tovideonote', 'topdf', 'sticker'],
        },
        currency: {
             title: ' *ECONOMICS MENU*',
             commands: ['currency', 'listcurrencies'],
             },
        download: {
            title: ' *DOWNLOAD MENU* ',
            commands: ['play', 'play2', 'play3', 'song', 'song2', 'ytplay', 'gitclone', 'ringtone', 
                      'download', 'pinterest', 'mediafire', 'itunes', 'ytmp3', 'ytmp4', 'ytstalk', 
                      'apkdl', 'gdrive', 'playdoc', 'tiktok', 'tiktok2', 'instagram', 
                      'video', 'video2', 'tiktokaudio', 'savestatus', 'facebook'],
        },
        education: {
            title: ' *EDUCATION MENU*',
            commands: ['math', 'poem', 'friutinfo', 'dictionary', 'book', 'physics', 'chemistry'],
            },
        ephoto: {
            title: ' *EPHOTO360MAKER MENU* ',
            commands: ['blackpinklogo', 'blackpinkstyle', 'glossysilver', 'glitchtext', 
                      'arting', 'advancedglow', 'cartoonstyle', 'deadpool', 'deletingtext', 
                      'luxurygold',  '1917style', 'pixelglitch', 'multicoloredneon', 
                      'effectclouds', 'flagtext', 'freecreate', 'galaxystyle', 'bear ', 'devilwings', 'wolfgalaxy', 'comic', 'textonwetglass', 'galaxywallpaper', 'firetext', 'underwater', 'neontext', 'metaltext', 'snowtext', 'icetext', 'purpletext', 'lighttext', 'thundertext', 'leavestext', 'hackertext', 'deviltext', 'vintagetext', 'wingslogo', 'painttext', 'naruto', 'pubglogo',
                      'glowingtext', 'corntext', 'makingneon', 'matrix', 'royaltext', 'sand', 'summerbeach', 
                      'topography', 'typography', 'flux', 'dragonball'],
        },
        features: {
            title: ' *SETTING MENU*',
            commands: ['antidelete', 'anticall', 'autorecording', 'autotyping', 'alwaysonline', 'setmenu', 'setprefix',
                      'welcome', 'chatbot', 'autoread', 'adminevent', 'autoviewstatus', 
                      'autoreactstatus', 'setstatusemoji', 'antiedit'],
        },
        fun: {
            title: ' *GAMES MENU* ',
            commands: ['dare', 'truth', 'fact', 'truthdetecter', 'valentines', 
                      'advice', 'motivate', 'pickupline', '8balls', 'trivia', 'riddle', 'cartoonquiz',
                      'lovetest', 'character', 'compatibility', 'compliment', 'jokes'],
        },
        group: {
            title: ' *GROUP MENU* ',
            commands: [
             'linkgc', 'checkchan', 'antilink', 'antitag', 'antitagadmin', 'antibadword', 'antisticker',  'allowlink', 'antipromote', 'antidemote',
                'listonline', 'add',  'listactive', 'listinactive', 'close', 'open', 'kick', 'kickinactive', 
                 'cancelkick', 'kickall', 'closetime', 'disp24hours', 'disp90days', 'dispoff', 'setgrouppp', 'antigroupmention',
                 'opentime', 'poll', 'totalmembers', 
                'mediatag', 'getgrouppp',  'tagall', 'tagall2', 'groupinfo', 'userjid', 'unlockgcsettings', 'lockgcsettings',
                'tagadmin', 'setgroupname', 'delgrouppp', 'invite', 'editinfo', 'approve', 'togstatus', 
                'disapproveall', 'listrequest', 'promote', 'demote', 'setdesc', 'vcf'
            ],
        },
        helpers: {
            title: ' *SUPPORT MENU*',
            commands: ['helpers', 'dev'],
        },
        image: {
            title: ' *IMAGE MENU*',
            commands: ['wallapaper', 'wikipedia', 'generate', 'remini'],
        },
        other: {
            title: ' *TOOLS MENU*',
            commands: ['time', 'calculate', 'owner', 'fliptext', 'translate', 'countryinfo', 'texttosticker', 'texttovideo', 'editimage', 'emojimix', 'emojigif', 
                      'ss2', 'sswebpc', 'say', 'getdevice', 'ss', 'gpass', 'userinfo', 
                      'npm', 'take', 'emoji', 'checkapi', 'filtervcf', 'qrcode', 'smartphone', 
                      'removebg', 'encrypt', 'obfuscate2', 'getabout', 'tinylink', 'vcc', 'getbussiness', 
                      'listpc', 'sswebpc'],
        },
        owner: {
            title: ' *OWNER MENU*',
            commands: [
                'addowner', 'removeowner', 'listowner', 'creategroup', 'createchannel',  'del', 'setpp', 'delpp', 'private', 'public',
                'lastseen', 'groupid', 'readreceipts', 'reportbug', 'forward',
               'groupjids', 'broadcast', 
                'react', 'restart', 'currentmenu', 'addignorelist', 'delignorelist', 'deljunk', 'cleansession', 'settings', 'update',
                'listblocked', 'listsudo', 'setprofilename', 'listignored', 'online', 'join', 
                'leave', 'setbio', 'resetsettings', 'reqeust', 'block',  'toviewonce', 
                'setownername', 'setawesomemenu', 'resetawesomemenu', 'unblock', 'unblockall', 'gcaddprivacy', 
                'ppprivancy', 'vv', 'vv2', 'idch', 'getpp'
            ],
        },
        reaction: {
            title: ' *REACTION MENU*',
            commands: ['kiss', 'blush', 'kick', 'slap', 'dance', 'bully', 'kill', 
 'hug', 'happy', 'cry', 'pat', 'poke', 'smile', 'wave', 
 'cuddle', 'highfive', 'lick', 'bite', 'glomp', 'bonk', 
 'yeet', 'smug', 'nom', 'sleepy', 'facepalm', 'wink', 
 'shy', 'stare', 'thinking', 'shoot', 'run', 'shrug', 
 'panic', 'tease', 'shiver', 'bored', 'scream', 'pout', 
 'handhold', 'spank', 'tickle', 'cringe', 'party', 'celebrate'],
        },
        religion: {
            title: ' *RELIGION MENU* ',
            commands: ['Bible', 'Biblelist', 'Quran'],
        },
        search: {
            title: ' *SEARCH MENU* ',
            commands: ['lyrics', 'chord', 'weather', 'movie', 'define', 'githubsearch', 'playstore',
                      'tiktoksearch', 'ytsearch', 'instagramuser', 'shazam'],
        },
        sports: {
            title: ' *SPORTS MENU* ',
            commands: [
        'eplstandings', 'clstandings', 'laligastandings', 
        'bundesligastandings', 'serieastandings', 'ligue1standings',
        'elstandings', 'eflstandings', 'wcstandings',
        'eurosstandings', 'fifastandings',
        'eplmatches', 'clmatches', 'laligamatches',
        'bundesligamatches', 'serieamatches', 'ligue1matches',
        'elmatches', 'eflmatches', 'wcmatches',
        'euromatches', 'fifamatches',
        'eplscorers', 'clscorers', 'laligascorers',
        'bundesligascorers', 'serieascorers', 'ligue1scorers', 'bettting', 
        'elscorers', 'eflscorers', 'wcscorers',
        'euroscorers', 'fifascorers',
        'eplupcoming', 'clupcoming', 'laligaupcoming',
        'bundesligaupcoming', 'serieaupcoming', 'ligue1upcoming',
        'elupcoming', 'eflupcoming', 'wcupcoming',
        'eurosupcoming', 'fifaupcoming',
        'teamsearch', 'playersearch', 'venuesearch',
        'livescores', 'footballnews',
        'wweevents', 'wwenews', 'wweschedule'
    ],
  },
};

    // Function to format the menu using current style
    const formatMenu = () => {
        if (currentStyle === MENU_STYLES.AWESOME) {
            return formatAwesomeMenu();
        } else {
            return formatDefaultMenu();
        }
    };

   // Original/default menu format
const formatDefaultMenu = () => {
    let menu = `┏❒ *JEXPLOIT* ❒\n`;
    menu += menuSections.header.content.map(line => `┃ ${line}`).join('\n') + '\n';
    menu += `┗❒\n\n`;

   // Use the fixed order
let sectionCount = 0;
for (const sectionKey of currentOrder) {
    if (sectionKey !== 'header' && menuSections[sectionKey]) {
        const section = menuSections[sectionKey];
        menu += `┏➽⟡ ${section.title.toUpperCase()} ⟡\n`;
        menu += section.commands.map(cmd => `┃⌬ ${cmd}`).join('\n') + '\n';
        menu += `┗━⟡\n\n`;
        
        sectionCount++;
        if (sectionCount === 3) { 
            menu += `${readmore}\n\n`;
        }
        if (sectionCount === 8) {
            menu += `${readmore}\n\n`;
        }
    }
}

  menu += `> ʟᴇɢᴀʟʟʏ ᴡʀᴏɴɢ, ᴇᴛʜɪᴄᴀʟʟʏ ʀɪɢʜᴛ-ᴋᴇʟᴠɪɴ ᴛᴇᴄʜ ᴠs ᴇᴠᴇʀʏᴏɴᴇ `;
    return menu;
};
    // Awesome menu format (new style)
    const formatAwesomeMenu = () => {
        let menu = `╭─✰【 🤖 JEXPLOIT 】✰─╮\n`;
        menu += menuSections.header.content.map(line => `│ ${line}`).join('\n') + '\n';
        menu += `╰─✰─╮\n\n`;

        // Use the fixed order
        let sectionCount = 0;
        for (const sectionKey of currentOrder) {
            if (sectionKey !== 'header' && menuSections[sectionKey]) {
                const section = menuSections[sectionKey];
                menu += `╭──♦${section.title.toUpperCase()} ♦\n`;
                menu += section.commands.map(cmd => `│❖ ${cmd}`).join('\n') + '\n';
                menu += `╰──▧\n\n`;
                
                sectionCount++;
                if (sectionCount === 3) { 
                    menu += `${readmore}\n\n`;
                }
                if (sectionCount === 8) { // After 8 sections  
                    menu += `${readmore}\n\n`;
                }
            }
        }
             
        menu += `> ʟᴇɢᴀʟʟʏ ᴡʀᴏɴɢ, ᴇᴛʜɪᴄᴀʟʟʏ ʀɪɢʜᴛ-ᴋᴇʟᴠɪɴ ᴛᴇᴄʜ ᴠs ᴇᴠᴇʀʏᴏɴᴇ `;
        return menu;
    };

    return {
        formatMenu,
        menuSections,
        currentStyle,
        currentOrder,
        menuConfig
    };
}

// Function to send menu with button style (NO image)
async function sendButtonOnlyMenu(conn, m, prefix, global) {
    const { formatMenu } = await generateMenu(conn, m, prefix, global);
    
    const menuId = Date.now().toString();
    const audioUrls = [
        'https://files.catbox.moe/ckie6b.m4a',
        'https://files.catbox.moe/yny58w.mp3',
        'https://files.catbox.moe/zhr5m2.mp3',
        'https://files.catbox.moe/9qstpk.mp3',
        'https://files.catbox.moe/4kbmgh.mp3',
        'https://files.catbox.moe/ycsl7s.mp3'
    ];
    
    const randomAudio = audioUrls[Math.floor(Math.random() * audioUrls.length)];
    const menuText = formatMenu();
    const footer = `★⃝𝐉𝐄𝐗𝐏𝐋𝐎𝐈𝐓`;
    
    // Store menu ID for button response
    if (!global.menuResponses) global.menuResponses = new Map();
    global.menuResponses.set(menuId, { prefix, global });
    
    await sendButtons(conn, m.chat, {
        title: '',
        text: menuText,
        footer: footer,
        buttons: getAllButtons(menuId),
    }, { quoted: m });
    
    // Send as playable PTT
    await sendPTT(conn, m.chat, randomAudio, m);
    
    return true;
}

// Function to send menu with IMAGE + buttons
async function sendImageButtonMenu(conn, m, prefix, global) {
    const { formatMenu } = await generateMenu(conn, m, prefix, global);
    
    const menuId = Date.now().toString();
    const imageUrls = [
        './start/lib/Media/Jexploit1.jpg',
        './start/lib/Media/Jexploit2.jpg'
    ];
    
    const audioUrls = [
        'https://files.catbox.moe/ckie6b.m4a',
        'https://files.catbox.moe/yny58w.mp3',
        'https://files.catbox.moe/zhr5m2.mp3',
        'https://files.catbox.moe/9qstpk.mp3',
        'https://files.catbox.moe/4kbmgh.mp3',
        'https://files.catbox.moe/ycsl7s.mp3'
    ];
    
    const randomImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];
    const randomAudio = audioUrls[Math.floor(Math.random() * audioUrls.length)];
    const menuText = formatMenu();
    const footer = `★⃝𝐉𝐄𝐗𝐏𝐋𝐎𝐈𝐓`;
    
    // Store menu ID for button response
    if (!global.menuResponses) global.menuResponses = new Map();
    global.menuResponses.set(menuId, { prefix, global });
    
    await sendButtons(conn, m.chat, {
        title: '',
        text: menuText,
        footer: footer,
        image: { url: randomImage },
        buttons: getAllButtons(menuId),
    }, { quoted: m });
    
    // Send as playable PTT
    await sendPTT(conn, m.chat, randomAudio, m);
    
    return true;
}

// Main sendMenu function
async function sendMenu(conn, m, prefix, global) {
    try {
        // Get menu style from database or global
        let menuStyle = global.menuStyle || await db.get(conn.user.id, 'menustyle', 'button');
        
        if (menuStyle === 'image') {
            await sendImageButtonMenu(conn, m, prefix, global);
        } else {
            await sendButtonOnlyMenu(conn, m, prefix, global);
        }
        
        return true;
    } catch (error) {
        console.error('Error sending menu:', error);
        // Fallback to button only
        await sendButtonOnlyMenu(conn, m, prefix, global);
        throw error;
    }
}

// Set Awesome Menu Format
async function setAwesomeMenu(conn, m) {
    try {
        const menuConfig = loadMenuConfig();
        if (saveMenuConfig({ ...menuConfig, style: MENU_STYLES.AWESOME })) {
            await conn.sendMessage(m.chat, {
                text: '✅ *Awesome Menu Format Activated!*\n\nNow your menu will display in the new awesome format with fancy borders and symbols! 🎉\n\nUse *.resetmenu* to go back to default format.'
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, {
                text: '❌ Failed to set awesome menu format'
            }, { quoted: m });
        }
    } catch (error) {
        console.error('Error setting awesome menu:', error);
        await conn.sendMessage(m.chat, {
            text: '❌ Error setting awesome menu format'
        }, { quoted: m });
    }
}

// Reset Menu to Default Format
async function resetMenu(conn, m) {
    try {
        const menuConfig = loadMenuConfig();
        if (saveMenuConfig({ ...menuConfig, style: MENU_STYLES.DEFAULT })) {
            await conn.sendMessage(m.chat, {
                text: '*Menu Format Reset to Default!*\n\nYour menu is now back to the original/default format.\n\nUse *.setawesomemenu* to switch to the awesome format.'
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, {
                text: '❌ Failed to reset menu format'
            }, { quoted: m });
        }
    } catch (error) {
        console.error('Error resetting menu:', error);
        await conn.sendMessage(m.chat, {
            text: '❌ Error resetting menu format'
        }, { quoted: m });
    }
}

async function showCurrentMenu(conn, m) {
    try {
        const { currentStyle, currentOrder, menuSections } = await generateMenu(conn, m, '.', {});

        const styleNames = {
            'default': 'Default Format',
            'awesome': 'Awesome Format'
        };

        const orderList = currentOrder.map((section, index) => {
            const sectionTitle = menuSections[section]?.title || section;
            return `${index + 1}. ${sectionTitle.trim()}`;
        }).join('\n');

        await conn.sendMessage(m.chat, {
            text: `📋 *Current Menu Settings*\n\n` +
                  `✨ *Style:* ${styleNames[currentStyle]}\n\n` +
                  `📑 *Section Order:*\n${orderList}\n\n` +
                  `⚙️ *Commands:*\n` +
                  `• *.setawesomemenu* - Switch to awesome format\n` +
                  `• *.resetmenu* - Back to default format\n` +
                  `• *.currentmenu* - Show this info`
        }, { quoted: m });
    } catch (error) {
        console.error('Error showing current menu:', error);
    }
}

// Add to menu.js for more flexibility
function getMenuSection(sectionName) {
    const { menuSections } = generateMenu();
    return menuSections[sectionName];
}

function getCommandList(category) {
    const section = getMenuSection(category);
    return section ? section.commands : [];
}

module.exports = {
    generateMenu,
    sendMenu,
    progressBar,
    getMenuSection,
    getCommandList,
    setAwesomeMenu,
    resetMenu,
    showCurrentMenu,
    loadMenuConfig,
    MENU_STYLES,
    detectPlatform
};