import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Avatar, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';

interface HeaderProps {
    handleDrawerToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleDrawerToggle }) => {
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
                    EV-Charge
                </Typography>
                <IconButton color="inherit" onClick={() => navigate('/help')}>
                    <HelpCenterIcon />
                </IconButton>
                <NotificationBell />
                <Box sx={{ ml: 2, cursor: 'pointer' }} onClick={() => navigate('/profile')}>
                    <Avatar alt={user?.username} src="/static/images/avatar/1.jpg" />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
