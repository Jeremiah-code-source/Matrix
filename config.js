// Configuration file for easy backend setup
// Edit these values based on your deployment

const CONFIG = {
    // Cloudflare Worker acts as a proxy bridge to GitHub
    USE_BACKEND: true,

    // Your deployed Vercel backend URL
    BACKEND_URL: 'https://matrix-three-jet.vercel.app',

    // Path inside your GitHub repo where the video is stored
    GITHUB_VIDEO_PATH: 'uploads/current-video.mp4',

    // Maximum file size for local storage (in MB)
    MAX_LOCAL_FILE_SIZE: 50,

    // Video formats accepted
    ACCEPTED_VIDEO_FORMATS: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],

    // GIF formats accepted
    ACCEPTED_GIF_FORMATS: ['image/gif']
};

// Export for use in script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
