import React, { useEffect, useState } from 'react';
import { Box, Grid, Fab, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchStations, setFilters } from './stationsSlice';
import StationList from './StationList';
import Filters from './Filters';
import StationMap from '../../components/StationMap';
import StationDetailsModal from './StationDetailsModal';
import MyLocationIcon from '@mui/icons-material/MyLocation';

const Stations: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { filters } = useSelector((state: RootState) => state.stations);

    useEffect(() => {
        dispatch(fetchStations(filters));
    }, [dispatch, filters]);

    const handleNearMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                dispatch(setFilters({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                }));
            });
        }
    };

    return (
        <Box sx={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
            <Grid container sx={{ height: '100%' }}>
                {!isMobile && (
                    <Grid item md={4} lg={3} sx={{ height: '100%', borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column' }}>
                        <Filters />
                        <StationList />
                    </Grid>
                )}

                <Grid item xs={12} md={8} lg={9} sx={{ height: '100%', position: 'relative' }}>
                    <StationMap />

                    <Fab
                        color="primary"
                        aria-label="near me"
                        onClick={handleNearMe}
                        sx={{ position: 'absolute', bottom: 20, right: 20 }}
                    >
                        <MyLocationIcon />
                    </Fab>
                </Grid>
            </Grid>

            <StationDetailsModal />
        </Box>
    );
};

export default Stations;
