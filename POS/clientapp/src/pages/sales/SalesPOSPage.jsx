import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Container, Typography, TextField,
    Box, Autocomplete, CircularProgress,
    Card, CardContent, Stack,
    Button, Dialog, DialogTitle, DialogContent,
    DialogActions, IconButton, List, ListItem, ListItemText
} from '@mui/material';

import { showConfirmDialog } from '../../store/reducers/confirm';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';

import debounce from 'lodash.debounce';
import { useDispatch, useSelector } from 'react-redux';
import {
    setReceiptInfo,
    resetReceiptInfo,
    saveDraftCart,
    loadDraftCart,
    deleteDraftCart
} from './../../store/reducers/sales';

import useIsMobile from './../../components/useIsMobile';
import ProductService from './../../services/ProductService';
import CartPage from './CartPage';
import { useGetProductsQuery } from './../../services/productApi';
import ProductCard from './ProductCard';


const SalesPOSPage = () => {
    const dispatch = useDispatch();
    const isMobile = useIsMobile();
    const { data: allProducts = [], isLoading } = useGetProductsQuery('');

    const [isSearching, setIsSearching] = useState(false);
    const [barcodeInput, setBarcodeInput] = useState('');
    const barcodeInputRef = useRef(null);
    const [searchValue, setSearchValue] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [draftModalOpen, setDraftModalOpen] = useState(false);
    const [tableNoError, setTableNoError] = useState('');
    const { receiptInfo, isSearch, draftCarts } = useSelector((state) => state.sales);
    const [tableNo, setTableNo] = useState('');
    // Debounced search
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
        //if (product.discountPercent > 0) {
        //    discount = (product.price * product.discountPercent) / 100;
        //} else if (product.discountAmount > 0) {
        //    discount = product.discountAmount;
        //}

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
        dispatch(resetReceiptInfo());
    }, [dispatch]);

    const cartProductIds = useMemo(() =>
        new Set(receiptInfo?.cart?.map(item => item.productID)), [receiptInfo?.cart]);

    const handleSaveKOT = () => {
        let hasError = false;

        if (!tableNo.trim()) {
            setTableNoError('Required');
            hasError = true;
        } else {
            const isAlreadyReserved = draftCarts.some(draft => draft.tableNo === tableNo.trim());
            if (isAlreadyReserved) {
                setTableNoError('Table already reserved');
                hasError = true;
            } else {
                setTableNoError('');
            }
        }

        if (!hasError) {
            const txtPrint = generateKOTText(tableNo, receiptInfo.cart);
            if (window.ReactNativeWebView) {
                handlePrintMobile(txtPrint);
            } else {
                handlePrintWeb(txtPrint);
            }
            dispatch(saveDraftCart(tableNo.trim()));
            setTableNo('');
        }
    };


    const handleLoadDraft = (id) => {
        const hasCartItems = receiptInfo.cart && receiptInfo.cart.length > 0;

        if (hasCartItems) {
            dispatch(showConfirmDialog({
                title: 'Replace Cart?',
                message: 'Your current cart will be replaced. Do you want to continue?',
                confirmText: 'Yes, Replace',
                cancelText: 'Cancel',
                confirmColor: 'warning',
                onConfirm: () => {
                    dispatch(loadDraftCart(id));
                    setDraftModalOpen(false);
                }
            }));
           
        } else {
            dispatch(loadDraftCart(id));
            setDraftModalOpen(false);
        }
    };


    const handleDeleteDraft = (id) => {
        dispatch(deleteDraftCart(id));
    };


    const handlePrintMobile = (txtPrint) => {
        window.ReactNativeWebView?.postMessage(txtPrint);
    };


    const handlePrintWeb = (txtPrint) => {
     

        const printWindow = window.open('', '_blank', 'width=320,height=600');

        if (!printWindow) return;

        printWindow.document.write(`
        <html>
        <head>
            <title>Receipt</title>
            <style>
                @media print {
                    @page { margin: 0; }
                    body { margin: 0; font-family: monospace; font-size: 12px; }
                }
                body { font-family: monospace; white-space: pre; font-size: 12px; }
            </style>
        </head>
        <body onload="window.print(); window.close();">
            <pre>${txtPrint}</pre>
        </body>
        </html>
    `);
        printWindow.document.close();
    };

    function centerText(text, width) {
        const left = Math.floor((width - text.length) / 2);
        return ' '.repeat(left) + text;
    }

    function formatDate(date) {
        const d = date;
        return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')
            }/${d.getFullYear()}`;
    }

    function generateKOTText(tableNo, cart ) {
        const maxLine = 32;
        const padRight = (str, len) => str.padEnd(len, ' ');
        const padLeft = (str, len) => str.padStart(len, ' ');

        const lines = [];

        // Header
        lines.push(centerText('*** KITCHEN ORDER ***', maxLine));
        lines.push(`Table No: ${tableNo}   ${formatDate(new Date())}`);
        lines.push('-'.repeat(maxLine));
        lines.push(padRight('Item', 18) + 'Qty');
        lines.push('-'.repeat(maxLine));

        // Items
        cart.forEach(item => {
            const name = item.name.length > 18 ? item.name.substring(0, 18) : item.name;
            const qty = `x${item.quantity}`;
            lines.push(padRight(name, 18) + padLeft(qty, 4));
        });

        lines.push('-'.repeat(maxLine));
        lines.push(centerText('THANK YOU!', maxLine));

        return lines.join('\n');
    }

  


    if (isLoading) return <p>Loading...</p>;

    return (
      <>
            <Stack direction={{ s: 'column', sm: 'row' }} spacing={3}>
              
                <Card sx={{ flex:1, boxShadow: 3 }}>
                    <CardContent>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            flexWrap="wrap"
                            mb={2}
                            gap={2}
                        >
                            {/* Left Side: Autocomplete + Hint */}
                            <Stack direction="column" spacing={1} flex={1} minWidth={250}>
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
                                    onBlur={() => dispatch(setIsSearch(true))}
                                    onFocus={() => dispatch(setIsSearch(true))}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props}>
                                            {option.name}
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Search Product"
                                            variant="outlined"
                                            size="small"
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
                                <Typography variant="caption" color="text.secondary">
                                    Search by product name.
                                </Typography>
                            </Stack>

                            {/* Right Side: Table No + Action Buttons */}
                            <Stack direction="row" spacing={1} alignItems="right" flexShrink={0}>
                                <TextField
                                    label="Table No"
                                    value={tableNo}
                                    onChange={(e) => setTableNo(e.target.value)}
                                    error={!!tableNoError}
                                    helperText={tableNoError || ''}
                                    size="small"
                                    sx={{ width: 90 }}
                                    FormHelperTextProps={{
                                        sx: {
                                            minHeight: '10px', // ensures consistent space
                                            margin: 0,         // removes default extra margin
                                        },
                                    }}
                                />
                                <Button
                                    variant="outlined"
                                    color="warning"
                                    size="small"
                                    onClick={handleSaveKOT}
                                    sx={{ height: 40 }}
                                >
                                    Print KOT
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="warning"
                                    size="small"
                                    onClick={() => setDraftModalOpen(true)}
                                    sx={{ height: 40 }}
                                >
                                    View KOT
                                </Button>
                            </Stack>

                        </Box>


                        <Box >
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                Quick Select
                            </Typography>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                    gap:1,
                                    maxHeight: 450,
                                    overflowY: 'auto',
                                }}
                                onFocus={() => setIsSearching(true)}
                                onBlur={() => setIsSearching(false)}
                            >
                                {allProducts.map(product => (
                                    <ProductCard
                                        key={product.productID}
                                        product={product}
                                        isInCart={cartProductIds.has(product.productID)}
                                        onClick={addToCart}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Stack>

            {/* Draft Modal */}
            <Dialog open={draftModalOpen} onClose={() => setDraftModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Saved Orders</DialogTitle>
                <DialogContent dividers>
                    {receiptInfo.cart.length > 0 && (
                        <Typography variant="caption" color="text.secondary" mb={2}>
                            Current cart will be replaced when loading a KOT.
                        </Typography>
                    )}
                    <List>
                        {draftCarts?.map((draft) => (
                            <ListItem
                                key={draft.id}
                                secondaryAction={
                                    <IconButton edge="end" onClick={() => handleLoadDraft(draft.tableNo)} >
                                        <RestoreIcon />
                                    </IconButton>
                                }
                            >
                                <IconButton edge="start" onClick={() => handleDeleteDraft(draft.tableNo)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                                <ListItemText
                                    primary={`Table No: ${draft.tableNo || 'N/A'}`}
                                    secondary={`Saved: ${new Date(draft.savedAt).toLocaleString()}`}
                                />
                            </ListItem>

                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDraftModalOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
       </>
    );
};

export default SalesPOSPage;
