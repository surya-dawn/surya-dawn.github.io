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

// Existing settings panel toggle
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

// Toggle switches
const appsToggle = document.getElementById('apps-toggle');

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.getElementById('theme-toggle').classList.toggle('active');
});

appsToggle.addEventListener('click', () => {
    appsToggle.classList.toggle('active');
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

// Load saved wallpaper when page loads
loadSavedWallpaper();

updateDateTime();
setInterval(updateDateTime, 1000);

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

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

// Theme toggle event listener
function toggleTheme() {
    // Toggle theme class on body
    document.body.classList.toggle('light-theme');
    
    // Sync both toggle states
    const themeToggles = document.querySelectorAll('#theme-toggle');
    themeToggles.forEach(toggle => {
        toggle.classList.toggle('active');
    });
    
    // Save current theme preference
    const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('suryaOSTheme', currentTheme);
}

// Add event listeners to all theme toggles
document.querySelectorAll('#theme-toggle').forEach(toggle => {
    toggle.addEventListener('click', toggleTheme);
});

// Load theme on page load
loadSavedTheme();