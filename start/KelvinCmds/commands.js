const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const webp = require('node-webpmux');
const crypto = require('crypto');
const axios = require("axios");
const yts = require("yt-search");

async function playCommand(conn, chatId, message, args) {
    try {
        const text = args.join(' ').trim();
        
        if (!text) return conn.sendMessage(chatId, { 
            text: '🎵 Please provide a song name or YouTube URL\nExample: .play shape of you' 
        }, { quoted: message });

        // Send initial processing message
        await conn.sendMessage(chatId, { 
            text: `🔍 Searching for: ${text}\n⏳ Please wait...` 
        }, { quoted: message });

        const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/play/v1?q=${encodeURIComponent(text)}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.success && data.result.downloadUrl) {
            const { metadata, downloadUrl } = data.result;
            
            // Format selection menu
            const formatMenu = `🎵 *${metadata.title}* - ${metadata.channel}
⏱️ Duration: ${metadata.duration}

*Choose download format:*
1. 📄 MP3 as Document
2. 🎧 MP3 as Audio (Play)
3. 🎙️ MP3 as Voice Note (PTT)

_Reply with 1, 2 or 3 to this message to download the format you prefer._`;
            
            // Send format selection menu
            const songmsg = await conn.sendMessage(chatId, { 
                text: formatMenu 
            }, { quoted: message });

            // Store the message ID for response handling
            const selectionHandler = async (msgUpdate) => {
                try {
                    const mp3msg = msgUpdate.messages[0];
                    if (!mp3msg.message || !mp3msg.message.extendedTextMessage) return;
                    if (mp3msg.key.remoteJid !== chatId) return;

                    const selectedOption = mp3msg.message.extendedTextMessage.text.trim();

                    if (
                        mp3msg.message.extendedTextMessage.contextInfo &&
                        mp3msg.message.extendedTextMessage.contextInfo.stanzaId === songmsg.key.id
                    ) {
                        // Remove the listener to prevent multiple responses
                        conn.ev.off('messages.upsert', selectionHandler);
                        
                        await conn.sendMessage(chatId, { react: { text: "⬇️", key: mp3msg.key } });

                        switch (selectedOption) {
                            case "1":   
                                await conn.sendMessage(chatId, { 
                                    document: { url: downloadUrl }, 
                                    mimetype: "audio/mpeg", 
                                    fileName: `${metadata.title}.mp3`.replace(/[<>:"/\\|?*]/g, ''),
                                    caption: `🎵 *${metadata.title}*\n🎤 ${metadata.channel}\n⏱️ ${metadata.duration}`
                                }, { quoted: mp3msg });   
                                break;
                                
                            case "2":   
                                await conn.sendMessage(chatId, { 
                                    audio: { url: downloadUrl }, 
                                    mimetype: "audio/mp4",
                                    fileName: `${metadata.title}.mp3`.replace(/[<>:"/\\|?*]/g, ''),
                                    contextInfo: {
                                        externalAdReply: {
                                            title: metadata.title.slice(0, 60),
                                            body: `By ${metadata.channel}`.slice(0, 30),
                                            mediaType: 2,
                                            thumbnailUrl: metadata.cover,
                                            mediaUrl: metadata.url
                                        }
                                    }
                                }, { quoted: mp3msg });
                                break;
                                
                            case "3":   
                                await conn.sendMessage(chatId, { 
                                    audio: { url: downloadUrl }, 
                                    mimetype: "audio/mp4", 
                                    ptt: true,
                                    fileName: `${metadata.title}.mp3`.replace(/[<>:"/\\|?*]/g, '')
                                }, { quoted: mp3msg });
                                break;

                            default:
                                await conn.sendMessage(
                                    chatId,
                                    {
                                        text: "*❌ Invalid selection! Please reply with 1, 2 or 3*",
                                    },
                                    { quoted: mp3msg }
                                );
                        }
                    }
                } catch (error) {
                    console.error('Selection handler error:', error);
                }
            };

            // Add the listener for format selection
            conn.ev.on('messages.upsert', selectionHandler);

            // Set timeout to remove listener after 2 minutes
            setTimeout(() => {
                conn.ev.off('messages.upsert', selectionHandler);
            }, 120000);
           
        } else {
            await conn.sendMessage(chatId, { 
                text: '❌ No results found or download failed. Please try another song.' 
            }, { quoted: message });
        }
        
    } catch (error) {
        console.error('Play command error:', error);
        await conn.sendMessage(chatId, { 
            text: '❌ Error fetching audio. Please try again later.' 
        }, { quoted: message });
    }
}

async function takeCommand(conn, chatId, message, args) {
    try {
        // Check if message is a reply to a sticker
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quotedMessage?.stickerMessage) {
            await conn.sendMessage(chatId, { text: '❌ Reply to a sticker with .take <packname>' });
            return;
        }

        // Get the packname from args or use default
        const packname = args.join(' ') || 'Vinic-Xmd';

        try {
            // Download the sticker
            const stickerBuffer = await downloadMediaMessage(
                {
                    key: message.message.extendedTextMessage.contextInfo.stanzaId,
                    message: quotedMessage,
                    messageType: 'stickerMessage'
                },
                'buffer',
                {},
                {
                    logger: console,
                    reuploadRequest: conn.updateMediaMessage
                }
            );

            if (!stickerBuffer) {
                await conn.sendMessage(chatId, { text: '❌ Failed to download sticker' });
                return;
            }

            // Add metadata using webpmux
            const img = new webp.Image();
            await img.load(stickerBuffer);

            // Create metadata
            const json = {
                'sticker-pack-id': crypto.randomBytes(32).toString('hex'),
                'sticker-pack-name': packname,
                'emojis': ['🤖']
            };

            // Create exif buffer
            const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
            const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
            const exif = Buffer.concat([exifAttr, jsonBuffer]);
            exif.writeUIntLE(jsonBuffer.length, 14, 4);

            // Set the exif data
            img.exif = exif;

            // Get the final buffer with metadata
            const finalBuffer = await img.save(null);

            // Send the sticker
            await conn.sendMessage(chatId, {
                sticker: finalBuffer
            }, {
                quoted: message
            });

        } catch (error) {
            console.error('Sticker processing error:', error);
            await conn.sendMessage(chatId, { text: '❌ Error processing sticker' });
        }

    } catch (error) {
        console.error('Error in take command:', error);
        await conn.sendMessage(chatId, { text: '❌ Error processing command' });
    }
}

async function videoCommand(conn, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const args = text.split(' ').slice(1); // Remove command prefix
        const searchQuery = args.join(' ').trim();

        // Start reaction
        await conn.sendMessage(chatId, { react: { text: '⏳', key: message.key } });

        // Your command logic here
        if (!searchQuery) {
            await conn.sendMessage(chatId, { 
                text: 'Please provide some text!' 
            }, { quoted: message });
            return;
        }

        // Example: Echo command
        await conn.sendMessage(chatId, {
            text: `✅ You said: ${searchQuery}`
        }, { quoted: message });

        // Success reaction
        await conn.sendMessage(chatId, { react: { text: '✅', key: message.key } });

    } catch (error) {
        console.log('❌ MyCommand Error:', error.message);
        await conn.sendMessage(chatId, { text: 'Command failed: ' + error.message }, { quoted: message });
        await conn.sendMessage(chatId, { react: { text: '❌', key: message.key } });
    }
}

async function ytplayCommand(conn, chatId, query, message) {
    if (!query) {
        return await conn.sendMessage(chatId, {
            text: "⚠️ Please provide a YouTube link or search query.\n\nExample:\n```.ytplay another love```"
        });
    }

    try {
        let videoUrl = query;

        // Step 1: React while searching
        await conn.sendMessage(chatId, { react: { text: "⏳", key: message.key } });

        if (!query.includes("youtube.com") && !query.includes("youtu.be")) {
            const search = await yts(query);
            if (!search.videos || search.videos.length === 0) {
                return await conn.sendMessage(chatId, { text: `❌ No results found for: ${query}` });
            }
            videoUrl = search.videos[0].url;
        }

        // Step 2: React while fetching link
        await conn.sendMessage(chatId, { react: { text: "📥", key: message.key } });

        const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(apiUrl, { timeout: 60000 });
        const data = response.data?.result;

        if (!data || !data.download_url) {
            await conn.sendMessage(chatId, { react: { text: "❌", key: message.key } });
            return await conn.sendMessage(chatId, { text: "❌ Failed to fetch audio. Try another link." });
        }

        // Step 3: React while sending audio
        await conn.sendMessage(chatId, { react: { text: "🎶", key: message.key } });

        await conn.sendMessage(chatId, {
            audio: { url: data.download_url },
            mimetype: "audio/mpeg",
            ptt: false,
            fileName: `${data.title || "yt-audio"}.mp3`,
            contextInfo: {
                externalAdReply: {
                    title: data.title || "YouTube Audio",
                    body: "🎶 Powered by YTPlay",
                    thumbnailUrl: data.thumbnail,
                    sourceUrl: videoUrl,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });

        // Final ✅ reaction
        await conn.sendMessage(chatId, { react: { text: "✅", key: message.key } });

    } catch (error) {
        console.error("YTPlay Error:", error.message);
        await conn.sendMessage(chatId, { react: { text: "❌", key: message.key } });
        await conn.sendMessage(chatId, { text: "❌ An error occurred while processing your request." });
    }
}

// ========== MEDIAFIRE DOWNLOADER ==========
async function handleMediafireDownload(url, conn, m) {
    try {
        // Show typing indicator
        await conn.sendPresenceUpdate('composing', m.chat);
        
        // Check if it's a MediaFire link
        if (!url.includes('mediafire.com')) {
            throw new Error('❌ Please provide a valid MediaFire link');
        }

        // Encode the URL for the API
        const encodedUrl = encodeURIComponent(url);
        const apiUrl = `https://api.nekolabs.web.id/downloader/mediafire?url=${encodedUrl}`;
        
        // Fetch download info from API
        const { data } = await axios.get(apiUrl);
        
        if (!data || !data.result) {
            throw new Error('❌ Failed to fetch download information from MediaFire');
        }

        const fileInfo = data.result;
        
        // Send file information first
        const fileInfoText = `📥 *MEDIAFIRE DOWNLOADER*\n\n` +
                           `📄 *File Name:* ${fileInfo.filename || 'Unknown'}\n` +
                           `📦 *File Size:* ${fileInfo.filesize || 'Unknown'}\n` +
                           `🔗 *Download URL:* ${fileInfo.url || 'Not available'}\n\n` +
                           `⏳ *Downloading file...*`;

        await conn.sendMessage(m.chat, { text: fileInfoText }, { quoted: m });

        // Download the file
        const fileBuffer = await getBuffer(fileInfo.url);
        
        if (!fileBuffer || fileBuffer.length === 0) {
            throw new Error('❌ Failed to download file from MediaFire');
        }

        // Determine file type and send accordingly
        const fileType = await fromBuffer(fileBuffer);
        const filename = fileInfo.filename || `mediafire_download_${Date.now()}`;
        
        // Send the file based on its type
        if (fileType && fileType.mime.startsWith('image/')) {
            await conn.sendMessage(m.chat, { 
                image: fileBuffer,
                caption: `✅ *Download Successful!*\n\n📄 ${filename}\n📦 ${formatSize(fileBuffer.length)}`,
                fileName: filename
            }, { quoted: m });
            
        } else if (fileType && fileType.mime.startsWith('video/')) {
            await conn.sendMessage(m.chat, { 
                video: fileBuffer,
                caption: `✅ *Download Successful!*\n\n📄 ${filename}\n📦 ${formatSize(fileBuffer.length)}`,
                fileName: filename
            }, { quoted: m });
            
        } else if (fileType && fileType.mime.startsWith('audio/')) {
            await conn.sendMessage(m.chat, { 
                audio: fileBuffer,
                caption: `✅ *Download Successful!*\n\n📄 ${filename}\n📦 ${formatSize(fileBuffer.length)}`,
                fileName: filename,
                mimetype: fileType.mime
            }, { quoted: m });
            
        } else if (fileType && fileType.mime === 'application/pdf') {
            await conn.sendMessage(m.chat, { 
                document: fileBuffer,
                caption: `✅ *Download Successful!*\n\n📄 ${filename}\n📦 ${formatSize(fileBuffer.length)}`,
                fileName: filename,
                mimetype: 'application/pdf'
            }, { quoted: m });
            
        } else {
            // Send as document for unknown file types
            await conn.sendMessage(m.chat, { 
                document: fileBuffer,
                caption: `✅ *Download Successful!*\n\n📄 ${filename}\n📦 ${formatSize(fileBuffer.length)}\n📝 File Type: ${fileType ? fileType.mime : 'Unknown'}`,
                fileName: filename
            }, { quoted: m });
        }

        console.log(`✅ MediaFire download completed: ${filename}`);

    } catch (error) {
        console.error('❌ MediaFire download error:', error);
        
        let errorMessage = '❌ *Download Failed!*\n\n';
        
        if (error.message.includes('valid MediaFire link')) {
            errorMessage += 'Please provide a valid MediaFire download link.';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage += 'Unable to fetch file information from MediaFire.\nThe link may be invalid or the file may not exist.';
        } else if (error.message.includes('Failed to download')) {
            errorMessage += 'Unable to download the file.\nThe file may be too large or the download link may have expired.';
        } else {
            errorMessage += `Error: ${error.message}`;
        }
        
        await conn.sendMessage(m.chat, { text: errorMessage }, { quoted: m });
    }
}


module.exports = { playCommand, handleMediafireDownload, ytplayCommand, videoCommand, takeCommand }