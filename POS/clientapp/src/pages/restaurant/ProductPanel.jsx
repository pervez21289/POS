import React from 'react';
import { Paper, Box } from '@mui/material';
import ProductSearchBar from './ProductSearchBar';
import ProductGrid from './ProductGrid';

const ProductPanel = ({
    filteredProducts,
    searchInput,
    onSearchInputChange,
    onSelectProduct,
    loading,
    onRefresh,
    cartItems,
    onAddToCart,
    categories,
    selectedCategory,
    onCategoryChange,
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
                height: '100%',
            }}
        >
            <ProductSearchBar
                filteredProducts={filteredProducts}
                searchInput={searchInput}
                onSearchInputChange={onSearchInputChange}
                onSelectProduct={onSelectProduct}
                loading={loading}
                onRefresh={onRefresh}
                categories={categories}           // pass through
                selectedCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
            />

            <Box sx={{ flex: 1, overflow: 'auto', p: 0.5, mt: 1 }}>
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