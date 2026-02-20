// Configuration file for easy backend setup
// Edit these values based on your deployment

const CONFIG = {
// Set to true when you deploy a backend server
USE_BACKEND: true,
    
// Add your deployed backend URL here
// Examples:
// - Vercel: 'https://your-app.vercel.app'
// - Railway: 'https://your-app.railway.app'
// - Heroku: 'https://your-app.herokuapp.com'
// - Custom: 'https://yourdomain.com'
BACKEND_URL: 'https://matrix-three-jet.vercel.app',
    
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
