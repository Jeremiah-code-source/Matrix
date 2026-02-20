// Vercel Serverless Function to get current video

// In-memory storage shared across functions
let currentVideo = null;

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!currentVideo) {
        return res.status(200).json({
            videoURL: null,
            message: 'No video uploaded yet'
        });
    }

    // Return video data as base64
    res.status(200).json({
        success: true,
        videoData: currentVideo.data,
        videoType: currentVideo.type,
        filename: currentVideo.filename,
        timestamp: currentVideo.timestamp
    });
}
