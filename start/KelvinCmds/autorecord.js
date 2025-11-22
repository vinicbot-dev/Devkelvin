async function handleAutoRecording(m, conn, botNumber) {
    try {
        // Get auto-recording setting from database
        const settings = global.db.getSettings(botNumber);
        const autoRecordingSetting = settings?.autorecording || false;
        
        // Check if auto-recording is enabled
        if (!autoRecordingSetting) {
            return;
        }

        // Don't respond to own messages or in large groups to avoid spam
        if (m.key.fromMe || (m.isGroup && participants.length > 50)) {
            return;
        }

        // Send recording indicator (voice message recording)
        await conn.sendPresenceUpdate('recording', m.chat);
        
        // Stop recording after 3 seconds
        setTimeout(async () => {
            await conn.sendPresenceUpdate('paused', m.chat);
        }, 3000);
        
    } catch (error) {
        console.error("Error in auto-recording:", error);
    }
}

module.exports = { handleAutoRecording };