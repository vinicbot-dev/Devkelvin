/*Kelvin Tech*/

const db = require('../../start/Core/databaseManager');

// Store corrective actions to prevent loops
const botCorrecting = new Set();

function markCorrecting(jid) {
    botCorrecting.add(jid);
    setTimeout(() => botCorrecting.delete(jid), 6000);
}

function excludeBot(jids, botJid) {
    if (!jids || !Array.isArray(jids)) return [];
    const botNum = botJid ? (botJid.includes(':') ? botJid.split(':')[0] : botJid.split('@')[0]) : '';
    return jids.filter(j => {
        if (!j) return false;
        const num = j.split(':')[0].split('@')[0];
        return num !== botNum && j !== botJid;
    });
}

async function handleDemote(conn, groupId, actor, demotedJid, botNumber) {
    try {
        // Check if antidemote is enabled for this group
        const enabled = await db.getGroupSetting(botNumber, groupId, 'antidemote', false);
        if (!enabled) return;

        // Skip bot's own corrective actions
        if (botCorrecting.has(demotedJid)) return;

        const action = await db.getGroupSetting(botNumber, groupId, 'antidemoteaction', 'revert');
        const actorNum = actor ? actor.split('@')[0] : 'Unknown';
        const targetNum = demotedJid ? demotedJid.split('@')[0] : 'Unknown';
        const timestamp = new Date().toLocaleString();

        markCorrecting(demotedJid);
        if (actor) markCorrecting(actor);

        let actionLine = '';
        const botJid = conn.user.id;

        if (action === 'revert') {
            const targets = excludeBot([demotedJid], botJid);
            if (targets.length) {
                await conn.groupParticipantsUpdate(groupId, targets, 'promote');
            }
            actionLine = `🔄 *Action:* Demotion reversed — admin restored`;

        } else if (action === 'kick') {
            const toKick = excludeBot([demotedJid, actor], botJid);
            if (toKick.length) {
                await conn.groupParticipantsUpdate(groupId, toKick, 'remove');
            }
            actionLine = `🚫 *Action:* Both parties kicked from the group`;

        } else if (action === 'demote') {
            const toAct = excludeBot([actor], botJid);
            if (toAct.length) {
                await conn.groupParticipantsUpdate(groupId, toAct, 'demote');
            }
            actionLine = `⬇️ *Action:* Demoter demoted to regular member`;
        }

        await conn.sendMessage(groupId, {
            text: `⚠️ *Security Alert — AntiDemote*\n\n` +
                  `An unauthorized demotion was detected and actioned.\n\n` +
                  `👤 *Demoter:* @${actorNum}\n` +
                  `🎯 *Demoted:* @${targetNum}\n` +
                  `⏰ *Time:* ${timestamp}\n` +
                  `${actionLine}\n\n` +
                  `> Powered by Jexploit`,
            mentions: [actor, demotedJid].filter(Boolean)
        });

    } catch (err) {
        console.error('[AntiDemote] Error:', err.message);
    }
}

module.exports = {
    handleDemote,
    markCorrecting,
    botCorrecting
};