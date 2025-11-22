/*
  -! Credits By Kevintech 
  Thanks to great lonelysaam 
  Thanks to Malvin King 
  https://wa.me/256742932677
*/

// setting/config.js
const fs = require('fs');

// --- Setting Owner ---  
global.owner = ["256742932677"];  
global.sudo = ["256742932677", "256755585369"];
global.ownername = "Kelvin Tech";  
global.botname = "ᴠɪɴɪᴄ-xᴍᴅ";  

// ========= Setting Channel ========= //
global.namachannel = "KEVIN";
global.idchannel = "120363398454335106@newsletter";
global.linkchannel = "";
global.prefixz = '.';


// ========= Add modeStatus and versions ========= //
global.modeStatus = "Public";
global.versions = "1.3.7";

// ========= Setting WM ========= //
global.packname = 'Vinic';
global.author = 'Xmd';
global.wm = '©Vinic-Xmd is awesome 🔥';

// === For only developer ============
global.api = "https://xploaderapi-f5e63b.platform.cypherx.space";
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
  siputzx: "https://api.siputzx.my.id" 
};


let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  delete require.cache[file];
  require(file);
});