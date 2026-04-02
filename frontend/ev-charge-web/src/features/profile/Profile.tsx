import React, { useEffect, useState } from 'react';
import {
    Box, Container, Paper, Typography, Avatar,
    Tabs, Tab, Divider, Chip, CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchProfileStart, fetchProfileSuccess, fetchProfileFailure, updateProfileSuccess } from '../../store/slices/userSlice';
import { getUserProfile, updateUserProfile } from '../../api/userApi';
import EditForm from './EditForm';
import Vehicles from './Vehicles';

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

const Profile: React.FC = () => {
    const dispatch = useDispatch();
    const { profile, loading } = useSelector((state: RootState) => state.user);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        const loadProfile = async () => {
            dispatch(fetchProfileStart());
            try {
                const response = await getUserProfile();
                dispatch(fetchProfileSuccess(response.data));
            } catch (err: any) {
                dispatch(fetchProfileFailure(err.message));
            }
        };
        loadProfile();
    }, [dispatch]);

    const handleUpdateProfile = async (values: any) => {
        try {
            const response = await updateUserProfile(values);
            dispatch(updateProfileSuccess(response.data));
        } catch (err) {
            console.error('Update failed', err);
        }
    };

    if (loading && !profile) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Avatar
                        src={profile?.avatarUrl}
                        sx={{ width: 100, height: 100, mr: 3, border: '4px solid #4caf50' }}
                    >
                        {profile?.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="bold">
                            {profile?.firstName} {profile?.lastName}
                        </Typography>
                        <Typography variant="body1" color="textSecondary" gutterBottom>
                            @{profile?.username}
                        </Typography>
                        <Chip
                            label={profile?.role || 'USER'}
                            color={profile?.role === 'ADMIN' ? 'secondary' : 'primary'}
                            size="small"
                        />
                    </Box>
                </Box>

                <Divider />

                <Box sx={{ width: '100%', mt: 2 }}>
                    <Tabs
                        value={tabValue}
                        onChange={(_, v) => setTabValue(v)}
                        variant="fullWidth"
                        textColor="primary"
                        indicatorColor="primary"
                    >
                        <Tab label="Profile Info" />
                        <Tab label="Vehicles" />
                        <Tab label="Preferences" />
                    </Tabs>

                    <TabPanel value={tabValue} index={0}>
                        <EditForm
                            initialValues={{
                                firstName: profile?.firstName || '',
                                lastName: profile?.lastName || '',
                                email: profile?.email || '',
                                phone: profile?.phone || '',
                            }}
                            onSubmit={handleUpdateProfile}
                        />
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <Vehicles />
                    </TabPanel>

                    <TabPanel value={tabValue} index={2}>
                        <Typography variant="body1">Language: English</Typography>
                        <Typography variant="body1">Currency: USD</Typography>
                        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                            More preferences coming soon.
                        </Typography>
                    </TabPanel>
                </Box>
            </Paper>
        </Container>
    );
};

export default Profile;
