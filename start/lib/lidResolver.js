/*
 * LID-aware identity resolution
 * ------------------------------
 * WhatsApp now often addresses a group participant with an opaque "@lid"
 * id instead of their real "@s.whatsapp.net" phone-number JID (rolled out
 * for privacy). When that happens, naive string comparisons like
 *   ownerList.includes(m.sender)
 * silently break, because m.sender holds a lid value that will never equal
 * a phone number in your owner list.
 *
 * This module resolves between the two forms wherever WhatsApp/Baileys
 * gives us enough information to do so (group metadata's phoneNumber/lid
 * fields, the participantPn/senderPn hints Baileys attaches to messages,
 * or Baileys' own internal lid<->number store), and exposes a single
 * enrichMessage() helper that sets m.sender/m.participant (preferring the
 * real number when resolvable), plus m.lid, m.senderLid, m.senderPn,
 * m.participantLid, m.participantPn, m.isOwner, m.isAdmin, m.isBotAdmin
 * and m.botNumber on every incoming message. This mirrors the identity
 * resolution approach used by Katsumi.
 */

const { jidNormalizedUser } = require('@whiskeysockets/baileys');

const isLidJid = (jid) => typeof jid === 'string' && /@lid$|@hosted\.lid$/.test(jid);

const normJid = (jid) => {
    if (!jid || typeof jid !== 'string') return jid;
    try {
        return jidNormalizedUser(jid) || jid;
    } catch (_) {
        return jid;
    }
};

// Pulls the digit run out of a jid/number so "123@s.whatsapp.net",
// "123:5@s.whatsapp.net" and "+123" all compare equal. Mirrors an 8+
// digit minimum so we never accidentally match on a short id fragment.
const extractDigits = (jid) => {
    if (!jid) return null;
    const match = String(jid).match(/\d{8,}/);
    return match ? match[0] : null;
};

/**
 * Build a bidirectional lid <-> phone-number map from a group's
 * participants. Baileys exposes each participant's real number
 * (phoneNumber) alongside the per-group "id" it uses for addressing,
 * plus (when known) an explicit lid field.
 */
function buildIdentityMap(participants = []) {
    const lidToPn = {};
    const pnToLid = {};

    for (const p of participants || []) {
        if (!p) continue;
        const id = p.id ? normJid(p.id) : null;
        const pn = p.phoneNumber ? normJid(p.phoneNumber) : null;
        const lid = p.lid ? normJid(p.lid) : null;

        if (!id) continue;

        if (isLidJid(id)) {
            if (pn && !isLidJid(pn)) {
                lidToPn[id] = pn;
                pnToLid[pn] = id;
            }
        } else if (lid && isLidJid(lid)) {
            pnToLid[id] = lid;
            lidToPn[lid] = id;
        }
    }

    return { lidToPn, pnToLid };
}

/** Resolve a jid to its real phone-number form when possible. */
async function resolveToPn(conn, idMap, jid, hint) {
    jid = normJid(jid);
    hint = normJid(hint);

    if (!jid || !isLidJid(jid)) return jid;
    if (hint && !isLidJid(hint)) return hint;

    const fromMap = idMap?.lidToPn?.[jid];
    if (fromMap) return fromMap;

    try {
        if (typeof conn?.getJidFromLid === 'function') {
            const resolved = await conn.getJidFromLid(jid);
            if (resolved) return normJid(resolved);
        }
    } catch (_) {}

    try {
        const lidStore = conn?.signalRepository?.lidMapping;
        if (lidStore?.getPNForLID) {
            const pn = await lidStore.getPNForLID(jid);
            if (pn) return normJid(pn);
        }
    } catch (_) {}

    return jid;
}

/** Resolve a jid to its @lid form when possible. */
async function resolveToLid(conn, idMap, jid, hint) {
    jid = normJid(jid);
    hint = normJid(hint);

    if (!jid || isLidJid(jid)) return jid;
    if (hint && isLidJid(hint)) return hint;

    const fromMap = idMap?.pnToLid?.[jid];
    if (fromMap) return fromMap;

    try {
        const lidStore = conn?.signalRepository?.lidMapping;
        if (lidStore?.getLIDForPN) {
            const lid = await lidStore.getLIDForPN(jid);
            if (lid) return normJid(lid);
        }
    } catch (_) {}

    return jid;
}

/**
 * Digit-based membership check, so it doesn't matter whether `list` holds
 * "2567...@s.whatsapp.net", a bare "2567..." number, or a raw @lid fallback
 * entry someone hardcoded in - exact matches are also still honoured.
 */
function matchesList(jid, list = []) {
    if (!jid || !Array.isArray(list) || !list.length) return false;
    if (list.includes(jid)) return true;
    const digits = extractDigits(jid);
    if (!digits) return false;
    return list.some((entry) => entry && extractDigits(entry) === digits);
}

/**
 * Enrich a serialized message (the output of smsg) with LID-aware
 * sender/participant resolution plus isOwner / isAdmin / isBotAdmin /
 * botNumber. Safe to call on every incoming message - lookup failures are
 * swallowed so a resolution problem never breaks message handling.
 *
 * @param {object} conn Baileys socket connection
 * @param {object} m Serialized message (output of smsg), mutated in place
 * @param {object} mek Raw message (carries the original .key with any
 *   participantPn/senderPn hints Baileys attached)
 * @param {object} [opts]
 * @param {string[]} [opts.extraOwners] Extra owner jids/numbers to trust
 *   (e.g. DEV_JIDS, data/owner.json's list) on top of global.owner/global.sudo
 * @param {string} [opts.botNumber] Pre-computed botNumber (conn.decodeJid
 *   form) so it stays byte-identical to whatever the rest of the bot uses
 *   as a database key
 * @returns {Promise<object>} the same m
 */
async function enrichMessage(conn, m, mek, opts = {}) {
    const extraOwners = opts.extraOwners || [];
    let botNumber = opts.botNumber;
    if (!botNumber) {
        try {
            botNumber = (conn.decodeJid ? conn.decodeJid(conn.user?.id) : normJid(conn.user?.id)) || 'default';
        } catch (_) {
            botNumber = 'default';
        }
    }

    m.botNumber = botNumber;
    m.isGroup = (m.chat || mek?.key?.remoteJid || '').endsWith('@g.us');

    let idMap = { lidToPn: {}, pnToLid: {} };

    if (m.isGroup) {
        try {
            const fresh = await conn.groupMetadata(m.chat).catch(() => null);
            m.metadata = fresh || m.metadata || {};
        } catch (_) {
            m.metadata = m.metadata || {};
        }
        idMap = buildIdentityMap(m.metadata?.participants);
    } else {
        m.metadata = m.metadata || {};
    }

    // ---- sender identity ----
    const rawSender = m.fromMe
        ? conn.user?.id
        : (mek?.key?.participant || m.participant || m.key?.participant || m.chat);
    const senderHint = mek?.key?.participantPn || mek?.key?.senderPn || '';

    m.senderLid = isLidJid(rawSender) ? normJid(rawSender) : await resolveToLid(conn, idMap, rawSender);
    m.senderPn = await resolveToPn(conn, idMap, rawSender, senderHint);
    m.sender = (m.senderPn && !isLidJid(m.senderPn)) ? m.senderPn : (m.senderLid || normJid(rawSender) || m.sender || '');
    // Only expose m.lid when we actually resolved (or already had) a real
    // @lid value - resolveToLid() falls back to returning the input
    // unchanged when no mapping exists, so senderLid isn't always a lid.
    m.lid = isLidJid(m.senderLid) ? m.senderLid : (isLidJid(m.sender) ? m.sender : null);

    // ---- participant identity (group messages only) ----
    if (m.isGroup) {
        const rawParticipant = mek?.key?.participant || m.key?.participant || '';
        const participantHint = mek?.key?.participantPn || '';
        m.participantLid = isLidJid(rawParticipant) ? normJid(rawParticipant) : await resolveToLid(conn, idMap, rawParticipant);
        m.participantPn = await resolveToPn(conn, idMap, rawParticipant, participantHint);
        m.participant = (m.participantPn && !isLidJid(m.participantPn))
            ? m.participantPn
            : (m.participantLid || normJid(rawParticipant) || '');
    }

    // ---- admins (resolved to real numbers wherever the group tells us) ----
    const admins = [];
    if (m.isGroup && m.metadata?.participants) {
        for (const p of m.metadata.participants) {
            if (!p || !p.admin) continue;
            const resolvedPn = p.phoneNumber
                ? normJid(p.phoneNumber)
                : (p.id && !isLidJid(p.id) ? normJid(p.id) : null);
            admins.push(resolvedPn || normJid(p.id) || normJid(p.lid) || normJid(p.jid));
        }
    }
    m.admins = admins.filter(Boolean);

    const senderDigits = extractDigits(m.senderPn || m.sender);
    m.isAdmin = m.isGroup && !!senderDigits && m.admins.some((a) => extractDigits(a) === senderDigits);

    const botPn = await resolveToPn(conn, idMap, botNumber);
    const botDigits = extractDigits(botPn) || extractDigits(botNumber);
    m.isBotAdmin = m.isGroup && !!botDigits && m.admins.some((a) => extractDigits(a) === botDigits);

    // ---- owner ----
    const ownerPool = [
        ...(Array.isArray(global.owner) ? global.owner : []),
        ...(Array.isArray(global.sudo) ? global.sudo : []),
        ...extraOwners,
        botNumber,
    ].filter(Boolean);

    m.isOwner = !!m.fromMe
        || matchesList(m.senderPn || m.sender, ownerPool)
        || matchesList(m.senderLid, ownerPool);

    return m;
}

module.exports = {
    isLidJid,
    normJid,
    extractDigits,
    buildIdentityMap,
    resolveToPn,
    resolveToLid,
    matchesList,
    enrichMessage,
};
