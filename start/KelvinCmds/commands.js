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
        const youtubeUrl = args.join(' ').trim();

        if (!youtubeUrl) {
            return await conn.sendMessage(chatId, { 
                text: '*⚠️ Please provide a YouTube Url!*' 
            }, { quoted: message });
        }

        if (!youtubeUrl.includes('youtu')) {
            return await conn.sendMessage(chatId, { 
                text: '*Please provide a YouTube Url!*' 
            }, { quoted: message });
        }

        // Start reaction
        await conn.sendMessage(chatId, { react: { text: '⏳', key: message.key } });

        // Send processing message
        const processingMsg = await conn.sendMessage(chatId, { 
            text: '⏳ Downloading YouTube video... Please wait...' 
        }, { quoted: message });

        // Encode the URL for the API
        const encodedUrl = encodeURIComponent(youtubeUrl);
        const apiUrl = `https://api.nekolabs.web.id/downloader/youtube/v4?url=${encodedUrl}`;

        console.log('Fetching from API:', apiUrl);

        // Fetch video data from API
        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log('API Response:', JSON.stringify(data, null, 2));

        

        // Check if API response is successful
        if (!data || !data.success) {
            throw new Error(data?.message || 'API returned an error');
        }

        if (!data.result || !data.result.medias || data.result.medias.length === 0) {
            throw new Error('No video formats available for this URL');
        }

        // Get the first available video format
        const videoMedia = data.result.medias[0];
        if (!videoMedia.url) {
            throw new Error('No video URL found in response');
        }

        const videoData = {
            url: videoMedia.url,
            title: data.result.title || 'YouTube Video',
            quality: videoMedia.quality || videoMedia.label || 'Unknown',
            thumbnail: data.result.thumbnail || null
        };

        // Send video information first
        let caption = `*📹 YouTube Video Downloader*\n\n`;
        caption += `*📺 Title:* ${videoData.title}\n`;
        caption += `*💾 Quality:* ${videoData.quality}\n`;
        caption += `*🔗 Source:* ${youtubeUrl}\n\n`;
        caption += `_Downloading video..._`;

        const infoMsg = await conn.sendMessage(chatId, { text: caption }, { quoted: message });

        // Download and send the video
        try {
            await conn.sendMessage(chatId, {
                video: { url: videoData.url },
                caption: `*${videoData.title}*\n\n` +
                        `✅ Successfully downloaded!\n` +
                        `📺 Quality: ${videoData.quality}\n` +
                        `🔗 Source: ${youtubeUrl}\n\n` +
                        `📥 Downloaded via ${global.botname || 'Bot'}`,
                mimetype: 'video/mp4',
                fileName: `youtube_${Date.now()}.mp4`.replace(/\s+/g, '_')
            }, { quoted: message });

       

            // Success reaction
            await conn.sendMessage(chatId, { react: { text: '✅', key: message.key } });

        } catch (videoError) {
            console.error('Video sending error:', videoError);
          
            
            // If video sending fails, try to send the direct download link
            if (videoData.url) {
                await conn.sendMessage(chatId, { 
                    text: `❌ Video is too large to send directly.\n\n📥 *Download Link:*\n${videoData.url}\n\n*Title:* ${videoData.title}\n*Quality:* ${videoData.quality}` 
                }, { quoted: message });
            } else {
                await conn.sendMessage(chatId, { 
                    text: '❌ Error sending video. The video might be too large or unavailable.' 
                }, { quoted: message });
            }
            await conn.sendMessage(chatId, { react: { text: '❌', key: message.key } });
        }

    } catch (error) {
        console.error('YouTube download error:', error);
        
        let errorMessage = '❌ Error downloading video. ';
        
        if (error.message.includes('API returned an error')) {
            errorMessage += 'YouTube API returned an error.';
        } else if (error.message.includes('No video formats available')) {
            errorMessage += 'No downloadable video formats found for this URL.';
        } else if (error.message.includes('No video URL found')) {
            errorMessage += 'No video URL found in API response.';
        } else {
            errorMessage += 'Please check the URL and try again.';
        }
        
        await conn.sendMessage(chatId, { text: errorMessage }, { quoted: message });
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


async function InstagramCommand(conn, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const args = text.split(' ').slice(1); // Remove command prefix
        const instagramUrl = args.join(' ').trim();

        if (!instagramUrl) {
            return await conn.sendMessage(chatId, { 
                text: '*⚠️ Please provide a MediaFire Url!*' 
            }, { quoted: message });
        }

        if (!instagramUrl.includes('instagram.com')) {
            return await conn.sendMessage(chatId, { 
                text: '❌ Please provide a valid Instagram URL\n\nSupported formats:\n• https://www.instagram.com/reel/VIDEO_ID/\n• https://www.instagram.com/p/POST_ID/\n• https://www.instagram.com/stories/USERNAME/STORY_ID/' 
            }, { quoted: message });
        }

        // Start reaction
        await conn.sendMessage(chatId, { react: { text: '⏳', key: message.key } });

        // Send processing message
        const processingMsg = await conn.sendMessage(chatId, { 
            text: '⏳ Downloading Instagram media... Please wait...' 
        }, { quoted: message });

        // Encode the URL for the API
        const encodedUrl = encodeURIComponent(instagramUrl);
        const apiUrl = `https://api.nekolabs.web.id/downloader/instagram?url=${encodedUrl}`;

        console.log('Fetching from API:', apiUrl);

        // Fetch Instagram data from API
        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log('API Response:', JSON.stringify(data, null, 2));

       

        // Check if API response is successful
        if (!data || !data.success) {
            throw new Error(data?.message || 'API returned an error');
        }

        if (!data.result || !data.result.downloadUrl || data.result.downloadUrl.length === 0) {
            throw new Error('No downloadable media found for this URL');
        }

        const metadata = data.result.metadata || {};
        const downloadUrls = data.result.downloadUrl;

        // Get the first download URL
        const mediaUrl = downloadUrls[0];
        if (!mediaUrl) {
            throw new Error('No media URL found in response');
        }

        // Send media information first
        let caption = `*📷 Instagram Downloader*\n\n`;
        caption += `*👤 Username:* ${metadata.username || 'Unknown'}\n`;
        if (metadata.caption) {
            caption += `*📝 Caption:* ${metadata.caption.length > 100 ? metadata.caption.substring(0, 100) + '...' : metadata.caption}\n`;
        }
        caption += `*❤️ Likes:* ${metadata.like || 0}\n`;
        caption += `*💬 Comments:* ${metadata.comment || 0}\n`;
        caption += `*🎥 Type:* ${metadata.isVideo ? 'Video' : 'Image'}\n\n`;
        caption += `_Downloading media..._`;

        const infoMsg = await conn.sendMessage(chatId, { text: caption }, { quoted: message });

        // Download and send the media
        try {
            if (metadata.isVideo) {
                // Send as video
                await conn.sendMessage(chatId, {
                    video: { url: mediaUrl },
                    caption: `*Instagram Video* - @${metadata.username || 'unknown'}\n\n` +
                            `✅ Successfully downloaded!\n` +
                            `❤️ ${metadata.like || 0} Likes | 💬 ${metadata.comment || 0} Comments\n` +
                            (metadata.caption ? `📝 ${metadata.caption.length > 150 ? metadata.caption.substring(0, 150) + '...' : metadata.caption}\n` : '') +
                            `🔗 ${instagramUrl}\n\n` +
                            `📥 Downloaded via ${global.botname || 'Bot'}`,
                    mimetype: 'video/mp4',
                    fileName: `instagram_${Date.now()}.mp4`.replace(/\s+/g, '_')
                }, { quoted: message });
            } else {
                // Send as image
                await conn.sendMessage(chatId, {
                    image: { url: mediaUrl },
                    caption: `*Instagram Photo* - @${metadata.username || 'unknown'}\n\n` +
                            `✅ Successfully downloaded!\n` +
                            `❤️ ${metadata.like || 0} Likes | 💬 ${metadata.comment || 0} Comments\n` +
                            (metadata.caption ? `📝 ${metadata.caption.length > 150 ? metadata.caption.substring(0, 150) + '...' : metadata.caption}\n` : '') +
                            `🔗 ${instagramUrl}\n\n` +
                            `📥 Downloaded via ${global.botname || 'Bot'}`,
                    mimetype: 'image/jpeg',
                    fileName: `instagram_${Date.now()}.jpg`.replace(/\s+/g, '_')
                }, { quoted: message });
            }

          

            // Success reaction
            await conn.sendMessage(chatId, { react: { text: '✅', key: message.key } });

        } catch (mediaError) {
            console.error('Media sending error:', mediaError);
           
            
            // If media sending fails, try to send the direct download link
            if (mediaUrl) {
                await conn.sendMessage(chatId, { 
                    text: `❌ Media is too large to send directly.\n\n📥 *Download Link:*\n${mediaUrl}\n\n*Username:* @${metadata.username || 'unknown'}\n*Type:* ${metadata.isVideo ? 'Video' : 'Image'}\n*Likes:* ${metadata.like || 0}` 
                }, { quoted: message });
            } else {
                await conn.sendMessage(chatId, { 
                    text: '❌ Error sending media. The file might be too large or unavailable.' 
                }, { quoted: message });
            }
            await conn.sendMessage(chatId, { react: { text: '❌', key: message.key } });
        }

    } catch (error) {
        console.error('Instagram download error:', error);
        
        let errorMessage = '❌ Error downloading Instagram media. ';
        
        if (error.message.includes('API returned an error')) {
            errorMessage += 'Instagram API returned an error.';
        } else if (error.message.includes('No downloadable media')) {
            errorMessage += 'No downloadable media found for this URL.';
        } else if (error.message.includes('No media URL found')) {
            errorMessage += 'No media URL found in API response.';
        } else if (error.message.includes('valid Instagram URL')) {
            errorMessage += 'Please provide a valid Instagram URL.';
        } else {
            errorMessage += 'Please check the URL and try again.';
        }
        
        await conn.sendMessage(chatId, { text: errorMessage }, { quoted: message });
        await conn.sendMessage(chatId, { react: { text: '❌', key: message.key } });
    }
}

async function handleMediafireDownload(conn, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const args = text.split(' ').slice(1); // Remove command prefix
        const mediafireUrl = args.join(' ').trim();

        if (!mediafireUrl) {
            return await conn.sendMessage(chatId, { 
                text: '*Please provide a MediaFire url!*' 
            }, { quoted: message });
        }

        if (!mediafireUrl.includes('mediafire.com')) {
            return await conn.sendMessage(chatId, { 
                text: '❌ Please provide a valid MediaFire URL\n\nSupported formats:\n• https://www.mediafire.com/file/FILE_ID/filename.ext\n• https://www.mediafire.com/download/FILE_ID' 
            }, { quoted: message });
        }

        // Start reaction
        await conn.sendMessage(chatId, { react: { text: '⏳', key: message.key } });

        // Send processing message
        const processingMsg = await conn.sendMessage(chatId, { 
            text: '⏳ Processing MediaFire download... Please wait...' 
        }, { quoted: message });

        // Encode the URL for the API
        const encodedUrl = encodeURIComponent(mediafireUrl);
        const apiUrl = `https://api.nekolabs.web.id/downloader/mediafire?url=${encodedUrl}`;

        console.log('Fetching from MediaFire API:', apiUrl);

        // Fetch MediaFire data from API
        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log('MediaFire API Response:', JSON.stringify(data, null, 2));

        

        // Check if API response is successful
        if (!data || !data.success) {
            throw new Error(data?.message || 'MediaFire API returned an error');
        }

        if (!data.result || !data.result.download_url) {
            throw new Error('No downloadable file found for this URL');
        }

        const fileInfo = data.result;
        
        // Send file information first
        let caption = `*📦 MediaFire Downloader*\n\n`;
        caption += `*📁 File Name:* ${fileInfo.filename || 'Unknown'}\n`;
        caption += `*📊 File Size:* ${fileInfo.filesize || 'Unknown'}\n`;
        caption += `*📄 File Type:* ${fileInfo.mimetype || 'Unknown'}\n`;
        if (fileInfo.uploaded) {
            caption += `*📅 Uploaded:* ${fileInfo.uploaded}\n`;
        }
        caption += `\n_Downloading file..._`;

        const infoMsg = await conn.sendMessage(chatId, { text: caption }, { quoted: message });

        // Determine file type and send accordingly
        try {
            const mimeType = fileInfo.mimetype || '';
            const fileName = fileInfo.filename || `mediafire_${Date.now()}`;
            
            // Check file size for WhatsApp limits (approx 16MB for documents, 64MB for videos)
            const fileSizeMatch = fileInfo.filesize ? fileInfo.filesize.match(/(\d+\.?\d*)\s*(\w+)/) : null;
            let fileSizeBytes = 0;
            
            if (fileSizeMatch) {
                const size = parseFloat(fileSizeMatch[1]);
                const unit = fileSizeMatch[2].toLowerCase();
                
                const units = {
                    'b': 1,
                    'kb': 1024,
                    'mb': 1024 * 1024,
                    'gb': 1024 * 1024 * 1024
                };
                
                fileSizeBytes = size * (units[unit] || 1);
            }

            // WhatsApp limits: ~16MB for documents, ~64MB for videos
            const isLargeFile = fileSizeBytes > 16 * 1024 * 1024; // 16MB

            if (isLargeFile) {
                // For large files, send as text with download link
                await conn.sendMessage(chatId, { 
                    text: `*📦 File Too Large for Direct Download*\n\n` +
                          `*📁 File Name:* ${fileInfo.filename}\n` +
                          `*📊 File Size:* ${fileInfo.filesize}\n` +
                          `*📄 File Type:* ${fileInfo.mimetype}\n\n` +
                          `📥 *Direct Download Link:*\n${fileInfo.download_url}\n\n` +
                          `_File exceeds WhatsApp size limits. Use the link above to download._`
                }, { quoted: message });
            } else if (mimeType.startsWith('video/')) {
                // Send as video
                await conn.sendMessage(chatId, {
                    video: { url: fileInfo.download_url },
                    caption: `*📹 ${fileInfo.filename}*\n\n` +
                            `✅ Successfully downloaded from MediaFire!\n` +
                            `📊 Size: ${fileInfo.filesize}\n` +
                            `🔗 Source: ${mediafireUrl}\n\n` +
                            `📥 Downloaded via ${global.botname || 'Bot'}`,
                    mimetype: mimeType,
                    fileName: fileName
                }, { quoted: message });
            } else if (mimeType.startsWith('image/')) {
                // Send as image
                await conn.sendMessage(chatId, {
                    image: { url: fileInfo.download_url },
                    caption: `*🖼️ ${fileInfo.filename}*\n\n` +
                            `✅ Successfully downloaded from MediaFire!\n` +
                            `📊 Size: ${fileInfo.filesize}\n` +
                            `🔗 Source: ${mediafireUrl}\n\n` +
                            `📥 Downloaded via ${global.botname || 'Bot'}`,
                    mimetype: mimeType,
                    fileName: fileName
                }, { quoted: message });
            } else if (mimeType.startsWith('audio/')) {
                // Send as audio
                await conn.sendMessage(chatId, {
                    audio: { url: fileInfo.download_url },
                    mimetype: mimeType,
                    fileName: fileName,
                    caption: `*🎵 ${fileInfo.filename}*\n\n` +
                            `✅ Successfully downloaded from MediaFire!\n` +
                            `📊 Size: ${fileInfo.filesize}\n` +
                            `🔗 Source: ${mediafireUrl}`
                }, { quoted: message });
            } else {
                // Send as document for other file types
                await conn.sendMessage(chatId, {
                    document: { url: fileInfo.download_url },
                    mimetype: mimeType,
                    fileName: fileName,
                    caption: `*📄 ${fileInfo.filename}*\n\n` +
         `✅ Successfully downloaded from MediaFire!\n` +
         `📊 Size: ${fileInfo.filesize}\n` +
         `📄 Type: ${fileInfo.mimetype}\n` +
         `📥 Downloaded via ${global.botname || 'Bot'}`
                }, { quoted: message });
            }

            

            // Success reaction
            await conn.sendMessage(chatId, { react: { text: '✅', key: message.key } });

        } catch (downloadError) {
            console.error('MediaFire download error:', downloadError);
           
            
            // If download fails, send the direct download link
            await conn.sendMessage(chatId, { 
                text: `❌ Error sending file directly.\n\n📥 *Direct Download Link:*\n${fileInfo.download_url}\n\n` +
                      `*File Info:*\n` +
                      `📁 Name: ${fileInfo.filename}\n` +
                      `📊 Size: ${fileInfo.filesize}\n` +
                      `📄 Type: ${fileInfo.mimetype}\n\n` +
                      `_Use the link above to download the file._`
            }, { quoted: message });
            await conn.sendMessage(chatId, { react: { text: '❌', key: message.key } });
        }

    } catch (error) {
        console.error('MediaFire command error:', error);
        
        let errorMessage = '❌ Error downloading from MediaFire. ';
        
        if (error.message.includes('API returned an error')) {
            errorMessage += 'MediaFire API returned an error.';
        } else if (error.message.includes('No downloadable file')) {
            errorMessage += 'No downloadable file found for this URL.';
        } else if (error.message.includes('valid MediaFire URL')) {
            errorMessage += 'Please provide a valid MediaFire URL.';
        } else if (error.message.includes('URL not found') || error.message.includes('404')) {
            errorMessage += 'The file was not found. It may have been d or the URL is incorrect.';
        } else {
            errorMessage += 'Please check the URL and try again.';
        }
        
        await conn.sendMessage(chatId, { text: errorMessage }, { quoted: message });
        await conn.sendMessage(chatId, { react: { text: '❌', key: message.key } });
    }
}

module.exports = { playCommand, InstagramCommand, handleMediafireDownload, ytplayCommand, videoCommand, takeCommand }