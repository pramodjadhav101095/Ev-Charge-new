import React, { useState, useEffect } from 'react';
import { Container, Box, Tabs, Tab, Typography, Paper, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchAdminData } from './adminSlice';
import UsersTab from './UsersTab';
import StationsTab from './StationsTab';
import SessionsTab from './SessionsTab';
import ReportsTab from './ReportsTab';
import PeopleIcon from '@mui/icons-material/People';
import EvStationIcon from '@mui/icons-material/EvStation';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const Admin: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [tabValue, setTabValue] = useState(0);
    const { user } = useSelector((state: RootState) => state.auth);
    const { error } = useSelector((state: RootState) => state.admin);

    useEffect(() => {
        dispatch(fetchAdminData());
    }, [dispatch]);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (user?.role !== 'ADMIN') {
        return (
            <Container sx={{ mt: 8 }}>
                <Alert severity="error">Access Denied. You do not have permission to view this page.</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>Administrative Control Center</Typography>
                <Typography variant="body1" color="textSecondary"> Manage platform entities, monitor network activity, and analyze system performance.</Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fbfbfb' }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        aria-label="admin tabs"
                    >
                        <Tab icon={<PeopleIcon />} iconPosition="start" label="Users" />
                        <Tab icon={<EvStationIcon />} iconPosition="start" label="Stations" />
                        <Tab icon={<HistoryIcon />} iconPosition="start" label="Sessions" />
                        <Tab icon={<AssessmentIcon />} iconPosition="start" label="Reports" />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}><UsersTab /></TabPanel>
                <TabPanel value={tabValue} index={1}><StationsTab /></TabPanel>
                <TabPanel value={tabValue} index={2}><SessionsTab /></TabPanel>
                <TabPanel value={tabValue} index={3}><ReportsTab /></TabPanel>
            </Paper>
        </Container>
    );
};

export default Admin;
