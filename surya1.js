// Security measures (from original code)
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

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    console.log('Context menu disabled');
});

// Enhanced weather icons with animations
const weatherIcons = {
    'clear': 'clear_day',
    'sunny': 'sunny',
    'partly_cloudy': 'partly_cloudy_day',
    'cloudy': 'cloud',
    'overcast': 'cloudy',
    'mist': 'foggy',
    'fog': 'foggy',
    'light_rain': 'rainy',
    'rain': 'rainy',
    'heavy_rain': 'thunderstorm',
    'thunderstorm': 'thunderstorm',
    'snow': 'weather_snowy',
    'sleet': 'weather_mix',
    'hail': 'weather_hail'
};

// Time period detection for background changes
function getTimePeriod() {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 11) {
        return 'morning';
    } else if (hour >= 11 && hour < 17) {
        return 'afternoon';
    } else if (hour >= 17 && hour < 20) {
        return 'evening';
    } else {
        return 'night';
    }
}

// Function to set dynamic background for weather card
function setWeatherBackground(weatherCondition) {
    const timePeriod = getTimePeriod();
    const weatherCard = document.querySelector('.weather-card');
    
    // Create or get the background element
    let weatherBg = document.querySelector('.weather-background');
    if (!weatherBg) {
        weatherBg = document.createElement('div');
        weatherBg.className = 'weather-background';
        weatherCard.appendChild(weatherBg);
    }
    
    // Remove all existing classes
    weatherBg.className = 'weather-background';
    
    // Add time-based class
    weatherBg.classList.add(`${timePeriod}-bg`);
    
    // Add weather condition class
    let conditionClass = 'clear-bg'; // Default
    
    if (weatherCondition.includes('cloud') || weatherCondition === 'overcast' || weatherCondition === 'partly_cloudy') {
        conditionClass = 'cloudy-bg';
    } else if (weatherCondition.includes('rain') || weatherCondition === 'thunderstorm' || weatherCondition === 'sleet') {
        conditionClass = 'rainy-bg';
    }
    
    weatherBg.classList.add(conditionClass);
    
    // Add animation
    weatherBg.style.animation = 'fadeIn 1.5s ease forwards';
}

function formatCoordinates(lat, lon) {
    const latDegree = Math.abs(lat).toFixed(2);
    const lonDegree = Math.abs(lon).toFixed(2);
    const latDirection = lat >= 0 ? 'N' : 'S';
    const lonDirection = lon >= 0 ? 'E' : 'W';
    
    return `${latDegree}° ${latDirection}, ${lonDegree}° ${lonDirection}`;
}

async function getLocationName(lat, lon) {
    try {
        const cityNames = [
            'New York', 'London', 'Tokyo', 'Sydney', 'Paris', 
            'Berlin', 'Rio de Janeiro', 'Moscow', 'Dubai', 'Toronto',
            'Singapore', 'Barcelona', 'Amsterdam', 'Chicago', 'Seoul'
        ];
        
        const countryNames = [
            'United States', 'United Kingdom', 'Japan', 'Australia', 'France',
            'Germany', 'Brazil', 'Russia', 'UAE', 'Canada',
            'Singapore', 'Spain', 'Netherlands', 'United States', 'South Korea'
        ];
        
        const cityIndex = Math.abs(Math.floor((lat * lon) % cityNames.length));
        const city = cityNames[cityIndex];
        const country = countryNames[cityIndex];
        
        return {
            city: city,
            country: country,
            fullName: `${city}, ${country}`
        };
    } catch (error) {
        console.error("Error getting location name:", error);
        return {
            city: "Unknown",
            country: "Location",
            fullName: "Unknown Location"
        };
    }
}

async function getWeatherData(lat, lon) {
    try {
        const tropicalConditions = ['clear', 'sunny', 'partly_cloudy', 'thunderstorm', 'heavy_rain'];
        const temperateConditions = ['partly_cloudy', 'cloudy', 'light_rain', 'rain', 'clear'];
        const coldConditions = ['cloudy', 'overcast', 'snow', 'sleet', 'partly_cloudy'];
        const desertConditions = ['clear', 'sunny', 'partly_cloudy', 'cloudy', 'dust'];
        
        let conditions;
        if (Math.abs(lat) < 23.5) {
            conditions = tropicalConditions;
        } else if (Math.abs(lat) > 66.5) {
            conditions = coldConditions;
        } else if (Math.abs(lat) > 30 && Math.abs(lat) < 50) {
            conditions = temperateConditions;
        } else {
            conditions = desertConditions;
        }
        
        // Get a "random" condition based on coordinates
        const conditionIndex = Math.abs(Math.floor((lat * lon * 10) % conditions.length));
        const condition = conditions[conditionIndex];
        
        // Generate temperature based on latitude (simplified)
        let baseTemp = 25 - (Math.abs(lat) * 0.5); // Hotter at equator, colder at poles
        // Add some randomness
        const temp = Math.round(baseTemp + (Math.sin(lon) * 5));
        
        // Generate forecast for next 5 days
        const forecast = [];
        const today = new Date();
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        for (let i = 1; i <= 5; i++) {
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + i);
            
            // Vary the condition slightly for each day
            const dayConditionIndex = (conditionIndex + i) % conditions.length;
            const dayCondition = conditions[dayConditionIndex];
            
            // Vary the temperature slightly
            const dayTemp = temp + Math.round((Math.random() - 0.5) * 5);
            
            // Calculate precipitation chance (higher for rainy conditions)
            let precipChance = 0;
            if (dayCondition.includes('rain') || dayCondition === 'thunderstorm') {
                precipChance = 60 + Math.round(Math.random() * 35);
            } else if (dayCondition.includes('cloud') || dayCondition === 'overcast') {
                precipChance = 20 + Math.round(Math.random() * 30);
            } else if (dayCondition === 'snow' || dayCondition === 'sleet') {
                precipChance = 50 + Math.round(Math.random() * 40);
            } else {
                precipChance = Math.round(Math.random() * 15);
            }
            
            forecast.push({
                day: dayNames[nextDay.getDay()],
                date: nextDay.getDate(),
                condition: dayCondition,
                icon: weatherIcons[dayCondition] || 'help_outline',
                temp: dayTemp,
                precipChance: precipChance
            });
        }
        
        return {
            current: {
                temp: temp,
                condition: condition,
                icon: weatherIcons[condition] || 'help_outline',
                humidity: 30 + Math.round(Math.random() * 50),
                windSpeed: 5 + Math.round(Math.random() * 20)
            },
            forecast: forecast
        };
    } catch (error) {
        console.error("Error getting weather data:", error);
        return {
            current: {
                temp: "--",
                condition: "unknown",
                icon: "help_outline",
                humidity: "--",
                windSpeed: "--"
            },
            forecast: []
        };
    }
}

// Enhanced clock function with smooth transition
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const timeElement = document.getElementById('clock');
    
    // Only update if the element exists
    if (timeElement) {
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;
        
        // Flash the time separator every second
        if (parseInt(seconds) % 2 === 0) {
            timeElement.innerHTML = `${hours}<span style="opacity:0.5">:</span>${minutes}<span style="opacity:0.5">:</span>${seconds}`;
        } else {
            timeElement.innerHTML = `${hours}<span>:</span>${minutes}<span>:</span>${seconds}`;
        }
    }
    
    // Update the date with a more attractive format
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    const dateElement = document.getElementById('current-date');
    
    if (dateElement) {
        dateElement.textContent = dateString;
    }
    
    // Update the weather background based on time period
    updateWeatherBackground();
}

// Function to update the weather background based on time changes
function updateWeatherBackground() {
    const weatherCard = document.querySelector('.weather-card');
    if (!weatherCard) return;
    
    // Get the current weather condition
    const weatherDescElement = document.getElementById('weather-description');
    let weatherCondition = 'clear'; // Default
    
    if (weatherDescElement) {
        const text = weatherDescElement.textContent.toLowerCase();
        if (text.includes('cloud')) {
            weatherCondition = 'cloudy';
        } else if (text.includes('rain')) {
            weatherCondition = 'rain';
        } else if (text.includes('snow')) {
            weatherCondition = 'snow';
        } else if (text.includes('thunder')) {
            weatherCondition = 'thunderstorm';
        }
    }
    
    // Set the weather background
    setWeatherBackground(weatherCondition);
}

// Enhanced weather display function
function updateWeatherDisplay(weatherData, locationData) {
    // Update location information with animation
    const locationElement = document.getElementById('location-text');
    if (locationElement) {
        locationElement.innerHTML = `<span class="fade-in">${locationData.city}</span>`;
    }
    
    // Update current weather with animation
    const tempElement = document.getElementById('current-temp');
    if (tempElement) {
        tempElement.innerHTML = `<span class="fade-in">${weatherData.current.temp}°</span>`;
    }
    
    const iconElement = document.getElementById('current-icon');
    if (iconElement) {
        iconElement.innerHTML = `<span class="material-symbols-rounded fade-in">${weatherData.current.icon}</span>`;
    }
    
    // Update weather description with enhanced formatting
    const weatherDescElement = document.getElementById('weather-description');
    if (weatherDescElement) {
        const condition = weatherData.current.condition.replace('_', ' ');
        weatherDescElement.innerHTML = `
            <span class="fade-in">
                <strong>${condition.charAt(0).toUpperCase() + condition.slice(1)}</strong><br>
                <span style="display: flex; justify-content: space-between; margin-top: 5px;">
                    <span>
                        <span class="material-symbols-rounded" style="font-size: 14px; vertical-align: middle;">humidity_high</span> 
                        ${weatherData.current.humidity}%
                    </span>
                    <span>
                        <span class="material-symbols-rounded" style="font-size: 14px; vertical-align: middle;">air</span> 
                        ${weatherData.current.windSpeed} km/h
                    </span>
                </span>
            </span>
        `;
    }
    
    // Update forecast with enhanced animation and interactivity
    const forecastContainer = document.getElementById('forecast-container');
    if (forecastContainer) {
        forecastContainer.innerHTML = "";
        
        weatherData.forecast.forEach((day, index) => {
            const dayElement = document.createElement('div');
            dayElement.className = 'day fade-in';
            dayElement.style.animationDelay = `${index * 0.1}s`;
            
            // Calculate the percentage width for the progress bar
            const percentWidth = day.precipChance / 100;
            
            dayElement.innerHTML = `
                <div class="day-info">
                    <div class="day-name">${day.day}</div>
                    <div class="day-number">${day.date}</div>
                </div>
                <div class="day-icon">
                    <span class="material-symbols-rounded">${day.icon}</span>
                </div>
                <div class="day-temp">${day.temp}°</div>
                <div class="day-percent" style="--percent-width: ${percentWidth}">${day.precipChance}%</div>
            `;
            
            // Add tooltip for more information
            dayElement.title = `${day.day}, ${day.date}: ${day.condition.replace('_', ' ')} with ${day.precipChance}% chance of precipitation`;
            
            // Add click event for more details
            dayElement.addEventListener('click', function() {
                alert(`Forecast for ${day.day}, ${day.date}:\n${day.condition.replace('_', ' ')}\nTemperature: ${day.temp}°C\nPrecipitation chance: ${day.precipChance}%`);
            });
            
            forecastContainer.appendChild(dayElement);
        });
    }
    
    // Set the weather background based on the current condition
    setWeatherBackground(weatherData.current.condition);
}

// Initialize the application
let currentLat = 0;
let currentLon = 0;

// Track if we've updated the location
let locationUpdated = false;

// Function to initialize the app with improved user experience
async function initApp() {
    // Update clock immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);
    
    // Add initial animations to elements
    document.querySelectorAll('.weather-card, .updates-card, .navbar').forEach(el => {
        el.classList.add('fade-in');
    });
    
    // Start location detection with improved feedback
    if (navigator.geolocation) {
        // Show detecting message with enhanced animation
        const locationElement = document.getElementById('location-text');
        if (locationElement) {
            locationElement.innerHTML = 'Detecting location <span class="location-loader">...</span>';
        }
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                currentLat = position.coords.latitude;
                currentLon = position.coords.longitude;
                
                // Get location name
                const locationData = await getLocationName(currentLat, currentLon);
                
                // Get weather data
                const weatherData = await getWeatherData(currentLat, currentLon);
                
                // Update the display with enhanced animations
                updateWeatherDisplay(weatherData, locationData);
                
                // Mark location as updated
                locationUpdated = true;
            },
            (error) => {
                console.error("Error getting location:", error);
                
                // Use default location with visual feedback
                currentLat = 40.7128;
                currentLon = -74.0060;
                
                // Show error message briefly before proceeding
                const locationElement = document.getElementById('location-text');
                if (locationElement) {
                    locationElement.innerHTML = '<span style="color: #ff7777;">Location error</span>';
                    setTimeout(() => {
                        initWithDefaultLocation();
                    }, 1000);
                } else {
                    initWithDefaultLocation();
                }
            },
            { timeout: 10000 } // 10 second timeout
        );
        
        // Set a fallback timer with improved user feedback
        setTimeout(() => {
            if (!locationUpdated) {
                console.log("Location detection timed out, using default location");
                currentLat = 40.7128;
                currentLon = -74.0060;
                
                const locationElement = document.getElementById('location-text');
                if (locationElement) {
                    locationElement.innerHTML = '<span style="color: #ff9955;">Location timed out</span>';
                    setTimeout(() => {
                        initWithDefaultLocation();
                    }, 1000);
                } else {
                    initWithDefaultLocation();
                }
            }
        }, 15000);
    } else {
        console.log("Geolocation is not supported by this browser.");
        
        // Use default location with visual feedback
        currentLat = 40.7128;
        currentLon = -74.0060;
        
        const locationElement = document.getElementById('location-text');
        if (locationElement) {
            locationElement.innerHTML = '<span style="color: #ff9955;">Location not supported</span>';
            setTimeout(() => {
                initWithDefaultLocation();
            }, 1000);
        } else {
            initWithDefaultLocation();
        }
    }
}

// Function to initialize with default location
async function initWithDefaultLocation() {
    // Get location name for default coordinates
    const locationData = await getLocationName(currentLat, currentLon);
    
    // Get weather data for default coordinates
    const weatherData = await getWeatherData(currentLat, currentLon);
    
    // Update the display with enhanced animations
    updateWeatherDisplay(weatherData, locationData);
}

// Theme management functions
function applyTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    // Apply smooth transitions when changing themes
    document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
}

// Check location settings with improved UI feedback
function checkLocationSettings() {
    const locationEnabled = localStorage.getItem('locationEnabled') !== 'false';
    
    // If location is turned off, update the UI with visual feedback
    if (!locationEnabled) {
        // If the location and weather elements exist
        const locationElement = document.getElementById('location-text');
        const weatherDescription = document.getElementById('weather-description');
        const currentTemp = document.getElementById('current-temp');
        const forecastContainer = document.getElementById('forecast-container');
        
        if (locationElement) {
            locationElement.innerHTML = '<span style="color: #ff9955;">Location disabled</span>';
        }
        
        if (weatherDescription) {
            weatherDescription.innerHTML = '<span style="color: #ff9955;">Weather data unavailable</span><br>Location services disabled in settings';
        }
        
        if (currentTemp) {
            currentTemp.textContent = '--°';
        }
        
        if (forecastContainer) {
            forecastContainer.innerHTML = '<div class="forecast-item disabled">Weather forecast unavailable</div>';
        }
    } else {
        // If location is enabled, make sure weather functions are called
        initializeWeather();
    }
}

// Initialize weather only if location is enabled
function initializeWeather() {
    const locationEnabled = localStorage.getItem('locationEnabled') !== 'false';
    if (locationEnabled) {
        // Main app initialization
        initApp();
    } else {
        // Still update the clock and other non-location features
        updateClock();
        setInterval(updateClock, 1000);
    }
}

// Initialize the settings UI elements
function initializeSettingsUI() {
    // Check for controls in the settings page
    const themeToggle = document.getElementById('theme-toggle');
    const locationToggle = document.getElementById('location-toggle');
    
    if (themeToggle) {
        // Set initial state based on localStorage
        themeToggle.checked = localStorage.getItem('theme') !== 'light';
        
        // Add event listener
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
            applyTheme();
        });
    }
    
    if (locationToggle) {
        // Set initial state based on localStorage
        locationToggle.checked = localStorage.getItem('locationEnabled') !== 'false';
        
        // Add event listener
        locationToggle.addEventListener('change', function() {
            localStorage.setItem('locationEnabled', this.checked);
            // Add feedback that a page reload is required
            const feedbackElement = document.getElementById('settings-feedback');
            if (feedbackElement) {
                feedbackElement.textContent = 'Settings saved. Reload the page to apply changes.';
                feedbackElement.style.display = 'block';
            }
        });
    }
}

// Enhanced navigation experience
function enhanceNavigation() {
    const navIcons = document.querySelectorAll('.navbar .nav-icon');
    
    navIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        // Add active state to current page
        if (icon.parentElement.getAttribute('href') === location.pathname.split('/').pop() || 
            (location.pathname === '/' && !icon.parentElement.getAttribute('href'))) {
            icon.classList.add('active');
        }
    });
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Apply theme first to prevent flashing
    applyTheme();
    
    // Check location settings
    checkLocationSettings();
    
    // Initialize settings UI if on settings page
    if (location.pathname.includes('settings')) {
        initializeSettingsUI();
    }
    
    // Enhance navigation
    enhanceNavigation();
});

// Start the application
window.addEventListener('load', function() {
    const locationEnabled = localStorage.getItem('locationEnabled') !== 'false';
    if (locationEnabled) {
        initApp();
    } else {
        // Still update the clock and other non-location features
        updateClock();
        setInterval(updateClock, 1000);
        checkLocationSettings();
    }
});
// Add this to your main JS file for global theme support
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme from localStorage
    initializeTheme();
    
    // Check location settings for weather display
    checkLocationSettings();
});

// Global theme initialization
function initializeTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
        
        // Update theme-color meta tag for browser UI
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', '#f8f9fa');
        }
    } else {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        
        // Update theme-color meta tag for browser UI
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', '#1a1a1a');
        }
    }
    
    // Apply theme styles to all elements
    applyThemeToElements(theme);
}

// Function to apply theme to all elements
function applyThemeToElements(theme) {
    // Update all elements with appropriate theme colors
    
    // Background colors for cards and containers
    const bgColor = theme === 'light' ? 'rgba(240, 240, 240, 0.8)' : 'rgba(50, 50, 50, 0.8)';
    const boxShadow = theme === 'light' ? '0 8px 32px rgba(0, 0, 0, 0.1)' : '0 8px 32px rgba(0, 0, 0, 0.2)';
    const textColor = theme === 'light' ? '#333333' : 'white';
    const secondaryTextColor = theme === 'light' ? '#666666' : 'rgba(255, 255, 255, 0.7)';
    
    // Apply to cards and boxes
    document.querySelectorAll('.card, .box, .content-box, .weather-card, .updates-card, .navbar').forEach(el => {
        el.style.backgroundColor = bgColor;
        el.style.boxShadow = boxShadow;
        el.style.color = textColor;
    });
    
    // Update text colors
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => {
        el.style.color = textColor;
    });
    
    document.querySelectorAll('p').forEach(el => {
        el.style.color = secondaryTextColor;
    });
    
    // Update navigation icons
    document.querySelectorAll('.nav-icon').forEach(icon => {
        if (theme === 'light') {
            // Don't apply filter to active icon
            if (!icon.classList.contains('active')) {
                icon.style.filter = 'invert(0.8)';
            } else {
                icon.style.filter = 'none';
            }
        } else {
            icon.style.filter = 'none';
        }
    });
}

// Function to check location settings and update weather display
function checkLocationSettings() {
    const locationEnabled = localStorage.getItem('locationEnabled') === 'true';
    const weatherCard = document.querySelector('.weather-card');
    
    if (!locationEnabled && weatherCard) {
        // Replace weather content with a message
        weatherCard.innerHTML = `
            <div class="location">
                <span class="location-icon material-symbols-rounded">location_off</span>
                <span>Location sharing is disabled</span>
            </div>
            <div class="weather-description">
                Enable location sharing in settings to see weather updates.
            </div>
        `;
    }
}

// Listen for theme changes from settings page
document.addEventListener('themeChanged', function(e) {
    applyThemeToElements(e.detail.theme);
});

