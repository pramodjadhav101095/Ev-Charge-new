import React from 'react';
import {
    Box, TextField, Select, MenuItem, InputLabel,
    FormControl, Slider, Typography, Chip, OutlinedInput
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setFilters } from '../../store/slices/stationsSlice';
import SearchIcon from '@mui/icons-material/Search';

const STATION_TYPES = ['Level 1', 'Level 2', 'DC Fast'];

const Filters: React.FC = () => {
    const dispatch = useDispatch();
    const { filters } = useSelector((state: RootState) => state.stations);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setFilters({ query: e.target.value }));
    };

    const handleRadiusChange = (_: Event, value: number | number[]) => {
        dispatch(setFilters({ radius: value as number }));
    };

    const handleStatusChange = (e: any) => {
        dispatch(setFilters({ status: e.target.value }));
    };

    const handleTypeChange = (e: any) => {
        const { value } = e.target;
        dispatch(setFilters({ type: typeof value === 'string' ? value.split(',') : value }));
    };

    return (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <TextField
                fullWidth
                size="small"
                placeholder="Search stations..."
                value={filters.query}
                onChange={handleSearch}
                InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
                sx={{ mb: 2 }}
            />

            <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Search Radius: {filters.radius} km
                </Typography>
                <Slider
                    value={filters.radius}
                    min={1}
                    max={50}
                    onChange={handleRadiusChange}
                    valueLabelDisplay="auto"
                />
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select value={filters.status} label="Status" onChange={handleStatusChange}>
                        <MenuItem value="ALL">All Status</MenuItem>
                        <MenuItem value="AVAILABLE">Available</MenuItem>
                        <MenuItem value="CHARGING">Charging</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                    <InputLabel>Type</InputLabel>
                    <Select
                        multiple
                        value={filters.type}
                        onChange={handleTypeChange}
                        input={<OutlinedInput label="Type" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} size="small" />
                                ))}
                            </Box>
                        )}
                    >
                        {STATION_TYPES.map((type) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </Box>
    );
};

export default Filters;
