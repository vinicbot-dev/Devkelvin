const path = require('path');
const fs = require('fs');
const LowMemoryDatabase = require('../../start/database'); 

class SettingsManager {
    constructor() {
        this.dbPath = path.join(__dirname, '../data/database.json');
        this.db = new LowMemoryDatabase(this.dbPath);
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
    }

    // Get bot settings with caching
    async getBotSettings(botNumber) {
        const cacheKey = `bot:${botNumber}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
            return cached.data;
        }

        const settings = await this.db.read(botNumber) || {};
        
        // Ensure groups object exists
        if (!settings.groups) {
            settings.groups = {};
        }

        this.cache.set(cacheKey, {
            data: settings,
            timestamp: Date.now()
        });

        return settings;
    }

    // Save bot settings
    async saveBotSettings(botNumber, settings) {
        await this.db.write(botNumber, settings);
        
        // Update cache
        this.cache.set(`bot:${botNumber}`, {
            data: settings,
            timestamp: Date.now()
        });
    }

    // Get setting with dot notation support (e.g., 'welcome' or 'groups.groupId.welcome')
    async get(botNumber, key, defaultValue = null) {
        try {
            const settings = await this.getBotSettings(botNumber);
            
            // Handle nested keys with dot notation
            if (key.includes('.')) {
                const parts = key.split('.');
                let value = settings;
                
                for (const part of parts) {
                    if (value === undefined || value === null) break;
                    value = value[part];
                }
                
                return value !== undefined ? value : defaultValue;
            }
            
            return settings[key] !== undefined ? settings[key] : defaultValue;
        } catch (error) {
            console.error('❌ Error getting setting:', error);
            return defaultValue;
        }
    }

    // Alias for get()
    async getSetting(botNumber, key, defaultValue = null) {
        return this.get(botNumber, key, defaultValue);
    }

    // Set setting with dot notation support
    async set(botNumber, key, value) {
        try {
            const settings = await this.getBotSettings(botNumber);
            
            // Handle nested keys with dot notation
            if (key.includes('.')) {
                const parts = key.split('.');
                let current = settings;
                
                // Navigate to the parent object
                for (let i = 0; i < parts.length - 1; i++) {
                    const part = parts[i];
                    if (!current[part]) {
                        current[part] = {};
                    }
                    current = current[part];
                }
                
                // Set the value
                current[parts[parts.length - 1]] = value;
            } else {
                settings[key] = value;
            }
            
            await this.saveBotSettings(botNumber, settings);
            return true;
        } catch (error) {
            console.error('❌ Error setting setting:', error);
            return false;
        }
    }

    // Alias for set()
    async setSetting(botNumber, key, value) {
        return this.set(botNumber, key, value);
    }

    // Sudo methods
    async getSudo(botNumber) {
        const sudo = await this.get(botNumber, 'sudo', []);
        return Array.isArray(sudo) ? sudo : [];
    }

    async addSudo(botNumber, userJid) {
        const sudo = await this.getSudo(botNumber);
        
        if (!sudo.includes(userJid)) {
            sudo.push(userJid);
            return this.set(botNumber, 'sudo', sudo);
        }
        return false;
    }

    async removeSudo(botNumber, userJid) {
        const sudo = await this.getSudo(botNumber);
        const index = sudo.indexOf(userJid);
        
        if (index > -1) {
            sudo.splice(index, 1);
            return this.set(botNumber, 'sudo', sudo);
        }
        return false;
    }

    async hasSudo(botNumber, userJid) {
        const sudo = await this.getSudo(botNumber);
        return sudo.includes(userJid);
    }

    // Group settings methods
    async getGroupSettings(botNumber, groupId) {
        const settings = await this.getBotSettings(botNumber);
        
        if (!settings.groups) {
            settings.groups = {};
        }
        
        if (!settings.groups[groupId]) {
            settings.groups[groupId] = {};
            await this.saveBotSettings(botNumber, settings);
        }
        
        return settings.groups[groupId];
    }

    async getGroupSetting(botNumber, groupId, key, defaultValue = false) {
        try {
            const groupSettings = await this.getGroupSettings(botNumber, groupId);
            return groupSettings[key] !== undefined ? groupSettings[key] : defaultValue;
        } catch (error) {
            console.error('❌ Error getting group setting:', error);
            return defaultValue;
        }
    }

    async setGroupSetting(botNumber, groupId, key, value) {
        try {
            const settings = await self.getBotSettings(botNumber);
            
            if (!settings.groups) {
                settings.groups = {};
            }
            
            if (!settings.groups[groupId]) {
                settings.groups[groupId] = {};
            }
            
            settings.groups[groupId][key] = value;
            await this.saveBotSettings(botNumber, settings);
            return true;
        } catch (error) {
            console.error('❌ Error setting group setting:', error);
            return false;
        }
    }

    async isWelcomeEnabled(botNumber, groupId) {
        // Check group-specific setting first
        const groupWelcome = await this.getGroupSetting(botNumber, groupId, 'welcome', null);
        
        // If group has explicit setting, use it
        if (groupWelcome !== null) {
            return groupWelcome;
        }
        
        // Fallback to global setting (default false)
        return this.get(botNumber, 'welcome', false);
    }

    // Get all settings for a bot
    async getAllSettings(botNumber) {
        return this.getBotSettings(botNumber);
    }

    // Sync settings to global variables
    async syncToGlobals(botNumber) {
        const settings = await this.getBotSettings(botNumber);
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

    // Clear cache for a specific bot
    clearCache(botNumber) {
        this.cache.delete(`bot:${botNumber}`);
    }

    // Clear all cache
    clearAllCache() {
        this.cache.clear();
    }

    // Batch update multiple settings at once
    async batchUpdate(botNumber, updates) {
        try {
            const settings = await this.getBotSettings(botNumber);
            
            for (const [key, value] of Object.entries(updates)) {
                if (key.includes('.')) {
                    const parts = key.split('.');
                    let current = settings;
                    
                    for (let i = 0; i < parts.length - 1; i++) {
                        const part = parts[i];
                        if (!current[part]) {
                            current[part] = {};
                        }
                        current = current[part];
                    }
                    
                    current[parts[parts.length - 1]] = value;
                } else {
                    settings[key] = value;
                }
            }
            
            await this.saveBotSettings(botNumber, settings);
            return true;
        } catch (error) {
            console.error('❌ Error in batch update:', error);
            return false;
        }
    }

    // Get statistics about database usage
    async getStats() {
        const keys = await this.db.getAllKeys();
        const cacheSize = this.cache.size;
        const pendingWrites = this.db.writeQueue.length;
        
        return {
            totalBots: keys.length,
            cacheSize,
            pendingWrites,
            memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024
        };
    }
}

// Create singleton instance
const settingsManager = new SettingsManager();

// Helper functions (async)
const getSetting = async (botNumber, key, defaultValue) => 
    settingsManager.get(botNumber, key, defaultValue);

const updateSetting = async (botNumber, key, value) => 
    settingsManager.set(botNumber, key, value);

const getGroupSetting = async (botNumber, groupId, key, defaultValue) =>
    settingsManager.getGroupSetting(botNumber, groupId, key, defaultValue);

const setGroupSetting = async (botNumber, groupId, key, value) =>
    settingsManager.setGroupSetting(botNumber, groupId, key, value);

const isWelcomeEnabled = async (botNumber, groupId) =>
    settingsManager.isWelcomeEnabled(botNumber, groupId);

// Export everything
module.exports = {
    settingsManager,
    getSetting,
    updateSetting,
    setSetting: updateSetting,
    getGroupSetting,
    setGroupSetting,
    isWelcomeEnabled,
    getSudo: async (botNumber) => settingsManager.getSudo(botNumber),
    addSudo: async (botNumber, userJid) => settingsManager.addSudo(botNumber, userJid),
    removeSudo: async (botNumber, userJid) => settingsManager.removeSudo(botNumber, userJid),
    hasSudo: async (botNumber, userJid) => settingsManager.hasSudo(botNumber, userJid),
    getAllSettings: async (botNumber) => settingsManager.getAllSettings(botNumber),
    syncToGlobals: async (botNumber) => settingsManager.syncToGlobals(botNumber),
    batchUpdate: async (botNumber, updates) => settingsManager.batchUpdate(botNumber, updates),
    getStats: async () => settingsManager.getStats()
};

// Global access
global.settingsManager = settingsManager;