const chalk = require("chalk");

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
            process.exit();
        } else if (reason === DisconnectReason.badSession) {
            console.log(chalk.red.bold(`bad session file, please delete session and scan again`));
            process.exit();
        } else if (reason === DisconnectReason.connectionClosed) {
            console.log(chalk.red.bold('connection closed, reconnecting...'));
            process.exit();
        } else if (reason === DisconnectReason.connectionLost) {
            console.log(chalk.red.bold('connection lost, trying to reconnect'));
            process.exit();
        } else if (reason === DisconnectReason.connectionReplaced) {
            console.log(chalk.red.bold('connection replaced, another new session opened, please close current session first'));
            conn.logout();
        } else if (reason === DisconnectReason.loggedOut) {
            console.log(chalk.red.bold(`device logged out, please scan again and run.`));
            conn.logout();
        } else if (reason === DisconnectReason.restartRequired) {
            console.log(chalk.yellow.bold('restart required,restarting...'));
            await clientstart();
        } else if (reason === DisconnectReason.timedOut) {
            console.log(chalk.yellow.bold('connection timedOut, reconnecting...'));
            clientstart();
        }
    } else if (connection === "connecting") {
        console.log(chalk.blue.bold('Connecting. . .'));
    } else if (connection === "open") {
        console.log(chalk.greenBright('connected'));
        console.log('🤗🤗🤗')
        
        // Use global variables with fallbacks
        const modeStatus = global.modeStatus || 'public';
        const versions = global.versions || '1.0.0';
        
        await conn.sendMessage(conn.user.id, { 
            text: `✦◈✦ VINIC-XMD ✦◈✦
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
• Bot Name: ${conn.user.name}
• System: ${require('os').platform()}
• Prefix: ${global.prefix}
• Mode: ${modeStatus}
• Version: ${versions}
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
Join our channel for updates:
🔗 wa.me/channel/0029Vb6eR1r05MUgYul6Pc2W
✦◈✦◈✦◈✦◈✦◈✦◈✦◈✦◈✦`
        });

        // Auto join group when connected
        try {
            const groupInvite = 'https://chat.whatsapp.com/Lpg0aGi5Ar4Iy9Ix2wHgnN';
            await conn.groupAcceptInvite('Lpg0aGi5Ar4Iy9Ix2wHgnN');
            console.log(chalk.green.bold('✅ Successfully joined the group automatically!'));
        } catch (error) {
            console.log(chalk.yellow.bold('⚠️ Could not auto-join group, but bot is running normally'));
        }
    }
} // Close the Connecting function

module.exports = { Connecting };
