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
                      'Example: `.ytmp4 https://youtu.be/ABC123`\n' +
                      'Example: `.ytmp4 funny cat videos`'
            }, { quoted: message });
        }

        // Send initial processing message
        await conn.sendMessage(chatId, { 
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
                    return await conn.sendMessage(chatId, { 
                        text: '❌ *Invalid YouTube URL!*\n\nPlease provide a valid YouTube URL.\n*Example:* https://youtu.be/ABC123' 
                    }, { quoted: message });
                }
                
                videoInfo = await yts({ videoId });
                if (!videoInfo) throw new Error('Could not fetch video info');
            } catch (e) {
                console.error('YT-Search error:', e);
                return await conn.sendMessage(chatId, { 
                    text: '❌ *Failed to get video information!*\n\nPlease check the URL and try again.' 
                }, { quoted: message });
            }
        } else {
            // Handle search query
            try {
                const searchResults = await yts(query);
                if (!searchResults?.videos?.length) {
                    return await conn.sendMessage(chatId, { 
                        text: `❌ *No videos found for:* "${query}"\n\nTry different keywords or check spelling.` 
                    }, { quoted: message });
                }

                // Filter results (exclude live streams and very long videos)
                const validVideos = searchResults.videos.filter(v => 
                    !v.live && v.seconds < 3600 && v.views > 1000
                );

                if (!validVideos.length) {
                    return await conn.sendMessage(chatId, { 
                        text: `❌ *No suitable videos found!*\n\nTry a different search term.` 
                    }, { quoted: message });
                }

                videoInfo = validVideos[0];
                videoUrl = videoInfo.url;

                console.log('Selected video:', {
                    title: videoInfo.title,
                    duration: videoInfo.timestamp,
                    views: videoInfo.views.toLocaleString(),
                    url: videoInfo.url
                });
            } catch (searchError) {
                console.error('Search error:', searchError);
                return await conn.sendMessage(chatId, { 
                    text: '❌ *Search failed!*\n\nPlease try again later or use a YouTube URL.' 
                }, { quoted: message });
            }
        }

        // Show video info
        const videoInfoMsg = `
🎬 *Video Found!*

📀 *Title:* ${videoInfo?.title || 'Unknown'}
⏱️ *Duration:* ${videoInfo?.timestamp || 'Unknown'}
👁️ *Views:* ${videoInfo?.views?.toLocaleString() || 'Unknown'}
👤 *Channel:* ${videoInfo?.author?.name || 'Unknown'}
📅 *Uploaded:* ${videoInfo?.ago || 'Unknown'}

_⏳ Downloading video..._
        `.trim();

        // Send video info
        await conn.sendMessage(chatId, { 
            text: videoInfoMsg 
        }, { quoted: message });

        // Try multiple download APIs
        let videoData = null;
        
        // API 1: Nekolabs
        try {
            console.log('Trying Nekolabs API...');
            const encodedUrl = encodeURIComponent(videoUrl);
            const apiUrl = `https://api.nekolabs.web.id/downloader/youtube/v4?url=${encodedUrl}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.success && data.result && data.result.medias && data.result.medias.length > 0) {
                const videoMedia = data.result.medias[0];
                if (videoMedia.url) {
                    videoData = {
                        url: videoMedia.url,
                        title: data.result.title || videoInfo.title,
                        quality: videoMedia.quality || videoMedia.label || 'HD'
                    };
                    console.log('✅ Success with Nekolabs API');
                }
            }
        } catch (error) {
            console.log('❌ Nekolabs API failed:', error.message);
        }

        // API 2: GiftedTech fallback
        if (!videoData) {
            try {
                console.log('Trying GiftedTech API...');
                const videoId = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1];
                
                if (videoId) {
                    const apiUrl = `https://api.giftedtech.co.ke/api/search/ytdl?apikey=gifted&id=${videoId}`;
                    const response = await fetch(apiUrl);
                    const data = await response.json();

                    if (data.success && data.result) {
                        // Try to find video URL in response
                        let videoUrlFromApi = data.result.downloadUrl || data.result.url || data.result.videoUrl;
                        
                        if (!videoUrlFromApi && data.result.formats) {
                            const videoFormats = data.result.formats.filter(format => 
                                format.mimeType && format.mimeType.includes('video')
                            );
                            if (videoFormats.length > 0) {
                                videoUrlFromApi = videoFormats[0].url;
                            }
                        }

                        if (videoUrlFromApi) {
                            videoData = {
                                url: videoUrlFromApi,
                                title: data.result.title || videoInfo.title,
                                quality: 'HD'
                            };
                            console.log('✅ Success with GiftedTech API');
                        }
                    }
                }
            } catch (error) {
                console.log('❌ GiftedTech API failed:', error.message);
            }
        }

        // API 3: David Cyril fallback
        if (!videoData) {
            try {
                console.log('Trying David Cyril API...');
                const apiUrl = `https://apis.davidcyriltech.my.id/youtube?url=${encodeURIComponent(videoUrl)}`;
                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.downloadUrl) {
                    videoData = {
                        url: data.downloadUrl,
                        title: data.title || videoInfo.title,
                        quality: 'HD'
                    };
                    console.log('✅ Success with David Cyril API');
                }
            } catch (error) {
                console.log('❌ David Cyril API failed:', error.message);
            }
        }

        if (!videoData) {
            return await conn.sendMessage(chatId, { 
                text: '❌ *All download services are busy!*\n\nPlease try again in a few minutes.' 
            }, { quoted: message });
        }

        // Download and send the video
        try {
            await conn.sendMessage(chatId, {
                video: { url: videoData.url },
                caption: `🎬 *${videoData.title}*\n\n` +
                        `✅ Successfully downloaded!\n` +
                        `📺 Quality: ${videoData.quality}\n` +
                        `👤 Channel: ${videoInfo?.author?.name || 'Unknown'}\n` +
                        `⏱️ Duration: ${videoInfo?.timestamp || 'Unknown'}\n\n` +
                        `📥 Downloaded via ${global.botname || 'Bot'}`,
                mimetype: 'video/mp4',
                fileName: `${(videoData.title || 'video').replace(/[<>:"/\\|?*]/g, '_').slice(0, 60)}.mp4`
            }, { quoted: message });

            // Success reaction
            await conn.sendMessage(chatId, { react: { text: '✅', key: message.key } });

        } catch (videoError) {
            console.error('Video sending error:', videoError);
            
            // If video sending fails, send the YouTube link
            await conn.sendMessage(chatId, { 
                text: `*❌ Video is too large to send directly*\n\n` +
                      `*📺 Title:* ${videoData.title || 'Unknown'}\n` +
                      `*⏱️ Duration:* ${videoInfo?.timestamp || 'Unknown'}\n` +
                      `*👤 Channel:* ${videoInfo?.author?.name || 'Unknown'}\n\n` +
                      `🎬 *YouTube Link:*\n${videoUrl}\n\n` +
                      `_Use the link above to watch the video._`
            }, { quoted: message });
            
            await conn.sendMessage(chatId, { react: { text: '❌', key: message.key } });
        }

    } catch (error) {
        console.error('YTMP4 command error:', error);
        
        let errorMessage = '❌ Error downloading video. ';
        
        if (error.message.includes('Invalid YouTube URL')) {
            errorMessage += 'Please provide a valid YouTube URL.';
        } else if (error.message.includes('No videos found')) {
            errorMessage += 'No videos found for your search.';
        } else if (error.message.includes('Failed to get video information')) {
            errorMessage += 'Could not fetch video information.';
        } else if (error.message.includes('All download services are busy')) {
            errorMessage += 'All download services are currently busy.';
        } else {
            errorMessage += 'Please try again later.';
        }
        
        await conn.sendMessage(chatId, { text: errorMessage }, { quoted: message });
        await conn.sendMessage(chatId, { react: { text: '❌', key: message.key } });
    }
}

module.exports = { KelvinVideo };