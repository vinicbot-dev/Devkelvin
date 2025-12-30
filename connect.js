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
    
    try {
        if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
            if (lastDisconnect.error.output.statusCode === DisconnectReason.loggedOut) {
                console.log(chalk.red.bold("Logged out. Please link again."));
                // Add clientstart() to try reconnecting
                await clientstart();
            } else if (lastDisconnect.error.output.statusCode === DisconnectReason.badSession) {
                console.log(chalk.red.bold("Bad session. Log out and link again."));
                
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
┃
┃   Official channel: 
┃   https://whatsapp.com/channel/0029Vb725SbIyPtOEG92nA04
┗━━━━━━━━━━━━━━━━━━━`;

            await conn.sendMessage(conn.user.id, { 
                text: statusMessage 
            });
        }
    } catch (error) {
        console.log(chalk.red.bold('Error in connection handler:', error.message));
    }
}

module.exports = { Connecting };