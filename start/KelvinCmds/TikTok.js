// TikTok Search Function
const fetch = require('node-fetch');
const yts = require('yt-search');
const axios = require("axios");

async function tiktokSearch(query) {
    try {
        const searchUrl = `https://api.jerexd666.wongireng.my.id/search/tiktok?q=${encodeURIComponent(query)}`;
        
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        if (!data.status || !data.result || data.result.length === 0) {
            return "❌ No TikTok videos found for your search.";
        }
        
        const videos = data.result.slice(0, 5); // Limit to 5 results
        let result = `🎵 **TikTok Search Results for "${query}"**\n\n`;
        
        videos.forEach((video, index) => {
            result += `**${index + 1}. ${video.title}**\n`;
            result += `👤 Author: ${video.author.nickname}\n`;
            result += `❤️ Likes: ${video.digg_count.toLocaleString()}\n`;
            result += `▶️ Plays: ${video.play_count.toLocaleString()}\n`;
            result += `💬 Comments: ${video.comment_count}\n`;
            result += `🔗 Video URL: ${video.play}\n\n`;
        });
        
        return result;
        
    } catch (error) {
        console.error('TikTok search error:', error);
        return "❌ Error searching TikTok. Please try again later.";
    }
}

module.exports = { tiktokSearch }