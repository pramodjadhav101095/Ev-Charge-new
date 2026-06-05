import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import stationsReducer from './slices/stationsSlice';
import bookingsReducer from './slices/bookingsSlice';
import notificationsReducer from './slices/notificationsSlice';
import adminReducer from './slices/adminSlice';
import analyticsReducer from './slices/analyticsSlice';
import sessionsReducer from './slices/sessionsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        stations: stationsReducer,
        bookings: bookingsReducer,
        notifications: notificationsReducer,
        admin: adminReducer,
        analytics: analyticsReducer,
        sessions: sessionsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
