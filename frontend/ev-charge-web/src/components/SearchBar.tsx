import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
    placeholder?: string;
    onSearch?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search...", onSearch }) => {
    return (
        <Box maxWidth="600px" mx="auto">
            <TextField
                fullWidth
                variant="outlined"
                placeholder={placeholder}
                onChange={(e) => onSearch && onSearch(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    style: { borderRadius: 24, backgroundColor: 'white' }
                }}
            />
        </Box>
    );
};

export default SearchBar;
