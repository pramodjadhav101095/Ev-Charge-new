import React from 'react';
import {
    Box, Typography, Card, CardContent, Grid,
    Button, Divider, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Chip
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { endSession as apiEndSession } from '../../api/sessionApi';
import { removeActiveSession, addSessionToHistory } from '../../store/slices/sessionsSlice';

interface SessionListProps {
    sessions: any[];
    type: 'active' | 'history';
}

const SessionList: React.FC<SessionListProps> = ({ sessions, type }) => {
    const dispatch = useDispatch();

    const handleEndSession = async (id: number) => {
        if (window.confirm('Are you sure you want to end this session?')) {
            try {
                const response = await apiEndSession(id);
                dispatch(removeActiveSession(id));
                dispatch(addSessionToHistory(response.data));
            } catch (err) {
                console.error('Failed to end session', err);
            }
        }
    };

    if (type === 'active') {
        return (
            <Box>
                {sessions.map((session) => (
                    <Card key={session.id} variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">Station ID: {session.stationId}</Typography>
                                    <Typography variant="body2" color="textSecondary">Started at: {new Date(session.startTime).toLocaleTimeString()}</Typography>
                                </Box>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={() => handleEndSession(session.id)}
                                >
                                    Stop Charging
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        );
    }

    return (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                        <TableCell>Session ID</TableCell>
                        <TableCell>Station</TableCell>
                        <TableCell>Energy (kWh)</TableCell>
                        <TableCell>Cost</TableCell>
                        <TableCell>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sessions.map((session) => (
                        <TableRow key={session.id}>
                            <TableCell>#{session.id}</TableCell>
                            <TableCell>{session.stationId}</TableCell>
                            <TableCell>{session.energyUsed.toFixed(2)}</TableCell>
                            <TableCell>₹{session.cost.toFixed(2)}</TableCell>
                            <TableCell>{new Date(session.startTime).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SessionList;
