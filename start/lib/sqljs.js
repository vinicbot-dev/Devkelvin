// start/lib/sqljs.js
// A small wrapper that gives `sql.js` (pure JavaScript/WASM SQLite - no native build,
// installs everywhere including Heroku) the same callback API the bot already used
// with the native `sqlite3` package: run / get / all / serialize / close.
//
// Persistence: sql.js keeps the database in memory, so this wrapper
//   1. waits for persist.js to restore the files from Postgres BEFORE opening the file,
//   2. writes the database to its .db file shortly after every change, and
//   3. asks persist.js to push the file to Postgres (so a Heroku dyno reset keeps
//      every setting). persist.js also flushes all databases right before each save
//      and on SIGTERM, so nothing in memory is ever lost.
// Existing bot.db / group.db files made by the old sqlite3 package are normal SQLite
// files and open as they are.

const fs = require('fs');
const path = require('path');
const persist = require('./persist');

let sqlPromise = null;
function getSQL() {
    if (!sqlPromise) {
        const initSqlJs = require('sql.js');
        sqlPromise = initSqlJs();
    }
    return sqlPromise;
}

// sql.js is stricter than sqlite3 about bind values
function cleanParams(params) {
    return (params || []).map((v) => {
        if (v === undefined) return null;
        if (typeof v === 'boolean') return v ? 1 : 0;
        if (v instanceof Date) return v.toISOString();
        return v;
    });
}

class Database {
    /**
     * @param {string} filePath  database file
     * @param {function} [onOpen] called once with (err) when the database is ready
     * @param {object} [opts]    { pushDelayMs } how long after the last write the file is
     *                           pushed to Postgres (busy databases use a longer delay)
     */
    constructor(filePath, onOpen, opts = {}) {
        this.filePath = path.resolve(filePath);
        this.pushDelayMs = opts.pushDelayMs ?? 3000;
        this.db = null;
        this._openError = null;
        this._dirty = false;
        this._flushTimer = null;
        this._pushTimer = null;

        this.ready = this._open().catch((err) => { this._openError = err; });
        this.ready.then(() => { if (typeof onOpen === 'function') onOpen(this._openError); });

        // last-resort synchronous flush for hosts with a normal disk
        process.on('exit', () => { try { this.flushToDisk(); } catch {} });
    }

    async _open() {
        fs.mkdirSync(path.dirname(this.filePath), { recursive: true });

        // never open a file that Postgres is about to overwrite
        await persist.restoreOnce();

        const SQL = await getSQL();
        let bytes = null;
        try {
            const buf = fs.readFileSync(this.filePath);
            if (buf.length) bytes = new Uint8Array(buf);
        } catch {}

        if (bytes) {
            try {
                const test = new SQL.Database(bytes);
                test.exec('SELECT count(*) FROM sqlite_master');
                this.db = test;
            } catch (e) {
                const bad = `${this.filePath}.corrupt-${Date.now()}`;
                console.error(`[sqljs] ${path.basename(this.filePath)} is unreadable (${e.message}) - moved to ${path.basename(bad)}, starting empty`);
                try { fs.renameSync(this.filePath, bad); } catch {}
                this.db = new SQL.Database();
            }
        } else {
            this.db = new SQL.Database();
        }

        persist.registerBeforeSave(() => this.flushToDisk());
    }

    // ---- persistence -------------------------------------------------------

    flushToDisk() {
        if (!this.db || !this._dirty) return;
        const data = this.db.export(); // Uint8Array of the whole database
        const tmp = `${this.filePath}.tmp`;
        fs.writeFileSync(tmp, Buffer.from(data));
        fs.renameSync(tmp, this.filePath); // atomic: a crash never leaves a half-written file
        this._dirty = false;
    }

    _markDirty() {
        this._dirty = true;
        clearTimeout(this._flushTimer);
        this._flushTimer = setTimeout(() => {
            try { this.flushToDisk(); } catch (e) { console.error('[sqljs] flush failed:', e.message); }
        }, 500);

        clearTimeout(this._pushTimer);
        this._pushTimer = setTimeout(() => {
            persist.save().catch(() => {});
        }, this.pushDelayMs);
    }

    // ---- sqlite3-style API ---------------------------------------------------

    _args(params, cb) {
        if (typeof params === 'function') { cb = params; params = []; }
        if (params === undefined || params === null) params = [];
        if (!Array.isArray(params)) params = [params];
        return [cleanParams(params), cb];
    }

    // runs fn after the database is open, in call order, then reports back like sqlite3 does
    _exec(fn, cb, shape) {
        this.ready.then(() => {
            if (this._openError || !this.db) throw this._openError || new Error('database not open');
            return fn();
        }).then(
            (result) => {
                if (typeof cb !== 'function') return;
                // setImmediate so an error thrown by the caller's callback behaves like it did
                // with sqlite3 (uncaught) instead of being swallowed by this promise chain
                setImmediate(() => {
                    if (shape === 'run') cb.call({ lastID: null, changes: result }, null);
                    else cb(null, result);
                });
            },
            (err) => {
                if (typeof cb === 'function') setImmediate(() => cb(err));
                else console.error('[sqljs] query failed:', err.message);
            }
        );
    }

    _rows(sql, params) {
        const stmt = this.db.prepare(sql);
        try {
            stmt.bind(params);
            const rows = [];
            while (stmt.step()) rows.push(stmt.getAsObject());
            return rows;
        } finally {
            stmt.free();
        }
    }

    run(sql, params, cb) {
        [params, cb] = this._args(params, cb);
        this._exec(() => {
            this.db.run(sql, params);
            const changes = this.db.getRowsModified();
            this._markDirty();
            return changes;
        }, cb, 'run');
        return this;
    }

    get(sql, params, cb) {
        [params, cb] = this._args(params, cb);
        this._exec(() => this._rows(sql, params)[0], cb, 'get');
        return this;
    }

    all(sql, params, cb) {
        [params, cb] = this._args(params, cb);
        this._exec(() => this._rows(sql, params), cb, 'all');
        return this;
    }

    // statements already run strictly in call order, so this only has to call the function
    serialize(fn) {
        if (typeof fn === 'function') fn();
        return this;
    }

    close(cb) {
        this.ready.then(() => {
            let err = null;
            try {
                this.flushToDisk();
                if (this.db) this.db.close();
                this.db = null;
            } catch (e) { err = e; }
            if (typeof cb === 'function') cb(err);
        });
    }
}

module.exports = Database;
