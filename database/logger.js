const chalk = require('chalk');

// ─── Unique color palette ─────────────────────────────────────
const C = {
  // DM theme — amber / gold
  dmBar:     chalk.hex('#f9c74f'),
  dmHeader:  chalk.hex('#f9c74f').bold,
  dmLabel:   chalk.hex('#f3722c').bold,        // burnt orange labels
  dmValue:   chalk.hex('#ffe8a1'),             // warm cream values
  dmName:    chalk.hex('#f94144').bold,        // red sender name
  dmMsg:     chalk.hex('#ffffff').bold,        // white message

  // GC theme — mint / lime
  gcBar:     chalk.hex('#43aa8b'),
  gcHeader:  chalk.hex('#43aa8b').bold,
  gcLabel:   chalk.hex('#90be6d').bold,        // lime green labels
  gcValue:   chalk.hex('#dde5b6'),             // pale green values
  gcName:    chalk.hex('#f9c74f').bold,        // gold sender name
  gcGroup:   chalk.hex('#43aa8b').bold,        // mint group name
  gcMsg:     chalk.hex('#ffffff').bold,        // white message

  arrow:     chalk.hex('#f8961e').bold,        // orange arrow
};

// ── EAT timezone (UTC+3) ──────────────────────────────────────
function nowTs() {
  const now  = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));
  const day  = now.toLocaleDateString('en-GB', { weekday: 'long' });
  const date = now.toLocaleDateString('en-GB');
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return { day, date, time, full: `${day}, ${time} EAT` };
}

function hbar(colorFn, char = '─', len = 48) {
  return colorFn(char.repeat(len));
}

// ── Message helpers ───────────────────────────────────────────
function getMsgBody(m) {
  if (m.message?.conversation)              return m.message.conversation;
  if (m.message?.extendedTextMessage?.text) return m.message.extendedTextMessage.text;
  if (m.message?.imageMessage?.caption)     return m.message.imageMessage.caption;
  if (m.message?.videoMessage?.caption)     return m.message.videoMessage.caption;
  if (m.message?.stickerMessage)            return '[Sticker]';
  if (m.message?.audioMessage)              return '[Audio]';
  if (m.message?.documentMessage)           return '[Document]';
  if (m.message?.imageMessage)              return '[Image]';
  if (m.message?.videoMessage)              return '[Video]';
  if (m.message?.reactionMessage)           return `[React: ${m.message.reactionMessage.text}]`;
  return '(empty)';
}

function getMsgType(m) {
  if (m.message?.conversation)        return 'conversation';
  if (m.message?.extendedTextMessage) return 'extendedTextMessage';
  if (m.message?.imageMessage)        return 'imageMessage';
  if (m.message?.videoMessage)        return 'videoMessage';
  if (m.message?.stickerMessage)      return 'stickerMessage';
  if (m.message?.audioMessage)        return 'audioMessage';
  if (m.message?.documentMessage)     return 'documentMessage';
  if (m.message?.reactionMessage)     return 'reactionMessage';
  return 'unknown';
}

// ── DM block ──────────────────────────────────────────────────
function logDM(senderName, senderNum, msgType, body) {
  const { full, date } = nowTs();
  const A = C.arrow('»');
  console.log('');
  console.log(`${hbar(C.dmBar, '─', 18)} ${C.dmHeader('『 TRASHCORE BOT 』')} ${hbar(C.dmBar, '─', 18)}`);
  console.log(`${A}  ${C.dmLabel('Sent Time:  ')} ${C.dmValue(full)}`);
  console.log(`${A}  ${C.dmLabel('Date:       ')} ${C.dmValue(date)}`);
  console.log(`${A}  ${C.dmLabel('Msg Type:   ')} ${C.dmValue(msgType)}`);
  console.log(`${A}  ${C.dmLabel('Sender Name:')} ${C.dmName(senderName || senderNum)}`);
  console.log(`${A}  ${C.dmLabel('Chat ID:    ')} ${C.dmValue(senderNum)}`);
  console.log(`${A}  ${C.dmLabel('Message:    ')} ${C.dmMsg(body)}`);
  console.log(`${hbar(C.dmBar, '─', 56)}`);
  console.log('');
}

// ── GC block ──────────────────────────────────────────────────
function logGC(senderName, senderNum, groupName, groupJid, msgType, body) {
  const { full, date } = nowTs();
  const A = C.arrow('»');
  console.log('');
  console.log(`${hbar(C.gcBar, '─', 18)} ${C.gcHeader('『 TRASHCORE BOT 』')} ${hbar(C.gcBar, '─', 18)}`);
  console.log(`${A}  ${C.gcLabel('Sent Time:  ')} ${C.gcValue(full)}`);
  console.log(`${A}  ${C.gcLabel('Date:       ')} ${C.gcValue(date)}`);
  console.log(`${A}  ${C.gcLabel('Msg Type:   ')} ${C.gcValue(msgType)}`);
  console.log(`${A}  ${C.gcLabel('Sender Name:')} ${C.gcName(senderName || senderNum)}`);
  console.log(`${A}  ${C.gcLabel('Chat ID:    ')} ${C.gcValue(senderNum)}`);
  console.log(`${A}  ${C.gcLabel('Group:      ')} ${C.gcGroup(groupName || groupJid)}`);
  console.log(`${A}  ${C.gcLabel('Group JID:  ')} ${C.gcValue(groupJid)}`);
  console.log(`${A}  ${C.gcLabel('Message:    ')} ${C.gcMsg(body)}`);
  console.log(`${hbar(C.gcBar, '─', 56)}`);
  console.log('');
}

// ── Main exported function ────────────────────────────────────
async function logMessage(m, trashcore) {
  if (!m?.message) return;

  const chatId     = m.key.remoteJid;
  const isGroup    = chatId.endsWith('@g.us');
  const senderJid  = m.key.participant || chatId;
  const sender     = senderJid.split('@')[0].split(':')[0];
  const senderName = m.pushName || sender;
  const body       = getMsgBody(m);
  const msgType    = getMsgType(m);

  if (isGroup) {
    let groupName = chatId;
    try {
      const meta = global.getGroupMeta
        ? await global.getGroupMeta(trashcore, chatId)
        : await trashcore.groupMetadata(chatId);
      groupName = meta?.subject || chatId;
    } catch {
      groupName = chatId;
    }
    logGC(senderName, sender, groupName, chatId, msgType, body);
  } else {
    logDM(senderName, sender, msgType, body);
  }
}

module.exports = { logMessage };
