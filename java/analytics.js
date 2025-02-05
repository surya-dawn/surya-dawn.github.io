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
