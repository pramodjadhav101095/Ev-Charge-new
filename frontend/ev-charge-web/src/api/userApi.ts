import api from './axios';

export const getUserProfile = async () => {
    return await api.get('/users/profile');
};

export const updateUserProfile = async (data: any) => {
    return await api.put('/users/profile', data);
};

export const getVehicles = async () => {
    return await api.get('/users/vehicles');
};

export const addVehicle = async (vehicleData: any) => {
    return await api.post('/users/vehicles', vehicleData);
};

export const updateVehicle = async (id: string, vehicleData: any) => {
    return await api.put(`/users/vehicles/${id}`, vehicleData);
};

export const deleteVehicle = async (id: string) => {
    return await api.delete(`/users/vehicles/${id}`);
};

export const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
