import React from 'react';
import { Box, Button, Chip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { deleteStation } from '../../api/adminApi';
import { removeLocalStation } from './adminSlice';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const StationsTab: React.FC = () => {
    const dispatch = useDispatch();
    const { stations, loading } = useSelector((state: RootState) => state.admin);

    const handleDelete = async (id: number) => {
        if (window.confirm('Delete this station?')) {
            try {
                await deleteStation(id);
                dispatch(removeLocalStation(id));
            } catch (err) {
                console.error('Failed to delete station', err);
            }
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Station Name', width: 250 },
        { field: 'latitude', headerName: 'Lat', width: 100 },
        { field: 'longitude', headerName: 'Lng', width: 100 },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === 'AVAILABLE' ? 'success' : 'warning'}
                    size="small"
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" startIcon={<EditIcon />}>Edit</Button>
                    <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(params.row.id)}
                    >
                        Delete
                    </Button>
                </Box>
            )
        }
    ];

    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" startIcon={<AddIcon />}>Add New Station</Button>
            </Box>
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={stations}
                    columns={columns}
                    pageSizeOptions={[10, 20]}
                    initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                    loading={loading}
                    disableRowSelectionOnClick
                />
            </Box>
        </Box>
    );
};

export default StationsTab;
