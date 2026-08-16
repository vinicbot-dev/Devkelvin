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
global.versions = "1.6.6";

// ========= Setting WM ========= //
global.packname = '★⃝𝐉𝐄𝐗𝐏𝐋𝐎𝐈𝐓';
global.author = 'BOT';
global.wm = '©★⃝𝐉𝐄𝐗𝐏𝐋𝐎𝐈𝐓 is awesome 🔥';

// === For only developer ============
global.api = "https://apiskeith2-production-3020.up.railway.app";
global.KevinApi = "malvin-5xrOWGp0WrpXfOoeV80ffXdkCXC15iDYGNDXNov6";
global.wow = "https://api.malvin.gleeze.com";  // <-- Malvin API domain
global.wwe = "https://www.wwe.com/api/news";
global.wwe1 = "https://www.thesportsdb.com/api/v1/json/3/searchfilename.php?e=wwe";
global.wwe2 = "https://www.thesportsdb.com/api/v1/json/3/searchevents.php?e=wrestling";
global.falcon = "https://flowfalcon.dpdns.org";

global.gcount = {
  prem: 500,
  user: 15
};

global.limitCount = 10;

// =====================================================================
// Centralized Bot Messages (global.mess)
// ---------------------------------------------------------------------
// Every command should reply using these instead of writing its own
// one-off error/success text, so the bot's tone stays consistent and
// can be edited from ONE place.
//
//   reply(mess.error)      -> generic failure
//   reply(mess.success)    -> generic success (flourish)
//   reply(mess.done)       -> generic "operation completed"
//   reply(mess.group)      -> group-only gate      (mess.notgroup is an alias)
//   reply(mess.notadmin)   -> group admins only     (mess.admin is an alias)
//   reply(mess.botadmin)   -> bot needs admin gate
//   reply(mess.owner)      -> owner-only gate
//   reply(mess.noquoted)   -> command needs a quoted/replied message
//   reply(mess.nomedia)    -> command needs an attached image/video/audio
//   reply(mess.notfound)   -> lookup returned nothing
//   reply(mess.wait)       -> "working on it" while a slow task runs
//
// For a command-specific detail while keeping the shared style, use the
// mess.make helpers instead of hand-writing new copy:
//   reply(mess.make.error("Could not find that verse."))
//   reply(mess.make.success("Sub-session removed."))
//   reply(mess.make.usage(prefix + command, "John 3:16"))
// =====================================================================
const GROUP_ONLY_MSG = "*This is not a group*";
const ADMIN_ONLY_MSG = "This command is only preserved for group admins only!";

global.mess = {
  // ---- permission / context gates ----
  group: GROUP_ONLY_MSG,
  notgroup: GROUP_ONLY_MSG,     // alias - some commands check under this name
  notadmin: ADMIN_ONLY_MSG,
  admin: ADMIN_ONLY_MSG,        // alias - some commands check under this name
  botadmin: "Please bot needs admins permission!",
  owner: "Haha😆, I will not respond because your not my owner",
  premium: "*First become a premium user*",
  limited: "*Limit reached*",
  denied: "❌ *You don't have permission to use this command.*",

  // ---- generic outcomes ----
  done: "*Operation succeeded*",
  success: "✅ *Success!*",
  error: "An error occurred while processing the command!",
  notext: "*Please provide the necessary text*",

  // ---- common command-input problems ----
  wait: "⏳ *Processing, please wait...*",
  notfound: "❌ *Not found.* Please check your input and try again.",
  invalid: "❌ *Invalid input.* Please check the format and try again.",
  noquoted: "❌ *Please reply to (quote) a message to use this command.*",
  nomedia: "❌ *No media found.* Please attach or quote an image/video/audio.",
  apidown: "❌ *That service is unreachable right now.* Please try again later.",

  // ---- misc (unrelated to messaging, kept for existing commands) ----
  helpersList: [
    { name: "JHAI DAVE", number: "+256774782648", country: "Uganda", flag: "🇺🇬" },
    { name: "𝐊𝐚𝐚𝐗𝐇𝐮𝐧𝐭𝐞𝐫𝐳", number: "+91 80751 69545", country: "India", flag: "🇮🇳" },
    { name: "Terri", number: "+256752792178", country: "Uganda", flag: "🇺🇬" },
    { name: "༅᭄𖣐∭•𝐑𝐎𝐌𝐀-𝐓𝐄𝐂𝐇•∭𖣐᭄༅", number: ",256791480644", country: "Uganda", flag: "🇺🇬" },
    { name: "Lord Voyage", number: "+256702662846", country: "Uganda", flag: "🇺🇬" }
  ],
  siputzx: "https://api.siputzx.my.id",

  // ---- helpers for a one-off message that still keeps the shared style ----
  make: {
    error(detail) {
      return detail ? `❌ *Error:* ${detail}` : global.mess.error;
    },
    success(detail) {
      return detail ? `✅ *Success:* ${detail}` : global.mess.success;
    },
    usage(cmdWithPrefix, example) {
      return `❌ *Usage:* ${cmdWithPrefix}${example ? ` ${example}` : ''}`;
    }
  }
};


if (__filename) {
  let file = require.resolve(__filename);
  fs.watchFile(file, () => {
    fs.unwatchFile(file);
    delete require.cache[file];
    require(file);
  });
}