// Matrix Effect
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

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
    gifPath: 'birthday.gif'      // Path to your GIF file
};

// IndexedDB setup for storing large video files
const DB_NAME = 'BirthdayMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'mediaFiles';

// Initialize IndexedDB
function initDB() {
    return new Promise((resolve, reject) => {
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

// Load saved media from IndexedDB
async function loadSavedMedia() {
    try {
        const savedVideo = await getFileFromIndexedDB('lastUsedVideo');
        const savedGif = await getFileFromIndexedDB('lastUsedGif');
        
        if (savedVideo) {
            const videoUrl = URL.createObjectURL(savedVideo);
            mediaConfig.videoPath = videoUrl;
            mediaConfig.showVideo = true;
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
        if (mediaConfig.showVideo && videoElement) {
            videoElement.classList.remove('hidden');
            videoElement.play();
        }
        if (mediaConfig.showGif && gifElement) {
            gifElement.classList.remove('hidden');
        }
    }
}, 1000);

// Initialize media on page load
setupMedia();

// Media change functionality - click on video/gif to change
const videoFileInput = document.getElementById('video-file-input');
const gifFileInput = document.getElementById('gif-file-input');

// Click on video to change it
videoElement.addEventListener('click', (e) => {
    // Prevent video controls from interfering
    e.preventDefault();
    videoFileInput.click();
});

// Click on GIF to change it
gifElement.addEventListener('click', () => {
    gifFileInput.click();
});

// Load video from file upload
videoFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        loadVideoFromUrl(url);
        
        // Save file to IndexedDB
        try {
            await saveFileToIndexedDB('lastUsedVideo', file);
            console.log('Video saved successfully');
        } catch (error) {
            console.error('Error saving video to IndexedDB:', error);
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
        videoElement.play();
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