# Detailed Setup Guide

## Step-by-Step Instructions

### Prerequisites
- Google account with Google Sheets access
- 5 minutes of setup time

---

## Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"+ New"** → **"Blank spreadsheet"**
3. Name it something like **"College Football DFS 2026"**
4. You now have your base sheet ready

---

## Step 2: Access Google Apps Script

1. In your new Google Sheet, click **Extensions** (top menu)
2. Select **Apps Script**
3. This opens a new tab with the script editor
4. You'll see a default `Code.gs` file with a `myFunction()` template

---

## Step 3: Copy the Script Code

1. **Delete all** the existing code in `Code.gs`
2. Go to the [google_apps_script.js](./google_apps_script.js) file in this repository
3. Copy **ALL** the code (the entire file)
4. Paste it into your `Code.gs` file in Apps Script
5. Click **Save** (Ctrl+S or Cmd+S)
6. You should see a dialog asking to name your project - name it **"College Football DFS Tracker"**
7. Click **OK**

---

## Step 4: Authorize the Script

1. In the Apps Script editor, find the dropdown at the top that says **"Select function"**
2. Select **`fetchWeeklyStats`**
3. Click the **Play (▶) button** to run it
4. You'll get a prompt: **"Authorization required"**
5. Click **"Review permissions"**
6. Select your Google account
7. Read the warning (this is normal for custom scripts)
8. Click **"Allow"** at the bottom

---

## Step 5: Run Your First Data Pull

1. After authorization, the script will prompt you: **"Enter week number (1-15):"**
2. Type **`1`** (for Week 1)
3. Click **OK**
4. The script will run and fetch all pass catcher stats for Week 1
5. **Go back to your Google Sheet** - it should now be populated with data!

---

## Step 6: Verify Your Sheet

Your sheet should look something like this:

| Player Name | Team | Position | Week 1 Targets | Week 1 Rec | Week 1 Yards | Week 1 TDs | Week 1 YAC |
|---|---|---|---|---|---|---|---|
| John Smith | Alabama | WR | 8 | 6 | 82 | 1 | 45 |
| Jane Doe | Georgia | TE | 5 | 4 | 63 | 0 | 28 |

If you see data, **congratulations!** Your tracker is working! 🎉

---

## Step 7: Add More Weeks

To add Week 2, 3, etc.:

1. Go back to your Google Sheet
2. Click **Extensions** → **Apps Script**
3. Click the **Play (▶) button** again
4. Enter the week number when prompted
5. New columns will be added for that week

**Repeat this process each week** to keep your tracker updated.

---

## Step 8 (Optional): Set Up Automatic Weekly Runs

If you want the script to run **automatically every week**:

1. In Apps Script, click the **Clock icon** (⏰) on the left sidebar - this is **Triggers**
2. Click **"Create new trigger"** (bottom right)
3. Configure:
   - **Function to execute**: `fetchWeeklyStats`
   - **Deployment**: Head
   - **Event source**: Time-driven
   - **Type of time based trigger**: Week timer
   - **Day**: Monday (or your preference)
   - **Time**: 9:00 AM (or your preference)
4. Click **Save**

Now the script will run automatically every Monday morning!

---

## Troubleshooting

### Script won't run or gives an error?

**Error: "Cannot find sheet 'WR Stats'"**
- The sheet needs to be named exactly `"WR Stats"`
- Go to your Google Sheet and rename the sheet tab at the bottom to `"WR Stats"`
- Run the script again

**Error: "Authorization required" keeps appearing**
- Click **Review permissions** and authorize again
- Make sure you're logged into the Google account that owns the sheet

**Error: "No games found for week X"**
- The week might not have games yet or might be over
- Try a different week number (1-15)
- Check that your season year (2026) is correct in the script

### Data is missing or incomplete?

**Why don't I see all players?**
- CollegeFootballData API only includes stats that have been recorded
- Some games might not have complete data entered yet
- Closer to game time or after games are played, more data appears

**Why is some data showing 0?**
- YAC (Yards After Catch) and some other stats might not be available for all players
- The API only shows data that was recorded

**How do I fix it?**
- Check the script logs:
  - In Apps Script, click **Execution** at the bottom
  - Click the most recent execution
  - Read the logs to see what happened

---

## Testing Your Setup

Before using this for DFS decisions, test it:

1. Run the script for a completed week (e.g., Week 1)
2. Compare the stats to an official source:
   - ESPN.com college football stats
   - CollegeFootballData.com directly
3. If the numbers match, you're good to go!

---

## How to Use for DFS

1. **After each week's games**, run the script
2. **Add a column** in your sheet for DFS salary and projection
3. **Use the target data** to identify high-volume receivers
4. **Cross-reference** with matchups for the next week
5. **Build your lineups** based on targets and efficiency

---

## Support

**Something not working?**

1. Check the **Troubleshooting** section above
2. Look at the Apps Script logs (click **Execution** to see what went wrong)
3. Re-read the **Setup Instructions** step by step
4. Check the [CollegeFootballData API status](https://collegefootballdata.com)

**Want to modify the script?**

- The script is fully commented and documented
- Feel free to edit it to add more stats, change column names, etc.
- Don't change the API calls unless you know what you're doing

---

## Tips & Tricks

**Tip 1: Save historical data**
- After each week, copy your data to a new sheet named "Week 1 Archive", "Week 2 Archive", etc.
- This preserves historical stats for comparison

**Tip 2: Add a DFS salary column**
- Add a column for DraftKings or FanDuel salary
- Create a formula to calculate salary-per-target
- Sort by this to find value plays

**Tip 3: Track week-over-week changes**
- Add a column to compare targets from Week 1 to Week 2
- Helps identify trending up/down players

**Tip 4: Filter by position**
- Use Google Sheets' filter feature (Data → Create a filter)
- Filter to just WRs, TEs, etc.

---

## Next Steps

1. ✅ Complete the setup above
2. ✅ Run the script for Week 1
3. ✅ Verify the data looks correct
4. ✅ Use it for your DFS analysis
5. ✅ Come back each week to add new data

Good luck with your DFS! 🏈📊
