// ========== AUTO-TYPING INDICATOR HANDLER (USING JSON SETTINGS) ==========
async function handleAutoTyping(m, conn) {
    try {
        const botNumber = await conn.decodeJid(conn.user.id);
        
        // Get auto-typing setting from JSON manager
        const autoTyping = global.settingsManager?.getSetting(botNumber, 'autoTyping', false);
        
        // Check if auto-typing is enabled
        if (!autoTyping) {
            return;
        }

        // Don't respond to own messages
        if (m.key.fromMe) return;

        // For groups, check participant count to avoid spam
        if (m.isGroup) {
            try {
                const groupMetadata = await conn.groupMetadata(m.chat);
                if (groupMetadata.participants.length > 50) {
                    return; // Skip large groups to avoid spam
                }
            } catch (error) {
                console.error("❌ Error getting group metadata:", error);
                return;
            }
        }

        // Send typing indicator
        await conn.sendPresenceUpdate('composing', m.chat);
        
        
        
        // Stop typing after 5 seconds
        setTimeout(async () => {
            await conn.sendPresenceUpdate('paused', m.chat);
        }, 5000);
        
    } catch (error) {
        console.error("❌ Error in auto-typing:", error);
    }
}

module.exports = { handleAutoTyping };