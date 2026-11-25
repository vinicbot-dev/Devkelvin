// start/lib/audio.js - safe audio download + metadata (music-metadata is ESM-only, so load it with import())
const axios = require('axios');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

let _mm;
async function mm() {
    if (!_mm) _mm = await import('music-metadata');
    return _mm;
}

// Download the file ourselves (Baileys' {audio:{url}} fails on hosts that need headers/redirects)
async function downloadAudio(url, retries = 2) {
    let lastErr;
    for (let i = 0; i <= retries; i++) {
        try {
            const res = await axios.get(url, {
                responseType: 'arraybuffer',
                timeout: 90000,
                maxRedirects: 5,
                maxContentLength: 60 * 1024 * 1024,
                headers: { 'User-Agent': UA, 'Accept': '*/*', 'Referer': new URL(url).origin + '/' }
            });
            const buf = Buffer.from(res.data);
            const type = String(res.headers['content-type'] || '');
            // an HTML/JSON body or a tiny file means the link is dead/expired, not audio
            if (buf.length < 10 * 1024 || /text\/html|application\/json/i.test(type)) {
                throw new Error(`Not audio (type: ${type || 'unknown'}, ${buf.length} bytes)`);
            }
            return buf;
        } catch (e) {
            lastErr = e;
            await new Promise(r => setTimeout(r, 1500));
        }
    }
    throw lastErr;
}

// Real duration/title/artist/mime from the actual bytes
async function getAudioInfo(buffer) {
    try {
        const { parseBuffer } = await mm();
        const meta = await parseBuffer(buffer, undefined, { duration: true });
        const secs = Math.round(meta.format.duration || 0);
        return {
            seconds: secs,
            duration: `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`,
            title: meta.common.title || null,
            artist: meta.common.artist || null,
            codec: meta.format.codec || null,
            container: meta.format.container || null
        };
    } catch {
        return null; // never let metadata break the send
    }
}

module.exports = { downloadAudio, getAudioInfo };
