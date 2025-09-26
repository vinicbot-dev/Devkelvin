const axios = require('axios');

const fetchReactionImage = async ({ conn, m, reply, command }) => {
  try {
    const { data } = await axios.get(`https://api.waifu.pics/sfw/${command}`);
    await conn.sendImageAsSticker(m.chat, data.url, m, {
      packname: global.packname,
      author: global.author,
    });
  } catch (error) {
      reply(global.mess.error);
  }
};

module.exports = {fetchReactionImage}