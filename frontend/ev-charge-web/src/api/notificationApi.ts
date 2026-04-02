import api from './axios';

export const getNotifications = async (params?: any) => {
    return await api.get('/notifications', { params });
};

export const markAsRead = async (notificationId: number) => {
    return await api.put(`/notifications/${notificationId}/read`);
};

export const markAllAsRead = async () => {
    return await api.put('/notifications/read-all');
};

export const deleteNotification = async (notificationId: number) => {
    return await api.delete(`/notifications/${notificationId}`);
};
