// ============================================================
//  ULTRA X PROJECT — by TrashX
//  index.js  |  Stripped — menu, setprefix, mode only
// ============================================================

const fs        = require('fs');
const path      = require('path');
const pino      = require('pino');
const chalk     = require('chalk');
const readline  = require('readline');
const NodeCache = require('node-cache');

const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  DisconnectReason,
  jidNormalizedUser
} = require('@trashcore/baileys');

const { loadPlugins, watchPlugins, plugins } = require('./pluginStore');
const { initDatabase, getSetting, setSetting } = require('./database');
const { logMessage }                           = require('./database/logger');
const config                                   = require('./config');

global.botStartTime = Date.now();
let dbReady      = false;
let trashcoreRef = null;

// ─── console logger ──────────────────────────────────────────

const C = {
  arrow:     chalk.hex('#ff6ac1').bold,
  dmBar:     chalk.hex('#00ffe0'),
  dmHeader:  chalk.hex('#00ffe0').bold,
  dmLabel:   chalk.hex('#a0a8c8'),
  dmValue:   chalk.hex('#ffffff'),
  dmName:    chalk.hex('#ffdd57').bold,
  dmMsg:     chalk.hex('#ff9f43'),
  gcBar:     chalk.hex('#bd93f9'),
  gcHeader:  chalk.hex('#bd93f9').bold,
  gcLabel:   chalk.hex('#a0a8c8'),
  gcValue:   chalk.hex('#ffffff'),
  gcName:    chalk.hex('#50fa7b').bold,
  gcGroup:   chalk.hex('#ff79c6'),
  gcMsg:     chalk.hex('#8be9fd'),
  sysBar:    chalk.hex('#ffb86c'),
  sysHeader: chalk.hex('#ffb86c').bold,
  sysValue:  chalk.hex('#f1fa8c'),
  errBar:    chalk.hex('#ff5555'),
  errHeader: chalk.hex('#ff5555').bold,
  errValue:  chalk.hex('#ff5555'),
  okHeader:  chalk.hex('#50fa7b').bold,
  okValue:   chalk.hex('#50fa7b'),
  time:      chalk.hex('#6272a4'),
  dim:       chalk.hex('#44475a'),
  bold:      chalk.hex('#f8f8f2').bold,
};

function hbar(colorFn, char = '─', len = 48) {
  return colorFn(char.repeat(len));
}

function logOk(msg)   { console.log(`${C.arrow('»')}  ${C.okHeader('[OK]')}   ${C.okValue(msg)}`); }
function logSys(msg)  { console.log(`${C.arrow('»')}  ${C.sysHeader('[SYS]')}  ${C.sysValue(msg)}`); }
function logWarn(msg) { console.log(`${C.arrow('»')}  ${C.sysHeader('[WARN]')} ${C.sysValue(msg)}`); }
function logErr(msg)  { console.log(`${C.arrow('»')}  ${C.errHeader('[ERR]')}  ${C.errValue(msg)}`); }

function logReconnect() {
  console.log('');
  console.log(hbar(C.sysBar, '─', 56));
  console.log(`${C.arrow('»')}  ${C.sysHeader('Connection closed — reconnecting in 3s...')}`);
  console.log(hbar(C.sysBar, '─', 56));
  console.log('');
}

function logLoggedOut() {
  console.log('');
  console.log(hbar(C.errBar, '─', 56));
  logErr('Logged out. Delete session folder and restart.');
  console.log(hbar(C.errBar, '─', 56));
  console.log('');
}

function printBanner() {
  console.log('');
  console.log(C.gcBar('  ╔' + '═'.repeat(52) + '╗'));
  console.log(C.gcBar('  ║') + C.bold('        ⚡ TRASHCORE ULTRA  —  by TrashX        ') + C.gcBar('║'));
  console.log(C.gcBar('  ╚' + '═'.repeat(52) + '╝'));
  console.log('');
}

function printConnected(botNumber, pluginCount, prefix) {
  const uptime = formatUptime(Date.now() - global.botStartTime);
  const A = C.arrow('»');
  console.log('');
  console.log(hbar(C.dmBar, '═', 56));
  console.log(`${A}  ${C.dmHeader('STATUS')}        ${chalk.hex('#50fa7b').bold('ONLINE ●')}`);
  console.log(`${A}  ${C.dmLabel('Number:')}      ${chalk.hex('#ffdd57').bold('+' + botNumber)}`);
  console.log(`${A}  ${C.dmLabel('Plugins:')}     ${chalk.hex('#50fa7b').bold(String(pluginCount))}`);
  console.log(`${A}  ${C.dmLabel('Prefix:')}      ${chalk.hex('#ffb86c').bold(prefix)}`);
  console.log(`${A}  ${C.dmLabel('Uptime:')}      ${C.time(uptime)}`);
  console.log(hbar(C.dmBar, '═', 56));
  console.log('');
}

// ─── caches ──────────────────────────────────────────────────

const groupCache    = new NodeCache({ stdTTL: 120, checkperiod: 60 });
const settingsCache = new NodeCache({ stdTTL: 30,  checkperiod: 15 });

function getCachedSetting(key, defaultValue = null) {
  const hit = settingsCache.get(key);
  if (hit !== undefined) return hit;
  const val = getSetting(key, defaultValue);
  settingsCache.set(key, val);
  return val;
}

const _origSetSetting = setSetting;
function setCachedSetting(key, value) {
  settingsCache.del(key);
  return _origSetSetting(key, value);
}
global.setSetting = setCachedSetting;

async function getGroupMeta(trashcore, chatId) {
  const hit = groupCache.get(chatId);
  if (hit) return hit;
  try {
    const meta = await trashcore.groupMetadata(chatId);
    if (meta) groupCache.set(chatId, meta);
    return meta || {};
  } catch {
    return {};
  }
}

global.getGroupMeta = getGroupMeta;

// ─── message queue ───────────────────────────────────────────

const QUEUE_CONCURRENCY = 5;
let   activeWorkers     = 0;
const messageQueue      = [];

function enqueueMessage(handler) {
  messageQueue.push(handler);
  drainQueue();
}

function drainQueue() {
  while (activeWorkers < QUEUE_CONCURRENCY && messageQueue.length > 0) {
    const handler = messageQueue.shift();
    activeWorkers++;
    handler().finally(() => {
      activeWorkers--;
      drainQueue();
    });
  }
}

// ─── helpers ─────────────────────────────────────────────────

function formatUptime(ms) {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${d}d ${h}h ${m}m ${s % 60}s`;
}

function normalizeNumber(jid) {
  return jid ? jid.split('@')[0].split(':')[0] : '';
}

function cleanOldCache() {
  const cacheFolder = path.join(__dirname, 'cache');
  if (!fs.existsSync(cacheFolder)) return;
  for (const file of fs.readdirSync(cacheFolder)) {
    try { fs.unlinkSync(path.join(cacheFolder, file)); } catch {}
  }
}

function question(query) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(query, ans => { rl.close(); resolve(ans.trim()); }));
}

function getHandleMessage() {
  delete require.cache[require.resolve('./command')];
  return require('./command');
}

// ─── session helpers ─────────────────────────────────────────

const sessionDir = path.join(__dirname, 'session');
const credsPath  = path.join(sessionDir, 'creds.json');

async function saveSessionFromConfig() {
  try {
    if (!config.SESSION_ID || !config.SESSION_ID.includes('trashcore~')) return false;
    const base64Data = config.SESSION_ID.split('trashcore~')[1];
    if (!base64Data) return false;
    await fs.promises.mkdir(sessionDir, { recursive: true });
    await fs.promises.writeFile(credsPath, Buffer.from(base64Data, 'base64'));
    logOk('Session saved from SESSION_ID');
    return true;
  } catch (err) {
    logErr(`Failed to save session: ${err.message}`);
    return false;
  }
}

// ─── main bot ────────────────────────────────────────────────

async function starttrashcore() {
  loadPlugins();
  watchPlugins();
  logOk(`Loaded ${plugins.size} plugins`);

  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const { version }          = await fetchLatestBaileysVersion();

  const trashcore = makeWASocket({
    version,
    keepAliveIntervalMs: 30000,
    printQRInTerminal:   false,
    logger: pino({ level: 'silent' }),
    auth: {
      creds: state.creds,
      keys:  makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
    },
    browser:             ['Ubuntu', 'Chrome', '120.0.0.0'],
    syncFullHistory:     false,
    markOnlineOnConnect: false
  });

  trashcoreRef = trashcore;
  trashcore.ev.on('creds.update', saveCreds);

  // Store
  const createToxxicStore = require('./basestore');
  const store = createToxxicStore('./store', { maxMessagesPerChat: 50, memoryOnly: true });
  store.bind(trashcore.ev);

  // Pairing
  if (!state.creds.registered && (!config.SESSION_ID || config.SESSION_ID === '')) {
    try {
      const phoneNumber = await question(C.sysValue('[ = ] Enter your WhatsApp number (with country code):\n'));
      const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
      console.clear();
      printBanner();
      const pairCode = await trashcore.requestPairingCode(cleanNumber, 'TRASHBOT');
      console.log('');
      console.log(`${C.arrow('»')}  ${C.bold('Pairing Code:')}  ${chalk.hex('#ffdd57').bold(pairCode)}`);
      console.log(`${C.arrow('»')}  ${C.time('Approve on your phone...')}`);
      console.log('');
    } catch (err) {
      logErr(`Pairing failed: ${err.message}`);
    }
  }

  // ─── connection.update ───────────────────────────────────
  trashcore.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason !== DisconnectReason.loggedOut) {
        logReconnect();
        setTimeout(() => starttrashcore(), 3000);
      } else {
        logLoggedOut();
      }
    }

    if (connection === 'open') {
      const botNumber = normalizeNumber(trashcore.user.id);

      await initDatabase();
      dbReady = true;
      cleanOldCache();

      const prefix = getCachedSetting('prefix', '.');

      printConnected(botNumber, plugins.size, prefix);

      trashcore.sendMessage(`${botNumber}@s.whatsapp.net`, {
        text:
          `💠 *TRASHCORE ULTRA ACTIVATED!*\n\n` +
          `> ❐ Prefix  : ${prefix}\n` +
          `> ❐ Plugins : ${plugins.size}\n` +
          `> ❐ Number  : wa.me/${botNumber}\n` +
          `✓ Uptime: _${formatUptime(Date.now() - global.botStartTime)}_`
      }).catch(() => {});

      // AntiDelete
      const initAntiDelete = require('./database/antiDelete');
      initAntiDelete(trashcore, {
        botNumber: `${botNumber}@s.whatsapp.net`,
        dbPath:    './database/antidelete.json',
        enabled:   true
      });
      logOk('AntiDelete active');
    }
  });

  // ─── messages.upsert ─────────────────────────────────────
  trashcore.ev.on('messages.upsert', ({ messages, type }) => {
    if (type !== 'notify' || !dbReady) return;

    for (const m of messages) {
      if (!m?.message) continue;

      enqueueMessage(async () => {
        try {
          // Status view
          if (m.key.remoteJid === 'status@broadcast') {
            const enabled = getCachedSetting('statusView', true);
            if (enabled) trashcore.readMessages([m.key]).catch(() => {});
            return;
          }

          // Unwrap ephemeral
          if (m.message?.ephemeralMessage) m.message = m.message.ephemeralMessage.message;

          // Log + dispatch
          await logMessage(m, trashcore);
          await getHandleMessage()(trashcore, m);

        } catch (err) {
          logErr(`[messages.upsert] ${err.message}`);
        }
      });
    }
  });
}

// ─── entry point ─────────────────────────────────────────────

async function sessionID() {
  printBanner();
  try {
    await fs.promises.mkdir(sessionDir, { recursive: true });

    if (fs.existsSync(credsPath)) {
      logOk('Existing session found. Starting...');
      await starttrashcore();
      return;
    }

    if (config.SESSION_ID && config.SESSION_ID.includes('trashcore~')) {
      const ok = await saveSessionFromConfig();
      if (ok) {
        logOk('SESSION_ID loaded. Starting...');
        await starttrashcore();
        return;
      }
      logWarn('SESSION_ID failed. Falling back to pairing...');
    }

    logWarn('No session found. Starting pairing flow...');
    await starttrashcore();
  } catch (error) {
    logErr(`Startup error: ${error.message}`);
  }
}

sessionID();
