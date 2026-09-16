# Quick Start Guide

## TL;DR - Get Running in 5 Minutes

### 1. Create Google Sheet
- Go to [sheets.google.com](https://sheets.google.com)
- Click **+ New** → **Blank spreadsheet**
- Name it "College Football DFS 2026"

### 2. Open Apps Script
- Click **Extensions** → **Apps Script**

### 3. Copy Code
- Delete the template code
- Go to [google_apps_script.js](./google_apps_script.js) in this repo
- Copy all the code and paste into `Code.gs`
- Click **Save**

### 4. Authorize & Run
- Select **`fetchWeeklyStats`** from dropdown
- Click **Play (▶)** button
- Click **Review permissions** and **Allow**
- Enter week number: `1`

### 5. Check Your Sheet
- Go back to Google Sheet
- You should see pass catcher stats populated!

---

## That's It! 🎉

For detailed instructions, see [SETUP.md](./SETUP.md)

---

## Weekly Workflow

Every week, follow this to add new game data:

1. Open your Google Sheet
2. Click **Extensions** → **Apps Script**
3. Select **`fetchWeeklyStats`**
4. Click **Play** button
5. Enter the week number
6. Data appears automatically in new columns

---

## Available Functions in Script

| Function | What it does |
|---|---|
| `fetchWeeklyStats()` | Main function - fetch and populate data for a week |
| `testAPI()` | Test if CollegeFootballData API is working |
| `resetSheet()` | Clear all data and start over |

---

## Data You Get

For each player, each week:
- **Targets** - Number of pass targets
- **Receptions** - Number of catches
- **Yards** - Receiving yards
- **TDs** - Touchdown passes caught
- **YAC** - Yards After Catch (if available)

---

## API Info

Uses **CollegeFootballData.com** (free, no key needed)
- Endpoint: `/stats/player/season`
- Data updates throughout the season
- Rate limited to be respectful of their servers

---

## Troubleshooting

**Script errors?** → Check [SETUP.md Troubleshooting](./SETUP.md#troubleshooting)

**Missing data?** → Games might not be played yet or data might be incomplete

**Want to modify?** → Script is fully commented and ready to customize

---

## Next Steps

1. Follow the 5-minute setup above
2. Read [SETUP.md](./SETUP.md) for detailed instructions
3. Use data for your DFS analysis
4. Run weekly to keep stats updated

---

Happy DFS! 🏈
