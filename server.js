// Simple Node.js + Express backend for cross-device video sharing
// Deploy this to a service like Vercel, Heroku, Railway, or your own server

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins (adjust for production)
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Always save as 'current-video' with original extension
        const ext = path.extname(file.originalname);
        cb(null, `current-video${ext}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

// Upload video endpoint
app.post('/upload-video', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const videoURL = `/uploads/${req.file.filename}`;
    console.log('Video uploaded:', videoURL);
    
    res.json({
        success: true,
        videoURL: videoURL,
        filename: req.file.filename
    });
});

// Get current video endpoint
app.get('/get-media', (req, res) => {
    const files = fs.readdirSync(uploadsDir);
    const videoFile = files.find(f => f.startsWith('current-video'));
    
    if (videoFile) {
        res.json({
            videoURL: `/uploads/${videoFile}`
        });
    } else {
        res.json({
            videoURL: null
        });
    }
});

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
