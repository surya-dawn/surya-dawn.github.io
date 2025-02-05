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
