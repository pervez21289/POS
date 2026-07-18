import React from 'react';
import { Box, Typography } from '@mui/material';
import ProductCard from './ProductCard';

// Responsive grid of product cards, with an empty state when nothing matches.
const ProductGrid = ({ products, cartItems, onAddToCart }) => {
    if (products.length === 0) {
        return (
            <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
                No products found
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: 1.5,
            }}
        >
            {products.map(product => (
                <ProductCard
                    key={product.productID}
                    product={product}
                    isInCart={cartItems.some(i => i.productID === product.productID)}
                    onClick={onAddToCart}
                />
            ))}
        </Box>
    );
};

export default ProductGrid;
