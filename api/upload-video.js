// Vercel Serverless Function for video upload
const multiparty = require('multiparty');

// In-memory storage (temporary - resets on cold start)
// For production, use external storage like AWS S3, Cloudinary, etc.
let currentVideo = null;

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const form = new multiparty.Form();

        return new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    res.status(500).json({ error: 'Upload failed', details: err.message });
                    return reject(err);
                }

                if (!files.video || files.video.length === 0) {
                    res.status(400).json({ error: 'No video file uploaded' });
                    return resolve();
                }

                const videoFile = files.video[0];
                const fs = require('fs');
                
                // Read file as base64 to store in memory
                const videoData = fs.readFileSync(videoFile.path, { encoding: 'base64' });
                const videoType = videoFile.headers['content-type'];

                // Store in memory (temporary)
                currentVideo = {
                    data: videoData,
                    type: videoType,
                    filename: videoFile.originalFilename,
                    timestamp: Date.now()
                };

                res.status(200).json({
                    success: true,
                    message: 'Video uploaded successfully',
                    videoURL: '/api/get-video',
                    filename: videoFile.originalFilename
                });

                resolve();
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
