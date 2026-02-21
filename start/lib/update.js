const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

function run(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, { windowsHide: true }, (err, stdout, stderr) => {
            if (err) return reject(new Error(stderr || stdout || err.message));
            resolve(stdout.toString().trim());
        });
    });
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

    const ignore = ['node_modules', '.git', 'sessions', 'tmp', 'temp', 'data', 'baileys_store.json', 'creds.json'];
    const copied = [];
    copyRecursive(root, process.cwd(), ignore, '', copied);

    fs.rmSync(extractTo, { recursive: true, force: true });
    fs.rmSync(zipPath, { force: true });

    return { copiedFiles: copied };
}

async function updateCommand(conn, Access, chatId, message) {
    if (!Access) {
        return conn.sendMessage(chatId, { text: '❌ System update unauthorized' }, { quoted: message });
    }

    let statusMsg;
    try {
        statusMsg = await conn.sendMessage(chatId, { 
            text: '*JEXPLOIT UPDATE*\n\nInitializing update process...' 
        }, { quoted: message });

        // Your GitHub repository URL
        const zipUrl = "https://github.com/vinicbot-dev/Devkelvin/archive/refs/heads/main.zip";

        await conn.sendMessage(chatId, { 
            text: '*JEXPLOIT UPDATE*\n\n📥 Downloading latest version...',
            edit: statusMsg.key 
        });

        const { copiedFiles } = await updateViaZip(zipUrl);

        await conn.sendMessage(chatId, { 
            text: `*JEXPLOIT UPDATE*\n\n✅ Downloaded ${copiedFiles.length} files\n📦 Installing dependencies...`,
            edit: statusMsg.key 
        });

        await run('npm install --no-audit --no-fund');

        await conn.sendMessage(chatId, { 
            text: `✅ *UPDATE COMPLETE!*\n\n📁 Files updated: ${copiedFiles.length}\n📦 Dependencies installed\n\n♻️ Restarting bot in 3 seconds...`,
            edit: statusMsg.key 
        });

        setTimeout(() => {
            process.exit(0);
        }, 3000);

    } catch (err) {
        console.error('Update failed:', err);
        const errorMsg = `❌ *UPDATE FAILED!*\n\n${String(err.message || err).slice(0, 500)}`;
        
        if (statusMsg?.key) {
            await conn.sendMessage(chatId, { text: errorMsg, edit: statusMsg.key });
        } else {
            await conn.sendMessage(chatId, { text: errorMsg }, { quoted: message });
        }
    }
}

module.exports = updateCommand;