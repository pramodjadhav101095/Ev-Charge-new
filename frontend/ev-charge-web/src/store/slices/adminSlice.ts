import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllUsers, getAllStations, getAllNetworkSessions, getSystemAnalytics } from '../../api/adminApi';

export const fetchAdminData = createAsyncThunk(
    'admin/fetchData',
    async (_, { rejectWithValue }) => {
        try {
            const [users, stations, sessions, analytics] = await Promise.all([
                getAllUsers(),
                getAllStations(),
                getAllNetworkSessions(),
                getSystemAnalytics()
            ]);
            return {
                users: users.data,
                stations: stations.data,
                sessions: sessions.data,
                analytics: analytics.data
            };
        } catch (err: any) {
            return rejectWithValue(err.response.data);
        }
    }
);

interface AdminState {
    users: any[];
    stations: any[];
    sessions: any[];
    analytics: any | null;
    loading: boolean;
    error: string | null;
}

const initialState: AdminState = {
    users: [],
    stations: [],
    sessions: [],
    analytics: null,
    loading: false,
    error: null,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        updateLocalUserStatus: (state, action: PayloadAction<{ id: number; role: string }>) => {
            const index = state.users.findIndex(u => u.id === action.payload.id);
            if (index !== -1) state.users[index].role = action.payload.role;
        },
        removeLocalStation: (state, action: PayloadAction<number>) => {
            state.stations = state.stations.filter(s => s.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminData.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
                state.stations = action.payload.stations;
                state.sessions = action.payload.sessions;
                state.analytics = action.payload.analytics;
            })
            .addCase(fetchAdminData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { updateLocalUserStatus, removeLocalStation } = adminSlice.actions;
export default adminSlice.reducer;
