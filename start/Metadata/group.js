/*Kelvin Tech*/

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a separate database connection for group messages
const dbPath = path.join(__dirname, '../../start/src/group.db');
const groupDb = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Group database connection error:', err);
  else console.log('[JEXPLOIT] Connected to group database');
});

// Create table if it doesn't exist
groupDb.serialize(() => {
  groupDb.run(
    `CREATE TABLE IF NOT EXISTS messages (
      group_jid TEXT NOT NULL,
      user_jid TEXT NOT NULL,
      count INTEGER DEFAULT 1,
      lastActive INTEGER DEFAULT 0,
      PRIMARY KEY (group_jid, user_jid)
    )`,
    (err) => {
      if (err) console.error('Error creating messages table:', err);
      else console.log('[GROUP-DB] Messages table is ready');
    }
  );
});

const GroupDB = {
  addMessage: (groupJid, userJid) => {
    const now = Date.now();
    groupDb.run(
      `INSERT INTO messages (group_jid, user_jid, count, lastActive) 
       VALUES (?, ?, 1, ?) 
       ON CONFLICT(group_jid, user_jid) 
       DO UPDATE SET count = count + 1, lastActive = ?`,
      [groupJid, userJid, now, now],
      (err) => {
        if (err) console.error('Error inserting message:', err);
      }
    );
  },

  getActiveUsers: (groupJid) => {
    return new Promise((resolve, reject) => {
      groupDb.all(
        `SELECT user_jid AS jid, count, lastActive 
         FROM messages 
         WHERE group_jid = ? 
         ORDER BY count DESC`,
        [groupJid],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        }
      );
    });
  },

  // Optional: Get inactive users based on lastActive time
  getInactiveUsers: (groupJid, allParticipants, threshold = 7 * 24 * 60 * 60 * 1000) => {
    return new Promise((resolve, reject) => {
      const now = Date.now();
      groupDb.all(
        `SELECT user_jid FROM messages 
         WHERE group_jid = ? AND lastActive > ?`,
        [groupJid, now - threshold],
        (err, rows) => {
          if (err) return reject(err);
          const activeJids = rows.map(r => r.user_jid);
          const inactive = allParticipants.filter(jid => !activeJids.includes(jid));
          resolve(inactive);
        }
      );
    });
  },

  // Optional: Clear old data
  cleanupOldData: (days = 30) => {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    groupDb.run(
      `DELETE FROM messages WHERE lastActive < ?`,
      [cutoff],
      (err) => {
        if (err) console.error('Error cleaning old data:', err);
        else console.log(`[JEXPLOIT] Cleaned data older than ${days} days`);
      }
    );
  }
};

module.exports = GroupDB;