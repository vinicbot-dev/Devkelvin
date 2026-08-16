const cheerio = require('cheerio')
const fetch = require('node-fetch')
const yts = require('yt-search');
const axios = require('axios')
const fs = require('fs');
const path = require('path');
const fileTypeFromBuffer = require('file-type')
const randomarray = async (array) => {
	return array[Math.floor(Math.random() * array.length)]
}
const { toAudio } = require('../../start/lib/converter')
const { downloadVerifiedMedia } = require('../../Jex')

const AXIOS_DEFAULTS = {
    timeout: 60000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
    }
};

async function tryRequest(getter, attempts = 3) {
    let lastError;
    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            return await getter();
        } catch (err) {
            lastError = err;
            if (attempt < attempts) {
                await new Promise(r => setTimeout(r, 1000 * attempt));
            }
        }
    }
    throw lastError;
}

// fetchMp3 function using Elite API only
async function fetchMp3(conn, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        if (!text) {
            await conn.sendMessage(chatId, { text: global.mess.make.usage('.song', '<song name or YouTube link>') }, { quoted: message });
            return;
        }

        let query = text;
        let videoTitle = "YouTube Audio";
        let videoThumbnail = "";
        let downloadUrl = "";

        // Check if it's a YouTube URL or search query
        if (text.includes('youtube.com') || text.includes('youtu.be')) {
            // Extract video ID from URL
            const videoId = extractVideoId(text);
            if (videoId) {
                query = `https://www.youtube.com/watch?v=${videoId}`;
                // Get video info using yt-search
                const search = await yts({ videoId: videoId });
                if (search && search.title) {
                    videoTitle = search.title;
                    videoThumbnail = search.thumbnail;
                }
            } else {
                await conn.sendMessage(chatId, { text: global.mess.make.error('Invalid YouTube URL.') }, { quoted: message });
                return;
            }
        } else {
            // Search for the video first using yt-search to get the URL
            const search = await yts(text);
            if (!search || !search.videos.length) {
                await conn.sendMessage(chatId, { text: global.mess.notfound }, { quoted: message });
                return;
            }
            const video = search.videos[0];
            query = video.url;
            videoTitle = video.title;
            videoThumbnail = video.thumbnail;
        }

        // Use Elite API for MP3
        try {
            const apiUrl = `https://eliteprotech-apis.zone.id/ytmp3?url=${encodeURIComponent(query)}`;
            const response = await axios.get(apiUrl, { timeout: 30000 });
            const result = response.data;
            
            if (result && result.status && result.result && result.result.download) {
                downloadUrl = result.result.download;
                videoTitle = result.result.title || videoTitle;
                
                // Send thumbnail with caption
                await conn.sendMessage(chatId, {
                    image: { url: videoThumbnail },
                    caption: `🎵 *${videoTitle}*\n📥 Downloading audio please wait...`
                }, { quoted: message });
            } else {
                throw new Error('No download URL from Elite API');
            }
        } catch (error) {
            console.log('Elite API failed:', error.message);
            throw new Error('Failed to fetch audio from Elite API');
        }

        // Download audio buffer
        const audioResponse = await axios.get(downloadUrl, {
            responseType: 'arraybuffer',
            timeout: 90000
        });
        
        const audioBuffer = Buffer.from(audioResponse.data);

        // Send as document
        await conn.sendMessage(chatId, {
            document: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName: `${videoTitle.replace(/[^\w\s-]/g, '')}.mp3`,
            caption: `🎵 *${videoTitle}*\n\n> ${global.wm || 'JEXPLOIT'}`
        }, { quoted: message });

    } catch (err) {
        console.error('fetchMp3 error:', err);
        await conn.sendMessage(chatId, { 
            text: '❌ Failed to download song. Please try again later.' 
        }, { quoted: message });
    }
}

// EliteProTech Video API (ytdown) — fallback
async function getEliteProTechVideo(youtubeUrl) {
    const apiUrl = `https://eliteprotech-apis.zone.id/ytdown?url=${encodeURIComponent(youtubeUrl)}&format=mp4`;
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
    if (res?.data?.success && res?.data?.downloadURL) {
        return {
            download: res.data.downloadURL,
            title: res.data.title
        };
    }
    throw new Error('EliteProTech returned no download');
}

// Malvin (savetube) Video API — tried first, fixed at 360p
async function getMalvinVideo(youtubeUrl, quality = '360') {
    const apiUrl = `${global.wow}download/savetube?url=${encodeURIComponent(youtubeUrl)}&type=video&quality=${quality}&apikey=${global.KevinApi}`;
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
    if (res?.data?.status && res?.data?.data?.download_url) {
        return {
            download: res.data.data.download_url,
            title: res.data.data.title
        };
    }
    throw new Error('Malvin (savetube) returned no download');
}

// Old apiskeith.top primary — kept, no longer called (replaced by Malvin below)
async function getPrimaryApiVideo(youtubeUrl) {
    const apiUrl = `${global.api}/download/video?url=${encodeURIComponent(youtubeUrl)}`;
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
    if (res?.data?.status && res?.data?.result) {
        return {
            download: res.data.result,
            title: res.data.title // this API doesn't return a title
        };
    }
    throw new Error('Primary API returned no download');
}
// Main fetchVideo function — tries Malvin (savetube, 360p) first, then
// falls back to EliteProTech. Whichever candidate comes back, we don't
// trust the API's own "status: true" alone: the link is actually
// downloaded and confirmed to be real, playable video (via the same
// downloadVerifiedMedia check used elsewhere in this project) before
// it's accepted. A provider that reports success but hands back a dead
// or expired link is treated as a failure and we move to the next one.
async function fetchVideo(youtubeUrl) {
    const apiMethods = [
        { name: 'Malvin', method: () => getMalvinVideo(youtubeUrl, '360') },
        { name: 'EliteProTech', method: () => getEliteProTechVideo(youtubeUrl) }
    ];

    // Get video title from yts as fallback
    let fallbackTitle = 'YouTube Video';
    try {
        const search = await yts(youtubeUrl);
        if (search && search.title) {
            fallbackTitle = search.title;
        }
    } catch (e) {
        // Ignore yts error
    }

    for (const apiMethod of apiMethods) {
        try {
            console.log(`🔄 Trying ${apiMethod.name} for Video...`);
            const result = await apiMethod.method();
            if (result && result.download) {
                await downloadVerifiedMedia(result.download, 'video');
                console.log(`✅ ${apiMethod.name} successful and confirmed playable!`);
                // Ensure title exists
                result.title = result.title || fallbackTitle;
                return result;
            }
        } catch (err) {
            console.warn(`❌ ${apiMethod.name} failed: ${err.message}`);
            continue;
        }
    }
    throw new Error("All Video download APIs failed to return playable video.");
}

function wallpaper(title, page = '1') {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${title}`)
        .then(({ data }) => {
            let $ = cheerio.load(data)
            let hasil = []
            $('div.grid-item').each(function (a, b) {
                hasil.push({
                    title: $(b).find('div.info > a > h3').text(),
                    type: $(b).find('div.info > a:nth-child(2)').text(),
                    source: 'https://www.besthdwallpaper.com/'+$(b).find('div > a:nth-child(3)').attr('href'),
                    image: [$(b).find('picture > img').attr('data-src') || $(b).find('picture > img').attr('src'), $(b).find('picture > source:nth-child(1)').attr('srcset'), $(b).find('picture > source:nth-child(2)').attr('srcset')]
                })
            })
            resolve(hasil)
        })
    })
}

function wikimedia(title) {
    return new Promise((resolve, reject) => {
        axios.get(`https://commons.wikimedia.org/w/index.php?search=${title}&title=Special:MediaSearch&go=Go&type=image`)
        .then((res) => {
            let $ = cheerio.load(res.data)
            let hasil = []
            $('.sdms-search-results__list-wrapper > div > a').each(function (a, b) {
                hasil.push({
                    title: $(b).find('img').attr('alt'),
                    source: $(b).attr('href'),
                    image: $(b).find('img').attr('data-src') || $(b).find('img').attr('src')
                })
            })
            resolve(hasil)
        })
    })
}

function ringtone(title) {
    return new Promise((resolve, reject) => {
        axios.get('https://meloboom.com/en/search/'+title)
        .then((get) => {
            let $ = cheerio.load(get.data)
            let hasil = []
            $('#__next > main > section > div.jsx-2244708474.container > div > div > div > div:nth-child(4) > div > div > div > ul > li').each(function (a, b) {
                hasil.push({ title: $(b).find('h4').text(), source: 'https://meloboom.com/'+$(b).find('a').attr('href'), audio: $(b).find('audio').attr('src') })
            })
            resolve(hasil)
        })
    })
}

function styletext(teks) {
    return new Promise((resolve, reject) => {
        axios.get('http://qaz.wtf/u/convert.cgi?text='+teks)
        .then(({ data }) => {
            let $ = cheerio.load(data)
            let hasil = []
            $('table > tbody > tr').each(function (a, b) {
                hasil.push({ name: $(b).find('td:nth-child(1) > span').text(), result: $(b).find('td:nth-child(2)').text().trim() })
            })
            resolve(hasil)
        })
    })
}

// Helper function to extract video ID from URL
function extractVideoId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([^&]+)/,
        /(?:youtu\.be\/)([^?]+)/,
        /(?:youtube\.com\/embed\/)([^/?]+)/
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

module.exports = { wallpaper, fetchMp3, fetchVideo, wikimedia, ringtone, styletext }