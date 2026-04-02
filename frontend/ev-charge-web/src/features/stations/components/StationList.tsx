import React from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import StationCard from './StationCard';

interface StationListProps {
    stations: any[];
    loading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    onViewDetails: (station: any) => void;
    onBookSlot: (station: any) => void;
}

const StationList: React.FC<StationListProps> = ({
    stations, loading, hasMore, onLoadMore, onViewDetails, onBookSlot
}) => {
    if (!loading && stations.length === 0) {
        return (
            <Box textAlign="center" py={5}>
                <Typography variant="h6" color="text.secondary">No stations found matching your criteria</Typography>
                <Typography variant="body2" color="text.secondary">Try adjusting filters or searching a different area</Typography>
            </Box>
        );
    }

    return (
        <InfiniteScroll
            dataLength={stations.length}
            next={onLoadMore}
            hasMore={hasMore}
            loader={
                <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress size={24} />
                </Box>
            }
            scrollThreshold={0.9}
        >
            <Grid container spacing={2}>
                {stations.map((station) => (
                    <Grid item xs={12} sm={6} md={12} lg={12} key={station.id}>
                        <StationCard
                            station={station}
                            onViewDetails={onViewDetails}
                            onBookSlot={onBookSlot}
                        />
                    </Grid>
                ))}
            </Grid>
        </InfiniteScroll>
    );
};

export default StationList;
