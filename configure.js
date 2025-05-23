//#Simple base bot by (Wa-type)
//* Author: Giddy Tennor 
//* Wa:254756182478/254788460896
//* Tele:tennormodcoder
//* Github:Tennor-modz 

const fs = require('fs')
const chalk = require('chalk')
//=================================================//
// setting bot
global.owner = "254756182478"
global.namaowner = "Giddy Tennor"
global.botname = "Wa-Base-Bot"
global.author = "254756182478"
global.xprefix = '.'
global.autostatus = true 

//=================================================//
global.mess = {
    owner: '`command reserved for owner only<\>`',
 prem: '`command reserved for premium only<\>`',
    admin: '`command reserved for admins only<\>`',
    group: '`feature for group only<\>`',
    done: '`Done ✓`',
    error: 'Error !',
    success: 'Succes •'
}
//=================================================//
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.green.bold(`Update ${__filename}`))
delete require.cache[file]
require(file)
})