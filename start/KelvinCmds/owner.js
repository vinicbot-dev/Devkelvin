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

function checkAccess(sender, botNumber) {
    // Normalize the sender number
    const normalizedSender = sender.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    
    // Get owner number from SettingsManager
    const ownerNumber = getSetting(botNumber, 'ownernumber', '');
    const ownerJid = ownerNumber ? ownerNumber.replace(/[^0-9]/g, "") + "@s.whatsapp.net" : '';
    
    // Get sudo users from SettingsManager
    const sudoUsers = getSudo(botNumber) || [];
    
    // Create array of all authorized numbers (normalized)
    const authorizedNumbers = [
        botNumber.replace(/[^0-9]/g, "") + "@s.whatsapp.net", // Bot itself
        devKelvin, // Your dev number
        ownerJid, // Owner from database
        ...sudoUsers // Sudo users from database
    ].filter(num => num); // Remove empty strings
    
    // Check if sender is in authorized list
    return authorizedNumbers.includes(normalizedSender);
}



// Export the functions
module.exports = {
    generateSettingsText,
    getAllSettings,
    checkAccess
};