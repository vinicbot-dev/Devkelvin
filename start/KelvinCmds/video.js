const yts = require('yt-search');
const axios = require('axios');
const { sendButtons } = require('gifted-btns');
const { fetchVideoDownloadUrl, downloadVerifiedMedia } = require('../../Jex');
// Added missing import for fetchVideo (fallback)
const { fetchVideo } = require('../../start/lib/scraper');

async function playCommand2(conn, chatId, message, args) {
    const text = args.join(' ').trim();
    
    if (!text) {
        return conn.sendMessage(chatId, {
            text: '🎵 *Please provide song name or URL*`'
        }, { quoted: message });
    }

    try {
        await conn.sendMessage(chatId, {
            react: { text: '🔍', key: message.key }
        });

        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            return conn.sendMessage(chatId, {
                text: '*No results found for your query!*\n\nTry different keywords.'
            }, { quoted: message });
        }

        const video = videos[0];
        const videoUrl = video.url;
        const dateNow = Date.now();
        
        let uploadYear = 'Unknown';
        if (video.ago) {
            const yearMatch = video.ago.match(/(\d{4})/);
            if (yearMatch) {
                uploadYear = yearMatch[0];
            } else if (video.ago.includes('year')) {
                const yearsAgo = parseInt(video.ago.match(/(\d+)/)?.[0] || '0');
                const currentYear = new Date().getFullYear();
                uploadYear = (currentYear - yearsAgo).toString();
            }
        }

        // AUDIO: HectorManuel API → Elite API fallback
        let audioUrl;
        let title;
        
        try {
            console.log('Fetching audio from HectorManuel API...');
            const apiUrl = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(videoUrl)}`;
            const response = await axios.get(apiUrl, { timeout: 30000 });
            const data = response.data;

            if (data?.status && data?.audio) {
                audioUrl = data.audio;
                title = data.title || video.title;
                console.log('Audio obtained from HectorManuel API');
            } else {
                throw new Error('Primary API failed');
            }
        } catch (primaryError) {
            console.log('HectorManuel API failed:', primaryError.message);
            console.log('Trying Elite API as fallback...');
            
            try {
                const apiUrl = `https://eliteprotech-apis.zone.id/ytmp3?url=${encodeURIComponent(videoUrl)}`;
                const response = await axios.get(apiUrl, { timeout: 30000 });
                const data = response.data;

                if (data?.status && data?.result?.download) {
                    audioUrl = data.result.download;
                    title = data.result.title || video.title;
                    console.log('Audio obtained from Elite API');
                } else {
                    throw new Error('Elite API failed');
                }
            } catch (eliteError) {
                console.log('Elite API failed:', eliteError.message);
                return conn.sendMessage(chatId, {
                    text: '🚫 *Failed to fetch audio*\n\nPlease try again later or use a different song.'
                }, { quoted: message });
            }
        }

        // VIDEO: Cypher API → David Cyril API → scraper.js final fallback
        let videoDownloadUrl = null;
        let videoMetadata = null;
        
        try {
            console.log('Fetching video from Cypher API...');
            const cypherApiUrl = `https://media.cypherxbot.space/download/youtube/video?url=${encodeURIComponent(videoUrl)}`;
            const cypherResponse = await axios.get(cypherApiUrl, { timeout: 30000 });
            const cypherData = cypherResponse.data;
            
            if (cypherData?.success && cypherData?.result?.download_url) {
                videoDownloadUrl = cypherData.result.download_url;
                videoMetadata = {
                    title: cypherData.result.title,
                    thumbnail: cypherData.result.thumbnail,
                    quality: cypherData.result.quality
                };
                console.log('Video URL obtained from Cypher API');
            } else {
                throw new Error('No video URL from Cypher API');
            }
        } catch (cypherError) {
            console.log('Cypher API failed:', cypherError.message);
            console.log('Trying David Cyril API as fallback...');
            
            try {
                const davidApiUrl = `https://apis.davidcyril.name.ng/download/ytmp4?url=${encodeURIComponent(videoUrl)}`;
                const davidResponse = await axios.get(davidApiUrl, { timeout: 30000 });
                const davidData = davidResponse.data;
                
                if (davidData?.success && davidData?.result?.download_url) {
                    videoDownloadUrl = davidData.result.download_url;
                    videoMetadata = {
                        title: davidData.result.title || video.title,
                        thumbnail: davidData.result.thumbnail || video.thumbnail,
                        quality: davidData.result.quality || '720p'
                    };
                    console.log('Video URL obtained from David Cyril API');
                } else {
                    throw new Error('No video URL from David Cyril API');
                }
            } catch (davidError) {
                console.log('David Cyril API failed:', davidError.message);
                console.log('Trying scraper.js fetchVideo as final fallback...');
                
                try {
                    const scraperResult = await fetchVideo(videoUrl);
                    if (scraperResult && scraperResult.download) {
                        videoDownloadUrl = scraperResult.download;
                        videoMetadata = {
                            title: scraperResult.title || video.title,
                            thumbnail: scraperResult.thumbnail || video.thumbnail,
                            quality: '360p'
                        };
                        console.log('Video URL obtained from scraper.js fetchVideo');
                    } else {
                        throw new Error('No video URL from scraper.js');
                    }
                } catch (scraperError) {
                    console.log('Scraper.js fetchVideo failed:', scraperError.message);
                    videoDownloadUrl = null;
                    videoMetadata = null;
                }
            }
        }

        const mediaData = {
            title: title || video.title,
            thumbnail: video.thumbnail,
            audioUrl: audioUrl,
            videoUrl: videoDownloadUrl,
            videoMetadata: videoMetadata,
            duration: video.timestamp,
            views: video.views,
            ago: video.ago,
            channel: video.author?.name,
            uploadYear: uploadYear,
            youtubeUrl: videoUrl
        };

        if (!audioUrl) {
            return conn.sendMessage(chatId, {
                text: '🚫 *Failed to fetch audio*\n\nPlease try again later or use a different song.'
            }, { quoted: message });
        }

        // Image + buttons in one message
        const buttons = [
            {
                id: `audio_${dateNow}`,
                text: '🎵 AUDIO'
            },
            {
                id: `document_${dateNow}`,
                text: '📄 AUDIO DOC'
            },
            {
                id: `video_${dateNow}`,
                text: '📹 VIDEO'
            },
            {
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                    display_text: '▶️ WATCH ON YOUTUBE',
                    url: mediaData.youtubeUrl
                })
            }
        ];

        await sendButtons(conn, chatId, {
            title: '🎵 MEDIA DOWNLOADER',
            image: { url: mediaData.thumbnail },
            text: `🎬 *${mediaData.title}*\n\n⏱️ *Duration:* ${mediaData.duration}\n👁️ *Views:* ${mediaData.views.toLocaleString()}\n📅 *Uploaded:* ${mediaData.ago || 'Unknown'} ${mediaData.uploadYear !== 'Unknown' ? `(${mediaData.uploadYear})` : ''}\n🔗 *Channel:* ${mediaData.channel || 'Unknown'}\n\n✨ *SELECT DOWNLOAD FORMAT:*`,
            footer: 'Powered by Kevin Tech',
            buttons: buttons
        }, { quoted: message });

        await conn.sendMessage(chatId, { react: { text: '✅', key: message.key } });

        if (!global.buttonMediaStore) global.buttonMediaStore = new Map();
        global.buttonMediaStore.set(dateNow.toString(), mediaData);

        const selectionHandler = async (msgUpdate) => {
            try {
                const buttonMsg = msgUpdate.messages[0];
                if (!buttonMsg.message) return;
                if (buttonMsg.key.remoteJid !== chatId) return;

                let selectedButtonId = null;
                
                if (buttonMsg.message?.buttonsResponseMessage) {
                    selectedButtonId = buttonMsg.message.buttonsResponseMessage.selectedButtonId;
                } else if (buttonMsg.message?.templateButtonReplyMessage) {
                    selectedButtonId = buttonMsg.message.templateButtonReplyMessage.selectedId;
                }
                
                if (!selectedButtonId) return;
                if (!selectedButtonId.includes(`_${dateNow}`)) return;

                conn.ev.off('messages.upsert', selectionHandler);
                
                await conn.sendMessage(chatId, { react: { text: '⬇️', key: buttonMsg.key } });

                const storedMedia = global.buttonMediaStore.get(dateNow.toString());
                if (!storedMedia) return;

                // 🎵 Audio
                if (selectedButtonId.startsWith('audio_')) {
                    try {
                        const audio = await downloadVerifiedMedia(storedMedia.audioUrl, 'audio');
                        await conn.sendMessage(chatId, {
                            audio: audio.buffer,
                            mimetype: 'audio/mpeg',
                            fileName: `${storedMedia.title.replace(/[^\w\s]/gi, '')}.mp3`,
                            ptt: false,
                            caption: '🎵 *Enjoy your music!*\n\nPowered by Kevin Tech'
                        }, { quoted: buttonMsg });
                    } catch (audioErr) {
                        console.error('Audio download error:', audioErr);
                        await conn.sendMessage(chatId, {
                            text: '❌ *Failed to download audio.*\n\nPlease try again later.'
                        }, { quoted: buttonMsg });
                    }
                }
                
                // 📄 Audio Document
                else if (selectedButtonId.startsWith('document_')) {
                    try {
                        const audio = await downloadVerifiedMedia(storedMedia.audioUrl, 'audio');
                        await conn.sendMessage(chatId, {
                            document: audio.buffer,
                            mimetype: 'audio/mpeg',
                            fileName: `${storedMedia.title.replace(/[^\w\s]/gi, '')}.mp3`,
                            caption: '📄 *Audio Document*\n\nPowered by Kevin Tech'
                        }, { quoted: buttonMsg });
                    } catch (audioErr) {
                        console.error('Audio document download error:', audioErr);
                        await conn.sendMessage(chatId, {
                            text: '❌ *Failed to download audio.*\n\nPlease try again later.'
                        }, { quoted: buttonMsg });
                    }
                }
                
                // 📹 Video
                else if (selectedButtonId.startsWith('video_')) {
                    await conn.sendMessage(chatId, { react: { text: '⏳', key: buttonMsg.key } });

                    try {
                        // fetchVideoDownloadUrl returns { url, buffer, quality, title } -
                        // a verified, already-downloaded buffer, not a plain URL string.
                        const videoResult = await fetchVideoDownloadUrl(storedMedia.youtubeUrl);

                        if (!videoResult || !videoResult.buffer) {
                            throw new Error('No video download URL');
                        }

                        const videoQuality = videoResult.quality
                            ? `\n🎬 *Quality:* ${videoResult.quality}`
                            : '';

                        await conn.sendMessage(chatId, {
                            video: videoResult.buffer,
                            mimetype: videoResult.mime || 'video/mp4',
                            fileName: `${storedMedia.title.replace(/[^\w\s]/gi, '')}.mp4`,
                            caption: `✅ *Video ready!*\n\n🎬 *${storedMedia.title}*${videoQuality}\n📺 *Channel:* ${storedMedia.channel || 'YouTube'}\n\n🎉 *Enjoy watching!*`
                        }, { quoted: buttonMsg });

                    } catch (videoErr) {
                        console.error('Video download error:', videoErr);
                        await conn.sendMessage(chatId, {
                            text: '❌ *Failed to download video.*\n\nPlease try again later.'
                        }, { quoted: buttonMsg });
                    }
                }
                
                // ▶️ Watch on YouTube
                else if (selectedButtonId.startsWith('watch_')) {
                    await conn.sendMessage(chatId, {
                        text: `✅ *Opening YouTube*\n\n🎬 *${storedMedia.title}*\n\nEnjoy watching! 🎥`
                    }, { quoted: buttonMsg });
                }
                
                await conn.sendMessage(chatId, {
                    react: { text: '✅', key: buttonMsg.key }
                });
                
                // Clean up after 5 minutes
                setTimeout(() => {
                    if (global.buttonMediaStore?.has(dateNow.toString())) {
                        global.buttonMediaStore.delete(dateNow.toString());
                    }
                }, 300000);
                
            } catch (error) {
                console.error('Button handler error:', error);
                // Ensure we remove listener on error
                conn.ev.off('messages.upsert', selectionHandler);
                await conn.sendMessage(chatId, {
                    text: '❌ *Error processing your request*\n\nPlease try again.\n\nError: ' + error.message
                });
            }
        };
        
        if (conn.ev && typeof conn.ev.on === 'function') {
            conn.ev.on('messages.upsert', selectionHandler);
        }

    } catch (error) {
        console.error('Error in play command:', error);
        await conn.sendMessage(chatId, {
            text: '❌ *Error fetching audio*\n\nPlease try again later.\n\nError: ' + error.message
        }, { quoted: message });
        
        await conn.sendMessage(chatId, {
            react: { text: '❌', key: message.key }
        });
    }
}

module.exports = { playCommand2 };