# Quick Start Guide for Cross-Device Video Sharing

## The Problem You're Experiencing

When you scan the QR code on a different device, the video doesn't show because:
- **IndexedDB is device-specific** - each browser stores data locally
- Videos uploaded on Phone A are NOT accessible on Phone B
- Each device has its own separate storage

## Quick Fix Options

### ? Option 1: Deploy Backend (Best Solution)

This allows ALL devices to see the same video.

#### Easiest Way - Deploy to Vercel (Free):

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy your backend:**
   ```bash
   cd "C:\Users\Kenan Prins\Videos\Matrix"
   vercel
   ```
   - Press Enter for default options
   - Copy the deployment URL (e.g., `https://matrix-abc123.vercel.app`)

4. **Update config.js:**
   ```javascript
   USE_BACKEND: true,
   BACKEND_URL: 'https://matrix-abc123.vercel.app',
   ```

5. **Push changes and regenerate QR code**

### ?? Option 2: Use GitHub for Video Hosting (Free but Manual)

1. Upload video to your GitHub repo
2. Get the raw file URL
3. Update `birthday.mp4` in your code
4. All devices will load from GitHub

### ?? Option 3: Accept Device-Specific Storage (Current)

**Pros:**
- Works offline
- No backend needed
- Privacy - videos stay on device

**Cons:**
- Each device has separate video
- Video doesn't sync across devices

## How to Deploy Backend - Step by Step

### Prerequisites:
```bash
cd "C:\Users\Kenan Prins\Videos\Matrix"
npm install
```

### Deploy to Vercel:
```bash
vercel --prod
```

### Deploy to Railway:
1. Go to https://railway.app
2. Click "New Project"
3. Click "Deploy from GitHub repo"
4. Select your Matrix repository
5. Railway auto-detects Node.js and deploys
6. Copy the URL from Railway dashboard

### Deploy to Heroku:
```bash
heroku create matrix-birthday-app
git push heroku master
heroku open
```

## After Deployment

1. Update `config.js`:
   ```javascript
   const CONFIG = {
       USE_BACKEND: true,
       BACKEND_URL: 'https://your-deployed-url.com',
   };
   ```

2. Commit and push:
   ```bash
   git add .
   git commit -m "Add backend URL"
   git push origin master
   ```

3. Your Vercel frontend will auto-deploy
4. Generate new QR code pointing to updated site

## Testing Cross-Device

1. Open site on Device A
2. Upload a video (double-click video area)
3. Wait for "Video uploaded!" message
4. Open site on Device B using QR code
5. Video should appear after countdown

## Troubleshooting

### Video doesn't upload:
- Check browser console (F12)
- Verify backend URL in config.js
- Ensure backend server is running

### Video doesn't load on other devices:
- Verify USE_BACKEND is true
- Check backend URL is correct
- Test backend health: visit `https://your-backend-url.com`

### Backend deployment fails:
- Check Node.js version (needs 14+)
- Run `npm install` first
- Check logs for errors

## Cost Estimate

| Service | Free Tier | Limit |
|---------|-----------|-------|
| Vercel | Yes | 100GB bandwidth/month |
| Railway | Yes | 500 hours/month |
| Heroku | No (paid only now) | $5-7/month |

## Recommended: Vercel

**Why Vercel:**
- ? Free forever plan
- ? Automatic deployments from Git
- ? Fast CDN
- ? Easy setup
- ? HTTPS included

## Need Help?

1. Check logs: `vercel logs`
2. Test locally: `npm start`
3. Visit backend: `https://your-backend/get-media`
