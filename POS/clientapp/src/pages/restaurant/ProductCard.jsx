import React from 'react';
import { Card, Typography, useTheme, Box, CardMedia, useMediaQuery } from '@mui/material';
import Env from './../../services/config';

const ProductCard = React.memo(({ product, isInCart, onClick }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const imageBaseUrl = Env.appUrl || Env.baseurl?.replace(/\/api\/?$/, '') || '';
    const imageSrc = product.imageUrl ? `${imageBaseUrl}/images/products/${product.imageUrl}` : null;

    return (
        <Card
            sx={{
                p: isMobile ? 0.75 : 1.5,              // less padding on mobile
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: isInCart ? theme.palette.warning.light : 'white',
                border: isInCart ? `2px solid ${theme.palette.warning.main}` : '1px solid #e0e0e0',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                height: '100%',                         // ensure consistent height in grid
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
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
            {/* Image container – hidden on very small screens if you want, but here we keep it small */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: isMobile ? 0.5 : 1,
                    width: '100%',
                }}
            >
                {imageSrc ? (
                    <CardMedia
                        component="img"
                        image={imageSrc}
                        alt={product.name}
                        sx={{
                            width: isMobile ? 56 : 80,     // smaller on mobile
                            height: isMobile ? 56 : 80,
                            objectFit: 'cover',
                            borderRadius: 1,
                            flexShrink: 0,
                        }}
                    />
                ) : (
                    <Box
                        sx={{
                            width: isMobile ? 56 : 80,
                            height: isMobile ? 56 : 80,
                            bgcolor: '#f5f5f5',
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography variant="caption" color="text.secondary" fontSize={isMobile ? '0.5rem' : '0.6rem'}>
                            No Image
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Product info – tighter spacing and smaller fonts on mobile */}
            <Typography
                variant="body2"
                fontWeight={600}
                noWrap
                sx={{
                    fontSize: isMobile ? '0.7rem' : '0.8rem',
                    lineHeight: 1.2,
                    width: '100%',
                    textAlign: 'center',
                }}
            >
                {product.name}
            </Typography>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                    fontSize: isMobile ? '0.6rem' : '0.7rem',
                    fontWeight: 500,
                }}
            >
                ₹{product.price?.toFixed(2) || '0.00'}
            </Typography>
        </Card>
    );
});

export default ProductCard;