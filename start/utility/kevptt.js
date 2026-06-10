/*Kelvin Tech*/


const fs = require('fs');
const path = require('path');
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

async function sendPTT(conn, chatId, audioPath, quoted) {
    try {
        if (!audioPath || !fs.existsSync(audioPath)) {
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
    }
}

module.exports = { convertToPTT, sendPTT };