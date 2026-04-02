import api from './axios';

export const getBookings = async () => {
    return await api.get('/bookings');
};

export const createBooking = async (data: any) => {
    return await api.post('/bookings', data);
};

export const cancelBooking = async (id: number) => {
    return await api.put(`/bookings/${id}/cancel`);
};

export const getAvailability = async (stationId: number, date: string) => {
    return await api.get(`/bookings/availability/${stationId}`, { params: { date } });
};

export const getBookingHistory = async () => {
    return await api.get('/bookings/history');
};
