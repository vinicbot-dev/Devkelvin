const db = require('../../start/Core/databaseManager');

async function handleAutoRecording(m, conn) {
    try {
        const botNumber = await conn.decodeJid(conn.user.id);
        
        // ✅ GET AUTO-RECORDING SETTING FROM SQLITE
        const autorecording = await db.get(botNumber, 'autorecording', false);
        
        // Check if auto-recording is enabled
        if (!autorecording) {
            return;
        }

        // Don't respond to own messages
        if (m.key.fromMe) return;

        // Check if it's a group and get participant count safely
        if (m.isGroup) {
            try {
                const groupMetadata = await conn.groupMetadata(m.chat);
                const participants = groupMetadata.participants || [];
                
                // Don't auto-record in large groups to avoid spam
                if (participants.length > 50) return;
            } catch (error) {
                console.error("❌ Error getting group metadata:", error);
                return;
            }
        }

        // Send recording indicator (voice message recording)
        await conn.sendPresenceUpdate('recording', m.chat);
        
        // Stop recording after 5 seconds
        setTimeout(async () => {
            await conn.sendPresenceUpdate('paused', m.chat);
        }, 5000);
        
    } catch (error) {
        console.error("❌ Error in auto-recording:", error);
    }
}

module.exports = { handleAutoRecording };