import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Grid, Card, CardContent, CardActions,
    Button, TextField, List, ListItem, ListItemText, Divider, Box, Autocomplete
} from '@mui/material';
import { useCreateSaleMutation } from './../../services/salesApi'; // Adjust the import path as needed

// Replace this with an API call in production
const fetchProducts = async () => [
    { id: 1, name: 'Item A', price: 10.0 },
    { id: 2, name: 'Item B', price: 15.5 },
    { id: 3, name: 'Item C', price: 7.25 },
];

const SalesPOSPage = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchValue, setSearchValue] = useState(null);
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState('');
    const [createSale, { isLoading }] = useCreateSaleMutation();

    useEffect(() => {
        fetchProducts().then(setProducts);
    }, []);

    const addToCart = (product) => {
        setCart((prev) => {
            const found = prev.find((i) => i.id === product.id);
            if (found) {
                return prev.map((i) =>
                    i.id === product.id ? { ...i, qty: i.qty + 1 } : i
                );
            }
            return [...prev, { ...product, qty: 1, discount: 0, tax: 0 }];
        });
        setSearchValue(null);
    };

    const updateQty = (id, qty) => {
        setCart((prev) =>
            prev.map((i) =>
                i.id === id ? { ...i, qty: Math.max(1, Number(qty)) } : i
            )
        );
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((i) => i.id !== id));
    };

    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const discount = cart.reduce((sum, i) => sum + (i.discount || 0), 0);
    const tax = cart.reduce((sum, i) => sum + (i.tax || 0), 0);
    const net = total - discount + tax;

    const handleCheckout = async () => {
        try {
            const sale = {
                userID: 1, // Replace with actual user
                totalAmount: total,
                discountAmount: discount,
                taxAmount: tax,
                paymentStatus: 'Paid',
                notes,
                saleItems: cart.map(i => ({
                    productID: i.id,
                    quantity: i.qty,
                    unitPrice: i.price,
                    discount: i.discount,
                    tax: i.tax
                }))
            };
            await createSale(sale).unwrap();
            setStatus('Sale saved!');
            setCart([]);
            setNotes('');
        } catch {
            setStatus('Error saving sale.');
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Point of Sale</Typography>
            <Box sx={{ mb: 3 }}>
                <Autocomplete
                    value={searchValue}
                    onChange={(event, newValue) => {
                        if (newValue) addToCart(newValue);
                    }}
                    options={products}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label="Search Product" />}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                />
            </Box>
            {/*<Grid container spacing={2}>*/}
            {/*    {products.map((item) => (*/}
            {/*        <Grid item xs={12} sm={4} key={item.id}>*/}
            {/*            <Card>*/}
            {/*                <CardContent>*/}
            {/*                    <Typography variant="h6">{item.name}</Typography>*/}
            {/*                    <Typography color="text.secondary">${item.price.toFixed(2)}</Typography>*/}
            {/*                </CardContent>*/}
            {/*                <CardActions>*/}
            {/*                    <Button variant="contained" onClick={() => addToCart(item)} fullWidth>*/}
            {/*                        Add to Cart*/}
            {/*                    </Button>*/}
            {/*                </CardActions>*/}
            {/*            </Card>*/}
            {/*        </Grid>*/}
            {/*    ))}*/}
            {/*</Grid>*/}
            <Box mt={4}>
                <Typography variant="h5">Cart</Typography>
                <List>
                    {cart.length === 0 && (
                        <ListItem>
                            <ListItemText primary="Cart is empty" />
                        </ListItem>
                    )}
                    {cart.map((item) => (
                        <React.Fragment key={item.id}>
                            <ListItem>
                                <ListItemText
                                    primary={item.name}
                                    secondary={`$${item.price.toFixed(2)} x ${item.qty}`}
                                />
                                <TextField
                                    type="number"
                                    size="small"
                                    value={item.qty}
                                    onChange={(e) => updateQty(item.id, e.target.value)}
                                    inputProps={{ min: 1, style: { width: 50 } }}
                                    sx={{ mr: 2 }}
                                />
                                <Button color="error" onClick={() => removeFromCart(item.id)}>
                                    Remove
                                </Button>
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
                <TextField
                    label="Notes"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    fullWidth
                    sx={{ mt: 2 }}
                />
                <Box display="flex" justifyContent="space-between" mt={2}>
                    <Typography variant="h6">Total: ${net.toFixed(2)}</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={cart.length === 0 || isLoading}
                        onClick={handleCheckout}
                    >
                        {isLoading ? 'Saving...' : 'Checkout'}
                    </Button>
                </Box>
                {status && <Typography sx={{ mt: 2 }}>{status}</Typography>}
            </Box>
        </Container>
    );
};

export default SalesPOSPage;