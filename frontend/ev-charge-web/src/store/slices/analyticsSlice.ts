import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUsageStats, getRevenueStats } from '../../api/analyticsApi';

export const fetchAnalyticsData = createAsyncThunk(
    'analytics/fetchData',
    async (params: { startDate: string; endDate: string }, { rejectWithValue }) => {
        try {
            const [usage, revenue] = await Promise.all([
                getUsageStats(params),
                getRevenueStats(params)
            ]);
            return {
                usage: usage.data,
                revenue: revenue.data
            };
        } catch (err: any) {
            return rejectWithValue(err.response.data);
        }
    }
);

interface AnalyticsState {
    usageData: any[];
    revenueData: any[];
    loading: boolean;
    error: string | null;
    dateRange: {
        startDate: string;
        endDate: string;
    };
}

const initialState: AnalyticsState = {
    usageData: [],
    revenueData: [],
    loading: false,
    error: null,
    dateRange: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
    },
};

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        setDateRange: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
            state.dateRange = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnalyticsData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAnalyticsData.fulfilled, (state, action) => {
                state.loading = false;
                state.usageData = action.payload.usage;
                state.revenueData = action.payload.revenue;
            })
            .addCase(fetchAnalyticsData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setDateRange } = analyticsSlice.actions;
export default analyticsSlice.reducer;
