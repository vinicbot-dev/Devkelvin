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
        
        console.log(`✅ Settings synced to globals for ${botNumber}`);
    }
}

// Create singleton instance
const settingsManager = new SettingsManager();

// Export functions for getSetting and updateSetting (alias for setSetting)
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

// Export the singleton instance and functions
module.exports = {
    settingsManager, // The singleton instance
    getSetting,
    updateSetting,
    getAllSettings,
    syncToGlobals,
    
    // Alias for updateSetting for backward compatibility
    setSetting: updateSetting
};

// Optionally, still set it to global for backward compatibility
global.settingsManager = settingsManager;