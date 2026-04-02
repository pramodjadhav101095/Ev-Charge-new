import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Box, Typography, Button, Paper, Chip } from '@mui/material';

const containerStyle = {
    width: '100%',
    height: '100%'
};

interface StationMapProps {
    stations: any[];
    center: { lat: number, lng: number } | null;
    onStationSelect?: (station: any) => void;
}

const StationMap: React.FC<StationMapProps> = ({ stations, center, onStationSelect }) => {
    const [selectedMarker, setSelectedMarker] = useState<any>(null);

    const mapCenter = center || { lat: 18.5204, lng: 73.8567 }; // Default to Pune

    const getMarkerIcon = (status: string) => {
        const color = status === 'AVAILABLE' ? '#4CAF50' : '#F44336';
        return {
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: color,
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#FFFFFF',
            scale: 2,
            anchor: center ? new google.maps.Point(12, 22) : undefined
        };
    };

    return (
        <Box sx={{ height: 'calc(100vh - 200px)', width: '100%', borderRadius: 2, overflow: 'hidden' }}>
            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={mapCenter}
                    zoom={13}
                >
                    {stations.map((station) => (
                        <Marker
                            key={station.id}
                            position={{ lat: station.latitude, lng: station.longitude }}
                            onClick={() => setSelectedMarker(station)}
                            icon={getMarkerIcon(station.status)}
                        />
                    ))}

                    {selectedMarker && (
                        <InfoWindow
                            position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
                            onCloseClick={() => setSelectedMarker(null)}
                        >
                            <Paper sx={{ p: 1, maxWidth: 200, boxShadow: 'none' }}>
                                <Typography variant="subtitle2">{selectedMarker.name}</Typography>
                                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                                    {selectedMarker.address}
                                </Typography>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Chip
                                        label={selectedMarker.status}
                                        size="small"
                                        color={selectedMarker.status === 'AVAILABLE' ? 'success' : 'error'}
                                    />
                                    <Button
                                        size="small"
                                        onClick={() => onStationSelect?.(selectedMarker)}
                                    >
                                        Details
                                    </Button>
                                </Box>
                            </Paper>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
        </Box>
    );
};

export default StationMap;
