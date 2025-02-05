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
