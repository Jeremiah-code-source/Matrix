# ?? QUICK START - Deploy Backend in 3 Minutes

## ? The Easiest Way - Use PowerShell Script

### Step 1: Run Deployment Script
Right-click `deploy.ps1` and select **"Run with PowerShell"**

OR open PowerShell and run:
```powershell
cd "C:\Users\Kenan Prins\Videos\Matrix"
.\deploy.ps1
```

**That's it!** The script will:
- ? Check your Vercel login
- ? Deploy your backend
- ? Update config.js automatically
- ? Open test page in browser

---

## ??? Manual Deployment (If script doesn't work)

### Step 1: Deploy to Vercel
```bash
cd "C:\Users\Kenan Prins\Videos\Matrix"
vercel --prod --yes
```

### Step 2: Copy the URL
Look for: `Production: https://matrix-....vercel.app`

### Step 3: Update config.js
```javascript
USE_BACKEND: true,
BACKEND_URL: 'https://your-url.vercel.app',
```

### Step 4: Test
Open `test-backend.html` in your browser

---

## ?? Testing Your Backend

1. **Open test-backend.html** in your browser
2. Click **"Test Connection"**
3. Should show: ? Backend is working!

OR visit in browser:
```
https://your-backend-url.vercel.app
```

Should show:
```json
{"status":"Server is running"}
```

---

## ?? Push to GitHub

```bash
git add .
git commit -m "Enable backend for cross-device sharing"
git push origin master
```

Your frontend at https://ee-jet.vercel.app will auto-update!

---

## ?? Test Cross-Device Video Sharing

### Device A (Upload):
1. Open your site: https://ee-jet.vercel.app
2. Wait for countdown
3. **Double-click** on the video
4. Upload a video
5. Wait for "Video uploaded!" message

### Device B (View):
1. Scan QR code
2. Wait for countdown
3. **Video from Device A should appear!** ?

---

## ? Troubleshooting

### Backend not deploying?
```bash
# Try without --prod first
vercel

# Check if you're logged in
vercel whoami
```

### Config not updating?
Manually edit `config.js`:
```javascript
const CONFIG = {
    USE_BACKEND: true,
    BACKEND_URL: 'https://your-actual-url.vercel.app',
```

### Video not syncing?
1. Open browser console (F12) on both devices
2. Check for errors
3. Verify config.js has correct URL
4. Test backend with test-backend.html

### CORS errors?
Your server.js already has CORS enabled. If issues persist:
```javascript
// In server.js, update:
app.use(cors({
    origin: 'https://ee-jet.vercel.app'
}));
```

---

## ?? What Each File Does

| File | Purpose |
|------|---------|
| `deploy.ps1` | **Automated deployment script** |
| `test-backend.html` | **Test if backend is working** |
| `config.js` | **Configuration settings** |
| `server.js` | **Backend server code** |
| `vercel.json` | **Vercel deployment config** |

---

## ?? Your Next Steps

1. ? You're already logged into Vercel
2. ?? Run `deploy.ps1` or `vercel --prod --yes`
3. ?? Copy URL to config.js
4. ?? Push to GitHub
5. ? Test cross-device!

---

## ?? Pro Tips

- **Test locally first:** `npm start` (backend runs on http://localhost:3000)
- **View logs:** `vercel logs` 
- **Redeploy anytime:** Just run `vercel --prod` again
- **Free tier limits:** 100GB bandwidth/month (plenty for personal use)

---

## ?? Need Help?

1. Check test-backend.html for connection issues
2. View browser console for JavaScript errors
3. Check Vercel logs: `vercel logs --follow`
4. Verify all files are committed: `git status`

---

**Ready? Run `deploy.ps1` now!** ??
