// ========== AUTO-REACT FUNCTION (USING GLOBAL VARIABLE) ==========
async function handleAutoReact(m, conn) {
    try {
        // Check if auto-react is enabled using global variable
        if (!global.autoreact) {
            return;
        }

        // Don't react to bot's own messages
        const sender = m.key.participant || m.key.remoteJid;
        const botNumber = await conn.decodeJid(conn.user.id);
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
        console.error("❌ Error in auto-react:", error);
    }
}

module.exports = { handleAutoReact };