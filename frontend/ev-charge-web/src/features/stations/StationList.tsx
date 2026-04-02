import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import StationCard from './StationCard';

const StationList: React.FC = () => {
    const { items, loading, error } = useSelector((state: RootState) => state.stations);

    if (loading && items.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center" sx={{ p: 4 }}>
                {error}
            </Typography>
        );
    }

    if (items.length === 0) {
        return (
            <Typography align="center" color="text.secondary" sx={{ p: 4 }}>
                No stations found in this area.
            </Typography>
        );
    }

    return (
        <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
            {items.map((station) => (
                <StationCard key={station.id} station={station} />
            ))}
        </Box>
    );
};

export default StationList;
