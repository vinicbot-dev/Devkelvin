const os = require('os');
const fs = require('fs');
const path = require('path');
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

const { getSetting } = require('../../start/Core/settingManager');
// File to store menu configuration - using temp directory
const menuConfigPath = path.join(__dirname, '../temp/menu_config.json');


// Six preset menu arrangements
const menuPresets = {
    preset1: [
        'header', 'owner', 'group', 'ai', 'audio', 'image', 'reaction', 
        'features', 'download', 'convert', 'cmdTool', 'other', 'helpers', 
        'ephoto', 'search', 'fun', 'religion', 'sports'
    ],
    preset2: [
        'header', 'download', 'ai', 'audio', 'features', 'group', 'owner',
        'convert', 'image', 'reaction', 'cmdTool', 'search', 'fun', 
        'ephoto', 'other', 'helpers', 'religion', 'sports'
    ],
    preset3: [
        'header', 'features', 'ai', 'download', 'audio', 'convert', 'image',
        'group', 'owner', 'reaction', 'fun', 'search', 'ephoto',
        'cmdTool', 'other', 'helpers', 'religion', 'sports'
    ],
    preset4: [
        'header', 'ai', 'download', 'audio', 'fun', 'reaction', 'search',
        'features', 'group', 'image', 'convert', 'owner', 'ephoto',
        'cmdTool', 'other', 'helpers', 'religion', 'sports'
    ],
    preset5: [
        'header', 'download', 'audio', 'convert', 'ai', 'features', 'group',
        'image', 'reaction', 'fun', 'search', 'ephoto', 'owner',
        'cmdTool', 'other', 'helpers', 'religion', 'sports'
    ],
    preset6: [
        'header', 'owner', 'features', 'group', 'ai', 'download', 'audio',
        'convert', 'image', 'reaction', 'fun', 'search', 'ephoto',
        'cmdTool', 'other', 'helpers', 'religion', 'sports'
    ]
};

// Default preset
const defaultPreset = 'preset1';

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
            // Ensure both preset and style are present
            return {
                preset: config.preset || defaultPreset,
                style: config.style || defaultMenuStyle
            };
        }
    } catch (error) {
        console.error('Error loading menu config:', error);
    }
    return { 
        preset: defaultPreset, 
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

// Function to generate the menu
async function generateMenu(conn, m, prefix, global) {
    const botNumber = await conn.decodeJid(conn.user.id);

    // Load current menu configuration
    const menuConfig = loadMenuConfig();
    const currentPreset = menuConfig.preset || defaultPreset;
    const currentStyle = menuConfig.style || defaultMenuStyle;
    const currentOrder = menuPresets[currentPreset] || menuPresets.preset1;

    // Calculate memory usage
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const systemUsedMemory = totalMemory - freeMemory;

    // Define menu sections for organization
    const menuSections = {
        header: {
            title: '🔥JEXPLOIT 🔮',
            content: [
                `👤 ᴜsᴇʀ: ${getSetting(botNumber, 'ownername', 'Not set')}`,
                `🤖 ʙᴏᴛɴᴀᴍᴇ: ${getSetting(botNumber, 'botname', 'Jexploit')}`,
                `🌍 ᴍᴏᴅᴇ: ${conn.public ? 'ᴘᴜʟʙɪᴄ' : 'ᴘʀɪᴠᴀᴛᴇ'}`,
                `🛠️ ᴘʀᴇғɪx: [ ${prefix} ]`,
                `📈 ᴄᴍᴅs: 100+`,
                `🧪 ᴠᴇʀsɪᴏɴ: ${global.versions}`,
                `💾 𝚁𝙰𝙼: ${progressBar(systemUsedMemory, totalMemory)}\n`,
                `👤 ᴅᴇᴠ: ☘ ᴋᴇʟᴠɪɴ ᴛᴇᴄʜ ☘`,
            ],
        },
        owner: {
            title: ' *OWNER MENU*',
            commands: [
                'addowner', '𝙸𝚍𝚌𝚑', '𝙲𝚛𝚎𝚊𝚝𝚎𝚌𝚑', 'creategroup', 'del', 'setpp', 'delpp', 'private', 'public',
                'lastseen', 'setprefix', 'groupid', 'readreceipts', 'reportbug', 'clearchat', 
                'hack', 'groupjids', 'broadcast', 
                'react', 'restart', 'currentmenu', 'addignorelist', 'delignorelist', 'deljunk', 'features',
                'listblocked', 'listsudo', 'setprofilename', 'listignored', 'online', 'join', 
                'leave', 'setbio', 'resetsettings', 'backup', 'reqeust', 'block',  'toviewonce', 
                'setownername', 'setbotname', 'unblock', 'unblockall', 'gcaddprivacy', 
                'ppprivancy', 'tostatus', 'vv', 'vv2', 'idch', 'getpp',
            ],
        },
        group: {
            title: ' *GROUP MENU* ',
            commands: [
                '𝖧𝗂𝖽𝖾𝗍𝖺𝗀', '𝖪𝗂𝖼𝗄', 'r𝖾𝗌𝖾𝗍𝗅𝗂𝗇𝗄', 'linkgc', 'checkchan', 'antilink', 'antitag', 'antibadword', 
                'listonline', 'add',  'listactive', 'listinactive', 'close', 'open', 'kick', 'kickinactive', 
                 'listadmin', 'cancelkick', 'kickall', 'closetime', 'disp24hours', 'disp90days', 'dispoff', 
                'tagall2', 'opentime', 'poll', 'allowlink', 'totalmembers', 
                'mediatag', 'getgrouppp',  'tagall', 'groupinfo', 'userjid', 'unlockgcsettings', 'lockgcsettings',
                'tagadmin2', 'setgroupname', 'delgrouppp', 'invite', 'editinfo', 'approve', 
                'disapproveall', 'listrequest', 'promote', 'demote', 'userjid', 'setdesc', 'vcf',
            ],
        },
        ai: {
            title: ' *AI MENU*',
            commands: ['generate', 'ai', 'copilot', 'metaai', 'deepseek', 'flux', 'dalle', 'mistral', 'summarize', 'blackbox', 'gpt'],
        },
        audio: {
            title: ' *AUDIO MENU*',
            commands: ['bass', 'treble', 'blown', 'robot', 'reverse', 'instrumental', 
                      'vocalremove', 'karaoke', 'volaudio', 'fast', 'slow'],
        },
        image: {
            title: ' *IMAGE MENU*',
            commands: ['wallapaper', 'balogo', 'tattoo', 'remini'],
        },
        reaction: {
            title: ' *REACTION MENU*',
            commands: ['kiss', 'blush', 'kick', 'slap', 'dance', 'bully', 'kill', 
                      'hug', 'happy', 'cry'],
        },
        features: {
            title: ' *SETTING MENU*',
            commands: ['antidelete', 'anticall', 'antibug', 'autorecording', 'antistatus', 'autotyping', 
                      'welcome', 'chatbot', 'autoread', 'adminevent', 'autoviewstatus', 
                      'autoreactstatus', 'antiedit', 'setmenu1', 'setmenu2', 'setmenu3', 'setmenu4', 'setmenu5', 'setmenu6',
                      'setawesomemenu', 'resetmenu'],
        },
        download: {
            title: ' *DOWNLOAD MENU* ',
            commands: ['play', 'play2', 'song', 'song2', 'music', 'ytplay', 'gitclone', 'ringtone', 
                      'download', 'pinterest', 'mediafire', 'itunes', 'ytmp4', 'ytstalk', 
                      'apk', 'gdrive', 'playdoc', 'tiktok', 'tiktok2', 'instagram', 
                      'video', 'tiktokaudio', 'save', 'facebook'],
        },
        convert: {
            title: ' *CONVERT MENU* ',
            commands: ['toaudio', 'toimage', 'url', 'tovideo', 'topdf', 'sticker'],
        },
        cmdTool: {
            title: ' *BOTSTATUS MENU* ',
            commands: ['ping', 'pair', 'uptime',  'bothosting', 'repo', 'botstatus', 'botinfo', 'sc', 
                      'serverinfo', 'alive'],
        },
        other: {
            title: ' *TOOLS MENU*',
            commands: ['time', 'calculate', 'owner', 'dev', 'fliptext', 'translate', 
                      'ss2', 'sswebpc', 'kevinfarm', 'say', 'getdevice', 'ss', 'gpass', 'userinfo', 
                      'npm', 'take', 'telesticker', 'checkapi', 'footballhelp', 'filtervcf', 'qrcode', 'smartphone', 
                      'removebg', 'obfuscate', 'getabout', 'tinylink', 'vcc', 'getbussiness', 
                      'listpc', 'sswebpc'],
        },
        helpers: {
            title: ' *SUPPORT MENU*',
            commands: ['helpers'],
        },
        ephoto: {
            title: ' *EPHOTO360MAKER MENU* ',
            commands: ['blackpinklogo', 'blackpinkstyle', 'glossysilver', 'glitchtext', 
                      'arting', 'advancedglow', 'cartoonstyle', 'deadpool', 'deletingtext', 
                      'luxurygold',  '1917style', 'pixelglitch', 'multicoloredneon', 
                      'effectclouds', 'flagtext', 'freecreate', 'galaxystyle', 'papercut', 'holigram', 'royal', 'bear', 'textonwetglass', 'galaxywallpaper', 
                      'glowingtext', 'makingneon', 'matrix', 'royaltext', 'sand', 'summerbeach', 
                      'topography', 'typography', 'flux', 'dragonball'],
        },
        search: {
            title: ' *SEARCH MENU* ',
            commands: ['lyrics', 'chord', 'weather', 'movie', 'define', 'gitstalk', 'playstore',
                      'tiktoksearch', 'ytsearch', 'shazam'],
        },
        fun: {
            title: ' *FUN MENU* ',
            commands: ['dare', 'Quotes', 'truth', 'fact', 'truthdetecter', 'valentines', 
                      'advice', 'motivate', 'pickupline', '8balls', 'mee', 'emoji', 
                      'lovetest', 'character', 'compatibility', 'compliment', 'jokes'],
        },
        religion: {
            title: ' *RELIGION MENU* ',
            commands: ['Bible', 'Biblelist', 'Quran'],
        },
        sports: {
            title: ' *SPORTS MENU* ',
            commands: [
                'eplstandings', 'plstandings', 'premierleaguestandings', 'clstandings', 'championsleague',
                'laligastandings', 'laliga', 'bundesligastandings', 'bundesliga', 'serieastandings', 'seriea',
                'ligue1standings', 'ligue1', 'elstandings', 'europaleague', 'eflstandings', 'championship',
                'wcstandings', 'worldcup', 'eplmatches', 'plmatches', 'clmatches', 'championsleaguematches',
                'laligamatches', 'pdmatches', 'bundesligamatches', 'bl1matches', 'serieamatches', 'samatches',
                'ligue1matches', 'fl1matches', 'elmatches', 'europaleaguematches', 'eflmatches', 'elcmatches',
                'wcmatches', 'worldcupmatches', 'eplscorers', 'plscorers', 'clscorers', 'championsleaguescorers',
                'laligascorers', 'pdscorers', 'bundesligascorers', 'bl1scorers', 'serieascorers', 'sascorers',
                'ligue1scorers', 'fl1scorers', 'elscorers', 'europaleaguescorers', 'eflscorers', 'elcscorers',
                'wcscorers', 'worldcupscorers', 'eplupcoming', 'plupcoming', 'clupcoming', 'championsleagueupcoming',
                'laligaupcoming', 'pdupcoming', 'bundesligaupcoming', 'bl1upcoming', 'serieaupcoming', 'saupcoming',
                'ligue1upcoming', 'fl1upcoming', 'elupcoming', 'europaleagueupcoming', 'eflupcoming', 'elcupcoming',
                'wcupcoming', 'worldcupupcoming', 'wweevents', 'wrestlingevents', 'wwenews', 'wwe', 'wweschedule', 'wweevents'
            ],
        },
    };

    // Function to format the menu using current preset and style
    const formatMenu = () => {
        if (currentStyle === MENU_STYLES.AWESOME) {
            return formatAwesomeMenu();
        } else {
            return formatDefaultMenu();
        }
    };

    // Original/default menu format
    const formatDefaultMenu = () => {
        let menu = `╭──────⬡ 🤖 JEXPLOIT  ⬡────⭓\n`;
        menu += menuSections.header.content.map(line => `├▢⬡  ${line}`).join('\n') + '\n';
        menu += `╰────────────────────────⭓\n\n`;

        // Use the current preset order
        let sectionCount = 0;
        for (const sectionKey of currentOrder) {
            if (sectionKey !== 'header' && menuSections[sectionKey]) {
                const section = menuSections[sectionKey];
                menu += `╭────❒${section.title.toUpperCase()} ───❒\n`;
                menu += section.commands.map(cmd => `├─❏ ${cmd}`).join('\n') + '\n';
                menu += `┕──────────────────────❒\n\n`;

                sectionCount++;
                if (sectionCount === 3) { 
                    menu += `${readmore}\n\n`;
                }
                if (sectionCount === 8) { // After 8 sections  
                    menu += `${readmore}\n\n`;
                }
            }
        }

        menu += `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋᴇʟᴠɪɴ ᴛᴇᴄʜ `;
        return menu;
    };

    // Awesome menu format (new style)
    const formatAwesomeMenu = () => {
        let menu = `╭═✦〔 🤖 JEXPLOIT 〕✦═╮\n`;
        menu += menuSections.header.content.map(line => `┃ ${line}`).join('\n') + '\n';
        menu += `╰═✦═════════════╯\n\n`;

        // Use the current preset order
        let sectionCount = 0;
        for (const sectionKey of currentOrder) {
            if (sectionKey !== 'header' && menuSections[sectionKey]) {
                const section = menuSections[sectionKey];
                menu += `╭━◈${section.title.toUpperCase()} ◈\n`;
                menu += section.commands.map(cmd => `│ ➸ ${cmd}`).join('\n') + '\n';
                menu += `┗▣\n\n`;
                
                sectionCount++;
                if (sectionCount === 3) { 
                    menu += `${readmore}\n\n`;
                }
                if (sectionCount === 8) { // After 8 sections  
                    menu += `${readmore}\n\n`;
                }
            }
        }
             
        menu += `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋᴇʟᴠɪɴ ᴛᴇᴄʜ `;
        return menu;
    };

    return {
        formatMenu,
        menuSections,
        currentPreset,
        currentStyle,
        currentOrder,
        menuConfig
    };
}

// Function to send the menu
async function sendMenu(conn, m, prefix, global) {
    try {
        const { formatMenu } = await generateMenu(conn, m, prefix, global);

        // Array of image URLs to choose from randomly
        const imageUrls = [
            'https://files.catbox.moe/9sazwf.jpg',
            'https://files.catbox.moe/w5vwcu.jpg'
        ];

        // Array of audio URLs to choose from randomly
        const audioUrls = [
            'https://files.catbox.moe/jdozs7.mp3',
            'https://files.catbox.moe/yny58w.mp3',
            'https://files.catbox.moe/e0dwjw.mp3',
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
                showAdAttribution: true,
                title: global.botname || 'ᴠɪɴɪᴄ xᴍᴅ',
                body: '☘ ᴋᴇʟᴠɪɴ ᴛᴇᴄʜ ☘',
                mediaType: 3,
                renderLargerThumbnail: false,
                thumbnail: global.cina || 'https://files.catbox.moe/9sazwf.jpg', 
                sourceUrl: 'https://whatsapp.com/channel/0029Vb725SbIyPtOEG92nA04',
            },
        }, { quoted: m });

        // Send random audio
        await conn.sendMessage(m.chat, {
            audio: { url: randomAudio },
            mimetype: 'audio/mpeg',
            ptt: false,
        });

        return true;
    } catch (error) {
        console.error('Error sending menu:', error);
        throw error;
    }
}

// Menu preset commands
async function setMenu1(conn, m) {
    try {
        const menuConfig = loadMenuConfig();
        if (saveMenuConfig({ ...menuConfig, preset: 'preset1' })) {
            await conn.sendMessage(m.chat, {
                text: '✅ Menu arrangement set to **Preset 1** (Default Order)'
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, {
                text: '❌ Failed to save menu configuration'
            }, { quoted: m });
        }
    } catch (error) {
        console.error('Error setting menu preset 1:', error);
        await conn.sendMessage(m.chat, {
            text: '❌ Error setting menu arrangement'
        }, { quoted: m });
    }
}

async function setMenu2(conn, m) {
    try {
        const menuConfig = loadMenuConfig();
        if (saveMenuConfig({ ...menuConfig, preset: 'preset2' })) {
            await conn.sendMessage(m.chat, {
                text: '✅ Menu arrangement set to **Preset 2** (Download & AI Focus)'
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, {
                text: '❌ Failed to save menu configuration'
            }, { quoted: m });
        }
    } catch (error) {
        console.error('Error setting menu preset 2:', error);
        await conn.sendMessage(m.chat, {
            text: '❌ Error setting menu arrangement'
        }, { quoted: m });
    }
}

async function setMenu3(conn, m) {
    try {
        const menuConfig = loadMenuConfig();
        if (saveMenuConfig({ ...menuConfig, preset: 'preset3' })) {
            await conn.sendMessage(m.chat, {
                text: '✅ Menu arrangement set to **Preset 3** (Features & AI Focus)'
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, {
                text: '❌ Failed to save menu configuration'
            }, { quoted: m });
        }
    } catch (error) {
        console.error('Error setting menu preset 3:', error);
        await conn.sendMessage(m.chat, {
            text: '❌ Error setting menu arrangement'
        }, { quoted: m });
    }
}

async function setMenu4(conn, m) {
    try {
        const menuConfig = loadMenuConfig();
        if (saveMenuConfig({ ...menuConfig, preset: 'preset4' })) {
            await conn.sendMessage(m.chat, {
                text: '✅ Menu arrangement set to **Preset 4** (AI & Fun Focus)'
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, {
                text: '❌ Failed to save menu configuration'
            }, { quoted: m });
        }
    } catch (error) {
        console.error('Error setting menu preset 4:', error);
        await conn.sendMessage(m.chat, {
            text: '❌ Error setting menu arrangement'
        }, { quoted: m });
    }
}

async function setMenu5(conn, m) {
    try {
        const menuConfig = loadMenuConfig();
        if (saveMenuConfig({ ...menuConfig, preset: 'preset5' })) {
            await conn.sendMessage(m.chat, {
                text: '✅ Menu arrangement set to **Preset 5** (Download & Audio Focus)'
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, {
                text: '❌ Failed to save menu configuration'
            }, { quoted: m });
        }
    } catch (error) {
        console.error('Error setting menu preset 5:', error);
        await conn.sendMessage(m.chat, {
            text: '❌ Error setting menu arrangement'
        }, { quoted: m });
    }
}

async function setMenu6(conn, m) {
    try {
        const menuConfig = loadMenuConfig();
        if (saveMenuConfig({ ...menuConfig, preset: 'preset6' })) {
            await conn.sendMessage(m.chat, {
                text: '✅ Menu arrangement set to **Preset 6** (Owner & Features Focus)'
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, {
                text: '❌ Failed to save menu configuration'
            }, { quoted: m });
        }
    } catch (error) {
        console.error('Error setting menu preset 6:', error);
        await conn.sendMessage(m.chat, {
            text: '❌ Error setting menu arrangement'
        }, { quoted: m });
    }
}

// Set Awesome Menu Format
async function setAwesomeMenu(conn, m) {
    try {
        const menuConfig = loadMenuConfig();
        if (saveMenuConfig({ ...menuConfig, style: MENU_STYLES.AWESOME })) {
            await conn.sendMessage(m.chat, {
                text: '✨ *Awesome Menu Format Activated!*\n\nNow your menu will display in the new awesome format with fancy borders and symbols! 🎉\n\nUse *.resetmenu* to go back to default format.'
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
                text: '🔄 *Menu Format Reset to Default!*\n\nYour menu is now back to the original/default format.\n\nUse *.setawesomemenu* to switch to the awesome format.'
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
        const { currentPreset, currentStyle, currentOrder, menuSections } = await generateMenu(conn, m, '.', {});

        const presetNames = {
            'preset1': 'Default Order',
            'preset2': 'Download & AI Focus', 
            'preset3': 'Features & AI Focus',
            'preset4': 'AI & Fun Focus',
            'preset5': 'Download & Audio Focus',
            'preset6': 'Owner & Features Focus'
        };

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
                  `✨ *Style:* ${styleNames[currentStyle]}\n` +
                  `🔧 *Preset:* ${presetNames[currentPreset]}\n\n` +
                  `📑 *Section Order:*\n${orderList}\n\n` +
                  `⚙️ *Commands:*\n` +
                  `• *.setawesomemenu* - Switch to awesome format\n` +
                  `• *.resetmenu* - Back to default format\n` +
                  `• *.currentmenu* - Show this info\n` +
                  `• *.setmenu1-6* - Change section order`
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
    setMenu1,
    setMenu2,
    setMenu3,
    setMenu4,
    setMenu5,
    setMenu6,
    setAwesomeMenu,
    resetMenu,
    showCurrentMenu,
    loadMenuConfig,
    menuPresets,
    MENU_STYLES
};
[file content end]