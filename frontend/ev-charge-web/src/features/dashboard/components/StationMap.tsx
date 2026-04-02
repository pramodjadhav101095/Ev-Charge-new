import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Box, Typography, Button } from '@mui/material';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const center = {
    lat: 12.9716, // Bangalore coordinates as default
    lng: 77.5946
};

// Dummy stations for visualization
const dummyStations = [
    { id: 1, name: 'Tech Park Station A', lat: 12.9716, lng: 77.5946, status: 'AVAILABLE' },
    { id: 2, name: 'City Mall Charger', lat: 12.9250, lng: 77.6200, status: 'OCCUPIED' },
    { id: 3, name: 'Highway Stop 42', lat: 12.8399, lng: 77.6770, status: 'AVAILABLE' },
];

const StationMap: React.FC = () => {
    const [selectedStation, setSelectedStation] = useState<any>(null);

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={11}
            >
                {dummyStations.map(station => (
                    <Marker
                        key={station.id}
                        position={{ lat: station.lat, lng: station.lng }}
                        onClick={() => setSelectedStation(station)}
                    />
                ))}

                {selectedStation && (
                    <InfoWindow
                        position={{ lat: selectedStation.lat, lng: selectedStation.lng }}
                        onCloseClick={() => setSelectedStation(null)}
                    >
                        <Box p={1}>
                            <Typography variant="subtitle1" fontWeight="bold">{selectedStation.name}</Typography>
                            <Typography variant="body2" color={selectedStation.status === 'AVAILABLE' ? 'success.main' : 'error.main'}>
                                {selectedStation.status}
                            </Typography>
                            <Button size="small" variant="contained" sx={{ mt: 1 }}>Book Now</Button>
                        </Box>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default StationMap;
