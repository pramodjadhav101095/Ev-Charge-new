import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getStations } from '../../api/stationApi';

export const fetchStations = createAsyncThunk(
    'stations/fetchStations',
    async (params: any, { rejectWithValue }) => {
        try {
            const response = await getStations(params);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response.data);
        }
    }
);

interface StationsState {
    items: any[];
    bookmarkedIds: number[];
    selectedStation: any | null;
    loading: boolean;
    error: string | null;
    filters: {
        type: string[];
        status: string;
        radius: number;
        sortBy: string;
        query: string;
        lat?: number;
        lng?: number;
    };
    pagination: {
        page: number;
        hasMore: boolean;
    };
}

const initialState: StationsState = {
    items: [],
    bookmarkedIds: [],
    selectedStation: null,
    loading: false,
    error: null,
    filters: {
        type: [],
        status: 'ALL',
        radius: 10,
        sortBy: 'distance',
        query: '',
    },
    pagination: {
        page: 0,
        hasMore: true,
    },
};

const stationsSlice = createSlice({
    name: 'stations',
    initialState,
    reducers: {
        setSelectedStation: (state, action: PayloadAction<any | null>) => {
            state.selectedStation = action.payload;
        },
        setFilters: (state, action: PayloadAction<any>) => {
            state.filters = { ...state.filters, ...action.payload };
            state.items = []; // Reset list on filter change
            state.pagination.page = 0;
            state.pagination.hasMore = true;
        },
        toggleBookmarkState: (state, action: PayloadAction<number>) => {
            const id = action.payload;
            if (state.bookmarkedIds.includes(id)) {
                state.bookmarkedIds = state.bookmarkedIds.filter(bid => bid !== id);
            } else {
                state.bookmarkedIds.push(id);
            }
        },
        updateStationStatus: (state, action: PayloadAction<{ id: number; status: string }>) => {
            const { id, status } = action.payload;
            const index = state.items.findIndex(s => s.id === id);
            if (index !== -1) {
                state.items[index].status = status;
            }
            if (state.selectedStation?.id === id) {
                state.selectedStation.status = status;
            }
        },
        resetStations: (state) => {
            state.items = [];
            state.pagination.page = 0;
            state.pagination.hasMore = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStations.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.length < 10) {
                    state.pagination.hasMore = false;
                }
                state.items = [...state.items, ...action.payload];
                state.pagination.page += 1;
            })
            .addCase(fetchStations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setSelectedStation, setFilters, toggleBookmarkState, updateStationStatus, resetStations } = stationsSlice.actions;

export default stationsSlice.reducer;
