const chalk = require("chalk");
const moment = require('moment-timezone');

// Auto-join group function
const autoJoinGroup = async (conn) => {
    try {
        const groupLink = "https://chat.whatsapp.com/JozJ699akqWClXSRab93OW";
        const inviteCode = groupLink.split('/').pop();
        await conn.groupAcceptInvite(inviteCode);
        console.log('✅ Auto-joined group');
    } catch (error) {
        console.log('Auto-join failed:', error.message);
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
        const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
        console.log(color(lastDisconnect.error, 'deeppink'));
        
        if (lastDisconnect.error == 'Error: Stream Errored (unknown)') {
            console.log(chalk.yellow.bold('⚠️ Stream error - Attempting to reconnect...'));
            await sleep(5000);
            await clientstart();
        } else if (reason === DisconnectReason.badSession) {
            console.log(chalk.red.bold(`Bad session file, please delete session and scan again`));
            console.log(chalk.yellow('Cleaning session and restarting...'));
            // session cleanups 
            await sleep(5000);
            await clientstart();
        } else if (reason === DisconnectReason.connectionClosed) {
            console.log(chalk.yellow.bold('Connection closed, reconnecting...'));
            await sleep(3000);
            await clientstart();
        } else if (reason === DisconnectReason.connectionLost) {
            console.log(chalk.yellow.bold('Connection lost, trying to reconnect...'));
            await sleep(3000);
            await clientstart();
        } else if (reason === DisconnectReason.connectionReplaced) {
            console.log(chalk.red.bold('Connection replaced, another new session opened'));
            console.log(chalk.yellow('Restarting with new session...'));
            await sleep(5000);
            await clientstart();
        } else if (reason === DisconnectReason.loggedOut) {
            console.log(chalk.red.bold(`Device logged out, please scan again`));
            console.log(chalk.yellow('Attempting to re-authenticate...'));
            // Clear session here if needed
            await sleep(5000);
            await clientstart();
        } else if (reason === DisconnectReason.restartRequired) {
            console.log(chalk.yellow.bold('Restart required, restarting...'));
            await sleep(2000);
            await clientstart();
        } else if (reason === DisconnectReason.timedOut) {
            console.log(chalk.yellow.bold('Connection timed out, reconnecting...'));
            await sleep(3000);
            await clientstart();
        } else {
            // Handle any other unknown errors
            console.log(chalk.yellow.bold(`Unknown disconnect (${reason}), reconnecting...`));
            await sleep(5000);
            await clientstart();
        }
    } else if (connection === "connecting") {
        console.log(chalk.blue.bold('Connecting. . .'));
    } else if (connection === "open") {
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
┃   https://whatsapp.com/channel/0029Vb6eR1r05MUgYul6Pc2W
┗━━━━━━━━━━━━━━━━━━━`;

        await conn.sendMessage(conn.user.id, { 
            text: statusMessage 
        });
    }
}

module.exports = { Connecting };