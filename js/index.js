// Unified JavaScript for SuryaOS - combining menu functionality with folder modal animations
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

// Main initialization function that sets up all functionality
function initializeSystem() {
    // Set up all core components
    setupDateTime();
    setupMenuFunctionality();
    setupSettingsPanel();
    setupAppsToggle();
    setupThemeToggle();
    setupWallpaperFunctionality();
    setupMusicPlayer();
    setupFolderFunctionality();
    setupVersionButtons();
    setupAppIcons();
    
    // Load saved preferences
    loadSavedData();
}

// --- Core UI updates ---
function setupDateTime() {
    function updateDateTime() {
        const dateElement = document.getElementById('current-date');
        const timeElement = document.getElementById('current-time');
        
        if (!dateElement || !timeElement) return;
        
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

    // Update date and time
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

// --- Menu Functionality ---
function setupMenuFunctionality() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuPanel = document.getElementById('menu-panel');

    if (menuToggle && menuPanel) {
        // Clear any existing listeners to prevent duplicates
        const newMenuToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
        
        // Add fresh event listener
        newMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            menuPanel.classList.toggle('active');
        });
        
        // Store reference to the replaced element for global access
        window.menuToggleRef = newMenuToggle;

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (menuPanel.classList.contains('active') && 
                !window.menuToggleRef.contains(event.target) && 
                !menuPanel.contains(event.target)) {
                menuPanel.classList.remove('active');
            }
        });
    }
}

// --- Settings Panel ---
function setupSettingsPanel() {
    const settingsToggle = document.getElementById('menu-toggle');
    const settingsPanel = document.getElementById('settings-panel');
    const overlay = document.getElementById('overlay');

    if (settingsToggle && settingsPanel && overlay) {
        // We already replaced the menu toggle in setupMenuFunctionality, so we need to get the new reference
        const settingsToggleRef = window.menuToggleRef || document.getElementById('menu-toggle');
        
        if (settingsToggleRef) {
            settingsToggleRef.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                settingsPanel.classList.toggle('active');
                
                // Handle overlay
                if (overlay) {
                    if (settingsPanel.classList.contains('active')) {
                        overlay.style.display = 'block';
                        setTimeout(() => {
                            overlay.classList.add('active');
                            overlay.classList.add('show');
                        }, 10);
                    } else {
                        overlay.classList.remove('active');
                        overlay.classList.remove('show');
                        setTimeout(() => {
                            overlay.style.display = 'none';
                        }, 300);
                    }
                }
            });
        }

        // Close settings panel when clicking overlay
        if (overlay) {
            overlay.addEventListener('click', () => {
                settingsPanel.classList.remove('active');
                overlay.classList.remove('active');
                overlay.classList.remove('show');
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 300);
            });
        }
    }
}

// --- Apps Toggle ---
function setupAppsToggle() {
    const appsToggle = document.getElementById('apps-toggle');
    const bottomNavbar = document.querySelector('.bottom-navbar');
    const centerContent = document.querySelector('.center-content');

    if (appsToggle && bottomNavbar && centerContent) {
        appsToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            
            // Toggle active class on the toggle
            appsToggle.classList.toggle('active');
            
            // Toggle navbar visibility
            bottomNavbar.classList.toggle('hidden');
            
            // Shift center content when navbar is hidden
            centerContent.classList.toggle('shifted');
        });
    }
}

// --- Theme System ---
function setupThemeToggle() {
    const themeToggles = document.querySelectorAll('#theme-toggle');
    const body = document.body;
    const centerContent = document.querySelector('.center-content');
    
    if (themeToggles.length === 0) return;

    function toggleTheme(e) {
        e.stopPropagation(); // Prevent event bubbling
        
        // Toggle theme classes on body
        body.classList.toggle('light-theme');
        body.classList.toggle('dark-mode');
        
        // Visual effect for center content if it exists
        if (centerContent) {
            centerContent.classList.add('shifted');
            setTimeout(() => {
                centerContent.classList.remove('shifted');
            }, 300);
        }
        
        // Sync all theme toggle states
        themeToggles.forEach(toggle => {
            toggle.classList.toggle('active');
        });
        
        // Save current theme preference to both storage keys for compatibility
        try {
            const isDarkMode = body.classList.contains('dark-mode');
            const isLightTheme = body.classList.contains('light-theme');
            
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            localStorage.setItem('suryaOSTheme', isLightTheme ? 'light' : 'dark');
        } catch (error) {
            console.warn('Could not save theme preference to localStorage:', error);
        }
    }

    // Add event listeners to all theme toggles
    themeToggles.forEach(toggle => {
        // Remove any existing listeners
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);
        newToggle.addEventListener('click', toggleTheme);
    });
}

// --- Wallpaper System ---
function setupWallpaperFunctionality() {
    const insertButton = document.getElementById('insert-button');
    const wallpaperModal = document.getElementById('wallpaper-modal');
    const wallpaperInput = document.getElementById('wallpaper-input');
    const wallpaperPreview = document.getElementById('wallpaper-preview');
    const selectWallpaperButton = document.getElementById('select-wallpaper-button');
    const saveWallpaperButton = document.getElementById('save-wallpaper-button');
    const closeWallpaperButton = document.getElementById('close-wallpaper-button');
    const container = document.querySelector('.container');
    const overlay = document.getElementById('overlay');
    
    // Check if elements exist before setting up listeners
    if (!insertButton || !wallpaperModal || !container) return;

    // Open wallpaper modal
    insertButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        wallpaperModal.classList.add('active');
        wallpaperModal.classList.add('show');
        
        // Show overlay
        if (overlay) {
            overlay.style.display = 'block';
            setTimeout(() => {
                overlay.classList.add('show');
            }, 10);
            
            // Prevent scrolling
            document.body.style.overflow = 'hidden';
        }
    });

    // Select wallpaper
    if (selectWallpaperButton && wallpaperInput) {
        selectWallpaperButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            wallpaperInput.click();
        });
    }

    // Preview selected wallpaper
    if (wallpaperInput && wallpaperPreview) {
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
    }

    // Save wallpaper
    if (saveWallpaperButton && wallpaperPreview) {
        saveWallpaperButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            const previewImage = wallpaperPreview.style.backgroundImage;
            if (previewImage && previewImage !== 'none') {
                const imageUrl = previewImage.slice(4, -1).replace(/"/g, "");
                
                // Save to localStorage
                try {
                    localStorage.setItem('suryaOSWallpaper', imageUrl);
                } catch (error) {
                    console.warn('Could not save wallpaper to localStorage:', error);
                }
                
                // Apply to container
                container.style.backgroundImage = `url(${imageUrl})`;
                container.style.backgroundSize = 'cover';
                container.style.backgroundPosition = 'center';
                
                // Close modal with animation
                closeWallpaperModal();
            }
        });
    }

    // Close wallpaper modal
    if (closeWallpaperButton) {
        closeWallpaperButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            closeWallpaperModal();
        });
    }
    
    // Close wallpaper modal with animation
    function closeWallpaperModal() {
        wallpaperModal.classList.remove('show');
        
        if (overlay) {
            overlay.classList.remove('show');
            
            setTimeout(() => {
                wallpaperModal.classList.remove('active');
                overlay.style.display = 'none';
                
                // Re-enable scrolling
                document.body.style.overflow = '';
            }, 300);
        } else {
            setTimeout(() => {
                wallpaperModal.classList.remove('active');
            }, 300);
        }
    }
}

// --- Music Player ---
function setupMusicPlayer() {
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
    const overlay = document.getElementById('overlay');
    
    // Check if essential elements exist
    if (!musicInsertButton || !musicModal) return;

    // Create a single audio player instance
    window.audioPlayer = window.audioPlayer || new Audio();
    
    // Open music modal
    musicInsertButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        musicModal.classList.add('active');
        musicModal.classList.add('show');
        
        // Show overlay
        if (overlay) {
            overlay.style.display = 'block';
            setTimeout(() => {
                overlay.classList.add('show');
            }, 10);
            
            // Prevent scrolling
            document.body.style.overflow = 'hidden';
        }
    });

    // Select music
    if (selectMusicButton && musicInput) {
        selectMusicButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            musicInput.click();
        });
    }

    // Preview selected music
    if (musicInput && musicPreview) {
        musicInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                musicPreview.innerHTML = `<span>${file.name}</span>`;
            }
        });
    }

    // Save music
    if (saveMusicButton && musicInput && musicTitle && musicPlayer) {
        saveMusicButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            const file = musicInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    // Save to localStorage
                    try {
                        localStorage.setItem('suryaOSMusic', e.target.result);
                        localStorage.setItem('musicSavedPermanently', 'true');
                    } catch (error) {
                        console.warn('Could not save music to localStorage:', error);
                    }
                    
                    // Update music player
                    musicTitle.textContent = file.name;
                    window.audioPlayer.src = e.target.result;
                    
                    // Show music player with animation
                    musicPlayer.classList.add('active');
                    
                    // Automatically start playing
                    window.audioPlayer.play()
                        .then(() => {
                            if (playPauseBtn) playPauseBtn.textContent = 'pause_circle';
                        })
                        .catch(error => {
                            console.error('Error playing music:', error);
                        });
                    
                    // Close modal with animation
                    closeMusicModal();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Close music modal
    if (closeMusicButton) {
        closeMusicButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            closeMusicModal();
        });
    }
    
    // Close music modal with animation
    function closeMusicModal() {
        musicModal.classList.remove('show');
        
        if (overlay) {
            overlay.classList.remove('show');
            
            setTimeout(() => {
                musicModal.classList.remove('active');
                overlay.style.display = 'none';
                
                // Re-enable scrolling
                document.body.style.overflow = '';
            }, 300);
        } else {
            setTimeout(() => {
                musicModal.classList.remove('active');
            }, 300);
        }
    }

    // Play/Pause functionality
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            if (window.audioPlayer.paused) {
                window.audioPlayer.play()
                    .then(() => {
                        playPauseBtn.textContent = 'pause_circle';
                    })
                    .catch(error => {
                        console.error('Error playing music:', error);
                    });
            } else {
                window.audioPlayer.pause();
                playPauseBtn.textContent = 'play_circle';
            }
        });
    }

    // Update play/pause button when audio ends
    window.audioPlayer.addEventListener('ended', () => {
        if (playPauseBtn) playPauseBtn.textContent = 'play_circle';
    });

    // Pause music when navigating away from the page
    window.addEventListener('blur', () => {
        if (window.audioPlayer && !window.audioPlayer.paused) {
            window.audioPlayer.pause();
            if (playPauseBtn) playPauseBtn.textContent = 'play_circle';
        }
    });
}

// --- Folder Functionality ---
function setupFolderFunctionality() {
    const partnersFolder = document.getElementById('partners-folder');
    const folderModal = document.getElementById('folder-modal');
    const overlay = document.getElementById('overlay');
    
    if (!partnersFolder || !folderModal) return;

    // Open folder modal with animation
    partnersFolder.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        
        // Show and animate the overlay
        if (overlay) {
            overlay.style.display = 'block';
            setTimeout(() => {
                overlay.classList.add('show');
            }, 10);
        }
        
        // Show the modal with animation
        folderModal.classList.add('active');
        folderModal.classList.add('show');
        partnersFolder.classList.add('active');
        
        // Add bounce effect to folder icon
        partnersFolder.style.animation = 'bounce 0.5s';
        setTimeout(() => {
            partnersFolder.style.animation = '';
        }, 500);
        
        // Add blur effect to elements behind the modal
        document.querySelectorAll('.container > *:not(.folder-modal):not(#overlay)').forEach(element => {
            element.style.filter = 'blur(5px)';
        });
        
        // Prevent scrolling when modal is open
        document.body.style.overflow = 'hidden';
    });

    // Close folder modal when clicking outside the folder content
    folderModal.addEventListener('click', (event) => {
        if (event.target === folderModal) {
            closeFolder();
        }
    });

    // Close folder modal when clicking on the overlay
    if (overlay) {
        overlay.addEventListener('click', () => {
            closeFolder();
        });
    }

    // Add click functionality to folder apps
    const folderApps = document.querySelectorAll('.folder-app');
    folderApps.forEach(app => {
        app.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            const appNameElement = app.querySelector('.app-name');
            const appName = appNameElement ? appNameElement.textContent : 'app';
            console.log(`Opening ${appName}`);
            
            // Close the folder modal with animation
            closeFolder();
        });
    });

    // Function to close the folder with animation
    function closeFolder() {
        // Fade out the overlay first
        if (overlay) {
            overlay.classList.remove('show');
        }
        
        // Hide the modal with animation
        folderModal.classList.remove('show');
        partnersFolder.classList.remove('active');
        
        // After animations complete, hide elements completely
        setTimeout(() => {
            folderModal.classList.remove('active');
            
            if (overlay) {
                overlay.style.display = 'none';
            }
            
            // Remove blur effect
            document.querySelectorAll('.container > *:not(.folder-modal)').forEach(element => {
                element.style.filter = '';
            });
            
            // Re-enable scrolling
            document.body.style.overflow = '';
        }, 300); // Match this with your CSS transition duration
    }

    // Add escape key to close folder
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && folderModal.classList.contains('active')) {
            closeFolder();
        }
    });
}

// --- App Icons Animation ---
function setupAppIcons() {
    // Add animation to app icons when hovering over them
    const appIcons = document.querySelectorAll('.app-icon');
    appIcons.forEach(icon => {
        icon.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-4px) scale(1.05)';
        });
        
        icon.addEventListener('mouseout', function() {
            this.style.transform = '';
        });
    });
}

// --- Version Buttons ---
function setupVersionButtons() {
    // Menu panel version button
    const menuVersionButton = document.getElementById('menu-version-button');
    const menuDetailsButton = menuVersionButton ? 
        menuVersionButton.querySelector('.details-button') : null;
    
    if (menuDetailsButton) {
        menuDetailsButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            window.open('https://sites.google.com/view/surya-space', '_blank');
        });
    }

    if (menuVersionButton) {
        menuVersionButton.addEventListener('click', () => {
            window.open('https://sites.google.com/view/surya-space', '_blank');
        });
    }

    // Settings panel version button
    const settingsVersionButton = document.getElementById('settings-version-button');
    const settingsDetailsButton = settingsVersionButton ? 
        settingsVersionButton.querySelector('.details-button') : null;
    
    if (settingsDetailsButton) {
        settingsDetailsButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            window.open('https://sites.google.com/view/surya-space', '_blank');
        });
    }

    if (settingsVersionButton) {
        settingsVersionButton.addEventListener('click', () => {
            window.open('https://sites.google.com/view/surya-space', '_blank');
        });
    }
}

// --- Load Saved Data ---
function loadSavedData() {
    loadSavedWallpaper();
    loadSavedTheme();
    loadSavedMusic();
}

function loadSavedWallpaper() {
    try {
        const savedWallpaper = localStorage.getItem('suryaOSWallpaper');
        const container = document.querySelector('.container');
        
        if (savedWallpaper && container) {
            container.style.backgroundImage = `url(${savedWallpaper})`;
            container.style.backgroundSize = 'cover';
            container.style.backgroundPosition = 'center';
        }
    } catch (error) {
        console.warn('Error loading saved wallpaper:', error);
    }
}

function loadSavedTheme() {
    try {
        // Check both theme storage keys for compatibility
        const savedTheme = localStorage.getItem('suryaOSTheme');
        const legacyTheme = localStorage.getItem('theme');
        
        // Determine which theme to use
        const finalTheme = savedTheme || legacyTheme || 'dark';
        const isLightTheme = finalTheme === 'light';
        
        // Apply theme to body
        document.body.classList.toggle('light-theme', isLightTheme);
        document.body.classList.toggle('dark-mode', !isLightTheme);
        
        // Sync theme toggle UI
        const themeToggles = document.querySelectorAll('#theme-toggle');
        themeToggles.forEach(toggle => {
            toggle.classList.toggle('active', isLightTheme);
        });
    } catch (error) {
        console.warn('Error loading saved theme:', error);
    }
}

function loadSavedMusic() {
    try {
        const savedMusic = localStorage.getItem('suryaOSMusic');
        const musicSaved = localStorage.getItem('musicSavedPermanently');
        const musicPlayer = document.getElementById('music-player');
        const musicTitle = document.getElementById('music-title');
        const playPauseBtn = document.getElementById('play-pause-btn');
        
        // Use the global audio player
        if (!window.audioPlayer) {
            window.audioPlayer = new Audio();
        }
        
        if (savedMusic && musicSaved === 'true' && musicPlayer && musicTitle) {
            // Extract filename from full path or data URL
            const fileName = savedMusic.split('/').pop().split('\\').pop();
            
            musicTitle.textContent = fileName;
            window.audioPlayer.src = savedMusic;
            musicPlayer.classList.add('active');
            
            // Do NOT automatically play the saved music
            if (playPauseBtn) playPauseBtn.textContent = 'play_circle';
        }
    } catch (error) {
        console.warn('Error loading saved music:', error);
    }
}

// Initialize the system when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeSystem);

// If DOM is already loaded (for when script is added dynamically), initialize immediately
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initializeSystem, 1);
}
