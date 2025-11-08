const fetch = require('node-fetch');

async function lyricsCommand(conn, chatId, songTitle, message) {
    if (!songTitle) {
        await conn.sendMessage(chatId, { 
            text: '🎵 *Lyrics Command*\n\nUsage: `.lyrics <song name>`\nExample: `.lyrics shape of you`\n\n🔍 Please enter the song name to get the lyrics!'
        }, { quoted: message });
        return;
    }

    try {
        // Send searching message
        await conn.sendMessage(chatId, {
            text: `🔍 Searching lyrics for: "${songTitle}"...`
        }, { quoted: message });

        // Use lyricsapi.fly.dev
        const apiUrl = `https://lyricsapi.fly.dev/api/lyrics?q=${encodeURIComponent(songTitle)}`;
        const res = await fetch(apiUrl);
        
        if (!res.ok) {
            throw new Error(`API returned status: ${res.status}`);
        }
        
        const data = await res.json();

        const lyrics = data?.result?.lyrics;
        if (!lyrics) {
            await conn.sendMessage(chatId, {
                text: `❌ Sorry, I couldn't find any lyrics for "${songTitle}".\n\nTry being more specific with the song title and artist name.`
            }, { quoted: message });
            return;
        }

        // Format the lyrics with better presentation
        const maxChars = 4000; // Leave room for header/footer
        let formattedLyrics = `🎵 *LYRICS FOUND* 🎵\n\n` +
                             `📝 *Song:* ${songTitle}\n` +
                             `📖 *Lyrics:*\n\n` +
                             `${lyrics}`;

        // Truncate if too long
        if (formattedLyrics.length > maxChars) {
            formattedLyrics = formattedLyrics.slice(0, maxChars - 100) + 
                            `\n\n...\n\n📜 *Lyrics truncated due to length limits*\n` +
                            `✨ *Powered by Vinic-Xmd*`;
        } else {
            formattedLyrics += `\n\n✨ *Powered by Vinic-Xmd*`;
        }

        await conn.sendMessage(chatId, { 
            text: formattedLyrics 
        }, { quoted: message });

    } catch (error) {
        console.error('Error in lyrics command:', error);
        
        let errorMessage = `❌ Failed to fetch lyrics for "${songTitle}".`;
        
        if (error.message.includes('API returned status: 5')) {
            errorMessage = '🔧 Lyrics service is temporarily unavailable. Please try again later.';
        } else if (error.message.includes('API returned status: 4')) {
            errorMessage = '❌ Could not find lyrics for this song. Try a different search.';
        } else if (error.message.includes('fetch failed') || error.message.includes('network')) {
            errorMessage = '🌐 Network error. Please check your connection and try again.';
        }
        
        await conn.sendMessage(chatId, { 
            text: errorMessage 
        }, { quoted: message });
    }
}

module.exports = { lyricsCommand };