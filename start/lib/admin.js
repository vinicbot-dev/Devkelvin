async function isAdminKelvin(conn, chatId, senderId) {
    try {
        const groupMetadata = await conn.groupMetadata(chatId);
        
        // Get bot ID properly
        const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';
        
        // Collect ALL admins in ALL formats
        const admins = [];
        let senderAdminStatus = false;
        let botAdminStatus = false;
        
        for (const p of groupMetadata.participants) {
            const isAdmin = p.admin === 'admin' || p.admin === 'superadmin';
            
            if (isAdmin) {
                // Add all possible JID formats for this admin
                if (p.jid) {
                    admins.push(p.jid);
                    admins.push(p.jid.replace('@s.whatsapp.net', '@lid'));
                    admins.push(p.jid.replace('@lid', '@s.whatsapp.net'));
                }
                if (p.id) {
                    admins.push(p.id);
                    admins.push(p.id.replace('@s.whatsapp.net', '@lid'));
                    admins.push(p.id.replace('@lid', '@s.whatsapp.net'));
                }
                if (p.lid) {
                    admins.push(p.lid);
                    admins.push(p.lid.replace('@lid', '@s.whatsapp.net'));
                }
            }
            
            // Check if this participant is the sender
            const possibleSenderFormats = [
                senderId,
                senderId.replace('@s.whatsapp.net', '@lid'),
                senderId.replace('@lid', '@s.whatsapp.net'),
                senderId.split('@')[0] + '@s.whatsapp.net',
                senderId.split('@')[0] + '@lid'
            ];
            
            if (possibleSenderFormats.includes(p.jid) || 
                possibleSenderFormats.includes(p.id) || 
                possibleSenderFormats.includes(p.lid)) {
                senderAdminStatus = isAdmin;
            }
            
            // Check if this participant is the bot
            const possibleBotFormats = [
                botId,
                botId.replace('@s.whatsapp.net', '@lid'),
                botId.split('@')[0] + '@lid'
            ];
            
            if (possibleBotFormats.includes(p.jid) || 
                possibleBotFormats.includes(p.id) || 
                possibleBotFormats.includes(p.lid)) {
                botAdminStatus = isAdmin;
            }
        }

        return { 
            isSenderAdmin: senderAdminStatus, 
            isBotAdmin: botAdminStatus,
            admins: [...new Set(admins)] // Return unique admins
        };
        
    } catch (error) {
        console.error('Error in isAdminKelvin:', error);
        return { 
            isSenderAdmin: false, 
            isBotAdmin: false,
            admins: [] 
        };
    }
}
module.exports = { isAdminKelvin };