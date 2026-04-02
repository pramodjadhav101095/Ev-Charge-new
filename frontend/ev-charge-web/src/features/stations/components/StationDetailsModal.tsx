import React from 'react';
import { Modal, Box, Typography, IconButton, Grid, Divider, Button, Chip, Rating } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EvStationIcon from '@mui/icons-material/EvStation';
import BoltIcon from '@mui/icons-material/Bolt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CallIcon from '@mui/icons-material/Call';
import DirectionsIcon from '@mui/icons-material/Directions';

interface StationDetailsModalProps {
    station: any | null;
    open: boolean;
    onClose: () => void;
    onBookSlot: (station: any) => void;
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', md: 600 },
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 0,
    outline: 'none',
    overflow: 'hidden'
};

const StationDetailsModal: React.FC<StationDetailsModalProps> = ({ station, open, onClose, onBookSlot }) => {
    if (!station) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">{station.name}</Typography>
                    <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ bgcolor: 'grey.100', height: 200, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <EvStationIcon sx={{ fontSize: 80, color: 'grey.400' }} />
                                {/* Image placeholder */}
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box mb={2}>
                                <Chip
                                    label={station.status}
                                    color={station.status === 'AVAILABLE' ? 'success' : 'error'}
                                    sx={{ mb: 1 }}
                                />
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{station.name}</Typography>
                                <Rating value={4.5} readOnly size="small" />
                            </Box>

                            <Box display="flex" alignItems="flex-start" mb={1}>
                                <LocationOnIcon color="action" sx={{ mr: 1, mt: 0.5 }} />
                                <Typography variant="body2">{station.address}</Typography>
                            </Box>

                            <Box display="flex" alignItems="center" mb={2}>
                                <BoltIcon color="warning" sx={{ mr: 1 }} />
                                <Typography variant="body2"><strong>{station.type || 'DC Fast'}</strong> (60kW)</Typography>
                            </Box>

                            <Box display="flex" gap={1}>
                                <Button variant="outlined" startIcon={<DirectionsIcon />} fullWidth size="small">Directions</Button>
                                <Button variant="outlined" startIcon={<CallIcon />} fullWidth size="small">Call</Button>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Amenities</Typography>
                    <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
                        <Chip label="Wifi" size="small" variant="outlined" />
                        <Chip label="Cafe" size="small" variant="outlined" />
                        <Chip label="Parking" size="small" variant="outlined" />
                        <Chip label="CCTV" size="small" variant="outlined" />
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="caption" color="text.secondary">Estimated Cost</Typography>
                            <Typography variant="h6" color="primary">₹15.00 / kWh</Typography>
                        </Box>
                        <Button
                            variant="contained"
                            size="large"
                            disabled={station.status !== 'AVAILABLE'}
                            onClick={() => onBookSlot(station)}
                            sx={{ px: 5 }}
                        >
                            Book Slot
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default StationDetailsModal;
