// start/lib/persist.js
// Keeps the bot's local data files alive across Heroku restarts by snapshotting
// them into Heroku Postgres (DATABASE_URL, added by the app.json addon) and
// restoring them on boot.
// Without DATABASE_URL (or the `pg` package) it silently does nothing, so the
// bot still runs locally / on hosts with a persistent disk.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..', '..');
const TABLE = 'jexploit_files';
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const SAVE_EVERY_MS = 2 * 60 * 1000;

// Individual files to keep
const TRACKED_FILES = [
  'data/database.json',
  'data/owner.json',
  'data/bot.db',
  'data/server_uptime.json',
  'data/uptime_origin.json',
  'data/welcome_sent.json',
  'start/src/group.db',
  'start/lib/database/store.json',
  'start/lib/database/badwords.json',
];
// Whole folders to keep (WhatsApp login + paired sub-sessions).
// When SESSION_ID is set, that env var is the source of truth for the primary login
// (index.js rewrites sessions/creds.json from it on every boot), so the primary
// sessions/ folder is NOT backed up in that case - restoring older key files next to
// a freshly written creds.json could only cause mismatches. Sub-sessions paired
// through the pairing site have no env var, so they are always kept.
const TRACKED_DIRS = process.env.SESSION_ID ? ['subsessions'] : ['sessions', 'subsessions'];

let pool = null;
let ready = false;      // true only after a successful restore
let saving = false;
let saveQueued = false; // a save was requested while another one was running
let restorePromise = null;
const beforeSaveHooks = []; // e.g. in-memory sql.js databases flush themselves to disk here
const lastHash = new Map();

function enabled() {
  return !!process.env.DATABASE_URL;
}

function getPool() {
  if (pool) return pool;
  let Pool;
  try {
    ({ Pool } = require('pg'));
  } catch (e) {
    console.log('[persist] "pg" package not installed - persistence disabled');
    return null;
  }
  const url = process.env.DATABASE_URL;
  const local = /localhost|127\.0\.0\.1/.test(url) || process.env.PGSSLMODE === 'disable';
  pool = new Pool({
    connectionString: url,
    ssl: local ? false : { rejectUnauthorized: false }, // Heroku Postgres needs this
    max: 2,
  });
  pool.on('error', (e) => console.error('[persist] pool error:', e.message));
  return pool;
}

const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const toRel = (abs) => path.relative(ROOT, abs).split(path.sep).join('/');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function walk(dirAbs, out = []) {
  let entries;
  try { entries = fs.readdirSync(dirAbs, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = path.join(dirAbs, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile()) out.push(p);
  }
  return out;
}

function localFiles() {
  const list = [];
  for (const f of TRACKED_FILES) {
    const abs = path.join(ROOT, f);
    if (fs.existsSync(abs)) list.push(abs);
  }
  for (const d of TRACKED_DIRS) walk(path.join(ROOT, d), list);
  return list;
}

const isTracked = (rel) =>
  TRACKED_FILES.includes(rel) || TRACKED_DIRS.some((d) => rel.startsWith(d + '/'));

async function restore() {
  if (!enabled()) {
    console.log('[persist] DATABASE_URL not set - data will NOT survive restarts on Heroku');
    return 0;
  }
  const db = getPool();
  if (!db) return 0;
  // a hiccup while the dyno is booting shouldn't silently disable saving for the whole run
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await db.query(
        `CREATE TABLE IF NOT EXISTS ${TABLE} (
           path text PRIMARY KEY,
           content bytea NOT NULL,
           updated_at timestamptz NOT NULL DEFAULT now()
         )`
      );
      const { rows } = await db.query(`SELECT path, content FROM ${TABLE}`);
      let n = 0;
      for (const row of rows) {
        if (!isTracked(row.path)) continue;
        const abs = path.join(ROOT, row.path);
        fs.mkdirSync(path.dirname(abs), { recursive: true });
        fs.writeFileSync(abs, row.content);
        lastHash.set(row.path, sha(row.content));
        n++;
      }
      ready = true;
      console.log(`[persist] restored ${n} file(s) from Postgres`);
      return n;
    } catch (e) {
      lastErr = e;
      console.error(`[persist] restore attempt ${attempt}/3 failed:`, e.message);
      if (attempt < 3) await wait(3000);
    }
  }
  console.error('[persist] restore failed - saving stays OFF this run so existing backups are never overwritten:', lastErr && lastErr.message);
  return 0;
}

// Everything that needs the restored files (the SQL databases, the bot start-up) awaits
// this, so nothing ever reads a file that Postgres is about to overwrite.
function restoreOnce() {
  if (!restorePromise) restorePromise = restore().catch(() => 0);
  return restorePromise;
}

function registerBeforeSave(fn) {
  if (typeof fn === 'function') beforeSaveHooks.push(fn);
}

async function save() {
  if (!enabled() || !ready) return;
  if (saving) { saveQueued = true; return; } // run again right after, never drop a request
  const db = getPool();
  if (!db) return;
  saving = true;
  try {
    for (const fn of beforeSaveHooks) {
      try { await fn(); } catch (e) { console.error('[persist] flush hook failed:', e.message); }
    }
    const present = new Set();
    let up = 0;
    for (const abs of localFiles()) {
      const rel = toRel(abs);
      present.add(rel);
      let buf;
      try {
        const st = fs.statSync(abs);
        if (st.size > MAX_FILE_BYTES) continue;
        buf = fs.readFileSync(abs);
      } catch { continue; }
      const h = sha(buf);
      if (lastHash.get(rel) === h) continue;
      await db.query(
        `INSERT INTO ${TABLE} (path, content, updated_at) VALUES ($1, $2, now())
         ON CONFLICT (path) DO UPDATE SET content = EXCLUDED.content, updated_at = now()`,
        [rel, buf]
      );
      lastHash.set(rel, h);
      up++;
    }
    // Session files that no longer exist locally (logout / session reset) must not
    // be resurrected on the next boot.
    const { rows } = await db.query(`SELECT path FROM ${TABLE}`);
    for (const { path: rel } of rows) {
      const inDir = TRACKED_DIRS.some((d) => rel.startsWith(d + '/'));
      if (inDir && !present.has(rel)) {
        await db.query(`DELETE FROM ${TABLE} WHERE path = $1`, [rel]);
        lastHash.delete(rel);
      }
    }
    if (up) console.log(`[persist] saved ${up} changed file(s) to Postgres`);
  } catch (e) {
    console.error('[persist] save failed:', e.message);
  } finally {
    saving = false;
    if (saveQueued) {
      saveQueued = false;
      setImmediate(() => { save(); });
    }
  }
}

function ensureDefaults() {
  for (const d of ['data', 'sessions', 'start/src', 'start/lib/database']) {
    fs.mkdirSync(path.join(ROOT, d), { recursive: true });
  }
  for (const f of ['data/database.json', 'data/owner.json']) {
    const abs = path.join(ROOT, f);
    try {
      if (!fs.existsSync(abs) || fs.statSync(abs).size === 0) fs.writeFileSync(abs, '{}');
    } catch {}
  }
}

let autoSaveStarted = false;
function startAutoSave() {
  if (!enabled() || autoSaveStarted) return;
  autoSaveStarted = true;
  setInterval(() => { save(); }, SAVE_EVERY_MS);

  let closing = false;
  const flushAndExit = async (sig) => {
    if (closing) return;
    closing = true;
    console.log(`[persist] ${sig} received - saving before exit...`);
    const timer = setTimeout(() => process.exit(0), 20000); // Heroku allows 30s
    try { await save(); } catch {}
    clearTimeout(timer);
    process.exit(0);
  };
  process.on('SIGTERM', () => flushAndExit('SIGTERM'));
  process.on('SIGINT', () => flushAndExit('SIGINT'));
}

module.exports = { restore, restoreOnce, save, registerBeforeSave, ensureDefaults, startAutoSave };
