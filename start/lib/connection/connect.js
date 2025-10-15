const ascii = `💢 Vinic-Xmd 💪 its loading...... `;

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
        console.log(`${ascii}`);
        console.log(chalk.blue.bold('Connection Succesfull ✔︎'));
        
        // Use global variables with fallbacks
        const modeStatus = global.modeStatus || 'public';
        const versions = global.versions || '1.0.0';
        
        await conn.sendMessage(conn.user.id, { 
            text: `✦◈✦ VINIC-XMD ✦◈✦
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
• Bot Name: ${conn.user.name}
• System: ${require('os').platform()}
• Prefix: [ . ]
• Mode: ${modeStatus}
• Version: ${versions}
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
Join our channel for updates:
🔗 wa.me/channel/0029Vb6eR1r05MUgYul6Pc2W
✦◈✦◈✦◈✦◈✦◈✦◈✦◈✦◈✦`
        });
        // Auto-join group when connected (with compatibility check)
        const inviteUrl = "https://chat.whatsapp.com/Lpg0aGi5Ar4Iy9Ix2wHgnN?mode=ems_copy_t";
        const inviteCode = "IixDQqcKOuE8eKGHmQqUod"; // Extract code from URL
        
        try {
            console.log(chalk.yellow(`[ ⏳ ] Attempting to join group with code: ${inviteCode}`));
            
            // Check if groupAcceptInvite method exists (official Baileys)
            if (typeof conn.groupAcceptInvite === 'function') {
                const result = await conn.groupAcceptInvite(inviteCode);
                console.log(chalk.green("[ ✅ ] Vinic-Xmd joined the WhatsApp group successfully"));
                console.log(chalk.green(`[ ℹ️ ] Group ID: ${result}`));
            } 
            // Check if alternative group join method exists
            else if (typeof conn.groupJoin === 'function') {
                await conn.groupJoin(inviteCode);
                console.log(chalk.green("[ ✅ ] Vinic-Xmd joined the WhatsApp group using groupJoin method"));
            }
            else {
                console.log(chalk.yellow("[ ⚠️ ] Group join methods not available in this Baileys version"));
                
                // Try manual group join using message to group invite link
                try {
                    await conn.sendMessage(conn.user.id, {
                        text: `Please add me to the group manually using this invite link: ${inviteUrl}`
                    });
                    console.log(chalk.yellow("[ ℹ️ ] Sent group invite link for manual join"));
                } catch (msgErr) {
                    console.log(chalk.yellow("[ ℹ️ ] Group auto-join not supported"));
                }
            }
            
        } catch (err) {
            console.error(chalk.red("[ ❌ ] Failed to join WhatsApp group:"));
            console.error(chalk.red(`[ ❌ ] Error: ${err.message}`));
            
            // Send error notification to bot owner if needed
            if (global.owner && global.owner.length > 0) {
                try {
                    await conn.sendMessage(global.owner[0], {
                        text: `❌ Failed to auto-join group\nError: ${err.message}\nPlease add me manually using: ${inviteUrl}`
                    });
                } catch (sendErr) {
                    console.error(chalk.red("[ ❌ ] Could not send error notification to owner"));
                }
            }
        }
    }
}

module.exports = { Connecting };