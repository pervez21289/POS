import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Container, Typography, TextField,
    Box, Autocomplete, CircularProgress,
    Card, CardContent, Stack,
    Button, Dialog, DialogTitle, DialogContent,
    DialogActions, IconButton, List, ListItem, ListItemText
} from '@mui/material';

import { showConfirmDialog } from '../../store/reducers/confirm';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import { useDispatch, useSelector } from 'react-redux';
import {
    setReceiptInfo,
    saveDraftCart,
    loadDraftCart,
    deleteDraftCart,
    updateDraftCart
} from './../../store/reducers/sales';
import { setPlan } from './../../store/reducers/users';
import useIsMobile from './../../components/useIsMobile';
import ProductService from './../../services/ProductService';
import PrintIcon from '@mui/icons-material/Print';
import { showAlert } from "./../../store/reducers/alert";
import ProductCard from './ProductCard';

import { manualProductSync, getProductsSync, getSettingsSync, saveSettingsSync } from '../../hooks/useProductSync';
import { useNavigate } from 'react-router-dom';
import PaymentService from '../../services/PaymentService';


const SalesPOSPage = () => {
    const Navigate = useNavigate(); 

    const isOnline = navigator.onLine;
    const dispatch = useDispatch();
    const isMobile = useIsMobile();
   

    const [searchInput, setSearchInput] = useState('');
    const [ offlineProducts, setOfflineproducts ] = useState(null);
    

    const [isLoading, setIsLoading] = useState(true);
    const [barcodeInput, setBarcodeInput] = useState(''); 
    const barcodeInputRef = useRef(null);
    const [searchValue, setSearchValue] = useState(null);
  
    const [isKOTUpdate, setKOTUpdate] = useState([]);
    const [loading, setLoading] = useState(false);
    const [draftModalOpen, setDraftModalOpen] = useState(false);
    const [tableNoError, setTableNoError] = useState('');
    const { receiptInfo, isSearch, draftCarts } = useSelector((state) => state.sales);
    const [tableNo, setTableNo] = useState(null);
    

 

    const addToCart = (product) => {
        let discount = 0;
       
        const currentCart = receiptInfo?.saleItems ?? [];
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

        dispatch(setReceiptInfo({ receiptInfo: { saleItems: updatedCart } }));
    };

    const handleNewCart = () => {
       
        dispatch(setReceiptInfo({ receiptInfo: { saleItems: [] } }));
        setNewToken();
    }

    const setNewToken = () => {
        const maxAge = draftCarts.length
            ? Math.max(...draftCarts.map(item => item.tableNo))
            : null;
        setTableNo(maxAge + 1 || '1'); 
    };


    const cartProductIds = useMemo(() =>
        new Set(receiptInfo?.saleItems?.map(item => item.productID)), [receiptInfo?.saleItems]);

    const handleSaveKOT = () => {
        const existingDraft = draftCarts.find(d => d.tableNo === tableNo);

        if (existingDraft) {
            dispatch(updateDraftCart({
                tableNo,
                saleItems: receiptInfo.saleItems
            }));
            handlePrintDraft({ tableNo, saleItems: receiptInfo.saleItems });
        } else {
            if (receiptInfo.saleItems) {
                dispatch(saveDraftCart(tableNo));
                setTableNo(Number(tableNo) + 1);
                handlePrintDraft({ tableNo, saleItems: receiptInfo.saleItems });
            }
            else {
                dispatch(showAlert({ open: true, message: 'Cart is empty!', severity: 'warning', vertical: 'top', horizontal:'center' }));
            }
        }

        
    };



    const handlePrintDraft = (draft) => {
        
        const txtPrint = generateKOTText(draft.tableNo, draft.saleItems || []);
        if (window.ReactNativeWebView) {
            handlePrintMobile(txtPrint);
        } else {
            handlePrintWeb(txtPrint);
        }
    };


    const handleLoadDraft = (id) => {
        const hasCartItems = receiptInfo.saleItems && receiptInfo.saleItems.length > 0;

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
                    setKOTUpdate(true);
                    setTableNo(id);
                }
            }));
           
        } else {
            dispatch(loadDraftCart(id));
            setDraftModalOpen(false);
            setTableNo(id);
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
        lines.push(`Token No: ${tableNo}   ${formatDate(new Date())}`);
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

    const handleRefreshProducts = async () => {
        await manualProductSync().then(() => {
            getProductsSync().then((products) => {
                setOfflineproducts(products);
            });
        });
    };


    useEffect(() => {

        PaymentService.GetCurrentActivePlan().then((plan) => {

            dispatch(setPlan(plan));
            if (plan?.planStatus === 'Active') {
                setIsLoading(false);
            }
            else {
                Navigate('/subscriptionplan');
            }

        }).catch((err) => { Navigate('/subscriptionplan'); });


        if (navigator.onLine) {
            handleRefreshProducts();
        }
        else {
            getProductsSync().then((products) => {
                setOfflineproducts(products);
            });
        }
        setNewToken();
    }, []);


    if (!offlineProducts && isLoading) return <p>Loading...</p>;

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
                                        
                                    }}
                                    options={offlineProducts || []}
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
                                            label="Search by product name"
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
                              
                            </Stack>

                            {/* Right Side: Table No + Action Buttons */}
                            <Stack direction="row" spacing={1} alignItems="right" flexShrink={0}>
                                <Box
                                    sx={{
                                       
                                        fontWeight: "bold",
                                        padding: "6px 12px",
                                        borderRadius: "8px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        minWidth: 90,
                                        fontSize: "16px",
                                        background: "#faad14",
                                        color: "#fff",
                                        border: "2px solid #faad14"
                                        
                                    }}
                                >
                                    Token No: {tableNo}
                                </Box>

                                <Button
                                    variant="outlined"
                                    color="warning"
                                    size="small"
                                    onClick={handleSaveKOT}
                                    sx={{ height: 35 }}
                                >
                                    Print KOT
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="warning"
                                    size="small"
                                    onClick={() => setDraftModalOpen(true)}
                                    sx={{ height: 35 }}
                                >
                                    View KOT
                                </Button>
                            </Stack>

                        </Box>


                        <Box >
                            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                                {/* Left side */}
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Quick Select
                                </Typography>

                                {/* Right side buttons */}
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        onClick={handleNewCart}
                                        sx={{ minWidth: 120 }}
                                    >
                                        New
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        onClick={handleRefreshProducts}
                                        sx={{ minWidth: 120 }}
                                    >
                                        Refresh
                                    </Button>
                                </Stack>
                            </Box>


                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                    gap:1,
                                    maxHeight: 450,
                                    overflowY: 'auto',
                                }}
                            >
                                {offlineProducts?.map(product => (
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
            <Dialog open={draftModalOpen} onClose={() => { setDraftModalOpen(false); setNewToken(); } } maxWidth="sm" fullWidth>
                <DialogTitle>Saved Orders</DialogTitle>
                <DialogContent dividers>
                    {receiptInfo?.saleItems?.length > 0 && (
                        <Typography variant="caption" color="text.secondary" mb={2}>
                            Current cart will be replaced when loading a KOT.
                        </Typography>
                    )}
                    <List>
                        {draftCarts?.map((draft) => (
                            <ListItem
                                key={draft.id}
                                secondaryAction={
                                    <Stack direction="row" spacing={1}>
                                        <IconButton edge="end" onClick={() => handlePrintDraft(draft)} color="primary">
                                            <PrintIcon />
                                        </IconButton>
                                        <IconButton edge="end" onClick={() => handleLoadDraft(draft.tableNo)} >
                                            <RestoreIcon />
                                        </IconButton>
                                    </Stack>
                                }
                            >
                                <IconButton edge="start" onClick={() => handleDeleteDraft(draft.tableNo)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                                <ListItemText
                                    primary={`Token No: ${draft.tableNo || 'N/A'}`}
                                    secondary={`${new Date(draft.savedAt).toLocaleString()}`}
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
