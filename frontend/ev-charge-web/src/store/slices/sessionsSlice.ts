import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChargingSession {
    id: number;
    stationId: number;
    startTime: string;
    endTime: string | null;
    energyUsed: number;
    cost: number;
    status: string;
}

interface SessionsState {
    activeSessions: ChargingSession[];
    history: ChargingSession[];
    loading: boolean;
    error: string | null;
}

const initialState: SessionsState = {
    activeSessions: [],
    history: [],
    loading: false,
    error: null,
};

const sessionsSlice = createSlice({
    name: 'sessions',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setActiveSessions: (state, action: PayloadAction<ChargingSession[]>) => {
            state.activeSessions = action.payload;
            state.loading = false;
        },
        setHistory: (state, action: PayloadAction<ChargingSession[]>) => {
            state.history = action.payload;
            state.loading = false;
        },
        updateActiveSession: (state, action: PayloadAction<ChargingSession>) => {
            const index = state.activeSessions.findIndex(s => s.id === action.payload.id);
            if (index !== -1) {
                state.activeSessions[index] = { ...state.activeSessions[index], ...action.payload };
            } else if (action.payload.status === 'ACTIVE') {
                state.activeSessions.push(action.payload);
            }
        },
        removeActiveSession: (state, action: PayloadAction<number>) => {
            state.activeSessions = state.activeSessions.filter(s => s.id !== action.payload);
        },
        addSessionToHistory: (state, action: PayloadAction<ChargingSession>) => {
            state.history.unshift(action.payload);
        }
    },
});

export const {
    setLoading,
    setActiveSessions,
    setHistory,
    updateActiveSession,
    removeActiveSession,
    addSessionToHistory
} = sessionsSlice.actions;

export default sessionsSlice.reducer;
