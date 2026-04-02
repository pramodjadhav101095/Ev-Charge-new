import React from 'react';
import { Box, Typography, Grid, Paper, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StationMap from './components/StationMap';

const Dashboard: React.FC = () => {
    return (
        <Box>
            <Box mb={4} textAlign="center">
                <Typography variant="h4" gutterBottom>
                    Find Your Next Charge
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" mb={3}>
                    Locate nearby EV charging stations and book a slot instantly.
                </Typography>

                <Box maxWidth="600px" mx="auto">
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search by location, station name..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            style: { borderRadius: 24, backgroundColor: 'white' }
                        }}
                    />
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" mb={2}>Nearby Stations</Typography>
                        <StationMap />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" mb={2}>Recent Bookings</Typography>
                        <Typography variant="body2" color="text.secondary">
                            No recent bookings found.
                        </Typography>
                        {/* Placeholder for list of recent bookings */}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
