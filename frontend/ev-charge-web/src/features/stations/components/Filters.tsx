import React from 'react';
import {
    Box, TextField, FormControl, Select, MenuItem,
    Button, Popover, Slider, Typography, Checkbox, ListItemText,
    OutlinedInput, InputAdornment
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

interface FiltersProps {
    filters: any;
    onFilterChange: (newFilters: any) => void;
    onSearch: (query: string) => void;
}

const CHARGER_TYPES = ['AC Type 2', 'DC Fast', 'Supercharger'];

const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange, onSearch }) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
                placeholder="Search stations..."
                variant="outlined"
                size="small"
                fullWidth
                sx={{ maxWidth: 400 }}
                onChange={(e) => onSearch(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                }}
            />

            <Button
                startIcon={<FilterListIcon />}
                variant="outlined"
                onClick={handleClick}
                color={open ? 'primary' : 'inherit'}
            >
                Filters
            </Button>

            <Button startIcon={<GpsFixedIcon />} variant="text">Near Me</Button>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                <Box sx={{ p: 3, width: 300 }}>
                    <Typography variant="subtitle2" gutterBottom>Availability</Typography>
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <Select
                            value={filters.status}
                            onChange={(e) => onFilterChange({ status: e.target.value })}
                        >
                            <MenuItem value="ALL">All Status</MenuItem>
                            <MenuItem value="AVAILABLE">Available</MenuItem>
                            <MenuItem value="OCCUPIED">Occupied</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography variant="subtitle2" gutterBottom>Radius: {filters.radius} km</Typography>
                    <Slider
                        value={filters.radius}
                        min={1}
                        max={50}
                        onChange={(_, val) => onFilterChange({ radius: val })}
                        valueLabelDisplay="auto"
                        sx={{ mb: 2 }}
                    />

                    <Typography variant="subtitle2" gutterBottom>Charger Type</Typography>
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <Select
                            multiple
                            value={filters.type}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) => selected.join(', ')}
                            onChange={(e) => onFilterChange({ type: e.target.value })}
                        >
                            {CHARGER_TYPES.map((name) => (
                                <MenuItem key={name} value={name}>
                                    <Checkbox checked={filters.type.indexOf(name) > -1} />
                                    <ListItemText primary={name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Typography variant="subtitle2" gutterBottom>Sort By</Typography>
                    <FormControl fullWidth size="small">
                        <Select
                            value={filters.sortBy}
                            onChange={(e) => onFilterChange({ sortBy: e.target.value })}
                        >
                            <MenuItem value="distance">Distance</MenuItem>
                            <MenuItem value="name">Name</MenuItem>
                            <MenuItem value="rating">Rating</MenuItem>
                        </Select>
                    </FormControl>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleClose}>Apply</Button>
                    </Box>
                </Box>
            </Popover>
        </Box>
    );
};

export default Filters;
