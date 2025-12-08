// Active Users Tracking Functions
function addUserMessage(groupJid, userJid) {
    try {
        if (!global.db.data.groups) global.db.data.groups = {};
        if (!global.db.data.groups[groupJid]) {
            global.db.data.groups[groupJid] = {
                activeUsers: {}
            };
        }
        
        if (!global.db.data.groups[groupJid].activeUsers) {
            global.db.data.groups[groupJid].activeUsers = {};
        }
        
        if (!global.db.data.groups[groupJid].activeUsers[userJid]) {
            global.db.data.groups[groupJid].activeUsers[userJid] = {
                count: 0,
                lastActive: Date.now()
            };
        }
        
        global.db.data.groups[groupJid].activeUsers[userJid].count++;
        global.db.data.groups[groupJid].activeUsers[userJid].lastActive = Date.now();
        
        return true;
    } catch (error) {
        console.error('Error adding user message:', error);
        return false;
    }
}

function getActiveUsers(groupJid, limit = 10) {
    try {
        if (!global.db.data.groups || !global.db.data.groups[groupJid] || !global.db.data.groups[groupJid].activeUsers) {
            return [];
        }
        
        const users = Object.entries(global.db.data.groups[groupJid].activeUsers)
            .map(([jid, data]) => ({
                jid: jid,
                count: data.count,
                lastActive: data.lastActive
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
        
        return users;
    } catch (error) {
        console.error('Error getting active users:', error);
        return [];
    }
}

function clearActiveUsers(groupJid = null) {
    try {
        if (groupJid) {
            // Clear specific group
            if (global.db.data.groups && global.db.data.groups[groupJid]) {
                global.db.data.groups[groupJid].activeUsers = {};
            }
        } else {
            // Clear all groups
            if (global.db.data.groups) {
                Object.keys(global.db.data.groups).forEach(gid => {
                    global.db.data.groups[gid].activeUsers = {};
                });
            }
        }
        return true;
    } catch (error) {
        console.error('Error clearing active users:', error);
        return false;
    }
}

function getInactiveUsers(groupJid, allParticipants) {
    try {
        if (!global.db.data.groups || !global.db.data.groups[groupJid] || !global.db.data.groups[groupJid].activeUsers) {
            return allParticipants || [];
        }
        
        const activeJids = Object.keys(global.db.data.groups[groupJid].activeUsers);
        const inactiveUsers = allParticipants.filter(jid => !activeJids.includes(jid));
        
        return inactiveUsers;
    } catch (error) {
        console.error('Error getting inactive users:', error);
        return allParticipants || [];
    }
}

// Better admin tracking function
async function isAdmin(sender, m, botId, conn) {
    try {
        // If not a group, return false
        if (!m.isGroup) return false;
        
        // Get group metadata using conn
        const groupMetadata = await conn.groupMetadata(m.chat);
        if (!groupMetadata) return false;
        
        // Get participants/admins
        const participants = groupMetadata.participants || [];
        
        // Find the sender in participants
        const senderParticipant = participants.find(p => p.id === sender);
        
        // Check if sender is admin
        if (senderParticipant && 
            (senderParticipant.admin === 'admin' || 
             senderParticipant.admin === 'superadmin')) {
            return true;
        }
        
        // Check if sender is the bot itself
        if (sender === botId) return true;
        
        return false;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

// Admin check helper function
async function checkAdminStatus(m, conn) {
    if (!m.isGroup) return false;
    
    try {
        const botNumber = await conn.decodeJid(conn.user.id);
        return await isAdmin(m.sender, m, botNumber, conn);
    } catch (error) {
        console.error('Error in checkAdminStatus:', error);
        return false;
    }
}

module.exports = { getActiveUsers, isAdmin, getInactiveUsers, checkAdminStatus, addUserMessage }