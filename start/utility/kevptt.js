/*Kelvin Tech*/


const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);

async function convertToPTT(audioPath) {
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    
    const outputPath = path.join(tempDir, `ptt_${Date.now()}.ogg`);
    
    try {
        // Convert to OPUS format for WhatsApp PTT with optimal settings
        await execPromise(`ffmpeg -i "${audioPath}" -c:a libopus -b:a 24k -ar 16000 -ac 1 -application voip "${outputPath}"`);
        
        if (fs.existsSync(outputPath)) {
            const buffer = fs.readFileSync(outputPath);
            fs.unlinkSync(outputPath);
            return buffer;
        }
        return null;
    } catch (error) {
        console.error('PTT conversion error:', error);
        return null;
    }
}

// Downloads a remote audio URL to a local temp file and returns that path.
// sendPTT (and ffmpeg underneath it) only ever worked with local paths -
// this is what lets callers keep passing catbox.moe-style links directly.
async function downloadToTemp(url) {
    const res = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 30000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        }
    });

    const buffer = Buffer.from(res.data);
    if (!buffer || buffer.length < 512) {
        throw new Error(`Downloaded audio is too small to be real (${buffer ? buffer.length : 0} bytes)`);
    }

    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const ext = (path.extname(url).split('?')[0] || '.mp3').slice(0, 5);
    const downloadedPath = path.join(tempDir, `src_${Date.now()}${ext}`);
    fs.writeFileSync(downloadedPath, buffer);
    return downloadedPath;
}

async function sendPTT(conn, chatId, audioSource, quoted) {
    let downloadedPath = null;
    try {
        if (!audioSource) {
            console.error('No audio source provided');
            return false;
        }

        // audioSource can be a local path (existing behavior) or an
        // http(s) URL - download URLs to a temp file first since ffmpeg
        // and fs.readFileSync below both need a real local path.
        let audioPath = audioSource;
        if (/^https?:\/\//i.test(audioSource)) {
            downloadedPath = await downloadToTemp(audioSource);
            audioPath = downloadedPath;
        }

        if (!fs.existsSync(audioPath)) {
            console.error('Audio file not found:', audioPath);
            return false;
        }
        
        const pttBuffer = await convertToPTT(audioPath);
        
        if (pttBuffer) {
            await conn.sendMessage(chatId, {
                audio: pttBuffer,
                mimetype: 'audio/ogg; codecs=opus',
                ptt: true
            }, { quoted });
            return true;
        }
        
        // Fallback: send as normal audio if PTT conversion fails
        const audioBuffer = fs.readFileSync(audioPath);
        await conn.sendMessage(chatId, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            ptt: false
        }, { quoted });
        return false;
    } catch (error) {
        console.error('Send PTT error:', error);
        return false;
    } finally {
        if (downloadedPath) {
            fs.unlink(downloadedPath, () => {});
        }
    }
}

module.exports = { convertToPTT, sendPTT };