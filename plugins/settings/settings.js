// ============================================================
//  ULTRA X PROJECT — by TrashX
//  plugins/settings/settings.js  |  Menu Command
// ============================================================

const os = require('os');
const { getSetting } = require('../../database');
const { plugins }   = require('../../pluginStore');

// ─── helpers ─────────────────────────────────────────────────

function formatUptime(seconds) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  if (s || parts.length === 0) parts.push(`${s}s`);
  return parts.join(' ');
}

function detectPlatform() {
  if (process.env.TRASHBOTS)     return 'TrashBots';
  if (process.env.DYNO)          return 'Heroku';
  if (process.env.RENDER)        return 'Render';
  if (process.env.P_SERVER_UUID) return 'Panel';
  if (process.env.LXC)           return 'Linux Container (LXC)';
  switch (os.platform()) {
    case 'win32':  return 'Windows';
    case 'darwin': return 'macOS';
    case 'linux':  return 'Linux';
    default:       return 'Unknown';
  }
}

function groupByCategory(pluginsMap) {
  const categories = {};
  for (const plugin of pluginsMap.values()) {
    const category = plugin.category || 'Uncategorized';
    if (!categories[category]) categories[category] = [];
    const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
    for (const cmd of cmds) {
      const display = plugin.isOwner ? `${cmd} (owner)` : cmd;
      if (!categories[category].includes(display)) categories[category].push(display);
    }
  }
  return categories;
}

// ─── menu ────────────────────────────────────────────────────

const MENU_IMAGES = [
  'https://imgdrop.web.id/q0NPu.jpg',
  'https://imgdrop.web.id/8AZ63.jpg',
  'https://imgdrop.web.id/shpXC.jpg',
  'https://imgdrop.web.id/3Ms0U.jpg',
];

let menuImageIndex = 0;

const menu = {
  command: ['menu', 'help'],
  desc:    'Show command list and bot status',
  run: async ({ trashcore, m, chat, botStartTime }) => {
    const startTime     = botStartTime || global.botStartTime || Date.now();
    const uptimeSeconds = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    const uptime        = formatUptime(uptimeSeconds);

    const prefix      = getSetting('prefix', '.');
    const privateMode = getSetting('privateMode', false);
    const mode        = privateMode ? 'PRIVATE' : 'PUBLIC';
    const totalCmds   = plugins.size;
    const ramMB       = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
    const platform    = detectPlatform();
    const ownerName   = getSetting('ownerName', 'Trashcore');
    const grouped     = groupByCategory(plugins);

    // Pick current image then advance index
    const imageUrl = MENU_IMAGES[menuImageIndex];
    menuImageIndex = (menuImageIndex + 1) % MENU_IMAGES.length;

    let commandsText = '';
    for (const [category, cmds] of Object.entries(grouped)) {
      commandsText += `\n┏━━━━ 📂 *${category}*\n`;
      cmds.sort();
      commandsText += cmds.map(cmd => `┃⭔ ${prefix}${cmd}`).join('\n') + '\n';
      commandsText += `┗━━━━━━━━━━━━━━━━━\n`;
    }

    const header =
      `╔══════════════════════╗\n` +
      `║   🥷 *DREX API BOT*   ║\n` +
      `╚══════════════════════╝\n\n` +
      `││ ⟿ Owner  : ${ownerName}\n` +
      `││ ⟿ Prefix : ${prefix}\n` +
      `││ ⟿ Mode   : ${mode}\n` +
      `││ ⟿ Cmds   : ${totalCmds}\n` +
      `││ ⟿ Uptime : ${uptime}\n` +
      `││ ⟿ RAM    : ${ramMB} MB\n` +
      `││ ⟿ WEB    : api.drexapp.space\n` +
      `││ ⟿ Host   : ${platform}\n`;

    const fullText = header + commandsText;

    await trashcore.sendMessage(chat, {
      image:   { url: imageUrl },
      caption: fullText
    }, { quoted: m });
  }
};

module.exports = [menu];
