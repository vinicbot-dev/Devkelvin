/* m
  -! Credits By Kevintech 
  Thanks to great lonelysaam 
  Thanks to Malvin King 
  https://wa.me/256742932677
*/

// setting/config.js
const fs = require('fs');

// --- Setting Owner ---?  
 //  
global.owner = ["256742932677"];  
global.sudo = ["256742932677", "256755585369"];

// Numbers allowed to be paired as additional sessions via the .pair command
// (owner-only). A number must be listed here - the number the *credentials*
// actually belong to, not whatever's typed alongside them - or pairing is
// refused. Add your own numbers here, digits only, no + and no @s.whatsapp.net.
global.allowedSubSessions = [
    // "2567xxxxxxxx",
];
global.maxSubSessions = 3;
global.ownername = "Kelvin Tech";  
global.botname = "JEXPLOIT";  

// ========= Setting Channel ========= //
global.namachannel = "KEVIN";
global.idchannel = "120363398454335106@newsletter";
global.linkchannel = "";

// ========= Setting Status ========= //
global.antispam = true;
global.autoread = false;
global.autoreact = false;
global.antibug = true;
global.autobio = false;
global.autoTyping = false;
global.autorecording = false;
global.prefixz = '.';

// ========= Anti-Delete Feature ========= //
global.antidelete = 'private'; // Options: 'private', 'chat', or 'off'

// ===== Anticall ===========
global.anticall = 'off';// options :- 'off', 'decline' or 'block'
// off - Disables anticall
// decline - Declines incoming calls
// Block - Declines and blocks callers

// ======= Anti-Edit ==============
global.antiedit = 'private'; // options: 'private, 'chat', or 'off'

// ====== Global for status ========
global.autoviewstatus = 'true';    // Enable auto-view status
global.autoreactstatus = 'true';   // Enable auto-react to status  
global.statusemoji = '💚';         // Emoji to use for reactions

// ======Antilink globals=======°°
global.antilinkdelete = true;
global.antilinkwarn = true;
global.antilinkkick = false;


// ========= Other Global Settings ========= //
global.SESSION_ID = process.env.SESSION_ID || '';
global.postgresqls = process.env.DATABASE_URL || "";

global.welcome = true;
global.adminevent = true;
global.AI_CHAT = "false"; // Set to "true" to enable AI chatbot by default


// ========= Add modeStatus and versions ========= //
global.modeStatus = "Public";
global.versions = "1.6.0";

// ========= Setting WM ========= //
global.packname = '★⃝𝐉𝐄𝐗𝐏𝐋𝐎𝐈𝐓';
global.author = 'BOT';
global.wm = '©★⃝𝐉𝐄𝐗𝐏𝐋𝐎𝐈𝐓 is awesome 🔥';

// === For only developer ============
global.api = "https://ravenn.site";
global.KevinApi = "mvn_988e8fc44c89ad6e537bb683e681afe6";
global.wwe = "https://www.wwe.com/api/news";
global.wwe1 = "https://www.thesportsdb.com/api/v1/json/3/searchfilename.php?e=wwe";
global.wwe2 = "https://www.thesportsdb.com/api/v1/json/3/searchevents.php?e=wrestling";
global.falcon = "https://flowfalcon.dpdns.org";

global.gcount = {
  prem: 500,
  user: 15
};

global.limitCount = 10;

global.mess = {
  group: "*This is not a group*",
  notadmin: "This command is only preserved for group admins only!",
  owner: "Haha😆, I will not respond because your not my owner",
  done: "*Operation succeeded*",
  notext: "*Please provide the necessary text*",
  premium: "*First become a premium user*",
  botadmin: "Please bot needs admins permission!",
  error: "An error occurred while processing the command!",
  limited: "*Limit reached*",
  helpersList: [
    { name: "JHAI DAVE", number: "+256774782648", country: "Uganda", flag: "🇺🇬" },
    { name: "𝐊𝐚𝐚𝐗𝐇𝐮𝐧𝐭𝐞𝐫𝐳", number: "+91 80751 69545", country: "India", flag: "🇮🇳" },
    { name: "Terri", number: "+256752792178", country: "Uganda", flag: "🇺🇬" },
    { name: "༅᭄𖣐∭•𝐑𝐎𝐌𝐀-𝐓𝐄𝐂𝐇•∭𖣐᭄༅", number: ",256791480644", country: "Uganda", flag: "🇺🇬" },
    { name: "Nexus", number: "+25494171080", country: "Kenya", flag: "🇰🇪" }
  ],
  siputzx: "https://api.siputzx.my.id" 
};


if (__filename) {
  let file = require.resolve(__filename);
  fs.watchFile(file, () => {
    fs.unwatchFile(file);
    delete require.cache[file];
    require(file);
  });
}
