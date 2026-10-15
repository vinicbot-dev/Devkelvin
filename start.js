// boot.js - real entry point.
// 1) restore data/session files from Postgres  2) start the bot  3) keep saving.
process.chdir(__dirname);
const persist = require('./start/lib/persist');

(async () => {
  try { await persist.restore(); } catch (e) { console.error('[boot] restore error:', e.message); }
  persist.ensureDefaults();
  persist.startAutoSave();

  // Optional: stop Eco dynos from sleeping. Set APP_URL=https://<your-app>.herokuapp.com
  if (process.env.APP_URL) {
    const lib = process.env.APP_URL.startsWith('https') ? require('https') : require('http');
    setInterval(() => {
      lib.get(process.env.APP_URL.replace(/\/$/, '') + '/uptime', (r) => r.resume()).on('error', () => {});
    }, 20 * 60 * 1000);
  }

  require('./index.js');
})();
