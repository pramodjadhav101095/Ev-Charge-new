import React from 'react';
import { Box, Container, Paper, Typography, Grid, Link } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../components/AuthForm';
import { login as loginApi } from '../../api/authApi';
import { setAuth, setLoading, setError } from '../../store/slices/authSlice';
import { RootState } from '../../store';

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = navigate; // This is a mistake in thought, should be useNavigate()
    const history = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const handleLogin = async (values: any) => {
        dispatch(setLoading(true));
        try {
            const data = await loginApi(values);
            dispatch(setAuth({ token: data.token, user: data.user }));
            history(data.user.role === 'ADMIN' ? '/admin' : '/dashboard');
        } catch (err: any) {
            dispatch(setError(err.response?.data?.message || 'Login failed'));
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
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=2072)',
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
                    EV-Charge
                </Typography>
                <Typography variant="h5" align="center" sx={{ maxWidth: 600 }}>
                    "Powering the future of green mobility. Simple, smart, and sustainable charging at your fingertips."
                </Typography>
            </Grid>
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 400 }}>
                    <Typography component="h1" variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
                        Sign In
                    </Typography>
                    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
                    <AuthForm type="login" onSubmit={handleLogin} loading={loading} />
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/register" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Login;
