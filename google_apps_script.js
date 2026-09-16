/**
 * College Football DFS Tracker
 * Pulls pass catcher statistics (Targets, Receptions, Yards, TDs, YAC) from CollegeFootballData API
 * Organizes data with one row per player, columns for each week
 */

// ===========================
// CONFIGURATION
// ===========================
const SEASON = 2026;           // Season year
const SHEET_NAME = "WR Stats"; // Sheet name to populate
const API_BASE = "https://api.collegefootballdata.com";

// ===========================
// MAIN FUNCTION
// ===========================

/**
 * Main function to fetch weekly stats
 * Run this weekly to add a new week's data
 */
function fetchWeeklyStats() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    // Prompt user for week number
    const week = ui.prompt("Enter week number (1-15):").getResponseText();
    
    if (!week || isNaN(week) || week < 1 || week > 15) {
      ui.alert("Invalid week number. Please enter 1-15.");
      return;
    }
    
    const weekNum = parseInt(week);
    
    Logger.log(`Fetching stats for Season ${SEASON}, Week ${weekNum}...`);
    
    // Get games for the week
    const games = getGamesForWeek(weekNum);
    Logger.log(`Found ${games.length} games for week ${weekNum}`);
    
    if (games.length === 0) {
      ui.alert("No games found for week " + weekNum);
      return;
    }
    
    // Get passing stats for all teams
    const passingStats = getPassingStatsForWeek(games);
    Logger.log(`Found stats for ${Object.keys(passingStats).length} teams`);
    
    // Get sheet and ensure headers exist
    const sheet = getOrCreateSheet(SHEET_NAME);
    ensureHeaders(sheet, weekNum);
    
    // Populate player data
    populatePlayerStats(sheet, passingStats, weekNum);
    
    ui.alert(`Successfully loaded stats for Week ${weekNum}!`);
    Logger.log("Script completed successfully");
    
  } catch (error) {
    Logger.log("Error: " + error.toString());
    ui.alert("Error: " + error.toString());
  }
}

// ===========================
// API FUNCTIONS
// ===========================

/**
 * Get all games for a specific week
 */
function getGamesForWeek(week) {
  const url = `${API_BASE}/games?year=${SEASON}&week=${week}&seasonType=regular`;
  
  try {
    const response = UrlFetchApp.fetch(url);
    const games = JSON.parse(response.getContentText());
    return games || [];
  } catch (error) {
    Logger.log("Error fetching games: " + error);
    return [];
  }
}

/**
 * Get team passing stats for games in a week
 * Uses team stats endpoint to get passing targets/yards data
 */
function getPassingStatsForWeek(games) {
  const stats = {};
  
  for (const game of games) {
    try {
      // Get game stats
      const gameId = game.id;
      const url = `${API_BASE}/games/${gameId}/statistics`;
      
      const response = UrlFetchApp.fetch(url);
      const gameStats = JSON.parse(response.getContentText());
      
      if (gameStats) {
        // Store home and away team stats
        if (gameStats.teams && gameStats.teams.length >= 2) {
          const homeTeam = gameStats.teams[0];
          const awayTeam = gameStats.teams[1];
          
          if (!stats[homeTeam.school]) stats[homeTeam.school] = [];
          if (!stats[awayTeam.school]) stats[awayTeam.school] = [];
          
          stats[homeTeam.school].push({
            gameId: gameId,
            week: game.week,
            opponent: awayTeam.school,
            homeAway: "home"
          });
          
          stats[awayTeam.school].push({
            gameId: gameId,
            week: game.week,
            opponent: homeTeam.school,
            homeAway: "away"
          });
        }
      }
      
      // Be respectful of API rate limits
      Utilities.sleep(100);
      
    } catch (error) {
      Logger.log("Error fetching game stats for game " + game.id + ": " + error);
    }
  }
  
  return stats;
}

/**
 * Get player stats from CollegeFootballData
 * Fetches player season statistics
 */
function getPlayerStatsForSeason() {
  const playerStats = {};
  
  try {
    const url = `${API_BASE}/stats/player/season?year=${SEASON}`;
    const response = UrlFetchApp.fetch(url);
    const stats = JSON.parse(response.getContentText());
    
    // Group stats by player
    for (const stat of stats) {
      if (stat.player && stat.team) {
        const playerKey = `${stat.player}|${stat.team}`;
        
        if (!playerStats[playerKey]) {
          playerStats[playerKey] = {
            name: stat.player,
            team: stat.team,
            position: stat.position || "Unknown",
            stats: []
          };
        }
        
        playerStats[playerKey].stats.push(stat);
      }
    }
    
    return playerStats;
    
  } catch (error) {
    Logger.log("Error fetching player stats: " + error);
    return playerStats;
  }
}

// ===========================
// SHEET MANAGEMENT FUNCTIONS
// ===========================

/**
 * Get or create the target sheet
 */
function getOrCreateSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  
  return sheet;
}

/**
 * Ensure headers exist and add week columns as needed
 */
function ensureHeaders(sheet, week) {
  const firstRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Ensure base headers
  if (!firstRow[0] || firstRow[0] !== "Player Name") {
    sheet.insertRows(1);
    sheet.getRange(1, 1).setValue("Player Name");
    sheet.getRange(1, 2).setValue("Team");
    sheet.getRange(1, 3).setValue("Position");
  }
  
  // Calculate next available column
  const lastCol = sheet.getLastColumn() || 3;
  const weekHeaderPrefix = `Week ${week}`;
  
  // Check if week headers already exist
  const existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const weekExists = existingHeaders.some(h => h && h.toString().includes(`Week ${week}`));
  
  if (!weekExists) {
    // Add week columns: Targets, Rec, Yards, TDs, YAC
    const nextCol = lastCol + 1;
    const headers = [
      `Week ${week} Targets`,
      `Week ${week} Rec`,
      `Week ${week} Yards`,
      `Week ${week} TDs`,
      `Week ${week} YAC`
    ];
    
    for (let i = 0; i < headers.length; i++) {
      sheet.getRange(1, nextCol + i).setValue(headers[i]);
    }
  }
}

/**
 * Populate player statistics in the sheet
 */
function populatePlayerStats(sheet, gameTeamMap, week) {
  try {
    // Get all player stats for the season
    const allPlayerStats = getPlayerStatsForSeason();
    
    // Get existing player rows
    const lastRow = sheet.getLastRow();
    const existingPlayers = {};
    
    if (lastRow > 1) {
      const playerData = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
      for (let i = 0; i < playerData.length; i++) {
        const key = `${playerData[i][0]}|${playerData[i][1]}`;
        existingPlayers[key] = i + 2; // Row number
      }
    }
    
    // Find the column index for this week's stats
    const headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    let weekTargetsCol = -1;
    
    for (let i = 0; i < headerRow.length; i++) {
      if (headerRow[i] && headerRow[i].toString().includes(`Week ${week} Targets`)) {
        weekTargetsCol = i + 1;
        break;
      }
    }
    
    if (weekTargetsCol === -1) {
      Logger.log("Could not find week columns");
      return;
    }
    
    // Process each player
    let newPlayerRow = lastRow + 1;
    
    for (const playerKey in allPlayerStats) {
      const player = allPlayerStats[playerKey];
      const playerName = player.name;
      const teamName = player.team;
      const position = player.position;
      
      // Filter stats for this week only
      const weekStats = player.stats.filter(s => s.week === week);
      
      if (weekStats.length > 0) {
        const stat = weekStats[0];
        
        // Calculate totals from individual stats
        const targets = stat.targets || 0;
        const rec = stat.receptions || 0;
        const yards = stat.receivingYards || 0;
        const tds = stat.receivingTouchdowns || 0;
        const yac = stat.yardsAfterCatch || 0;
        
        // Check if player already exists
        const key = `${playerName}|${teamName}`;
        let rowNum;
        
        if (existingPlayers[key]) {
          rowNum = existingPlayers[key];
        } else {
          rowNum = newPlayerRow;
          sheet.getRange(rowNum, 1).setValue(playerName);
          sheet.getRange(rowNum, 2).setValue(teamName);
          sheet.getRange(rowNum, 3).setValue(position);
          newPlayerRow++;
        }
        
        // Fill in stats for this week
        sheet.getRange(rowNum, weekTargetsCol).setValue(targets);
        sheet.getRange(rowNum, weekTargetsCol + 1).setValue(rec);
        sheet.getRange(rowNum, weekTargetsCol + 2).setValue(yards);
        sheet.getRange(rowNum, weekTargetsCol + 3).setValue(tds);
        sheet.getRange(rowNum, weekTargetsCol + 4).setValue(yac);
      }
    }
    
    // Format the sheet
    formatSheet(sheet, weekTargetsCol);
    
  } catch (error) {
    Logger.log("Error populating stats: " + error);
    throw error;
  }
}

/**
 * Format the sheet with colors and number formatting
 */
function formatSheet(sheet, weekTargetsCol) {
  // Make header row bold
  const lastCol = sheet.getLastColumn();
  sheet.getRange(1, 1, 1, lastCol).setFontWeight("bold");
  sheet.getRange(1, 1, 1, lastCol).setBackground("#d3d3d3");
  
  // Format stat columns as numbers
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, weekTargetsCol, lastRow - 1, 5).setNumberFormat("0");
  }
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, lastCol);
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

/**
 * Test function to verify API connectivity
 */
function testAPI() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    const url = `${API_BASE}/games?year=${SEASON}&week=1&limit=1`;
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    
    if (data && data.length > 0) {
      ui.alert("API Connection Successful!\n\nSample game found: " + data[0].home_team + " vs " + data[0].away_team);
    } else {
      ui.alert("API Connection OK but no data returned");
    }
  } catch (error) {
    ui.alert("API Connection Failed: " + error.toString());
  }
}

/**
 * Clear all data and reset sheet
 */
function resetSheet() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    "This will clear all data. Are you sure?",
    ui.ButtonSet.YES_NO
  );
  
  if (response === ui.Button.YES) {
    const sheet = getOrCreateSheet(SHEET_NAME);
    sheet.clear();
    ui.alert("Sheet cleared");
  }
}
