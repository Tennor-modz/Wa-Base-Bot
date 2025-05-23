//#Simple base bot by Giddy Tennor (Wa-type)
//* Author: Giddy Tennor 
//* Wa:254756182478/254788460896
//* Tele:tennormodcoder
//* Github:Tennor-modz 

require('./configure')
const {
    BufferJSON,
    WA_DEFAULT_EPHEMERAL,
    generateWAMessageFromContent,
    proto,
    generateWAMessageContent,
    generateWAMessage,
    prepareWAMessageMedia,
    areJidsSameUser,
    downloadContentFromMessage,
    
    mentionedJid,
    getContentType
    
} = require('@whiskeysockets/baileys')
const os = require('os')
const fs = require('fs')
const fsx = require('fs-extra')
const path = require('path')
const util = require('util')
const { color } = require('./list/lib/color')
const chalk = require('chalk')
const moment = require('moment-timezone')
const cron = require('node-cron')
const speed = require('performance-now')
const ms = toMs = require('ms')
const axios = require('axios')
const fetch = require('node-fetch')
const yts = require('yt-search')
const gis = require('g-i-s')
const cheerio = require('cheerio')
const { randomBytes } = require('crypto')
const fg = require('api-dylux')
const googleTTS = require('google-tts-api')

const {translate} = require('@vitalets/google-translate-api')
const scp2 = require('./list/lib/scrape2') 

const absenData = {};
const { temporary, temmp } = require('./list/tempor')
const basepic = fs.readFileSync('./Media/basepic.jpg')
const {
    exec,
    spawn,
    execSync
} = require("child_process")
const {
    performance
} = require('perf_hooks')
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)
const {
    TelegraPh,
    UploadFileUgu,
    webp2mp4File,
    floNime
} = require('./list/lib/uploader')
const {
    toAudio,
    toPTT,
    toVideo,
    ffmpeg,
    addExifAvatar
} = require('./list/lib/converter')
const {
    smsg,
    getGroupAdmins,
    formatp,
    formatDate,
    getTime,
    isUrl,
    await,
    sleep,
    clockString,
    msToDate,
    sort,
    toNumber,
    enumGetKey,
    runtime,
    fetchJson,
    getBuffer,
    json,
    delay,
    toIDR,
    capital,
    format,
    logic,
    generateProfilePicture,
    parseMention,
    getRandom,
    pickRandom,
    fetchBuffer,
    buffergif,
    GroupDB,
    kickQueue,
    totalcase
} = require('./list/lib/func')
const {
    addPremiumUser,
    getPremiumExpired,
    getPremiumPosition,
    expiredPremiumCheck,
    checkPremiumUser,
    getAllPremiumUser,
} = require('./list/lib/premiun')
let premium = fs.readFileSync('./list/Database/premium.json')
const owner = JSON.parse(fs.readFileSync('./list/Database/owner.json'))
global.db.data = JSON.parse(fs.readFileSync('./list/Database/database.json'))
if (global.db.data) global.db.data = {
sticker: {},
database: {}, 
game: {},
others: {},
users: {},
chats: {},
settings: {},
...(global.db.data || {})
}

let vote = db.data.others.vote = []
let kuismath = db.data.game.math = []
const xtime = moment.tz('Africa/Nairobi').format('HH:mm:ss')
const xdate = moment.tz('Africa/Nairobi').format('DD/MM/YYYY')
const time2 = moment().tz('Africa/Nairobi').format('HH:mm:ss')  
if(time2 < "23:59:00"){
var tennortimewisher = `Good Night mofo🌌`
 }
 if(time2 < "19:00:00"){
var tennortimewisher = `Good Evening mofo🌃`
 }
 if(time2 < "18:00:00"){
var tennortimewisher = `Good Evening mofo🌃`
 }
 if(time2 < "15:00:00"){
var tennortimewisher = `Good Afternoon mofo🌅`
 }
 if(time2 < "11:00:00"){
var tennortimewisher = `Good Morning mofo 🌄`
 }
 if(time2 < "05:00:00"){
var tennortimewisher = `Good Morning mofo🌄`
 } 
const time = moment().tz("Africa/Nairobi").format("HH:mm:ss");
let ucapanWaktu
if (time >= "19:00:00" && time < "23:59:00") {
ucapanWaktu = "🌃𝐒𝐞𝐥𝐚𝐦𝐚𝐭 𝐌𝐚𝐥𝐚𝐦"
} else if (time >= "15:00:00" && time < "19:00:00") {
    ucapanWaktu = "🌄𝐒𝐞𝐥𝐚𝐦𝐚𝐭 𝐒𝐨𝐫𝐞"
} else if (time >= "11:00:00" && time < "15:00:00") {
ucapanWaktu = "🏞️𝐒𝐞𝐥𝐚𝐦𝐚𝐭 𝐒𝐢𝐚𝐧𝐠"
} else if (time >= "06:00:00" && time < "11:00:00") {
    ucapanWaktu = "🏙️𝐒𝐞𝐥𝐚𝐦𝐚𝐭 𝐏𝐚𝐠𝐢"
} else {
    ucapanWaktu = "🌆𝐒𝐞𝐥𝐚𝐦𝐚𝐭 𝐒𝐮𝐛𝐮𝐡"
};
//function
const reSize = async(buffer, ukur1, ukur2) => {
   return new Promise(async(resolve, reject) => {
      let jimp = require('jimp')
      var baper = await jimp.read(buffer);
      var ab = await baper.resize(ukur1, ukur2).getBufferAsync(jimp.MIME_JPEG)
      resolve(ab)
   })
}
//module
module.exports = bot = async (bot, m, chatUpdate, store) => {
    try {
        const {
            type,
            quotedMsg,
            mentioned,
            now,
            fromMe
        } = m
        var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
var budy = (typeof m.text == 'string' ? m.text : '')
        //prefix 1
        var prefix = ['+', '/',','] ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0] : "" : xprefix
        const isCmd = body.startsWith(prefix, '')
        const isCmd2 = body.startsWith(prefix)
        const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
        const command2 = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const args = body.trim().split(/ +/).slice(1)
        const full_args = body.replace(command, '').slice(1).trim()
        const pushname = m.pushName || "No Name"
        const botNumber = await bot.decodeJid(bot.user.id)
        const itsMe = m.sender == botNumber ? true : false
        const sender = m.sender
        const text = q = args.join(" ")
        const from = m.key.remoteJid
        const fatkuns = (m.quoted || m)
        const quoted = (fatkuns.mtype == 'buttonsMessage') ? fatkuns[Object.keys(fatkuns)[1]] : (fatkuns.mtype == 'templateMessage') ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]] : (fatkuns.mtype == 'product') ? fatkuns[Object.keys(fatkuns)[0]] : m.quoted ? m.quoted : m
        const mime = (quoted.msg || quoted).mimetype || ''
        const qmsg = (quoted.msg || quoted)
        //media
        const isMedia = /image|video|sticker|audio/.test(mime)
        const isImage = (type == 'imageMessage')
        const isVideo = (type == 'videoMessage')
        const isAudio = (type == 'audioMessage')
        const isDocument = (type == 'documentMessage')
        const isLocation = (type == 'locationMessage')
        const isContact = (type == 'contactMessage')
        const isSticker = (type == 'stickerMessage')
        const isText = (type == 'textMessage')
        const isQuotedText = type === 'extendexTextMessage' && content.includes('textMessage')
        const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
        const isQuotedLocation = type === 'extendedTextMessage' && content.includes('locationMessage')
        const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
        const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
        const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
        const isQuotedContact = type === 'extendedTextMessage' && content.includes('contactMessage')
        const isQuotedDocument = type === 'extendedTextMessage' && content.includes('documentMessage')
       //prefix 2
        const pric = /^#.¦|\\^/.test(body) ? body.match(/^#.¦|\\^/gi) : xprefix
        const xeonybody = body.startsWith(pric)
        const isCommand = xeonybody ? body.replace(pric, '').trim().split(/ +/).shift().toLowerCase() : ""
        const sticker = []
       //group
        const isGroup = m.key.remoteJid.endsWith('@g.us')
        const groupMetadata = m.isGroup ? await bot.groupMetadata(m.chat).catch(e => {}) : ''
        
        const participants = m.isGroup ? await groupMetadata.participants : ''
        const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : ''
        const isGroupAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
        const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
        const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
        const groupOwner = m.isGroup ? groupMetadata.owner : ''
        const isGroupOwner = m.isGroup ? (groupOwner ? groupOwner : groupAdmins).includes(m.sender) : false
const Media = m.mtype
        //user status
const xeonverifieduser = fs.readFileSync('./list/Database/user.json')

        const isUser = xeonverifieduser.includes(sender)
        const Owner = [botNumber, ...owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isPremium= Owner || checkPremiumUser(m.sender, premium)
        expiredPremiumCheck(bot, m, premium)
async function sendbotMessage(chatId, message, options = {}){
    let generate = await generateWAMessage(chatId, message, options)
    let type2 = getContentType(generate.message)
    if ('contextInfo' in options) generate.message[type2].contextInfo = options?.contextInfo
    if ('contextInfo' in message) generate.message[type2].contextInfo = message?.contextInfo
    return await bot.relayMessage(chatId, generate.message, { messageId: generate.key.id })
}
if (global.autoRecording) {
        bot.sendPresenceUpdate('recording', from)
        }      
      if (global.autoTyping) {
        bot.sendPresenceUpdate('composing', from)
        }
        if (global.autorecordtype) {
        let xeonrecordin = ['recording','composing']
        let xeonrecordinfinal = xeonrecordin[Math.floor(Math.random() * xeonrecordin.length)]
        bot.sendPresenceUpdate(xeonrecordinfinal, from)

        }
 const groupName = isGroup ? groupMetadata.subject : "";
if (m.isGroup) {
    if (body.includes(`@254756182478`)) {
        reaction(m.chat, "👋")
    }
 }

        
if (m.message) {
    if (isCmd && !m.isGroup) {
        console.log(chalk.black(chalk.bgHex('#ff5e78').bold(`\n🌟 ${ucapanWaktu} 🌟`)));
        console.log(chalk.white(chalk.bgHex('#4a69bd').bold(`🚀 New Message! 🚀`)))
        console.log(chalk.black(chalk.bgHex('#fdcb6e')(`📅 DATE: ${new Date().toLocaleString()}
💬 MESSAGE: ${m.body || m.mtype}
🗣️ SENDERNAME: ${pushname}
👤 JIDS: ${m.sender}`
     )
   )
);
    } else if (m.isGroup) {
        console.log(chalk.black(chalk.bgHex('#ff5e78').bold(`\n🌟 ${ucapanWaktu} 🌟`)));
        console.log(chalk.white(chalk.bgHex('#4a69bd').bold(`🚀 New Message! 🚀`)));
        console.log(chalk.black(chalk.bgHex('#fdcb6e')(`📅 DATE: ${new Date().toLocaleString()}
💬 MESSAGE: ${m.body || m.mtype}
🗣️ SENDERNAME: ${pushname}
👤 JIDS: ${m.sender}
🔍 MESS LOCATION: ${groupName}`
       ))
     );
  }
}

const loli = {
  key: {
    fromMe: false,
    participant: "13135550002@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    orderMessage: {
      orderId: "2009",
      thumbnail: bot,
      itemCount: "9741",
      status: "INQUIRY",
      surface: "CATALOG",
      message: `Sender : @${m.sender.split('@')[0]}\nCommand : ${command}`,
      token: "AR6xBKbXZn0Xwmu76Ksyd7rnxI+Rx87HfinVlW4lwXa6JA=="
    }
  },
  contextInfo: {
    mentionedJid: ["120363369514105242@s.whatsapp.net"],
    forwardingScore: 999,
    isForwarded: true,
  }
}

//Reply function//
async function reply(teks) {
bot.sendMessage(m.chat, {
text: teks,
contextInfo: {
forwardingScore: 9,
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: "120363418618707597@newsletter",
newsletterName: "© Wa-Base bot - 2025"
}
}
}, {
quoted: m
})
}
const pickRandom = (arr) => {
return arr[Math.floor(Math.random() * arr.length)]
}
            var v16 = m.mtype === "interactiveResponseMessage" ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id : m.mtype === "conversation" ? m.message.conversation : m.mtype == "imageMessage" ? m.message.imageMessage.caption : m.mtype == "videoMessage" ? m.message.videoMessage.caption : m.mtype == "extendedTextMessage" ? m.message.extendedTextMessage.text : m.mtype == "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId : m.mtype == "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId : m.mtype == "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId : m.mtype == "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text : "";
         const v18 = /^[°zZ#$@+,.?=''():√%!¢£¥€π¤ΠΦ&><`™©®Δ^βα¦|/\\©^]/.test(v16) ? v16.match(/^[°zZ#$@+,.?=''():√%¢£¥€π¤ΠΦ&><!`™©®Δ^βα¦|/\\©^]/gi) : ".";
        const v20 = v16.replace(v18, "").trim().split(/ +/).shift().toLowerCase();
       const v51 = ["✅"];    
        const v52 = v51[Math.floor(Math.random() * v51.length)];
    const vF4 = p11 => {
      return bot.sendMessage(m.chat, {
        react: {
          text: p11,
          key: m.key
        }
      });
    };
if (isMedia && m.msg.fileSha256 && (m.msg.fileSha256.toString('base64') in global.db.data.sticker)) {
let hash = global.db.data.sticker[m.msg.fileSha256.toString('base64')]
let { text, mentionedJid } = hash
let messages = await generateWAMessage(m.chat, { text: text, mentions: mentionedJid }, {
    userJid: bot.user.id,
    quoted: m.quoted && m.quoted.fakeObj
})
messages.key.fromMe = areJidsSameUser(m.sender, bot.user.id)
messages.key.id = m.key.id
messages.pushName = m.pushName
if (m.isGroup) messages.participant = m.sender
let msg = {
    ...chatUpdate,
    messages: [proto.WebMessageInfo.fromObject(messages)],
    type: 'append'
}
bot.ev.emit('messages.upsert', msg)
}
//Command area(only case)
switch (isCommand) {
case 'starter': 
case 'menu': {
await bot.sendMessage(from, {react: {text: "💧", key: m.key}}); await sleep(10)
let allmenu = tennortimewisher + ` *@${sender.split("@")[0]}* 👋🏻
┏❐  ⌜ Wa -Base - Bot ⌟  ❐
┃⭔ Creator :Giddy Tennor 
┃⭔ Version : new version 
┃⭔ Type : Case
┃⭔ Status : Ready
┃⭔ Mode : ${bot.public ? '✱ Public ༣' : '✲ Self ༣'}
┃⭔ Prefix : Single 
┗❐
❐${prefix}ownermenu
❐${prefix}settingmenu
❐${prefix}othermenu
❐${prefix}ping
`
 await bot.sendMessage(m.chat, {  
            image: basepic,  
            caption: allmenu,   
            contextInfo: {
                mentionedJid: [m.sender],
                forwardedNewsletterMessageInfo: {
                    newsletterName: "𝐌𝐮𝐥𝐭𝐢 𝐃𝐞𝐯𝐢𝐜𝐞 𝐁𝐨𝐭",
                    newsletterJid: `120363418618707597@newsletter` 
                },
                isForwarded: true,
               externalAdReply: {
                   showAdAttribution: true,
                   title: `𝐍𝐞𝐰 𝐖𝐚-𝐁𝐚𝐬𝐞 𝐁𝐨𝐭`,
                   mediaType: 3,
                   renderLargerThumbnail: false,
                   thumbnailUrl: 'https://img12.pixhost.to/images/855/575167528_skyzopedia.jpg',
                   sourceUrl: ``
                }
            }
        },{ quoted: loli }
     ),
       await bot.sendMessage(m.chat, { 
           audio: { url: 'https://files.catbox.moe/qpllra.mp3' },
           mimetype: 'audio/mp4', 
           ptt: true 
       },{ quoted: loli }
     );
}
 break;
//==================================================//
case 'starterowner': 
case 'ownermenu': {
await bot.sendMessage(from, {react: {text: "💧", key: m.key}}); await sleep(10)
let allmenu = tennortimewisher + ` *@${sender.split("@")[0]}* 👋🏻
┏❐  ⌜ Wa -Base - Bot ⌟  ❐
┃⭔ Creator :Giddy Tennor 
┃⭔ Version : new version 
┃⭔ Type : Case
┃⭔ Status : Ready
┃⭔ Mode : ${bot.public ? '✱ Public ༣' : '✲ Self ༣'}
┃⭔ Prefix : Single 
┗❐
❐${prefix}self
❐${prefix}public 
❐${prefix}addprem 
❐${prefix}delprem
❐${prefix}device
`
 await bot.sendMessage(m.chat, {  
            image: basepic,  
            caption: allmenu,   
            contextInfo: {
                mentionedJid: [m.sender],
                forwardedNewsletterMessageInfo: {
                    newsletterName: "𝐌𝐮𝐥𝐭𝐢 𝐃𝐞𝐯𝐢𝐜𝐞 𝐁𝐨𝐭",
                    newsletterJid: `120363418618707597@newsletter` 
                },
                isForwarded: true,
               externalAdReply: {
                   showAdAttribution: true,
                   title: `𝐍𝐞𝐰 𝐖𝐚-𝐁𝐚𝐬𝐞 𝐁𝐨𝐭`,
                   mediaType: 3,
                   renderLargerThumbnail: false,
                   thumbnailUrl: 'https://img12.pixhost.to/images/855/575167528_skyzopedia.jpg',
                   sourceUrl: ``
                }
            }
        },{ quoted: loli }
     ),
       await bot.sendMessage(m.chat, { 
           audio: { url: 'https://files.catbox.moe/qpllra.mp3' },
           mimetype: 'audio/mp4', 
           ptt: true 
       },{ quoted: loli }
     );
}
 break;
//==================================================//

           
//==================================================//
case 'settingmenu': 
case 'settings': {
await bot.sendMessage(from, {react: {text: "💧", key: m.key}}); await sleep(10)
let allmenu = tennortimewisher + ` *@${sender.split("@")[0]}* 👋🏻
┏❐  ⌜ Wa -Base - Bot ⌟  ❐
┃⭔ Creator :Giddy Tennor 
┃⭔ Version : new version 
┃⭔ Type : Case
┃⭔ Status : Ready
┃⭔ Mode : ${bot.public ? '✱ Public ༣' : '✲ Self ༣'}
┃⭔ Prefix : Single 
┗❐
❐${prefix}autotype 
❐${prefix}autorecordtype 
❐${prefix}autorecorecord
`
 await bot.sendMessage(m.chat, {  
            image: basepic,  
            caption: allmenu,   
            contextInfo: {
                mentionedJid: [m.sender],
                forwardedNewsletterMessageInfo: {
                    newsletterName: "𝐌𝐮𝐥𝐭𝐢 𝐃𝐞𝐯𝐢𝐜𝐞 𝐁𝐨𝐭",
                    newsletterJid: `120363418618707597@newsletter` 
                },
                isForwarded: true,
               externalAdReply: {
                   showAdAttribution: true,
                   title: `𝐍𝐞𝐰 𝐖𝐚-𝐁𝐚𝐬𝐞 𝐁𝐨𝐭`,
                   mediaType: 3,
                   renderLargerThumbnail: false,
                   thumbnailUrl: 'https://img12.pixhost.to/images/855/575167528_skyzopedia.jpg',
                   sourceUrl: ``
                }
            }
        },{ quoted: loli }
     ),
       await bot.sendMessage(m.chat, { 
           audio: { url: 'https://files.catbox.moe/qpllra.mp3' },
           mimetype: 'audio/mp4', 
           ptt: true 
       },{ quoted: loli }
     );
}
 break;
//==================================================//
case 'others': 
case 'othermenu': {
await bot.sendMessage(from, {react: {text: "💧", key: m.key}}); await sleep(10)
let allmenu = tennortimewisher + ` *@${sender.split("@")[0]}* 👋🏻
┏❐  ⌜ Wa -Base - Bot ⌟  ❐
┃⭔ Creator :Giddy Tennor 
┃⭔ Version : new version 
┃⭔ Type : Case
┃⭔ Status : Ready
┃⭔ Mode : ${bot.public ? '✱ Public ༣' : '✲ Self ༣'}
┃⭔ Prefix : Single 
┗❐
       [𝐆𝐑𝐎𝐔𝐏]
❐${prefix}kick
❐${prefix}add
❐${prefix}kill 
❐${prefix}promote 
❐${prefix}demote
❐${prefix}hidetag
❐${prefix}tagall 

       [𝐃𝐎𝐖𝐋𝐎𝐀𝐃]
❐${prefix}play
❐${prefix}tt
❐${prefix}igdl
❐${prefix}fb
❐${prefix}lyrics 

       [𝐁𝐔𝐆𝐒]
❐${prefix}delay-invis
❐${prefix}delay
❐${prefix}ios-attack
`
 await bot.sendMessage(m.chat, {  
            image: basepic,  
            caption: allmenu,   
            contextInfo: {
                mentionedJid: [m.sender],
                forwardedNewsletterMessageInfo: {
                    newsletterName: "𝐌𝐮𝐥𝐭𝐢 𝐃𝐞𝐯𝐢𝐜𝐞 𝐁𝐨𝐭",
                    newsletterJid: `120363418618707597@newsletter` 
                },
                isForwarded: true,
               externalAdReply: {
                   showAdAttribution: true,
                   title: `𝐍𝐞𝐰 𝐖𝐚-𝐁𝐚𝐬𝐞 𝐁𝐨𝐭`,
                   mediaType: 3,
                   renderLargerThumbnail: false,
                   thumbnailUrl: 'https://img12.pixhost.to/images/855/575167528_skyzopedia.jpg',
                   sourceUrl: ``
                }
            }
        },{ quoted: loli }
     ),
       await bot.sendMessage(m.chat, { 
           audio: { url: 'https://files.catbox.moe/qpllra.mp3' },
           mimetype: 'audio/mp4', 
           ptt: true 
       },{ quoted: loli }
     );
}
 break;
//==================================================//
        case 'ping':
                          case 'p':
                            {
                              
                                   async function loading (jid) {
                             
                                    let start = new Date;
                                    let { key } = await bot.sendMessage(jid, {text: 'warte..'})
                                    let done = new Date - start;
                                    var lod = `*Pong*:\n> ⏱️ ${done}ms (${Math.round(done / 100) / 10}s)`
                                    
                                    await sleep(1000)
                                    await bot.sendMessage(jid, {text: lod, edit: key });
                                    }
                                    loading(from)
                                   
                            }       
                            break;
        //==================================================//
        case 'public': {
if (!Owner) return reply(mess.owner)
bot.public = true
reply('Sukses changed to public mode')
}
break

case 'self': {
if (!Owner) return reply(mess.owner)
bot.public = false
reply('Success changed to self mode')
}
break
       //==================================================//
case 'kick': {
if (!isGroup) return reply(mess.group)
if (!isBotAdmins) return reply("bot must be admin first")
if (!Owner) return reply(mess.owner)
let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await bot.groupParticipantsUpdate(m.chat, [users], 'remove')
reply(`Sukses kick @${users.split('@')[0]}`)
}
break
//==================================================//      
        case 'add': {
if (!isGroup) return reply(mess.group)
if (!isBotAdmins) return reply(mess.group)
if (!Owner) return reply(mess.owner)
let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await bot.groupParticipantsUpdate(m.chat, [users], 'add').then((res) => reply(util.format(res))).catch((err) => reply(util.format(err)))
}
break
//==================================================//      
case 'h':
case 'hidetag': {
if (!isGroup) return reply(mess.group)
if (!Owner) return reply(mess.owner)
if (m.quoted) {
bot.sendMessage(m.chat, {
forward: m.quoted.fakeObj,
mentions: participants.map(a => a.id)
})
}
if (!m.quoted) {
bot.sendMessage(m.chat, {
text: q ? q : '',
mentions: participants.map(a => a.id)
}, {
quoted: m
})
}
}
break //==================================================//      
        case 'tagall': {
if (!isGroup) return reply(mess.group)
if (!Owner) return reply(mess.owner)
if (!text) return reply("woi")
bot.sendMessage(m.chat, {
text: "@" + m.chat,
contextInfo: {
mentionedJid: (await (await bot.groupMetadata(m.chat)).participants).map(a => a.id),
groupMentions: [
{
groupJid: m.chat,
groupSubject: text
}
]
}
}, {
quoted: m
})
}
break
//==================================================//      
        case "promote": case "promot": {
if (!isGroup) return m.reply(`for group only`)
if (!isAdmins && !Owner) return m.reply(`Command reserved for group admins only`)
if (!isBotAdmins) return m.reply(`bot is not an admin idiot`)
if (m.quoted || text) {
let target = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await bot.groupParticipantsUpdate(m.chat, [target], 'promote').then((res) => m.reply(`User ${target.split("@")[0]} is now an admin`)).catch((err) => m.reply(err.toString()))
} else return m.reply('Example: 254XXX/@tag')}
break  
//==================================================//        
        case "demote": case "demote": {
if (!isGroup) return m.reply(mess.group)
if (!isAdmins && !Owner) return m.reply(mess.admin)
if (!isBotAdmins) return m.reply(`bot is not an admin in this group`)
if (m.quoted || text) {
let target = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await bot.groupParticipantsUpdate(m.chat, [target], 'demote').then((res) => m.reply(`Member ${target.split("@")[0]} is no longer an admin in this group`)).catch((err) => m.reply(err.toString()))
} else return m.reply('example:254XX')}
break
//==================================================//    
                 case "kill": {
	  if (!m.isGroup) return m.reply(mess.group)
          if (!Owner) return m.reply(mess.owner)
 if (!isBotAdmins) return m.reply(`bot is not admin in the group`)
          let raveni = participants.filter(_0x5202af => _0x5202af.id != bot.decodeJid(bot.user.id)).map(_0x3c0c18 => _0x3c0c18.id);
		      
          m.reply("Initializing Kill command💀...");
      
      await bot.removeProfilePicture(m.chat);
      await bot.groupUpdateSubject(m.chat, "Xxx Videos Hub");
      await bot.groupUpdateDescription(m.chat, "//This group is no longer available 🥹!");
      
	
          setTimeout(() => {
            bot.sendMessage(m.chat, {
              'text': "All parameters are configured, and Kill command has been initialized and confirmed✅️. Now, all " + raveni.length + " group participants will be removed in the next second.\n\nGoodbye Everyone 👋\n\nTHIS PROCESS IS IRREVERSIBLE ⚠️"
            }, {
              'quoted': m
            });
            setTimeout(() => {
              bot.groupParticipantsUpdate(m.chat, raveni, "remove");
              setTimeout(() => {
                m.reply("Succesfully removed All group participants✅️.\n\nGoodbye group owner 👋, its too cold in here 🥶.");
bot.groupLeave(m.chat);	      
              }, 1000);
            }, 1000);
          }, 1000);
        };	      
          break; //==================================================//      
        case 'autorecordtype':

                if (!Owner) return reply(mess.owner)

                if (args.length < 1) return reply(`Example ${prefix + command} on/off`)

                if (q === 'on') {

                    autorecordtype = true

                    reply(`Successfully changed auto recording and typing to ${q}`)

                } else if (q === 'off') {

                    autorecordtype = false

                    reply(`Successfully changed auto recording and typing to ${q}`)

                }

                break  
//==================================================//
        case 'autotyping':
                if (!Owner) return reply(mess.owner)
                if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
                if (q === 'on') {
                    autoTyping = true
                    reply(`Successfully changed auto-typing to ${q}`)
                } else if (q === 'off') {
                    autoTyping = false
                    reply(`Successfully changed auto-typing to ${q}`)
                }
                break
//==================================================//     
        case "play":{
                if (!text) return reply(`\n*ex:* ${prefix + command} impossible\n`)
                
               await reply(`processing your request`);
                let mbut = await fetchJson(`https://ochinpo-helper.hf.space/yt?query=${text}`)
                let ahh = mbut.result
                let crot = ahh.download.audio

                bot.sendMessage(m.chat, {
                    audio: { url: crot },
                    mimetype: "audio/mpeg", 
                    ptt: true
                }, { quoted: loli })
            }
            break
//==================================================//      
        case 'tiktok': case "tt": { 
             
    if (!text) return m.reply(`Example : ${prefix + command} link`);
    if (!text.includes('tiktok')) return m.reply(`Link Invalid!!`);
    reply("Please Wait..");
    
    // Menggunakan fetch untuk akses API TikTok milikmu
    fetch(`https://api.tiklydown.eu.org/api/download/v5?url=${encodeURIComponent(text)}`)
        .then(response => response.json())
        .then(data => {
            if (data.status !== 200) return m.reply('Api error');
            
            // Mengambil URL video dan audio
        const title = `*Successfully*`
            const videoUrl = data.result.play;
            const audioUrl = data.result.music;
            
            // Mengirim video dan audio
            bot.sendMessage(m.chat, { caption: title, video: { url: videoUrl }}, { quoted: m });
            bot.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mp4' }, { quoted: null });
        })
        .catch(err => reply(err.toString()));
}
break;
        case 'fb': case 'facebook': case 'fbdl':
case 'ig': case 'instagram': case 'igdl': {
 if (!args[0]) return m.reply("🔗 provide a fb or ig link!");
 try {
 const axios = require('axios');
 const cheerio = require('cheerio');
 async function yt5sIo(url) {
 try {
 const form = new URLSearchParams();
 form.append("q", url);
 form.append("vt", "home");
 const { data } = await axios.post('https://yt5s.io/api/ajaxSearch', form, {
 headers: {
 "Accept": "application/json",
 "X-Requested-With": "XMLHttpRequest",
 "Content-Type": "application/x-www-form-urlencoded",
 },
 });
 if (data.status !== "ok") throw new Error("provide a valid link.");
 const $ = cheerio.load(data.data); 
 if (/^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+/i.test(url)) {
 const thumb = $('img').attr("src");
 let links = [];
 $('table tbody tr').each((_, el) => {
 const quality = $(el).find('.video-quality').text().trim();
 const link = $(el).find('a.download-link-fb').attr("href");
 if (quality && link) links.push({ quality, link });
 });
 if (links.length > 0) {
 return { platform: "facebook", type: "video", thumb, media: links[0].link };
 } else if (thumb) {
 return { platform: "facebook", type: "image", media: thumb };
 } else {
 throw new Error("media is invalid.");
 }
 } else if (/^(https?:\/\/)?(www\.)?(instagram\.com\/(p|reel)\/).+/i.test(url)) {
 const video = $('a[title="Download Video"]').attr("href");
 const image = $('img').attr("src");
 if (video) {
 return { platform: "instagram", type: "video", media: video };
 } else if (image) {
 return { platform: "instagram", type: "image", media: image };
 } else {
 throw new Error("Media invalid.");
 }
 } else {
 throw new Error("provide a valid url or link.");
 }
 } catch (error) {
 return { error: error.message };
 }
 }
 await bot.sendMessage(m.chat, {
 react: {
 text: "⏳",
 key: m.key,
 }
 });
 let res = await yt5sIo(args[0]);
 if (res.error) {
 await bot.sendMessage(m.chat, {
 react: {
 text: "❌",
 key: m.key,
 }
 });
 return m.reply(`⚠ *Error:* ${res.error}`);
 }
 if (res.type === "video") {
 await bot.sendMessage(m.chat, {
 react: {
 text: "⏳",
 key: m.key,
 }
 });
 await bot.sendMessage(m.chat, { video: { url: res.media }, caption: "✅ *Downloaded by Simple Wa-Bot!*" }, { quoted: m });
 } else if (res.type === "image") {
 await bot.sendMessage(m.chat, {
 react: {
 text: "⏳",
 key: m.key,
 }
 });
 await bot.sendMessage(m.chat, { image: { url: res.media }, caption: "✅ *Downloaded photo by Simple Wa Base!*" }, { quoted: m });
 }
 } catch (error) {
 console.error(error);
 await bot.sendMessage(m.chat, {
 react: {
 text: "❌",
 key: m.key,
 }
 });
 m.reply("failed to get media.");
 }
}
break   //==================================================//     
        case 'lyrics': {
  if (!q) return m.reply('Example: lyrics <keyword>,<amount>\n\nExample: lyrics duka,3')
  let [keyword, jumlah] = q.split(',').map(v => v.trim())
  if (!keyword) return m.reply('provide a valid key word')
  jumlah = parseInt(jumlah) || 3

  try {
    let res = await fetch(`https://apikey.sazxofficial.web.id/api/search/lyrics?q=${encodeURIComponent(keyword)}`)
    let data = await res.json()
    if (!data.status || !data.result || data.result.length === 0) {
      return m.reply('Lyrics not found.')
    }
    let hasil = data.result.slice(0, jumlah).map((item, i) => {
      return `*${i + 1}. ${item.title}* - _${item.artist}_\n\n${item.lyricSingkat.trim()}\n`
    }).join('\n────────────\n\n')
    m.reply(`*Downloaded Lyrics: ${keyword}*\n\n${hasil}`)
  } catch (e) {
    console.error(e)
    m.reply('an error has occurred while fetching lyrics.')
  }
}
  break
//==================================================//
default:
if (budy.startsWith('=>')) {
if (!Owner) return reply(mess.owner)
function Return(sul) {
sat = JSON.stringify(sul, null, 2)
bang = util.format(sat)
if (sat == undefined) {
bang = util.format(sul)
}
return reply(bang)
}
try {
reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
} catch (e) {
reply(String(e))
}
}

if (budy.length > 100000) {
if (sender == botNumber) return
if (!isGroup) return afgan.updateBlockStatus(m.sender, 'block')
}
//==================================================//
if (budy.startsWith("#")) {
if (!Owner) return reply(mess.owner)
try {
let evaled = await eval(q)
if (typeof evaled !== "string") evaled = util.inspect(evaled)
} catch (e) {
console.log(e)
}
}
//==================================================//
if (budy.startsWith('_')) {
if (!Owner) return reply(mess.owner)
exec(budy.slice(2), (err, stdout) => {
if (err) return reply(`${err}`)
if (stdout) return reply(stdout)
})
}
}
    } catch (err) {
        console.log(require("util").format(err));
    }
};
//==================================================//
process.on('uncaughtException', function (err) {
console.log('Caught exception: ', err)
})
//==================================================//
let file = require.resolve(__filename) 
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.cyan("File Update => "),
chalk.cyan.bgBlue.bold(`${__filename}`))
delete require.cache[file]
require(file)
})