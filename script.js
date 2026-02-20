// Matrix Effect
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

// Handle window resize for responsive design
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const fontSize = 16;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1);

// Update columns and drops on resize
window.addEventListener('resize', () => {
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
});

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#4169E1"; // Blue matrix text  
    ctx.font = fontSize + "px arial";

    for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}

// Countdown Logic
const countdownElement = document.getElementById('countdown');
const messageElement = document.getElementById('message');
const videoElement = document.getElementById('birthday-video');
const gifElement = document.getElementById('birthday-gif');

let count = 3;

// Configuration: Choose what to display ('video', 'gif', 'both', or 'none')
const mediaConfig = {
    showVideo: true,  // Set to true to show video
    showGif: false,   // Set to true to show GIF
    videoPath: 'birthday.mp4',  // Path to your video file
    gifPath: 'birthday.gif',     // Path to your GIF file
    backendURL: typeof CONFIG !== 'undefined' ? CONFIG.BACKEND_URL : 'YOUR_BACKEND_URL_HERE'
};

// Use both IndexedDB (for local storage) and backend (for cross-device sharing)
const USE_BACKEND = typeof CONFIG !== 'undefined' ? CONFIG.USE_BACKEND : false;

// IndexedDB setup for storing large video files locally
const DB_NAME = 'BirthdayMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'mediaFiles';

// Check for IndexedDB support
const indexedDBSupported = (function() {
    return !!(window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB);
})();

// Initialize IndexedDB with browser prefixes
function initDB() {
    if (!indexedDBSupported) {
        console.warn('IndexedDB not supported in this browser');
        return Promise.reject('IndexedDB not supported');
    }
    
    return new Promise((resolve, reject) => {
        const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
    });
}

// Save file to IndexedDB
async function saveFileToIndexedDB(key, file) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(file, key);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// Get file from IndexedDB
async function getFileFromIndexedDB(key) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Load saved media from IndexedDB and/or backend
async function loadSavedMedia() {
    try {
        // First, try to load from backend if available
        if (USE_BACKEND && mediaConfig.backendURL) {
            try {
                const response = await fetch(`${mediaConfig.backendURL}/get-media`);
                if (response.ok) {
                    const data = await response.json();
                    
                    if (data.videoURL) {
                        mediaConfig.videoPath = data.videoURL;
                        mediaConfig.showVideo = true;
                        console.log('Video loaded from backend');
                        return; // Exit if backend load successful
                    }
                }
            } catch (backendError) {
                console.log('Backend not available, falling back to local storage');
            }
        }
        
        // Fallback to IndexedDB for local storage
        const savedVideo = await getFileFromIndexedDB('lastUsedVideo');
        const savedGif = await getFileFromIndexedDB('lastUsedGif');
        
        if (savedVideo) {
            const videoUrl = URL.createObjectURL(savedVideo);
            mediaConfig.videoPath = videoUrl;
            mediaConfig.showVideo = true;
            console.log('Video loaded from local IndexedDB');
        }
        
        if (savedGif) {
            const gifUrl = URL.createObjectURL(savedGif);
            mediaConfig.gifPath = gifUrl;
            mediaConfig.showGif = true;
        }
    } catch (error) {
        console.error('Error loading saved media:', error);
    }
}

// Apply media configuration
async function setupMedia() {
    await loadSavedMedia();
    
    if (mediaConfig.showVideo && videoElement) {
        videoElement.querySelector('source').src = mediaConfig.videoPath;
        videoElement.load();
    }
    if (mediaConfig.showGif && gifElement) {
        gifElement.src = mediaConfig.gifPath;
    }
}

const timer = setInterval(() => {
    count--;
    if (count > 0) {
        countdownElement.innerText = count;
    } else {
        clearInterval(timer);
        countdownElement.classList.add('hidden');
        messageElement.classList.remove('hidden');
        
        // Show video and/or GIF based on configuration
        const noVideoMessage = document.getElementById('no-video-message');
        
        if (mediaConfig.showVideo && videoElement) {
            videoElement.classList.remove('hidden');
            if (noVideoMessage) noVideoMessage.classList.add('hidden');
            
            // Handle autoplay for mobile devices
            const playPromise = videoElement.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Video autoplay successful');
                }).catch((error) => {
                    console.log('Autoplay prevented, user interaction required:', error);
                    // On mobile, user may need to tap to play
                });
            }
        } else {
            // Show "no video" message
            if (noVideoMessage) {
                noVideoMessage.classList.remove('hidden');
                // Make it clickable to upload video
                noVideoMessage.addEventListener('dblclick', () => {
                    videoFileInput.click();
                });
            }
        }
        
        if (mediaConfig.showGif && gifElement) {
            gifElement.classList.remove('hidden');
        }
    }
}, 1000);

// Initialize media on page load
setupMedia();

// Media change functionality - double-click on video/gif to change
const videoFileInput = document.getElementById('video-file-input');
const gifFileInput = document.getElementById('gif-file-input');

// Double-click on video to change it
videoElement.addEventListener('dblclick', (e) => {
    // Prevent video controls from interfering
    e.preventDefault();
    e.stopPropagation();
    videoFileInput.click();
});

// For mobile: handle double-tap
let videoLastTap = 0;
videoElement.addEventListener('touchend', (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - videoLastTap;
    
    if (tapLength < 500 && tapLength > 0) {
        // Double tap detected
        e.preventDefault();
        e.stopPropagation();
        videoFileInput.click();
    }
    
    videoLastTap = currentTime;
});

// Double-click on GIF to change it
gifElement.addEventListener('dblclick', () => {
    gifFileInput.click();
});

// For mobile: handle double-tap for GIF
let gifLastTap = 0;
gifElement.addEventListener('touchend', (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - gifLastTap;
    
    if (tapLength < 500 && tapLength > 0) {
        // Double tap detected
        e.preventDefault();
        gifFileInput.click();
    }
    
    gifLastTap = currentTime;
});

// Load video from file upload
videoFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        loadVideoFromUrl(url);
        
        // Save file to IndexedDB for local access
        try {
            await saveFileToIndexedDB('lastUsedVideo', file);
            console.log('Video saved to local IndexedDB');
        } catch (error) {
            console.error('Error saving video to IndexedDB:', error);
        }
        
        // Upload to backend for cross-device sharing
        if (USE_BACKEND && mediaConfig.backendURL) {
            try {
                const formData = new FormData();
                formData.append('video', file);
                
                const response = await fetch(`${mediaConfig.backendURL}/upload-video`, {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Video uploaded to backend:', data);
                    alert('Video uploaded! It will now be available on all devices.');
                } else {
                    console.error('Failed to upload video to backend');
                }
            } catch (uploadError) {
                console.error('Error uploading to backend:', uploadError);
            }
        }
    }
});

// Load GIF from file upload
gifFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        loadGifFromUrl(url);
        
        // Save file to IndexedDB
        try {
            await saveFileToIndexedDB('lastUsedGif', file);
            console.log('GIF saved successfully');
        } catch (error) {
            console.error('Error saving GIF to IndexedDB:', error);
        }
    }
});

// Helper function to load video
function loadVideoFromUrl(url) {
    if (videoElement) {
        const source = videoElement.querySelector('source');
        source.src = url;
        videoElement.load();
        videoElement.classList.remove('hidden');
        
        // Hide no-video message
        const noVideoMessage = document.getElementById('no-video-message');
        if (noVideoMessage) {
            noVideoMessage.classList.add('hidden');
        }
        
        // For mobile devices, especially iOS, we need user interaction to play
        const playPromise = videoElement.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Autoplay started successfully
                console.log('Video playing');
            }).catch((error) {
                // Autoplay was prevented, show play button
                console.log('Autoplay prevented:', error);
                videoElement.setAttribute('controls', 'controls');
            });
        }
        
        mediaConfig.showVideo = true;
    }
}

// Helper function to load GIF
function loadGifFromUrl(url) {
    if (gifElement) {
        gifElement.src = url;
        gifElement.classList.remove('hidden');
        mediaConfig.showGif = true;
    }
}



setInterval(drawMatrix, 33);