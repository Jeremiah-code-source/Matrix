// Vercel serverless function — serves config.js with the GitHub token
// injected from a Vercel environment variable (never stored in the repo).
export default function handler(req, res) {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'no-store');

    const token = process.env.GITHUB_TOKEN || '';

    res.status(200).send(`
const CONFIG = {
    GITHUB_RAW_URL: 'https://raw.githubusercontent.com/Jeremiah-code-source/Matrix_videos/main/current-video.mp4',
    GITHUB_OWNER: 'Jeremiah-code-source',
    GITHUB_REPO: 'Matrix_videos',
    GITHUB_BRANCH: 'main',
    GITHUB_FILE_PATH: 'current-video.mp4',
    GITHUB_TOKEN: '${token}',
    MAX_LOCAL_FILE_SIZE: 50,
    ACCEPTED_VIDEO_FORMATS: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
    ACCEPTED_GIF_FORMATS: ['image/gif']
};
    `.trim());
}
