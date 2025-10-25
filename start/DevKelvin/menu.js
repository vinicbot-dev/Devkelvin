const os = require('os');

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
    // Calculate memory usage
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const systemUsedMemory = totalMemory - freeMemory;
    
    // Define menu sections for organization
    const menuSections = {
        header: {
            title: '🔥ᴠɪɴɪᴄ xᴍᴅ🔮',
            content: [
                `👤 ᴜsᴇʀ: ${global.ownername}`,
                `🤖 ʙᴏᴛɴᴀᴍᴇ: ${global.botname}`,
                `🌍 ᴍᴏᴅᴇ: ${conn.public ? 'ᴘᴜʙʟɪᴄ' : 'ᴘʀɪᴠᴀᴛᴇ'}`,
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
                'hack', 'groupjids', 'broadcast', 'disappear', 'disappearstatus', 'clearchat', 
                'react', 'restart', 'addignorelist', 'delignorelist', 'deljunk', 'features',
                'listblocked', 'listsudo', 'setprofilename', 'listignored', 'online', 'join', 
                'leave', 'setbio', 'backup', 'reqeust', 'block', 'gpass', 'toviewonce', 
                'setownername', 'setbotname', 'unblock', 'unblockall', 'gcaddprivacy', 
                'ppprivancy', 'tostatus', 'vv', 'vv2', 'idch', 'getpp',
            ],
        },
        group: {
            title: ' *GROUP MENU* ',
            commands: [
                '𝖧𝗂𝖽𝖾𝗍𝖺𝗀', '𝖪𝗂𝖼𝗄', '𝖱𝖾𝗌𝖾𝗍𝗅𝗂𝗇𝗄', 'linkgc', 'checkchan', 'antilink', 
                'listonline', 'add', 'listactive', 'listinactive', 'close', 'open', 'kick', 
                'topchatters', 'listadmin', 'kickall', 'closetime', 'groupdisappear', 
                'tagall2', 'lockgc', 'unlockgc', 'opentime', 'poll', 'totalmembers', 
                'mediatag', 'getgrouppp', 'antilink', 'tagall', 'groupinfo', 'kick2', 
                'tagadmin2', 'setgroupname', 'delgrouppp', 'invite', 'editinfo', 'approve', 
                'disapproveall', 'listrequest', 'promote', 'demote', 'setdisc', 'vcf',
            ],
        },
        ai: {
            title: ' *AI MENU*',
            commands: ['generate', 'ai', 'copilot', 'deepseek', 'flux', 'gpt'],
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
            title: ' *FEATURES MENU*',
            commands: ['antidelete', 'anticall', 'antibug', 'autorecording', 'autotyping', 
                      'welcome', 'chatbot', 'autoread', 'adminevent', 'autoviewstatus', 
                      'autoreactstatus', 'antiedit'],
        },
        download: {
            title: ' *DOWNLOAD MENU* ',
            commands: ['play', 'play2', 'song', 'song2', 'gitclone', 'ringtone', 
                      'download', 'pinterest', 'mediafire', 'itunes', 'ytmp4', 'ytstalk', 
                      'apk', 'gdrive', 'playdoc', 'tiktok', 'tiktok2', 'instagram', 
                      'video', 'video2', 'tiktokaudio', 'save', 'facebook'],
        },
        
        convert: {
            title: ' *CONVERT MENU* ',
            commands: ['toaudio', 'toimage', 'url', 'tovideo', 'topdf', 'sticker'],
        },
        cmdTool: {
            title: ' *BOTSTATUS MENU* ',
            commands: ['ping', 'bothosting', 'repo', 'botstatus', 'botinfo', 'sc', 
                      'serverinfo', 'alive'],
        },
        other: {
            title: ' *TOOLS MENU*',
            commands: ['time', 'calculate', 'owner', 'dev', 'fliptext', 'translate', 
                      'ss2', 'sswebpc', 'kevinfarm', 'say', 'getdevice', 'ss', 'userinfo', 
                      'npm', 'take', 'checkapi', 'footballhelp', 'qrcode', 'gsmarena', 
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
                      'effectclouds', 'flagtext', 'freecreat', 'galaxystyle', 'papercut', 'holigram', 'royal', 'bear', 'galaxywallpaper', 
                      'glowingtext', 'makingneon', 'matrix', 'royaltext', 'sand', 'summerbeach', 
                      'topography', 'typography', 'flux', 'dragonball'],
        },
        search: {
            title: ' *SEARCH MENU* ',
            commands: ['lyrics', 'chord', 'weather', 'movie', 'define', 'gitstalk', 
                      'tiktokstalk', 'ytsearch', 'shazam'],
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
    };

    // Function to format the menu
    const formatMenu = () => {
        let menu = `╭═✦〔 🤖 ᴠɪɴɪᴄ xᴅ 〕✦═╮\n`;
        menu += menuSections.header.content.map(line => `┃ ${line}`).join('\n') + '\n';
        menu += `╰═✦═════════════╯\n\n`;

        for (const section of Object.values(menuSections).slice(1)) {
            menu += `╭━◈${section.title.toUpperCase()} ◈\n`;
            menu += section.commands.map(cmd => `│ ➸ ${prefix}${cmd}`).join('\n') + '\n';
            menu += `┗▣\n\n`;
        }
             
        menu += `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋᴇʟᴠɪɴ ᴛᴇᴄʜ `;
        return menu;
    };

    return {
        formatMenu,
        menuSections
    };
}

// Function to send the menu
async function sendMenu(conn, m, prefix, global) {
    try {
        const { formatMenu } = await generateMenu(conn, m, prefix, global);
        
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
                showAdAttribution: true,
                title: global.botname || 'ᴠɪɴɪᴄ xᴍᴅ',
                body: '☘ ᴋᴇʟᴠɪɴ ᴛᴇᴄʜ ☘',
                mediaType: 3,
                renderLargerThumbnail: false,
                thumbnail: global.cina || 'https://files.catbox.moe/ptpl5c.jpeg', 
                sourceUrl: 'https://whatsapp.com/channel/0029Vb6eR1r05MUgYul6Pc2W',
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
    getCommandList
};