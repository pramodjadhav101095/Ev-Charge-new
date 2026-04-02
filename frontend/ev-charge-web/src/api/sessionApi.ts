import api from './axios';

export const getActiveSessions = async () => {
    return await api.get('/sessions/active');
};

export const getSessionHistory = async () => {
    return await api.get('/sessions/history');
};

export const endSession = async (sessionId: number) => {
    return await api.post(`/sessions/${sessionId}/end`);
};

export const getSessionById = async (sessionId: number) => {
    return await api.get(`/sessions/${sessionId}`);
};
