/*Kelvin Tech*/

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

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
  // Add a message from a user in a group
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

  // Get active users (users who have sent messages)
  getActiveUsers: (groupJid, limit = 100) => {
    return new Promise((resolve, reject) => {
      groupDb.all(
        `SELECT user_jid AS jid, count, lastActive 
         FROM messages 
         WHERE group_jid = ? 
         ORDER BY count DESC
         LIMIT ?`,
        [groupJid, limit],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        }
      );
    });
  },

  // Get inactive users (users who have NEVER sent a message)
  getInactiveUsers: (groupJid, allParticipants) => {
    return new Promise((resolve, reject) => {
      groupDb.all(
        `SELECT user_jid FROM messages WHERE group_jid = ?`,
        [groupJid],
        (err, rows) => {
          if (err) return reject(err);
          
          const activeJids = new Set(rows.map(row => row.user_jid));
          
          const inactiveUsers = allParticipants.filter(jid => !activeJids.has(jid));
          
          resolve(inactiveUsers);
        }
      );
    });
  },

  getStaleUsers: (groupJid, allParticipants, threshold = 7 * 24 * 60 * 60 * 1000) => {
    return new Promise((resolve, reject) => {
      const now = Date.now();
      
      groupDb.all(
        `SELECT user_jid FROM messages 
         WHERE group_jid = ? AND lastActive < ?`,
        [groupJid, now - threshold],
        (err, rows) => {
          if (err) return reject(err);
          
          const staleJids = rows.map(row => row.user_jid);
          resolve(staleJids);
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
  },

  // Close database connection (optional)
  close: () => {
    groupDb.close((err) => {
      if (err) console.error('Error closing group database:', err);
      else console.log('[JEXPLOIT] Group database closed');
    });
  }
};

module.exports = GroupDB;