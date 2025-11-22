// ========== AUTO-READ MESSAGE HANDLER ==========
async function handleAutoRead(m, conn, botNumber) {
    try {
        // Get auto-read setting from database
        const settings = global.db.getSettings(botNumber);
        const autoReadSetting = settings?.autoread || false;
        
        // Check if auto-read is enabled
        if (!autoReadSetting) {
            return;
        }

        // Don't mark bot's own messages as read
        if (m.key.fromMe) return;

        // Mark message as read - CORRECT BAILEYS METHOD
        await conn.readMessages([m.key]);
        
    } catch (error) {
        console.error("Error in auto-read:", error);
    }
}

module.exports = { handleAutoRead };