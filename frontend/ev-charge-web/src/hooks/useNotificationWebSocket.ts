import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { addNotification } from '../store/slices/notificationsSlice';
import { toast } from 'react-toastify';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8088/ws-notifications';

export const useNotificationWebSocket = (userId: number | undefined) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!userId) return;

        const socket: Socket = io(WS_URL, {
            query: { userId },
            transports: ['websocket'],
        });

        socket.on('connect', () => {
            console.log('Connected to Notification WebSocket');
        });

        socket.on('new_notification', (data) => {
            dispatch(addNotification(data));

            // Show real-time toast based on type
            const toastOptions = { position: 'top-right' as const };
            switch (data.type) {
                case 'SUCCESS': toast.success(data.message, toastOptions); break;
                case 'WARNING': toast.warn(data.message, toastOptions); break;
                case 'ERROR': toast.error(data.message, toastOptions); break;
                default: toast.info(data.message, toastOptions); break;
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [userId, dispatch]);
};
