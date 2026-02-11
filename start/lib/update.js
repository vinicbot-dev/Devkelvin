const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const settings = require('../../config');

function createFakeContact(message) {
    return {
        key: {
            participants: "0@s.whatsapp.net",
            remoteJid: "0@s.whatsapp.net",
            fromMe: false
        },
        message: {
            contactMessage: {
                displayName: "Jexploit",
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Update;;;\nFN:Davex System Update\nitem1.TEL;waid=${message.key.participant?.split('@')[0] || message.key.remoteJid.split('@')[0]}:${message.key.participant?.split('@')[0] || message.key.remoteJid.split('@')[0]}\nitem1.X-ABLabel:Update Bot\nEND:VCARD`
            }
        },
        participant: "0@s.whatsapp.net"
    };
}

function run(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, { windowsHide: true }, (err, stdout, stderr) => {
            if (err) return reject(new Error(stderr || stdout || err.message));
            resolve(stdout.toString().trim());
        });
    });
}

async function hasGitRepo() {
    const gitDir = path.join(process.cwd(), '.git');
    if (!fs.existsSync(gitDir)) return false;
    try {
        await run('git --version');
        return true;
    } catch {
        return false;
    }
}

async function updateViaGit() {
    const oldRev = await run('git rev-parse HEAD').catch(() => 'unknown');
    await run('git fetch --all --prune');
    const newRev = await run('git rev-parse origin/main').catch(() => 'unknown');

    const alreadyUpToDate = oldRev === newRev;
    const commits = alreadyUpToDate ? '' : await run(`git log --pretty=format:"%h %s (%an)" ${oldRev}..${newRev}`).catch(() => '');
    const files = alreadyUpToDate ? '' : await run(`git diff --name-status ${oldRev} ${newRev}`).catch(() => '');

    await run(`git reset --hard ${newRev}`);
    await run('git clean -fd');

    return { oldRev, newRev, alreadyUpToDate, commits, files };
}

function downloadFile(url, dest, visited = new Set()) {
    return new Promise((resolve, reject) => {
        if (visited.has(url) || visited.size > 5) return reject(new Error('Too many redirects'));
        visited.add(url);

        const client = url.startsWith('https://') ? https : require('http');
        const req = client.get(url, { headers: { 'User-Agent': 'Jexploit-Bot-Updater/1.0' } }, res => {
            if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
                const nextUrl = new URL(res.headers.location, url).toString();
                res.resume();
                return downloadFile(nextUrl, dest, visited).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));

            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => file.close(resolve));
            file.on('error', err => {
                fs.unlink(dest, () => reject(err));
            });
        });
        req.on('error', err => fs.unlink(dest, () => reject(err)));
    });
}

async function extractZip(zipPath, outDir) {
    if (process.platform === 'win32') {
        await run(`powershell -NoProfile -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${outDir}' -Force"`);
        return;
    }
    for (const tool of ['unzip', '7z', 'busybox unzip']) {
        try {
            await run(`command -v ${tool.split(' ')[0]}`);
            await run(`${tool} -o '${zipPath}' -d '${outDir}'`);
            return;
        } catch {}
    }
    throw new Error("No unzip tool found");
}

function copyRecursive(src, dest, ignore = [], relative = '', outList = []) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
        if (ignore.includes(entry)) continue;
        const s = path.join(src, entry);
        const d = path.join(dest, entry);
        const stat = fs.lstatSync(s);

        if (stat.isDirectory()) {
            copyRecursive(s, d, ignore, path.join(relative, entry), outList);
        } else {
            fs.mkdirSync(path.dirname(d), { recursive: true });
            fs.copyFileSync(s, d);
            outList.push(path.join(relative, entry).replace(/\\/g, '/'));
        }
    }
}

async function updateViaZip(zipUrl) {
    if (!zipUrl) throw new Error('No ZIP URL configured.');

    const tmpDir = path.join(process.cwd(), 'tmp');
    fs.mkdirSync(tmpDir, { recursive: true });

    const zipPath = path.join(tmpDir, 'update.zip');
    await downloadFile(zipUrl, zipPath);

    const extractTo = path.join(tmpDir, 'update_extract');
    fs.rmSync(extractTo, { recursive: true, force: true });
    await extractZip(zipPath, extractTo);

    const entries = fs.readdirSync(extractTo);
    const root = entries.length === 1 && fs.lstatSync(path.join(extractTo, entries[0])).isDirectory()
        ? path.join(extractTo, entries[0])
        : extractTo;

    const ignore = ['node_modules', '.git', 'session', 'tmp', 'temp', 'data', 'baileys_store.json'];
    const copied = [];
    copyRecursive(root, process.cwd(), ignore, '', copied);

    fs.rmSync(extractTo, { recursive: true, force: true });
    fs.rmSync(zipPath, { force: true });

    return { copiedFiles: copied };
}

async function restartProcess(conn, chatId, message) {
    const fakeContact = createFakeContact(message);
    await conn.sendMessage(chatId, { text: 'Update finished restarting' }, { quoted: fakeContact }).catch(() => {});
    try {
        await run('pm2 restart all');
    } catch {
        setTimeout(() => process.exit(0), 500);
    }
}

async function updateCommand(conn, Access, chatId, message, zipOverride) {
    const fakeContact = createFakeContact(message);
    const senderId = message.key.participant || message.key.remoteJid;
    

    if (!message.key.fromMe && !Access) {
        return conn.sendMessage(chatId, { text: 'System update unauthorized' }, { quoted: fakeContact });
    }

    let statusMessage;
    try {
        statusMessage = await conn.sendMessage(chatId, { text: 'System update initialization' }, { quoted: fakeContact });

        if (await hasGitRepo()) {
            await conn.sendMessage(chatId, { text: 'Repository synchronization', edit: statusMessage.key });
            const { oldRev, newRev, alreadyUpToDate } = await updateViaGit();
            const summary = alreadyUpToDate ? `System current: ${newRev}` : `Version transition: ${oldRev.slice(0, 7)} to ${newRev.slice(0, 7)}`;
            await conn.sendMessage(chatId, { text: `${summary}\nDependency installation`, edit: statusMessage.key });
        } else {
            await conn.sendMessage(chatId, { text: 'Archive update download', edit: statusMessage.key });
            const { copiedFiles } = await updateViaZip(zipOverride || `${global.updateZipUrl}` || process.env.UPDATE_ZIP_URL);
            await conn.sendMessage(chatId, { text: `Archive extraction: ${copiedFiles.length} files\nDependency installation`, edit: statusMessage.key });
        }

        await run('npm install --no-audit --no-fund');
        await conn.sendMessage(chatId, { text: 'Update finalized system restart', edit: statusMessage.key });
        await restartProcess(conn, chatId, message);
    } catch (err) {
        console.error('Update failed:', err);
        const errorMsg = `Update procedure failure:\n${String(err.message || err).slice(0, 1000)}`;
        if (statusMessage?.key) {
            await conn.sendMessage(chatId, { text: errorMsg, edit: statusMessage.key });
        } else {
            await conn.sendMessage(chatId, { text: errorMsg }, { quoted: fakeContact });
        }
    }
}

module.exports = updateCommand;