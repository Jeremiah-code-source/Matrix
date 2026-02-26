// Configuration file for easy backend setup
// This file is served dynamically by api/config.js on Vercel (token injected server-side).
// For local testing only — never commit a real token here.

const CONFIG = {
    GITHUB_RAW_URL: 'https://raw.githubusercontent.com/Jeremiah-code-source/Matrix_videos/main/current-video.mp4',
    GITHUB_OWNER: 'Jeremiah-code-source',
    GITHUB_REPO: 'Matrix_videos',
    GITHUB_BRANCH: 'main',
    GITHUB_FILE_PATH: 'current-video.mp4',
    GITHUB_TOKEN: 'YOUR_GITHUB_TOKEN_HERE',
    MAX_LOCAL_FILE_SIZE: 50,
    ACCEPTED_VIDEO_FORMATS: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
    ACCEPTED_GIF_FORMATS: ['image/gif']
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}