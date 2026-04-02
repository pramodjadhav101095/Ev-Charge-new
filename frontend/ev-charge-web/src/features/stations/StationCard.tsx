import React from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BoltIcon from '@mui/icons-material/Bolt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toggleBookmarkState, setSelectedStation } from '../../store/slices/stationsSlice';
import { toggleBookmark } from '../../api/stationApi';

interface StationCardProps {
    station: any;
}

const StationCard: React.FC<StationCardProps> = ({ station }) => {
    const dispatch = useDispatch();
    const { bookmarkedIds } = useSelector((state: RootState) => state.stations);
    const isBookmarked = bookmarkedIds.includes(station.id);

    const handleBookmark = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await toggleBookmark(station.id);
            dispatch(toggleBookmarkState(station.id));
        } catch (err) {
            console.error('Failed to toggle bookmark', err);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'AVAILABLE': return 'success';
            case 'CHARGING': return 'warning';
            case 'OFFLINE': return 'error';
            default: return 'default';
        }
    };

    return (
        <Card
            sx={{ mb: 2, cursor: 'pointer', '&:hover': { boxShadow: 6 }, borderRadius: 2 }}
            onClick={() => dispatch(setSelectedStation(station))}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" fontWeight="bold" noWrap sx={{ maxWidth: '80%' }}>
                        {station.name}
                    </Typography>
                    <IconButton size="small" onClick={handleBookmark}>
                        {isBookmarked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {station.address}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Chip
                        size="small"
                        label={station.status}
                        color={getStatusColor(station.status) as any}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                        <BoltIcon sx={{ fontSize: 16, color: '#4caf50' }} />
                        <Typography variant="body2" fontWeight="medium">
                            {station.type || 'Fast'}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" fontWeight="bold">
                        {station.distance ? `${station.distance.toFixed(1)} km` : 'Near me'}
                    </Typography>
                    <Button
                        variant="contained"
                        size="small"
                        disabled={station.status !== 'AVAILABLE'}
                        sx={{ borderRadius: 1.5 }}
                    >
                        Book Now
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default StationCard;
