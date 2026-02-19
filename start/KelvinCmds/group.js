const db = require('../../start/Core/databaseManager');

async function addUserMessage(conn, groupJid, userJid) {
    try {
        // Get bot number from connection
        const botNumber = await conn.decodeJid(conn.user.id);
        
        // Get current active users from SQLite
        let activeUsers = await db.get(botNumber, `active_${groupJid}`, {});
        
        // Initialize or update user
        if (!activeUsers[userJid]) {
            activeUsers[userJid] = {
                count: 0,
                lastActive: Date.now()
            };
        }
        
        // Increment count
        activeUsers[userJid].count++;
        activeUsers[userJid].lastActive = Date.now();
        
        // Save back to SQLite
        await db.set(botNumber, `active_${groupJid}`, activeUsers);
        
        return true;
    } catch (error) {
        console.error('Error in addUserMessage:', error);
        return false;
    }
}

// Update other functions too
async function getActiveUsers(conn, groupJid, limit = 10) {
    try {
        const botNumber = await conn.decodeJid(conn.user.id);
        const activeUsers = await db.get(botNumber, `active_${groupJid}`, {});
        
        return Object.entries(activeUsers)
            .map(([jid, data]) => ({
                jid: jid,
                count: data.count,
                lastActive: data.lastActive
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    } catch (error) {
        console.error('Error in getActiveUsers:', error);
        return [];
    }
}

async function clearActiveUsers(conn, groupJid = null) {
    try {
        const botNumber = await conn.decodeJid(conn.user.id);
        
        if (groupJid) {
            // Clear specific group
            await db.set(botNumber, `active_${groupJid}`, {});
        } else {
            // This would need to clear all groups - you'd need to get all keys
            // For now, we'll just log that this operation isn't supported
            console.log('Clearing all groups not supported - would need key enumeration');
        }
        return true;
    } catch (error) {
        console.error('Error clearing active users:', error);
        return false;
    }
}

async function getInactiveUsers(conn, groupJid, allParticipants) {
    try {
        const botNumber = await conn.decodeJid(conn.user.id);
        
        // Get active users from database
        const activeUsers = await db.get(botNumber, `active_${groupJid}`, {});
        
        const activeJids = Object.keys(activeUsers);
        const inactiveUsers = allParticipants.filter(jid => !activeJids.includes(jid));
        
        return inactiveUsers;
    } catch (error) {
        console.error('Error getting inactive users:', error);
        return allParticipants || [];
    }
}

async function isAdmin(conn, chatId, senderId) {
    try {
        const groupMetadata = await conn.groupMetadata(chatId);
        
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

        if (!bot) {
            return { isSenderAdmin, isBotAdmin: true };
        }

        return { isSenderAdmin, isBotAdmin };
    } catch (error) {
        console.error('Error in isAdmin:', error);
        return { isSenderAdmin: false, isBotAdmin: false };
    }
}

module.exports = { 
    getActiveUsers, 
    isAdmin, 
    getInactiveUsers, 
    addUserMessage 
};