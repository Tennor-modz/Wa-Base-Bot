// antiDelete.js

//Simply made to minor hack WhatsApp messages 👽 don't change this code bro use the way it is 😑
const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@trashcore/baileys');

module.exports = function initAntiDelete(trashcore, opts = {}) {
  const LIB_DIR = path.join(__dirname, './library');
  const DB_PATH = opts.dbPath || path.join(LIB_DIR, 'antidelete.json');
  const STATE_PATH = path.join(LIB_DIR, 'antidelete_state.json');
  const MAX_CACHE = opts.maxCache || 500;

  fs.mkdirSync(LIB_DIR, { recursive: true });

  const defaultEnabled = typeof opts.enabled === 'boolean' ? opts.enabled : true;


  let featureState = defaultEnabled;
  try {
    if (fs.existsSync(STATE_PATH)) {
      const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
      featureState = !!state.enabled;
    }
  } catch (e) {
    console.warn('antiDelete: failed to load state file, using default');
  }

  global.antiDeleteEnabled = featureState;

  const botNumber = opts.botNumber?.endsWith('@s.whatsapp.net')
    ? opts.botNumber
    : `${opts.botNumber}@s.whatsapp.net`;

  const cache = new Map();


  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({}, null, 2));
  }

  // Load previous cache (metadata only)
  try {
    const persisted = JSON.parse(fs.readFileSync(DB_PATH, 'utf8') || '{}');
    for (const k of Object.keys(persisted)) cache.set(k, persisted[k]);
  } catch (e) {
    console.warn('antiDelete: no persisted db or parse failed', e);
  }

  function persist() {
    try {
      const obj = {};
      for (const [k, v] of cache.entries()) {
        const store = { ...v };
        delete store.contentBuffer;
        obj[k] = store;
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(obj, null, 2));
    } catch (e) {
      console.error('antiDelete persist error', e);
    }
  }

  function saveState(enabled) {
    try {
      fs.writeFileSync(STATE_PATH, JSON.stringify({ enabled }, null, 2));
    } catch (e) {
      console.error('antiDelete saveState error', e);
    }
  }

  function addToCache(key, messageObj) {
    cache.set(key, messageObj);
    if (cache.size > MAX_CACHE) cache.delete(cache.keys().next().value);
    persist();
  }

  async function handleIncomingMessage(m) {
    try {
      if (!global.antiDeleteEnabled || !m?.message) return;

      // Always use the outer remoteJid (stable @s.whatsapp.net / @g.us)
      // never @lid — so the delete lookup always matches
      const chat = m.key.remoteJid;
      if (!chat || chat.endsWith('@lid')) return; // skip @lid messages entirely
      const id = m.key.id || `${chat}-${Date.now()}`;
      const cacheKey = `${chat}:${id}`;

      // TEXT MESSAGE
      if (m.message.conversation || m.message.extendedTextMessage) {
        const text = m.message.conversation || m.message.extendedTextMessage?.text || '';
        addToCache(cacheKey, {
          id,
          chat,
          type: 'text',
          text,
          sender: m.key.participant || m.key.remoteJid,
          timestamp: Date.now()
        });
        return;
      }

      // MEDIA MESSAGE
      const mediaNode =
        m.message.imageMessage ||
        m.message.videoMessage ||
        m.message.audioMessage ||
        m.message.stickerMessage ||
        m.message.documentMessage ||
        null;

      if (mediaNode) {
        const mediaType =
          m.message.imageMessage ? 'image' :
          m.message.videoMessage ? 'video' :
          m.message.audioMessage ? 'audio' :
          m.message.stickerMessage ? 'sticker' :
          m.message.documentMessage ? 'document' : 'unknown';

        const stream = await downloadContentFromMessage(
          mediaNode,
          mediaType === 'document'
            ? (mediaNode.mimetype?.split('/')[0] || 'document')
            : mediaType
        );

        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

        addToCache(cacheKey, {
          id,
          chat,
          type: mediaType,
          sender: m.key.participant || m.key.remoteJid,
          timestamp: Date.now(),
          fileName: mediaNode.fileName || null,
          mimetype: mediaNode.mimetype || null,
          size: buffer.length,
          contentBuffer: buffer,
          caption: mediaNode.caption || null
        });
        return;
      }

      // OTHER MESSAGE TYPES
      addToCache(cacheKey, {
        id,
        chat,
        type: 'raw',
        raw: m.message,
        sender: m.key.participant || m.key.remoteJid,
        timestamp: Date.now()
      });

    } catch (err) {
      console.error('antiDelete.handleIncomingMessage error', err);
    }
  }

  async function handleProtocolMessage(m) {
    try {
      if (!global.antiDeleteEnabled || !m?.message?.protocolMessage) return;

      const protoMsg = m.message.protocolMessage;
      const revokedKey = protoMsg.key;
      if (!revokedKey) return;

      const revokedId = revokedKey.id;

      // ── Normalize chat JID ───────────────────────────────────
      // When someone on a linked device deletes a DM, WhatsApp sends
      // revokedKey.remoteJid as a @lid (linked device ID) e.g. 219756732907722@lid
      // But we cached the message under their @s.whatsapp.net JID.
      // Fix: always use the OUTER m.key.remoteJid for DM cache lookups —
      // it is always the stable @s.whatsapp.net or @g.us JID.
      let chat = m.key.remoteJid;

      // For groups, prefer revokedKey.remoteJid if it's a valid group JID
      if (revokedKey.remoteJid && revokedKey.remoteJid.endsWith('@g.us')) {
        chat = revokedKey.remoteJid;
      }

      const isGroup = chat.endsWith('@g.us');

      // Try all possible cache key variants to handle @lid / @s.whatsapp.net mismatches
      const keysToTry = [
        `${chat}:${revokedId}`,
        `${revokedKey.remoteJid}:${revokedId}`,
        `${botNumber}:${revokedId}`,
      ].filter(Boolean);

      let saved = null;
      for (const k of keysToTry) {
        if (cache.has(k)) { saved = cache.get(k); break; }
      }

      let chatName = chat;
      if (isGroup) {
        try {
          const meta = await trashcore.groupMetadata(chat);
          chatName = meta?.subject || chat;
        } catch {
          chatName = chat;
        }
      }

      if (!saved) {
        // Silently skip — message wasn't in cache (sent before bot started, or @lid mismatch)
        return;
      }

      const senderJid = saved.sender || 'unknown@s.whatsapp.net';
      const userTag = `@${senderJid.split('@')[0]}`;
      const mention = [senderJid];
      const header = `🛡️ *Anti-Delete*\nChat: ${chatName}\nUser: ${userTag}`;
      const targetJid = botNumber;

      // TEXT MESSAGE
      if (saved.type === 'text') {
        await trashcore.sendMessage(targetJid, {
          text: `${header}\n\nDeleted message:\n${saved.text}`,
          mentions: mention
        });
        return;
      }

      // MEDIA MESSAGE
      if (['image', 'video', 'audio', 'sticker', 'document'].includes(saved.type)) {
        const msgOptions = {};
        switch (saved.type) {
          case 'image': msgOptions.image = saved.contentBuffer; break;
          case 'video': msgOptions.video = saved.contentBuffer; break;
          case 'audio': msgOptions.audio = saved.contentBuffer; msgOptions.mimetype = saved.mimetype || 'audio/mpeg'; break;
          case 'sticker': msgOptions.sticker = saved.contentBuffer; break;
          case 'document': msgOptions.document = saved.contentBuffer; msgOptions.fileName = saved.fileName || 'file'; break;
        }

        if (['image', 'video', 'document'].includes(saved.type)) {
          msgOptions.caption = `${header}\nOriginal caption: ${saved.caption || '—'}`;
          msgOptions.contextInfo = { mentionedJid: mention };
        }

        await trashcore.sendMessage(targetJid, msgOptions);
        return;
      }

      await trashcore.sendMessage(targetJid, {
        text: `${header}\n(Content type not supported)`,
        mentions: mention
      });

    } catch (err) {
      console.error('antiDelete.handleProtocolMessage error:', err);
    }
  }

  trashcore.ev.on('messages.upsert', async ({ messages }) => {
    for (const m of messages) {
      try {
        if (m?.message?.protocolMessage) await handleProtocolMessage(m);
        else if (m?.message) await handleIncomingMessage(m);
      } catch (e) {
        console.error('antiDelete messages.upsert loop error', e);
      }
    }
  });

  return {
    clearCache: () => { cache.clear(); persist(); },
    getCacheSize: () => cache.size,
    saveState
  };
};
