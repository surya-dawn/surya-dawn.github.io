// auth.js

class AuthService {
    constructor() {
        // Store valid user credentials
        this.validCredentials = {
            'Ghost': { 
                pin: '2011', 
                password: 'ghost2011',
                role: 'admin'
            },
            'dan': { 
                pin: '6098', 
                password: 'draenor',
                role: 'member'
            },
            'dakirb': { 
                pin: '1200', 
                password: 'gurasuraisu',
                role: 'member'
            }
        };

        // Bind methods to prevent context loss
        this.validateCredentials = this.validateCredentials.bind(this);
        this.loginUser = this.loginUser.bind(this);
        this.logoutUser = this.logoutUser.bind(this);
    }

    /**
     * Validates user credentials
     * @param {string} username - User's username
     * @param {string} pin - User's PIN
     * @param {string} password - User's password
     * @returns {boolean} - Returns true if credentials are valid
     * @throws {Error} - Throws error if validation fails
     */
    validateCredentials(username, pin, password) {
        // Check if all fields are provided
        if (!username || !pin || !password) {
            throw new Error('Please fill in all fields');
        }

        // Validate PIN format
        if (pin.length !== 4 || isNaN(pin)) {
            throw new Error('PIN must be 4 digits');
        }

        // Check if user exists
        const user = this.validCredentials[username];
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Validate PIN and password
        if (user.pin === pin && user.password === password) {
            return true;
        }
        
        throw new Error('Invalid credentials');
    }

    /**
     * Logs in a user and creates a session
     * @param {string} username - Username of the user to log in
     * @returns {Object} - User data object
     */
    loginUser(username) {
        try {
            const user = this.validCredentials[username];
            if (!user) {
                throw new Error('User not found');
            }

            // Create user session data
            const userData = {
                username: username,
                role: user.role,
                loginTime: new Date().toISOString(),
                lastActive: new Date().toISOString()
            };

            // Store in session storage
            sessionStorage.setItem('userData', JSON.stringify(userData));
            
            // Store last login in local storage for persistence
            const lastLogins = JSON.parse(localStorage.getItem('lastLogins') || '{}');
            lastLogins[username] = new Date().toISOString();
            localStorage.setItem('lastLogins', JSON.stringify(lastLogins));

            return userData;
        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Failed to log in user');
        }
    }

    /**
     * Logs out the current user
     */
    logoutUser() {
        try {
            // Update last active time before logging out
            const userData = this.getCurrentUser();
            if (userData) {
                userData.lastActive = new Date().toISOString();
                sessionStorage.setItem('userData', JSON.stringify(userData));
            }

            // Clear session
            sessionStorage.removeItem('userData');
            
            // Redirect to login page
            window.location.href = '/login.html';
        } catch (error) {
            console.error('Logout error:', error);
            throw new Error('Failed to log out user');
        }
    }

    /**
     * Gets the currently logged in user's data
     * @returns {Object|null} - User data or null if no user is logged in
     */
    getCurrentUser() {
        try {
            const userData = sessionStorage.getItem('userData');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    /**
     * Checks if a user is currently authenticated
     * @returns {boolean} - True if user is authenticated
     */
    isAuthenticated() {
        return !!this.getCurrentUser();
    }

    /**
     * Gets user's role
     * @param {string} username - Username to check
     * @returns {string|null} - User's role or null if user not found
     */
    getUserRole(username) {
        const user = this.validCredentials[username];
        return user ? user.role : null;
    }

    /**
     * Updates the last active timestamp for the current user
     */
    updateLastActive() {
        const userData = this.getCurrentUser();
        if (userData) {
            userData.lastActive = new Date().toISOString();
            sessionStorage.setItem('userData', JSON.stringify(userData));
        }
    }

    /**
     * Gets the last login time for a user
     * @param {string} username - Username to check
     * @returns {string|null} - ISO timestamp of last login or null
     */
    getLastLogin(username) {
        try {
            const lastLogins = JSON.parse(localStorage.getItem('lastLogins') || '{}');
            return lastLogins[username] || null;
        } catch (error) {
            console.error('Error getting last login:', error);
            return null;
        }
    }
}

// Export the class for use in other files
export default AuthService;

// analytics.js
class AnalyticsService {
    constructor() {
        this.visitorData = [
            { name: 'Jan', visitors: 4000, pageViews: 6400, uniqueVisitors: 3200 },
            { name: 'Feb', visitors: 3000, pageViews: 4300, uniqueVisitors: 2400 },
            { name: 'Mar', visitors: 2000, pageViews: 3800, uniqueVisitors: 1800 },
            { name: 'Apr', visitors: 2780, pageViews: 4908, uniqueVisitors: 2100 },
            { name: 'May', visitors: 1890, pageViews: 2800, uniqueVisitors: 1500 },
            { name: 'Jun', visitors: 2390, pageViews: 3800, uniqueVisitors: 1900 }
        ];

        this.pageAnalytics = [
            { page: 'Home', views: 45600, avgTime: '2:30', bounceRate: '32%' },
            { page: 'Products', views: 32400, avgTime: '3:45', bounceRate: '28%' },
            { page: 'About', views: 18900, avgTime: '1:15', bounceRate: '45%' },
            { page: 'Contact', views: 12300, avgTime: '0:45', bounceRate: '51%' }
        ];

        this.realtimeUsers = {
            current: 142,
            trend: '+12%'
        };
    }

    getVisitorStats() {
        return {
            totalVisitors: '124,892',
            activeUsers: this.realtimeUsers.current.toString(),
            avgSession: '2m 45s',
            bounceRate: '32.4%'
        };
    }

    getVisitorTrends() {
        return this.visitorData;
    }

    getPageAnalytics() {
        return this.pageAnalytics;
    }

    getRealtimeUsers() {
        return this.realtimeUsers;
    }

    // Simulate real-time data updates
    startRealtimeUpdates() {
        setInterval(() => {
            this.realtimeUsers.current += Math.floor(Math.random() * 10) - 4;
            this.realtimeUsers.trend = this.realtimeUsers.current > 142 ? '+' : '-';
            this.realtimeUsers.trend += Math.abs(Math.floor((this.realtimeUsers.current - 142) / 142 * 100)) + '%';
        }, 5000);
    }
}

// dashboard.js
class DashboardUI {
    constructor() {
        this.auth = new AuthService();
        this.analytics = new AnalyticsService();
        this.currentTab = 'analytics';
        this.charts = {};
        
        this.initializeDashboard();
        this.analytics.startRealtimeUpdates();
    }

    initializeDashboard() {
        if (!this.auth.isAuthenticated()) {
            window.location.href = '/login.html';
            return;
        }

        const user = this.auth.getCurrentUser();
        this.updateUserGreeting(user);
        this.renderAnalytics();
        this.setupEventListeners();
        this.startRealtimeUpdates();
    }

    updateUserGreeting(user) {
        const greetingElement = document.getElementById('userGreeting');
        const lastLoginElement = document.getElementById('lastLogin');
        
        if (greetingElement) {
            const hour = new Date().getHours();
            let greeting = 'Hello';
            if (hour < 12) greeting = 'Good morning';
            else if (hour < 18) greeting = 'Good afternoon';
            else greeting = 'Good evening';
            
            greetingElement.textContent = `${greeting}, ${user.username}!`;
        }

        if (lastLoginElement) {
            const lastLogin = this.auth.getLastLogin(user.username);
            lastLoginElement.textContent = `Last login: ${new Date(lastLogin).toLocaleString()}`;
        }
    }

    renderAnalytics() {
        const stats = this.analytics.getVisitorStats();
        this.updateStatCards(stats);
        this.renderVisitorChart();
        this.renderPageAnalyticsTable();
    }

    updateStatCards(stats) {
        Object.entries(stats).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = value;
            }
        });
    }

    renderVisitorChart() {
        const ctx = document.getElementById('visitorChart').getContext('2d');
        const data = this.analytics.getVisitorTrends();

        this.charts.visitors = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(item => item.name),
                datasets: [{
                    label: 'Visitors',
                    data: data.map(item => item.visitors),
                    borderColor: '#fbbf24',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    renderPageAnalyticsTable() {
        const data = this.analytics.getPageAnalytics();
        const tableBody = document.getElementById('analyticsTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = data.map(page => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${page.page}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${page.views.toLocaleString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${page.avgTime}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${page.bounceRate}</td>
            </tr>
        `).join('');
    }

    startRealtimeUpdates() {
        setInterval(() => {
            const stats = this.analytics.getVisitorStats();
            this.updateStatCards(stats);
            
            const realtimeElement = document.getElementById('realtimeUsers');
            if (realtimeElement) {
                const realtime = this.analytics.getRealtimeUsers();
                realtimeElement.textContent = realtime.current;
                realtimeElement.nextElementSibling.textContent = realtime.trend;
            }
        }, 5000);
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('[data-tab]').forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Logout handler
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                this.auth.logoutUser();
            });
        }
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        
        // Update active tab styling
        document.querySelectorAll('[data-tab]').forEach(button => {
            button.classList.toggle('bg-yellow-500', button.dataset.tab === tabName);
            button.classList.toggle('hover:bg-gray-800', button.dataset.tab !== tabName);
        });

        // Update content visibility
        document.querySelectorAll('[data-content]').forEach(content => {
            content.classList.toggle('hidden', content.dataset.content !== tabName);
        });
    }
}

// login.js
class LoginUI {
    constructor() {
        this.auth = new AuthService();
        this.initializeLogin();
    }

    initializeLogin() {
        // Initialize password visibility toggle
        this.setupPasswordToggle();
        
        // Initialize form submission
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Add input validation
        this.setupInputValidation();
    }

    setupPasswordToggle() {
        const toggles = document.querySelectorAll('.password-toggle');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const input = document.getElementById(e.currentTarget.dataset.for);
                const type = input.type === 'password' ? 'text' : 'password';
                input.type = type;
                
                // Update toggle icon
                const icon = e.currentTarget.querySelector('i');
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            });
        });
    }

    setupInputValidation() {
        const pinInput = document.getElementById('pin');
        if (pinInput) {
            pinInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
            });
        }

        const inputs = document.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => {
                this.validateInput(e.target);
            });
        });
    }

    validateInput(input) {
        if (!input.value) {
            this.showInputError(input, 'This field is required');
            return false;
        }

        if (input.id === 'pin' && input.value.length !== 4) {
            this.showInputError(input, 'PIN must be 4 digits');
            return false;
        }

        this.clearInputError(input);
        return true;
    }

    showInputError(input, message) {
        const errorElement = input.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
        input.classList.add('border-red-500');
    }

    clearInputError(input) {
        const errorElement = input.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
        input.classList.remove('border-red-500');
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('membershipId').value;
        const pin = document.getElementById('pin').value;
        const password = document.getElementById('password').value;

        // Validate all inputs before submission
        const inputs = e.target.querySelectorAll('input[required]');
        const isValid = Array.from(inputs).every(input => this.validateInput(input));

        if (!isValid) {
            return;
        }

        try {
            if (this.auth.validateCredentials(username, pin, password)) {
                this.auth.loginUser(username);
                window.location.href = '/dashboard.html';
            }
        } catch (error) {
            this.showError(error.message);
        }
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
            
            setTimeout(() => {
                errorElement.classList.add('hidden');
            }, 3000);
        }
    }
}

// Initialize the appropriate UI based on the current page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('loginForm')) {
        new LoginUI();
    } else if (document.getElementById('dashboard')) {
        new DashboardUI();
    }
});
