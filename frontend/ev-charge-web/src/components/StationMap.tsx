import React, { useMemo, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setSelectedStation } from '../features/stations/stationsSlice';

const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

const defaultCenter = {
    lat: 18.5204, // Default to Pune
    lng: 73.8567,
};

const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
};

const StationMap: React.FC = () => {
    const dispatch = useDispatch();
    const { items, selectedStation, filters } = useSelector((state: RootState) => state.stations);

    const center = useMemo(() => {
        if (filters.lat && filters.lng) {
            return { lat: filters.lat, lng: filters.lng };
        }
        return defaultCenter;
    }, [filters.lat, filters.lng]);

    const onMarkerClick = useCallback((station: any) => {
        dispatch(setSelectedStation(station));
    }, [dispatch]);

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={13}
            center={center}
            options={mapOptions}
        >
            {items.map((station) => (
                <Marker
                    key={station.id}
                    position={{ lat: station.latitude, lng: station.longitude }}
                    onClick={() => onMarkerClick(station)}
                    icon={{
                        url: station.status === 'AVAILABLE'
                            ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                            : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                    }}
                />
            ))}

            {selectedStation && (
                <InfoWindow
                    position={{ lat: selectedStation.latitude, lng: selectedStation.longitude }}
                    onCloseClick={() => dispatch(setSelectedStation(null))}
                >
                    <div style={{ color: 'black' }}>
                        <h3>{selectedStation.name}</h3>
                        <p>{selectedStation.address}</p>
                        <p>Status: <strong>{selectedStation.status}</strong></p>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
};

export default StationMap;
