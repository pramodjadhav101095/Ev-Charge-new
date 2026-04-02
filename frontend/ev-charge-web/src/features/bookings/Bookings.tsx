import React from 'react';
import { Container, Grid, Typography, Box, Paper, Fab } from '@mui/material';
import BookingForm from './BookingForm';
import BookingsList from './BookingsList';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';

const Bookings: React.FC = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" fontWeight="bold">Charging Reservations</Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <Typography variant="h6" fontWeight="medium" gutterBottom>
                        Book a New Slot
                    </Typography>
                    <BookingForm />
                </Grid>

                <Grid item xs={12} md={5}>
                    <BookingsList />
                </Grid>
            </Grid>
        </Container>
    );
};

export default Bookings;
