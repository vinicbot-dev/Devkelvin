const fetch = require('node-fetch');
const axios = require('axios');

// Standings function
async function formatStandings(leagueCode, leagueName, { m, reply }) {
  try {
    const apiUrl = `${global.api}/football?code=${leagueCode}&query=standings`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.result || !data.result.standings) {
      return reply(`❌ Failed to fetch ${leagueName} standings. Please try again later.`);
    }

    const standings = data.result.standings;
    let message = `*⚽ ${leagueName} Standings ⚽*\n\n`;
    
    standings.forEach((team) => {
      let positionIndicator = '';
      if (leagueCode === 'CL' || leagueCode === 'EL') {
        if (team.position <= (leagueCode === 'CL' ? 4 : 3)) positionIndicator = '🌟 ';
      } else {
        if (team.position <= 4) positionIndicator = '🌟 '; 
        else if (team.position === 5 || team.position === 6) positionIndicator = '⭐ ';
        else if (team.position >= standings.length - 2) positionIndicator = '⚠️ '; 
      }

      message += `*${positionIndicator}${team.position}.* ${team.team}\n`;
      message += `   📊 Played: ${team.played} | W: ${team.won} | D: ${team.draw} | L: ${team.lost}\n`;
      message += `   ⚽ Goals: ${team.goalsFor}-${team.goalsAgainst} (GD: ${team.goalDifference > 0 ? '+' : ''}${team.goalDifference})\n`;
      message += `   🏆 Points: *${team.points}*\n\n`;
    });

    if (leagueCode === 'CL' || leagueCode === 'EL') {
      message += '\n*🌟 = Qualification for next stage*';
    } else {
      message += '\n*🌟 = UCL | ⭐ = Europa | ⚠️ = Relegation*';
    }
    
    reply(message);
  } catch (error) {
    console.error(`Error fetching ${leagueName} standings:`, error);
    reply(`❌ Error fetching ${leagueName} standings. Please try again later.`);
  }
}

// Matches function
async function formatMatches(leagueCode, leagueName, { m, reply }) {
  try {
    const apiUrl = `${global.api}/football?code=${leagueCode}&query=matches`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.result?.matches?.length) {
      return reply(`❌ No ${leagueName} matches found or failed to fetch data.`);
    }

    const { liveMatches, finishedMatches, otherMatches } = categorizeMatches(data.result.matches);

    const messageSections = [
      buildLiveMatchesSection(liveMatches),
      buildFinishedMatchesSection(finishedMatches),
      buildOtherMatchesSection(otherMatches, liveMatches, finishedMatches)
    ].filter(Boolean);

    const header = `*⚽ ${leagueName} Match Results & Live Games ⚽*\n\n`;
    const finalMessage = messageSections.length 
      ? header + messageSections.join('\n')
      : header + `No current or recent matches found. Check upcoming matches using .${leagueCode.toLowerCase()}upcoming`;

    reply(finalMessage);
  } catch (error) {
    console.error(`Error fetching ${leagueName} matches:`, error);
    reply(`❌ Error fetching ${leagueName} matches. Please try again later.`);
  }
}

function categorizeMatches(matches) {
  const categories = {
    liveMatches: [],
    finishedMatches: [],
    otherMatches: []
  };

  matches.forEach(match => {
    if (match.status === 'FINISHED') {
      categories.finishedMatches.push(match);
    } 
    else if (isLiveMatch(match)) {
      categories.liveMatches.push(match);
    } 
    else {
      categories.otherMatches.push(match);
    }
  });

  return categories;
}

function isLiveMatch(match) {
  const liveStatusIndicators = ['LIVE', 'ONGOING', 'IN_PROGRESS', 'PLAYING'];
  return (
    (match.status && liveStatusIndicators.some(indicator => 
      match.status.toUpperCase().includes(indicator))) ||
    (match.score && match.status !== 'FINISHED')
  );
}

function buildLiveMatchesSection(liveMatches) {
  if (!liveMatches.length) return null;
  
  let section = `🔥 *Live Matches (${liveMatches.length})*\n\n`;
  liveMatches.forEach((match, index) => {
    section += `${index + 1}. 🟢 ${match.status || 'LIVE'}\n`;
    section += `   ${match.homeTeam} vs ${match.awayTeam}\n`;
    if (match.score) section += `   📊 Score: ${match.score}\n`;
    if (match.time) section += `   ⏱️ Minute: ${match.time || 'Unknown'}\n`;
    section += '\n';
  });
  
  return section;
}

function buildFinishedMatchesSection(finishedMatches) {
  if (!finishedMatches.length) return null;

  let section = `✅ *Recent Results (${finishedMatches.length})*\n\n`;
  const byMatchday = finishedMatches.reduce((acc, match) => {
    (acc[match.matchday] = acc[match.matchday] || []).push(match);
    return acc;
  }, {});

  Object.keys(byMatchday)
    .sort((a, b) => b - a)
    .forEach(matchday => {
      section += `📅 *Matchday ${matchday} (${byMatchday[matchday].length} matches)*:\n`;
      byMatchday[matchday].forEach((match, index) => {
        const winnerEmoji = match.winner === 'Draw' ? '⚖️' : '🏆';
        section += `${index + 1}. ${match.homeTeam} ${match.score} ${match.awayTeam}\n`;
        section += `   ${winnerEmoji} ${match.winner}\n\n`;
      });
    });

  return section;
}

function buildOtherMatchesSection(otherMatches, liveMatches, finishedMatches) {
  if (!otherMatches.length || liveMatches.length || finishedMatches.length) return null;
  
  let section = `📌 *Other Matches (${otherMatches.length})*\n\n`;
  otherMatches.forEach((match, index) => {
    section += `${index + 1}. ${match.homeTeam} vs ${match.awayTeam}\n`;
    section += `   Status: ${match.status || 'Unknown'}\n\n`;
  });
  
  return section;
}

// Top Scorers function
async function formatTopScorers(leagueCode, leagueName, { m, reply }) {
  try {
    const apiUrl = `${global.api}/football?code=${leagueCode}&query=scorers`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.result || !data.result.topScorers) {
      return reply(`❌ No ${leagueName} top scorers data found.`);
    }

    const scorers = data.result.topScorers;
    let message = `*⚽ ${leagueName} Top Scorers ⚽*\n\n`;
    message += '🏆 *Golden Boot Race*\n\n';

    scorers.forEach(player => {
      message += `*${player.rank}.* ${player.player} (${player.team})\n`;
      message += `   ⚽ Goals: *${player.goals}*`;
      message += ` | 🎯 Assists: ${player.assists}`;
      message += ` | ⏏️ Penalties: ${player.penalties}\n\n`;
    });

    reply(message);
  } catch (error) {
    console.error(`Error fetching ${leagueName} top scorers:`, error);
    reply(`❌ Error fetching ${leagueName} top scorers. Please try again later.`);
  }
}

// Upcoming Matches function
async function formatUpcomingMatches(leagueCode, leagueName, { m, reply }) {
  try {
    const apiUrl = `${global.api}/football?code=${leagueCode}&query=upcoming`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.result || !data.result.upcomingMatches || data.result.upcomingMatches.length === 0) {
      return reply(`❌ No upcoming ${leagueName} matches found.`);
    }

    const matches = data.result.upcomingMatches;
    let message = `*📅 Upcoming ${leagueName} Matches ⚽*\n\n`;

    const matchesByMatchday = {};
    matches.forEach(match => {
      if (!matchesByMatchday[match.matchday]) {
        matchesByMatchday[match.matchday] = [];
      }
      matchesByMatchday[match.matchday].push(match);
    });

    const sortedMatchdays = Object.keys(matchesByMatchday).sort((a, b) => a - b);

    sortedMatchdays.forEach(matchday => {
      message += `*🗓️ Matchday ${matchday}:*\n`;
      
      matchesByMatchday[matchday].forEach(match => {
        const matchDate = new Date(match.date);
        const formattedDate = matchDate.toLocaleString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        message += `\n⏰ ${formattedDate}\n`;
        message += `   🏠 ${match.homeTeam} vs ${match.awayTeam} 🚌\n\n`;
      });
      
      message += '\n';
    });

    reply(message);
  } catch (error) {
    console.error(`Error fetching upcoming ${leagueName} matches:`, error);
    reply(`❌ Error fetching upcoming ${leagueName} matches. Please try again later.`);
  }
}

// Wrestling functions
async function getWrestlingEvents({ reply }) {
  try {
    const { data } = await axios.get(`${global.wwe2}`);
    
    if (!data.event || data.event.length === 0) {
      return reply("❌ No upcoming wrestling events found.");
    }

    const eventsList = data.event.map(event => {
      return (
        `*🏟️ ${event.strEvent}*\n` +
        `📅 *Date:* ${event.dateEvent || 'N/A'}\n` +
        `🏆 *League:* ${event.strLeague}\n` +
        `📍 *Venue:* ${event.strVenue || event.strCity || 'N/A'}\n` +
        (event.strDescriptionEN ? `📝 *Match:* ${event.strDescriptionEN.replace(/\r\n/g, ' | ')}\n` : '') +
        `────────────────────`
      );
    }).join('\n\n');

    reply(
      `*🗓️ Upcoming Wrestling Events*\n\n` +
      `${eventsList}\n\n` +
      `_Data provided by TheSportsDB_`
    );

  } catch (error) {
    console.error(error);
    reply("❌ Failed to fetch wrestling events. Please try again later.");
  }
}

async function getWWENews({ reply }) {
  try {
    const { data } = await axios.get(`${global.wwe}`);
    
    if (!data.data || data.data.length === 0) {
      return reply("❌ No WWE news found at this time.");
    }

    const newsList = data.data.map(item => {
      return (
        `*${item.title}*\n` +
        `📅 ${item.created} (${item.time_ago})\n` +
        `📺 ${item.parent_title}\n` +
        (item.image?.src ? `🌆 View Image (https://www.wwe.com${item.image.src})\n` : '') +
        `🔗 [Read More](https://www.wwe.com${item.url})\n` +
        `────────────────────`
      );
    }).join('\n\n');

    reply(
      `*📰 Latest WWE News*\n\n` +
      `${newsList}\n\n` +
      `_Powered by WWE Official API_`
    );

  } catch (error) {
    console.error(error);
    reply("❌ Failed to fetch WWE news. Please try again later.");
  }
}

async function getWWESchedule({ reply }) {
  try {
    const { data } = await axios.get(`${global.wwe1}`);
    
    if (!data.event || data.event.length === 0) {
      return reply("❌ No upcoming WWE events found.");
    }

    const eventsList = data.event.map(event => {
      const eventType = event.strEvent.includes('RAW') ? '🎤 RAW' : 
                       event.strEvent.includes('NXT') ? '🌟 NXT' :
                       event.strEvent.includes('SmackDown') ? '🔵 SmackDown' :
                       '🏆 PPV';
      
      return (
        `${eventType} *${event.strEvent}*\n` +
        `📅 ${event.dateEvent || 'Date not specified'}\n` +
        `📍 ${event.strVenue || event.strCity || 'Location not specified'}\n` +
        (event.strDescriptionEN ? `📝 ${event.strDescriptionEN}\n` : '') +
        `────────────────────`
      );
    }).join('\n\n');

    reply(
      `*📅 Upcoming WWE Events*\n\n` +
      `${eventsList}\n\n` +
      `_Data provided by TheSportsDB_`
    );

  } catch (error) {
    console.error(error);
    reply("❌ Failed to fetch WWE events. Please try again later.");
  }
}

// Export all functions
module.exports = {
  formatStandings,
  formatMatches,
  formatTopScorers,
  formatUpcomingMatches,
  getWrestlingEvents,
  getWWENews,
  getWWESchedule
};