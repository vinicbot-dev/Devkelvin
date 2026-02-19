// databaseManager.js
const SQLiteDatabase = require('../../start/database');
const path = require('path');

class DatabaseManager {
    constructor(dbPath = './data/bot.db') {
        this.db = new SQLiteDatabase(dbPath);
        this.cache = new Map();
        this.cacheTimeout = 30000; // 30 seconds
    }

    // ==================== GENERAL SETTINGS ====================
    
    async get(botNumber, key, defaultValue = null) {
        const cacheKey = `${botNumber}:${key}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
            return cached.value;
        }

        try {
            const value = await this.db.getSetting(botNumber, key);
            const result = value !== null ? value : defaultValue;
            
            this.cache.set(cacheKey, {
                value: result,
                timestamp: Date.now()
            });
            
            return result;
        } catch (error) {
            console.error('❌ Database get error:', error);
            return defaultValue;
        }
    }

    async set(botNumber, key, value) {
        try {
            await this.db.setSetting(botNumber, key, value);
            
            const cacheKey = `${botNumber}:${key}`;
            this.cache.set(cacheKey, {
                value: value,
                timestamp: Date.now()
            });
            
            return true;
        } catch (error) {
            console.error('❌ Database set error:', error);
            return false;
        }
    }

    // ==================== SUDO USERS ====================

    async getSudo(botNumber) {
        try {
            return await this.db.getSudo(botNumber);
        } catch (error) {
            console.error('❌ Get sudo error:', error);
            return [];
        }
    }

    async addSudo(botNumber, userJid) {
        return new Promise((resolve, reject) => {
            this.db.db.run(
                'INSERT OR IGNORE INTO sudo_users (bot_number, user_jid) VALUES (?, ?)',
                [botNumber, userJid],
                (err) => {
                    if (err) reject(err);
                    else {
                        this.cache.delete(`${botNumber}:sudo`);
                        resolve(true);
                    }
                }
            );
        });
    }

    async removeSudo(botNumber, userJid) {
        return new Promise((resolve, reject) => {
            this.db.db.run(
                'DELETE FROM sudo_users WHERE bot_number = ? AND user_jid = ?',
                [botNumber, userJid],
                (err) => {
                    if (err) reject(err);
                    else {
                        this.cache.delete(`${botNumber}:sudo`);
                        resolve(true);
                    }
                }
            );
        });
    }

    // ==================== GROUP SETTINGS ====================

    async getGroupSetting(botNumber, groupId, key, defaultValue = null) {
        const cacheKey = `${botNumber}:group:${groupId}:${key}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
            return cached.value;
        }

        return new Promise((resolve, reject) => {
            this.db.db.get(
                'SELECT value FROM group_settings WHERE bot_number = ? AND group_id = ? AND key = ?',
                [botNumber, groupId, key],
                (err, row) => {
                    if (err) reject(err);
                    else {
                        const result = row ? JSON.parse(row.value) : defaultValue;
                        this.cache.set(cacheKey, {
                            value: result,
                            timestamp: Date.now()
                        });
                        resolve(result);
                    }
                }
            );
        });
    }

    async setGroupSetting(botNumber, groupId, key, value) {
        return new Promise((resolve, reject) => {
            this.db.db.run(
                'INSERT OR REPLACE INTO group_settings (bot_number, group_id, key, value) VALUES (?, ?, ?, ?)',
                [botNumber, groupId, key, JSON.stringify(value)],
                (err) => {
                    if (err) reject(err);
                    else {
                        const cacheKey = `${botNumber}:group:${groupId}:${key}`;
                        this.cache.set(cacheKey, {
                            value: value,
                            timestamp: Date.now()
                        });
                        resolve(true);
                    }
                }
            );
        });
    }

    // ==================== WELCOME SYSTEM ====================

    async isWelcomeEnabled(botNumber, groupId) {
        try {
            const groupWelcome = await this.getGroupSetting(botNumber, groupId, 'welcome', null);
            if (groupWelcome !== null) return groupWelcome;
            return await this.get(botNumber, 'welcome', false);
        } catch (error) {
            console.error('❌ Error checking welcome enabled:', error);
            return false;
        }
    }

    // ==================== ANTIDEMOTE ====================

    async setAntidemote(botNumber, groupId, enabled) {
        return this.setGroupSetting(botNumber, groupId, 'antidemote', enabled);
    }

    async getAntidemote(botNumber, groupId) {
        return await this.getGroupSetting(botNumber, groupId, 'antidemote', false);
    }

    async removeAntidemote(botNumber, groupId) {
        return this.setGroupSetting(botNumber, groupId, 'antidemote', false);
    }
    // ==================== ANTIPROMOTE ====================

async setAntipromote(botNumber, groupId, enabled) {
    return this.setGroupSetting(botNumber, groupId, 'antipromote', enabled);
}

async getAntipromote(botNumber, groupId) {
    return await this.getGroupSetting(botNumber, groupId, 'antipromote', false);
}

async removeAntipromote(botNumber, groupId) {
    return this.setGroupSetting(botNumber, groupId, 'antipromote', false);
}

    // ==================== CACHE MANAGEMENT ====================

    clearCache(botNumber = null) {
        if (botNumber) {
            for (const key of this.cache.keys()) {
                if (key.startsWith(`${botNumber}:`)) {
                    this.cache.delete(key);
                }
            }
        } else {
            this.cache.clear();
        }
    }
}

// ✅ CREATE AND EXPORT THE INSTANCE
const dbManager = new DatabaseManager();
module.exports = dbManager;