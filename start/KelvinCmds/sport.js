/* Kelvin Tech - COMPLETE WORKING SPORTS PLUGIN */
/* Using correct API endpoints from https://apiskeith.top */

const fetch = require('node-fetch');
const axios = require('axios');

function getLeaguePath(leagueCode) {
  const leagueMap = {
    'PL': 'epl',
    'CL': 'ucl',
    'PD': 'laliga',
    'BL1': 'bundesliga',
    'SA': 'seriea',
    'FL1': 'ligue1',
    'EL': 'el',
    'ELC': 'efl',
    'WC': 'wc',
    'EUROS': 'euros',
    'FIFA': 'fifa'
  };
  return leagueMap[leagueCode] || leagueCode.toLowerCase();
}

async function formatStandings(leagueCode, leagueName, { m, reply }) {
  try {
    const leaguePath = getLeaguePath(leagueCode);
    const apiUrl = `${global.api}/${leaguePath}/standings`;
    
    console.log(`Fetching standings: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.status || !data.result) {
      return reply(`❌ Failed to fetch ${leagueName} standings.`);
    }

    // Standings are in result.standings
    const standings = data.result.standings || data.result;
    
    if (!standings || standings.length === 0) {
      return reply(`❌ No standings data found for ${leagueName}.`);
    }

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

async function formatMatches(leagueCode, leagueName, { m, reply }) {
  try {
    const leaguePath = getLeaguePath(leagueCode);
    const apiUrl = `${global.api}/${leaguePath}/matches`;
    
    console.log(`Fetching matches: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.status || !data.result) {
      return reply(`❌ Failed to fetch ${leagueName} matches.`);
    }

    const matches = data.result.matches || data.result;
    
    if (!matches || matches.length === 0) {
      return reply(`❌ No ${leagueName} matches found.`);
    }

    const { liveMatches, finishedMatches, otherMatches } = categorizeMatches(matches);

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

async function formatTopScorers(leagueCode, leagueName, { m, reply }) {
  try {
    const leaguePath = getLeaguePath(leagueCode);
    const apiUrl = `${global.api}/${leaguePath}/scorers`;
    
    console.log(`Fetching top scorers: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.status || !data.result) {
      return reply(`❌ Failed to fetch ${leagueName} top scorers.`);
    }

    const scorers = data.result.topScorers || data.result;
    
    if (!scorers || scorers.length === 0) {
      return reply(`❌ No top scorers data found for ${leagueName}.`);
    }

    let message = `*⚽ ${leagueName} Top Scorers ⚽*\n\n`;
    message += '🏆 *Golden Boot Race*\n\n';

    scorers.forEach(player => {
      message += `*${player.rank}.* ${player.player} (${player.team})\n`;
      message += `   ⚽ Goals: *${player.goals}*`;
      message += ` | 🎯 Assists: ${player.assists || 0}`;
      message += ` | ⏏️ Penalties: ${player.penalties || 0}\n\n`;
    });

    reply(message);
  } catch (error) {
    console.error(`Error fetching ${leagueName} top scorers:`, error);
    reply(`❌ Error fetching ${leagueName} top scorers. Please try again later.`);
  }
}

async function formatUpcomingMatches(leagueCode, leagueName, { m, reply }) {
  try {
    const leaguePath = getLeaguePath(leagueCode);
    const apiUrl = `${global.api}/${leaguePath}/upcomingmatches`;
    
    console.log(`Fetching upcoming matches: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.status || !data.result) {
      return reply(`❌ Failed to fetch upcoming ${leagueName} matches.`);
    }

    const matches = data.result.upcomingMatches || data.result;
    
    if (!matches || matches.length === 0) {
      return reply(`❌ No upcoming ${leagueName} matches found.`);
    }

    let message = `*📅 Upcoming ${leagueName} Matches ⚽*\n\n`;

    // Group by matchday
    const matchesByMatchday = {};
    matches.forEach(match => {
      const matchday = match.matchday || 1;
      if (!matchesByMatchday[matchday]) {
        matchesByMatchday[matchday] = [];
      }
      matchesByMatchday[matchday].push(match);
    });

    const sortedMatchdays = Object.keys(matchesByMatchday).sort((a, b) => a - b);

    sortedMatchdays.forEach(matchday => {
      message += `*🗓️ Matchday ${matchday}:*\n`;
      
      matchesByMatchday[matchday].forEach(match => {
        // Parse date from format like "3/14/2026, 3:00:00 PM"
        const dateStr = match.date;
        const matchDate = new Date(dateStr);
        
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

// Team Search
async function searchTeam(query, { reply }) {
  try {
    if (!query) return reply("❌ Please provide a team name. Example: `.teamsearch arsenal`");
    
    const response = await fetch(`${global.api}/sport/teamsearch?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    if (!data.status || !data.result || data.result.length === 0) {
      return reply(`❌ No team found for "${query}"`);
    }
    
    const team = data.result[0];
    let message = `*⚽ Team Information: ${team.name} ⚽*\n\n`;
    message += `*🏷️ Full Name:* ${team.alternateName || team.name}\n`;
    message += `*📅 Formed:* ${team.formedYear || 'N/A'}\n`;
    message += `*🏟️ Stadium:* ${team.stadium || 'N/A'} (Capacity: ${team.stadiumCapacity?.toLocaleString() || 'N/A'})\n`;
    message += `*📍 Location:* ${team.location || team.country || 'N/A'}\n`;
    message += `*🏆 League:* ${team.league || 'N/A'}\n\n`;
    
    if (team.description) {
      const shortDesc = team.description.substring(0, 300) + '...';
      message += `*📝 Description:*\n${shortDesc}\n\n`;
    }
    
    if (team.badges?.large) {
      message += `*🖼️ Logo:* ${team.badges.large}\n`;
    }
    
    reply(message);
  } catch (error) {
    console.error('Error searching team:', error);
    reply("❌ Error searching for team.");
  }
}

// Player Search
async function searchPlayer(query, { reply, conn, m }) {
  try {
    if (!query) return reply("*Please provide a player name. Example: `.playersearch Bukayo Saka*`");
    
    const response = await fetch(`${global.api}/sport/playersearch?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    if (!data.status || !data.result || data.result.length === 0) {
      return reply(`❌ No player found for "${query}"`);
    }
    
    const player = data.result[0];
    let message = `*⚽ Player Information ⚽*\n\n`;
    message += `*👤 Name:* ${player.name}\n`;
    message += `*🏠 Team:* ${player.team || 'N/A'}\n`;
    message += `*🌍 Nationality:* ${player.nationality || 'N/A'}\n`;
    message += `*🎂 Born:* ${player.birthDate || 'N/A'}\n`;
    message += `*⚽ Position:* ${player.position || 'N/A'}\n`;
    message += `*📊 Status:* ${player.status || 'N/A'}\n\n`;
    
    // Send message first
    await reply(message);
    
    // Send photo if available
    if (player.thumbnail) {
      await conn.sendMessage(m.chat, {
        image: { url: player.thumbnail },
        caption: `🖼️ ${player.name}`
      }, { quoted: m });
    }
    
  } catch (error) {
    console.error('Error searching player:', error);
    reply("❌ Error searching for player.");
  }
}

async function searchVenue(query, { reply, conn, m }) {
  try {
    if (!query) return reply("❌ Please provide a venue name. Example: `.venuesearch Emirates`");
    
    const response = await fetch(`${global.api}/sport/venuesearch?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    if (!data.status || !data.result || data.result.length === 0) {
      return reply(`❌ No venue found for "${query}"`);
    }
    
    const venue = data.result[0];
    let message = `*🏟️ Venue Information: ${venue.name} 🏟️*\n\n`;
    message += `*📍 Location:* ${venue.location || venue.country || 'N/A'}\n`;
    message += `*👥 Capacity:* ${venue.capacity?.toLocaleString() || 'N/A'}\n`;
    message += `*🏅 Sport:* ${venue.sport || 'N/A'}\n`;
    message += `*📅 Built:* ${venue.yearBuilt || 'N/A'}\n\n`;
    
    if (venue.description) {
      const shortDesc = venue.description.substring(0, 300) + '...';
      message += `*📝 Description:*\n${shortDesc}\n\n`;
    }
    
    // Send message first
    await reply(message);
    
    // Send image if available
    if (venue.media?.thumb) {
      await conn.sendMessage(m.chat, {
        image: { url: venue.media.thumb },
        caption: `🏟️ ${venue.name}`
      }, { quoted: m });
    }
    
  } catch (error) {
    console.error('Error searching venue:', error);
    reply("❌ Error searching for venue.");
  }
}



// ==================== CATEGORIZE MATCHES HELPER FUNCTIONS ====================
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

// Head to Head Function
async function getHeadToHead(team1, team2, { reply }) {
  try {
    const query = `${team1} vs ${team2}`;
    const response = await fetch(`${global api}/sport/gameevents?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    if (!data.status || !data.result || data.result.length === 0) {
      return reply(`❌ No head-to-head matches found between ${team1} and ${team2}`);
    }
    
    const matches = data.result;
    let message = `*⚽ Head-to-Head: ${team1} vs ${team2} ⚽*\n\n`;
    message += `*📊 Total Meetings:* ${matches.length}\n\n`;

    // Calculate statistics
    let team1Wins = 0, team2Wins = 0, draws = 0;
    let team1Goals = 0, team2Goals = 0;

    matches.forEach(match => {
      const homeScore = match.teams?.home?.score || 0;
      const awayScore = match.teams?.away?.score || 0;
      
      const homeTeam = match.teams?.home?.name?.toLowerCase() || '';
      const awayTeam = match.teams?.away?.name?.toLowerCase() || '';
      
      if (homeTeam.includes(team1.toLowerCase()) || awayTeam.includes(team2.toLowerCase())) {
        if (homeScore > awayScore) team1Wins++;
        else if (awayScore > homeScore) team2Wins++;
        else draws++;
        team1Goals += homeScore;
        team2Goals += awayScore;
      } else {
        if (awayScore > homeScore) team1Wins++;
        else if (homeScore > awayScore) team2Wins++;
        else draws++;
        team1Goals += awayScore;
        team2Goals += homeScore;
      }
    });

    message += `*📈 Statistics:*\n`;
    message += `   🏠 ${team1}: ${team1Wins} wins (${Math.round(team1Wins/matches.length*100)}%)\n`;
    message += `   🚌 ${team2}: ${team2Wins} wins (${Math.round(team2Wins/matches.length*100)}%)\n`;
    message += `   ⚖️ Draws: ${draws} (${Math.round(draws/matches.length*100)}%)\n`;
    message += `   ⚽ Goals: ${team1} ${team1Goals} - ${team2Goals} ${team2}\n\n`;
    message += `─────────────────\n\n`;

    // Recent matches
    message += `*📅 Recent Encounters:*\n\n`;
    matches.slice(0, 5).forEach((match, index) => {
      message += `${index + 1}. ${match.match}\n`;
      message += `   📊 ${match.teams?.home?.score || 0} - ${match.teams?.away?.score || 0}\n`;
      message += `   🏆 ${match.league?.name || 'Unknown'}\n`;
      message += `   📅 ${match.dateTime?.date || 'Date TBD'}\n`;
      if (match.media?.video) {
        message += `   📺 [Highlights](${match.media.video})\n`;
      }
      message += `\n`;
    });

    reply(message);
  } catch (error) {
    console.error('Error fetching head-to-head:', error);
    reply("❌ Error fetching head-to-head data. Please try again later.");
  }
}

// Search Game Events
async function searchGameEvents(query, { reply }) {
  try {
    if (!query || query.trim() === '') {
      return reply("❌ Please provide a search query. Example: `.gameevents Arsenal vs Chelsea`");
    }

    const encodedQuery = encodeURIComponent(query.trim());
    const apiUrl = `${global.api}/sport/gameevents?q=${encodedQuery}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.status || !data.result || data.result.length === 0) {
      return reply(`❌ No events found for "${query}". Try a different search term.`);
    }

    const events = data.result;
    let message = `*⚽ Game Events Search Results ⚽*\n\n`;
    message += `*🔍 Search Query:* "${query}"\n`;
    message += `*📊 Total Results:* ${events.length}\n\n`;
    message += `─────────────────\n\n`;

    events.forEach((match, index) => {
      message += `*${index + 1}. ${match.match}*\n`;
      
      const homeTeam = match.teams?.home?.name || 'Unknown';
      const awayTeam = match.teams?.away?.name || 'Unknown';
      const homeScore = match.teams?.home?.score ?? '?';
      const awayScore = match.teams?.away?.score ?? '?';
      
      message += `   🏠 ${homeTeam} vs 🚌 ${awayTeam}\n`;
      message += `   📊 Score: ${homeScore} - ${awayScore}\n`;
      message += `   🏆 ${match.league?.name || 'Unknown League'}`;
      if (match.season) message += ` (${match.season})`;
      message += `\n`;
      
      if (match.dateTime?.date) {
        const date = new Date(match.dateTime.date);
        message += `   📅 ${date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })}`;
        if (match.dateTime.time) {
          message += ` at ${match.dateTime.time.substring(0, 5)}`;
        }
        message += `\n`;
      }
      
      const statusEmoji = match.status === 'Match Finished' ? '✅' : 
                         match.status?.toLowerCase().includes('live') ? '🔴' : '⏳';
      message += `   ${statusEmoji} ${match.status || 'Scheduled'}\n`;
      
      if (match.venue?.name) {
        message += `   🏟️ ${match.venue.name}`;
        if (match.venue.city) message += `, ${match.venue.city}`;
        message += `\n`;
      }
      
      if (match.media?.video) {
        message += `   📺 [Match Highlights](${match.media.video})\n`;
      }
      
      message += `\n`;
      if (index < events.length - 1) message += `─────────────────\n\n`;
    });

    message += `\n*📌 Useful Commands:*\n`;
    message += `• Get match details: .matchdetails [match_id]\n`;
    message += `• Example: .matchdetails ${events[0]?.id || '2401588'}\n`;

    reply(message);
  } catch (error) {
    console.error('Error searching game events:', error);
    reply("❌ Error fetching game events. Please try again later.");
  }
}

// Get Match Details by ID
async function searchGameEvents(matchId, { reply }) {
  try {
    if (!matchId) {
      return reply("❌ Please provide a match ID. Example: `.matchdetails 2401588`");
    }

    const response = await fetch(`${global.api}/sport/gameevents?q=${encodeURIComponent('vs')}`);
    const data = await response.json();

    if (!data.status || !data.result) {
      return reply("❌ Failed to fetch match details.");
    }

    const match = data.result.find(m => m.id === matchId);
    
    if (!match) {
      return reply(`❌ Match with ID ${matchId} not found.`);
    }

    let message = `*⚽ Detailed Match Information ⚽*\n\n`;
    
    // Format match details
    const homeScore = match.teams?.home?.score ?? 0;
    const awayScore = match.teams?.away?.score ?? 0;
    
    if (match.status === 'Match Finished') {
      message += `✅ *${match.match}*\n`;
    } else if (match.status?.toLowerCase().includes('live')) {
      message += `🔴 *LIVE: ${match.match}*\n`;
    } else {
      message += `⏳ *${match.match}*\n`;
    }
    
    message += `┌────────────────\n`;
    message += `│ 🏠 *Home:* ${match.teams?.home?.name || 'Unknown'}\n`;
    message += `│ 🚌 *Away:* ${match.teams?.away?.name || 'Unknown'}\n`;
    message += `│ 📊 *Score:* ${homeScore} - ${awayScore}\n`;
    message += `└────────────────\n`;
    message += `│ 🏆 *Competition:* ${match.league?.name || 'Unknown'}\n`;
    message += `│ 📅 *Season:* ${match.season || 'N/A'}\n`;
    message += `│ 🔄 *Round:* ${match.round || 'N/A'}\n`;
    
    if (match.dateTime) {
      const matchDate = new Date(match.dateTime.timestamp || match.dateTime.date);
      const formattedDate = matchDate.toLocaleString('en-US', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
      message += `│ ⏰ *Date:* ${formattedDate}\n`;
    }
    
    if (match.venue?.name) {
      message += `│ 🏟️ *Venue:* ${match.venue.name}`;
      if (match.venue.city) message += `, ${match.venue.city}`;
      if (match.venue.country) message += `, ${match.venue.country}`;
      message += `\n`;
    }
    
    message += `│ ℹ️ *Status:* ${match.status || 'Scheduled'}\n`;
    
    if (match.media?.video) {
      message += `│ 📺 *Highlights:* ${match.media.video}\n`;
    }
    
    message += `─────────────────\n\n`;

    reply(message);
  } catch (error) {
    console.error('Error fetching match details:', error);
    reply("❌ Error fetching match details. Please try again later.");
  }
}

// Get Today's Matches
async function getTodaysMatches({ reply }) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const response = await fetch(`${global.api}/sport/gameevents?q=${today}`);
    const data = await response.json();
    
    if (!data.status || !data.result || data.result.length === 0) {
      return reply("❌ No matches found for today.");
    }

    const todaysMatches = data.result.filter(match => 
      match.dateTime?.date === today || 
      new Date(match.dateTime?.timestamp || match.dateTime?.date).toISOString().split('T')[0] === today
    );

    if (todaysMatches.length === 0) {
      return reply("❌ No matches scheduled for today.");
    }

    let message = `*📅 Today's Matches (${today}) ⚽*\n\n`;
    
    const byCompetition = {};
    todaysMatches.forEach(match => {
      const comp = match.league?.name || 'Other';
      if (!byCompetition[comp]) byCompetition[comp] = [];
      byCompetition[comp].push(match);
    });

    Object.entries(byCompetition).forEach(([competition, matches]) => {
      message += `*🏆 ${competition}*\n`;
      matches.forEach(match => {
        message += `   • ${match.match}`;
        if (match.status !== 'Scheduled') {
          message += ` (${match.teams?.home?.score || 0}-${match.teams?.away?.score || 0})`;
        }
        message += `\n`;
        if (match.dateTime?.time) {
          message += `     ⏰ ${match.dateTime.time.substring(0, 5)}\n`;
        }
      });
      message += `\n`;
    });

    reply(message);
  } catch (error) {
    console.error('Error fetching today\'s matches:', error);
    reply("❌ Error fetching today's matches. Please try again later.");
  }
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

// Live Scores
async function getLiveScores({ reply }) {
  try {
    const response = await fetch(`${global.api}/livescore2`);
    const data = await response.json();
    
    if (!data.status || !data.result?.data?.list) {
      return reply("❌ No live scores available.");
    }
    
    const matches = data.result.data.list;
    if (matches.length === 0) {
      return reply("📊 No live matches at the moment.");
    }
    
    let message = `*🔴 LIVE SCORES ⚽*\n\n`;
    message += `*📊 Currently Live: ${matches.length} matches*\n\n`;
    
    matches.forEach((match, index) => {
      const statusEmoji = match.statusLive === 3 ? '✅' : '🔴';
      message += `*${index + 1}. ${match.team1?.name} vs ${match.team2?.name}*\n`;
      message += `   📊 Score: ${match.team1?.score || 0} - ${match.team2?.score || 0}\n`;
      message += `   🏆 League: ${match.league || 'N/A'}\n`;
      message += `   ${statusEmoji} Status: ${match.timeDesc || match.status || 'Live'}\n\n`;
    });
    
    reply(message);
  } catch (error) {
    console.error('Error fetching live scores:', error);
    reply("❌ Error fetching live scores.");
  }
}

// Football News
async function getFootballNews({ reply }) {
  try {
    const response = await fetch(`${global.api}/football/news`);
    const data = await response.json();
    
    if (!data.status || !data.result) {
      return reply("❌ No football news available.");
    }
    
    const news = data.result.news || data.result;
    if (!news || news.length === 0) {
      return reply("📰 No news articles found.");
    }
    
    let message = `*📰 Latest Football News ⚽*\n\n`;
    
    news.slice(0, 5).forEach((item, index) => {
      message += `*${index + 1}. ${item.title}*\n`;
      if (item.description) message += `📝 ${item.description.substring(0, 100)}...\n`;
      if (item.source) message += `📰 Source: ${item.source}\n`;
      if (item.url) message += `🔗 [Read More](${item.url})\n`;
      message += `\n`;
    });
    
    reply(message);
  } catch (error) {
    console.error('Error fetching football news:', error);
    reply("❌ Error fetching football news.");
  }
}

// ==================== WRESTLING FUNCTIONS ====================
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

module.exports = {
  formatStandings,
  formatMatches,
  formatTopScorers,
  formatUpcomingMatches,
  searchTeam,
  searchPlayer,
  searchVenue,
  getLiveScores,
  getFootballNews,
  getWrestlingEvents,
  getWWENews,
  getWWESchedule
};