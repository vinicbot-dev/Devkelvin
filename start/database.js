// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class SQLiteDatabase {
    constructor(dbPath = './data/bot.db') {
        // Ensure data directory exists
        const dataDir = path.dirname(dbPath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        this.db = new sqlite3.Database(dbPath);
        this.initialized = this.init(); // Store the init promise
    }
    
    async init() {
        console.log('📦 Creating database tables...');
        
        // Create tables - wait for each to complete
        await new Promise((resolve, reject) => {
            this.db.run(`
                CREATE TABLE IF NOT EXISTS settings (
                    bot_number TEXT,
                    key TEXT,
                    value TEXT,
                    PRIMARY KEY (bot_number, key)
                )
            `, (err) => {
                if (err) reject(err);
                else {
                    console.log('✅ Settings table ready');
                    resolve();
                }
            });
        });
        
        await new Promise((resolve, reject) => {
            this.db.run(`
                CREATE TABLE IF NOT EXISTS sudo_users (
                    bot_number TEXT,
                    user_jid TEXT,
                    PRIMARY KEY (bot_number, user_jid)
                )
            `, (err) => {
                if (err) reject(err);
                else {
                    console.log('✅ Sudo users table ready');
                    resolve();
                }
            });
        });
        
        await new Promise((resolve, reject) => {
            this.db.run(`
                CREATE TABLE IF NOT EXISTS group_settings (
                    bot_number TEXT,
                    group_id TEXT,
                    key TEXT,
                    value TEXT,
                    PRIMARY KEY (bot_number, group_id, key)
                )
            `, (err) => {
                if (err) reject(err);
                else {
                    console.log('✅ Group settings table ready');
                    resolve();
                }
            });
        });
        
        console.log('✅ All database tables ready!');
    }
    
    async getSetting(botNumber, key) {
        // Wait for initialization before querying
        await this.initialized;
        
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT value FROM settings WHERE bot_number = ? AND key = ?',
                [botNumber, key],
                (err, row) => {
                    if (err) {
                        console.error('❌ Error in getSetting:', err);
                        reject(err);
                    } else {
                        try {
                            resolve(row ? JSON.parse(row.value) : null);
                        } catch (e) {
                            resolve(row ? row.value : null);
                        }
                    }
                }
            );
        });
    }
    
    async setSetting(botNumber, key, value) {
        // Wait for initialization before querying
        await this.initialized;
        
        return new Promise((resolve, reject) => {
            let valueToStore;
            try {
                valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
            } catch (e) {
                valueToStore = String(value);
            }
            
            this.db.run(
                `INSERT OR REPLACE INTO settings (bot_number, key, value) VALUES (?, ?, ?)`,
                [botNumber, key, valueToStore],
                (err) => {
                    if (err) {
                        console.error('❌ Error in setSetting:', err);
                        reject(err);
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    }
    
    async getSudo(botNumber) {
        // Wait for initialization before querying
        await this.initialized;
        
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT user_jid FROM sudo_users WHERE bot_number = ?',
                [botNumber],
                (err, rows) => {
                    if (err) {
                        console.error('❌ Error in getSudo:', err);
                        reject(err);
                    } else {
                        resolve(rows.map(r => r.user_jid));
                    }
                }
            );
        });
    }
    
    // Add this method to check if database is ready
    async isReady() {
        await this.initialized;
        return true;
    }
}

module.exports = SQLiteDatabase;