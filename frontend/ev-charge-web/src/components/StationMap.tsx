import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setSelectedStation } from '../store/slices/stationsSlice';
import { useNavigate } from 'react-router-dom';
import { updateBookingDetails } from '../store/slices/bookingsSlice';
import {
    Box, Typography, Chip, Button, Paper, CircularProgress,
    Alert, Tooltip
} from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { calculateDistances, DistanceMatrixResults } from '../services/distanceMatrix';

const LIBRARIES: ('places' | 'geometry')[] = ['places', 'geometry'];
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const BANGALORE_CENTER = { lat: 12.9279, lng: 77.6271 };

const getStationCoords = (station: any) => {
    if (!station) return BANGALORE_CENTER;
    const lat = station.latitude !== undefined ? Number(station.latitude) : Number(station.lat);
    const lng = station.longitude !== undefined ? Number(station.longitude) : Number(station.lng);
    if (isNaN(lat) || isNaN(lng)) return BANGALORE_CENTER;
    return { lat, lng };
};

const MAP_STYLES: google.maps.MapTypeStyle[] = [
    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
];

const makeMarkerIcon = (color: string): google.maps.Symbol => ({
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' as string,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#FFFFFF',
    strokeWeight: 2,
    scale: 2.2,
    anchor: new google.maps.Point(12, 22),
});

const DEFAULT_STATIONS = [
    { id: 1, name: 'Tech Park Station A',    address: 'Whitefield, Bangalore',   latitude: 12.9716, longitude: 77.7480, status: 'AVAILABLE', chargerCount: 4, pricePerUnit: 12 },
    { id: 2, name: 'City Mall Charger',       address: 'MG Road, Bangalore',      latitude: 12.9757, longitude: 77.6011, status: 'OCCUPIED',   chargerCount: 2, pricePerUnit: 14 },
    { id: 3, name: 'Highway Stop 42',         address: 'Electronic City',         latitude: 12.8399, longitude: 77.6770, status: 'AVAILABLE', chargerCount: 6, pricePerUnit: 10 },
    { id: 4, name: 'Koramangala EV Hub',      address: 'Koramangala, Bangalore',  latitude: 12.9352, longitude: 77.6244, status: 'AVAILABLE', chargerCount: 3, pricePerUnit: 13 },
    { id: 5, name: 'Indiranagar Charge Pt.', address: 'Indiranagar, Bangalore',  latitude: 12.9719, longitude: 77.6412, status: 'OCCUPIED',   chargerCount: 2, pricePerUnit: 15 },
];

const StationMap: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, selectedStation, filters } = useSelector(
        (state: RootState) => state.stations
    );

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'ev-charge-google-map',
        googleMapsApiKey: API_KEY,
        libraries: LIBRARIES,
    });

    const mapRef = useRef<google.maps.Map | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [distances, setDistances] = useState<DistanceMatrixResults>({});

    const displayStations = items?.length > 0 ? items : DEFAULT_STATIONS;

    // Geolocation
    useEffect(() => {
        navigator.geolocation?.getCurrentPosition(
            pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => {},
            { enableHighAccuracy: true, timeout: 8000 }
        );
    }, []);

    // Distance Matrix
    useEffect(() => {
        if (!userLocation) return;
        calculateDistances(
            userLocation.lat,
            userLocation.lng,
            displayStations.map((s: any) => ({ id: s.id, ...getStationCoords(s) }))
        ).then(setDistances);
    }, [userLocation, displayStations]);

    // Pan when filter location changes
    useEffect(() => {
        if (filters?.lat && filters?.lng && mapRef.current) {
            mapRef.current.panTo({ lat: filters.lat, lng: filters.lng });
            mapRef.current.setZoom(14);
        }
    }, [filters?.lat, filters?.lng]);

    // Pan to selected station
    useEffect(() => {
        if (selectedStation && mapRef.current) {
            mapRef.current.panTo(getStationCoords(selectedStation));
        }
    }, [selectedStation]);

    const onMapLoad = useCallback((map: google.maps.Map) => { mapRef.current = map; }, []);

    const handleRecenter = () => {
        if (userLocation && mapRef.current) {
            mapRef.current.panTo(userLocation);
            mapRef.current.setZoom(13);
        }
    };

    if (!isLoaded) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" height="100%" gap={2}>
                <CircularProgress size={28} />
                <Typography color="text.secondary">Loading Google Maps…</Typography>
            </Box>
        );
    }

    if (loadError) {
        return <Alert severity="warning">Google Maps failed to load. Check your API key.</Alert>;
    }

    const mapCenter =
        filters?.lat && filters?.lng
            ? { lat: filters.lat, lng: filters.lng }
            : userLocation || BANGALORE_CENTER;

    return (
        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={mapCenter}
                zoom={12}
                options={{
                    styles: MAP_STYLES,
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                }}
                onLoad={onMapLoad}
            >
                {/* User location */}
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

                {/* Station markers */}
                {displayStations.map((station: any, idx: number) => {
                    const isSelected = selectedStation?.id === station.id;
                    return (
                        <Marker
                            key={`${station.id}-${idx}`}
                            position={getStationCoords(station)}
                            icon={makeMarkerIcon(
                                isSelected
                                    ? '#FF9800'
                                    : station.status === 'AVAILABLE' ? '#4CAF50' : '#F44336'
                            )}
                            onClick={() => dispatch(setSelectedStation(station))}
                            title={station.name}
                        >
                            {isSelected && (
                                <InfoWindow
                                    onCloseClick={() => dispatch(setSelectedStation(null))}
                                    options={{ pixelOffset: new google.maps.Size(0, -44) }}
                                >
                                    <Box sx={{ minWidth: 200, p: 0.5 }}>
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                            {selectedStation.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                                            {selectedStation.address}
                                        </Typography>

                                        <Box display="flex" gap={1} mb={1} alignItems="center">
                                            <Chip
                                                label={selectedStation.status}
                                                size="small"
                                                color={selectedStation.status === 'AVAILABLE' ? 'success' : 'error'}
                                                sx={{ fontSize: '10px', height: 20 }}
                                            />
                                            <Typography variant="caption">
                                                <BoltIcon sx={{ fontSize: 12 }} /> {selectedStation.chargerCount} chargers
                                            </Typography>
                                        </Box>

                                        {distances[selectedStation.id] && (
                                            <Box display="flex" gap={2} mb={1} p={0.75}
                                                sx={{ bgcolor: '#f5f5f5', borderRadius: 1 }}>
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
                                                        <Typography variant="caption" color="text.disabled">~est.</Typography>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        )}

                                        {selectedStation.pricePerUnit && (
                                            <Typography variant="caption" fontWeight="bold" display="block" mb={1}>
                                                ₹{selectedStation.pricePerUnit}/kWh
                                            </Typography>
                                        )}

                                        <Button
                                            variant="contained"
                                            size="small"
                                            fullWidth
                                            disabled={selectedStation.status !== 'AVAILABLE'}
                                            onClick={() => {
                                                dispatch(updateBookingDetails({ stationId: selectedStation.id, step: 0 }));
                                                dispatch(setSelectedStation(null));
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

            {/* Re-center */}
            {userLocation && (
                <Tooltip title="Re-center on my location">
                    <Paper
                        elevation={3}
                        onClick={handleRecenter}
                        sx={{
                            position: 'absolute', bottom: 80, right: 12, zIndex: 10,
                            p: 0.8, borderRadius: 2, cursor: 'pointer', bgcolor: 'white',
                            '&:hover': { bgcolor: '#f0f4ff' },
                        }}
                    >
                        <MyLocationIcon sx={{ color: '#1976D2', display: 'block', fontSize: 22 }} />
                    </Paper>
                </Tooltip>
            )}

            {/* Legend */}
            <Paper elevation={2} sx={{
                position: 'absolute', bottom: 12, left: 12, zIndex: 10,
                px: 1.5, py: 1, borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(6px)',
            }}>
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
    );
};

export default StationMap;
