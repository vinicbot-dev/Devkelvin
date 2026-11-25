const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const webp = require('node-webpmux');
const crypto = require('crypto');
const axios = require("axios");
const yts = require("yt-search");
const { sendButtons } = require('gifted-btns');

async function playCommand(conn, chatId, message, args) {
    try {
        const text = args.join(' ').trim();

        if (!text) return conn.sendMessage(chatId, {
            text: '🎵 *Please provide a song name or URL*'
        }, { quoted: message });

        let videoUrl, title, thumbnail;

        // Check if it's a YouTube link
        if (/youtu\.?be/.test(text)) {
            videoUrl = text;
            const id = (text.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/) || [])[1];
            if (!id) return conn.sendMessage(chatId, {
                text: '❌ Invalid YouTube link. Please provide a valid YouTube URL.'
            }, { quoted: message });

            thumbnail = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
            title = 'YouTube Audio';
        }
        // Search YouTube for song name
        else {
            await conn.sendMessage(chatId, {
                text: `🔍 Searching for: ${text}\n⏳ Please wait...`
            }, { quoted: message });

            const searchResults = await yts(text);
            if (!searchResults.videos || searchResults.videos.length === 0) {
                return await conn.sendMessage(chatId, {
                    text: `❌ No results found for: ${text}`
                }, { quoted: message });
            }

            const video = searchResults.videos[0];
            videoUrl = video.url;
            title = video.title;
            thumbnail = video.thumbnail;
        }

        // Loading reaction
        await conn.sendMessage(chatId, { react: { text: '⏳', key: message.key } });

        // === NexRay ytmp3 API ===
        console.log('🔄 Fetching audio from NexRay API...');
        const apiUrl = `https://api.nexray.eu.cc/downloader/ytmp3?url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(apiUrl, {
            timeout: 60000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const data = response.data;

        // Response shape: { status: true, result: { title, duration, filesize, url } }
        if (!data?.status || !data?.result?.url) {
            throw new Error('No audio URL found from NexRay');
        }

        const audioUrl = data.result.url;
        const finalTitle = data.result.title || title;
        const finalThumbnail = thumbnail;

        console.log('✅ NexRay API successful!');

        // === 1. Send thumbnail + caption first ===
        await conn.sendMessage(chatId, {
            image: { url: finalThumbnail },
            caption: `🎵 *${finalTitle}*\n\n⌛ Sending audio...`
        }, { quoted: message });

        // === 2. Send plain audio, tagged with the command message ===
        await conn.sendMessage(chatId, {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            fileName: `${finalTitle.replace(/[<>:"/\\|?*]/g, '_')}.mp3`,
            ptt: false
        }, { quoted: message });

        await conn.sendMessage(chatId, { react: { text: '✅', key: message.key } });

    } catch (error) {
        console.error('Play command error:', error);

        await conn.sendMessage(chatId, { react: { text: '❌', key: message.key } });

        let errorMessage = '❌ Error fetching audio. ';

        if (error.message.includes('timeout')) {
            errorMessage += 'Request timed out. Please try again.';
        } else if (error.message.includes('Invalid YouTube link')) {
            errorMessage += 'Invalid YouTube URL provided.';
        } else if (error.message.includes('No results found')) {
            errorMessage += 'No results found.';
        } else if (error.message.includes('No audio URL found')) {
            errorMessage += 'Could not retrieve audio. The video might be restricted.';
        } else {
            errorMessage += 'Please try again later.';
        }

        await conn.sendMessage(chatId, {
            text: errorMessage
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
        const packname = args.join(' ') || 'JEXPLIOT-BOT';

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
async function ytplayCommand(conn, chatId, query, message) {
    try {
        if (!query) {
            return await conn.sendMessage(chatId, {
                text: "Please provide a YouTube link or song name.\n\nExample:\n.ytplay another love\n.ytplay https://youtube.com/watch?v=..."
            });
        }

        let videoUrl, title, thumbnail, duration = 'N/A', author = 'Unknown', views = 0;

        // Check if it's a YouTube link
        if (/youtu\.?be/.test(query)) {
            videoUrl = query;
            const id = (query.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/) || [])[1];
            if (!id) {
                return await conn.sendMessage(chatId, {
                    text: "Invalid YouTube link."
                });
            }
            thumbnail = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
            title = "YouTube Video";
        }
        // Search YouTube for song name
        else {
            const searchResults = await yts(query);
            if (!searchResults.videos || searchResults.videos.length === 0) {
                return await conn.sendMessage(chatId, {
                    text: `No results found for: ${query}`
                });
            }
            const video = searchResults.videos[0];
            videoUrl = video.url;
            title = video.title || "Unknown Title";
            thumbnail = video.thumbnail || `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`;
            duration = video.duration || 'N/A';
            author = video.author?.name || 'Unknown';
            views = video.views || 0;
        }

        // Send song information
        const songInfo = `🎵 *${title}*\n\n` +
                         `👤 *Artist:* ${author}\n` +
                         `⏱ *Duration:* ${duration} seconds\n` +
                         `👁 *Views:* ${views ? views.toLocaleString() : 'N/A'}\n\n` +
                         `📌 *Reply with:*\n` +
                         `➜ *1* - Send as Audio (MP3)\n` +
                         `➜ *2* - Send as Video (MP4)`;

        await conn.sendMessage(chatId, {
            image: { url: thumbnail },
            caption: songInfo
        }, { quoted: message });

        // Create a response listener
        const responseListener = async (msgUpdate) => {
            try {
                const msg = msgUpdate.messages[0];
                if (!msg.message) return;
                if (msg.key.remoteJid !== chatId) return;
                if (msg.key.participant !== message.key.participant) return;

                const msgText = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
                const choice = msgText.trim();

                // Remove listener after receiving response
                conn.ev.off('messages.upsert', responseListener);

                if (choice === '1') {
                    // === AUDIO (MP3) via Nexray ===
                    await conn.sendMessage(chatId, { react: { text: '⏳', key: msg.key } });

                    const audioApi = `https://api.nexray.eu.cc/downloader/ytmp3?url=${encodeURIComponent(videoUrl)}`;
                    const audioRes = await axios.get(audioApi, { timeout: 60000 });
                    const audioData = audioRes.data;

                    // Response: { status: true, result: { title, type, quality, duration, thumbnail, url } }
                    if (!audioData?.status || !audioData?.result?.url) {
                        throw new Error('No audio URL found from Nexray');
                    }

                    const audioMeta = audioData.result;
                    const finalTitle = audioMeta.title || title || 'YouTube Audio';

                    // Download audio bytes so WhatsApp doesn't fetch from CDN
                    const audioFile = await axios.get(audioMeta.url, {
                        responseType: 'arraybuffer',
                        timeout: 120000,
                        maxContentLength: 50 * 1024 * 1024,
                        maxBodyLength: 50 * 1024 * 1024,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
                        }
                    });
                    const audioBuffer = Buffer.from(audioFile.data);

                    if (audioBuffer.length < 10000) {
                        throw new Error('Downloaded audio file looks invalid or empty');
                    }

                    await conn.sendMessage(chatId, {
                        audio: audioBuffer,
                        mimetype: 'audio/mpeg',
                        fileName: `${finalTitle.replace(/[<>:"/\\|?*]/g, '_')}.mp3`,
                        caption: `🎧 *${finalTitle}*\n\n> ${global.wm || 'JEXPLOIT'}`
                    }, { quoted: msg });

                    await conn.sendMessage(chatId, { react: { text: '✅', key: msg.key } });

                } else if (choice === '2') {
                    // === VIDEO (MP4) via Nexray ===
                    await conn.sendMessage(chatId, { react: { text: '⏳', key: msg.key } });

                    const videoApi = `https://api.nexray.eu.cc/downloader/v1/ytmp4?url=${encodeURIComponent(videoUrl)}&resolusi=1080`;
                    const videoRes = await axios.get(videoApi, { timeout: 60000 });
                    const videoData = videoRes.data;

                    // Response: { status: true, result: { title, author, thumbnail, duration, format, quality, url } }
                    if (!videoData?.status || !videoData?.result?.url) {
                        throw new Error('No video URL found from Nexray');
                    }

                    const videoMeta = videoData.result;
                    const videoTitle = videoMeta.title || title || 'YouTube Video';
                    const videoQuality = videoMeta.quality ? ` (${videoMeta.quality})` : '';

                    // Download video bytes so WhatsApp doesn't fetch from CDN
                    const videoFile = await axios.get(videoMeta.url, {
                        responseType: 'arraybuffer',
                        timeout: 180000,
                        maxContentLength: 100 * 1024 * 1024,
                        maxBodyLength: 100 * 1024 * 1024,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
                        }
                    });
                    const videoBuffer = Buffer.from(videoFile.data);

                    if (videoBuffer.length < 10000) {
                        throw new Error('Downloaded video file looks invalid or empty');
                    }

                    await conn.sendMessage(chatId, {
                        video: videoBuffer,
                        mimetype: 'video/mp4',
                        fileName: `${videoTitle.replace(/[<>:"/\\|?*]/g, '_')}.mp4`,
                        caption: `🎬 *${videoTitle}*${videoQuality}\n\n> ${global.wm || 'JEXPLOIT'}`
                    }, { quoted: msg });

                    await conn.sendMessage(chatId, { react: { text: '✅', key: msg.key } });

                } else {
                    await conn.sendMessage(chatId, {
                        text: `❌ Invalid choice. Please reply with *1* for Audio or *2* for Video.`
                    }, { quoted: msg });

                    // Re-add listener if invalid choice
                    conn.ev.on('messages.upsert', responseListener);
                    return;
                }

            } catch (error) {
                console.error('Response handler error:', error.message);

                let userMessage = error.message;
                if (error.code === 'ERR_FR_MAX_BODY_LENGTH_EXCEEDED' || /maxContentLength|maxBodyLength/i.test(error.message || '')) {
                    userMessage = 'That file is too large to send. Try a shorter clip.';
                } else if (error.code === 'ECONNABORTED' || /timeout/i.test(error.message || '')) {
                    userMessage = 'The download timed out — the source may be slow. Try again shortly.';
                }

                await conn.sendMessage(chatId, {
                    text: `❌ Error: ${userMessage}`
                });
                await conn.sendMessage(chatId, { react: { text: '❌', key: message.key } });
            }
        };

        // Add listener for user response
        conn.ev.on('messages.upsert', responseListener);

        // Auto-remove listener after 60 seconds to prevent memory leaks
        setTimeout(() => {
            conn.ev.off('messages.upsert', responseListener);
        }, 60000);

    } catch (error) {
        console.error('YTPlay Error:', error.message);
        await conn.sendMessage(chatId, { react: { text: '❌', key: message.key } });
        await conn.sendMessage(chatId, {
            text: `❌ Error: ${error.message}`
        }, { quoted: message });
    }
}

module.exports = { playCommand,ytplayCommand, takeCommand }