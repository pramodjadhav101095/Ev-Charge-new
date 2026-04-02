import api from './axios';

export interface Station {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    source: string;
    status: string;
    type?: string;
    distance?: number;
    duration?: string;
    rating?: number;
    connectorTypes?: string[];
    pricing?: string;
}

export const getStations = async (params: any) => {
    return await api.get('/stations', { params });
};

export const getNearbyStations = async (lat: number, lng: number, radius: number) => {
    return await api.get('/stations/nearby', { params: { lat, lng, radius } });
};

export const searchStations = async (query: string) => {
    return await api.get('/stations/search', { params: { query } });
};

export const getStationById = async (id: number) => {
    return await api.get(`/stations/${id}`);
};

export const createStation = async (data: any) => {
    return await api.post('/stations', data);
};

export const toggleBookmark = async (stationId: number) => {
    return await api.post(`/users/bookmarks/${stationId}`);
};

export const getBookmarks = async () => {
    return await api.get('/users/bookmarks');
};
