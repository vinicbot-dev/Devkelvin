// ========== AUTO-TYPING INDICATOR HANDLER ==========
async function handleAutoTyping(m, conn, botNumber) {
    try {
        // Get auto-typing setting from database
        const settings = global.db.getSettings(botNumber);
        const autoTypingSetting = settings?.autotyping || false;
        
        // Check if auto-typing is enabled
        if (!autoTypingSetting) {
            return;
        }

        // Don't respond to own messages
        if (m.key.fromMe) {
            return;
        }

        // For groups, check participant count to avoid spam
        if (m.isGroup) {
            try {
                const groupMetadata = await conn.groupMetadata(m.chat);
                if (groupMetadata.participants.length > 50) {
                    return; // Skip large groups to avoid spam
                }
            } catch (error) {
                console.error("Error getting group metadata:", error);
                return;
            }
        }

        // Send typing indicator
        await conn.sendPresenceUpdate('composing', m.chat);
        
        // Stop typing after 3 seconds
        setTimeout(async () => {
            await conn.sendPresenceUpdate('paused', m.chat);
        }, 3000);
        
    } catch (error) {
        console.error("Error in auto-typing:", error);
    }
}

module.exports = { handleAutoTyping };