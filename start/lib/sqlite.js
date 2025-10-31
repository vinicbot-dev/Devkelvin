const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class SQLiteDB {
    constructor() {
        this.dbPath = path.join(__dirname, './database.db'); // Fixed path
        this.ensureDBDir();
        this.db = new Database(this.dbPath);
        this.initTables();
    }

    ensureDBDir() {
        const dir = path.dirname(this.dbPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    initTables() {
        // Enhanced settings table with all bot configurations
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS settings (
                bot_number TEXT PRIMARY KEY,
                prefix TEXT DEFAULT '.',
                statusantidelete INTEGER DEFAULT 0,
                autobio INTEGER DEFAULT 0,
                autorecord INTEGER DEFAULT 0,
                autoviewstatus INTEGER DEFAULT 0,
                autoreactstatus INTEGER DEFAULT 0,
                antiedit INTEGER DEFAULT 0,
                anticall TEXT DEFAULT 'false',
                AI_CHAT INTEGER DEFAULT 0,
                antibug INTEGER DEFAULT 0,
                ownernumber TEXT DEFAULT '',
                welcome INTEGER DEFAULT 1,
                adminevent INTEGER DEFAULT 1,
                autoreact INTEGER DEFAULT 0,
                autoview INTEGER DEFAULT 1,
                autoread INTEGER DEFAULT 0,
                group_settings TEXT DEFAULT '{}',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Messages table for anti-delete/anti-edit
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key_id TEXT UNIQUE,
                message_data TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                jid TEXT,
                from_me INTEGER DEFAULT 0
            )
        `);

        // Users table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                jid TEXT PRIMARY KEY,
                name TEXT,
                premium INTEGER DEFAULT 0,
                banned INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Group activity tracking
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS group_messages (
                group_jid TEXT,
                user_jid TEXT,
                count INTEGER DEFAULT 0,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (group_jid, user_jid)
            )
        `);

        console.log('✅ SQLite database initialized with enhanced settings');
    }

    // Enhanced settings methods
    getSettings(botNumber) {
        try {
            const stmt = this.db.prepare('SELECT * FROM settings WHERE bot_number = ?');
            const result = stmt.get(botNumber);
            
            if (!result) {
                return this.createDefaultSettings(botNumber);
            }

            // Convert SQLite results to proper config object
            return {
                prefix: result.prefix || '.',
                statusantidelete: Boolean(result.statusantidelete),
                autobio: Boolean(result.autobio),
                autorecord: Boolean(result.autorecord),
                autoviewstatus: Boolean(result.autoviewstatus),
                autoreactstatus: Boolean(result.autoreactstatus),
                antiedit: Boolean(result.antiedit),
                anticall: result.anticall || 'false',
                AI_CHAT: Boolean(result.AI_CHAT),
                antibug: Boolean(result.antibug),
                ownernumber: result.ownernumber || '',
                welcome: Boolean(result.welcome),
                adminevent: Boolean(result.adminevent),
                autoreact: Boolean(result.autoreact),
                autoview: Boolean(result.autoview),
                autoread: Boolean(result.autoread),
                groupSettings: JSON.parse(result.group_settings || '{}')
            };
        } catch (error) {
            console.error('Error getting settings:', error);
            return this.createDefaultSettings(botNumber);
        }
    }

    createDefaultSettings(botNumber) {
        const defaultSettings = {
            prefix: '.',
            statusantidelete: false,
            autobio: false,
            autorecord: false,
            autoviewstatus: false,
            autoreactstatus: false,
            antiedit: false,
            anticall: 'false',
            AI_CHAT: false,
            antibug: false,
            ownernumber: '',
            welcome: true,
            adminevent: true,
            autoreact: false,
            autoview: true,
            autoread: false,
            groupSettings: {}
        };

        this.saveSettings(botNumber, defaultSettings);
        return defaultSettings;
    }

    saveSettings(botNumber, config) {
        try {
            const stmt = this.db.prepare(`
                INSERT OR REPLACE INTO settings (
                    bot_number, prefix, statusantidelete, autobio, autorecord, 
                    autoviewstatus, autoreactstatus, antiedit, anticall, AI_CHAT, 
                    antibug, ownernumber, welcome, adminevent, autoreact, 
                    autoview, autoread, group_settings, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `);

            stmt.run(
                botNumber,
                config.prefix || '.',
                config.statusantidelete ? 1 : 0,
                config.autobio ? 1 : 0,
                config.autorecord ? 1 : 0,
                config.autoviewstatus ? 1 : 0,
                config.autoreactstatus ? 1 : 0,
                config.antiedit ? 1 : 0,
                config.anticall || 'false',
                config.AI_CHAT ? 1 : 0,
                config.antibug ? 1 : 0,
                config.ownernumber || '',
                config.welcome ? 1 : 0,
                config.adminevent ? 1 : 0,
                config.autoreact ? 1 : 0,
                config.autoview ? 1 : 0,
                config.autoread ? 1 : 0,
                JSON.stringify(config.groupSettings || {})
            );

            console.log('✅ Settings saved to database for:', botNumber);
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    }

    // Update specific setting
    updateSetting(botNumber, key, value) {
        try {
            // Handle different value types
            let dbValue;
            if (typeof value === 'boolean') {
                dbValue = value ? 1 : 0;
            } else if (typeof value === 'object') {
                dbValue = JSON.stringify(value);
            } else {
                dbValue = value;
            }

            const stmt = this.db.prepare(`UPDATE settings SET ${key} = ?, updated_at = CURRENT_TIMESTAMP WHERE bot_number = ?`);
            const result = stmt.run(dbValue, botNumber);
            
            return result.changes > 0;
        } catch (error) {
            console.error('Error updating setting:', error);
            return false;
        }
    }

    // Group messages methods
    addGroupMessage(groupJid, userJid) {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO group_messages (group_jid, user_jid, count) 
                VALUES (?, ?, 1) 
                ON CONFLICT(group_jid, user_jid) 
                DO UPDATE SET count = count + 1, last_updated = CURRENT_TIMESTAMP
            `);
            stmt.run(groupJid, userJid);
            return true;
        } catch (error) {
            console.error('Error adding group message:', error);
            return false;
        }
    }

    getActiveUsers(groupJid) {
        try {
            const stmt = this.db.prepare(`
                SELECT user_jid AS jid, count 
                FROM group_messages 
                WHERE group_jid = ? 
                ORDER BY count DESC
            `);
            return stmt.all(groupJid);
        } catch (error) {
            console.error('Error getting active users:', error);
            return [];
        }
    }

    // Close database connection
    close() {
        this.db.close();
    }
}

// Create global database instance
const db = new SQLiteDB();

// Initialize global data structure
if (!global.db) {
    global.db = {
        data: {
            settings: {},
            users: {},
            chats: {},
            messages: {}
        }
    };
}

// Load all settings into memory on startup
function loadAllSettings() {
    try {
        const stmt = db.db.prepare('SELECT bot_number FROM settings');
        const bots = stmt.all();
        
        bots.forEach(bot => {
            const settings = db.getSettings(bot.bot_number);
            if (!global.db.data.settings[bot.bot_number]) {
                global.db.data.settings[bot.bot_number] = {};
            }
            global.db.data.settings[bot.bot_number].config = settings;
        });
        
        console.log(`✅ Loaded settings for ${bots.length} bots from database`);
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Initialize on require
loadAllSettings();

module.exports = db;