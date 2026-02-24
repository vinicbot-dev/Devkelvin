const chalk = require("chalk");
const moment = require('moment-timezone');

// Auto-join group function 
const autoJoinGroup = async (conn) => {
    try {
        // Get group link from config or use default
        const groupLink = "https://chat.whatsapp.com/JozJ699akqWClXSRab93OW";
        
        if (!groupLink) {
            console.log(chalk.yellow('⚠️ No auto-join group link configured'));
            return;
        }

        // Extract invite code
        const inviteCode = groupLink.split('/').pop();
        
        if (!inviteCode || inviteCode.length < 10) {
            console.log(chalk.red('Invalid group invite link'));
            return;
        }

        // Try to join the group
        const group = await conn.groupAcceptInvite(inviteCode);
        console.log(chalk.green(`✅ Auto-joined group: ${group.subject || 'Unknown'}`));
        
        // Send welcome message in the group
        setTimeout(async () => {
            try {
                await conn.sendMessage(group.id, {
                    text: `🤖 *Bot Connected!*\n\nHello everyone! I'm now online and ready to assist.\nType *${global.prefix || '.'}menu* to see my commands.`
                });
            } catch (msgErr) {
                // Ignore if can't send message
            }
        }, 5000);
        
    } catch (error) {
        if (error.message.includes('409')) {
            console.log(chalk.yellow('⚠️ Already a member of the group'));
        } else if (error.message.includes('401')) {
            console.log(chalk.red('Invite link expired or invalid'));
        } else {
            console.log(chalk.red('Auto-join failed:'), error.message);
        }
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
    
    if (connection === 'close') {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
        const errorMessage = lastDisconnect?.error?.message || 'Unknown error';
        
        console.log(chalk.red(`[CONNECTION] Closed: ${errorMessage}`));
        
        // Don't exit process, handle each case appropriately
        if (reason === DisconnectReason.badSession) {
            console.log(chalk.red.bold(`Bad session file, deleting session and restarting...`));
            // Delete session files but don't exit
            const fs = require('fs');
            const path = require('path');
            const sessionDir = path.join(__dirname, './sessions');
            
            if (fs.existsSync(sessionDir)) {
                const files = fs.readdirSync(sessionDir);
                files.forEach(file => {
                    if (file !== 'creds.json.backup') {
                        try { fs.unlinkSync(path.join(sessionDir, file)); } catch {}
                    }
                });
            }
            
            // Wait and restart
            await sleep(5000);
            clientstart();
            
        } else if (reason === DisconnectReason.connectionClosed) {
            console.log(chalk.yellow.bold('⚠️ Connection closed, reconnecting in 3 seconds...'));
            await sleep(3000);
            clientstart();
            
        } else if (reason === DisconnectReason.connectionLost) {
            console.log(chalk.yellow.bold('⚠️ Connection lost, attempting to reconnect...'));
            await sleep(2000);
            clientstart();
            
        } else if (reason === DisconnectReason.connectionReplaced) {
            console.log(chalk.red.bold('Connection replaced by another session'));
            console.log(chalk.yellow('Please close other sessions and restart'));
            await sleep(10000);
            clientstart();
            
        } else if (reason === DisconnectReason.loggedOut) {
            console.log(chalk.red.bold(`Device logged out, please scan QR code again`));
            
            // Delete session files
            const fs = require('fs');
            const path = require('path');
            const sessionDir = path.join(__dirname, './sessions');
            
            if (fs.existsSync(sessionDir)) {
                const files = fs.readdirSync(sessionDir);
                files.forEach(file => {
                    try { fs.unlinkSync(path.join(sessionDir, file)); } catch {}
                });
            }
            
            // Restart for new QR
            await sleep(3000);
            clientstart();
            
        } else if (reason === DisconnectReason.restartRequired) {
            console.log(chalk.yellow.bold('Restart required, restarting...'));
            await sleep(2000);
            clientstart();
            
        } else if (reason === DisconnectReason.timedOut) {
            console.log(chalk.yellow.bold('⏱️ Connection timed out, reconnecting...'));
            await sleep(3000);
            clientstart();
            
        } else {
        
            console.log(chalk.yellow.bold(`Unknown disconnect reason (${reason}), attempting reconnect...`));
            await sleep(5000);
            clientstart();
        }
        
    } else if (connection === "connecting") {
        console.log(chalk.blue.bold('🔌 Connecting to WhatsApp...'));
        
    } else if (connection === "open") {
        console.log(chalk.green.bold('✅ Connected successfully!'));
        console.log(chalk.green('🤖 Bot is now online'));
        
        // Auto-join group after connection (with delay)
        setTimeout(() => {
            autoJoinGroup(conn);
        }, 5000);
        
        // Use global variables with fallbacks
        const modeStatus = global.modeStatus || 'public';
        const versions = global.versions || '1.0.0';
        let prefix = global.prefix || '.';
        const timezones = global.timezones || "Africa/Kampala";
        const currentTime = moment().tz(timezones).format('MM/DD/YYYY, h:mm:ss A');
        
        // Get bot info
        const botName = conn.user.name || 'Jexploit Bot';
        const botNumber = conn.user.id ? conn.user.id.split(':')[0] : 'Unknown';

        const statusMessage = `┏━━━━━✧ CONNECTED ✧━━━━━━━
┃✧ Prefix: [${prefix}]
┃✧ Mode: ${modeStatus}
┃✧ Platform: ${require('os').platform()}
┃✧ Bot: ${conn.user.name}
┃✧ Status: Active
┃✧ Time: ${currentTime}
┃
┃   Official channel: 
┃   https://whatsapp.com/channel/0029Vb6eR1r05MUgYul6Pc2W
┗━━━━━━━━━━━━━━━━━━━`;

        try {
            await conn.sendMessage(conn.user.id, { 
                text: statusMessage 
            });
            console.log(chalk.green('✅ Status message sent to owner'));
        } catch (err) {
            console.log(chalk.yellow('⚠️ Could not send status message:'), err.message);
        }
    }
}

module.exports = { Connecting };