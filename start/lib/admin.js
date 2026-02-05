async function isAdminKelvin(conn, chatId, senderId) {
    try {
        const groupMetadata = await conn.groupMetadata(chatId);
        
        // Get bot ID properly
        const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';
        
        const participant = groupMetadata.participants.find(p => 
            p.id === senderId || 
            p.id === senderId.replace('@s.whatsapp.net', '@lid') ||
            p.id === senderId.replace('@lid', '@s.whatsapp.net')
        );
        
        const bot = groupMetadata.participants.find(p => 
            p.id === botId || 
            p.id === botId.replace('@s.whatsapp.net', '@lid')
        );
        
        const isBotAdmin = bot && (bot.admin === 'admin' || bot.admin === 'superadmin');
        const isSenderAdmin = participant && (participant.admin === 'admin' || participant.admin === 'superadmin');

        // If bot not found in participants (edge case), assume it's admin
        if (!bot) {
            return { isSenderAdmin, isBotAdmin: true };
        }

        return { isSenderAdmin, isBotAdmin };
    } catch (error) {
        console.error('Error in isAdmin:', error);
        return { isSenderAdmin: false, isBotAdmin: false };
    }
}

module.exports = { isAdminKelvin };
