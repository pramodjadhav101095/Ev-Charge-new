import React from 'react';
import { Skeleton, Box, Grid } from '@mui/material';

const LoadingSkeleton: React.FC = () => {
    return (
        <Box>
            <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2 }} />
            <Grid container spacing={3}>
                {[1, 2, 3].map((item) => (
                    <Grid item xs={12} md={4} key={item}>
                        <Skeleton variant="rectangular" height={150} />
                        <Skeleton variant="text" sx={{ mt: 1 }} />
                        <Skeleton variant="text" width="60%" />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default LoadingSkeleton;
