import axios from './axios';

export const login = async (credentials: any) => {
    const response = await axios.post('/auth/login', credentials);
    return response.data;
};

export const register = async (userData: any) => {
    const response = await axios.post('/auth/register', userData);
    return response.data;
};

export const validateToken = async (token: string) => {
    const response = await axios.get('/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
