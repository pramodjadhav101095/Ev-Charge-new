import React from 'react';
import { Box, Container, Paper, Typography, Grid, Link } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../components/AuthForm';
import { register as registerApi } from '../../api/authApi';
import { setLoading, setError } from '../../store/slices/authSlice';
import { RootState } from '../../store';

const Register: React.FC = () => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const handleRegister = async (values: any) => {
        dispatch(setLoading(true));
        try {
            await registerApi(values);
            history('/login');
        } catch (err: any) {
            dispatch(setError(err.response?.data?.message || 'Registration failed'));
        }
    };

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1594535182308-8ffefbb661e1?auto=format&fit=crop&q=80&w=1965)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) => t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    p: 8,
                }}
            >
                <Typography variant="h2" fontWeight="bold" gutterBottom>
                    Join EV-Charge
                </Typography>
                <Typography variant="h5" align="center" sx={{ maxWidth: 600 }}>
                    "Be a part of the renewable energy revolution. Start your journey towards a cleaner planet today."
                </Typography>
            </Grid>
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 400 }}>
                    <Typography component="h1" variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
                        Sign Up
                    </Typography>
                    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
                    <AuthForm type="register" onSubmit={handleRegister} loading={loading} />
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                {"Already have an account? Sign In"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Register;
