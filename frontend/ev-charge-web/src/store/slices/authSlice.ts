import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    token: string | null;
    user: any | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const getUserFromStorage = (): any | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr || userStr === 'undefined') {
        return null;
    }
    try {
        return JSON.parse(userStr);
    } catch (e) {
        console.error('Failed to parse user from localStorage', e);
        return null;
    }
};

const initialState: AuthState = {
    token: localStorage.getItem('token'),
    user: getUserFromStorage(),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<{ token: string; user: any }>) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.error = null;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { setAuth, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
