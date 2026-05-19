// KelvinCmds/encrypt.js
const fs = require("fs");
const path = require("path");
const os = require("os");
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

let JsConfuser = null;
const getJsConfuser = () => (JsConfuser ||= require('js-confuser'));

async function encryptCommand(conn, m, args) {
    try {
        // Initial reaction
        await conn.sendMessage(m.chat, { react: { text: "🔐", key: m.key } });

        // Use system temp directory
        const tempDir = path.join(os.tmpdir(), "temp");
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        // Extract quoted message
        const quotedMsg = m.quoted || m.msg?.contextInfo?.quotedMessage;
        
        if (!quotedMsg) {
            return m.reply(
                "🔐 *ENCRYPT COMMAND*\n\n" +
                "Reply to a JavaScript (.js) file with `.enc` or `.encrypt`\n\n" +
                "📌 *Example:*\n" +
                "1. Send a .js file\n" +
                "2. Reply to it with `.enc`\n\n" +
                "✨ *Features:*\n" +
                "• Hard code obfuscation\n" +
                "• Variable renaming\n" +
                "• String encoding\n" +
                "• Control flow flattening"
            );
        }

        // Get document from quoted message
        const doc = quotedMsg.documentMessage || quotedMsg.msg?.documentMessage;
        
        if (!doc || !doc.fileName || !doc.fileName.endsWith('.js')) {
            return m.reply("❌ *Invalid File*\nPlease reply to a JavaScript (.js) file to encrypt.");
        }

        // Download the file
        let buffer;
        if (typeof conn.downloadMediaMessage === 'function') {
            buffer = await conn.downloadMediaMessage(quotedMsg);
        } else {
            const stream = await downloadContentFromMessage(doc, 'document');
            buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
        }

        if (!buffer || buffer.length === 0) {
            throw new Error("Failed to download the file or file is empty!");
        }

        const fileSize = buffer.length;
        const fileSizeKB = (fileSize / 1024).toFixed(2);

        // Check file size (max 5MB)
        if (fileSize > 5 * 1024 * 1024) {
            return m.reply("❌ *File Too Large*\nMaximum file size is 5MB for encryption.");
        }

        const fileName = doc.fileName;
        const originalCode = buffer.toString('utf8');

        // Update reaction to show progress
        await conn.sendMessage(m.chat, { react: { text: "⚙️", key: m.key } });

        const obfuscatedCode = await getJsConfuser().obfuscate(originalCode, {
            target: "node",
            preset: "high",
            compact: true,
            minify: true,
            flatten: true,
            renameVariables: true,
            renameGlobals: true,
            stringEncoding: true,
            stringConcealing: true,
            stringCompression: true,
            controlFlowFlattening: 1.0,
            opaquePredicates: 0.9,
            dispatcher: true,
            calculator: true,
            hexadecimalNumbers: true,
            movedDeclarations: true,
            objectExtraction: true,
            globalConcealing: true,
        });

        // Success reaction
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

        // Send obfuscated file
        await conn.sendMessage(m.chat, {
            document: Buffer.from(obfuscatedCode, 'utf8'),
            mimetype: 'application/javascript',
            fileName: `encrypted_${fileName}`,
            caption: `🔐 *Encrypted Successfully!*\n\n📄 *File:* ${fileName}\n📦 *Size:* ${fileSizeKB} KB → ${(obfuscatedCode.length / 1024).toFixed(2)} KB`
        }, { quoted: m });

    } catch (error) {
        console.error("Encrypt command error:", error);
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        
        let errorMessage = `❌ *Encryption Error:* ${error.message}`;
        
        if (error.message.includes('syntax')) {
            errorMessage = "❌ *Syntax Error!*\nThe JavaScript file contains syntax errors that prevent encryption.";
        } else if (error.message.includes('download')) {
            errorMessage = "❌ *Download Failed!*\nCould not download the file. Please try again.";
        }
        
        m.reply(errorMessage);
    }
}

module.exports = { encryptCommand };