import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStations, setFilters, resetStations } from '../store/slices/stationsSlice';
import { RootState, AppDispatch } from '../store';
import { useGeolocation } from './useGeolocation';

export const useStations = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading, error, filters, pagination } = useSelector((state: RootState) => state.stations);
    const { location } = useGeolocation();

    const loadStations = useCallback((isFirstLoad = false) => {
        if (isFirstLoad) {
            dispatch(resetStations());
        }

        const params = {
            ...filters,
            page: isFirstLoad ? 0 : pagination.page,
            size: 10,
            lat: location?.lat,
            lng: location?.lng,
        };

        dispatch(fetchStations(params));
    }, [dispatch, filters, pagination.page, location]);

    useEffect(() => {
        loadStations(true);
    }, [filters, location]);

    const handleSearch = (query: string) => {
        dispatch(setFilters({ query }));
    };

    const handleFilterChange = (newFilters: any) => {
        dispatch(setFilters(newFilters));
    };

    const loadMore = () => {
        if (!loading && pagination.hasMore) {
            loadStations();
        }
    };

    return {
        stations: items,
        loading,
        error,
        filters,
        hasMore: pagination.hasMore,
        handleSearch,
        handleFilterChange,
        loadMore,
        location
    };
};
