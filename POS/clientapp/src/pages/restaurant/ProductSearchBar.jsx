import React from 'react';
import {
    Stack, TextField, Box, IconButton, Autocomplete, CircularProgress,
    Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';

const ProductSearchBar = ({
    filteredProducts,
    searchInput,
    onSearchInputChange,
    onSelectProduct,
    loading,
    onRefresh,
    categories = [],
    selectedCategory,
    onCategoryChange,
}) => {
    return (
        <Stack
            direction="row"                     // always row, never column
            spacing={{ xs: 0.5, sm: 1 }}        // tighter spacing on mobile
            alignItems="center"
            mb={1}
            sx={{ width: '100%' }}
        >
            {/* Search autocomplete – takes remaining space */}
            <Autocomplete
                value={null}
                onChange={(_, newValue) => {
                    if (newValue) {
                        onSelectProduct(newValue);
                        onSearchInputChange('');
                    }
                }}
                inputValue={searchInput}
                onInputChange={(_, val) => onSearchInputChange(val)}
                options={filteredProducts}
                getOptionLabel={(opt) => `${opt.name}${opt.barcode ? ` (${opt.barcode})` : ''}`}
                isOptionEqualToValue={(opt, val) => opt.productID === val.productID}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search"
                        variant="outlined"
                        size="small"
                        fullWidth
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <Box sx={{ ml: 0.5, mr: -0.5 }}>
                                    <SearchIcon color="action" fontSize="small" />
                                </Box>
                            ),
                            endAdornment: (
                                <>
                                    {loading && <CircularProgress size={18} />}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: 2 },
                            '& .MuiInputLabel-root': { fontSize: '0.8rem' },
                        }}
                    />
                )}
                sx={{ flex: 1, minWidth: 0 }}    // allows shrinking
            />

            {/* Category dropdown – fixed small width */}
            <FormControl size="small" sx={{ minWidth: 120, maxWidth: 150 }}>
                <InputLabel id="category-select-label" sx={{ fontSize: '0.75rem' }}>
                    Category
                </InputLabel>
                <Select
                    labelId="category-select-label"
                    value={selectedCategory ?? ''}
                    label="Category"
                    onChange={(e) => onCategoryChange(e.target.value || null)}
                    sx={{ fontSize: '0.8rem' }}
                >
                    <MenuItem value="">All</MenuItem>
                    {categories.map(cat => (
                        <MenuItem key={cat.categoryID} value={cat.categoryID}>
                            {cat.categoryName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Refresh button – fixed size */}
            <IconButton
                onClick={onRefresh}
                disabled={loading}
                size="small"
                sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                }}
            >
                <RefreshIcon fontSize="small" color={loading ? 'disabled' : 'primary'} />
            </IconButton>
        </Stack>
    );
};

export default ProductSearchBar;