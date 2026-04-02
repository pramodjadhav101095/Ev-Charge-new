import api from './axios';

export const processPayment = async (data: any) => {
    return await api.post('/payments/process', data);
};

export const getPaymentHistory = async () => {
    return await api.get('/payments/history');
};
