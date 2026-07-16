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
            title = "YouTube Audio";
        } 
        // Search YouTube for song name
        else {
            // Send initial processing message
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

        // Send thumbnail preview
        await conn.sendMessage(chatId, {
            image: { url: thumbnail },
            caption: `🎵 *${title}*\n\n⌛ Getting audio link... Please wait...`
        }, { quoted: message });

        // Add loading reaction
        await conn.sendMessage(chatId, { react: { text: '⏳', key: message.key } });

        // API list with Keith API as primary
        const apis = [
            {
                name: "Keith Audio API",
                fetch: async () => {
                    const apiUrl = `${global.api}/download/audio?url=${encodeURIComponent(videoUrl)}`;
                    const response = await axios.get(apiUrl, { timeout: 60000 });
                    
                    if (!response.data?.status) {
                        throw new Error('API returned no audio data');
                    }
                    
                    const audioUrl = response.data.result;
                    if (!audioUrl) {
                        throw new Error('No audio URL found in response');
                    }
                    
                    return {
                        audioUrl: audioUrl,
                        title: response.data.title || title,
                        thumbnail: response.data.thumbnail || thumbnail
                    };
                }
            },
            {
                name: "GiftedTech API",
                fetch: async () => {
                    const giftedResponse = await axios.get(
                        `https://mcow.giftedtechnexus.workers.dev/api/yta?url=${encodeURIComponent(videoUrl)}`,
                        { timeout: 60000 }
                    );
                    
                    if (!giftedResponse.data?.success || !giftedResponse.data?.result?.download_url) {
                        throw new Error('GiftedTech API failed');
                    }
                    
                    return {
                        audioUrl: giftedResponse.data.result.download_url,
                        title: giftedResponse.data.result.title || title,
                        thumbnail: giftedResponse.data.result.thumbnail || thumbnail
                    };
                }
            },
            {
                name: "xWolf API",
                fetch: async () => {
                    const xwolfResponse = await axios.get(
                        `https://apis.xwolf.space/download/yta?url=${encodeURIComponent(videoUrl)}`,
                        { timeout: 60000 }
                    );
                    
                    if (!xwolfResponse.data?.status || !xwolfResponse.data?.downloadUrl) {
                        throw new Error('xWolf API failed');
                    }
                    
                    return {
                        audioUrl: xwolfResponse.data.downloadUrl,
                        title: xwolfResponse.data.title || title,
                        thumbnail: xwolfResponse.data.thumbnail || thumbnail
                    };
                }
            }
        ];

        let audioUrl;
        let audioTitle = title;
        
        // Try APIs in order (Keith first, then fallbacks)
        for (const api of apis) {
            try {
                console.log(`🔄 Trying ${api.name}...`);
                const result = await api.fetch();
                audioUrl = result.audioUrl;
                audioTitle = result.title;
                thumbnail = result.thumbnail;
                console.log(`✅ ${api.name} successful!`);
                break;
            } catch (err) {
                console.warn(`❌ ${api.name} failed: ${err.message}`);
                continue;
            }
        }
        
        if (!audioUrl) {
            throw new Error('All audio download APIs failed.');
        }

        const dateNow = Date.now();
        const prefix = '.';
        
        // Send format selection buttons using gifted-btns
        await sendButtons(conn, chatId, {
            title: '🎵 SONG DOWNLOADER',
            text: `⿻ *Title:* ${audioTitle.substring(0, 50)}\n\n*Select download format:*`,
            footer: 'Powered by Kevin Tech',
            buttons: [
                { id: `${prefix}audio_${dateNow}`, text: '🎶 Audio' },
                { id: `${prefix}audiodoc_${dateNow}`, text: '📄 Audio Document' },
                { id: `${prefix}voicenote_${dateNow}`, text: '🎙️ Voice Note' }
            ]
        }, { quoted: message });

        await conn.sendMessage(chatId, { react: { text: '✅', key: message.key } });

        // Store the dateNow for button response handling
        const selectionHandler = async (msgUpdate) => {
            try {
                const buttonMsg = msgUpdate.messages[0];
                if (!buttonMsg.message) return;
                if (buttonMsg.key.remoteJid !== chatId) return;

                let selectedButtonId = null;
                
                // Extract button ID from different message types
                if (buttonMsg.message?.buttonsResponseMessage) {
                    selectedButtonId = buttonMsg.message.buttonsResponseMessage.selectedButtonId;
                } else if (buttonMsg.message?.templateButtonReplyMessage) {
                    selectedButtonId = buttonMsg.message.templateButtonReplyMessage.selectedId;
                }
                
                if (!selectedButtonId) return;
                if (!selectedButtonId.includes(`_${dateNow}`)) return;

                // Remove listener to prevent multiple responses
                conn.ev.off('messages.upsert', selectionHandler);
                
                await conn.sendMessage(chatId, { react: { text: '⬇️', key: buttonMsg.key } });

                const buttonType = selectedButtonId.replace(prefix, '').split('_')[0];
                
                // Download audio to temp file
                const tempDir = path.join(__dirname, 'temp');
                if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
                const filePath = path.join(tempDir, `audio_${dateNow}.mp3`);

                const audioStream = await axios({
                    method: 'get',
                    url: audioUrl,
                    responseType: 'stream',
                    timeout: 600000,
                });

                const writer = fs.createWriteStream(filePath);
                audioStream.data.pipe(writer);
                await new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });

                if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
                    throw new Error('Download failed — file is empty');
                }

                const cleanTitle = audioTitle.replace(/[^\w\s.-]/gi, '').substring(0, 100);

                if (buttonType === 'audio') {
                    await conn.sendMessage(chatId, {
                        audio: { url: filePath },
                        mimetype: 'audio/mpeg',
                    }, { quoted: buttonMsg });

                } else if (buttonType === 'audiodoc') {
                    await conn.sendMessage(chatId, {
                        document: { url: filePath },
                        mimetype: 'audio/mpeg',
                        fileName: `${cleanTitle}.mp3`,
                        caption: `🎵 ${cleanTitle}\n> Kevin Tech`,
                    }, { quoted: buttonMsg });

                } else if (buttonType === 'voicenote') {
                    await conn.sendMessage(chatId, {
                        audio: { url: filePath },
                        mimetype: 'audio/ogg; codecs=opus',
                        ptt: true,
                    }, { quoted: buttonMsg });
                }

                // Clean up temp file
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                await conn.sendMessage(chatId, { react: { text: '✅', key: buttonMsg.key } });

            } catch (error) {
                console.error('Button handler error:', error);
                await conn.sendMessage(chatId, { 
                    text: `🚫 Error: ${error.message}\n\n_Try again later._` 
                }, { quoted: message });
            }
        };

        // Add the listener for button responses
        conn.ev.on('messages.upsert', selectionHandler);

        // Set timeout to remove listener after 2 minutes
        setTimeout(() => {
            conn.ev.off('messages.upsert', selectionHandler);
        }, 120000);
        
    } catch (error) {
        console.error('Play command error:', error);
        
        // Add error reaction
        await conn.sendMessage(chatId, { react: { text: '❌', key: message.key } });
        
        let errorMessage = '❌ Error fetching audio. ';
        
        if (error.message.includes('timeout')) {
            errorMessage += 'Request timed out. Please try again.';
        } else if (error.message.includes('Invalid YouTube link')) {
            errorMessage += 'Invalid YouTube URL provided.';
        } else if (error.message.includes('No results found')) {
            errorMessage += `No results found.`;
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

        let videoUrl, title, thumbnail;

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
            title = "YouTube Audio";
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
            title = video.title;
            thumbnail = video.thumbnail;
        }

        // Send initial processing message
        await conn.sendMessage(chatId, {
            image: { url: thumbnail },
            caption: `🎵 ${title}\n\nDownloading audio...`
        }, { quoted: message });

        // Use PrinceTech API
        const apiUrl = `https://api.princetechn.com/api/download/ytmp3?apikey=prince&url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(apiUrl, { timeout: 60000 });

        if (!response.data?.success || !response.data?.result?.download_url) {
            throw new Error('No audio URL found');
        }

        const { download_url, quality, duration } = response.data.result;

        // Send the audio
        await conn.sendMessage(chatId, {
            audio: { url: download_url },
            mimetype: 'audio/mpeg',
            fileName: `${title.replace(/[<>:"/\\|?*]/g, '_')}.mp3`,
            caption: `🎧 ${title}\n⏱ ${duration} | 🎚 ${quality}`
        }, { quoted: message });

        await conn.sendMessage(chatId, { react: { text: '✅', key: message.key } });

    } catch (error) {
        console.error('YTPlay Error:', error.message);
        await conn.sendMessage(chatId, { react: { text: '❌', key: message.key } });
        await conn.sendMessage(chatId, { 
            text: `Error: ${error.message}`
        }, { quoted: message });
    }
}

module.exports = { playCommand,ytplayCommand, takeCommand }