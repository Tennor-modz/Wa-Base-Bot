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
global.SESSION_ID = process.env.SESSION_ID ||'Bellah~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiME5SWlF0U09rQnpPb00xeWM3ZUxjcnY5aVkzSDNnQndUVHcrMjNWdUQyST0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ2prVVFHclk1WHdyYkwyNnBRVFBSNC9RbDhHTGxKWFU5K2NPcVB2clp6Yz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJzSlZpRjNmMUdPcWl1V0pIUldEbHR0TzZxYTNNQ0dQQ2JuWkkwTkkveDF3PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJyOXNzRXZ2OUpFQVBvYzMyczM5NUI2SmJOSXFjRldKSTF4YTR1TThOYjJZPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik9CN0NkaVJqZ01RR1ZaRElDSmNtemNIZDAyU21HSm1NbzlsWTBsb2VFMFE9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik4rTFM3SUNPOERBT2ZlN0lXZHl5MW1FUEg4bC9IK2d1Nkd5SVQvNmpxekU9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTU1XU2RPM2VZVjE0MVh0UW5pbHVYZzlqYlJSdHcyVWMwd3pJc1E0MDRGYz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNjVzSmdQSHdvZzJMaWtDa2ErVkxZWkwyQlA0NVlXdXczeHZpVERSQzNtZz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImZJMjF3ZERBRTkyaCsrczJRUUVJSTdneERaTVdQRFY0YlUyS2dFclhkS1NtcytGL05tLzQ5NzhuZzlhaEpIRnlGazlPNlI2bGZMa3J2Rmg5Y0h5UEJ3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTYwLCJhZHZTZWNyZXRLZXkiOiJBMlJUbDBzdDJQejlLSXRZaVlqN29OeG5uZkxaWm5uQ3pHTlRIYTJBY2NRPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJHbFRCVTY2UVJVaThmQllGeE05ZW5nIiwicGhvbmVJZCI6IjViYmVlNWEwLTZjMTUtNDRiNy1hNGI3LTc0NzJiOTJmODlkNCIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ1dVR4UnAycTF6eHFWNlpKZHdGelZDYk1CdnM9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRFdFcmNWLzJPeFdPcVFtWUhHSm5pNFhDMGswPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6Ik1CVVZJSU1EIiwibWUiOnsiaWQiOiIyNTQ3NTYxODI0Nzg6OEBzLndoYXRzYXBwLm5ldCIsImxpZCI6IjMxOTUwOTE2MDcxNjY3OjhAbGlkIn0sImFjY291bnQiOnsiZGV0YWlscyI6IkNLMzI3TjhHRUorSHVNRUdHQWNnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJvc2t4OGw4cWdQb3lOQkx4MEtWaTkxc2dXVmxwbFIwMFNMcjgzVUlUK1ZZPSIsImFjY291bnRTaWduYXR1cmUiOiJObi90SElIOTdBeFJ0RDkvNFd4azJoZDZ6UUZrWHlwMmR1QVB6dU9uSlRsU1RMd2VBK0NJSmRYQ3R5aXRwRTVpZ1BoT09GTkhBOGVDc0tudnNnNFdBZz09IiwiZGV2aWNlU2lnbmF0dXJlIjoiVHJORjJ2T0w2ci96WEtGaDZHM3JscmluNTEvcFlMeGcwb2ttSXdweGdISHZyNTZOb0V5SHJGVXdORnNmbm1pOTZjT2FQVU53Y1pUaENzeTZrNE5ZRHc9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiIyNTQ3NTYxODI0Nzg6OEBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJhTEpNZkpmS29ENk1qUVM4ZENsWXZkYklGbFphWlVkTkVpNi9OMUNFL2xXIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQklJQlE9PSJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NDc4NDYwNjAsImxhc3RQcm9wSGFzaCI6IjNSOVozOSIsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBQmJtIn0=' 
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
