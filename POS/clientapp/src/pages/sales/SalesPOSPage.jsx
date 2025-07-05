import React, { useState, useEffect, useMemo,useRef } from 'react';
import {
    Container, Typography, Button, TextField,
    Box, Autocomplete, CircularProgress, Table, TableHead, TableRow, TableCell,
    TableBody, IconButton, Card, CardContent, Paper, Divider, Stack, TableContainer
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash.debounce';
import { format } from 'date-fns';

import ProductService from './../../services/ProductService'; // Assuming you have a ProductService for API calls
import ReceiptPrintWrapper from './ReceiptPrintWrapper'

import { useDispatch, useSelector } from 'react-redux';
import {  setDrawerComponent } from "./../../store/reducers/drawer";
import { setReceiptInfo } from "./../../store/reducers/sales";


const SalesPOSPage = () => {
    const fontSize = '12px';
    const [isSearching, setIsSearching] = useState(false);
    const [barcodeInput, setBarcodeInput] = useState('');
    const barcodeInputRef = useRef(null);
    const [cart, setCart] = useState([]);
    const [searchValue, setSearchValue] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState('');
 
    const [saleId, setSaleId] = useState(null);
   
    const [billNo, setBillNo] = useState('OPI');
    const [userId, setUserId] = useState(1);
    const [saleTime, setSaleTime] = useState(format(new Date(), 'dd-MM-yyyy hh:mm a'));

    /*const { drawerOpen } = useSelector((state) => state.drawer);*/
    const { receiptInfo } = useSelector((state) => state.sales);
    const dispatch = useDispatch();

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
        let discount = 0;
        debugger;
        if (product.discountPercent > 0) {
            discount = (product.price * product.discountPercent) / 100;
        } else if (product.discountAmount > 0) {
            discount = product.discountAmount;
        }

        setCart((prev) => {
            const found = prev.find((i) => i.productID === product.productID);
            if (found) {
                return prev.map((i) =>
                    i.productID === product.productID ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, {
                ...product,
                quantity: 1,
                discount,
                tax: 0
            }];
        });
    };

    const handleBarcodeScan = async (e) => {
        if (e.key === 'Enter' && barcodeInput.trim()) {
            try {
                const results = await ProductService.GetProduct(barcodeInput.trim());
                const product = Array.isArray(results) ? results.find(p => p.barcode === barcodeInput.trim()) : null;

                if (product) {
                    addToCart(product);
                } else {
                    setStatus('Product not found');
                }
            } catch (error) {
                console.error('Error scanning barcode:', error);
                setStatus('Error fetching product');
            }
            setBarcodeInput('');
        }
    };
  

    const updateQty = (productID, qty) => {
        setCart((prev) =>
            prev.map((i) =>
                i.productID === productID ? { ...i, quantity: Math.max(1, Number(qty)) } : i
            )
        );
    };

    const removeFromCart = (productID) => {
        setCart((prev) => prev.filter((i) => i.productID !== productID));
    };

    const totalAmount = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const discountAmount = cart.reduce((sum, i) => sum + (i.discount || 0) * i.quantity, 0);
    const taxAmount = cart.reduce((sum, i) => sum + (i.tax || 0), 0);
    const net = totalAmount - discountAmount + taxAmount;


    const handleCheckout = async () => {
        try {

            const receiptInfo = { cart, totalAmount, discountAmount, taxAmount, net, billNo, saleTime, userId };
                dispatch(setReceiptInfo({ receiptInfo: receiptInfo }));
            
           // setShowReceipt(true);
            setStatus('Sale saved!');
           // setCart([]);
            setNotes('');

            setIsSearching(true);

            dispatch(
                setDrawerComponent({
                    DrawerComponentChild: ReceiptPrintWrapper,
                    drawerProps: {
                        receiptInfo: { ...receiptInfo }
                    },
                    drawerOpen: true
                })
            );

            //dispatch(openDrawer({ drawerOpen: true }));
        } catch (error) {
            console.error('Error saving sale:', error);
            setStatus('Error saving sale.');
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

        if (receiptInfo == null)
            setCart([]);

    }, [receiptInfo]);

    return (
        <Container >
            <Typography variant="h4" gutterBottom fontWeight={700} color="primary.main">
                Point of Sale
            </Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
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
                    </CardContent>
                </Card>

                {/* Cart Section */}
                <Card sx={{ flex: 2, p: 2, boxShadow: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                        <ShoppingCartIcon color="action" />
                        <Typography variant="h6" fontWeight={600}>
                            Cart
                        </Typography>
                    </Stack>
                    {cart.length === 0 ? (
                        <Typography variant="body1" color="text.secondary">
                            Cart is empty
                        </Typography>
                    ) : (
                            <TableContainer sx={{ maxHeight: 260 }}>
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontSize }}>Barcode</TableCell>
                                            <TableCell sx={{ fontSize }} align="right">Price</TableCell>
                                            <TableCell sx={{ fontSize }} align="right">Discount</TableCell>
                                            <TableCell sx={{ fontSize }} align="right">Qty</TableCell>
                                            <TableCell sx={{ fontSize }} align="right">Subtotal</TableCell>
                                            <TableCell sx={{ fontSize }} align="right">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cart.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <TableRow>
                                                    <TableCell colSpan={6} sx={{ p: 0, fontWeight: 'bold', fontSize, borderBottom: 'none' }}>
                                                        {item.name}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow key={item.productID}>
                                                    <TableCell sx={{ p: 0, fontSize }}>{item.barcode}</TableCell>
                                                    <TableCell align="right" sx={{ p: 0, fontSize }}>${item.price.toFixed(2)}</TableCell>
                                                    <TableCell align="right" sx={{ p: 0, fontSize }}>
                                                        {item.discount?.toFixed(2)}{item.discountPercent ? ` (${item.discountPercent}%)` : ''}
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize }} align="right">
                                                        <TextField
                                                            type="number"
                                                            size="small"
                                                            value={item.quantity}
                                                            onChange={(e) => updateQty(item.productID, e.target.value)}
                                                            inputProps={{ min: 1, style: { width: 50 } }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ p: 0, fontSize }}>
                                                        ${(item.quantity * (item.price - (item.discount || 0))).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ p: 0, fontSize }}>
                                                        <IconButton color="error" onClick={() => removeFromCart(item.productID)}>
                                                            <ClearIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            </React.Fragment>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                    )}


                    <TextField
                        label="Notes"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        fullWidth
                        multiline
                        minRows={1}
                        sx={{ mt: 2 }}
                    />

                    <Divider sx={{ my: 2 }} />

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                                Total: <Typography component="span" variant="h6" color="primary.main">${net.toFixed(2)}</Typography>
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Discount: ${discountAmount.toFixed(2)} | Tax: ${taxAmount.toFixed(2)}
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            disabled={cart.length === 0}
                            onClick={handleCheckout}
                            sx={{ minWidth: 140, fontWeight: 600 }}
                        >
                            Checkout
                        </Button>
                    </Stack>
                    {status && <Typography sx={{ mt: 2 }} color="success.main">{status}</Typography>}
                </Card>
            </Stack>
        </Container>
    );
};

export default SalesPOSPage;
