const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class SQLiteDB {
    constructor() {
        this.dbPath = path.join(__dirname, '../../database.db');
        this.ensureDBDir();
        this.db = new Database(this.dbPath);
        this.initTables();
    }

    // ADD THESE METHODS TO PROXY THE DATABASE METHODS
    prepare(sql) {
        return this.db.prepare(sql);
    }

    exec(sql) {
        return this.db.exec(sql);
    }

    all(sql, params = []) {
        const stmt = this.db.prepare(sql);
        return stmt.all(...params);
    }

    get(sql, params = []) {
        const stmt = this.db.prepare(sql);
        return stmt.get(...params);
    }

    run(sql, params = []) {
        const stmt = this.db.prepare(sql);
        return stmt.run(...params);
    }

    ensureDBDir() {
        const dir = path.dirname(this.dbPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    initTables() {
        // Settings table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS settings (
                bot_number TEXT PRIMARY KEY,
                config TEXT,
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

        // Chats table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS chats (
                jid TEXT PRIMARY KEY,
                name TEXT,
                welcome_enabled INTEGER DEFAULT 1,
                antilink_enabled INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // ADD THIS TABLE FOR GROUP ACTIVITY TRACKING
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS group_messages (
                group_jid TEXT,
                user_jid TEXT,
                count INTEGER DEFAULT 0,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (group_jid, user_jid)
            )
        `);

        console.log('✅ SQLite database initialized');
    }

    // Settings methods
    getSettings(botNumber) {
        const stmt = this.db.prepare('SELECT config FROM settings WHERE bot_number = ?');
        const result = stmt.get(botNumber);
        return result ? JSON.parse(result.config) : null;
    }

    saveSettings(botNumber, config) {
        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO settings (bot_number, config, updated_at) 
            VALUES (?, ?, CURRENT_TIMESTAMP)
        `);
        stmt.run(botNumber, JSON.stringify(config));
    }

    // Messages methods for anti-delete/anti-edit
    saveMessage(keyId, messageData, jid, fromMe = 0) {
        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO messages (key_id, message_data, jid, from_me)
            VALUES (?, ?, ?, ?)
        `);
        try {
            stmt.run(keyId, JSON.stringify(messageData), jid, fromMe ? 1 : 0);
            return true;
        } catch (error) {
            console.error('Error saving message:', error);
            return false;
        }
    }

    getMessage(keyId) {
        const stmt = this.db.prepare('SELECT message_data FROM messages WHERE key_id = ?');
        const result = stmt.get(keyId);
        return result ? JSON.parse(result.message_data) : null;
    }

    deleteMessage(keyId) {
        const stmt = this.db.prepare('DELETE FROM messages WHERE key_id = ?');
        return stmt.run(keyId).changes > 0;
    }

    // User management methods
    getUser(jid) {
        const stmt = this.db.prepare('SELECT * FROM users WHERE jid = ?');
        return stmt.get(jid);
    }

    saveUser(jid, name = '', premium = 0, banned = 0) {
        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO users (jid, name, premium, banned) 
            VALUES (?, ?, ?, ?)
        `);
        stmt.run(jid, name, premium ? 1 : 0, banned ? 1 : 0);
    }

    // Chat management methods
    getChat(jid) {
        const stmt = this.db.prepare('SELECT * FROM chats WHERE jid = ?');
        return stmt.get(jid);
    }

    saveChat(jid, name, welcomeEnabled = 1, antilinkEnabled = 0) {
        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO chats (jid, name, welcome_enabled, antilink_enabled) 
            VALUES (?, ?, ?, ?)
        `);
        stmt.run(jid, name, welcomeEnabled ? 1 : 0, antilinkEnabled ? 1 : 0);
    }

    // Group messages methods for activity tracking
    addGroupMessage(groupJid, userJid) {
        const stmt = this.db.prepare(`
            INSERT INTO group_messages (group_jid, user_jid, count) 
            VALUES (?, ?, 1) 
            ON CONFLICT(group_jid, user_jid) 
            DO UPDATE SET count = count + 1, last_updated = CURRENT_TIMESTAMP
        `);
        stmt.run(groupJid, userJid);
    }

    getActiveUsers(groupJid) {
        const stmt = this.db.prepare(`
            SELECT user_jid AS jid, count 
            FROM group_messages 
            WHERE group_jid = ? 
            ORDER BY count DESC
        `);
        return stmt.all(groupJid);
    }

    // Close database connection
    close() {
        this.db.close();
    }
}

// Create global database instance
const db = new SQLiteDB();

// Initialize global data structure similar to lowdb
global.db = {
    data: {
        settings: {},
        users: {},
        chats: {},
        messages: {}
    },
    
    // Helper methods to maintain compatibility
    getSettings(botNumber) {
        return db.getSettings(botNumber) || { config: {} };
    },
    
    saveSettings(botNumber, config) {
        db.saveSettings(botNumber, config);
        // Update in-memory cache
        if (!global.db.data.settings[botNumber]) {
            global.db.data.settings[botNumber] = {};
        }
        global.db.data.settings[botNumber].config = config;
    },
    
    // Initialize data on startup
    init() {
        // Load settings into memory for fast access
        const stmt = db.db.prepare('SELECT bot_number, config FROM settings');
        const settings = stmt.all();
        
        settings.forEach(setting => {
            if (!global.db.data.settings[setting.bot_number]) {
                global.db.data.settings[setting.bot_number] = {};
            }
            global.db.data.settings[setting.bot_number].config = JSON.parse(setting.config);
        });
        
        console.log('✅ Database data loaded into memory');
    }
};

// Initialize on require
global.db.init();

module.exports = db;