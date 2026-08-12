import React from 'react';
import { Card, Typography, useTheme, Box, CardMedia } from '@mui/material';
import Env from './../../services/config';

const ProductCard = React.memo(({ product, isInCart, onClick }) => {
    const theme = useTheme();

    const imageBaseUrl = Env.appUrl || Env.baseurl?.replace(/\/api\/?$/, '') || '';
    const imageSrc = product.imageUrl ? `${imageBaseUrl}/images/products/${product.imageUrl}` : null;

    return (
        <Card
            sx={{
                p: 1.5,                          // add back some padding for the centered image
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: isInCart ? theme.palette.warning.light : 'white',
                border: isInCart ? `2px solid ${theme.palette.warning.main}` : '1px solid #e0e0e0',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
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
            {/* Image container - centered with fixed size */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 1,
                }}
            >
                {imageSrc ? (
                    <CardMedia
                        component="img"
                        image={imageSrc}
                        alt={product.name}
                        sx={{
                            width: 80,              // fixed width
                            height: 80,             // fixed height (square)
                            objectFit: 'cover',
                            borderRadius: 1,
                            flexShrink: 0,
                        }}
                    />
                ) : (
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            bgcolor: '#f5f5f5',
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography variant="caption" color="text.secondary" fontSize="0.6rem">
                            No Image
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Product info */}
            <Typography variant="body2" fontWeight={600} noWrap fontSize="0.8rem">
                {product.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                ₹{product.price?.toFixed(2) || '0.00'}
            </Typography>
        </Card>
    );
});

export default ProductCard;