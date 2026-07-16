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

async function handlePromote(conn, groupId, actor, promotedJid, botNumber) {
    try {
        // Check if antipromote is enabled for this group
        const enabled = await db.getGroupSetting(botNumber, groupId, 'antipromote', false);
        if (!enabled) return;

        // Skip bot's own corrective actions
        if (botCorrecting.has(promotedJid)) return;

        const action = await db.getGroupSetting(botNumber, groupId, 'antipromoteaction', 'revert');
        const actorNum = actor ? actor.split('@')[0] : 'Unknown';
        const targetNum = promotedJid ? promotedJid.split('@')[0] : 'Unknown';
        const timestamp = new Date().toLocaleString();

        markCorrecting(promotedJid);
        if (actor) markCorrecting(actor);

        let actionLine = '';
        const botJid = conn.user.id;

        if (action === 'revert') {
            const targets = excludeBot([promotedJid], botJid);
            if (targets.length) {
                await conn.groupParticipantsUpdate(groupId, targets, 'demote');
            }
            actionLine = `🔄 *Action:* Promotion reversed — member demoted back`;

        } else if (action === 'kick') {
            const toKick = excludeBot([promotedJid, actor], botJid);
            if (toKick.length) {
                await conn.groupParticipantsUpdate(groupId, toKick, 'remove');
            }
            actionLine = `🚫 *Action:* Both parties kicked from the group`;

        } else if (action === 'demote') {
            const toAct = excludeBot([promotedJid, actor], botJid);
            if (toAct.length) {
                await conn.groupParticipantsUpdate(groupId, toAct, 'demote');
            }
            actionLine = `⬇️ *Action:* Promoted member reverted + promoter demoted`;
        }

        await conn.sendMessage(groupId, {
            text: `⚠️ *Security Alert — AntiPromote*\n\n` +
                  `An unauthorized promotion was detected and actioned.\n\n` +
                  `👤 *Promoter:* @${actorNum}\n` +
                  `🎯 *Promoted:* @${targetNum}\n` +
                  `⏰ *Time:* ${timestamp}\n` +
                  `${actionLine}\n\n` +
                  `> Powered by Jexploit`,
            mentions: [actor, promotedJid].filter(Boolean)
        });

    } catch (err) {
        console.error('[AntiPromote] Error:', err.message);
    }
}

module.exports = {
    handlePromote,
    markCorrecting,
    botCorrecting
};