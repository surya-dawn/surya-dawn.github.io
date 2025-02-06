// js/analytics.js

class Analytics {
    constructor() {
        this.mockData = {
            visitors: [
                { date: '2024-01', count: 4500 },
                { date: '2024-02', count: 5200 },
                { date: '2024-03', count: 4800 },
                { date: '2024-04', count: 6100 },
                { date: '2024-05', count: 5600 },
                { date: '2024-06', count: 6800 }
            ],
            pageViews: [
                { page: 'Home', views: 12500, avgTime: '2:30' },
                { page: 'Products', views: 8300, avgTime: '3:45' },
                { page: 'About', views: 4200, avgTime: '1:15' },
                { page: 'Contact', views: 3100, avgTime: '0:45' }
            ]
        };
    }

    async getStats() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    totalVisitors: '124,892',
                    activeUsers: '1,234',
                    bounceRate: '32.4%',
                    avgSession: '2m 45s'
                });
            }, 1000);
        });
    }

    async getVisitorData() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.mockData.visitors);
            }, 1000);
        });
    }

    async getPageViews() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.mockData.pageViews);
            }, 1000);
        });
    }
}

// Global analytics instance
window.analytics = new Analytics();
