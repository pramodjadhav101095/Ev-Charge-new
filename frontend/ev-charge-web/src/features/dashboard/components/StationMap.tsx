import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import {
    Box, Typography, Chip, Button, Paper, CircularProgress,
    Divider, Tooltip, Stack, Alert
} from '@mui/material';
import EvStationIcon from '@mui/icons-material/EvStation';
import BoltIcon from '@mui/icons-material/Bolt';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { calculateDistances, DistanceMatrixResults } from '../../../services/distanceMatrix';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateBookingDetails } from '../../../store/slices/bookingsSlice';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Station {
    id: number;
    name: string;
    location: string;
    lat: number;
    lng: number;
    status: 'AVAILABLE' | 'OCCUPIED';
    chargers: number;
    price: string;
}

// ─── Dummy Data ────────────────────────────────────────────────────────────────
const DUMMY_STATIONS: Station[] = [
    { id: 1, name: 'Tech Park Station A',    location: 'Whitefield, Bangalore',    lat: 12.9716, lng: 77.7480, status: 'AVAILABLE', chargers: 4, price: '₹12/kWh' },
    { id: 2, name: 'City Mall Charger',       location: 'MG Road, Bangalore',       lat: 12.9757, lng: 77.6011, status: 'OCCUPIED',   chargers: 2, price: '₹14/kWh' },
    { id: 3, name: 'Highway Stop 42',         location: 'Electronic City',          lat: 12.8399, lng: 77.6770, status: 'AVAILABLE', chargers: 6, price: '₹10/kWh' },
    { id: 4, name: 'Koramangala EV Hub',      location: 'Koramangala, Bangalore',   lat: 12.9352, lng: 77.6244, status: 'AVAILABLE', chargers: 3, price: '₹13/kWh' },
    { id: 5, name: 'Indiranagar Charge Pt.', location: 'Indiranagar, Bangalore',   lat: 12.9719, lng: 77.6412, status: 'OCCUPIED',   chargers: 2, price: '₹15/kWh' },
];

const BANGALORE_CENTER = { lat: 12.9279, lng: 77.6271 };

const getStationCoords = (station: any) => {
    if (!station) return BANGALORE_CENTER;
    const lat = station.latitude !== undefined ? Number(station.latitude) : Number(station.lat);
    const lng = station.longitude !== undefined ? Number(station.longitude) : Number(station.lng);
    if (isNaN(lat) || isNaN(lng)) return BANGALORE_CENTER;
    return { lat, lng };
};

const LIBRARIES: ('places' | 'geometry')[] = ['places', 'geometry'];
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// ─── Custom SVG Marker Paths ───────────────────────────────────────────────────
const makeMarkerIcon = (color: string): google.maps.Symbol => ({
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' as string,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#FFFFFF',
    strokeWeight: 2,
    scale: 2.2,
    anchor: new google.maps.Point(12, 22),
});

// ─── Map Styles (subtle dark tint) ─────────────────────────────────────────────
const MAP_STYLES: google.maps.MapTypeStyle[] = [
    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
];

// ─── Station Row in sidebar ────────────────────────────────────────────────────
interface StationRowProps {
    station: Station;
    distance?: DistanceMatrixResults[string];
    selected: boolean;
    onClick: () => void;
}
const StationRow: React.FC<StationRowProps> = ({ station, distance, selected, onClick }) => (
    <Box
        onClick={onClick}
        sx={{
            p: 1.5,
            cursor: 'pointer',
            borderRadius: 1.5,
            border: '1.5px solid',
            borderColor: selected ? 'primary.main' : 'divider',
            bgcolor: selected ? 'primary.50' : 'background.paper',
            transition: 'all 0.18s ease',
            '&:hover': { borderColor: 'primary.light', bgcolor: 'action.hover' },
        }}
    >
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1} flex={1} minWidth={0}>
                <EvStationIcon
                    fontSize="small"
                    sx={{ color: station.status === 'AVAILABLE' ? '#4CAF50' : '#F44336', flexShrink: 0 }}
                />
                <Box minWidth={0}>
                    <Typography variant="body2" fontWeight="bold" noWrap>{station.name}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap display="block">
                        {station.location}
                    </Typography>
                </Box>
            </Box>
            <Chip
                label={station.status === 'AVAILABLE' ? 'Open' : 'Full'}
                size="small"
                color={station.status === 'AVAILABLE' ? 'success' : 'error'}
                sx={{ fontSize: '10px', height: 18, ml: 0.5, flexShrink: 0 }}
            />
        </Box>

        <Box display="flex" gap={2} mt={1} flexWrap="wrap">
            <Box display="flex" alignItems="center" gap={0.4}>
                <DirectionsCarIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                    {distance ? distance.distance : '—'}
                </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.4}>
                <AccessTimeIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                    {distance ? distance.duration : '—'}
                </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.4}>
                <BoltIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                    {station.chargers} chargers · {station.price}
                </Typography>
            </Box>
        </Box>
    </Box>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const StationMap: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'ev-charge-google-map',
        googleMapsApiKey: API_KEY,
        libraries: LIBRARIES,
    });

    const mapRef = useRef<google.maps.Map | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationDenied, setLocationDenied] = useState(false);
    const [distances, setDistances] = useState<DistanceMatrixResults>({});
    const [loadingDistances, setLoadingDistances] = useState(false);
    const [selectedStation, setSelectedStation] = useState<Station | null>(null);
    const [sortedStations, setSortedStations] = useState<Station[]>(DUMMY_STATIONS);

    // Request user's geolocation
    useEffect(() => {
        if (!navigator.geolocation) { setLocationDenied(true); return; }
        navigator.geolocation.getCurrentPosition(
            pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => setLocationDenied(true),
            { enableHighAccuracy: true, timeout: 8000 }
        );
    }, []);

    // Calculate distances when user location + map are both ready
    useEffect(() => {
        if (!userLocation) return;
        setLoadingDistances(true);
        calculateDistances(
            userLocation.lat,
            userLocation.lng,
            DUMMY_STATIONS.map(s => ({ id: s.id, lat: s.lat, lng: s.lng }))
        ).then(results => {
            setDistances(results);
            // Sort stations by driving distance
            const sorted = [...DUMMY_STATIONS].sort(
                (a, b) =>
                    (results[a.id]?.distanceValue ?? Infinity) -
                    (results[b.id]?.distanceValue ?? Infinity)
            );
            setSortedStations(sorted);
            setLoadingDistances(false);
        });
    }, [userLocation]);

    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    const handleMarkerClick = (station: Station) => {
        setSelectedStation(prev => (prev?.id === station.id ? null : station));
        mapRef.current?.panTo(getStationCoords(station));
    };

    const handleRecenter = () => {
        if (userLocation && mapRef.current) {
            mapRef.current.panTo(userLocation);
            mapRef.current.setZoom(13);
        }
    };

    // ── Loading state ──
    if (!isLoaded) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" height={420} gap={2}>
                <CircularProgress size={28} />
                <Typography color="text.secondary">Loading Google Maps…</Typography>
            </Box>
        );
    }

    // ── API Key error state ──
    if (loadError) {
        return (
            <Alert severity="warning" sx={{ m: 1 }}>
                Google Maps could not load ({loadError.message}). Please check your API key.
            </Alert>
        );
    }

    const mapCenter = userLocation || BANGALORE_CENTER;

    return (
        <Box display="flex" gap={0} sx={{ height: 460, borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>

            {/* ── LEFT: Google Map ── */}
            <Box flex={1} position="relative">
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={mapCenter}
                    zoom={12}
                    options={{
                        styles: MAP_STYLES,
                        disableDefaultUI: false,
                        zoomControl: true,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: true,
                    }}
                    onLoad={onMapLoad}
                >
                    {/* User location marker (blue pulse) */}
                    {userLocation && (
                        <Marker
                            position={userLocation}
                            icon={{
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 10,
                                fillColor: '#1976D2',
                                fillOpacity: 1,
                                strokeColor: '#FFFFFF',
                                strokeWeight: 3,
                            }}
                            title="You are here"
                            zIndex={1000}
                        />
                    )}

                    {/* EV Station markers */}
                    {DUMMY_STATIONS.map((station, idx) => {
                        const isSelected = selectedStation?.id === station.id;
                        return (
                            <Marker
                                key={`${station.id}-${idx}`}
                                position={getStationCoords(station)}
                                icon={makeMarkerIcon(
                                    isSelected
                                        ? '#FF9800'
                                        : station.status === 'AVAILABLE'
                                        ? '#4CAF50'
                                        : '#F44336'
                                )}
                                onClick={() => handleMarkerClick(station)}
                                title={station.name}
                            >
                                {isSelected && (
                                    <InfoWindow
                                        onCloseClick={() => setSelectedStation(null)}
                                        options={{ pixelOffset: new google.maps.Size(0, -44) }}
                                    >
                                        <Box sx={{ minWidth: 200, maxWidth: 240, p: 0.5 }}>
                                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                {selectedStation.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                                                {selectedStation.location}
                                            </Typography>

                                            <Box display="flex" gap={1} mb={1} flexWrap="wrap">
                                                <Chip
                                                    label={selectedStation.status}
                                                    size="small"
                                                    color={selectedStation.status === 'AVAILABLE' ? 'success' : 'error'}
                                                    sx={{ fontSize: '10px', height: 20 }}
                                                />
                                                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                                    <BoltIcon sx={{ fontSize: 12 }} /> {selectedStation.chargers} chargers
                                                </Typography>
                                            </Box>

                                            {/* Distance info */}
                                            {distances[selectedStation.id] && (
                                                <Box
                                                    display="flex"
                                                    gap={1.5}
                                                    mb={1}
                                                    p={0.75}
                                                    sx={{ bgcolor: '#f5f5f5', borderRadius: 1 }}
                                                >
                                                    <Box display="flex" alignItems="center" gap={0.4}>
                                                        <DirectionsCarIcon sx={{ fontSize: 14, color: '#1976D2' }} />
                                                        <Typography variant="caption" fontWeight="bold">
                                                            {distances[selectedStation.id].distance}
                                                        </Typography>
                                                    </Box>
                                                    <Box display="flex" alignItems="center" gap={0.4}>
                                                        <AccessTimeIcon sx={{ fontSize: 14, color: '#1976D2' }} />
                                                        <Typography variant="caption" fontWeight="bold">
                                                            {distances[selectedStation.id].duration}
                                                        </Typography>
                                                    </Box>
                                                    {distances[selectedStation.id].isMock && (
                                                        <Tooltip title="Estimated (enable Distance Matrix API for exact values)">
                                                            <Typography variant="caption" color="text.secondary">~est.</Typography>
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            )}

                                            <Typography variant="caption" fontWeight="bold" display="block" mb={1}>
                                                {selectedStation.price}
                                            </Typography>

                                            <Button
                                                variant="contained"
                                                size="small"
                                                fullWidth
                                                disabled={selectedStation.status !== 'AVAILABLE'}
                                                onClick={() => {
                                                    dispatch(updateBookingDetails({ stationId: selectedStation.id, step: 0 }));
                                                    navigate('/bookings');
                                                }}
                                                sx={{ textTransform: 'none', fontSize: '12px' }}
                                            >
                                                {selectedStation.status === 'AVAILABLE' ? '⚡ Book Now' : 'Currently Occupied'}
                                            </Button>
                                        </Box>
                                    </InfoWindow>
                                )}
                            </Marker>
                        );
                    })}
                </GoogleMap>

                {/* Re-center button */}
                {userLocation && (
                    <Tooltip title="Re-center on my location">
                        <Paper
                            elevation={3}
                            onClick={handleRecenter}
                            sx={{
                                position: 'absolute',
                                bottom: 80,
                                right: 12,
                                zIndex: 10,
                                p: 0.8,
                                borderRadius: 2,
                                cursor: 'pointer',
                                bgcolor: 'white',
                                '&:hover': { bgcolor: '#f0f4ff' },
                            }}
                        >
                            <MyLocationIcon sx={{ color: '#1976D2', display: 'block', fontSize: 22 }} />
                        </Paper>
                    </Tooltip>
                )}

                {/* Legend */}
                <Paper
                    elevation={2}
                    sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        zIndex: 10,
                        px: 1.5,
                        py: 1,
                        borderRadius: 2,
                        bgcolor: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(6px)',
                    }}
                >
                    {[
                        { color: '#4CAF50', label: 'Available' },
                        { color: '#F44336', label: 'Occupied' },
                        { color: '#FF9800', label: 'Selected' },
                        { color: '#1976D2', label: 'You' },
                    ].map(({ color, label }) => (
                        <Box key={label} display="flex" alignItems="center" gap={0.8} mb={0.3}>
                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
                            <Typography variant="caption">{label}</Typography>
                        </Box>
                    ))}
                </Paper>
            </Box>

            {/* ── RIGHT: Station list sidebar ── */}
            <Box
                sx={{
                    width: 260,
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.default',
                }}
            >
                {/* Header */}
                <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'primary.main', color: 'white' }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                        Nearby Stations
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.85 }}>
                        {locationDenied
                            ? 'Enable location for distances'
                            : loadingDistances
                            ? 'Calculating distances…'
                            : `Sorted by distance from you`}
                    </Typography>
                </Box>

                {/* Station list */}
                <Box sx={{ flex: 1, overflowY: 'auto', p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {sortedStations.map((station, idx) => (
                        <StationRow
                            key={`${station.id}-${idx}`}
                            station={station}
                            distance={distances[station.id]}
                            selected={selectedStation?.id === station.id}
                            onClick={() => handleMarkerClick(station)}
                        />
                    ))}
                </Box>

                {/* Footer stat bar */}
                <Divider />
                <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-around' }}>
                    <Box textAlign="center">
                        <Typography variant="h6" fontWeight="bold" color="success.main" lineHeight={1}>
                            {DUMMY_STATIONS.filter(s => s.status === 'AVAILABLE').length}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">Available</Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box textAlign="center">
                        <Typography variant="h6" fontWeight="bold" color="error.main" lineHeight={1}>
                            {DUMMY_STATIONS.filter(s => s.status === 'OCCUPIED').length}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">Occupied</Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box textAlign="center">
                        <Typography variant="h6" fontWeight="bold" color="primary.main" lineHeight={1}>
                            {DUMMY_STATIONS.reduce((s, st) => s + st.chargers, 0)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">Chargers</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default StationMap;
