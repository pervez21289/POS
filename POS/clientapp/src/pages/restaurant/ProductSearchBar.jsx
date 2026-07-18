import React from 'react';
import { Stack, TextField, Box, IconButton, Autocomplete, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import RefreshIcon from '@mui/icons-material/Refresh';

// Product autocomplete search + barcode scan input + refresh button.
const ProductSearchBar = ({
    filteredProducts,
    searchInput,
    onSearchInputChange,
    onSelectProduct,
    barcodeRef,
    barcodeValue,
    onBarcodeValueChange,
    onBarcodeSubmit,
    loading,
    onRefresh,
}) => {
    return (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" mb={1.5}>
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
                        label="Search products"
                        variant="outlined"
                        size="small"
                        fullWidth
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <Box sx={{ ml: 1, mr: -1 }}>
                                    <SearchIcon color="action" />
                                </Box>
                            ),
                            endAdornment: (
                                <>
                                    {loading && <CircularProgress size={20} />}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                )}
                sx={{ flex: 2 }}
            />

            <TextField
                inputRef={barcodeRef}
                value={barcodeValue}
                onChange={(e) => onBarcodeValueChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onBarcodeSubmit()}
                label="Scan Barcode"
                size="small"
                placeholder="Type or scan"
                sx={{ flex: 1, minWidth: 150 }}
                InputProps={{
                    startAdornment: (
                        <Box sx={{ ml: 1, mr: -1 }}>
                            <QrCodeScannerIcon color="action" />
                        </Box>
                    ),
                    endAdornment: (
                        <IconButton onClick={onBarcodeSubmit} size="small" edge="end">
                            <SearchIcon />
                        </IconButton>
                    ),
                }}
            />

            <IconButton
                onClick={onRefresh}
                disabled={loading}
                sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 1 }}
            >
                <RefreshIcon color={loading ? 'disabled' : 'primary'} />
            </IconButton>
        </Stack>
    );
};

export default ProductSearchBar;
