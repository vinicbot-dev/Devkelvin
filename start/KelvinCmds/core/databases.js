const fs = require('fs')
function initializeDatabase(from, botNumber) {
    try {
        if (!global.db.data) {
            if (fs.existsSync("../../lib/database/database.json")) {
                global.db.data = JSON.parse(fs.readFileSync("../../lib/database/database.json")) || {};
            } else {
                global.db.data = {};
            }
        }
        
        if (!global.db.data.settings) global.db.data.settings = {};
        if (!global.db.data.chats) global.db.data.chats = {};
        if (!global.db.data.blacklist) global.db.data.blacklist = { blacklisted_numbers: [] };
        if (!global.db.data.groups) global.db.data.groups = {};

        if (!global.db.data.settings[botNumber]) {
            global.db.data.settings[botNumber] = {};
        }
        
        let setting = global.db.data.settings[botNumber];
        if (typeof setting !== "object") global.db.data.settings[botNumber] = {};
        setting = global.db.data.settings[botNumber]; 
 
        if (!setting.config || typeof setting.config !== "object") {
            setting.config = {};
        }
        
        let existingSettings = {};
        let existingGroupSettings = {};
        try {
            if (fs.existsSync("./start/lib/database/database.json")) {
                const fileData = JSON.parse(fs.readFileSync("./start/lib/database/database.json", "utf8"));
                if (fileData.settings && fileData.settings[botNumber] && fileData.settings[botNumber].config) {
                    existingSettings = fileData.settings[botNumber].config;
                    existingGroupSettings = fileData.settings[botNumber].config.groupSettings || {};
                }
            }
        } catch (e) {}
        
        // ========== CRITICAL FIX: PROPER GROUP SETTINGS LOADING ==========
        const defaultGroupSettings = {
            antilink: false,
            antilinkaction: "warn",
            antitag: false,
            antitagaction: "warn",
            antibadword: false,
            badwordaction: "warn",
            badwords: [],
            welcome: true,
            antidelete: 'off',
            autoread: false
        };
        
        // Initialize groupSettings if it doesn't exist
        if (!setting.config.groupSettings || typeof setting.config.groupSettings !== "object") {
            setting.config.groupSettings = {};
        }
        
        // If we have a specific group (from parameter), ensure its settings are initialized
        if (from && from.endsWith('@g.us')) {
            if (!setting.config.groupSettings[from]) {
                setting.config.groupSettings[from] = { ...defaultGroupSettings };
            } else {
                // Merge existing group settings with defaults
                setting.config.groupSettings[from] = {
                    ...defaultGroupSettings,
                    ...setting.config.groupSettings[from]
                };
            }
        }
        
        // Preserve all existing group settings from database
        Object.keys(existingGroupSettings).forEach(groupId => {
            if (!setting.config.groupSettings[groupId]) {
                setting.config.groupSettings[groupId] = { ...defaultGroupSettings };
            }
            // Merge existing settings with defaults
            setting.config.groupSettings[groupId] = {
                ...defaultGroupSettings,
                ...existingGroupSettings[groupId]
            };
        });
        
        // ========== GLOBAL SETTINGS SYNC ==========
        const defaultSettings = {
            prefix: ".",
            statusantidelete: false,
            autobio: global.autobio || false,
            autorecord: global.autorecording || false,
            autoviewstatus: global.autoviewstatus || false,
            autoreactstatus: global.autoreactstatus || false,
            antiedit: global.antiedit || 'private',
            anticall: global.anticall || 'off',
            AI_CHAT: global.AI_CHAT || false,
            antibug: global.antibug || false,
            ownernumber: global.ownernumber || '',
            antidelete: global.antidelete || 'private', 
            autoread: global.autoread || false,
            welcome: global.welcome || true,
            adminevent: global.adminevent || true,
            autoreact: global.autoreact || false,
            autoTyping: global.autoTyping || false,
            autorecording: global.autorecording || false,
            groupSettings: setting.config.groupSettings // Use the initialized groupSettings
        };
        
        // Apply settings from config.js, but don't override existing database settings
        Object.keys(defaultSettings).forEach(key => {
            if (!(key in setting.config)) {
                setting.config[key] = existingSettings[key] !== undefined ? existingSettings[key] : defaultSettings[key];
            }
        });
        
        // Ensure critical settings are always synced with active globals
        global.antidelete = setting.config.antidelete;
        global.autoread = setting.config.autoread;
        global.autoviewstatus = setting.config.autoviewstatus;
        global.autoreactstatus = setting.config.autoreactstatus;
        global.antiedit = setting.config.antiedit;
        global.autoreact = setting.config.autoreact;
        global.autoTyping = setting.config.autoTyping;
        global.autorecording = setting.config.autorecording;
        global.welcome = setting.config.welcome;
        global.anticall = setting.config.anticall;
        global.AI_CHAT = setting.config.AI_CHAT;
        
        saveDatabase();

// Return initialization stats
return {
    totalGroups: Object.keys(setting.config.groupSettings || {}).length,
    antiedit: setting.config.antiedit,
    antidelete: setting.config.antidelete
};
        
    } catch (err) {
        console.error('❌ Error initializing database:', err);
        // Fallback to config.js globals
        global.antidelete = global.antidelete || 'private';
        global.autoread = global.autoread || false;
        global.autoviewstatus = global.autoviewstatus || false;
    }
}

// Sync database settings back to global variables
function syncSettingsToGlobals(botNumber) {
    try {
        if (!global.db.data?.settings?.[botNumber]?.config) return;
        
        const config = global.db.data.settings[botNumber].config;
        
        // Sync all settings to globals
        global.antidelete = config.antidelete || 'private';
        global.autoread = config.autoread || false;
        global.autoviewstatus = config.autoviewstatus || false;
        global.autoreactstatus = config.autoreactstatus || false;
        global.antiedit = config.antiedit || 'private';
        global.autoreact = config.autoreact || false;
        global.autoTyping = config.autoTyping || false;
        global.autorecording = config.autorecording || false;
        global.AI_CHAT = config.AI_CHAT || false;
        global.welcome = config.welcome || false;
        global.anticall = config.anticall || 'off';
        global.autobio = config.autobio || false;
        
        console.log('🔄 Settings synced to globals:', {
            antiedit: global.antiedit,
            antidelete: global.antidelete,
            autorecording: global.autorecording
        });
        
    } catch (error) {
        console.error('Error syncing settings to globals:', error);
    }
}

// ========== DATABASE PERSISTENCE FUNCTIONS ==========

// Enhanced saveDatabase with better JSON handling
async function saveDatabase() {
    try {
        if (!global.db.data) {
            global.db.data = {
                settings: {},
                chats: {},
                blacklist: { blacklisted_numbers: [] }
            };
        }
        
        const dir = './start/lib/database';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync("./start/lib/database/database.json", JSON.stringify(global.db.data, null, 2));
return true;
} catch (error) {
console.error('❌ Error saving database:', error);
return false;
  }
}

// Force save settings (call this when settings change)
async function forceSaveSettings() {
    try {
        await saveDatabase();
        return true;
    } catch (error) {
        console.error('❌ Error in forceSaveSettings:', error);
        return false;
    }
}

// Sync database settings back to global variables
function syncSettingsToGlobals(botNumber) {
    try {
        if (!global.db.data?.settings?.[botNumber]?.config) return;
        
        const config = global.db.data.settings[botNumber].config;
        
        // Sync all settings to globals
        global.antidelete = config.antidelete || 'private';
        global.autoread = config.autoread || false;
        global.autoviewstatus = config.autoviewstatus || false;
        global.autoreactstatus = config.autoreactstatus || false;
        global.antiedit = config.antiedit || 'private';
        global.autoreact = config.autoreact || false;
        global.autoTyping = config.autoTyping || false;
        global.autorecording = config.autorecording || false;
        global.AI_CHAT = config.AI_CHAT || false;
        global.autobio = config.autobio || false;
        
        console.log('🔄 Settings synced to globals:', {
            antiedit: global.antiedit,
            antidelete: global.antidelete,
            autorecording: global.autorecording,
            autoTyping: global.autoTyping,
            AI_CHAT: global.AI_CHAT
        });
        
    } catch (error) {
        console.error('Error syncing settings to globals:', error);
    }
}

// Auto-save settings periodically
function startAutoSave() {
    setInterval(async () => {
        try {
            await saveDatabase();
        } catch (error) {
            console.error('Auto-save error:', error);
        }
    }, 1 * 60 * 1000); // Save every 1 minute
}
// Force save settings (call this when settings change)
async function forceSaveSettings() {
    try {
        await saveDatabase();
        return true;
    } catch (error) {
        console.error('❌ Error in forceSaveSettings:', error);
        return false;
    }
}

module.exports = { forceSaveSettings,
saveDatabase,
syncSettingsToGlobals,
initializeDatabase
};