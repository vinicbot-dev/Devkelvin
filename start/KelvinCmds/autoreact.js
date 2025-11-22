// ========== AUTO-REACT FUNCTION (DATABASE-BASED) ==========
async function handleAutoReact(m, conn, botNumber) {
    try {
        // Get auto-react setting from database
        const settings = global.db.getSettings(botNumber);
        const autoReactSetting = settings?.autoreact || false;
        
        // Check if auto-react is enabled
        if (!autoReactSetting) return;

        // Don't react to bot's own messages
        const sender = m.key.participant || m.key.remoteJid;
        if (sender === botNumber) return;

        // List of common emoji reactions
        const reactions = ['👍', '❤️', '😂', '😮', '😢', '🔥', '👏', '🎉', '🤩', '🙏', '💯', '👀', '✨', '🥳', '😎'];
        
        // Pick a random reaction
        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
        
        // Send the reaction
        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: randomReaction,
                key: m.key
            }
        });
        
    } catch (error) {
        console.error("Error in auto-react:", error);
    }
}

module.exports = { handleAutoReact };