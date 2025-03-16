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

const weatherIcons = {
    'clear': 'clear_day',
    'sunny': 'wb_sunny',
    'partly_cloudy': 'partly_cloudy_day',
    'cloudy': 'cloud',
    'overcast': 'cloud',
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

// Function to update the clock
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
    
    // Update the date
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    document.getElementById('current-date').textContent = dateString;
}

// Function to update the weather display
function updateWeatherDisplay(weatherData, locationData) {
    // Update location information - remove loading indicators
    document.getElementById('location-text').textContent = locationData.city;
    document.getElementById('location-big').textContent = locationData.fullName;
    document.getElementById('location-coordinates').textContent = formatCoordinates(currentLat, currentLon);
    
    // Update current weather
    document.getElementById('current-temp').textContent = `${weatherData.current.temp}°`;
    document.getElementById('current-icon').innerHTML = `<span class="material-symbols-rounded">${weatherData.current.icon}</span>`;
    
    // Update weather description
    const weatherDescription = `${weatherData.current.condition.replace('_', ' ')}<br>
                              Humidity: ${weatherData.current.humidity}%<br>
                              Wind: ${weatherData.current.windSpeed} km/h`;
    document.getElementById('weather-description').innerHTML = weatherDescription;
    
    // Update forecast
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = "";
    
    weatherData.forecast.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.innerHTML = `
            <div class="day-info">
                <div class="day-name">${day.day}</div>
                <div class="day-number">${day.date}</div>
            </div>
            <div class="day-icon">
                <span class="material-symbols-rounded">${day.icon}</span>
            </div>
            <div class="day-temp">${day.temp}°</div>
            <div class="day-percent">${day.precipChance}%</div>
        `;
        forecastContainer.appendChild(dayElement);
    });
}

// Initialize the application
let currentLat = 0;
let currentLon = 0;

// Track if we've updated the location
let locationUpdated = false;

// Function to initialize the app
async function initApp() {
    // Update clock immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);
    
    // Start location detection
    if (navigator.geolocation) {
        // Show detecting message
        document.getElementById('location-text').textContent = "Detecting location";
        document.getElementById('location-text').innerHTML += '<span class="location-loader">...</span>';
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                currentLat = position.coords.latitude;
                currentLon = position.coords.longitude;
                
                // Get location name
                const locationData = await getLocationName(currentLat, currentLon);
                
                // Get weather data
                const weatherData = await getWeatherData(currentLat, currentLon);
                
                // Update the display
                updateWeatherDisplay(weatherData, locationData);
                
                // Mark location as updated
                locationUpdated = true;
            },
            (error) => {
                console.error("Error getting location:", error);
                
                // Use default location
                currentLat = 40.7128;
                currentLon = -74.0060;
                
                // Proceed with default location
                initWithDefaultLocation();
            },
            { timeout: 10000 } // 10 second timeout
        );
        
        // Set a fallback timer in case geolocation takes too long
        setTimeout(() => {
            if (!locationUpdated) {
                console.log("Location detection timed out, using default location");
                currentLat = 40.7128;
                currentLon = -74.0060;
                initWithDefaultLocation();
            }
        }, 15000);
    } else {
        console.log("Geolocation is not supported by this browser.");
        
        // Use default location
        currentLat = 40.7128;
        currentLon = -74.0060;
        
        // Proceed with default location
        initWithDefaultLocation();
    }
}

// Function to initialize with default location
async function initWithDefaultLocation() {
    // Get location name for default coordinates
    const locationData = await getLocationName(currentLat, currentLon);
    
    // Get weather data for default coordinates
    const weatherData = await getWeatherData(currentLat, currentLon);
    
    // Update the display
    updateWeatherDisplay(weatherData, locationData);
}

// Start the application
window.addEventListener('load', initApp);