import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    Box,
    Button,
    CircularProgress
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
    useGetProductsQuery,
    useDeleteProductMutation
} from './../../services/productApi';
// Dummy image for products (can be replaced with actual image URLs if available)
const dummyImage = 'https://via.placeholder.com/150';

export default function ProductMenu() {
    //const [products, setProducts] = useState([]);
    //const [loading, setLoading] = useState(true);

    const { data: products = [], loading } = useGetProductsQuery(searchText);

    // Fetch products from your API
    

    const handleSelectProduct = (product) => {
        console.log('Selected Product:', product);
        // Add to cart or do billing logic here
    };

    if (loading) return <CircularProgress sx={{ m: 5 }} />;

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Restaurant Menu
            </Typography>
            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.productID}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: '0.3s',
                                boxShadow: 3,
                                '&:hover': {
                                    transform: 'scale(1.03)',
                                    boxShadow: 6,
                                }
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="140"
                                image={dummyImage}
                                alt={product.name}
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ₹{product.price.toFixed(2)}
                                </Typography>
                                {product.discountPercent > 0 && (
                                    <Typography variant="body2" color="green">
                                        {product.discountPercent}% OFF
                                    </Typography>
                                )}
                            </CardContent>
                            <Box sx={{ textAlign: 'center', pb: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<ShoppingCartIcon />}
                                    onClick={() => handleSelectProduct(product)}
                                >
                                    Add to Bill
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
