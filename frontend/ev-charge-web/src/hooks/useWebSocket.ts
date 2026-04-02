import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { updateStationStatus } from '../store/slices/stationsSlice';

export const useWebSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        // notification-service websocket endpoint
        const socketUrl = import.meta.env.VITE_WS_URL || 'http://localhost:8088';
        socketRef.current = io(socketUrl);

        socketRef.current.on('connect', () => {
            console.log('Connected to WebSocket');
        });

        socketRef.current.on('station_status_update', (data) => {
            // data expected: { id: number, status: string }
            dispatch(updateStationStatus(data));
        });

        socketRef.current.on('disconnect', () => {
            console.log('Disconnected from WebSocket');
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [dispatch]);

    return socketRef.current;
};
