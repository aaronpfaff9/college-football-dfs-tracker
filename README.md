# College Football DFS Tracker

Automated tracker for college football pass catcher statistics (targets, receptions, yards, TDs, YAC) for daily fantasy sports (DFS) analysis.

## Features

- **Automatic Data Fetching**: Pulls data from CollegeFootballData API (free, no authentication required)
- **Weekly Updates**: Run once per week to populate all games for that week
- **All D1 Teams**: Tracks all Division I college football pass catchers
- **Pass Catchers**: Includes wide receivers, tight ends, and other eligible pass catchers
- **Key Metrics**: Targets, Receptions, Yards, Touchdowns, and Yards After Catch (YAC)
- **Google Sheets Integration**: Organizes data with one row per player, columns for each week's game

## Data Structure

The Google Sheet will be organized as:

| Player Name | Team | Position | Week 1 Targets | Week 1 Rec | Week 1 Yards | Week 1 TDs | Week 1 YAC | Week 2 Targets | ... |
|---|---|---|---|---|---|---|---|---|---|
| John Smith | Alabama | WR | 8 | 6 | 82 | 1 | 45 | 12 | ... |

Each new week adds new columns with that week's statistics.

## Setup Instructions

### 1. Get the Google Apps Script

Copy the contents of `google_apps_script.js` into your Google Sheet's Apps Script editor:
- Open your Google Sheet
- Go to **Extensions** → **Apps Script**
- Delete any existing code
- Paste the entire contents of `google_apps_script.js`
- Save the project

### 2. Configure Your Settings

In the Apps Script, update these variables at the top of the `fetchWeeklyStats()` function:

```javascript
const SEASON = 2026;           // Your season year
const WEEK = 1;                // Starting week (1-15)
const SHEET_NAME = "WR Stats"; // Your sheet name
```

### 3. Create Your Google Sheet

- Create a new Google Sheet or use an existing one
- Create a sheet named `"WR Stats"` (or whatever you named it above)
- Add headers in the first row:
  - Column A: `Player Name`
  - Column B: `Team`
  - Column C: `Position`

### 4. Run the Script

- In Apps Script, click the **Run** button
- Authorize the script when prompted
- Your sheet will populate with Week 1 data

### 5. (Optional) Set Up Automatic Weekly Updates

To run this automatically every week:
- In Apps Script, click the **clock icon** (Triggers)
- Click **Create new trigger**
- Set it to run `fetchWeeklyStats` weekly (e.g., every Monday at 9 AM)

## API Used

- **[CollegeFootballData API](https://collegefootballdata.com/)** - Free, no authentication required
  - Endpoint: `/stats/player/season` for player statistics
  - Endpoint: `/games` for game schedules
  - Full documentation: https://api.collegefootballdata.com/getting-started

## Files

- `google_apps_script.js` - Complete Google Apps Script code
- `README.md` - This file
- `SETUP.md` - Detailed setup guide with screenshots
- `sample_output.png` - Example of completed Google Sheet

## How It Works

1. **Script fetches games** for the specified week from CollegeFootballData
2. **Extracts pass catcher stats** (targets, receptions, yards, TDs, YAC)
3. **Checks if players already exist** in your sheet
4. **Adds new columns** for the week's data
5. **Populates statistics** for all pass catchers in that week's games

## Limitations

- YAC data may not be available for all players/games (CollegeFootballData may not have it for all seasons)
- Some advanced metrics vary by data availability
- Script runs on CollegeFootballData's data accuracy

## Troubleshooting

**Script won't run?**
- Check that your sheet name matches the `SHEET_NAME` variable
- Ensure you have authorization permissions for the script

**Data not populating?**
- Verify the week number is valid (1-15 for regular season)
- Check CollegeFootballData's status to ensure their API is responding
- Check the Apps Script execution logs (Execution → View logs)

**Missing players?**
- Some games may not have complete statistical data available
- Check the source data on CollegeFootballData's website

## Future Enhancements

- [ ] Automatic week number detection
- [ ] Historical data backfill
- [ ] Player salary integration (DraftKings, FanDuel)
- [ ] DFS projections
- [ ] Injury tracking
- [ ] Weather data integration

## License

MIT License - feel free to modify and use as needed

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the detailed setup guide in `SETUP.md`
3. Check CollegeFootballData's API documentation

---

Happy DFS! 🏈
