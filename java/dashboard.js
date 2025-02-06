// js/dashboard.js

class DashboardUI {
    constructor() {
        this.initializeUI();
        this.loadData();
    }

    initializeUI() {
        // Update user info
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        if (userData) {
            document.getElementById('greeting').textContent = `Welcome back, ${userData.username}!`;
            document.getElementById('lastLogin').textContent = `Last login: ${new Date(userData.lastLogin).toLocaleString()}`;
        }
    }

    async loadData() {
        try {
            // Load stats
            const stats = await window.analytics.getStats();
            document.getElementById('totalVisitors').textContent = stats.totalVisitors;
            document.getElementById('activeUsers').textContent = stats.activeUsers;
            document.getElementById('bounceRate').textContent = stats.bounceRate;
            document.getElementById('avgSession').textContent = stats.avgSession;

            // Initialize charts
            this.initializeCharts();

            // Load activity table
            this.loadActivityTable();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    async initializeCharts() {
        const visitorData = await window.analytics.getVisitorData();
        
        // Visitor Trends Chart
        new Chart(document.getElementById('visitorChart'), {
            type: 'line',
            data: {
                labels: visitorData.map(d => d.date),
                datasets: [{
                    label: 'Visitors',
                    data: visitorData.map(d => d.count),
                    borderColor: '#3B82F6',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Page Views Chart
        const pageViews = await window.analytics.getPageViews();
        new Chart(document.getElementById('pageViewsChart'), {
            type: 'bar',
            data: {
                labels: pageViews.map(p => p.page),
                datasets: [{
                    label: 'Views',
                    data: pageViews.map(p => p.views),
                    backgroundColor: '#10B981'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    async loadActivityTable() {
        const pageViews = await window.analytics.getPageViews();
        const tableBody = document.getElementById('activityTableBody');
        
        tableBody.innerHTML = pageViews.map(page => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${page.page}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${page.views.toLocaleString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${page.avgTime}</td>
            </tr>
        `).join('');
    }
}
