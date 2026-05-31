
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const axios = require('axios')
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

// Detect audio format from buffer
function detectAudioFormat(buffer) {
    const firstBytes = buffer.slice(0, 12);
    const hexSignature = firstBytes.toString('hex');
    const asciiSignature = firstBytes.toString('ascii', 4, 8);

    // Check for MP4/M4A (ftyp box)
    if (asciiSignature === 'ftyp' || hexSignature.startsWith('000000')) {
        const ftypBox = buffer.slice(4, 8).toString('ascii');
        if (ftypBox === 'ftyp') {
            return 'm4a';
        }
    }
    // Check for MP3 (ID3 tag or MPEG frame sync)
    else if (buffer.toString('ascii', 0, 3) === 'ID3' || 
             (buffer[0] === 0xFF && (buffer[1] & 0xE0) === 0xE0)) {
        return 'mp3';
    }
    // Check for OGG/Opus
    else if (buffer.toString('ascii', 0, 4) === 'OggS') {
        return 'ogg';
    }
    // Check for WAV
    else if (buffer.toString('ascii', 0, 4) === 'RIFF') {
        return 'wav';
    }
    return 'unknown';
}

// EliteProTech API - Primary
async function getEliteProTechMp3(youtubeUrl) {
    const apiUrl = `https://eliteprotech-apis.zone.id/ytdown?url=${encodeURIComponent(youtubeUrl)}&format=mp3`;
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
    if (res?.data?.success && res?.data?.downloadURL) {
        return {
            download: res.data.downloadURL,
            title: res.data.title
        };
    }
    throw new Error('EliteProTech returned no download');
}

// Yupra API - Fallback 1
async function getYupraMp3(youtubeUrl) {
    const apiUrl = `https://api.yupra.my.id/api/downloader/ytmp3?url=${encodeURIComponent(youtubeUrl)}`;
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

// Okatsu API - Fallback 2
async function getOkatsuMp3(youtubeUrl) {
    const apiUrl = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp3?url=${encodeURIComponent(youtubeUrl)}`;
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
    if (res?.data?.dl) {
        return {
            download: res.data.dl,
            title: res.data.title,
            thumbnail: res.data.thumb
        };
    }
    throw new Error('Okatsu returned no download');
}

// Prince Techn API - Last Fallback
async function getPrinceTechnMp3(youtubeUrl) {
    const apiUrl = `https://api.princetechn.com/api/download/ytmp3?apikey=prince&url=${encodeURIComponent(youtubeUrl)}`;
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
    if (res?.data?.success && res?.data?.result?.download_url) {
        return {
            download: res.data.result.download_url,
            title: res.data.result.title,
            duration: res.data.result.duration,
            quality: res.data.result.quality
        };
    }
    throw new Error('Prince Techn API returned no download');
}

// Download and convert audio to MP3 if needed
async function downloadAndConvert(audioUrl, title) {
    // Download the audio file
    const audioResponse = await axios.get(audioUrl, {
        responseType: 'arraybuffer',
        timeout: 90000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
    });
    
    let audioBuffer = Buffer.from(audioResponse.data);
    
    if (!audioBuffer || audioBuffer.length === 0) {
        throw new Error('Downloaded audio buffer is empty');
    }
    
    // Detect format
    const detectedFormat = detectAudioFormat(audioBuffer);
    
    // Convert to MP3 if not already MP3
    if (detectedFormat !== 'mp3') {
        console.log(`Converting ${detectedFormat} to MP3...`);
        audioBuffer = await toAudio(audioBuffer, detectedFormat);
        if (!audioBuffer || audioBuffer.length === 0) {
            throw new Error('Conversion returned empty buffer');
        }
    }
    
    return {
        buffer: audioBuffer,
        title: title,
        format: 'mp3'
    };
}

// Main fetchMp3 function
async function fetchMp3(youtubeUrl, returnBuffer = false) {
    const apiMethods = [
        { name: 'EliteProTech', method: () => getEliteProTechMp3(youtubeUrl) },
        { name: 'Yupra', method: () => getYupraMp3(youtubeUrl) },
        { name: 'Okatsu', method: () => getOkatsuMp3(youtubeUrl) },
        { name: 'Prince Techn', method: () => getPrinceTechnMp3(youtubeUrl) }
    ];

    for (const apiMethod of apiMethods) {
        try {
            console.log(`🔄 Trying ${apiMethod.name} for MP3...`);
            const result = await apiMethod.method();
            if (result && result.download) {
                console.log(`✅ ${apiMethod.name} successful!`);
                
                if (returnBuffer) {
                    // Download and convert to MP3 buffer
                    const converted = await downloadAndConvert(result.download, result.title);
                    return {
                        buffer: converted.buffer,
                        title: converted.title,
                        duration: result.duration,
                        quality: result.quality
                    };
                }
                
                return result;
            }
        } catch (err) {
            console.warn(`❌ ${apiMethod.name} failed: ${err.message}`);
            continue;
        }
    }
    throw new Error("All MP3 download APIs failed.");
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