// ============================================================
//  ULTRA X PROJECT — by TrashX
//  command.js  |  Stripped command dispatcher
// ============================================================

const { plugins }           = require('./pluginStore');
const { getSetting }        = require('./database');
const { jidNormalizedUser } = require('@trashcore/baileys');

function normalizeNumber(jid) {
  return jid ? jid.split('@')[0].split(':')[0] : '';
}

async function handleMessage(trashcore, m) {
  if (!m || !m.message) return;

  const chatId   = m.key.remoteJid;
  const isGroup  = chatId.endsWith('@g.us');
  const isFromMe = m.key.fromMe === true;

  if (isFromMe && isGroup) return;

  const senderJid    = m.key.participant || chatId;
  const senderNumber = normalizeNumber(senderJid);
  const botNumber    = normalizeNumber(trashcore.user.id);
  const isOwner      = senderNumber === botNumber;

  const text =
    m.message?.conversation ||
    m.message?.extendedTextMessage?.text ||
    m.message?.imageMessage?.caption ||
    m.message?.videoMessage?.caption ||
    m.message?.documentMessage?.caption ||
    m.message?.buttonsResponseMessage?.selectedButtonId ||
    m.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
    m.message?.templateButtonReplyMessage?.selectedId ||
    '';

  if (!text) return;

  const prefix = getSetting('prefix', '.');
  if (!text.startsWith(prefix)) return;

  const args    = text.slice(prefix.length).trim().split(/\s+/);
  const command = args.shift().toLowerCase();

  const plugin = plugins.get(command);
  if (!plugin) return;

  // ── group metadata ───────────────────────────────────────────
  let metadata   = {};
  let isAdmin    = false;
  let isBotAdmin = false;

  if (isGroup) {
    try {
      metadata = global.getGroupMeta
        ? await global.getGroupMeta(trashcore, chatId)
        : await trashcore.groupMetadata(chatId).catch(() => ({}));

      if (metadata?.participants) {
        const toBare     = jid => jidNormalizedUser(jid).split('@')[0];
        const senderBare = toBare(senderJid);
        const botBare    = toBare(trashcore.user.id);

        const adminCheck = metadata.participants.find(p => toBare(p.id) === senderBare);
        isAdmin = adminCheck?.admin === 'admin' || adminCheck?.admin === 'superadmin' || false;

        const botCheck = metadata.participants.find(p => toBare(p.id) === botBare);
        isBotAdmin = botCheck?.admin === 'admin' || botCheck?.admin === 'superadmin' || false;
      }
    } catch {}
  }

  // ── quoted message ───────────────────────────────────────────
  m.quoted = null;
  const contextInfo = m.message?.extendedTextMessage?.contextInfo;
  if (contextInfo?.quotedMessage) {
    m.quoted = {
      message: contextInfo.quotedMessage,
      key: {
        remoteJid:   chatId,
        fromMe:      jidNormalizedUser(contextInfo.participant) === jidNormalizedUser(trashcore.user.id),
        id:          contextInfo.stanzaId,
        participant: contextInfo.participant
      },
      fromMe: jidNormalizedUser(contextInfo.participant) === jidNormalizedUser(trashcore.user.id)
    };
  }

  // ── private mode check ───────────────────────────────────────
  const privateMode = getSetting('privateMode', false);
  if (privateMode && !isOwner) return;

  // ── reply helper ─────────────────────────────────────────────
  const xreply = async (replyText) => {
    await trashcore.sendMessage(chatId, { text: String(replyText) }, { quoted: m });
  };

  // ── dispatch ─────────────────────────────────────────────────
  try {
    await plugin.run({
      trashcore, m, args,
      text:       args.join(' '),
      command,
      sender:     senderNumber,
      senderJid,
      chat:       chatId,
      isGroup,
      isSelf:     isOwner,
      isOwner,
      isAdmin,
      isBotAdmin,
      metadata,
      xreply,
    });
  } catch (err) {
    console.error(`❌ Plugin error [${command}]:`, err.message);
  }
}

module.exports = handleMessage;
