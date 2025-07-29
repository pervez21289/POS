import React from 'react';
import {
    Card, Typography, useTheme
} from '@mui/material';

const ProductCard = React.memo(({ product, isInCart, onClick }) => {
    const theme = useTheme();

    return (
        <Card
            sx={{
                p:1,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isInCart ? theme.palette.warning.light : 'white',
                border: isInCart
                    ? `2px solid ${theme.palette.warning.main}`
                    : '1px solid #e0e0e0',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    boxShadow: 6,
                    transform: 'scale(1.02)',
                },
            }}
            onClick={() => onClick(product)}
        >
            <Typography variant="body2" fontWeight={600}>
                {product.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                ₹{product.price.toFixed(2)}
            </Typography>
            {product.discountPercent > 0 && (
                <Typography variant="caption" sx={{ color: 'green' }}>
                    {product.discountPercent}% OFF
                </Typography>
            )}
        </Card>
    );
});

export default ProductCard;
