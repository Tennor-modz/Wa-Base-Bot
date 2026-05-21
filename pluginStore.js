// ============================================================
//  ULTRA X PROJECT — by TrashX
//  pluginStore.js  |  Plugin loader for merged plugin files
// ============================================================

const fs    = require('fs');
const path  = require('path');
const chalk = require('chalk');

const plugins = new Map();

// ─── banner ─────────────────────────────────────────────────

function printBanner() {
  console.log('\n' + chalk.bold.cyanBright('╔══════════════════════════════════════╗'));
  console.log(chalk.bold.cyanBright('║') + chalk.bold.whiteBright('     ⚡  ULTRA X PROJECT by TrashX  ⚡  ') + chalk.bold.cyanBright('║'));
  console.log(chalk.bold.cyanBright('╚══════════════════════════════════════╝') + '\n');
}

// ─── load a single merged file ──────────────────────────────

function loadPluginFile(relativePath) {
  const pluginPath = path.join(__dirname, 'plugins', relativePath);
  let loaded = 0;

  try {
    delete require.cache[require.resolve(pluginPath)];
    const exported = require(pluginPath);

    // Support both: module.exports = [...] and module.exports = {}
    const items = Array.isArray(exported) ? exported : [exported];

    const category = path.dirname(relativePath).split('/').pop();

    for (const plugin of items) {
      if (!plugin || !plugin.command || !plugin.run) continue;

      const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command];

      cmds.forEach(cmd => {
        plugins.set(cmd.toLowerCase(), {
          ...plugin,
          category: plugin.category || category,
          __file: relativePath
        });
      });

      loaded++;
    }

    return loaded;
  } catch (e) {
    console.log(chalk.red(`  ✖ Failed loading: ${relativePath}`));
    console.error(chalk.red('    ' + e.message));
    return 0;
  }
}

// ─── walk directories ───────────────────────────────────────

function walkPlugins(dir, baseDir = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkPlugins(full, baseDir);
    if (entry.isFile() && entry.name.endsWith('.js')) {
      const rel = path.relative(baseDir, full).replace(/\\/g, '/');
      loadPluginFile(rel);
    }
  }
}

// ─── main load ──────────────────────────────────────────────

function loadPlugins() {
  plugins.clear();

  printBanner();

  const dir = path.join(__dirname, 'plugins');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  // Count subfolders
  const subfolders = fs.readdirSync(dir, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);

  // Load all plugin files
  walkPlugins(dir);

  // ─── startup summary ─────────────────────────────────────
  console.log(chalk.greenBright('  ✅ Plugins loaded successful'));
  console.log(chalk.cyanBright(`  📦 Commands loaded: ${chalk.bold.whiteBright(plugins.size)}`));

  // Show per-folder breakdown
  const byFolder = {};
  for (const [, plugin] of plugins) {
    const folder = path.dirname(plugin.__file).split('/').pop();
    byFolder[folder] = (byFolder[folder] || 0) + 1;
  }

  for (const [folder, count] of Object.entries(byFolder)) {
    console.log(chalk.dim(`     • ${folder}: ${count} command${count !== 1 ? 's' : ''}`));
  }

  console.log(chalk.cyanBright(`  📁 Files loaded: ${chalk.bold.whiteBright(subfolders.length)}`));
  console.log(chalk.dim(`     [${subfolders.join(', ')}]`));
  console.log('');
}

// ─── hot-reload watcher ─────────────────────────────────────

function watchPlugins() {
  const dir = path.join(__dirname, 'plugins');

  // Use chokidar if available, fallback to fs.watch
  let watcher;
  try {
    const chokidar = require('chokidar');
    watcher = chokidar.watch(dir, { ignoreInitial: true, persistent: true });

    watcher.on('change', file => handleChange(file, dir));
    watcher.on('add',    file => handleChange(file, dir));
    watcher.on('unlink', file => handleRemove(file, dir));
  } catch {
    // Fallback: built-in fs.watch
    fs.watch(dir, { recursive: true }, (_, filename) => {
      if (!filename || !filename.endsWith('.js')) return;
      const file = filename.replace(/\\/g, '/');
      const full = path.join(dir, file);
      console.log(chalk.yellow(`  🔄 Plugin change: ${file}`));
      for (const [cmd, data] of plugins.entries()) {
        if (data.__file === file) plugins.delete(cmd);
      }
      if (fs.existsSync(full)) loadPluginFile(file);
      else console.log(chalk.red(`  🗑 Removed: ${file}`));
    });
  }
}

function handleChange(file, dir) {
  if (!file.endsWith('.js')) return;
  const rel = path.relative(path.join(dir), file).replace(/\\/g, '/');
  console.log(chalk.yellow(`  🔄 Plugin change: ${rel}`));
  for (const [cmd, data] of plugins.entries()) {
    if (data.__file === rel) plugins.delete(cmd);
  }
  loadPluginFile(rel);
}

function handleRemove(file, dir) {
  if (!file.endsWith('.js')) return;
  const rel = path.relative(path.join(dir), file).replace(/\\/g, '/');
  for (const [cmd, data] of plugins.entries()) {
    if (data.__file === rel) plugins.delete(cmd);
  }
  console.log(chalk.red(`  🗑 Removed: ${rel}`));
}

// ─── exports ────────────────────────────────────────────────

module.exports = { plugins, loadPlugins, watchPlugins };
