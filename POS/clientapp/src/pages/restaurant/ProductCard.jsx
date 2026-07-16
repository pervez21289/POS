import React from 'react';
import { Card, Typography, useTheme, Box } from '@mui/material';

const ProductCard = React.memo(({ product, isInCart, onClick }) => {
    const theme = useTheme();

    return (
        <Card
            sx={{
                p: 1.5,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: isInCart ? theme.palette.warning.light : 'white',
                border: isInCart ? `2px solid ${theme.palette.warning.main}` : '1px solid #e0e0e0',
                borderRadius: 2,
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
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
            {isInCart && (
                <Box
                    sx={{
                        mt: 0.5,
                        bgcolor: theme.palette.warning.main,
                        color: 'white',
                        borderRadius: 1,
                        px: 1,
                        py: 0.3,
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        display: 'inline-block',
                    }}
                >
                    IN CART
                </Box>
            )}
        </Card>
    );
});

export default ProductCard;