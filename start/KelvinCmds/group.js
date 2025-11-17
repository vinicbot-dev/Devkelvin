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

module.exports = { getActiveUsers, getInactiveUsers, addUserMessage }