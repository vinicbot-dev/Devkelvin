/*
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
global.sudo = ["256742932677", "256755585369"];// Type additional allowed users here
//NB: They'll be able to use every functions of the bot without restrictions.
global.ownername = "Kelvin Tech";  
global.botname = "ᴠɪɴɪᴄ-xᴍᴅ";  

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

// ======= Anti-status features ==========
global.antistatus = "private"; // Options: "private", "chat", false
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
global.welcome = true;
global.antibug = false;
global.adminevent = true;
global.AI_CHAT = "true", // Set to "true" to enable AI chatbot by default

// ========= Add modeStatus and versions ========= //
global.modeStatus = "Public";
global.versions = "1.3.6";

// ========= Setting WM ========= //
global.packname = 'Vinic';
global.author = 'Xmd';
global.wm = '©Vinic-Xmd is awesome 🔥';

// === For only developer ============
global.api = "https://xploaderapi-f5e63b.platform.cypherx.space";
global.siputzx = "https://api.siputzx.my.id";
global.wwe = "https://www.wwe.com/api/news";
global.wwe1 = "https://www.thesportsdb.com/api/v1/json/3/searchfilename.php?e=wwe";
global.wwe2 = "https://www.thesportsdb.com/api/v1/json/3/searchevents.php?e=wrestling";
global.falcon = "https://flowfalcon.dpdns.org";
// ======= End of developer section ====
global.gcount = {
  prem: 500,
  user: 15
};

global.limitCount = 10;

global.mess = {
  group: "*This is not a group*",
  admin: "*To use this feature first make Vinic-Xmd admin*",
  owner: "*Haha😆, I will not respond because your not my owner*",
  done: "*Operation succeeded*",
  notext: "*Please provide the necessary text*",
  premium: "*First become a premium user*",
  botadmin: "*Vinic-Xmd needs to be admin*",
  limited: "*Limit reached*",
  helpersList: [
    { name: "Malvin king", number: "+263776388689", country: "Zimbabwe", flag: "🇿🇼" },
    { name: "lonlysaam", number: "+254762586673", country: "Kenya", flag: "🇹🇿" },
    { name: "Tredex", number: "+254110081982", country: "Kenya", flag: "🇹🇿" },
    { name: "Dev sung", number: "+27649342626", country: "South Africa", flag: "🇿🇦" }
  ],
 
};

// ========= Feature Status Command ========= //
global.features = {
  welcome: true,
  adminevent: true,
  antiedit: 'private',
  antidelete: 'private',
  autoreact: false,
  autobio: false,
  chatbot: false
};

// Export all global settings for use in other modules
module.exports = {
  owner: global.owner,
  ownername: global.ownername,
  botname: global.botname,
  namasaluran: global.namachannel,
  idchannel: global.idchannel,
  linkchannel: global.linkchannel,
  SESSION_ID: global.SESSION_ID,
  autostatus: global.autostatus,
  antispam: global.antispam,
  autoread: global.autoread,
  anticall: global.anticall,
  antilink: global.antilink,
  autoreact: global.autoreact,
  antibug: global.antibug,
  autobio: global.autobio,
  chatbot: global.chatbot,
  autoTyping: global.autoTyping,
  autorecording: global.autorecording,
  prefa: global.prefa,
  antidelete: global.antidelete,
  welcome: global.welcome,
  adminevent: global.adminevent,
  modeStatus: global.modeStatus,
  versions: global.versions,
  packname: global.packname,
  author: global.author,
  gcount: global.gcount,
  limitCount: global.limitCount,
  mess: global.mess,
  features: global.features
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log('\x1b[0;32m' + __filename + ' \x1b[1;32mupdated!\x1b[0m');
  delete require.cache[file];
  require(file);
});
