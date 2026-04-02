import React from 'react';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface AuthFormProps {
    type: 'login' | 'register';
    onSubmit: (values: any) => void;
    loading?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, loading }) => {
    const validationSchema = Yup.object({
        username: Yup.string().required('Username is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        ...(type === 'register' && {
            email: Yup.string().email('Invalid email').required('Email is required'),
        }),
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            ...(type === 'register' && { email: '' }),
        },
        validationSchema,
        onSubmit,
    });

    return (
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            <TextField
                fullWidth
                id="username"
                name="username"
                label="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
                margin="normal"
            />
            {type === 'register' && (
                <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email Address"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    margin="normal"
                />
            )}
            <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                margin="normal"
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, height: 48, borderRadius: 2 }}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : (type === 'login' ? 'Sign In' : 'Sign Up')}
            </Button>
        </Box>
    );
};

export default AuthForm;
