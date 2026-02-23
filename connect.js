const chalk = require("chalk");
const moment = require('moment-timezone');
const fs = require('fs');
const path = require('path');

// Session cleanup function
function clearSessionFiles() {
    try {
        const sessionDir = path.join(__dirname, './sessions');
        if (fs.existsSync(sessionDir)) {
            const files = fs.readdirSync(sessionDir);
            files.forEach(file => {
                if (file !== 'creds.json') { // Keep creds.json
                    fs.unlinkSync(path.join(sessionDir, file));
                }
            });
            console.log(chalk.yellow('✅ Session files cleaned'));
        }
    } catch (error) {
        console.error('❌ Error cleaning session:', error);
    }
}

// Handle 408 error specifically
async function handle408Error(statusCode) {
    if (statusCode === 408) {
        console.log(chalk.yellow('📡 408 Error detected - Reconnecting...'));
        return true;
    }
    return false;
}

// Auto-join group function
const autoJoinGroup = async (conn) => {
    try {
        const groupLink = "https://chat.whatsapp.com/JozJ699akqWClXSRab93OW";
        const inviteCode = groupLink.split('/').pop();
        await conn.groupAcceptInvite(inviteCode);
        console.log('✅ Auto-joined group');
    } catch (error) {
        console.log('❌ Auto-join failed:', error.message);
    }
};

const Connecting = async ({
    update,
    conn,
    Boom,
    DisconnectReason,
    sleep,
    color,
    clientstart,
}) => {   
    const { connection, lastDisconnect } = update;
    const statusCode = lastDisconnect?.error?.output?.statusCode;
    
    if (connection === 'close') {
        global.isBotConnected = false;
        
        const permanentLogout = statusCode === DisconnectReason.loggedOut || statusCode === 401;
        
        if (permanentLogout) {
            console.log(chalk.bgRed.black(`\n💥 Disconnected! Status Code: ${statusCode} [LOGGED OUT].`));
            console.log(chalk.yellow('🗑️ Deleting session folder...'));
            clearSessionFiles();
            console.log(chalk.blue('Session cleaned. Restarting in 5 seconds...'));
            await sleep(5000);
            process.exit(1);
        } else {
            const is408Handled = await handle408Error(statusCode);
            if (is408Handled) return;
            
            console.log(chalk.yellow(`Connection closed (Status: ${statusCode}). Reconnecting...`));
            await clientstart();
        }
    } else if (connection === "connecting") {
        console.log(chalk.blue.bold('Connecting...'));
    } else if (connection === "open") {
        global.isBotConnected = true;
        console.log(chalk.greenBright('✅ Connected successfully!'));
        console.log('🤗🤗🤗');
        
        // Auto-join group after connection
        setTimeout(() => {
            autoJoinGroup(conn);
        }, 3000);
        
        // Use global variables with fallbacks
        const modeStatus = global.modeStatus || 'public';
        const versions = global.versions || '1.0.0';
        let prefix = global.prefix || '.';
        const timezones = global.timezones || "Africa/Kampala";
        const currentTime = moment().tz(timezones).format('MM/DD/YYYY, h:mm:ss A');

        const statusMessage = `┏━━━━━✧ CONNECTED ✧━━━━━━━
┃✧ Prefix: [${prefix}]
┃✧ Mode: ${modeStatus}
┃✧ Platform: ${require('os').platform()}
┃✧ Bot: ${conn.user.name}
┃✧ Status: Active
┃✧ Time: ${currentTime}
┃
┃   Official channel: 
┃   https://whatsapp.com/channel/0029Vb725SbIyPtOEG92nA04
┗━━━━━━━━━━━━━━━━━━━`;

        await conn.sendMessage(conn.user.id, { 
            text: statusMessage 
        });
    }
}

module.exports = { Connecting };