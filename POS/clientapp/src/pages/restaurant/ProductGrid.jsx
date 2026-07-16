// src/pages/SalesPOS/ProductGrid.jsx
import React, { useRef, useEffect } from 'react';
import {
  Box, TextField, Autocomplete, IconButton, CircularProgress,
  Chip, Stack, Typography, Paper, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BarcodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import ProductCard from './ProductCard';

const ProductGrid = ({
  products,
  filteredProducts,
  searchInput,
  setSearchInput,
  barcodeValue,
  setBarcodeValue,
  handleBarcodeSubmit,
  addToCart,
  isInCart = () => false, // function to check if product is in cart
  loading = false,
  onRefresh,
  // Optional category filter
  categories = [],
  selectedCategory,
  setSelectedCategory,
}) => {
  const barcodeInputRef = useRef(null);

  // Auto-focus barcode input on mount
  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

  // Handle global keyboard shortcut for barcode scan (e.g., Ctrl+Shift+B)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        barcodeInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Search & Barcode Row */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" mb={2}>
        <Autocomplete
          value={null}
          onChange={(_, newValue) => {
            if (newValue) {
              addToCart(newValue);
              setSearchInput('');
            }
          }}
          inputValue={searchInput}
          onInputChange={(_, val) => setSearchInput(val)}
          options={filteredProducts}
          getOptionLabel={(opt) => `${opt.name}${opt.barcode ? ` (${opt.barcode})` : ''}`}
          isOptionEqualToValue={(opt, val) => opt.productID === val.productID}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search products by name or barcode"
              variant="outlined"
              size="small"
              fullWidth
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {loading && <CircularProgress size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          sx={{ flex: 2 }}
        />

        <TextField
          inputRef={barcodeInputRef}
          value={barcodeValue}
          onChange={(e) => setBarcodeValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleBarcodeSubmit()}
          label="Scan Barcode"
          size="small"
          placeholder="Scan or type barcode"
          sx={{ flex: 1, minWidth: 150 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BarcodeScannerIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <IconButton onClick={handleBarcodeSubmit} size="small" edge="end">
                <SearchIcon />
              </IconButton>
            ),
          }}
        />

        {onRefresh && (
          <IconButton onClick={onRefresh} disabled={loading} color="primary">
            <i className="fas fa-sync-alt" /> {/* or use RefreshIcon from MUI */}
          </IconButton>
        )}
      </Stack>

      {/* Category Filters (optional) */}
      {categories.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1, mb: 1 }}>
          <Chip
            label="All"
            clickable
            variant={!selectedCategory ? 'filled' : 'outlined'}
            color={!selectedCategory ? 'primary' : 'default'}
            onClick={() => setSelectedCategory && setSelectedCategory(null)}
          />
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              clickable
              variant={selectedCategory === cat ? 'filled' : 'outlined'}
              color={selectedCategory === cat ? 'primary' : 'default'}
              onClick={() => setSelectedCategory && setSelectedCategory(cat)}
            />
          ))}
        </Stack>
      )}

      {/* Product Grid */}
      <Box sx={{ flex: 1, overflow: 'auto', pt: 1 }}>
        {filteredProducts.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
            No products found. Try adjusting your search.
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: 1.5,
            }}
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.productID}
                product={product}
                isInCart={isInCart(product)}
                onClick={addToCart}
              />
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default ProductGrid;