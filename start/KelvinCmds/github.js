const moment = require('moment-timezone');
const axios = require('axios');
const { sendButtons } = require('gifted-btns');

async function githubCommand(conn, chatId, message) {
    try {
        // Fetch GitHub repository data
        const response = await axios.get('https://api.github.com/repos/Kevintech-hub/Jexploit-Bot');
        const json = response.data;

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

        // Image URL – always available and reliable
        const imageUrl = 'https://files.catbox.moe/atfp7w.jpg';

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

        // Send image + caption + buttons together
        await sendButtons(conn, chatId, {
            title: '📁 JEXPLOIT REPOSITORY',
            text: txt,
            footer: 'Powered by Jexploit',
            image: { url: imageUrl },  // ✅ use URL object, not Buffer
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