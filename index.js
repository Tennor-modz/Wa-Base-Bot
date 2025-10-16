/*
> Recode script give credits to›
Giddy Tennor(Trashcore)

📝 | Created By Trashcore
🖥️ | Base Ori By Trashcore 
📌 |Credits Putrazy Xd
📱 |Chat wa:254104245659
👑 |Github: Tennor-modz 
✉️ |Email: giddytennor@gmail.com
*/

const fs = require('fs');
const pino = require('pino');
const readline = require('readline');
const path = require('path');
const chalk = require('chalk');
const { exec } = require('child_process');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  downloadContentFromMessage,
  jidDecode
} = require('@whiskeysockets/baileys');
const handleCommand = require('./case');
const config = require('./config');

// 🌈 Console helpers
const log = {
  info: (msg) => console.log(chalk.cyanBright(`[INFO] ${msg}`)),
  success: (msg) => console.log(chalk.greenBright(`[SUCCESS] ${msg}`)),
  error: (msg) => console.log(chalk.redBright(`[ERROR] ${msg}`)),
  warn: (msg) => console.log(chalk.yellowBright(`[WARN] ${msg}`))
};

// 🧠 Readline setup
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function question(query) {
  return new Promise(resolve => rl.question(query, ans => resolve(ans.trim())));
}

// 🚀 Start socket
async function starttrashcore() {
  const store = makeInMemoryStore({
    logger: pino().child({ level: 'silent', stream: 'store' })
  });

  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const { version } = await fetchLatestBaileysVersion();

  const trashcore = makeWASocket({
    version,
    keepAliveIntervalMs: 10000,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }).child({ level: 'silent' }))
    },
    browser: ["Ubuntu", "Chrome", "20.0.00"]
  });

  trashcore.ev.on('creds.update', saveCreds);

  // Pairing code
  if (!trashcore.authState.creds.registered) {
    const phoneNumber = await question(chalk.yellowBright("[ = ] Enter the WhatsApp number you want to use as a bot (with country code):\n"));
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    console.clear();

    const pairCode = await trashcore.requestPairingCode(cleanNumber);
    log.info(`Enter this code on your phone to pair: ${chalk.green(pairCode)}`);
    log.info("⏳ Wait a few seconds and approve the pairing on your phone...");
  }

  // Media download helper
  trashcore.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
  };

  // Connection handling
  trashcore.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
      log.error('Connection closed.');
      if (shouldReconnect) starttrashcore();
    } else if (connection === 'open') {
      const botNumber = trashcore.user.id.split("@")[0];
      log.success(`Bot connected as ${chalk.green(botNumber)}`);
      rl.close();

      // ✅ Send DM to owner
      setTimeout(async () => {
        const ownerJid = `${botNumber}@s.whatsapp.net`;
        const message = `
✅ *Bot Connected Successfully!*

👑 *Creator:* Trashcore
⚙️ *Version:* 3.0.0
📦 *Type:* Base Script
📱 *Paired Number:* ${botNumber}

✨ Type *menu* to see commands!
`;
        try {
          await trashcore.sendMessage(ownerJid, { text: message });
          log.success(`Sent DM to paired number (${botNumber})`);
        } catch (err) {
          log.error(`Failed to send DM: ${err}`);
        }
      }, 2000);

      trashcore.isPublic = true;
    }
  });

  // ✅ Message handler
  trashcore.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;

    const from = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const botNumber = trashcore.user.id.split(":")[0] + "@s.whatsapp.net";

    // 🌐 Message type & body
    let body =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      msg.message.imageMessage?.caption ||
      msg.message.videoMessage?.caption ||
      msg.message.documentMessage?.caption ||
      '';
    body = (body || '').trim();
    if (!body) return;

    // 🧱 Wrap into m object
    const m = {
      ...msg,
      chat: from,
      sender,
      isGroup,
      body,
      type: Object.keys(msg.message)[0],
      quoted: msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
        ? {
            key: {
              remoteJid: msg.message.extendedTextMessage.contextInfo.remoteJid,
              id: msg.message.extendedTextMessage.contextInfo.stanzaId,
              participant: msg.message.extendedTextMessage.contextInfo.participant
            },
            message: msg.message.extendedTextMessage.contextInfo.quotedMessage
          }
        : null,
      reply: (text) => trashcore.sendMessage(from, { text }, { quoted: msg })
    };

    // 🧩 Parse command
    const args = body.split(/ +/);
    const command = args.shift().toLowerCase();

    // 🏘️ Group data
    const groupMeta = isGroup ? await trashcore.groupMetadata(from).catch(() => null) : null;
    const groupAdmins = groupMeta ? groupMeta.participants.filter(p => p.admin).map(p => p.id) : [];
    const isBotAdmin = isGroup ? groupAdmins.includes(botNumber) : false;
    const isAdmin = isGroup ? groupAdmins.includes(sender) : false;

    // 🔥 Pass to handler
    await handleCommand(trashcore, m, command, args, isGroup, isAdmin, groupAdmins, groupMeta, jidDecode, config);
  });

  // 🧩 Decode JID helper
  trashcore.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid) || {};
      return decode.user && decode.server ? `${decode.user}@${decode.server}` : jid;
    }
    return jid;
  };

  // 🔥 Hot reload
  const watchFiles = ['./case.js', './config.js', './index.js'];
  watchFiles.forEach(file => {
    const absPath = path.resolve(file);
    fs.watchFile(absPath, () => {
      log.warn(`${file} updated! Reloading...`);
      delete require.cache[require.resolve(absPath)];
      try {
        require(absPath);
        log.success(`${file} reloaded successfully.`);
      } catch (err) {
        log.error(`Failed to reload ${file}: ${err}`);
      }
    });
  });
}

starttrashcore();