const moment = require('moment-timezone');
const fetch = require('node-fetch');

async function githubCommand(conn, chatId, message) {
  try {
    // Use your GitHub repository
      const res = await fetch('https://api.github.com/repos/Kevintech-hub/Jexploit-Bot');
    const json = await res.json();

    const botName = global.botname || 'Jexploit';
    const ownerName = global.ownername || 'Kelvin Tech';
    
    const txt = `
 *JEXPLOIT BOT REPOSITORY*

 *Repository:* ${json.name}
 *Stars:* ${json.stargazers_count}
 *Forks:* ${json.forks_count}
 *Watchers:* ${json.watchers_count}
 *Size:* ${(json.size / 1024).toFixed(2)} MB
 *Last Updated:* ${moment(json.updated_at).format('DD/MM/YYYY HH:mm:ss')}
 *Description:* ${json.description || 'No description'}
 *Owner:* ${ownerName}
🔗 *URL:* ${json.html_url}

🔗 *Session Id:* 
https://vinic-xmd-pairing-site-dsf-crew-devs.onrender.com/

 *Please fork and star the repository!*
 *Powered by Kelvin Tech*
`;

    // Try to send with image first, fallback to text
    try {
        await conn.sendMessage(
            chatId,
            {
                image: { url: 'https://files.catbox.moe/9sazwf.jpg' }, // Your bot image
                caption: txt
            },
            { quoted: message }
        );
    } catch (imageError) {
        // Fallback to text only if image fails
        console.log('Image send failed, using text only:', imageError);
        await conn.sendMessage(
            chatId,
            { text: txt },
            { quoted: message }
        );
    }

  } catch (error) {
    console.error('Error in github command:', error);
    await conn.sendMessage(
        chatId, 
        { 
            text: '❌ Error fetching repository information.\n\n🔗 Manual link: https://github.com/Kevintech-hub/Vinic-Xmd-' 
        }, 
        { quoted: message }
    );
  }
}

module.exports = githubCommand;