import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
}

interface UserState {
    profile: any | null;
    vehicles: Vehicle[];
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    profile: null,
    vehicles: [],
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        fetchProfileStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchProfileSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.profile = action.payload;
        },
        fetchProfileFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateProfileSuccess: (state, action: PayloadAction<any>) => {
            state.profile = action.payload;
            state.loading = false;
        },
        setVehicles: (state, action: PayloadAction<Vehicle[]>) => {
            state.vehicles = action.payload;
        },
        addVehicleSuccess: (state, action: PayloadAction<Vehicle>) => {
            state.vehicles.push(action.payload);
        },
        updateVehicleSuccess: (state, action: PayloadAction<Vehicle>) => {
            const index = state.vehicles.findIndex(v => v.id === action.payload.id);
            if (index !== -1) {
                state.vehicles[index] = action.payload;
            }
        },
        deleteVehicleSuccess: (state, action: PayloadAction<string>) => {
            state.vehicles = state.vehicles.filter(v => v.id !== action.payload);
        }
    },
});

export const {
    fetchProfileStart,
    fetchProfileSuccess,
    fetchProfileFailure,
    updateProfileSuccess,
    setVehicles,
    addVehicleSuccess,
    updateVehicleSuccess,
    deleteVehicleSuccess
} = userSlice.actions;

export default userSlice.reducer;
