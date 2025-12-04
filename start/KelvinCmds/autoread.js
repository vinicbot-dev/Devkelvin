async function handleAutoRead(m, conn) {
    try {
        const botNumber = await conn.decodeJid(conn.user.id);
        
        // Get auto-read setting from JSON manager
        const autoread = global.settingsManager?.getSetting(botNumber, 'autoread', false);
        
        // Check if auto-read is enabled
        if (!autoread) {
            return;
        }

        // Don't mark bot's own messages as read
        if (m.key.fromMe) return;

        // Mark message as read - CORRECT BAILEYS METHOD
        await conn.readMessages([m.key]);
        
        
        
    } catch (error) {
        console.error("❌ Error in auto-read:", error);
    }
}

module.exports = { handleAutoRead };