import React, { useState } from 'react';
import { Box, Button, Chip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateUserRole, deleteUser } from '../../api/adminApi';
import { updateLocalUserStatus } from './adminSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const UsersTab: React.FC = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector((state: RootState) => state.admin);

    const handleRoleChange = async (userId: number, currentRole: string) => {
        const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
        try {
            await updateUserRole(userId, newRole);
            dispatch(updateLocalUserStatus({ id: userId, role: newRole }));
        } catch (err) {
            console.error('Failed to update role', err);
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'username', headerName: 'Username', width: 150 },
        { field: 'email', headerName: 'Email', width: 250 },
        {
            field: 'role',
            headerName: 'Role',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === 'ADMIN' ? 'primary' : 'default'}
                    size="small"
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 300,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        startIcon={<AdminPanelSettingsIcon />}
                        size="small"
                        onClick={() => handleRoleChange(params.row.id, params.row.role)}
                    >
                        Toggle Admin
                    </Button>
                    <Button
                        startIcon={<DeleteIcon />}
                        size="small"
                        color="error"
                        onClick={() => { if (window.confirm('Delete user?')) deleteUser(params.row.id) }}
                    >
                        Delete
                    </Button>
                </Box>
            )
        }
    ];

    return (
        <Box sx={{ height: 600, width: '100%', mt: 2 }}>
            <DataGrid
                rows={users}
                columns={columns}
                pageSizeOptions={[10, 20]}
                initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                loading={loading}
                disableRowSelectionOnClick
            />
        </Box>
    );
};

export default UsersTab;
