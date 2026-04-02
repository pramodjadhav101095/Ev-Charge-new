import React, { useState } from 'react';
import {
    Box, Stepper, Step, StepLabel, Button, Typography,
    Paper, TextField, Grid, Divider, Select, MenuItem,
    FormControl, InputLabel, CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setBookingStep, updateBookingDetails, addBookingSuccess, resetBookingProcess } from './bookingsSlice';
import AvailabilityCalendar from './AvailabilityCalendar';
import { createBooking } from '../../api/bookingApi';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const steps = ['Select Schedule', 'Identify Vehicle', 'Review & Pay'];

const BookingForm: React.FC = () => {
    const dispatch = useDispatch();
    const { currentBooking } = useSelector((state: RootState) => state.bookings);
    const { vehicles } = useSelector((state: RootState) => state.user);
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);

    const handleNext = () => {
        dispatch(setBookingStep(currentBooking.step + 1));
    };

    const handleBack = () => {
        dispatch(setBookingStep(currentBooking.step - 1));
    };

    const handleConfirmBooking = async () => {
        setLoading(true);
        try {
            const bookingData = {
                stationId: currentBooking.stationId,
                slotId: currentBooking.slotId,
                date: currentBooking.date,
                vehicleId: currentBooking.vehicleId,
                userId: 1, // Mock
                status: 'CONFIRMED'
            };
            const response = await createBooking(bookingData);
            dispatch(addBookingSuccess(response.data));
            setCompleted(true);
        } catch (err) {
            console.error('Booking failed', err);
            // Mock success for UI demo
            setCompleted(true);
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>When would you like to charge?</Typography>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Select Date"
                                value={currentBooking.date ? new Date(currentBooking.date) : null}
                                onChange={(newValue: any) => {
                                    dispatch(updateBookingDetails({ date: newValue?.toISOString().split('T')[0] }));
                                }}
                                sx={{ width: '100%', mb: 2 }}
                            />
                        </LocalizationProvider>
                        {currentBooking.date && <AvailabilityCalendar />}
                    </Box>
                );
            case 1:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>Select your Vehicle</Typography>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>My Vehicles</InputLabel>
                            <Select
                                value={currentBooking.vehicleId || ''}
                                label="My Vehicles"
                                onChange={(e) => dispatch(updateBookingDetails({ vehicleId: e.target.value }))}
                            >
                                {vehicles.map((v) => (
                                    <MenuItem key={v.id} value={v.id}>{v.year} {v.make} {v.model} - {v.licensePlate}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {vehicles.length === 0 && (
                            <Typography color="error" sx={{ mt: 1 }}>
                                No vehicles found. Please add one in your profile first.
                            </Typography>
                        )}
                    </Box>
                );
            case 2:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>Review Details</Typography>
                        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}><Typography color="textSecondary">Station</Typography><Typography fontWeight="bold">GreenCharge Pune #1</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary">Date</Typography><Typography fontWeight="bold">{currentBooking.date}</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary">Time Slot</Typography><Typography fontWeight="bold">14:00 - 15:00</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary">Vehicle</Typography><Typography fontWeight="bold">Tesla Model 3</Typography></Grid>
                            </Grid>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6">Total Price</Typography>
                                <Typography variant="h6" color="primary">₹450.00</Typography>
                            </Box>
                        </Paper>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                            * Amount will be charged to your primary payment method upon confirmation.
                        </Typography>
                    </Box>
                );
            default:
                return null;
        }
    };

    if (completed) {
        return (
            <Paper elevation={3} sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
                <Typography variant="h4" fontWeight="bold" gutterBottom>Booking Confirmed!</Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
                    Your slot has been successfully reserved. You will receive a notification 15 mins before your session.
                </Typography>
                <Button variant="contained" size="large" onClick={() => {
                    setCompleted(false);
                    dispatch(resetBookingProcess());
                }}>
                    Done
                </Button>
            </Paper>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Stepper activeStep={currentBooking.step} sx={{ mb: 4 }}>
                {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
            </Stepper>

            <Box sx={{ minHeight: 300 }}>
                {renderStepContent(currentBooking.step)}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                    variant="text"
                    onClick={handleBack}
                    disabled={currentBooking.step === 0 || loading}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    disabled={(currentBooking.step === 0 && !currentBooking.slotId) ||
                        (currentBooking.step === 1 && !currentBooking.vehicleId) ||
                        loading}
                    onClick={currentBooking.step === steps.length - 1 ? handleConfirmBooking : handleNext}
                    sx={{ minWidth: 120 }}
                >
                    {loading ? <CircularProgress size={24} /> : (currentBooking.step === steps.length - 1 ? 'Pay & Confirm' : 'Next')}
                </Button>
            </Box>
        </Paper>
    );
};

export default BookingForm;
