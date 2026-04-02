import React, { useState } from 'react';
import {
    IconButton, Badge, Menu, MenuItem,
    Typography, Box, Divider, Button, ListItemText, ListItemIcon
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateNotificationReadStatus } from '../store/slices/notificationsSlice';
import { markAsRead } from '../api/notificationApi';
import InfoIcon from '@mui/icons-material/Info';
import DoneIcon from '@mui/icons-material/Done';

const NotificationBell: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { items } = useSelector((state: RootState) => state.notifications);

    const unreadItems = items.filter(n => !n.read);
    const unreadCount = unreadItems.length;

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleQuickRead = async (id: number) => {
        try {
            await markAsRead(id);
            dispatch(updateNotificationReadStatus(id));
        } catch (err) {
            console.error('Read failed', err);
        }
    };

    return (
        <Box>
            <IconButton color="inherit" onClick={handleOpen}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: { width: 320, maxHeight: 400, mt: 1.5, borderRadius: 2 }
                }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
                    {unreadCount > 0 && <Typography variant="caption" color="primary">{unreadCount} New</Typography>}
                </Box>
                <Divider />

                {unreadItems.length === 0 ? (
                    <MenuItem onClick={handleClose}>
                        <Typography variant="body2" color="textSecondary" sx={{ py: 2, textAlign: 'center', width: '100%' }}>
                            No new notifications
                        </Typography>
                    </MenuItem>
                ) : (
                    unreadItems.slice(0, 5).map((n) => (
                        <MenuItem key={n.id} onClick={handleClose} sx={{ py: 1.5 }}>
                            <ListItemIcon><InfoIcon fontSize="small" color="primary" /></ListItemIcon>
                            <ListItemText
                                primary={n.title}
                                secondary={n.message}
                                primaryTypographyProps={{ variant: 'body2', fontWeight: 'bold', noWrap: true }}
                                secondaryTypographyProps={{ variant: 'caption', noWrap: true }}
                            />
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleQuickRead(n.id); }}>
                                <DoneIcon fontSize="small" />
                            </IconButton>
                        </MenuItem>
                    ))
                )}

                <Divider />
                <Box sx={{ p: 1 }}>
                    <Button
                        fullWidth
                        size="small"
                        onClick={() => { handleClose(); navigate('/notifications'); }}
                    >
                        View All Notifications
                    </Button>
                </Box>
            </Menu>
        </Box>
    );
};

export default NotificationBell;
