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
