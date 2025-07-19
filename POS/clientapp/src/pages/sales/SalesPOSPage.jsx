import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Container, Typography, TextField,
    Box, Autocomplete, CircularProgress,
    Card, CardContent, Stack
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash.debounce';
import { useDispatch, useSelector } from 'react-redux';
import { setReceiptInfo } from "./../../store/reducers/sales";

import ProductService from './../../services/ProductService';
import CartPage from './CartPage';
import { useGetProductsQuery } from './../../services/productApi';

const SalesPOSPage = () => {
    const { data: allProducts = [], isLoading } = useGetProductsQuery('');
    const dispatch = useDispatch();

    const [isSearching, setIsSearching] = useState(false);
    const [barcodeInput, setBarcodeInput] = useState('');
    const barcodeInputRef = useRef(null);
    const [searchValue, setSearchValue] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const { receiptInfo, isSearch } = useSelector((state) => state.sales);

    // Debounced product search
    const fetchProducts = useMemo(() =>
        debounce(async (query) => {
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

    useEffect(() => {
        fetchProducts(searchInput);
        return () => fetchProducts.cancel();
    }, [searchInput, fetchProducts]);

    const addToCart = (product) => {
        let discount = 0;
        if (product.discountPercent > 0) {
            discount = (product.price * product.discountPercent) / 100;
        } else if (product.discountAmount > 0) {
            discount = product.discountAmount;
        }

        const currentCart = receiptInfo?.cart ?? [];
        const found = currentCart.find((i) => i.productID === product.productID);
        let updatedCart;

        if (found) {
            updatedCart = currentCart.map((i) =>
                i.productID === product.productID
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            );
        } else {
            updatedCart = [...currentCart, {
                ...product,
                quantity: 1,
                discount,
                tax: 0
            }];
        }

        dispatch(setReceiptInfo({ receiptInfo: { cart: updatedCart } }));
    };

    const removeFromCart = (productID) => {
        const currentCart = receiptInfo?.cart ?? [];
        const updatedCart = currentCart.filter((i) => i.productID !== productID);
        dispatch(setReceiptInfo({ receiptInfo: { cart: updatedCart } }));
    };

    const handleBarcodeScan = async (e) => {
        if (e.key === 'Enter' && barcodeInput.trim()) {
            try {
                const results = await ProductService.GetProduct(barcodeInput.trim());
                const product = Array.isArray(results)
                    ? results.find(p => p.barcode === barcodeInput.trim())
                    : null;

                if (product) {
                    addToCart(product);
                } else {
                    console.warn('Product not found');
                }
            } catch (error) {
                console.error('Error scanning barcode:', error);
            }
            setBarcodeInput('');
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isSearching) {
                barcodeInputRef.current?.focus();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isSearching]);

    useEffect(() => {
        if (isSearch) {
            setIsSearching(isSearch);
        }
    }, [isSearch]);

    return (
        <Container>
            <Typography variant="h4" gutterBottom fontWeight={700} color="primary.main">
                Point of Sale
            </Typography>
            <Stack direction={{ sm: 'column', md: 'row' }} spacing={3}>
                {/* Product Search & Barcode */}
                <Card sx={{ flex: 1, p: 2, boxShadow: 3 }}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                            <SearchIcon color="action" />
                            <Typography variant="h6" fontWeight={600}>
                                Product Lookup
                            </Typography>
                        </Stack>
                        <input
                            ref={barcodeInputRef}
                            value={barcodeInput}
                            onChange={(e) => setBarcodeInput(e.target.value)}
                            onKeyDown={handleBarcodeScan}
                            style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }}
                            autoFocus
                        />
                        <Autocomplete
                            value={searchValue}
                            onChange={(event, newValue) => {
                                if (newValue) {
                                    addToCart(newValue);
                                    setSearchValue(null);
                                    setSearchInput('');
                                }
                            }}
                            inputValue={searchInput}
                            onInputChange={(event, newInputValue) => {
                                setSearchInput(newInputValue);
                                setIsSearching(true);
                            }}
                            options={searchResults || []}
                            getOptionLabel={(option) => option.name || ''}
                            isOptionEqualToValue={(option, value) => option.productID === value.productID}
                            loading={loading}
                            onBlur={() => setIsSearching(false)}
                            onFocus={() => setIsSearching(true)}
                            renderOption={(props, option) => (
                                <Box
                                    component="li"
                                    {...props}
                                    sx={{
                                        '&.Mui-focusVisible': {
                                            backgroundColor: 'red',
                                            color: '#1976d2',
                                        },
                                    }}
                                >
                                    {option.name}
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search Product"
                                    variant="outlined"
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
                        <Typography variant="caption" color="text.secondary" mt={1} display="block">
                            Scan barcode or search by product name.
                        </Typography>
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                Quick Select
                            </Typography>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                    gap: 2,
                                    maxHeight: 300,
                                    overflowY: 'auto',
                                }}
                            >
                                {allProducts.map((product) => {
                                    const isInCart = receiptInfo?.cart?.some((item) => item.productID === product.productID);

                                    return (
                                        <Card
                                            key={product.productID}
                                            sx={{
                                                p: 1,
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                backgroundColor: isInCart ? '#e0f7fa' : 'white',
                                                border: isInCart ? '2px solid #0288d1' : '1px solid #e0e0e0',
                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                                '&:hover': {
                                                    boxShadow: 6,
                                                    transform: 'scale(1.02)',
                                                },
                                            }}
                                            onClick={() => addToCart(product)}
                                        >
                                            <Typography variant="body2" fontWeight={600}>
                                                {product.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                ₹{product.price.toFixed(2)}
                                            </Typography>
                                            {product.discountPercent > 0 && (
                                                <Typography variant="caption" color="green">
                                                    {product.discountPercent}% OFF
                                                </Typography>
                                            )}
                                        </Card>
                                    );
                                })}
                            </Box>

                        </Box>
                    </CardContent>
                </Card>

                {/* Cart Section */}
                <CartPage removeFromCart={removeFromCart} />
            </Stack>
        </Container>
    );
};

export default SalesPOSPage;
