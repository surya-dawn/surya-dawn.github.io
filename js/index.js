document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        console.log('Inspection disabled');
    }

    if (e.key === 'F12') {
        e.preventDefault();
        console.log('Inspection disabled');
    }

    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        console.log('Inspection disabled');
    }

    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        console.log('Console disabled');
    }

    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        console.log('View source disabled');
    }
});

function updateDateTime() {
    const dateElement = document.getElementById('current-date');
    const timeElement = document.getElementById('current-time');
    const now = new Date();
    
    const dateOptions = { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
    };
    dateElement.textContent = now.toLocaleDateString(undefined, dateOptions);
    
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false
    };
    timeElement.textContent = now.toLocaleTimeString(undefined, timeOptions);
}

// Menu toggle functionality
const menuToggle = document.getElementById('menu-toggle');
const menuPanel = document.getElementById('menu-panel');

menuToggle.addEventListener('click', () => {
    menuPanel.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (event) => {
    if (!menuToggle.contains(event.target) && !menuPanel.contains(event.target)) {
        menuPanel.classList.remove('active');
    }
});

// Settings panel toggle
const settingsToggle = document.getElementById('menu-toggle');
const settingsPanel = document.getElementById('settings-panel');
const overlay = document.getElementById('overlay');

settingsToggle.addEventListener('click', () => {
    settingsPanel.classList.toggle('active');
    overlay.classList.toggle('active');
});

// Close settings panel when clicking outside
overlay.addEventListener('click', () => {
    settingsPanel.classList.remove('active');
    overlay.classList.remove('active');
});

// Apps Toggle Functionality
const appsToggle = document.getElementById('apps-toggle');
const bottomNavbar = document.querySelector('.bottom-navbar');
const centerContent = document.querySelector('.center-content');

appsToggle.addEventListener('click', () => {
    // Toggle active class on the toggle
    appsToggle.classList.toggle('active');
    
    // Toggle navbar visibility
    bottomNavbar.classList.toggle('hidden');
    
    // Shift center content when navbar is hidden
    centerContent.classList.toggle('shifted');
});

// Theme Toggle Functionality
const themeToggles = document.querySelectorAll('#theme-toggle');

function toggleTheme() {
    // Toggle theme class on body
    document.body.classList.toggle('light-theme');
    
    // Shift center content temporarily for visual effect
    centerContent.classList.add('shifted');
    setTimeout(() => {
        centerContent.classList.remove('shifted');
    }, 300);
    
    // Sync all theme toggle states
    themeToggles.forEach(toggle => {
        toggle.classList.toggle('active');
    });
    
    // Save current theme preference
    const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('suryaOSTheme', currentTheme);
}

// Add event listeners to all theme toggles
themeToggles.forEach(toggle => {
    toggle.addEventListener('click', toggleTheme);
});

// Wallpaper functionality
const insertButton = document.getElementById('insert-button');
const wallpaperModal = document.getElementById('wallpaper-modal');
const wallpaperInput = document.getElementById('wallpaper-input');
const wallpaperPreview = document.getElementById('wallpaper-preview');
const selectWallpaperButton = document.getElementById('select-wallpaper-button');
const saveWallpaperButton = document.getElementById('save-wallpaper-button');
const closeWallpaperButton = document.getElementById('close-wallpaper-button');
const container = document.querySelector('.container');

// Load saved wallpaper on startup
function loadSavedWallpaper() {
    const savedWallpaper = localStorage.getItem('suryaOSWallpaper');
    if (savedWallpaper) {
        container.style.backgroundImage = `url(${savedWallpaper})`;
        container.style.backgroundSize = 'cover';
        container.style.backgroundPosition = 'center';
    }
}

// Open wallpaper modal
insertButton.addEventListener('click', () => {
    wallpaperModal.classList.add('active');
});

// Select wallpaper
selectWallpaperButton.addEventListener('click', () => {
    wallpaperInput.click();
});

// Preview selected wallpaper
wallpaperInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            wallpaperPreview.style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
    }
});

// Save wallpaper
saveWallpaperButton.addEventListener('click', () => {
    const previewImage = wallpaperPreview.style.backgroundImage;
    if (previewImage && previewImage !== 'none') {
        const imageUrl = previewImage.slice(4, -1).replace(/"/g, "");
        
        // Save to localStorage
        localStorage.setItem('suryaOSWallpaper', imageUrl);
        
        // Apply to container
        container.style.backgroundImage = `url(${imageUrl})`;
        container.style.backgroundSize = 'cover';
        container.style.backgroundPosition = 'center';
        
        // Close modal
        wallpaperModal.classList.remove('active');
    }
});

// Close wallpaper modal
closeWallpaperButton.addEventListener('click', () => {
    wallpaperModal.classList.remove('active');
});

// Version and details button listeners for menu panel
document.querySelector('#menu-version-button .details-button').addEventListener('click', (e) => {
    e.stopPropagation();
    window.open('https://sites.google.com/view/surya-space', '_blank');
});

document.getElementById('menu-version-button').addEventListener('click', () => {
    window.open('https://sites.google.com/view/surya-space', '_blank');
});

// Version and details button listeners for settings panel
document.querySelector('#settings-version-button .details-button').addEventListener('click', (e) => {
    e.stopPropagation();
    window.open('https://sites.google.com/view/surya-space', '_blank');
});

document.getElementById('settings-version-button').addEventListener('click', () => {
    window.open('https://sites.google.com/view/surya-space', '_blank');
});

// Music Player Functionality
const musicInsertButton = document.getElementById('music-insert-button');
const musicModal = document.getElementById('music-modal');
const musicInput = document.getElementById('music-input');
const musicPreview = document.getElementById('music-preview');
const selectMusicButton = document.getElementById('select-music-button');
const saveMusicButton = document.getElementById('save-music-button');
const closeMusicButton = document.getElementById('close-music-button');
const musicPlayer = document.getElementById('music-player');
const musicTitle = document.getElementById('music-title');
const playPauseBtn = document.getElementById('play-pause-btn');

let audioPlayer = new Audio();
let currentMusicFile = null;

// Load saved music on startup
function loadSavedMusic() {
    const savedMusic = localStorage.getItem('suryaOSMusic');
    const musicSaved = localStorage.getItem('musicSavedPermanently');
    
    if (savedMusic && musicSaved === 'true') {
        // Extract filename from full path or data URL
        const fileName = savedMusic.split('/').pop().split('\\').pop();
        
        musicTitle.textContent = fileName;
        audioPlayer.src = savedMusic;
        musicPlayer.classList.add('active');
        
        // Do NOT automatically play the saved music
        playPauseBtn.textContent = 'play_circle';
    }
}

// Open music modal
musicInsertButton.addEventListener('click', () => {
    musicModal.classList.add('active');
});

// Select music
selectMusicButton.addEventListener('click', () => {
    musicInput.click();
});

// Preview selected music
musicInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        musicPreview.innerHTML = `<span>${file.name}</span>`;
    }
});

// Save music
saveMusicButton.addEventListener('click', () => {
    const file = musicInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Save to localStorage
            localStorage.setItem('suryaOSMusic', e.target.result);
            localStorage.setItem('musicSavedPermanently', 'true');
            
            // Update music player
            musicTitle.textContent = file.name;
            audioPlayer.src = e.target.result;
            currentMusicFile = e.target.result;
            
            // Show music player
            musicPlayer.classList.add('active');
            
            // Automatically start playing
            audioPlayer.play()
                .then(() => {
                    playPauseBtn.textContent = 'pause_circle';
                })
                .catch(error => {
                    console.error('Error playing music:', error);
                });
            
            // Close modal
            musicModal.classList.remove('active');
        };
        reader.readAsDataURL(file);
    }
});

// Close music modal
closeMusicButton.addEventListener('click', () => {
    musicModal.classList.remove('active');
});

// Play/Pause functionality
playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play()
            .then(() => {
                playPauseBtn.textContent = 'pause_circle';
            })
            .catch(error => {
                console.error('Error playing music:', error);
            });
    } else {
        audioPlayer.pause();
        playPauseBtn.textContent = 'play_circle';
    }
});

// Update play/pause button when audio ends
audioPlayer.addEventListener('ended', () => {
    playPauseBtn.textContent = 'play_circle';
});

// Pause music when navigating away from the page
window.addEventListener('blur', () => {
    if (!audioPlayer.paused) {
        audioPlayer.pause();
        playPauseBtn.textContent = 'play_circle';
    }
});

// Do not automatically resume when returning
window.addEventListener('focus', () => {
    // Intentionally left empty to prevent auto-resuming
});

// Load saved theme on startup
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('suryaOSTheme') || 'dark';
    document.body.classList.toggle('light-theme', savedTheme === 'light');
    
    // Sync both toggle states
    const themeToggles = document.querySelectorAll('#theme-toggle');
    themeToggles.forEach(toggle => {
        toggle.classList.toggle('active', savedTheme === 'light');
    });
}

// Load saved data on page load
function initializePage() {
    loadSavedWallpaper();
    loadSavedTheme();
    loadSavedMusic();
    
    // Update date and time
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

// Initialize the page when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializePage);
