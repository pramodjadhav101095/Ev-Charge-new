import React from 'react';
import {
    List, ListItem, ListItemText, ListItemSecondaryAction,
    IconButton, Typography, Paper, Box, Divider, Chip, Tooltip
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { useDispatch } from 'react-redux';
import { updateNotificationReadStatus, removeNotification } from '../../store/slices/notificationsSlice';
import { markAsRead, deleteNotification } from '../../api/notificationApi';

interface InboxListProps {
    notifications: any[];
}

const InboxList: React.FC<InboxListProps> = ({ notifications }) => {
    const dispatch = useDispatch();

    const handleMarkRead = async (id: number) => {
        try {
            await markAsRead(id);
            dispatch(updateNotificationReadStatus(id));
        } catch (err) {
            console.error('Failed to mark as read', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Delete notification?')) {
            try {
                await deleteNotification(id);
                dispatch(removeNotification(id));
            } catch (err) {
                console.error('Failed to delete notification', err);
            }
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircleIcon color="success" />;
            case 'WARNING': return <WarningIcon color="warning" />;
            case 'ERROR': return <ErrorIcon color="error" />;
            default: return <InfoIcon color="info" />;
        }
    };

    if (notifications.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#fafafa', borderRadius: 2 }}>
                <Typography color="textSecondary">Your inbox is empty.</Typography>
            </Paper>
        );
    }

    return (
        <List>
            {notifications.map((n) => (
                <Paper
                    key={n.id}
                    elevation={0}
                    sx={{
                        mb: 1,
                        border: '1px solid #eee',
                        borderRadius: 2,
                        bgcolor: n.read ? '#fff' : '#f0f7ff'
                    }}
                >
                    <ListItem alignItems="flex-start">
                        <Box sx={{ mr: 2, mt: 0.5 }}>{getIcon(n.type)}</Box>
                        <ListItemText
                            primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="subtitle1" fontWeight={n.read ? 'medium' : 'bold'}>
                                        {n.title}
                                    </Typography>
                                    {!n.read && <Chip label="New" color="primary" size="small" sx={{ height: 20 }} />}
                                </Box>
                            }
                            secondary={
                                <React.Fragment>
                                    <Typography variant="body2" color="textPrimary" sx={{ my: 0.5 }}>
                                        {n.message}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {new Date(n.createdAt).toLocaleString()}
                                    </Typography>
                                </React.Fragment>
                            }
                        />
                        <ListItemSecondaryAction>
                            {!n.read && (
                                <Tooltip title="Mark as Read">
                                    <IconButton size="small" onClick={() => handleMarkRead(n.id)}>
                                        <DoneIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}
                            <Tooltip title="Delete">
                                <IconButton size="small" onClick={() => handleDelete(n.id)} color="error">
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </ListItemSecondaryAction>
                    </ListItem>
                </Paper>
            ))}
        </List>
    );
};

export default InboxList;
