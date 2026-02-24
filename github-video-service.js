// GitHub Video Service
// Converts a File object to Base64 and uploads it via the Cloudflare Worker proxy.
// The Worker handles GitHub API authentication and CORS on the server side.

const GitHubVideoService = (() => {
    // Convert a File/Blob to a Base64-encoded string (data stripped of prefix)
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                // result is "data:<mime>;base64,<content>" — strip the prefix
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }

    // Upload a video File to GitHub via the Cloudflare Worker
    async function uploadVideo(file) {
        const workerURL = typeof CONFIG !== 'undefined' ? CONFIG.BACKEND_URL : null;
        if (!workerURL) {
            throw new Error('CONFIG.BACKEND_URL is not defined');
        }

        const base64Content = await fileToBase64(file);

        const response = await fetch(`${workerURL}/upload-video`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filename: file.name,
                content: base64Content
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed (${response.status}): ${errorText}`);
        }

        return response.json();
    }

    // Fetch the latest video metadata (download_url) from the Cloudflare Worker
    async function getMedia() {
        const workerURL = typeof CONFIG !== 'undefined' ? CONFIG.BACKEND_URL : null;
        if (!workerURL) {
            throw new Error('CONFIG.BACKEND_URL is not defined');
        }

        const response = await fetch(`${workerURL}/get-media`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch media (${response.status})`);
        }

        return response.json();
    }

    return { uploadVideo, getMedia };
})();
