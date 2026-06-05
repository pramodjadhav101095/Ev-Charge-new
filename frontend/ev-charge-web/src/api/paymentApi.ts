import api from './axios';

export interface InitiatePaymentRequest {
    bookingId: string | number;
    userId: number;
    amount: number;
    currency?: string;
    mock?: boolean;
}

export interface VerifyMockPaymentRequest {
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
}

export const initiatePayment = async (data: InitiatePaymentRequest) => {
    return await api.post('/payments/initiate', data);
};

export const verifyMockPayment = async (data: VerifyMockPaymentRequest) => {
    return await api.post('/payments/verify-mock', data);
};

export const getPaymentHistory = async () => {
    return await api.get('/payments/history');
};

export const getUserTransactions = async (userId: number) => {
    return await api.get(`/payments/user/${userId}`);
};
