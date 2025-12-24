const { getSetting } = require('../../start/Core/settingManager.js');

/**
 * Generate bot settings display text
 * @param {string} botNumber - The bot's WhatsApp number
 * @param {string} prefix - Current bot prefix
 * @returns {string} Formatted settings text
 */
function generateSettingsText(botNumber, prefix) {
   
    // Get all settings
    const antidelete = getSetting(botNumber, 'antidelete', 'off');
    const antiedit = getSetting(botNumber, 'antiedit', 'off');
    const anticall = getSetting(botNumber, 'anticall', 'off');
    const autorecording = getSetting(botNumber, 'autorecording', false);
    const autoTyping = getSetting(botNumber, 'autoTyping', false);
    const autoread = getSetting(botNumber, 'autoread', false);
    const autoreact = getSetting(botNumber, 'autoreact', false);
    const AI_CHAT = getSetting(botNumber, 'AI_CHAT', false);
    const antilinkdelete = getSetting(botNumber, 'antilinkdelete', true);
    const antilinkaction = getSetting(botNumber, 'antilinkaction', 'delete');
    const antibadword = getSetting(botNumber, 'antibadword', false);
    const antibadwordaction = getSetting(botNumber, 'antibadwordaction', 'delete');
    const antitag = getSetting(botNumber, 'antitag', false);
    const antitagaction = getSetting(botNumber, 'antitagaction', 'delete');
    const welcome = getSetting(botNumber, 'welcome', true);
    const adminevent = getSetting(botNumber, 'adminevent', true);
    const autoviewstatus = getSetting(botNumber, 'autoviewstatus', false);
    const autoreactstatus = getSetting(botNumber, 'autoreactstatus', false);
    const statusemoji = getSetting(botNumber, 'statusemoji', '💚');
    
    return `*BOT SETTINGS STATUS*

Prefix: ${prefix}
Anti-Delete: ${antidelete !== 'off' ? 'ON (' + antidelete + ')' : 'OFF'}
Anti-Edit: ${antiedit !== 'off' ? 'ON (' + antiedit + ')' : 'OFF'}
Anti-Call: ${anticall !== 'off' ? 'ON (' + anticall + ')' : 'OFF'}
Auto-Recording: ${autorecording ? 'ON' : 'OFF'}
Auto-Typing: ${autoTyping ? 'ON' : 'OFF'}
Auto-Read: ${autoread ? 'ON' : 'OFF'}
Auto-React: ${autoreact ? 'ON' : 'OFF'}
AI Chatbot: ${AI_CHAT ? 'ON' : 'OFF'}
Auto-View Status: ${autoviewstatus ? 'ON' : 'OFF'}
Auto-React Status: ${autoreactstatus ? 'ON (' + statusemoji + ')' : 'OFF'}
Anti-Link: ${antilinkdelete ? 'ON (' + antilinkaction + ')' : 'OFF'}
Anti-Badword: ${antibadword ? 'ON (' + antibadwordaction + ')' : 'OFF'}
Anti-Tag: ${antitag ? 'ON (' + antitagaction + ')' : 'OFF'}
Welcome Message: ${welcome ? 'ON' : 'OFF'}
Admin Events: ${adminevent ? 'ON' : 'OFF'}

Commands:
${prefix}setprefix <new> - Change prefix (1-3 chars)
${prefix}set <option> <value> - Change other settings
${prefix}settings - View current settings

All settings saved to JSON database.`;
}

/**
 * Get all settings as an object
 * @param {string} botNumber - The bot's WhatsApp number
 * @returns {Object} All settings as key-value pairs
 */
function getAllSettings(botNumber) {
    return {
        prefix: getSetting(botNumber, 'prefix', '.'),
        antidelete: getSetting(botNumber, 'antidelete', 'off'),
        antiedit: getSetting(botNumber, 'antiedit', 'off'),
        anticall: getSetting(botNumber, 'anticall', 'off'),
        autorecording: getSetting(botNumber, 'autorecording', false),
        autoTyping: getSetting(botNumber, 'autoTyping', false),
        autoread: getSetting(botNumber, 'autoread', false),
        autoreact: getSetting(botNumber, 'autoreact', false),
        AI_CHAT: getSetting(botNumber, 'AI_CHAT', false),
        antilinkdelete: getSetting(botNumber, 'antilinkdelete', true),
        antilinkaction: getSetting(botNumber, 'antilinkaction', 'delete'),
        antibadword: getSetting(botNumber, 'antibadword', false),
        antibadwordaction: getSetting(botNumber, 'antibadwordaction', 'delete'),
        antitag: getSetting(botNumber, 'antitag', false),
        antitagaction: getSetting(botNumber, 'antitagaction', 'delete'),
        welcome: getSetting(botNumber, 'welcome', true),
        adminevent: getSetting(botNumber, 'adminevent', true),
        autoviewstatus: getSetting(botNumber, 'autoviewstatus', false),
        autoreactstatus: getSetting(botNumber, 'autoreactstatus', false),
        statusemoji: getSetting(botNumber, 'statusemoji', '💚')
    };
}

function getReadReceiptDescription(option) {
    const descriptions = {
        "all": "• ✅ Everyone can see your read receipts (blue ticks)",
        "contacts": "• 🤝 Only your contacts can see your read receipts", 
        "none": "• 🙈 No one can see your read receipts (read receipts off)"
    };
    return descriptions[option] || "Privacy setting updated";
}

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

// Export the functions
module.exports = {
    generateSettingsText,
    getAllSettings,
    getReadReceiptDescription,
    getLastSeenDescription,
    getOnlineDescription,
    getProfilePictureDescription,
    getGroupAddDescription,
    checkAccess
};