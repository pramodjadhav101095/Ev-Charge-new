import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, Typography,
    Box, Chip, Button, Grid, Divider, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BoltIcon from '@mui/icons-material/Bolt';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setSelectedStation } from './stationsSlice';

const StationDetailsModal: React.FC = () => {
    const dispatch = useDispatch();
    const { selectedStation } = useSelector((state: RootState) => state.stations);

    const handleClose = () => {
        dispatch(setSelectedStation(null));
    };

    if (!selectedStation) return null;

    return (
        <Dialog open={!!selectedStation} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" fontWeight="bold">{selectedStation.name}</Typography>
                    <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    {selectedStation.address}
                </Typography>

                <Box sx={{ my: 2, display: 'flex', gap: 1 }}>
                    <Chip label={selectedStation.status} color={selectedStation.status === 'AVAILABLE' ? 'success' : 'error'} />
                    <Chip label={selectedStation.type || 'Fast Charging'} variant="outlined" />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <BoltIcon sx={{ color: '#4caf50', mr: 1 }} />
                            <Typography variant="subtitle2">Power Output</Typography>
                        </Box>
                        <Typography variant="body2">50 kW - Level 2 DC</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CurrencyRupeeIcon sx={{ color: '#2196f3', mr: 1 }} />
                            <Typography variant="subtitle2">Pricing</Typography>
                        </Box>
                        <Typography variant="body2">₹12.50 / kWh</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AccessTimeIcon sx={{ color: '#ff9800', mr: 1 }} />
                            <Typography variant="subtitle2">Availability</Typography>
                        </Box>
                        <Typography variant="body2">24 / 7 Open</Typography>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Connectors</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip label="CCS2" size="small" />
                        <Chip label="Type 2" size="small" />
                        <Chip label="CHAdeMO" size="small" />
                    </Box>
                </Box>
            </DialogContent>
            <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
                <Button fullWidth variant="outlined" onClick={handleClose}>Close</Button>
                <Button fullWidth variant="contained" color="success">Book Slot</Button>
            </Box>
        </Dialog>
    );
};

export default StationDetailsModal;
