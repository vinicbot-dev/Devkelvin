const moment = require('moment-timezone');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { sendButtons } = require('gifted-btns');

async function githubCommand(conn, chatId, message) {
    try {
        // Fetch GitHub repository data
        const res = await fetch('https://api.github.com/repos/Kevintech-hub/Jexploit-Bot');
        const json = await res.json();

        const ownerName = global.ownername || 'Kelvin Tech';
        
        const txt = `
📁 *${json.name}*

⭐ *Stars:* ${json.stargazers_count}
🍴 *Forks:* ${json.forks_count}
👁️ *Watchers:* ${json.watchers_count}
📦 *Size:* ${(json.size / 1024).toFixed(2)} MB
📅 *Updated:* ${moment(json.updated_at).format('DD/MM/YYYY HH:mm:ss')}
📝 *Desc:* ${json.description || 'No description'}

👑 *Owner:* ${ownerName}

> Please ⭐ star and fork the repository!
`;

        // Get image from Media folder
        const imagePath = path.join(__dirname, '../../start/lib/Media/Jexploit1.jpg');
        let imageBuffer = null;
        
        if (fs.existsSync(imagePath)) {
            imageBuffer = fs.readFileSync(imagePath);
        }

        // Buttons configuration
        const buttons = [
            {
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                    display_text: '🔗 Open Repository',
                    url: json.html_url
                })
            },
            {
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                    display_text: '📦 Download ZIP',
                    url: `${json.html_url}/archive/refs/heads/main.zip`
                })
            }
        ];

        // Send image + caption + buttons all together
        await sendButtons(conn, chatId, {
            title: '📁 JEXPLOIT REPOSITORY',
            text: txt,
            footer: 'Powered by Jexploit',
            image: imageBuffer,
            buttons: buttons
        }, { quoted: message });

    } catch (error) {
        console.error('Error in github command:', error);
        await conn.sendMessage(chatId, { 
            text: '❌ Error fetching repository.\n\n🔗 https://github.com/Kevintech-hub/Jexploit-Bot' 
        }, { quoted: message });
    }
}

module.exports = githubCommand;