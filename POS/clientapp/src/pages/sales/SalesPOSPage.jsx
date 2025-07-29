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

    const { receiptInfo, isSearch, draftCarts } = useSelector((state) => state.sales);

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

    //useEffect(() => {
    //    const interval = setInterval(() => {
    //        if (!isSearching) {
    //            barcodeInputRef.current?.focus();
    //        }
    //    }, 1000);
    //    return () => clearInterval(interval);
    //}, [isSearching]);

    useMemo(() => {
        if (isSearch) {
            barcodeInputRef.current?.blur();
        }
        else {
            barcodeInputRef.current?.focus();
        }
    }, [isSearch]);

    useEffect(() => {
        dispatch(resetReceiptInfo());
    }, [dispatch]);

    const cartProductIds = useMemo(() =>
        new Set(receiptInfo?.cart?.map(item => item.productID)), [receiptInfo?.cart]);

    const handleSaveDraft = () => {
        dispatch(saveDraftCart());
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

    if (isLoading) return <p>Loading...</p>;

    return (
        <Container>
            <input
                ref={barcodeInputRef}
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={handleBarcodeScan}
                style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
                tabIndex={-1}
            />
            <Typography variant="h4" gutterBottom fontWeight={700} color="primary.main">
                Point of Sale
            </Typography>
            <Stack direction={{ s: 'column', sm: 'row' }} spacing={3}>
                {!isMobile && <CartPage />}
                <Card sx={{ flex: 3, p: 2, boxShadow: 3 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <SearchIcon color="action" />
                                <Typography variant="h6" fontWeight={600}>
                                    Product Lookup
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing={1}>
                                <Button variant="outlined" color="warning" size="small" onClick={handleSaveDraft}>
                                    Save as Draft
                                </Button>
                                <Button variant="outlined" color="warning" size="small" onClick={() => setDraftModalOpen(true)}>
                                    View Drafts
                                </Button>
                            </Stack>
                        </Box>


                       

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
                            onBlur={() =>  dispatch(setIsSearch(true))}
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
                                    gap:1,
                                    maxHeight: 300,
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
                <DialogTitle>Saved Draft Carts</DialogTitle>
                <DialogContent dividers>
                    {receiptInfo.cart.length > 0 && (
                        <Typography variant="caption" color="text.secondary" mb={2}>
                            Current cart will be replaced when loading a draft.
                        </Typography>
                    )}
                    <List>
                        {draftCarts?.map((draft) => (
                            <ListItem
                                key={draft.id}
                                secondaryAction={
                                    <IconButton edge="end" onClick={() => handleLoadDraft(draft.id)} >
                                        <RestoreIcon />
                                    </IconButton>
                                }
                            >
                                <IconButton edge="start" onClick={() => handleDeleteDraft(draft.id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                                <ListItemText
                                    primary={`Draft #${draft.id}`}
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
        </Container>
    );
};

export default SalesPOSPage;
