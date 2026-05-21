// ============================================================
//  ULTRA X PROJECT — by TrashX
//  plugins/admin/admin.js  |  Core Commands Only
// ============================================================

const { getSetting, setSetting } = require('../../database');

// ─── mode ────────────────────────────────────────────────────

const mode = {
  command: ['mode'],
  desc:    'Switch bot mode (private/public) — owner only',
  category: 'Owner',
  usage:   '.mode <private|public>',
  run: async ({ args, xreply, isOwner }) => {
    if (!isOwner) return xreply('❌ Only the bot owner can use this command.');
    if (!args[0])
      return xreply(
        'Usage:\n' +
        '.`mode private` — Switch bot to private mode (only owner can use commands)\n' +
        '.`mode public`  — Switch bot to public mode (everyone can use commands)'
      );

    const m = args[0].toLowerCase();
    if (m !== 'private' && m !== 'public')
      return xreply('❌ Invalid mode. Use either `private` or `public`.');

    const newMode = m === 'private';
    await setSetting('privateMode', newMode);
    xreply(`✅ Bot mode is now: ${newMode ? 'PRIVATE (owner only)' : 'PUBLIC (everyone can use)'} ✅`);
  }
};

// ─── setprefix ───────────────────────────────────────────────

const setprefix = {
  command: 'setprefix',
  desc:    'Change command prefix (bot owner only)',
  category: 'Owner',
  usage:   '.setprefix <new_prefix>',
  run: async ({ args, xreply, isOwner }) => {
    if (!isOwner) return xreply('❌ Only the bot owner can use this command.');
    if (!args[0])  return xreply('❌ Usage: .setprefix <new_prefix>');
    setSetting('prefix', args[0]);
    await xreply(`✅ Command prefix updated to: \`${args[0]}\``);
  }
};

// ─── exports ────────────────────────────────────────────────

module.exports = [mode, setprefix];
