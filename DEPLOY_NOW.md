# ?? Deploy Your Backend NOW - Simple Steps

You're logged into Vercel! Here's what to do:

## Step 1: Deploy Backend (2 minutes)

Open a **new terminal/command prompt** and run:

```bash
cd "C:\Users\Kenan Prins\Videos\Matrix"
vercel --prod
```

**Answer the prompts:**
- "Set up and deploy?" ? **Y** (Yes)
- "Which scope?" ? Press **Enter** (use default)
- "Link to existing project?" ? **N** (No)
- "What's your project's name?" ? **matrix-birthday** (or press Enter for default)
- "In which directory is your code located?" ? Press **Enter** (./)
- "Want to override the settings?" ? **N** (No)

**Wait for deployment...** (takes 30-60 seconds)

You'll get a URL like: `https://matrix-birthday-abc123.vercel.app`

## Step 2: Copy Your Backend URL

From the terminal output, copy the **Production** URL that looks like:
```
??  Production: https://matrix-birthday-abc123.vercel.app
```

## Step 3: Update config.js

Open `config.js` and change:

```javascript
const CONFIG = {
    USE_BACKEND: true,  // Change this to true
    BACKEND_URL: 'https://matrix-birthday-abc123.vercel.app',  // Paste your URL here
```

## Step 4: Test Your Backend

Visit in your browser:
```
https://your-backend-url.vercel.app
```

You should see:
```json
{"status":"Server is running"}
```

## Step 5: Push Changes to GitHub

```bash
git add .
git commit -m "Enable backend for cross-device video sharing"
git push origin master
```

Your frontend will auto-deploy and now ALL devices will share the same video!

## ? Test Cross-Device Sharing

1. **Device A**: Open your site, double-click video, upload a video
2. **Device B**: Scan QR code, wait for countdown
3. **Result**: Device B should see the video from Device A! ?

## ?? Done!

Now when anyone scans the QR code, they'll see the same video that was uploaded!

## Troubleshooting

**If deployment fails:**
```bash
# Try without --prod first
vercel
```

**If backend URL doesn't work:**
- Make sure you copied the FULL URL including https://
- Check that config.js has USE_BACKEND: true

**If video doesn't sync:**
- Open browser console (F12) on both devices
- Check for error messages
- Verify backend URL in config.js matches deployment URL
