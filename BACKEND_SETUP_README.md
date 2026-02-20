# Cross-Device Video Sharing Setup Guide

## Problem
IndexedDB stores data locally on each device's browser, so videos uploaded on one device won't appear on other devices scanning the QR code.

## Solution Options

### Option 1: Deploy Backend Server (Recommended for Cross-Device Sharing)

#### Step 1: Deploy the Backend

**Option A: Deploy to Vercel (Easiest - Free)**
1. Install Vercel CLI: `npm install -g vercel`
2. In your project folder, run: `vercel`
3. Follow the prompts to deploy
4. Copy the deployment URL (e.g., `https://your-app.vercel.app`)

**Option B: Deploy to Railway (Free tier available)**
1. Sign up at https://railway.app
2. Create a new project
3. Connect your GitHub repo or upload files
4. Railway will auto-detect Node.js and deploy
5. Copy the deployment URL

**Option C: Deploy to Heroku**
1. Install Heroku CLI: `npm install -g heroku`
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Deploy: `git push heroku master`
5. Copy the deployment URL

#### Step 2: Update Your Frontend Code

In `script.js`, update these lines:
```javascript
const USE_BACKEND = true;  // Change to true
mediaConfig.backendURL = 'https://your-deployed-url.com';  // Add your URL
```

#### Step 3: Redeploy Your Frontend
- Push updated code to your Vercel/GitHub Pages
- Generate new QR code pointing to updated site

### Option 2: Use Cloud Storage Service (Alternative)

Instead of a custom backend, use services like:
- **Cloudinary** (free tier: 25GB)
- **Firebase Storage** (free tier: 5GB)
- **AWS S3** (pay as you go)

### Option 3: Keep Local Storage Only (Current Setup)

If cross-device sharing isn't needed:
- Each device maintains its own video
- Works offline
- No backend required
- Already implemented ?

## Current Behavior

- ? Video saves on the device that uploads it
- ? Video doesn't transfer to other devices
- ? Each device can have its own video
- ? Works on all browsers and mobile devices

## After Backend Setup

- ? Video uploads from any device
- ? All devices see the same video
- ? Video persists across sessions
- ? Real-time updates for all users

## Installation (If Using Backend)

```bash
# Install dependencies
npm install

# Run locally (for testing)
npm start

# Or run with auto-reload
npm run dev
```

## Environment Variables

For production, set these environment variables:
- `PORT` - Server port (default: 3000)
- `MAX_FILE_SIZE` - Maximum video size in bytes

## File Size Considerations

- Current limit: 100MB per video
- Adjust in `server.js`: `limits: { fileSize: 100 * 1024 * 1024 }`
- Consider video compression for mobile users

## Security Recommendations (For Production)

1. Add authentication
2. Limit CORS to your domain only
3. Add rate limiting
4. Implement file type validation
5. Use HTTPS only
6. Add virus scanning for uploads
