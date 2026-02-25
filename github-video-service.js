// GitHub Video Service
// Uploads video directly to the Matrix_videos GitHub repo via the GitHub Contents API.
// No backend or Cloudflare Worker needed.

const GitHubVideoService = (() => {
    // Convert a File/Blob to a Base64-encoded string (data stripped of prefix)
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }

    // Get the current SHA of the file if it exists (required by GitHub API to overwrite)
    async function getFileSHA(token, owner, repo, branch, filePath) {
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`,
            { headers: { Authorization: `token ${token}` } }
        );
        if (response.status === 404) return null;
        if (!response.ok) throw new Error(`Failed to get file SHA (${response.status})`);
        const data = await response.json();
        return data.sha;
    }

    // Upload a video File directly to GitHub, overwriting current-video.mp4
    async function uploadVideo(file) {
        const token     = typeof CONFIG !== 'undefined' ? CONFIG.GITHUB_TOKEN     : null;
        const owner     = typeof CONFIG !== 'undefined' ? CONFIG.GITHUB_OWNER     : null;
        const repo      = typeof CONFIG !== 'undefined' ? CONFIG.GITHUB_REPO      : null;
        const branch    = typeof CONFIG !== 'undefined' ? CONFIG.GITHUB_BRANCH    : 'main';
        const filePath  = typeof CONFIG !== 'undefined' ? CONFIG.GITHUB_FILE_PATH : 'current-video.mp4';

        if (!token || token === 'YOUR_GITHUB_TOKEN_HERE') {
            throw new Error('GITHUB_TOKEN is not set in config.js');
        }

        const base64Content = await fileToBase64(file);
        const sha = await getFileSHA(token, owner, repo, branch, filePath);

        const body = {
            message: 'Update video',
            content: base64Content,
            branch: branch
        };
        if (sha) body.sha = sha;

        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed (${response.status}): ${errorText}`);
        }

        return response.json();
    }

    // Returns the current SHA of the video file on GitHub (used to detect changes)
    async function getCurrentSHA() {
        const token    = typeof CONFIG !== 'undefined' ? CONFIG.GITHUB_TOKEN    : null;
        const owner    = typeof CONFIG !== 'undefined' ? CONFIG.GITHUB_OWNER    : null;
        const repo     = typeof CONFIG !== 'undefined' ? CONFIG.GITHUB_REPO     : null;
        const branch   = typeof CONFIG !== 'undefined' ? CONFIG.GITHUB_BRANCH   : 'main';
        const filePath = typeof CONFIG !== 'undefined' ? CONFIG.GITHUB_FILE_PATH : 'current-video.mp4';
        return getFileSHA(token, owner, repo, branch, filePath);
    }

    // Fetches the video via GitHub API and returns a local blob URL.
    // This bypasses the CDN cache (max-age=300) that raw.githubusercontent.com applies.
    async function fetchVideoBlob() {
        const token    = typeof CONFIG !== 'undefined' ? CONFIG.GITHUB_TOKEN    : null;
        const owner    = typeof CONFIG !== 'undefined' ? CONFIG.GITHUB_OWNER    : null;
        const repo     = typeof CONFIG !== 'undefined' ? CONFIG.GITHUB_REPO     : null;
        const branch   = typeof CONFIG !== 'undefined' ? CONFIG.GITHUB_BRANCH   : 'main';
        const filePath = typeof CONFIG !== 'undefined' ? CONFIG.GITHUB_FILE_PATH : 'current-video.mp4';

        // Step 1: get the API metadata to find the current download_url
        const meta = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}&t=${Date.now()}`,
            { headers: { Authorization: `token ${token}`, 'Cache-Control': 'no-cache' } }
        );
        if (!meta.ok) throw new Error(`Failed to get video metadata (${meta.status})`);
        const data = await meta.json();

        // Step 2: download the actual bytes via the authenticated download_url
        const videoRes = await fetch(data.download_url, {
            headers: { Authorization: `token ${token}`, 'Cache-Control': 'no-cache' }
        });
        if (!videoRes.ok) throw new Error(`Failed to download video (${videoRes.status})`);

        const blob = await videoRes.blob();
        return { blobURL: URL.createObjectURL(blob), sha: data.sha };
    }

    // Fetches metadata for a public repo file without needing a token.
    // Returns { sha, downloadUrl } so callers can detect changes and build a cache-busted URL.
    async function fetchPublicVideoInfo() {
        const owner    = typeof CONFIG !== 'undefined' ? CONFIG.GITHUB_OWNER     : null;
        const repo     = typeof CONFIG !== 'undefined' ? CONFIG.GITHUB_REPO      : null;
        const branch   = typeof CONFIG !== 'undefined' ? CONFIG.GITHUB_BRANCH    : 'main';
        const filePath = typeof CONFIG !== 'undefined' ? CONFIG.GITHUB_FILE_PATH : 'current-video.mp4';

        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}&t=${Date.now()}`,
            { headers: { 'Cache-Control': 'no-cache' } }
        );
        if (response.status === 404) return null;
        if (!response.ok) throw new Error(`Failed to get public video info (${response.status})`);
        const data = await response.json();
        return { sha: data.sha, downloadUrl: data.download_url };
    }

    return { uploadVideo, getCurrentSHA, fetchVideoBlob, fetchPublicVideoInfo };