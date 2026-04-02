import React, { useEffect } from 'react';
import { Container, Grid, Typography, Box, Paper, Divider, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getActiveSessions, getSessionHistory } from '../../api/sessionApi';
import { setActiveSessions, setHistory, setLoading } from '../../store/slices/sessionsSlice';
import SessionProgress from './SessionProgress';
import SessionList from './SessionList';
import { useSessionWebSocket } from '../../hooks/useSessionWebSocket';

const Sessions: React.FC = () => {
    const dispatch = useDispatch();
    const { activeSessions, history, loading } = useSelector((state: RootState) => state.sessions);
    const { user } = useSelector((state: RootState) => state.auth);

    // Initialize WebSocket connection for real-time updates
    useSessionWebSocket(user?.id);

    useEffect(() => {
        const loadSessions = async () => {
            dispatch(setLoading(true));
            try {
                const [activeRes, historyRes] = await Promise.all([
                    getActiveSessions(),
                    getSessionHistory()
                ]);
                dispatch(setActiveSessions(activeRes.data));
                dispatch(setHistory(historyRes.data));
            } catch (err) {
                console.error('Failed to load sessions', err);
                dispatch(setLoading(false));
            }
        };
        loadSessions();
    }, [dispatch]);

    if (loading && activeSessions.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Live Charging Dashboard
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
                Monitor your active charging sessions and view past performance insights.
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    {activeSessions.length > 0 ? (
                        activeSessions.map(session => (
                            <SessionProgress key={session.id} session={session} />
                        ))
                    ) : (
                        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#fafafa' }}>
                            <Typography color="textSecondary">No active charging sessions found.</Typography>
                        </Paper>
                    )}

                    <Box sx={{ mt: 6 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>Session History</Typography>
                        <SessionList sessions={history} type="history" />
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Active Session List</Typography>
                    <SessionList sessions={activeSessions} type="active" />

                    <Box sx={{ mt: 4, p: 2, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                        <Typography variant="subtitle2" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%' }} />
                            WebSocket Connected
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            Your dashboard is receiving real-time updates from the charging point.
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Sessions;
