import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { addNotification } from '../store/slices/notificationsSlice';
import { toast } from 'react-toastify';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8088/ws-notifications';

export const useNotificationWebSocket = (userId: number | undefined) => {
    // WebSocket disabled
};
