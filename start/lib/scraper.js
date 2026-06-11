
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const axios = require('axios')
const fs = require('fs');
const path = require('path');
const fileTypeFromBuffer = require('file-type')
const randomarray = async (array) => {
	return array[Math.floor(Math.random() * array.length)]
}
const { toAudio } = require('../../start/lib/converter')

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

async function fetchMp3(conn, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        if (!text) {
            await conn.sendMessage(chatId, { text: 'Usage: .song <song name or YouTube link>' }, { quoted: message });
            return;
        }

        let videoUrl;
        let videoTitle;
        let videoThumbnail;

        if (text.includes('youtube.com') || text.includes('youtu.be')) {
            videoUrl = text;
            const search = await yts({ videoId: extractVideoId(text) });
            if (search && search.title) {
                videoTitle = search.title;
                videoThumbnail = search.thumbnail;
            } else {
                videoTitle = "YouTube Video";
                videoThumbnail = "";
            }
        } else {
            const search = await yts(text);
            if (!search || !search.videos.length) {
                await conn.sendMessage(chatId, { text: 'No results found.' }, { quoted: message });
                return;
            }
            videoUrl = search.videos[0].url;
            videoTitle = search.videos[0].title;
            videoThumbnail = search.videos[0].thumbnail;
        }

        await conn.sendMessage(chatId, {
            image: { url: videoThumbnail },
            caption: `🎵 *${videoTitle}*\n\n📥 Downloading audio...`
        }, { quoted: message });

        // API call for MP3 (normal quality)
        const apiUrl = 'https://ktrenqecceeooyrquooc.supabase.co/functions/v1/api-proxy';
        const requestBody = {
            apiKey: "guru_x3jr526k5pqbl91wqubhws3y48qj6zbo",
            action: "yt-mp3",
            payload: {
                url: videoUrl,
                quality: "normal"
            }
        };

        const response = await axios.post(apiUrl, requestBody, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 60000
        });

        const result = response.data;

        if (!result || !result.download || !result.download.url) {
            throw new Error('No download URL received');
        }

        const audioUrl = result.download.url;
        const audioTitle = result.title || videoTitle;

        // Download audio buffer
        const audioResponse = await axios.get(audioUrl, {
            responseType: 'arraybuffer',
            timeout: 90000
        });
        
        const audioBuffer = Buffer.from(audioResponse.data);

        // Send as document
        await conn.sendMessage(chatId, {
            document: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName: `${audioTitle.replace(/[^\w\s-]/g, '')}.mp3`,
            caption: `🎵 *${audioTitle}*\n\n> ${global.wm || 'JEXPLOIT'}`
        }, { quoted: message });

    } catch (err) {
        console.error('fetchMp3 error:', err);
        await conn.sendMessage(chatId, { 
            text: '❌ Failed to download song. Please try again later.' 
        }, { quoted: message });
    }
}

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

// EliteProTech API
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

// Yupra API
async function getYupraVideo(youtubeUrl) {
    const apiUrl = `https://api.yupra.my.id/api/downloader/ytmp4?url=${encodeURIComponent(youtubeUrl)}`;
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
    if (res?.data?.success && res?.data?.data?.download_url) {
        return {
            download: res.data.data.download_url,
            title: res.data.data.title,
            thumbnail: res.data.data.thumbnail
        };
    }
    throw new Error('Yupra returned no download');
}

// Okatsu API
async function getOkatsuVideo(youtubeUrl) {
    const apiUrl = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp4?url=${encodeURIComponent(youtubeUrl)}`;
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
    if (res?.data?.result?.mp4) {
        return {
            download: res.data.result.mp4,
            title: res.data.result.title
        };
    }
    throw new Error('Okatsu returned no download');
}

// Main fetchVideo function
async function fetchVideo(youtubeUrl) {
    const apiMethods = [
        { name: 'EliteProTech', method: () => getEliteProTechVideo(youtubeUrl) },
        { name: 'Yupra', method: () => getYupraVideo(youtubeUrl) },
        { name: 'Okatsu', method: () => getOkatsuVideo(youtubeUrl) }
    ];

    for (const apiMethod of apiMethods) {
        try {
            console.log(`🔄 Trying ${apiMethod.name} for Video...`);
            const result = await apiMethod.method();
            if (result && result.download) {
                console.log(`✅ ${apiMethod.name} successful!`);
                return result;
            }
        } catch (err) {
            console.warn(`❌ ${apiMethod.name} failed: ${err.message}`);
            continue;
        }
    }
    throw new Error("All Video download APIs failed.");
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

module.exports = { wallpaper, fetchMp3, fetchVideo, wikimedia, ringtone, styletext }