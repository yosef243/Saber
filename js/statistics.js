class Statistics {
    constructor() {
        this.dailyStats = {};
        this.weeklyStats = {};
        this.monthlyStats = {};
    }

    // Track daily statistics
    trackDaily(date, count) {
        const key = this.formatDate(date);
        if (!this.dailyStats[key]) {
            this.dailyStats[key] = 0;
        }
        this.dailyStats[key] += count;
    }

    // Track weekly statistics
    trackWeekly(date, count) {
        const weekNumber = this.getWeekNumber(date);
        if (!this.weeklyStats[weekNumber]) {
            this.weeklyStats[weekNumber] = 0;
        }
        this.weeklyStats[weekNumber] += count;
    }

    // Track monthly statistics
    trackMonthly(date, count) {
        const monthKey = this.formatMonth(date);
        if (!this.monthlyStats[monthKey]) {
            this.monthlyStats[monthKey] = 0;
        }
        this.monthlyStats[monthKey] += count;
    }

    // Format date to YYYY-MM-DD
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    // Get week number
    getWeekNumber(date) {
        const startDate = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
        return Math.ceil((days + startDate.getDay() + 1) / 7);
    }

    // Format month to YYYY-MM
    formatMonth(date) {
        return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0');
    }
}

// Example usage:
// const stats = new Statistics();
// stats.trackDaily(new Date('2026-02-26'), 5);
// stats.trackWeekly(new Date('2026-02-26'), 20);
// stats.trackMonthly(new Date('2026-02-26'), 75);