const fs = require('fs');
const path = require('path');

const START_TIME_FILE = './data/bot_start_time.json';

function saveStartTime() {
    const data = {
        startTime: Date.now(),
        timestamp: new Date().toISOString()
    };
    
    const dir = path.dirname(START_TIME_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(START_TIME_FILE, JSON.stringify(data, null, 2));

function loadStartTime() {
    try {
        if (fs.existsSync(START_TIME_FILE)) {
            const data = JSON.parse(fs.readFileSync(START_TIME_FILE, 'utf8'));
            return data.startTime || Date.now();
        }
    } catch (error) {
        console.error('Error loading start time:', error);
    }
    
    // If file doesn't exist or is corrupted, create new one
    const startTime = Date.now();
    saveStartTime();
    return startTime;
}

function getPersistentUptime() {
    const startTime = loadStartTime();
    const uptimeMs = Date.now() - startTime;
    return formatUptime(uptimeMs);
}

function formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    return {
        days: days,
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60,
        formatted: `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`
    };
}

module.exports = {
    saveStartTime,
    loadStartTime,
    getPersistentUptime,
    formatUptime
};