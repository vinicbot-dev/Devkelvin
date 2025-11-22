const fs = require('fs');
const SQLiteDB = require('../../lib/sqlite');
// ========== DATABASE MANAGEMENT FUNCTIONS ==========

// Initialize database
function initializeDatabase() {
    try {
        if (!global.db) {
            global.db = new SQLiteDB();
        }
        console.log('📊 SQLite database ready');
        return true;
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        return false;
    }
}

// Save database function
async function saveDatabase(botNumber = null, settings = null) {
    try {
        if (botNumber && settings) {
            // Save specific bot settings
            global.db.saveSettings(botNumber, settings);
        } else {
            // Save all in-memory data (for backward compatibility)
            for (const [botNum, config] of Object.entries(global.db.data.settings)) {
                global.db.saveSettings(botNum, config);
            }
        }
        return true;
    } catch (error) {
        console.error('Error saving to database:', error);
        return false;
    }
}

// Load settings from database
function loadSettingsFromDB(botNumber) {
    try {
        const settings = global.db.getSettings(botNumber);
        if (settings) {
            // Apply settings to global variables
            const settingMap = {
                'antidelete': 'antidelete',
                'antiedit': 'antiedit',
                'autoread': 'autoread',
                'autoreact': 'autoreact',
                'autoviewstatus': 'autoviewstatus',
                'autoreactstatus': 'autoreactstatus',
                'anticall': 'anticall',
                'welcome': 'welcome',
                'adminevent': 'adminevent',
                'antistatus': 'antistatus',
                'AI_CHAT': 'AI_CHAT'
            };

            for (const [dbKey, globalKey] of Object.entries(settingMap)) {
                if (settings[dbKey] !== undefined) {
                    global[globalKey] = settings[dbKey];
                }
            }
            return true;
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
    return false;
}

// Save settings to database
function saveSettingsToDB(botNumber) {
    try {
        const settings = {
            antidelete: global.antidelete,
            antiedit: global.antiedit,
            autoread: global.autoread,
            autoreact: global.autoreact,
            autoviewstatus: global.autoviewstatus,
            autoreactstatus: global.autoreactstatus,
            anticall: global.anticall,
            antistatus: global.antistatus,
            AI_CHAT: global.AI_CHAT
        };
        
        global.db.saveSettings(botNumber, settings);
        return true;
    } catch (error) {
        console.error('Error saving settings:', error);
        return false;
    }
}

// Update setting function
function updateSetting(botNumber, setting, value) {
    try {
        global[setting] = value;
        
        // Get current settings and update
        const currentSettings = global.db.getSettings(botNumber) || {};
        currentSettings[setting] = value;
        global.db.saveSettings(botNumber, currentSettings);
        
        return true;
    } catch (error) {
        console.error('Error updating setting:', error);
        return false;
    }
}

// ========== USER MANAGEMENT FUNCTIONS ==========

// Get user data
function getUser(userId) {
    try {
        return global.db.getUser(userId);
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}

// Save user data
function saveUser(userId, name, premium = 0, banned = 0) {
    try {
        global.db.saveUser(userId, name, premium, banned);
        return true;
    } catch (error) {
        console.error('Error saving user:', error);
        return false;
    }
}

// Check if user is banned
function isUserBanned(userId) {
    try {
        const user = getUser(userId);
        return user ? user.banned === 1 : false;
    } catch (error) {
        console.error('Error checking user ban status:', error);
        return false;
    }
}

// Ban user
function banUser(userId) {
    try {
        const user = getUser(userId) || {};
        saveUser(userId, user.name || '', user.premium || 0, 1);
        return true;
    } catch (error) {
        console.error('Error banning user:', error);
        return false;
    }
}

// Unban user
function unbanUser(userId) {
    try {
        const user = getUser(userId) || {};
        saveUser(userId, user.name || '', user.premium || 0, 0);
        return true;
    } catch (error) {
        console.error('Error unbanning user:', error);
        return false;
    }
}

// ========== GROUP SETTINGS MANAGEMENT ==========

// Get group settings
function getGroupSettings(groupId) {
    try {
        return global.db.getGroupSettings(groupId);
    } catch (error) {
        console.error('Error getting group settings:', error);
        return {};
    }
}

// Save group settings
function saveGroupSettings(groupId, settings) {
    try {
        global.db.saveGroupSettings(groupId, settings);
        return true;
    } catch (error) {
        console.error('Error saving group settings:', error);
        return false;
    }
}

// Update group setting
function updateGroupSetting(groupId, setting, value) {
    try {
        const currentSettings = getGroupSettings(groupId);
        currentSettings[setting] = value;
        return saveGroupSettings(groupId, currentSettings);
    } catch (error) {
        console.error('Error updating group setting:', error);
        return false;
    }
}

// ========== BLACKLIST MANAGEMENT ==========

function loadBlacklist() {
    try {
        if (!global.db.data.blacklist) {
            global.db.data.blacklist = { blacklisted_numbers: [] };
        }
        return global.db.data.blacklist;
    } catch (error) {
        console.error('Error loading blacklist:', error);
        return { blacklisted_numbers: [] };
    }
}

function saveBlacklist(blacklistData) {
    try {
        global.db.data.blacklist = blacklistData;
        return true;
    } catch (error) {
        console.error('Error saving blacklist:', error);
        return false;
    }
}

function addToBlacklist(number) {
    try {
        const blacklist = loadBlacklist();
        if (!blacklist.blacklisted_numbers.includes(number)) {
            blacklist.blacklisted_numbers.push(number);
            return saveBlacklist(blacklist);
        }
        return true;
    } catch (error) {
        console.error('Error adding to blacklist:', error);
        return false;
    }
}

function removeFromBlacklist(number) {
    try {
        const blacklist = loadBlacklist();
        blacklist.blacklisted_numbers = blacklist.blacklisted_numbers.filter(n => n !== number);
        return saveBlacklist(blacklist);
    } catch (error) {
        console.error('Error removing from blacklist:', error);
        return false;
    }
}

function isBlacklisted(number) {
    try {
        const blacklist = loadBlacklist();
        return blacklist.blacklisted_numbers.includes(number);
    } catch (error) {
        console.error('Error checking blacklist:', error);
        return false;
    }
}

// ========== BACKUP AND MAINTENANCE ==========

// Backup database
async function backupDatabase(backupPath = './backup/database_backup.json') {
    try {
        const backupData = {
            users: global.db.data.users,
            settings: global.db.data.settings,
            groups: global.db.data.groups,
            blacklist: global.db.data.blacklist,
            backupTimestamp: Date.now()
        };

        // Ensure backup directory exists
        const dir = require('path').dirname(backupPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
        console.log(`✅ Database backed up to: ${backupPath}`);
        return true;
    } catch (error) {
        console.error('Error backing up database:', error);
        return false;
    }
}

// Restore database from backup
async function restoreDatabase(backupPath = './backup/database_backup.json') {
    try {
        if (!fs.existsSync(backupPath)) {
            console.error('Backup file not found:', backupPath);
            return false;
        }

        const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
        
        // Restore data
        global.db.data.users = backupData.users || {};
        global.db.data.settings = backupData.settings || {};
        global.db.data.groups = backupData.groups || {};
        global.db.data.blacklist = backupData.blacklist || { blacklisted_numbers: [] };

        console.log('✅ Database restored from backup');
        return true;
    } catch (error) {
        console.error('Error restoring database:', error);
        return false;
    }
}

// Clean up old data
function cleanupOldData(maxAge = 30 * 24 * 60 * 60 * 1000) { // 30 days default
    try {
        const now = Date.now();
        let cleanedCount = 0;

        // Clean old users (inactive for maxAge)
        for (const [userId, userData] of Object.entries(global.db.data.users)) {
            if (userData.lastActive && (now - userData.lastActive > maxAge)) {
                delete global.db.data.users[userId];
                cleanedCount++;
            }
        }

        console.log(`🧹 Cleaned up ${cleanedCount} old records`);
        return cleanedCount;
    } catch (error) {
        console.error('Error cleaning up data:', error);
        return 0;
    }
}

// ========== STATISTICS FUNCTIONS ==========

// Get database statistics
function getDatabaseStats() {
    try {
        return {
            totalUsers: Object.keys(global.db.data.users || {}).length,
            totalGroups: Object.keys(global.db.data.groups || {}).length,
            totalBots: Object.keys(global.db.data.settings || {}).length,
            blacklistedUsers: (global.db.data.blacklist?.blacklisted_numbers || []).length,
            bannedUsers: Object.values(global.db.data.users || {}).filter(user => user.banned === 1).length,
            premiumUsers: Object.values(global.db.data.users || {}).filter(user => user.premium === 1).length
        };
    } catch (error) {
        console.error('Error getting database stats:', error);
        return {};
    }
}

module.exports = {
    // Core database functions
    initializeDatabase,
    saveDatabase,
    
    // Settings management
    loadSettingsFromDB,
    saveSettingsToDB,
    updateSetting,
    
    // User management
    getUser,
    saveUser,
    isUserBanned,
    banUser,
    unbanUser,
    
    // Group management
    getGroupSettings,
    saveGroupSettings,
    updateGroupSetting,
    
    // Blacklist management
    loadBlacklist,
    saveBlacklist,
    addToBlacklist,
    removeFromBlacklist,
    isBlacklisted,
    
    // Backup and maintenance
    backupDatabase,
    restoreDatabase,
    cleanupOldData,
    
    // Statistics
    getDatabaseStats
};

// Auto-reload when file changes
let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    delete require.cache[file];
    require(file);
    console.log('🔄 Database module reloaded');
});