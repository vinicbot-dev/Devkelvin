// ========== AUTO-READ MESSAGE HANDLER (USING GLOBAL VARIABLE) ==========
async function handleAutoRead(m, conn) {
    try {
        // Check if auto-read is enabled using global variable
        if (!global.autoread) {
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