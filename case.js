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
const fg = require('api-dylux');
const axios = require('axios');
const yts = require("yt-search");
const { igdl } = require("btch-downloader");
const util = require('util');
const fetch = require('node-fetch');
const { exec } = require('child_process');
const path = require('path');
const chalk = require('chalk');
const { writeFile } = require('./library/utils');

// =============== COLORS ===============
const colors = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    white: "\x1b[37m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    magenta: "\x1b[35m",
    bgGreen: "\x1b[42m",
};

// =============== HELPERS ===============
function formatUptime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
}

function stylishReply(text) {
    return `\`\`\`\n${text}\n\`\`\``;
}

function checkFFmpeg() {
    return new Promise((resolve) => {
        exec("ffmpeg -version", (err) => resolve(!err));
    });
}

// ======= Dummy jidDecode for safety =======
function jidDecode(jid) {
    const [user, server] = jid.split(':');
    return { user, server };
}

// =============== MAIN FUNCTION ===============
module.exports = async function handleCommand(trashcore, m, command, isGroup, isAdmin, groupAdmins,isBotAdmins,groupMeta,config) {

    // ======= Safe JID decoding =======
    trashcore.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server ? `${decode.user}@${decode.server}` : jid;
        } else return jid;
    };
    const from = trashcore.decodeJid(m.key.remoteJid);
    const sender = m.key.participant || m.key.remoteJid;
    const participant = trashcore.decodeJid(m.key.participant || from);
    const pushname = m.pushName || "Unknown User";
    const chatType = from.endsWith('@g.us') ? 'Group' : 'Private';
    const chatName = chatType === 'Group' ? (groupMeta?.subject || 'Unknown Group') : pushname;
// Safe owner check
const botNumber = trashcore.user.id.split(":")[0] + "@s.whatsapp.net";
const senderJid = m.key.participant || m.key.remoteJid;
const isOwner = senderJid === botNumber;
    const reply = (text) => trashcore.sendMessage(from, { text: stylishReply(text) }, { quoted: m });

    const ctx = m.message.extendedTextMessage?.contextInfo || {};
    const quoted = ctx.quotedMessage;
    const quotedSender = trashcore.decodeJid(ctx.participant || from);
    const mentioned = ctx.mentionedJid?.map(trashcore.decodeJid) || [];

    const body = m.message.conversation || m.message.extendedTextMessage?.text || '';
    const args = body.trim().split(/ +/).slice(1);
    const text = args.join(" ");

    const time = new Date().toLocaleTimeString();
    

console.log(
  chalk.bgHex('#8B4513').white.bold(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📥 INCOMING MESSAGE (${time})
👤 From: ${pushname} (${participant})
💬 Chat Type: ${chatType} - ${chatName}
🏷️ Command: ${command || "—"}
💭 Message: ${body || "—"}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
);
// --- 🚨 ANTILINK 2.0 AUTO CHECK ---
if (isGroup && global.antilink && global.antilink[from]?.enabled) {
    const linkPattern = /(https?:\/\/[^\s]+)/gi;
    const bodyText = body || '';

    if (linkPattern.test(bodyText)) {
        const settings = global.antilink[from];
        const groupMeta = await trashcore.groupMetadata(from);
        const groupAdmins = groupMeta.participants.filter(p => p.admin).map(p => p.id);
        const botNumber = trashcore.user.id.split(":")[0] + "@s.whatsapp.net";
        const isBotAdmin = groupAdmins.includes(botNumber);
        const isSenderAdmin = groupAdmins.includes(sender);

        if (!isSenderAdmin && isBotAdmin) {
            try {
                await trashcore.sendMessage(from, { delete: m.key });
                await trashcore.sendMessage(from, {
                    text: `🚫 *Link detected and removed!*\nUser: @${sender.split('@')[0]}\nAction: ${settings.mode.toUpperCase()}`,
                    mentions: [sender],
                });

                if (settings.mode === "kick") {
                    await trashcore.groupParticipantsUpdate(from, [sender], "remove");
                }
            } catch (err) {
                console.error("Antilink Enforcement Error:", err);
            }
        }
    }
}
if (!trashcore.isPublic && !isOwner) {
    return; // ignore all messages from non-owner when in private mode
}
    try {
        switch (command) {
            // ================= PING =================
            case 'ping':
            case 'alive': {
                const start = Date.now();
                await reply("⏳ Pinging...");
                const end = Date.now();
                const latency = end - start;
                await reply(`Pong!
 Latency: ${latency}ms
Uptime: ${formatUptime(process.uptime())}
 Owner: Trashcore`);
                break;
            }

            // ================= MENU =================
            case 'menu':
            case 'help': {
                const menuText = `👑 Creator: Trashcore
📝 Type: Base Script
⚡ Version: 3.0.0
📦 Module: Case

|COMMANDS|

📊 SYSTEM
• ping 
• public 
• private 

🥁 ANALYSIS 
• weather 
• checktime 
• gitclone 
• save 

🛟 MEDIA
• tiktok
• play
• igdl
• fb
• video 
• playdoc

👥 GROUP
• add
• kick
• promote 
• demote
• antilink
• tagall
• hidetag

👤 BASIC
• copilot
• >
• <
• =>`;
                const videoPath = './media/menu.mp4';
                try {
                    await trashcore.sendMessage(from, {
                        video: { url: videoPath },
                        caption: stylishReply(menuText),
                        gifPlayback: true
                    }, { quoted: m });
                } catch (err) {
                    console.error('Menu video failed:', err);
                    await reply(menuText);
                }
                break;
            }

            // ================= WEATHER =================
            case 'weather': {
                try {
                    if (!text) return reply("🌍 Please provide a city or town name!");
                    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${text}&units=metric&appid=1ad47ec6172f19dfaf89eb3307f74785`);
                    const data = await response.json();
                    if (data.cod !== 200) return reply("❌ Unable to find that location. Please check the spelling.");

                    const weatherText = `
🌤️ *Weather Report for ${data.name}*
🌡️ Temperature: ${data.main.temp}°C
🌬️ Feels Like: ${data.main.feels_like}°C
🌧️ Rain Volume: ${data.rain?.['1h'] || 0} mm
☁️ Cloudiness: ${data.clouds.all}%
💧 Humidity: ${data.main.humidity}%
🌪️ Wind Speed: ${data.wind.speed} m/s
📝 Condition: ${data.weather[0].description}
🌄 Sunrise: ${new Date(data.sys.sunrise*1000).toLocaleTimeString()}
🌅 Sunset: ${new Date(data.sys.sunset*1000).toLocaleTimeString()}
`;
                    await reply(weatherText);
                } catch (e) {
                    console.error("Weather command error:", e);
                    reply("❌ Unable to retrieve weather information.");
                }
                break;
            }

            // ================= CHECKTIME =================
            case 'checktime':
            case 'time': {
                try {
                    if (!text) return reply("🌍 Please provide a city or country name to check the local time.");
                    await reply(`⏳ Checking local time for *${text}*...`);
                    const tzRes = await fetch(`https://worldtimeapi.org/api/timezone`);
                    const timezones = await tzRes.json();
                    const match = timezones.find(tz => tz.toLowerCase().includes(text.toLowerCase()));
                    if (!match) return reply(`❌ Could not find timezone for *${text}*.`);
                    const res = await fetch(`https://worldtimeapi.org/api/timezone/${match}`);
                    const data = await res.json();
                    const datetime = new Date(data.datetime);
                    const hours = datetime.getHours();
                    const greeting = hours < 12 ? "🌅 Good Morning" : hours < 18 ? "🌞 Good Afternoon" : "🌙 Good Evening";
                    const timeText = `
🕒 Local Time in ${text}
${greeting} 👋
📍 Timezone: ${data.timezone}
⏰ Time: ${datetime.toLocaleTimeString()}
📆 Date: ${datetime.toDateString()}
⏱️ Uptime: ${formatUptime(process.uptime())}`;
                    await reply(timeText);
                } catch (e) {
                    console.error("checktime error:", e);
                    reply("❌ Unable to fetch time for that city.");
                }
                break;
            }

            // ================= GITCLONE =================
            case 'gitclone': {
                try {
                    if (!args[0]) return reply("❌ Provide a GitHub repo link.");
                    if (!args[0].includes('github.com')) return reply("❌ Not a valid GitHub link!");
                    const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
                    let [, user, repo] = args[0].match(regex) || [];
                    repo = repo.replace(/.git$/, '');
                    const zipUrl = `https://api.github.com/repos/${user}/${repo}/zipball`;
                    const head = await fetch(zipUrl, { method: 'HEAD' });
                    const contentDisp = head.headers.get('content-disposition');
                    const filenameMatch = contentDisp?.match(/attachment; filename=(.*)/);
                    const filename = filenameMatch ? filenameMatch[1] : `${repo}.zip`;
                    await trashcore.sendMessage(from, { document: { url: zipUrl }, fileName: filename, mimetype: 'application/zip' }, { quoted: m });
                    await reply(`✅ Successfully fetched repository: *${user}/${repo}*`);
                } catch (err) {
                    console.error("gitclone error:", err);
                    await reply("❌ Failed to clone repository.");
                }
                break;
            }

            // ================= SAVE STATUS =================
            case 'save': {
                try {
                    if (!quoted) return reply("❌ Reply to a status message!");
                    const mediaBuffer = await trashcore.downloadMediaMessage(quoted);
                    if (!mediaBuffer) return reply("🚫 Could not download media. It may have expired.");
                    let payload;
                    if (quoted.imageMessage) payload = { image: mediaBuffer, caption: quoted.imageMessage.caption || "📸 Saved status image", mimetype: "image/jpeg" };
                    else if (quoted.videoMessage) payload = { video: mediaBuffer, caption: quoted.videoMessage.caption || "🎥 Saved status video", mimetype: "video/mp4" };
                    else return reply("❌ Only image/video statuses are supported!");
                    await trashcore.sendMessage(m.sender, payload, { quoted: m });
                    await reply("✅ Status saved!");
                } catch (err) {
                    console.error("Save error:", err);
                    reply("❌ Failed to save status.");
                }
                break;
            }

            // ================= IG/FB DL =================
            case 'fb':
            case 'facebook':
            case 'fbdl':
            case 'ig':
            case 'instagram':
            case 'igdl': {
                if (!args[0]) return reply(`🔗 Provide a Facebook or Instagram link!\n\nExample: ${command} <link>`);
                try {
                    const axios = require('axios');
                    const cheerio = require('cheerio');

                    const progressMsg = await trashcore.sendMessage(from, { text: stylishReply("⏳ Fetching media... Please wait!") }, { quoted: m });

                    async function fetchMedia(url) {
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

                            if (data.status !== "ok") throw new Error("Provide a valid link.");
                            const $ = cheerio.load(data.data);

                            if (/^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+/i.test(url)) {
                                const thumb = $('img').attr("src");
                                let links = [];
                                $('table tbody tr').each((_, el) => {
                                    const quality = $(el).find('.video-quality').text().trim();
                                    const link = $(el).find('a.download-link-fb').attr("href");
                                    if (quality && link) links.push({ quality, link });
                                });
                                if (links.length > 0) return { platform: "facebook", type: "video", thumb, media: links[0].link };
                                if (thumb) return { platform: "facebook", type: "image", media: thumb };
                                throw new Error("Media is invalid.");
                            } else if (/^(https?:\/\/)?(www\.)?(instagram\.com\/(p|reel)\/).+/i.test(url)) {
                                const video = $('a[title="Download Video"]').attr("href");
                                const image = $('img').attr("src");
                                if (video) return { platform: "instagram", type: "video", media: video };
                                if (image) return { platform: "instagram", type: "image", media: image };
                                throw new Error("Media invalid.");
                            } else {
                                throw new Error("Provide a valid URL or link.");
                            }
                        } catch (err) {
                            return { error: err.message };
                        }
                    }

                    const res = await fetchMedia(args[0]);
                    if (res.error) {
                        await trashcore.sendMessage(from, { react: { text: "❌", key: m.key } });
                        return reply(`⚠️ Error: ${res.error}`);
                    }

                    await trashcore.sendMessage(from, { text: stylishReply("⏳ Media found! Downloading now...") }, { quoted: m });

                    if (res.type === "video") {
                        await trashcore.sendMessage(from, { video: { url: res.media }, caption: stylishReply(`✅ Downloaded video from ${res.platform}!`) }, { quoted: m });
                    } else if (res.type === "image") {
                        await trashcore.sendMessage(from, { image: { url: res.media }, caption: stylishReply(`✅ Downloaded photo from ${res.platform}!`) }, { quoted: m });
                    }

                    await trashcore.sendMessage(from, { text: stylishReply("✅ Done!") }, { quoted: m });

                } catch (error) {
                    console.error(error);
                    await trashcore.sendMessage(from, { react: { text: "❌", key: m.key } });
                    return reply("❌ Failed to get media.");
                }
                break;
            }

            // ================= TIKTOK =================
            case 'tiktok': {
                try {
                    if (!args[0]) return reply(`⚠️ Provide a TikTok link.`);
                    await reply("⏳ Fetching TikTok data...");
                    const data = await fg.tiktok(args[0]);
                    const json = data.result;
                    let caption = `🎵 [TIKTOK DOWNLOAD]\n\n`;
                    caption += `◦ Id: ${json.id}\n`;
                    caption += `◦ Username: ${json.author.nickname}\n`;
                    caption += `◦ Title: ${json.title}\n`;
                    caption += `◦ Likes: ${json.digg_count}\n`;
                    caption += `◦ Comments: ${json.comment_count}\n`;
                    caption += `◦ Shares: ${json.share_count}\n`;
                    caption += `◦ Plays: ${json.play_count}\n`;
                    caption += `◦ Created: ${json.create_time}\n`;
                    caption += `◦ Size: ${json.size}\n`;
                    caption += `◦ Duration: ${json.duration}`;

                    if (json.images && json.images.length > 0) {
                        for (const imgUrl of json.images) {
                            await trashcore.sendMessage(from, { image: { url: imgUrl } }, { quoted: m });
                        }
                    } else {
                        await trashcore.sendMessage(from, { video: { url: json.play }, mimetype: 'video/mp4', caption: stylishReply(caption) }, { quoted: m });
                        setTimeout(async () => {
                            await trashcore.sendMessage(from, { audio: { url: json.music }, mimetype: 'audio/mpeg' }, { quoted: m });
                        }, 3000);
                    }
                } catch (err) {
                    console.error("TikTok command error:", err);
                    return reply("❌ Failed to fetch TikTok data. Make sure the link is valid.");
                }
                break;
            }
case 'video': {
    try {
        if (!text) return reply('❌ What video do you want to download?');

        let videoUrl = '';
        let videoTitle = '';
        let videoThumbnail = '';

        if (text.startsWith('http://') || text.startsWith('https://')) {
            videoUrl = text;
        } else {
            const { videos } = await yts(text);
            if (!videos || videos.length === 0) return reply('❌ No videos found!');
            videoUrl = videos[0].url;
            videoTitle = videos[0].title;
            videoThumbnail = videos[0].thumbnail;
        }

        const izumi = { baseURL: "https://izumiiiiiiii.dpdns.org" };
        const AXIOS_DEFAULTS = {
            timeout: 60000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*'
            }
        };

        const tryRequest = async (getter, attempts = 3) => {
            let lastError;
            for (let attempt = 1; attempt <= attempts; attempt++) {
                try { return await getter(); } 
                catch (err) { 
                    lastError = err; 
                    if (attempt < attempts) await new Promise(r => setTimeout(r, 1000 * attempt));
                }
            }
            throw lastError;
        };

        const getIzumiVideoByUrl = async (youtubeUrl) => {
            const apiUrl = `${izumi.baseURL}/downloader/youtube?url=${encodeURIComponent(youtubeUrl)}&format=720`;
            const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
            if (res?.data?.result?.download) return res.data.result;
            throw new Error('Izumi API returned no download');
        };

        const getOkatsuVideoByUrl = async (youtubeUrl) => {
            const apiUrl = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp4?url=${encodeURIComponent(youtubeUrl)}`;
            const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
            if (res?.data?.result?.mp4) {
                return { download: res.data.result.mp4, title: res.data.result.title };
            }
            throw new Error('Okatsu API returned no mp4');
        };

        // Send thumbnail
        try {
            const ytId = (videoUrl.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/) || [])[1];
            const thumb = videoThumbnail || (ytId ? `https://i.ytimg.com/vi/${ytId}/sddefault.jpg` : undefined);
            const captionTitle = videoTitle || text;
            if (thumb) {
                await trashcore.sendMessage(from, {
                    image: { url: thumb },
                    caption: `🎬 *Title:* ${captionTitle}\n📥 Download your video below!`,
                }, { quoted: m });
            }
        } catch (e) {
            console.error('[VIDEO] Thumbnail Error:', e?.message || e);
        }

        // Validate YouTube URL
        const urls = videoUrl.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/gi);
        if (!urls) return reply('❌ This is not a valid YouTube link!');

        // Try downloading video
        let videoData;
        try { videoData = await getIzumiVideoByUrl(videoUrl); } 
        catch (e1) {
            console.warn('[VIDEO] Izumi failed, trying Okatsu:', e1?.message || e1);
            videoData = await getOkatsuVideoByUrl(videoUrl);
        }

        await trashcore.sendMessage(from, {
            video: { url: videoData.download },
            mimetype: 'video/mp4',
            fileName: `${videoData.title || videoTitle || 'video'}.mp4`,
            caption: `🎥 *Video:* ${videoData.title || videoTitle || 'Unknown'}\n`,
        }, { quoted: m });

    } catch (error) {
        console.error('[VIDEO] Command Error:', error?.message || error);
        reply('❌ Download failed: ' + (error?.message || 'Unknown error'));
    }
    break;
}
            // ================= PLAY =================
            case 'play': {
                try {
                    const tempDir = path.join(__dirname, "temp");
                    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

                    if (!args.length) return reply(`🎵 Provide a song name!\nExample: ${command} Not Like Us`);

                    const query = args.join(" ");
                    if (query.length > 100) return reply(`📝 Song name too long! Max 100 chars.`);

                    await reply("🎧 Searching for the track... ⏳");

                    const searchResult = await (await yts(`${query} official`)).videos[0];
                    if (!searchResult) return reply("😕 Couldn't find that song. Try another one!");

                    const video = searchResult;
                    const apiUrl = `https://api.privatezia.biz.id/api/downloader/ytmp3?url=${encodeURIComponent(video.url)}`;
                    const response = await axios.get(apiUrl);
                    const apiData = response.data;

                    if (!apiData.status || !apiData.result || !apiData.result.downloadUrl) throw new Error("API failed to fetch track!");

                    const timestamp = Date.now();
                    const fileName = `audio_${timestamp}.mp3`;
                    const filePath = path.join(tempDir, fileName);

                    // Download MP3
                    const audioResponse = await axios({ method: "get", url: apiData.result.downloadUrl, responseType: "stream", timeout: 600000 });
                    const writer = fs.createWriteStream(filePath);
                    audioResponse.data.pipe(writer);
                    await new Promise((resolve, reject) => { writer.on("finish", resolve); writer.on("error", reject); });

                    if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) throw new Error("Download failed or empty file!");

                    await trashcore.sendMessage(from, { text: stylishReply(`🎶 Playing *${apiData.result.title || video.title}* 🎧`) }, { quoted: m });
                    await trashcore.sendMessage(from, { audio: { url: filePath }, mimetype: "audio/mpeg", fileName: `${(apiData.result.title || video.title).substring(0, 100)}.mp3` }, { quoted: m });

                    // Cleanup
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

                } catch (error) {
                    console.error("Play command error:", error);
                    return reply(`💥 Error: ${error.message}`);
                }
                break;
            }

// ================= PRIVATE / SELF COMMAND =================
case 'private':
case 'self': {
    if (!isOwner) return reply("❌ This command is for owner-only.");
    trashcore.isPublic = false;
    await reply("✅ Bot switched to *private mode*. Only the owner can use commands now.");
    break;
}
// ================= PUBLIC COMMAND =================
case 'public': {
    if (!isOwner) return reply("❌ This command is for owner-only.");
    trashcore.isPublic = true;
    await reply("🌍 Bot switched to *public mode*. Everyone can use commands now.");
    break;
}

// Play-Doc  command
case 'playdoc': {
    try {
        const tempDir = path.join(__dirname, "temp");
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

        if (!args.length) return reply(`🎵 Provide a song name!\nExample: ${command} Not Like Us`);

        const query = args.join(" ");
        if (query.length > 100) return reply(`📝 Song name too long! Max 100 chars.`);

        await reply("🎧 Searching for the track... ⏳");

        const searchResult = await (await yts(`${query} official`)).videos[0];
        if (!searchResult) return reply("😕 Couldn't find that song. Try another one!");

        const video = searchResult;
        const apiUrl = `https://api.privatezia.biz.id/api/downloader/ytmp3?url=${encodeURIComponent(video.url)}`;
        const response = await axios.get(apiUrl);
        const apiData = response.data;

        if (!apiData.status || !apiData.result || !apiData.result.downloadUrl) throw new Error("API failed to fetch track!");

        const timestamp = Date.now();
        const fileName = `audio_${timestamp}.mp3`;
        const filePath = path.join(tempDir, fileName);

        // Download MP3
        const audioResponse = await axios({
            method: "get",
            url: apiData.result.downloadUrl,
            responseType: "stream",
            timeout: 600000
        });

        const writer = fs.createWriteStream(filePath);
        audioResponse.data.pipe(writer);
        await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });

        if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0)
            throw new Error("Download failed or empty file!");

        await trashcore.sendMessage(
            from,
            { text: stylishReply(`🎶 Downloaded *${apiData.result.title || video.title}* 🎧`) },
            { quoted: m }
        );

        // Send as document
        await trashcore.sendMessage(
            from,
            {
                document: { url: filePath },
                mimetype: "audio/mpeg",
                fileName: `${(apiData.result.title || video.title).substring(0, 100)}.mp3`
            },
            { quoted: m }
        );

        // Cleanup
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    } catch (error) {
        console.error("Play command error:", error);
        return reply(`💥 Error: ${error.message}`);
    }
    break;
}

case 'antilink': {
    try {
        if (!isGroup) return reply("❌ This command only works in groups!");
        if (!isAdmin && !isOwner) return reply("⚠️ Only admins or the owner can use this command!");
    if (!isBotAdmins) return reply("🚫 I need admin privileges to remove members!");

        global.antilink = global.antilink || {};
        const chatId = from;

        if (!global.antilink[chatId]) {
            global.antilink[chatId] = { enabled: false, mode: "delete" }; 
        }

        const option = args[0]?.toLowerCase();

        if (option === "on") {
            global.antilink[chatId].enabled = true;
            return reply(`✅ *Antilink enabled!*\nMode: ${global.antilink[chatId].mode.toUpperCase()}`);
        }

        if (option === "off") {
            global.antilink[chatId].enabled = false;
            return reply("❎ Antilink disabled!");
        }

        if (option === "mode") {
            const modeType = args[1]?.toLowerCase();
            if (!modeType || !["delete", "kick"].includes(modeType))
                return reply("⚙️ Usage: `.antilink mode delete` or `.antilink mode kick`");

            global.antilink[chatId].mode = modeType;
            return reply(`🔧 Antilink mode set to *${modeType.toUpperCase()}*!`);
        }

        // If no argument is given
        return reply(
            `📢 *Antilink Settings*\n\n` +
            `• Status: ${global.antilink[chatId].enabled ? "✅ ON" : "❎ OFF"}\n` +
            `• Mode: ${global.antilink[chatId].mode.toUpperCase()}\n\n` +
            `🧩 Usage:\n` +
            `- .antilink on\n` +
            `- .antilink off\n` +
            `- .antilink mode delete\n` +
            `- .antilink mode kick`
        );
    } catch (err) {
        console.error("Antilink command error:", err);
        reply("💥 Error while updating antilink settings.");
    }
    break;
}
case 'add': {
    if (!isGroup) return reply(" this command is only for groups");
    if (!isAdmin && !isBotAdmins && !isOwner) return reply("action restricted for admin and owner only");

    if (!text && !m.quoted) {
        return reply(`_Example:_\n\n${command} 2547xxxxxxx`);
    }

    const numbersOnly = text
        ? text.replace(/\D/g, '') + '@s.whatsapp.net'
        : m.quoted?.sender;

    try {
        const res = await trashcore.groupParticipantsUpdate(from, [numbersOnly], 'add');
        for (let i of res) {
            const invv = await trashcore.groupInviteCode(from);

            if (i.status == 408) return reply(`❌ User is already in the group.`);
            if (i.status == 401) return reply(`🚫 Bot is blocked by the user.`);
            if (i.status == 409) return reply(`⚠️ User recently left the group.`);
            if (i.status == 500) return reply(`❌ Invalid request. Try again later.`);

            if (i.status == 403) {
                await trashcore.sendMessage(
                    from,
                    {
                        text: `@${numbersOnly.split('@')[0]} cannot be added because their account is private.\nAn invite link will be sent to their private chat.`,
                        mentions: [numbersOnly],
                    },
                    { quoted: m }
                );

                await trashcore.sendMessage(
                    numbersOnly,
                    {
                        text: `🌐 *Group Invite:*\nhttps://chat.whatsapp.com/${invv}\n━━━━━━━━━━━━━━━\n👑 Admin: wa.me/${m.sender.split('@')[0]}\n📩 You have been invited to join this group.`,
                        detectLink: true,
                        mentions: [numbersOnly],
                    },
                    { quoted: m }
                ).catch((err) => reply('❌ Failed to send invitation! 😔'));
            } else {
                reply(mess.success);
            }
        }
    } catch (e) {
        console.error(e);
        reply('⚠️ Could not add user! 😢');
    }
    break;
}

// --- HIDETAG COMMAND ---
case 'hidetag': {
    if (!isGroup) return reply('❌ This command can only be used in groups!');
    if (!args || args.length === 0) return reply('❌ Please provide a message to hidetag!');

    try {
        const groupMeta = await trashcore.groupMetadata(from);
        const participants = groupMeta.participants.map(p => p.id);

        const text = args.join(' ');
        await trashcore.sendMessage(from, { text, mentions: participants });
    } catch (err) {
        console.error('[HIDETAG ERROR]', err);
        reply('❌ Failed to hidetag, please try again.');
    }
    break;
}

case 'tagall':
case 'everyone':
    if (!isGroup) {
        return await trashcore.sendMessage(from, { text: '❌ This command can only be used in groups!' });
    }

    const groupMeta = await trashcore.groupMetadata(from);
    const participants = groupMeta.participants.map(p => p.id);

    let messageText = `👥 Tagging everyone in the group!\n\n`;
    participants.forEach((p, i) => {
        messageText += `• @${p.split('@')[0]}\n`;
    });

    await trashcore.sendMessage(from, {
        text: messageText,
        mentions: participants
    });
break;


case 'kick':
case 'remove': {
    if (!isGroup) return reply("❌ This command can only be used in groups!");
    if (!isAdmin && !isOwner) return reply("⚠️ Only admins or the owner can use this command!");
    if (!isBotAdmins) return reply("🚫 I need admin privileges to remove members!");

    // 🧩 Identify target user
    let target;
    if (m.mentionedJid?.[0]) {
        target = m.mentionedJid[0];
    } else if (m.quoted?.sender) {
        target = m.quoted.sender;
    } else if (args[0]) {
        const number = args[0].replace(/[^0-9]/g, '');
        if (!number) return reply(`⚠️ Example:\n${command} 254712345678`);
        target = `${number}@s.whatsapp.net`;
    } else {
        return reply(`⚠️ Example:\n${command} 254712345678`);
    }

    // 🛡️ Protect owner & bot
    const botNumber = trashcore.user?.id || '';
    const ownerNumber = (config.OWNER_NUMBER || '').replace(/[^0-9]/g, '');
    const ownerJid = ownerNumber ? `${ownerNumber}@s.whatsapp.net` : '';

    if (target === botNumber) return reply("😅 I can’t remove myself!");
    if (target === ownerJid) return reply("🚫 You can’t remove my owner!");

    try {
        // Add a timeout wrapper
        const result = await Promise.race([
            trashcore.groupParticipantsUpdate(from, [target], 'remove'),
            new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 10000)) // 10s timeout
        ]);

        if (result && !result[0]?.status) {
            await reply(`✅ Successfully removed @${target.split('@')[0]}`, { mentions: [target] });
        } else {
            reply("⚠️ Couldn’t remove this user. Maybe they’re the group creator.");
        }

    } catch (err) {
        if (err.message === 'timeout') {
            reply("⏱️ WhatsApp took too long to respond. Try again in a few seconds.");
        } else {
            console.error("Kick Error:", err);
            reply("❌ Failed to remove member. Possibly due to permission issues or socket lag.");
        }
    }

    break;
}

case 'promote': {
    try {
        if (!m.isGroup) return m.reply("❌ This command only works in groups!");

        const groupMetadata = await trashcore.groupMetadata(m.chat);
        const participants = groupMetadata.participants;

        // Extract all admins (numbers only for reliability)
        const groupAdmins = participants
            .filter(p => p.admin !== null)
            .map(p => p.id.replace(/[^0-9]/g, ''));

        const senderNumber = m.sender.replace(/[^0-9]/g, '');
        const botNumber = trashcore.user.id.replace(/[^0-9]/g, '');

        const isSenderAdmin = groupAdmins.includes(senderNumber);
            if (!isAdmin && !isOwner) return reply("⚠️ Only admins or the owner can use this command!");
    if (!isBotAdmins) return reply("🚫 I need admin privileges to remove members!");

        // Get target user (from mention or quoted)
        let target;
        if (m.message.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            target = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (m.quoted && m.quoted.key.participant) {
            target = m.quoted.key.participant;
        } else {
            return reply("👤 Mention or reply to the user you want to promote.");
        }

        const targetNumber = target.replace(/[^0-9]/g, '');
        if (groupAdmins.includes(targetNumber))
            return reply("👑 That user is already an admin!");

        await trashcore.groupParticipantsUpdate(m.chat, [target], "promote");

        const userName = participants.find(p => p.id === target)?.notify || target.split('@')[0];
        await trashcore.sendMessage(m.chat, {
            text: `🎉 *${userName}* has been promoted to admin! 👑`
        }, { quoted: m });

    } catch (error) {
        console.error("Promote command error:", error);
        return reply(`💥 Error: ${error.message}`);
    }
    break;
}



case 'demote': {
    try {
        if (!m.isGroup) return reply("❌ This command only works in groups!");

        const groupMetadata = await trashcore.groupMetadata(m.chat);
        const participants = groupMetadata.participants;

        // Extract admin JIDs (keep full IDs)
        const groupAdmins = participants
            .filter(p => p.admin)
            .map(p => p.id);

        const senderJid = m.sender;
        const botJid = trashcore.user.id;

        const isSenderAdmin = groupAdmins.includes(senderJid);
        const isBotAdmin = groupAdmins.includes(botJid);

        if (!isAdmin && !isOwner) return reply("⚠️ Only admins or the owner can use this command!");
    if (!isBotAdmins) return reply("🚫 I need admin privileges to remove members!");

        // Get target (mention or reply)
        let target;
        if (m.message.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            target = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (m.quoted && m.quoted.sender) {
            target = m.quoted.sender;
        } else {
            return reply("👤 Mention or reply to the user you want to demote.");
        }

        if (!groupAdmins.includes(target))
            return reply("👤 That user is not an admin.");

        await trashcore.groupParticipantsUpdate(m.chat, [target], "demote");

        const userName = participants.find(p => p.id === target)?.notify || target.split('@')[0];
        await trashcore.sendMessage(m.chat, {
            text: `😔 *${userName}* has been demoted from admin.`
        }, { quoted: m });

    } catch (error) {
        console.error("Demote command error:", error);
        return reply(`💥 Error: ${error.message}`);
    }
    break;
}

case 'copilot': {
    try {
        if (!args[0]) return reply('⚠️ Please provide a query!\n\nExample:\n.copilot what is JavaScript?');
        
        const query = encodeURIComponent(args.join(' '));
        const response = await fetch(`https://api.nekolabs.my.id/ai/copilot?text=${query}`);
        const data = await response.json();
        
        if (data?.result?.text) {
            await reply(data.result.text);
        } else {
            await reply("❌ Failed to get a response from the AI.");
        }

    } catch (err) {
        console.error("Copilot command error:", err);
        await reply(`❌ Error: ${err.message}`);
    }
    break;
}


            // ================= OWNER ONLY COMMANDS =================
            default: {
                if (!isOwner) break; // Only owner can use eval/exec

                try {
                    const code = body.trim();

                    // Async eval with <>
                    if (code.startsWith('<')) {
                        const js = code.slice(1);
                        const output = await eval(`(async () => { ${js} })()`);
                        await reply(typeof output === 'string' ? output : JSON.stringify(output, null, 4));
                    } 
                    // Sync eval with >
                    else if (code.startsWith('>')) {
                        const js = code.slice(1);
                        let evaled = await eval(js);
                        if (typeof evaled !== 'string') evaled = util.inspect(evaled, { depth: 0 });
                        await reply(evaled);
                    } 
                    // Shell exec with $
                    else if (code.startsWith('$')) {
                        const cmd = code.slice(1);
                        exec(cmd, (err, stdout, stderr) => {
                            if (err) return reply(`❌ Error:\n${err.message}`);
                            if (stderr) return reply(`⚠️ Stderr:\n${stderr}`);
                            if (stdout) return reply(`✅ Output:\n${stdout}`);
                        });
                    }
                } catch (err) {
                    console.error("Owner eval/exec error:", err);
                    await reply(`❌ Eval/Exec failed:\n${err.message}`);
                }

                break;
            }
        }
    } catch (err) {
        console.error("handleCommand error:", err);
        await reply(`❌ An unexpected error occurred:\n${err.message}`);
    }
};

// =============== HOT RELOAD ===============
let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(`${colors.bgGreen}${colors.white}♻️ Update detected on ${__filename}${colors.reset}`);
    delete require.cache[file];
    try { 
        require(file); 
    } catch (err) {
        console.error(`${colors.bgGreen}${colors.yellow}❌ Error reloading case.js:${colors.reset}`, err);
    }
});