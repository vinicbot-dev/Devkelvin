const path = require('path');
const fs = require('fs');

class SettingsManager {
    constructor() {
        // Use absolute path instead of relative path
        this.settingsPath = path.join(__dirname, '../data/database.json');
        this.settings = this.loadSettings();
    }

    loadSettings() {
        try {
            if (fs.existsSync(this.settingsPath)) {
                const data = fs.readFileSync(this.settingsPath, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
        return {};
    }

    saveSettings() {
        try {
            const dir = path.dirname(this.settingsPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(this.settingsPath, JSON.stringify(this.settings, null, 2));
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    }

    getSetting(botNumber, key, defaultValue = null) {
        if (!this.settings[botNumber]) {
            this.settings[botNumber] = {};
        }
        if (!this.settings[botNumber][key] && defaultValue !== null) {
            this.settings[botNumber][key] = defaultValue;
            this.saveSettings();
        }
        return this.settings[botNumber][key];
    }

    setSetting(botNumber, key, value) {
        if (!this.settings[botNumber]) {
            this.settings[botNumber] = {};
        }
        this.settings[botNumber][key] = value;
        return this.saveSettings();
    }

    getAllSettings(botNumber) {
        return this.settings[botNumber] || {};
    }

   
    getSudo(botNumber) {
        if (!this.settings[botNumber]) {
            this.settings[botNumber] = {};
        }
        if (!this.settings[botNumber].sudo) {
            this.settings[botNumber].sudo = [];
        }
        return this.settings[botNumber].sudo;
    }

    addSudo(botNumber, userJid) {
        if (!this.settings[botNumber]) {
            this.settings[botNumber] = {};
        }
        if (!this.settings[botNumber].sudo) {
            this.settings[botNumber].sudo = [];
        }
        
        if (!this.settings[botNumber].sudo.includes(userJid)) {
            this.settings[botNumber].sudo.push(userJid);
            return this.saveSettings();
        }
        return false; // Already exists
    }

    removeSudo(botNumber, userJid) {
        if (!this.settings[botNumber] || !this.settings[botNumber].sudo) {
            return false;
        }
        
        const index = this.settings[botNumber].sudo.indexOf(userJid);
        if (index > -1) {
            this.settings[botNumber].sudo.splice(index, 1);
            return this.saveSettings();
        }
        return false; // Not found
    }

    hasSudo(botNumber, userJid) {
        if (!this.settings[botNumber] || !this.settings[botNumber].sudo) {
            return false;
        }
        return this.settings[botNumber].sudo.includes(userJid);
    }

    syncToGlobals(botNumber) {
        if (!this.settings[botNumber]) return;
        
        const settings = this.settings[botNumber];
        
        // Sync to global variables
        if (settings.autorecording !== undefined) global.autorecording = settings.autorecording;
        if (settings.AI_CHAT !== undefined) global.AI_CHAT = settings.AI_CHAT;
        if (settings.antidelete !== undefined) global.antidelete = settings.antidelete;
        if (settings.antiedit !== undefined) global.antiedit = settings.antiedit;
        if (settings.antilinkdelete !== undefined) global.antilinkdelete = settings.antilinkdelete;
        if (settings.autoreact !== undefined) global.autoreact = settings.autoreact;
        if (settings.autoread !== undefined) global.autoread = settings.autoread;
        if (settings.autoviewstatus !== undefined) global.autoviewstatus = settings.autoviewstatus;
        if (settings.autoreactstatus !== undefined) global.autoreactstatus = settings.autoreactstatus;
        if (settings.welcome !== undefined) global.welcome = settings.welcome;
        if (settings.adminevent !== undefined) global.adminevent = settings.adminevent;
        if (settings.antibug !== undefined) global.antibug = settings.antibug;
        if (settings.anticall !== undefined) global.anticall = settings.anticall;
        if (settings.autobio !== undefined) global.autobio = settings.autobio;
        if (settings.prefix !== undefined) global.prefix = settings.prefix;
        
        console.log(`✅ Settings synced to globals for ${botNumber}`);
    }
}

// Create singleton instance
const settingsManager = new SettingsManager();


function getSudo(botNumber) {
    return settingsManager.getSudo(botNumber);
}

function addSudo(botNumber, userJid) {
    return settingsManager.addSudo(botNumber, userJid);
}

function removeSudo(botNumber, userJid) {
    return settingsManager.removeSudo(botNumber, userJid);
}

function hasSudo(botNumber, userJid) {
    return settingsManager.hasSudo(botNumber, userJid);
}

function getSetting(botNumber, key, defaultValue = null) {
    return settingsManager.getSetting(botNumber, key, defaultValue);
}

function updateSetting(botNumber, key, value) {
    return settingsManager.setSetting(botNumber, key, value);
}

function getAllSettings(botNumber) {
    return settingsManager.getAllSettings(botNumber);
}

function syncToGlobals(botNumber) {
    return settingsManager.syncToGlobals(botNumber);
}
function getGroupSetting(botNumber, groupId, setting, defaultValue = false) {
    try {
        const data = loadDatabase();
        const botData = data[botNumber] || {};
        const groupSettings = botData.groupSettings || {};
        const groupData = groupSettings[groupId] || {};
        
        return groupData[setting] !== undefined ? groupData[setting] : defaultValue;
    } catch (error) {
        console.error('Error getting group setting:', error);
        return defaultValue;
    }
}

function updateGroupSetting(botNumber, groupId, setting, value) {
    try {
        const data = loadDatabase();
        
        // Ensure bot entry exists
        if (!data[botNumber]) {
            data[botNumber] = {};
        }
        
        // Ensure groupSettings exists
        if (!data[botNumber].groupSettings) {
            data[botNumber].groupSettings = {};
        }
        
        // Ensure group entry exists
        if (!data[botNumber].groupSettings[groupId]) {
            data[botNumber].groupSettings[groupId] = {};
        }
        
        // Update setting
        data[botNumber].groupSettings[groupId][setting] = value;
        
        return saveDatabase(data);
    } catch (error) {
        console.error('Error updating group setting:', error);
        return false;
    }
}

function getGroupAllSettings(botNumber, groupId) {
    try {
        const data = loadDatabase();
        const botData = data[botNumber] || {};
        const groupSettings = botData.groupSettings || {};
        
        return groupSettings[groupId] || {};
    } catch (error) {
        console.error('Error getting group settings:', error);
        return {};
    }
}

function removeGroupSetting(botNumber, groupId, setting) {
    try {
        const data = loadDatabase();
        
        if (data[botNumber]?.groupSettings?.[groupId]) {
            delete data[botNumber].groupSettings[groupId][setting];
            
            // Remove group if empty
            if (Object.keys(data[botNumber].groupSettings[groupId]).length === 0) {
                delete data[botNumber].groupSettings[groupId];
            }
            
            return saveDatabase(data);
        }
        return true;
    } catch (error) {
        console.error('Error removing group setting:', error);
        return false;
    }
}
// Export the singleton instance and functions
module.exports = {
    settingsManager, // The singleton instance
    getSetting,
    getSudo,
    addSudo,
    removeSudo,
    hasSudo,
    updateSetting,
    getAllSettings,
    syncToGlobals,
    getGroupSetting,
    updateGroupSetting,
    getGroupAllSettings,
    removeGroupSetting,
    
    // Alias for updateSetting for backward compatibility
    setSetting: updateSetting
};

// Optionally, still set it to global for backward compatibility
global.settingsManager = settingsManager;