import React from 'react';
import { Card, Typography, useTheme, Box } from '@mui/material';

const ProductCard = React.memo(({ product, isInCart, onClick }) => {
    const theme = useTheme();

    return (
        <Card
            sx={{
                p: 1,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: isInCart ? theme.palette.warning.light : 'white',
                border: isInCart ? `2px solid ${theme.palette.warning.main}` : '1px solid #e0e0e0',
                borderRadius: 2,
              
                '&:hover': {
                    transform: 'scale(1.04)',
                    boxShadow: 4,
                    borderColor: theme.palette.primary.main,
                },
                '&:active': {
                    transform: 'scale(0.96)',
                },
            }}
            onClick={() => onClick(product)}
        >
            <Typography variant="body2" fontWeight={600} noWrap>
                {product.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                ₹{product.price.toFixed(2)}
            </Typography>
            
        </Card>
    );
});

export default ProductCard;