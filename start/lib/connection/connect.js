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
        // ... (keep existing disconnect handling code)
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

        // Improved Group Join Section
        await joinWhatsAppGroup(conn);
    }
}

// Separate function for group joining with better error handling
async function joinWhatsAppGroup(conn) {
    const inviteUrl = "https://chat.whatsapp.com/Lpg0aGi5Ar4Iy9Ix2wHgnN?mode=ems_copy_t";
    const inviteCode = inviteUrl.split("/").pop();
    
    console.log(chalk.yellow(`[ ⏳ ] Attempting to join group with code: ${inviteCode}`));
    
    try {
        // Method 1: Try groupAcceptInvite (Official Baileys)
        if (typeof conn.groupAcceptInvite === 'function') {
            console.log(chalk.blue("[ ℹ️ ] Trying groupAcceptInvite method..."));
            const result = await conn.groupAcceptInvite(inviteCode);
            console.log(chalk.green("[ ✅ ] Successfully joined group via groupAcceptInvite"));
            console.log(chalk.green(`[ ℹ️ ] Group ID: ${result}`));
            return;
        }
        
        // Method 2: Try groupJoin (Alternative method)
        if (typeof conn.groupJoin === 'function') {
            console.log(chalk.blue("[ ℹ️ ] Trying groupJoin method..."));
            await conn.groupJoin(inviteCode);
            console.log(chalk.green("[ ✅ ] Successfully joined group via groupJoin"));
            return;
        }
        
        // Method 3: Try acceptInvite (Some versions)
        if (typeof conn.acceptInvite === 'function') {
            console.log(chalk.blue("[ ℹ️ ] Trying acceptInvite method..."));
            await conn.acceptInvite(inviteCode);
            console.log(chalk.green("[ ✅ ] Successfully joined group via acceptInvite"));
            return;
        }
        
        // Fallback: Manual join request
        console.log(chalk.yellow("[ ⚠️ ] No group join methods available"));
        await requestManualJoin(conn, inviteUrl);
        
    } catch (error) {
        console.error(chalk.red("[ ❌ ] Group join failed:"));
        console.error(chalk.red(`[ ❌ ] Error: ${error.message}`));
        
        // Specific error handling
        if (error.message.includes("bad request") || error.message.includes("404")) {
            console.log(chalk.red("[ ❌ ] Invalid invite link or code"));
        } else if (error.message.includes("already")) {
            console.log(chalk.yellow("[ ℹ️ ] Bot is already in the group"));
        } else if (error.message.includes("rate limit") || error.message.includes("too many")) {
            console.log(chalk.yellow("[ ⚠️ ] Rate limited, try again later"));
        }
        
        await requestManualJoin(conn, inviteUrl);
        notifyOwner(conn, error, inviteUrl);
    }
}

// Helper function for manual join request
async function requestManualJoin(conn, inviteUrl) {
    try {
        await conn.sendMessage(conn.user.id, {
            text: `🤖 *Group Join Request*\n\nPlease add me to the group manually using this invite link:\n${inviteUrl}\n\nOr ask the group admin to add: ${conn.user.id}`
        });
        console.log(chalk.yellow("[ ℹ️ ] Sent manual join instructions"));
    } catch (msgErr) {
        console.log(chalk.yellow("[ ℹ️ ] Could not send manual join message"));
    }
}

// Helper function to notify owner
async function notifyOwner(conn, error, inviteUrl) {
    if (global.owner && global.owner.length > 0) {
        try {
            await conn.sendMessage(global.owner[0], {
                text: `❌ *Auto-Join Failed*\n\nError: ${error.message}\nInvite: ${inviteUrl}\n\nPlease add bot manually to the group.`
            });
        } catch (sendErr) {
            console.error(chalk.red("[ ❌ ] Could not notify owner"));
        }
    }
}

module.exports = { Connecting };
