import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getNotifications } from '../../api/notificationApi';

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (params: any, { rejectWithValue }) => {
        try {
            const response = await getNotifications(params);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response.data);
        }
    }
);

interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    read: boolean;
    createdAt: string;
}

interface NotificationsState {
    items: Notification[];
    loading: boolean;
    error: string | null;
}

const initialState: NotificationsState = {
    items: [],
    loading: false,
    error: null,
};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.items.unshift(action.payload);
        },
        updateNotificationReadStatus: (state, action: PayloadAction<number>) => {
            const notification = state.items.find(n => n.id === action.payload);
            if (notification) notification.read = true;
        },
        markAllLocalRead: (state) => {
            state.items.forEach(n => n.read = true);
        },
        removeNotification: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(n => n.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { addNotification, updateNotificationReadStatus, markAllLocalRead, removeNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
