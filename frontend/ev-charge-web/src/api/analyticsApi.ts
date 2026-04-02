import api from './axios';

export const getUsageStats = async (params: { startDate: string; endDate: string; stationId?: number }) => {
    return await api.get('/analytics/usage', { params });
};

export const getRevenueStats = async (params: { startDate: string; endDate: string }) => {
    return await api.get('/analytics/revenue', { params });
};

export const getPerformanceTrends = async () => {
    return await api.get('/analytics/trends');
};

export const getPredictions = async () => {
    return await api.get('/analytics/predictions');
};

export const exportAnalyticsReport = async (format: 'csv' | 'pdf', type: string) => {
    return await api.get(`/analytics/export/${type}`, {
        params: { format },
        responseType: 'blob'
    });
};
