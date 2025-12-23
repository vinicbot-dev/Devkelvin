const fetch = require('node-fetch');
const yts = require('yt-search');
const axios = require("axios");

async function KelvinVideo(conn, chatId, message, args) {
    try {
        const query = args.join(' ').trim();
        
        if (!query) {
            return await conn.sendMessage(chatId, { 
                text: '*🎬 YouTube Video Downloader*\n\n' +
                      'Please provide a YouTube URL or search query\n' +
                      'Example: `.video https://youtu.be/ABC123`\n' +
                      'Example: `.video funny cat videos`'
            }, { quoted: message });
        }

        // Send initial processing message
        const processingMsg = await conn.sendMessage(chatId, { 
            text: `🔍 Searching for: "${query}"\n⏳ Please wait...` 
        }, { quoted: message });

        let videoUrl, videoInfo;
        const isYtUrl = query.match(/(youtube\.com|youtu\.be)/i);

        if (isYtUrl) {
            // Handle YouTube URL
            videoUrl = query;
            try {
                const videoId = query.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1];
                if (!videoId) {
                    await conn.sendMessage(chatId, { 
                        text: '❌ *Invalid YouTube URL!*\n\nPlease provide a valid YouTube URL.\n*Example:* https://youtu.be/ABC123' 
                    }, { quoted: message });
                    return;
                }
                
                videoInfo = await yts({ videoId });
                if (!videoInfo) throw new Error('Could not fetch video info');
            } catch (e) {
                await conn.sendMessage(chatId, { 
                    text: '❌ *Failed to get video information!*\n\nPlease check the URL and try again.' 
                }, { quoted: message });
                return;
            }
        } else {
            // Handle search query
            try {
                const searchResults = await yts(query);
                if (!searchResults?.videos?.length) {
                    await conn.sendMessage(chatId, { 
                        text: `❌ *No videos found for:* "${query}"\n\nTry different keywords or check spelling.` 
                    }, { quoted: message });
                    return;
                }

                // Filter results (exclude live streams, very long videos, and prioritize shorter videos)
                const validVideos = searchResults.videos.filter(v => 
                    !v.live && v.seconds < 600 && v.views > 1000 // Limit to 10 minutes max
                ).sort((a, b) => a.seconds - b.seconds); // Sort by shortest first

                if (!validVideos.length) {
                    // Try with longer duration limit
                    const longerVideos = searchResults.videos.filter(v => 
                        !v.live && v.seconds < 1200 && v.views > 1000 // 20 minutes max
                    ).sort((a, b) => a.seconds - b.seconds);
                    
                    if (!longerVideos.length) {
                        await conn.sendMessage(chatId, { 
                            text: `❌ *No suitable videos found!*\n\nTry a different search term or look for shorter videos.` 
                        }, { quoted: message });
                        return;
                    }
                    videoInfo = longerVideos[0];
                } else {
                    videoInfo = validVideos[0];
                }

                videoUrl = videoInfo.url;
            } catch (searchError) {
                await conn.sendMessage(chatId, { 
                    text: '❌ *Search failed!*\n\nPlease try again later or use a YouTube URL.' 
                }, { quoted: message });
                return;
            }
        }

        // Update processing message with video info
        const videoInfoMsg = `
🎬 *Video Found!*

📀 *Title:* ${videoInfo?.title || 'Unknown'}
⏱️ *Duration:* ${videoInfo?.timestamp || 'Unknown'}
👁️ *Views:* ${videoInfo?.views?.toLocaleString() || 'Unknown'}
👤 *Channel:* ${videoInfo?.author?.name || 'Unknown'}
📅 *Uploaded:* ${videoInfo?.ago || 'Unknown'}

_⏳ Downloading video..._
        `.trim();

        await conn.sendMessage(chatId, { 
            text: videoInfoMsg 
        });

        // Use API with size parameter for smaller videos
        let videoData = null;
        let videoSize = 0;
        
        try {
            // TRY 1: Use API that allows quality/size selection
            const apiUrl = `https://api.privatezia.biz.id/api/downloader/ytplaymp4?query=${encodeURIComponent(videoInfo.title)}&quality=360p`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.status && data.result && data.result.downloadUrl) {
                videoData = {
                    url: data.result.downloadUrl,
                    title: data.result.title || videoInfo.title,
                    quality: '360p (Small)',
                    thumbnail: data.result.thumbnail
                };
                
                // Try to get file size
                try {
                    const headResponse = await fetch(videoData.url, { method: 'HEAD' });
                    const contentLength = headResponse.headers.get('content-length');
                    videoSize = contentLength ? parseInt(contentLength) : 0;
                    
                    if (videoSize > 16000000) { // 16MB limit
                        // File too large, try lower quality
                        throw new Error('File too large');
                    }
                } catch (sizeError) {
                    // Try different API with lower quality
                    throw new Error('Need lower quality');
                }
            }
        } catch (error) {
            // TRY 2: Use API with smaller size option
            try {
                const encodedUrl = encodeURIComponent(videoUrl);
                const apiUrl = `https://api.nekolabs.web.id/downloader/youtube/v4?url=${encodedUrl}&quality=low`;
                
                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.success && data.result && data.result.medias && data.result.medias.length > 0) {
                    // Find the smallest video
                    const smallVideos = data.result.medias.filter(media => 
                        media.quality && (media.quality.includes('360') || media.quality.includes('480') || media.size < 15000000)
                    );
                    
                    if (smallVideos.length > 0) {
                        const videoMedia = smallVideos[0];
                        videoData = {
                            url: videoMedia.url,
                            title: data.result.title || videoInfo.title,
                            quality: videoMedia.quality || 'Low Quality',
                            size: videoMedia.size || 0
                        };
                        videoSize = videoMedia.size || 0;
                    }
                }
            } catch (error2) {
                // TRY 3: Fallback to audio only if video too large
                try {
                    const audioApiUrl = `https://api.privatezia.biz.id/api/downloader/ytplaymp3?query=${encodeURIComponent(videoInfo.title)}`;
                    const response = await fetch(audioApiUrl);
                    const data = await response.json();
                    
                    if (data.status && data.result && data.result.downloadUrl) {
                        // Send as audio instead
                        await conn.sendMessage(chatId, {
                            audio: { url: data.result.downloadUrl },
                            mimetype: 'audio/mpeg',
                            fileName: `${(videoInfo.title || 'audio').replace(/[<>:"/\\|?*]/g, '_').slice(0, 60)}.mp3`,
                            caption: `🎵 *Audio Only*\n\nVideo was too large to send.\n\n📀 *Title:* ${videoInfo.title}\n⏱️ *Duration:* ${videoInfo.timestamp}\n👤 *Channel:* ${videoInfo.author?.name || 'Unknown'}`
                        }, { quoted: message });
                        
                        await conn.sendMessage(chatId, { react: { text: '✅', key: message.key } });
                        return;
                    }
                } catch (audioError) {
                    // Continue to error handling
                }
            }
        }

        if (!videoData) {
            await conn.sendMessage(chatId, { 
                text: '❌ *Could not download video!*\n\n' +
                      'The video may be too long or unavailable.\n' +
                      '*Try:*\n• Shorter videos (<5 minutes)\n• Different search term\n• YouTube link directly'
            }, { quoted: message });
            return;
        }

        // Check file size before sending
        const MAX_SIZE = 16000000; // 16MB WhatsApp limit
        
        if (videoSize > MAX_SIZE) {
            await conn.sendMessage(chatId, { 
                text: `*❌ Video is too large (${(videoSize/1000000).toFixed(1)}MB)*\n\n` +
                      `*WhatsApp limits:* ~16MB for videos\n\n` +
                      `📺 *Title:* ${videoData.title}\n` +
                      `⏱️ *Duration:* ${videoInfo.timestamp}\n` +
                      `👤 *Channel:* ${videoInfo.author?.name || 'Unknown'}\n\n` +
                      `🎬 *YouTube Link:*\n${videoUrl}\n\n` +
                      `_Try searching for shorter videos._`
            }, { quoted: message });
            await conn.sendMessage(chatId, { react: { text: '📏', key: message.key } });
            return;
        }

        // Send the video with progress indicator
        try {
            const sendingMsg = await conn.sendMessage(chatId, {
                text: `📤 *Sending video...*\n\n` +
                      `📀 ${videoData.title}\n` +
                      `📊 Quality: ${videoData.quality}\n` +
                      `📦 Size: ${videoSize > 0 ? (videoSize/1000000).toFixed(1) + 'MB' : 'Unknown'}`
            });

            // Send the video
            await conn.sendMessage(chatId, {
                video: { url: videoData.url },
                caption: `🎬 *${videoData.title}*\n\n` +
                        `✅ Successfully downloaded!\n` +
                        `📺 Quality: ${videoData.quality}\n` +
                        `👤 Channel: ${videoInfo.author?.name || 'Unknown'}\n` +
                        `⏱️ Duration: ${videoInfo.timestamp}\n\n` +
                        `📥 Downloaded via ${global.botname || 'Bot'}`,
                mimetype: 'video/mp4',
                fileName: `${(videoData.title || 'video').replace(/[<>:"/\\|?*]/g, '_').slice(0, 50)}.mp4`
            });

            // Delete progress message
            if (sendingMsg.key) {
                await conn.sendMessage(chatId, { 
                    delete: sendingMsg.key 
                });
            }

            // Success reaction
            await conn.sendMessage(chatId, { react: { text: '✅', key: message.key } });

        } catch (videoError) {
            // If video sending fails, provide alternative
            await conn.sendMessage(chatId, { 
                text: `*❌ Failed to send video*\n\n` +
                      `*Possible reasons:*\n` +
                      `• Video is still too large\n` +
                      `• Network issues\n` +
                      `• WhatsApp restrictions\n\n` +
                      `📺 *Title:* ${videoData.title}\n` +
                      `⏱️ *Duration:* ${videoInfo.timestamp}\n\n` +
                      `🎬 *Watch on YouTube:*\n${videoUrl}\n\n` +
                      `_Try the .audio command for music instead._`
            }, { quoted: message });
            
            await conn.sendMessage(chatId, { react: { text: '❌', key: message.key } });
        }

    } catch (error) {
        let errorMessage = '❌ Error downloading video. ';
        
        if (error.message.includes('Invalid YouTube URL')) {
            errorMessage += 'Please provide a valid YouTube URL.';
        } else if (error.message.includes('No videos found')) {
            errorMessage += 'No videos found for your search.';
        } else if (error.message.includes('Failed to get video information')) {
            errorMessage += 'Could not fetch video information.';
        } else if (error.message.includes('too large')) {
            errorMessage += 'Video is too large for WhatsApp. Try shorter videos.';
        } else {
            errorMessage += 'Please try again later.';
        }
        
        await conn.sendMessage(chatId, { text: errorMessage }, { quoted: message });
        await conn.sendMessage(chatId, { react: { text: '❌', key: message.key } });
    }
}

module.exports = { KelvinVideo };