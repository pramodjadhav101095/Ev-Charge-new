import React, { useState } from 'react';
import {
    Box, Button, Typography, List, ListItem, ListItemText,
    IconButton, Divider, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addVehicleSuccess, deleteVehicleSuccess, updateVehicleSuccess } from '../../store/slices/userSlice';

const Vehicles: React.FC = () => {
    const dispatch = useDispatch();
    const { vehicles } = useSelector((state: RootState) => state.user);
    const [open, setOpen] = useState(false);
    const [currentVehicle, setCurrentVehicle] = useState<any>(null);

    const handleOpen = (vehicle: any = null) => {
        setCurrentVehicle(vehicle || { make: '', model: '', year: '', licensePlate: '' });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentVehicle(null);
    };

    const handleSave = () => {
        if (currentVehicle.id) {
            dispatch(updateVehicleSuccess(currentVehicle));
        } else {
            dispatch(addVehicleSuccess({ ...currentVehicle, id: Date.now().toString() }));
        }
        handleClose();
    };

    const handleDelete = (id: string) => {
        dispatch(deleteVehicleSuccess(id));
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">My Vehicles</Typography>
                <Button variant="outlined" onClick={() => handleOpen()}>Add Vehicle</Button>
            </Box>
            <List>
                {vehicles.map((v) => (
                    <React.Fragment key={v.id}>
                        <ListItem
                            secondaryAction={
                                <Box>
                                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(v)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(v.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            }
                        >
                            <ListItemText
                                primary={`${v.year} ${v.make} ${v.model}`}
                                secondary={`License: ${v.licensePlate}`}
                            />
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentVehicle?.id ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth label="Make"
                                value={currentVehicle?.make || ''}
                                onChange={(e) => setCurrentVehicle({ ...currentVehicle, make: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth label="Model"
                                value={currentVehicle?.model || ''}
                                onChange={(e) => setCurrentVehicle({ ...currentVehicle, model: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth label="Year"
                                type="number"
                                value={currentVehicle?.year || ''}
                                onChange={(e) => setCurrentVehicle({ ...currentVehicle, year: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth label="License Plate"
                                value={currentVehicle?.licensePlate || ''}
                                onChange={(e) => setCurrentVehicle({ ...currentVehicle, licensePlate: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Vehicles;
