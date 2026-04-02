import React from 'react';
import AppRoutes from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useWebSocket } from './hooks/useWebSocket';

const App: React.FC = () => {
    useWebSocket(); // Initialize WebSocket connection

    return (
        <>
            <AppRoutes />
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
};

export default App;
