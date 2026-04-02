import React from 'react';
import { Box, Typography, LinearProgress, Paper, Grid } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import TimerIcon from '@mui/icons-material/Timer';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

interface SessionProgressProps {
    session: any;
}

const SessionProgress: React.FC<SessionProgressProps> = ({ session }) => {
    // Assuming max battery capacity for calculation 60 kWh
    const progress = Math.min((session.energyUsed / 60) * 100, 100);

    return (
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3, borderLeft: '6px solid #4caf50' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">Active Session #{session.id}</Typography>
                <Typography variant="body2" color="success.main" fontWeight="bold">CHARGING</Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BoltIcon color="primary" />
                        <Box>
                            <Typography variant="caption" color="textSecondary">Energy</Typography>
                            <Typography variant="h6">{session.energyUsed.toFixed(2)} kWh</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TimerIcon color="primary" />
                        <Box>
                            <Typography variant="caption" color="textSecondary">Duration</Typography>
                            <Typography variant="h6">45m</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CurrencyRupeeIcon color="primary" />
                        <Box>
                            <Typography variant="caption" color="textSecondary">Cost</Typography>
                            <Typography variant="h6">₹{session.cost.toFixed(2)}</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ height: 12, borderRadius: 5, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { borderRadius: 5 } }}
                    />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default SessionProgress;
