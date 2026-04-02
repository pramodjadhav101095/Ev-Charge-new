import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getBookings, createBooking as apiCreateBooking, cancelBooking as apiCancelBooking } from '../../api/bookingApi';

export const fetchBookings = createAsyncThunk(
    'bookings/fetchBookings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getBookings();
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response.data);
        }
    }
);

interface BookingsState {
    items: any[];
    loading: boolean;
    error: string | null;
    currentBooking: {
        step: number;
        stationId: number | null;
        slotId: string | null;
        date: string | null;
        vehicleId: string | null;
    };
}

const initialState: BookingsState = {
    items: [],
    loading: false,
    error: null,
    currentBooking: {
        step: 0,
        stationId: null,
        slotId: null,
        date: null,
        vehicleId: null,
    },
};

const bookingsSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        setBookingStep: (state, action: PayloadAction<number>) => {
            state.currentBooking.step = action.payload;
        },
        updateBookingDetails: (state, action: PayloadAction<Partial<BookingsState['currentBooking']>>) => {
            state.currentBooking = { ...state.currentBooking, ...action.payload };
        },
        resetBookingProcess: (state) => {
            state.currentBooking = initialState.currentBooking;
        },
        addBookingSuccess: (state, action: PayloadAction<any>) => {
            state.items.unshift(action.payload);
        },
        cancelBookingSuccess: (state, action: PayloadAction<number>) => {
            const index = state.items.findIndex(b => b.id === action.payload);
            if (index !== -1) {
                state.items[index].status = 'CANCELLED';
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setBookingStep, updateBookingDetails, resetBookingProcess, addBookingSuccess, cancelBookingSuccess } = bookingsSlice.actions;
export default bookingsSlice.reducer;
