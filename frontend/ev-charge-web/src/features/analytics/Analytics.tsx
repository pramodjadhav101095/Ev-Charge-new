import React, { useEffect } from 'react';
import {
    Container, Grid, Typography, Box, Paper,
    TextField, MenuItem, Button, CircularProgress, Alert, Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchAnalyticsData, setDateRange } from './analyticsSlice';
import UsageChart from './UsageChart';
import RevenueReport from './RevenueReport';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const Analytics: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { usageData, revenueData, loading, dateRange, error } = useSelector((state: RootState) => state.analytics);

    useEffect(() => {
        dispatch(fetchAnalyticsData(dateRange));
    }, [dispatch, dateRange]);

    const handleDateChange = (field: 'startDate' | 'endDate', value: Date | null) => {
        if (value) {
            dispatch(setDateRange({
                ...dateRange,
                [field]: value.toISOString().split('T')[0]
            }));
        }
    };

    const KpiCard = ({ title, value, detail, icon, color }: any) => (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #eee', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="subtitle2" color="textSecondary">{title}</Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ my: 1 }}>{value}</Typography>
                    <Typography variant="caption" color={color === 'success' ? 'success.main' : 'primary'}>
                        {detail}
                    </Typography>
                </Box>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${color}.light`, color: `${color}.main` }}>
                    {icon}
                </Box>
            </Box>
        </Paper>
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>Platform Analytics</Typography>
                        <Typography variant="body1" color="textSecondary">Monitor system performance, user behavior, and revenue trends.</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <DatePicker
                            label="Start Date"
                            value={new Date(dateRange.startDate)}
                            onChange={(v) => handleDateChange('startDate', v)}
                            slotProps={{ textField: { size: 'small' } }}
                        />
                        <DatePicker
                            label="End Date"
                            value={new Date(dateRange.endDate)}
                            onChange={(v) => handleDateChange('endDate', v)}
                            slotProps={{ textField: { size: 'small' } }}
                        />
                    </Box>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                        <KpiCard
                            title="Total Energy Delivered"
                            value="42.5 MWh"
                            detail="+12% from last month"
                            icon={<BatteryChargingFullIcon />}
                            color="success"
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <KpiCard
                            title="Growth Rate"
                            value="24.8%"
                            detail="New users this week"
                            icon={<TrendingUpIcon />}
                            color="primary"
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <KpiCard
                            title="Total Billing"
                            value="₹8.4L"
                            detail="Processed via Razorpay"
                            icon={<CurrencyRupeeIcon />}
                            color="warning"
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={4}>
                    <Grid item xs={12} lg={8}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>
                        ) : (
                            <UsageChart data={usageData} />
                        )}
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>
                        ) : (
                            <RevenueReport data={revenueData} />
                        )}
                    </Grid>
                </Grid>

                <Box sx={{ mt: 6 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>Future Trends & Predictions</Typography>
                    <Divider sx={{ mb: 3 }} />
                    <Paper sx={{ p: 4, bgcolor: '#f5f5f5', borderRadius: 3, border: '1px dashed #ccc' }}>
                        <Typography variant="subtitle1" color="textSecondary" align="center">
                            Machine Learning predictions for the next quarter will be available after 90 days of operational data.
                        </Typography>
                    </Paper>
                </Box>
            </Container>
        </LocalizationProvider>
    );
};

export default Analytics;
