import api from './axios';

// User Management
export const getAllUsers = async (params?: any) => {
    return await api.get('/admin/users', { params });
};

export const updateUserRole = async (userId: number, role: string) => {
    return await api.put(`/admin/users/${userId}/role`, { role });
};

export const deleteUser = async (userId: number) => {
    return await api.delete(`/admin/users/${userId}`);
};

// Station Management
export const getAllStations = async (params?: any) => {
    return await api.get('/admin/stations', { params });
};

export const createStation = async (data: any) => {
    return await api.post('/admin/stations', data);
};

export const updateStation = async (id: number, data: any) => {
    return await api.put(`/admin/stations/${id}`, data);
};

export const deleteStation = async (id: number) => {
    return await api.delete(`/admin/stations/${id}`);
};

// Monitoring & Analytics
export const getAllNetworkSessions = async () => {
    return await api.get('/admin/sessions');
};

export const getSystemAnalytics = async () => {
    return await api.get('/admin/analytics');
};

export const generateReport = async (type: string) => {
    return await api.get(`/admin/reports/${type}`, { responseType: 'blob' });
};
