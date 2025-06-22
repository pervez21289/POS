import React, { useState, useEffect, useMemo } from 'react';
import {
    Container, Typography, Button, TextField,
    List, ListItem, ListItemText, Divider, Box, Autocomplete, CircularProgress
} from '@mui/material';
import debounce from 'lodash.debounce';
import axios from 'axios';
import { useCreateSaleMutation } from './../../services/salesApi';
import ProductService from './../../services/ProductService'; // Assuming you have a ProductService for API calls

const SalesPOSPage = () => {
    const [cart, setCart] = useState([]);
    const [searchValue, setSearchValue] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState('');
    const [createSale, { isLoading }] = useCreateSaleMutation();

    // 🔁 Debounced API call to search products
    const fetchProducts = useMemo(() => debounce(async (query) => {
        if (!query) {
            setSearchResults([]);
            return;
        }
        setLoading(true);
        try {
            const data = await ProductService.GetProduct(query);
            setSearchResults(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching products:', err);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    }, 300), []);

    // Trigger search on input change
    useEffect(() => {
        fetchProducts(searchInput);
        return () => fetchProducts.cancel();
    }, [searchInput, fetchProducts]);

    const addToCart = (product) => {
        setCart((prev) => {
            const found = prev.find((i) => i.productID === product.productID);
            if (found) {
                return prev.map((i) =>
                    i.productID === product.productID ? { ...i, qty: i.qty + 1 } : i
                );
            }
            return [...prev, { ...product, qty: 1, discount: 0, tax: 0 }];
        });
        setSearchValue(null);
    };

    const updateQty = (productID, qty) => {
        setCart((prev) =>
            prev.map((i) =>
                i.productID === productID ? { ...i, qty: Math.max(1, Number(qty)) } : i
            )
        );
    };

    const removeFromCart = (productID) => {
        setCart((prev) => prev.filter((i) => i.productID !== productID));
    };

    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const discount = cart.reduce((sum, i) => sum + (i.discount || 0), 0);
    const tax = cart.reduce((sum, i) => sum + (i.tax || 0), 0);
    const net = total - discount + tax;

    const handleCheckout = async () => {
        try {
            const sale = {
                userID: 3, // Replace with actual user
                totalAmount: total,
                discountAmount: discount,
                taxAmount: tax,
                paymentStatus: 'Paid',
                notes,
                saleItems: cart.map(i => ({
                    productID: i.productID,
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
                    onInputChange={(event, newInputValue) => {
                        setSearchInput(newInputValue);
                    }}
                    options={searchResults||[]}
                    getOptionLabel={(option) => option.name || ''}
                    isOptionEqualToValue={(option, value) => option.productID === value.productID}
                    loading={loading}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search Product"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                />
            </Box>

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
                                    onChange={(e) => updateQty(item.productID, e.target.value)}
                                    inputProps={{ min: 1, style: { width: 50 } }}
                                    sx={{ mr: 2 }}
                                />
                                <Button color="error" onClick={() => removeFromCart(item.productID)}>
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
