const path = require('path');
const fs = require('fs');

class SettingsManager {
    constructor() {
        this.settingsPath = path.join(__dirname, '../data/database.json');
        this.settings = this.loadSettings();
    }

    loadSettings() {
        try {
            if (fs.existsSync(this.settingsPath)) {
                const data = fs.readFileSync(this.settingsPath, 'utf8');
                return JSON.parse(data) || {};
            }
        } catch (error) {
            console.error('❌ Error loading settings:', error);
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
            console.error('❌ Error saving settings:', error);
            return false;
        }
    }

    getBotSettings(botNumber) {
        if (!this.settings[botNumber]) {
            this.settings[botNumber] = {};
        }
        return this.settings[botNumber];
    }

    get(botNumber, key, defaultValue = null) {
        const botSettings = this.getBotSettings(botNumber);
        
        if (botSettings[key] === undefined && defaultValue !== null) {
            botSettings[key] = defaultValue;
            this.saveSettings();
        }
        
        return botSettings[key];
    }

    set(botNumber, key, value) {
        const botSettings = this.getBotSettings(botNumber);
        botSettings[key] = value;
        return this.saveSettings();
    }

    getSudo(botNumber) {
        const sudo = this.get(botNumber, 'sudo', []);
        return Array.isArray(sudo) ? sudo : [];
    }

    addSudo(botNumber, userJid) {
        const sudo = this.getSudo(botNumber);
        
        if (!sudo.includes(userJid)) {
            sudo.push(userJid);
            return this.set(botNumber, 'sudo', sudo);
        }
        return false;
    }

    removeSudo(botNumber, userJid) {
        const sudo = this.getSudo(botNumber);
        const index = sudo.indexOf(userJid);
        
        if (index > -1) {
            sudo.splice(index, 1);
            return this.set(botNumber, 'sudo', sudo);
        }
        return false;
    }

    hasSudo(botNumber, userJid) {
        const sudo = this.getSudo(botNumber);
        return sudo.includes(userJid);
    }

    syncToGlobals(botNumber) {
        const settings = this.getBotSettings(botNumber);
        const globalKeys = [
            'autorecording', 'AI_CHAT', 'antidelete', 'antiedit', 'antilinkdelete',
            'autoreact', 'autoread', 'autoviewstatus', 'autoreactstatus', 'welcome',
            'adminevent', 'antibug', 'anticall', 'autobio', 'prefix'
        ];

        globalKeys.forEach(key => {
            if (settings[key] !== undefined) {
                global[key] = settings[key];
            }
        });

        console.log(`✅ Settings synced to globals for ${botNumber}`);
    }

    // Group settings methods
    getGroup(botNumber, groupId) {
        const botSettings = this.getBotSettings(botNumber);
        if (!botSettings.groups) botSettings.groups = {};
        if (!botSettings.groups[groupId]) botSettings.groups[groupId] = {};
        return botSettings.groups[groupId];
    }

    getGroupSetting(botNumber, groupId, key, defaultValue = false) {
        const group = this.getGroup(botNumber, groupId);
        
        if (group[key] === undefined && defaultValue !== null) {
            group[key] = defaultValue;
            this.saveSettings();
        }
        
        return group[key];
    }

    setGroupSetting(botNumber, groupId, key, value) {
        const group = this.getGroup(botNumber, groupId);
        group[key] = value;
        return this.saveSettings();
    }

    isWelcomeEnabled(botNumber, groupId) {
        // Check group-specific setting first
        const groupWelcome = this.getGroupSetting(botNumber, groupId, 'welcome', null);
        
        // If group has explicit setting, use it
        if (groupWelcome !== null) {
            return groupWelcome;
        }
        
        // Fallback to global setting (default false)
        return this.get(botNumber, 'welcome', false);
    }
}

// Singleton instance
const settingsManager = new SettingsManager();

// Helper functions
const getSetting = (botNumber, key, defaultValue) => 
    settingsManager.get(botNumber, key, defaultValue);

const updateSetting = (botNumber, key, value) => 
    settingsManager.set(botNumber, key, value);

const getGroupSetting = (botNumber, groupId, key, defaultValue) =>
    settingsManager.getGroupSetting(botNumber, groupId, key, defaultValue);

const setGroupSetting = (botNumber, groupId, key, value) =>
    settingsManager.setGroupSetting(botNumber, groupId, key, value);

const isWelcomeEnabled = (botNumber, groupId) =>
    settingsManager.isWelcomeEnabled(botNumber, groupId);

// Export
module.exports = {
    settingsManager,
    getSetting,
    updateSetting,
    setSetting: updateSetting,
    getGroupSetting,
    setGroupSetting,
    isWelcomeEnabled,
    getSudo: (botNumber) => settingsManager.getSudo(botNumber),
    addSudo: (botNumber, userJid) => settingsManager.addSudo(botNumber, userJid),
    removeSudo: (botNumber, userJid) => settingsManager.removeSudo(botNumber, userJid),
    hasSudo: (botNumber, userJid) => settingsManager.hasSudo(botNumber, userJid),
    getAllSettings: (botNumber) => settingsManager.getBotSettings(botNumber),
    syncToGlobals: (botNumber) => settingsManager.syncToGlobals(botNumber)
};

// Global access
global.settingsManager = settingsManager;
