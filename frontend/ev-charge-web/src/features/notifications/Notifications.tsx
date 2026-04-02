import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Box, Paper, Tabs, Tab,
    Button, Divider, CircularProgress, IconButton
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchNotifications, markAllLocalRead } from './notificationsSlice';
import { markAllAsRead as apiMarkAllAsRead } from '../../api/notificationApi';
import InboxList from './InboxList';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const Notifications: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [tab, setTab] = useState(0);
    const { items, loading } = useSelector((state: RootState) => state.notifications);

    useEffect(() => {
        dispatch(fetchNotifications({}));
    }, [dispatch]);

    const handleMarkAllRead = async () => {
        try {
            await apiMarkAllAsRead();
            dispatch(markAllLocalRead());
        } catch (err) {
            console.error('Failed to mark all as read', err);
        }
    };

    const filteredItems = tab === 0
        ? items
        : items.filter(n => (tab === 1 ? !n.read : true));

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold">Notification Center</Typography>
                    <Typography variant="body1" color="textSecondary">Stay updated with your charging sessions and account activity.</Typography>
                </Box>
                <Button
                    startIcon={<DoneAllIcon />}
                    variant="outlined"
                    size="small"
                    onClick={handleMarkAllRead}
                    disabled={items.filter(n => !n.read).length === 0}
                >
                    Mark All Read
                </Button>
            </Box>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab label={`All (${items.length})`} />
                <Tab label={`Unread (${items.filter(n => !n.read).length})`} />
            </Tabs>

            {loading && items.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
            ) : (
                <InboxList notifications={filteredItems} />
            )}
        </Container>
    );
};

export default Notifications;
