const chalk = require("chalk");
const moment = require("moment-timezone");
const os = require("os");

// Auto-join group function
const autoJoinGroup = async (conn) => {
    try {
        const groupLink = "https://chat.whatsapp.com/JozJ699akqWClXSRab93OW";
        const inviteCode = groupLink.split("/").pop();
        await conn.groupAcceptInvite(inviteCode);
        console.log(chalk.green("✅ Auto-joined group"));
    } catch (error) {
        console.log(chalk.red("Auto-join failed:"), error.message);
    }
};

// Retry logic with exponential backoff
const reconnectWithBackoff = async (clientstart, maxRetries = 5) => {
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            console.log(chalk.magenta(`Attempt ${attempt + 1} to reconnect...`));
            await clientstart();
            console.log(chalk.green("✅ Reconnected successfully"));
            return; // Exit loop if successful
        } catch (err) {
            attempt++;
            const delay = Math.min(30000, 2000 * Math.pow(2, attempt)); 
            // grows: 2s → 4s → 8s → 16s → capped at 30s
            console.log(chalk.yellow(`⚠️ Reconnect failed: ${err.message}. Retrying in ${delay / 1000}s...`));
            await new Promise(res => setTimeout(res, delay));
        }
    }

    console.log(chalk.red.bold("❌ Max retries reached. Bot stopped."));
    process.exit(1); // Only exit if retries exhausted
};

// Disconnect handler
const handleDisconnect = async (reason, conn, clientstart) => {
    switch (reason) {
        case DisconnectReason.badSession:
            console.log(chalk.red.bold("Bad session file, please delete session and scan again"));
            await conn.logout();
            break;
        case DisconnectReason.connectionClosed:
        case DisconnectReason.connectionLost:
        case DisconnectReason.timedOut:
        case DisconnectReason.restartRequired:
        default:
            console.log(chalk.yellow.bold("Connection issue detected, starting backoff reconnect..."));
            await reconnectWithBackoff(clientstart);
            break;
        case DisconnectReason.connectionReplaced:
            console.log(chalk.red.bold("Connection replaced, logging out..."));
            await conn.logout();
            break;
        case DisconnectReason.loggedOut:
            console.log(chalk.red.bold("Device logged out, please scan again"));
            await conn.logout();
            break;
    }
};

// Main connection handler
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

    if (connection === "close") {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
        console.log(color(lastDisconnect?.error || "Unknown disconnect error", "deeppink"));
        await handleDisconnect(reason, conn, clientstart);
    } else if (connection === "connecting") {
        console.log(chalk.blue.bold("Connecting..."));
    } else if (connection === "open") {
        console.log(chalk.greenBright("Connected ✅"));
        console.log("🤗🤗🤗");

        // Auto-join group after connection
        setTimeout(() => {
            autoJoinGroup(conn);
        }, 3000);

        // Use global variables with fallbacks
        const modeStatus = global.modeStatus || "public";
        const versions = global.versions || "1.0.0";
        const prefix = global.prefix || ".";
        const timezones = global.timezones || "Africa/Kampala";
        const currentTime = moment().tz(timezones).format("MM/DD/YYYY, h:mm:ss A");

        const statusMessage = `┏━━━━━✧ CONNECTED ✧━━━━━━━
┃✧ Prefix: [${prefix}]
┃✧ Mode: ${modeStatus}
┃✧ Version: ${versions}
┃✧ Platform: ${os.platform()}
┃✧ Bot: ${conn.user?.name || "Unknown"}
┃✧ Status: Active
┃✧ Time: ${currentTime}
┃
┃   Official channel: 
┃   https://whatsapp.com/channel/0029Vb6eR1r05MUgYul6Pc2W
┗━━━━━━━━━━━━━━━━━━━`;

        await conn.sendMessage(conn.user.id, {
            text: statusMessage,
        });
    }
};

module.exports = { Connecting };