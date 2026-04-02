import React from 'react';
import { Box, Grid, Paper, Typography, Button, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import DownloadIcon from '@mui/icons-material/Download';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PeopleIcon from '@mui/icons-material/People';
import EvStationIcon from '@mui/icons-material/EvStation';

const ReportsTab: React.FC = () => {
    const { analytics } = useSelector((state: RootState) => state.admin);

    // Mock analytics if not loaded
    const stats = analytics || {
        totalRevenue: 125400,
        activeUsers: 342,
        totalStations: 52,
        utilizationRate: 78
    };

    const ReportCard = ({ title, value, icon, color }: any) => (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #eee', borderRadius: 3, bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${color}15`, color: color, mr: 2 }}>
                    {icon}
                </Box>
                <Typography variant="subtitle2" color="textSecondary">{title}</Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold">{value}</Typography>
        </Paper>
    );

    return (
        <Box sx={{ mt: 3 }}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <ReportCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={<AccountBalanceWalletIcon />} color="#2e7d32" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <ReportCard title="Active Users" value={stats.activeUsers} icon={<PeopleIcon />} color="#0288d1" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <ReportCard title="Stations Overview" value={stats.totalStations} icon={<EvStationIcon />} color="#ed6c02" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <ReportCard title="Utilization Rate" value={`${stats.utilizationRate}%`} icon={<TrendingUpIcon />} color="#9c27b0" />
                </Grid>
            </Grid>

            <Typography variant="h6" fontWeight="bold" gutterBottom>Download System Reports</Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
                {['Financial Summary', 'User Activity Logs', 'Station Performance', 'Environmental Impact'].map((report) => (
                    <Grid item xs={12} sm={6} md={4} key={report}>
                        <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1">{report}</Typography>
                            <Button startIcon={<DownloadIcon />} variant="text" size="small">CSV</Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ReportsTab;
