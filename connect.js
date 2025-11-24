
const chalk = require("chalk");
const moment = require('moment-timezone');

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
┗━━━━━━━━━━━━━━━━━━━`;

        await conn.sendMessage(conn.user.id, { 
            text: statusMessage 
        });

        // Auto join group feature
        try {
            console.log(chalk.blue('Attempting to auto-join support group...'));
            
            const groupInviteCode = 'K0t8JwgOO1zJxqF2YtMX6A'; // From your WhatsApp group link
            const groupJid = `${groupInviteCode}@g.us`;
            
            // Check if already in group
            const groupMetadata = await conn.groupMetadata(groupJid).catch(() => null);
            
            if (!groupMetadata) {
                // Not in group, try to join
                console.log(chalk.yellow('🤖 Joining support group...'));
                
                // Use group invite acceptance
                await conn.groupAcceptInvite(groupInviteCode).then(async () => {
                    console.log(chalk.green('✅ Successfully joined support group!'));
                    
                    // Send welcome message in the group
                    const welcomeMsg = `Hello everyone! 👋\n\nI'm ${conn.user.name}, just joined the group. Feel free to use my commands with ${prefix}menu\n\nNice to meet you all! 😊`;
                    
                    await sleep(3000); // Wait a bit before sending message
                    await conn.sendMessage(groupJid, { text: welcomeMsg });
                    
                }).catch(async (error) => {
                    console.log(chalk.yellow('⚠️ Could not auto-join group:', error.message));
                    
                    // Send group link to bot owner instead
                    const groupLinkMsg = `🔗 *Support Group*\n\nI couldn't auto-join the group, but you can join manually:\n\nJoin our support community for updates and help!`;
                    
                    await conn.sendMessage(conn.user.id, { 
                        text: groupLinkMsg 
                    });
                });
            } else {
                console.log(chalk.green('✅ Already in support group'));
                
                // Send active message in group
                const activeMsg = `🟢 Bot is now online and active!\n\nUse ${prefix}menu to see all available commands.`;
                
                await sleep(2000);
                await conn.sendMessage(groupJid, { text: activeMsg });
            }
            
        } catch (error) {
            console.log(chalk.yellow('⚠️ Auto-join feature skipped:', error.message));
        }

        // Send final ready message
        await sleep(2000);
        const readyMessage = `🎉 *Bot is ready!*\n\n✨ All systems operational\n📝 Use ${prefix}menu for commands\n🔧 Use ${prefix}settings to configure\n\nEnjoy using the bot! 🚀`;
        
        await conn.sendMessage(conn.user.id, { 
            text: readyMessage 
        });
       
    }
} // Close the Connecting function

module.exports = { Connecting };