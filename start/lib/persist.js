// start/lib/persist.js
// Keeps the bot's local data files alive across Heroku restarts by snapshotting
// them into Postgres (DATABASE_URL) and restoring them on boot.
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
  'data/welcome_sent.json',
  'start/src/group.db',
  'start/lib/database/store.json',
  'start/lib/database/badwords.json',
];
// Whole folders to keep (WhatsApp login + paired sub-sessions)
const TRACKED_DIRS = ['sessions', 'subsessions'];

let pool = null;
let ready = false;      // true only after a successful restore
let saving = false;
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
    console.error('[persist] restore failed:', e.message);
    return 0;
  }
}

async function save() {
  if (!enabled() || !ready || saving) return;
  const db = getPool();
  if (!db) return;
  saving = true;
  try {
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

function startAutoSave() {
  if (!enabled()) return;
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

module.exports = { restore, save, ensureDefaults, startAutoSave };
