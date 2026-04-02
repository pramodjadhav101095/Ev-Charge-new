import React from 'react';
import { Card, CardContent, CardActions, Button, Typography, Box, Chip, Rating, IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BoltIcon from '@mui/icons-material/Bolt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface StationCardProps {
    station: any;
    onViewDetails: (station: any) => void;
    onBookSlot: (station: any) => void;
}

const StationCard: React.FC<StationCardProps> = ({ station, onViewDetails, onBookSlot }) => {
    const isAvailable = station.status === 'AVAILABLE';

    return (
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
        }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        {station.name}
                    </Typography>
                    <IconButton size="small">
                        <FavoriteBorderIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Box display="flex" alignItems="center" color="text.secondary" mb={1}>
                    <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">{station.address}</Typography>
                </Box>

                <Box display="flex" gap={1} mb={2}>
                    <Chip
                        label={station.status}
                        color={isAvailable ? 'success' : 'error'}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                    />
                    <Chip
                        icon={<BoltIcon />}
                        label={station.type || 'AC Type 2'}
                        variant="outlined"
                        size="small"
                    />
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto">
                    <Box>
                        <Rating value={4.5} precision={0.5} size="small" readOnly />
                        <Typography variant="caption" display="block">
                            (120 reviews)
                        </Typography>
                    </Box>
                    <Box textAlign="right">
                        <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 'bold' }}>
                            {station.distance ? `${station.distance.toFixed(1)} km` : '2.4 km'}
                        </Typography>
                        <Box display="flex" alignItems="center" justifyContent="flex-end">
                            <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                                {isAvailable ? 'Immediate' : '15 min wait'}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                <Button size="small" onClick={() => onViewDetails(station)}>
                    View Details
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    disabled={!isAvailable}
                    onClick={() => onBookSlot(station)}
                    sx={{ px: 3 }}
                >
                    Book Slot
                </Button>
            </CardActions>
        </Card>
    );
};

export default StationCard;
