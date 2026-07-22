import React from 'react';
import { Paper, Box } from '@mui/material';
import ProductSearchBar from './ProductSearchBar';
import ProductGrid from './ProductGrid';

// Left-hand panel: search/barcode row on top, scrollable product grid below.
const ProductPanel = ({
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
    cartItems,
    onAddToCart,
}) => {
    return (
        <Paper
            elevation={2}
            sx={{
                p: 1.5,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                bgcolor: 'white',
                overflow: 'hidden',
            }}
        >
            <ProductSearchBar
                filteredProducts={filteredProducts}
                searchInput={searchInput}
                onSearchInputChange={onSearchInputChange}
                onSelectProduct={onSelectProduct}
                barcodeRef={barcodeRef}
                barcodeValue={barcodeValue}
                onBarcodeValueChange={onBarcodeValueChange}
                onBarcodeSubmit={onBarcodeSubmit}
                loading={loading}
                onRefresh={onRefresh}
            />

            <Box sx={{ flex: 1, overflow: 'auto', p: 0.5 }}>
                <ProductGrid
                    products={filteredProducts}
                    cartItems={cartItems}
                    onAddToCart={onAddToCart}
                />
            </Box>
        </Paper>
    );
};

export default ProductPanel;
