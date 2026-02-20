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

// Load saved media from localStorage
function loadSavedMedia() {
    const savedVideo = localStorage.getItem('lastUsedVideo');
    const savedGif = localStorage.getItem('lastUsedGif');
    
    if (savedVideo) {
        mediaConfig.videoPath = savedVideo;
        mediaConfig.showVideo = true;
    }
    
    if (savedGif) {
        mediaConfig.gifPath = savedGif;
        mediaConfig.showGif = true;
    }
}

// Apply media configuration
function setupMedia() {
    loadSavedMedia();
    
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
videoFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        loadVideoFromUrl(url);
    }
});

// Load GIF from file upload
gifFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        loadGifFromUrl(url);
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
        
        // Save to localStorage
        localStorage.setItem('lastUsedVideo', url);
    }
}

// Helper function to load GIF
function loadGifFromUrl(url) {
    if (gifElement) {
        gifElement.src = url;
        gifElement.classList.remove('hidden');
        mediaConfig.showGif = true;
        
        // Save to localStorage
        localStorage.setItem('lastUsedGif', url);
    }
}



setInterval(drawMatrix, 33);