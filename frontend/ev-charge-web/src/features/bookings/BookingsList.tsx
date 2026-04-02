import React, { useEffect } from 'react';
import {
    Box, Typography, Card, CardContent, Grid,
    Chip, Button, Divider, CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchBookings, cancelBookingSuccess } from './bookingsSlice';
import { cancelBooking } from '../../api/bookingApi';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EvStationIcon from '@mui/icons-material/EvStation';

const BookingsList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading, error } = useSelector((state: RootState) => state.bookings);

    useEffect(() => {
        dispatch(fetchBookings());
    }, [dispatch]);

    const handleCancel = async (id: number) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await cancelBooking(id);
                dispatch(cancelBookingSuccess(id));
            } catch (err) {
                console.error('Cancel failed', err);
            }
        }
    };

    if (loading && items.length === 0) return <Box sx={{ textAlign: 'center', p: 4 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>My Bookings</Typography>
            <Grid container spacing={2}>
                {items.map((booking) => (
                    <Grid item xs={12} key={booking.id}>
                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <EvStationIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography variant="h6">Station #{booking.stationId}</Typography>
                                    </Box>
                                    <Chip
                                        label={booking.status}
                                        color={booking.status === 'CONFIRMED' ? 'success' : 'default'}
                                        size="small"
                                    />
                                </Box>
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    <Grid item xs={6} sm={4}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <EventIcon sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                                            <Typography variant="body2">{booking.date}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6} sm={4}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <AccessTimeIcon sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                                            <Typography variant="body2">14:00 - 15:00</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ my: 1.5 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" color="textSecondary">
                                        Amount Paid: <strong>₹450.00</strong>
                                    </Typography>
                                    {booking.status === 'CONFIRMED' && (
                                        <Button
                                            size="small"
                                            color="error"
                                            variant="text"
                                            onClick={() => handleCancel(booking.id)}
                                        >
                                            Cancel Booking
                                        </Button>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                {items.length === 0 && (
                    <Typography color="textSecondary" sx={{ p: 4 }}>No bookings found.</Typography>
                )}
            </Grid>
        </Box>
    );
};

export default BookingsList;
