const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class SQLiteDB {
    constructor() {
        this.dbPath = path.join(__dirname, './lib/database/database.db');
        this.ensureDBDir();
        this.db = new Database(this.dbPath);
        this.initTables();
    }

    // Database methods
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

        // Group settings table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS group_settings (
                group_jid TEXT PRIMARY KEY,
                settings TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

    // Group settings methods
    getGroupSettings(groupJid) {
        const stmt = this.db.prepare('SELECT settings FROM group_settings WHERE group_jid = ?');
        const result = stmt.get(groupJid);
        return result ? JSON.parse(result.settings) : null;
    }

    saveGroupSettings(groupJid, settings) {
        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO group_settings (group_jid, settings, updated_at) 
            VALUES (?, ?, CURRENT_TIMESTAMP)
        `);
        stmt.run(groupJid, JSON.stringify(settings));
    }

    close() {
        this.db.close();
    }
}

// Create global database instance
const db = new SQLiteDB();

// Initialize global data structure
global.db = {
    data: {
        settings: {},
        users: {},
        chats: {}
    },
    
    // Helper methods
    getSettings(botNumber) {
        return db.getSettings(botNumber) || {};
    },
    
    saveSettings(botNumber, config) {
        db.saveSettings(botNumber, config);
        // Update in-memory cache
        if (!global.db.data.settings[botNumber]) {
            global.db.data.settings[botNumber] = {};
        }
        global.db.data.settings[botNumber] = config;
    },
    
    getUser(jid) {
        return db.getUser(jid);
    },
    
    saveUser(jid, name, premium, banned) {
        db.saveUser(jid, name, premium, banned);
    },
    
    getGroupSettings(groupJid) {
        return db.getGroupSettings(groupJid) || {};
    },
    
    saveGroupSettings(groupJid, settings) {
        db.saveGroupSettings(groupJid, settings);
    },
    
    // Initialize data on startup
    init() {
        // Load settings into memory for fast access
        const stmt = db.db.prepare('SELECT bot_number, config FROM settings');
        const settings = stmt.all();
        
        settings.forEach(setting => {
            global.db.data.settings[setting.bot_number] = JSON.parse(setting.config);
        });
        
        console.log('✅ Database data loaded into memory');
    }
};

// Initialize on require
global.db.init();

module.exports = db;