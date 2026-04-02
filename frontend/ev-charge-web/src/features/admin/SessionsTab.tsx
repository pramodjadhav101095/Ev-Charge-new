import React from 'react';
import { Box, Chip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const SessionsTab: React.FC = () => {
    const { sessions, loading } = useSelector((state: RootState) => state.admin);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Session ID', width: 100 },
        { field: 'userId', headerName: 'User ID', width: 100 },
        { field: 'stationId', headerName: 'Station ID', width: 100 },
        { field: 'energyUsed', headerName: 'Energy (kWh)', width: 130 },
        { field: 'cost', headerName: 'Cost (₹)', width: 100 },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === 'ACTIVE' ? 'primary' : 'default'}
                    size="small"
                />
            )
        },
        { field: 'startTime', headerName: 'Start Time', width: 200, valueGetter: (params) => new Date(params.value).toLocaleString() }
    ];

    return (
        <Box sx={{ height: 650, width: '100%', mt: 2 }}>
            <DataGrid
                rows={sessions}
                columns={columns}
                pageSizeOptions={[10, 20]}
                initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                loading={loading}
                disableRowSelectionOnClick
            />
        </Box>
    );
};

export default SessionsTab;
