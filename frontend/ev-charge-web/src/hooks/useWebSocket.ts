import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { updateStationStatus } from '../store/slices/stationsSlice';

export const useWebSocket = () => {
    return null;
};
