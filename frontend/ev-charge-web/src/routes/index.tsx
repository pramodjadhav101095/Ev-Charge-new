import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PrivateRoute from '../components/PrivateRoute';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';

// Lazy loading components
const Dashboard = lazy(() => import('../features/dashboard/Dashboard'));
const Stations = lazy(() => import('../features/stations/Stations'));
const Bookings = lazy(() => import('../features/bookings/Bookings'));
const BookingForm = lazy(() => import('../features/bookings/BookingForm'));
const Payments = lazy(() => import('../features/payments/Payments'));
const Profile = lazy(() => import('../features/profile/Profile'));
const Admin = lazy(() => import('../features/admin/Admin'));
const Notifications = lazy(() => import('../features/notifications/Notifications'));
const Help = lazy(() => import('../features/help/Help')); // Assuming Help component exists

const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<PrivateRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <Dashboard />
                            </Suspense>
                        } />
                        <Route path="/stations" element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <Stations />
                            </Suspense>
                        } />
                        <Route path="/bookings" element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <Bookings />
                            </Suspense>
                        } />
                        <Route path="/bookings/new" element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <BookingForm />
                            </Suspense>
                        } />
                        <Route path="/payments" element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <Payments />
                            </Suspense>
                        } />
                        <Route path="/profile" element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <Profile />
                            </Suspense>
                        } />
                        <Route path="/admin" element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <Admin />
                            </Suspense>
                        } />
                        <Route path="/notifications" element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <Notifications />
                            </Suspense>
                        } />
                        <Route path="/help" element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <Help />
                            </Suspense>
                        } />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
