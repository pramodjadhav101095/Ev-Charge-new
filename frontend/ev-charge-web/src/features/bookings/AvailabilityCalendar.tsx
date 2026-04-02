import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Tooltip, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateBookingDetails } from '../bookings/bookingsSlice';
import { getAvailability } from '../../api/bookingApi';

const HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

const AvailabilityCalendar: React.FC = () => {
    const dispatch = useDispatch();
    const { currentBooking } = useSelector((state: RootState) => state.bookings);
    const [slots, setSlots] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentBooking.stationId && currentBooking.date) {
            const loadAvailability = async () => {
                setLoading(true);
                try {
                    const response = await getAvailability(currentBooking.stationId!, currentBooking.date!);
                    setSlots(response.data);
                } catch (err) {
                    // Mocking slots if API fails for demo
                    setSlots(HOURS.map((h, i) => ({
                        id: `slot-${i}`,
                        time: h,
                        status: Math.random() > 0.3 ? 'AVAILABLE' : 'BOOKED'
                    })));
                } finally {
                    setLoading(false);
                }
            };
            loadAvailability();
        }
    }, [currentBooking.stationId, currentBooking.date]);

    const handleSlotSelect = (slot: any) => {
        if (slot.status === 'AVAILABLE') {
            dispatch(updateBookingDetails({ slotId: slot.id }));
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Available Slots for {currentBooking.date}
            </Typography>
            <Grid container spacing={1}>
                {slots.map((slot) => (
                    <Grid item xs={3} sm={2} key={slot.id}>
                        <Tooltip title={slot.status === 'AVAILABLE' ? 'Selection' : 'Already Booked'}>
                            <Paper
                                elevation={currentBooking.slotId === slot.id ? 4 : 1}
                                onClick={() => handleSlotSelect(slot)}
                                sx={{
                                    p: 1.5,
                                    textAlign: 'center',
                                    cursor: slot.status === 'AVAILABLE' ? 'pointer' : 'not-allowed',
                                    bgcolor: slot.status === 'AVAILABLE'
                                        ? (currentBooking.slotId === slot.id ? '#4caf50' : 'background.paper')
                                        : '#eeeeee',
                                    color: currentBooking.slotId === slot.id ? 'white' : 'text.primary',
                                    border: currentBooking.slotId === slot.id ? '2px solid #2e7d32' : '1px solid #ddd',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        transform: slot.status === 'AVAILABLE' ? 'scale(1.05)' : 'none',
                                    }
                                }}
                            >
                                <Typography variant="body2">{slot.time}</Typography>
                            </Paper>
                        </Tooltip>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 16, height: 16, bgcolor: '#4caf50', borderRadius: '50%' }} />
                    <Typography variant="caption">Selected</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 16, height: 16, bgcolor: 'background.paper', border: '1px solid #ddd', borderRadius: '50%' }} />
                    <Typography variant="caption">Available</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 16, height: 16, bgcolor: '#eeeeee', borderRadius: '50%' }} />
                    <Typography variant="caption">Booked</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default AvailabilityCalendar;
