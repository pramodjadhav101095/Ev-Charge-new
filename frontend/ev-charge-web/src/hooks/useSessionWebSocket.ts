import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { updateActiveSession } from '../store/slices/sessionsSlice';

const SOCKET_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8086/ws-sessions';

export const useSessionWebSocket = (userId: number | undefined) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!userId) return;

        // In a real Spring Boot app, this might be STOMP over SockJS
        // For this implementation, we assume a Socket.io compatible endpoint or a wrapper
        const socket: Socket = io(SOCKET_URL, {
            query: { userId },
            transports: ['websocket'],
        });

        socket.on('connect', () => {
            console.log('Connected to Session WebSocket');
        });

        socket.on('session_update', (data) => {
            dispatch(updateActiveSession(data));
        });

        socket.on('session_ended', (data) => {
            // Handled via state update or specific event
            dispatch(updateActiveSession(data));
        });

        return () => {
            socket.disconnect();
        };
    }, [userId, dispatch]);
};
