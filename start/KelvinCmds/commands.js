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

async function musicCommand(conn, chatId, message, args) {
    try {
        const query = args.join(' ').trim();
        
        if (!query) {
            return await conn.sendMessage(chatId, {
                text: "🎵 Please provide a song name\nExample: .music number one by ravany"
            }, { quoted: message });
        }

        // Start reaction
        await conn.sendMessage(chatId, { react: { text: "⏳", key: message.key } });

        // Send searching message
        await conn.sendMessage(chatId, {
            text: `🔍 Searching for: ${query}`
        }, { quoted: message });

        // Search for the song
        const searchApi = `https://veron-apis.zone.id/search/youtubesearch?query=${encodeURIComponent(query)}`;
        const searchResponse = await axios.get(searchApi);

        if (!searchResponse.data || !searchResponse.data.status || !Array.isArray(searchResponse.data.data) || searchResponse.data.data.length === 0) {
            await conn.sendMessage(chatId, { react: { text: "❌", key: message.key } });
            return await conn.sendMessage(chatId, {
                text: `❌ No results found for: ${query}`
            }, { quoted: message });
        }

        // Get the first result
        const firstResult = searchResponse.data.data[0];
        
        // Download audio
        const audioApi = `https://veron-apis.zone.id/downloader/youtube/audio?url=${encodeURIComponent(firstResult.url)}`;
        const audioResponse = await axios.get(audioApi);

        if (!audioResponse.data || !audioResponse.data.status || !audioResponse.data.data || !audioResponse.data.data.downloadUrl) {
            await conn.sendMessage(chatId, { react: { text: "❌", key: message.key } });
            return await conn.sendMessage(chatId, {
                text: "❌ Failed to download audio"
            }, { quoted: message });
        }

        const { title, downloadUrl, format } = audioResponse.data.data;
        const filename = `${title || firstResult.title}.${format || 'mp3'}`.replace(/[<>:"/\\|?*]/g, '');

        // Send as audio without any caption or context info
        await conn.sendMessage(chatId, {
            audio: { url: downloadUrl },
            mimetype: "audio/mpeg",
            fileName: filename
        });

        // Success reaction
        await conn.sendMessage(chatId, { react: { text: "✅", key: message.key } });

    } catch (error) {
        console.error("Music Command Error:", error.message);
        await conn.sendMessage(chatId, { react: { text: "❌", key: message.key } });
        await conn.sendMessage(chatId, {
            text: "❌ An error occurred while processing your request."
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

async function videoCommand(conn, chatId, message, args) {
    try {
        const query = args.join(' ').trim();
        
        if (!query) {
            return await conn.sendMessage(chatId, {
                text: "🎬 Please provide a video name or YouTube URL\nExample: .video number one by ravany"
            }, { quoted: message });
        }

        // Start reaction
        await conn.sendMessage(chatId, { react: { text: "⏳", key: message.key } });

        // Send searching message
        await conn.sendMessage(chatId, {
            text: `🔍 Searching for: ${query}`
        }, { quoted: message });

        let videoUrl = query;
        let videoTitle = "";

        // If not a YouTube URL, search for it
        if (!query.includes('youtube.com') && !query.includes('youtu.be')) {
            const searchApi = `https://veron-apis.zone.id/search/youtubesearch?query=${encodeURIComponent(query)}`;
            const searchResponse = await axios.get(searchApi);

            if (!searchResponse.data || !searchResponse.data.status || !Array.isArray(searchResponse.data.data) || searchResponse.data.data.length === 0) {
                await conn.sendMessage(chatId, { react: { text: "❌", key: message.key } });
                return await conn.sendMessage(chatId, {
                    text: `❌ No results found for: ${query}`
                }, { quoted: message });
            }

            const firstResult = searchResponse.data.data[0];
            videoUrl = firstResult.url;
            videoTitle = firstResult.title;

            // Show found result
            await conn.sendMessage(chatId, {
                image: { url: firstResult.thumbnail },
                caption: `🎬 Found: ${firstResult.title}\n⏱️ ${firstResult.duration} • 👁️ ${firstResult.views}\n👤 ${firstResult.channel}\n\n⬇️ Downloading video...`
            }, { quoted: message });
        }

        // Download video
        const videoApi = `https://veron-apis.zone.id/downloader/youtube/video?url=${encodeURIComponent(videoUrl)}`;
        const videoResponse = await axios.get(videoApi);

        if (!videoResponse.data || !videoResponse.data.status || !videoResponse.data.data || !videoResponse.data.data.downloadUrl) {
            await conn.sendMessage(chatId, { react: { text: "❌", key: message.key } });
            return await conn.sendMessage(chatId, {
                text: "❌ Failed to download video"
            }, { quoted: message });
        }

        const { title, downloadUrl, format, videoId } = videoResponse.data.data;
        const filename = `${title || videoId}.${format || 'mp4'}`.replace(/[<>:"/\\|?*]/g, '');

        // Send as video with caption global.wm
        await conn.sendMessage(chatId, {
            video: { url: downloadUrl },
            mimetype: "video/mp4",
            fileName: filename,
            caption: "> global.wm" // Add your custom caption here
        });

        // Success reaction
        await conn.sendMessage(chatId, { react: { text: "✅", key: message.key } });

    } catch (error) {
        console.error("Video Command Error:", error.message);
        await conn.sendMessage(chatId, { react: { text: "❌", key: message.key } });
        await conn.sendMessage(chatId, {
            text: "❌ An error occurred while processing your request."
        }, { quoted: message });
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

async function ytmp4Command(conn, chatId, message, args) {
    try {
        const youtubeUrl = args.join(' ').trim();
        
        if (!youtubeUrl) {
            return await conn.sendMessage(chatId, {
                text: "🎬 Please provide a YouTube URL\nExample: .ytmp4 https://youtube.com/watch?v=abc123"
            }, { quoted: message });
        }

        // Start reaction
        await conn.sendMessage(chatId, { react: { text: "⏳", key: message.key } });

        // Download video
        const videoApi = `https://veron-apis.zone.id/downloader/youtube/video?url=${encodeURIComponent(youtubeUrl)}`;
        const videoResponse = await axios.get(videoApi);

        if (!videoResponse.data || !videoResponse.data.status || !videoResponse.data.data || !videoResponse.data.data.downloadUrl) {
            await conn.sendMessage(chatId, { react: { text: "❌", key: message.key } });
            return await conn.sendMessage(chatId, {
                text: "❌ Failed to download video"
            }, { quoted: message });
        }

        const { title, downloadUrl, format, videoId } = videoResponse.data.data;
        const filename = `${title || videoId}.${format || 'mp4'}`.replace(/[<>:"/\\|?*]/g, '');

        // Send as video with global watermark caption
        await conn.sendMessage(chatId, {
            video: { url: downloadUrl },
            mimetype: "video/mp4",
            fileName: filename,
            caption: global.wm || "🎬 Downloaded by Vinic-Xmd"
        });

        // Success reaction
        await conn.sendMessage(chatId, { react: { text: "✅", key: message.key } });

    } catch (error) {
        console.error("YTMP4 Command Error:", error.message);
        await conn.sendMessage(chatId, { react: { text: "❌", key: message.key } });
        await conn.sendMessage(chatId, {
            text: "❌ An error occurred while processing your request."
        }, { quoted: message });
    }
}

async function telestickerCommand(conn, chatId, message, args) {
    try {
        const telegramUrl = args.join(' ').trim();
        
        if (!telegramUrl) {
            return await conn.sendMessage(chatId, {
                text: "📦 Please provide a Telegram sticker pack URL\nExample: .telesticker https://t.me/addstickers/PBVid"
            }, { quoted: message });
        }

        // Start reaction
        await conn.sendMessage(chatId, { react: { text: "⏳", key: message.key } });

        // Download sticker pack
        const stickerApi = `https://api.nekolabs.web.id/downloader/telegram-sticker?url=${encodeURIComponent(telegramUrl)}`;
        const stickerResponse = await axios.get(stickerApi);

        if (!stickerResponse.data || !stickerResponse.data.success || !stickerResponse.data.result || !stickerResponse.data.result.stickers) {
            await conn.sendMessage(chatId, { react: { text: "❌", key: message.key } });
            return await conn.sendMessage(chatId, {
                text: "❌ Failed to download sticker pack"
            }, { quoted: message });
        }

        const stickerPack = stickerResponse.data.result;
        const stickers = stickerPack.stickers;

        // Send message about the pack
        await conn.sendMessage(chatId, {
            text: `📦 *${stickerPack.title}*\n\nSending ${stickers.length} stickers...`
        }, { quoted: message });

        // Send each sticker with proper formatting
        for (const sticker of stickers) {
            if (sticker.image_url) {
                try {
                    // Download sticker buffer
                    const stickerBuffer = await axios.get(sticker.image_url, { 
                        responseType: 'arraybuffer' 
                    });
                    
                    // Convert to buffer
                    const buffer = Buffer.from(stickerBuffer.data);
                    
                    // Send as proper sticker
                    await conn.sendMessage(chatId, {
                        sticker: buffer,
                        isAnimated: sticker.is_animated || false
                    });
                    
                    // Small delay between stickers
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                } catch (stickerError) {
                    console.error('Error sending sticker:', stickerError.message);
                    continue; // Continue with next sticker if one fails
                }
            }
        }

        // Success reaction
        await conn.sendMessage(chatId, { react: { text: "✅", key: message.key } });

    } catch (error) {
        console.error("Telesticker Command Error:", error.message);
        await conn.sendMessage(chatId, { react: { text: "❌", key: message.key } });
        await conn.sendMessage(chatId, {
            text: "❌ An error occurred while processing your request."
        }, { quoted: message });
    }
}

module.exports = { playCommand, telestickerCommand, ytmp4Command, musicCommand, ytplayCommand, videoCommand, takeCommand }