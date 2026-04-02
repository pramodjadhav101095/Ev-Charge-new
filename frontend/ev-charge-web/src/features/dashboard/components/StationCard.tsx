import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Station } from '../../../api/stationApi';
import { EvStation, Timer, DirectionsCar, TwoWheeler } from '@mui/icons-material';

interface StationCardProps {
    station: Station;
    onClick?: () => void;
}

const StationCard = ({ station, onClick }: StationCardProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'AVAILABLE': return 'success';
            case 'OCCUPIED': return 'warning';
            case 'OUT_OF_ORDER': return 'error';
            default: return 'default';
        }
    };

    const isInternal = station.source === 'INTERNAL';

    return (
        <Card
            sx={{
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                border: '1px solid',
                borderColor: 'divider',
                borderLeft: isInternal ? '4px solid #2e7d32' : '4px solid #0288d1',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(46, 125, 50, 0.12)',
                    borderColor: 'primary.light',
                },
            }}
            onClick={onClick}
        >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3, pr: 1 }}>
                        {station.name}
                    </Typography>
                    <Chip
                        size="small"
                        label={isInternal ? '⚡ Own' : '🌍 Public'}
                        sx={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            bgcolor: isInternal ? '#e8f5e9' : '#e3f2fd',
                            color: isInternal ? '#2e7d32' : '#0288d1',
                            border: 'none',
                        }}
                    />
                </Box>

                {/* Address */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '0.8rem' }}>
                    📍 {station.address || 'Address not available'}
                </Typography>

                {/* Distance & Duration */}
                <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                    {station.distance !== undefined && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#f5f5f5', px: 1, py: 0.5, borderRadius: 1 }}>
                            <DirectionsCar sx={{ fontSize: 16, color: '#0288d1' }} />
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>{station.distance.toFixed(1)} km</Typography>
                        </Box>
                    )}
                    {station.duration && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#f5f5f5', px: 1, py: 0.5, borderRadius: 1 }}>
                            <Timer sx={{ fontSize: 16, color: '#ed6c02' }} />
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>{station.duration}</Typography>
                        </Box>
                    )}
                </Box>

                {/* Footer: Vehicle types + Status */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EvStation sx={{ fontSize: 18, color: '#2e7d32' }} />
                        <DirectionsCar sx={{ fontSize: 16, color: '#666' }} />
                        <TwoWheeler sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="caption" color="text.secondary">
                            {station.type === 'GOOGLE_SOURCE' ? 'Public Charger' : station.type || 'Standard'}
                        </Typography>
                    </Box>
                    {isInternal && (
                        <Chip
                            label={station.status}
                            size="small"
                            color={getStatusColor(station.status) as any}
                            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                        />
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default StationCard;
