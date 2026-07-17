import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Box, Grid, Paper, Typography, TextField, IconButton,
    Button, Stack, Chip, Autocomplete, CircularProgress,
    Drawer, useMediaQuery, useTheme, Avatar, Divider, Badge,
    Dialog, DialogContent
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useDispatch, useSelector } from 'react-redux';
import { setReceiptInfo, saveDraftCart, loadDraftCart, deleteDraftCart, updateDraftCart } from '../../store/reducers/sales';
import { showAlert } from '../../store/reducers/alert';
import { showConfirmDialog } from '../../store/reducers/confirm';
import { setPlan } from '../../store/reducers/users';
import { useNavigate } from 'react-router-dom';
import useIsMobile from '../../components/useIsMobile';
import PaymentService from '../../services/PaymentService';
import { manualProductSync, getProductsSync } from '../../hooks/useProductSync';
import ProductCard from './ProductCard';
import CartPanel from './CartPanel';
import KOTManager from './KOTManager';
import ReceiptPrintWrapper from './ReceiptPrintWrapper';
import { setDrawerComponent } from '../../store/reducers/drawer';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SearchIcon from '@mui/icons-material/Search';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import RefreshIcon from '@mui/icons-material/Refresh';
import TableBarIcon from '@mui/icons-material/TableBar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import { printReceipt, testPrinter, checkService, listPrinters } from './receiptPrinter';
import PrinterSettings from '../../components/PrinterSettings';

// TableCard Component for displaying saved KOTs
const TableCard = ({ tableNo, items, isSelected, onSelect, onDelete, storeInfo, onPrintKOT }) => {
    const itemCount = items?.length || 0;
    const totalAmount = items?.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0) || 0;

    const handlePrintKOT = async (e) => {
        e.stopPropagation();
        await onPrintKOT(tableNo, items);
    };

    return (
        <Paper
            elevation={isSelected ? 8 : 2}
            sx={{
                p: 2,
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: isSelected ? '2px solid' : '2px solid transparent',
                borderColor: isSelected ? 'primary.main' : 'transparent',
                bgcolor: isSelected ? 'primary.50' : 'white',
                position: 'relative',
                minHeight: 120,
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                    bgcolor: isSelected ? 'primary.50' : 'grey.50',
                },
            }}
            onClick={onSelect}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                        sx={{
                            bgcolor: isSelected ? 'primary.main' : 'primary.light',
                            width: 36,
                            height: 36,
                        }}
                    >
                        <TableBarIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" color={isSelected ? 'primary.main' : 'text.primary'}>
                        Table {tableNo}
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5}>
                    <IconButton
                        size="small"
                        onClick={handlePrintKOT}
                        sx={{
                            color: 'primary.main',
                            '&:hover': { bgcolor: 'primary.lighter' },
                        }}
                        title="Print KOT"
                    >
                        <PrintIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        sx={{
                            color: 'error.main',
                            '&:hover': { bgcolor: 'error.lighter' },
                        }}
                        title="Delete"
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
            </Stack>

            <Divider sx={{ mb: 1 }} />

            <Stack spacing={0.5} flex={1}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                        Items:
                    </Typography>
                    <Chip
                        label={itemCount}
                        size="small"
                        color={isSelected ? 'primary' : 'default'}
                        sx={{ height: 20, fontSize: '0.75rem' }}
                    />
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                        Amount:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color={isSelected ? 'primary.main' : 'text.primary'}>
                        ₹{totalAmount.toFixed(2)}
                    </Typography>
                </Stack>
            </Stack>

            {isSelected && (
                <Chip
                    label="Active"
                    size="small"
                    color="primary"
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        height: 20,
                        fontSize: '0.65rem',
                    }}
                />
            )}
        </Paper>
    );
};

const SalesPOSPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const theme = useTheme();

    const { receiptInfo, draftCarts, basicSettings } = useSelector(state => state.sales);
    const [printerSettingsOpen, setPrinterSettingsOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [selectedTable, setSelectedTable] = useState(null);
    const [isKOTModalOpen, setKOTModalOpen] = useState(false);
    const [isCartDrawerOpen, setCartDrawerOpen] = useState(false);
    const [showTableLayout, setShowTableLayout] = useState(true);
    const [loading, setLoading] = useState(false);
    const [barcodeValue, setBarcodeValue] = useState('');
    const barcodeRef = useRef(null);

    // Payment modal state
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);

    // Load initial data
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const plan = await PaymentService.GetCurrentActivePlan();
                dispatch(setPlan(plan));
                if (plan?.planStatus !== 'Active') {
                    navigate('/subscriptionplan');
                    return;
                }
                let productList;
                if (navigator.onLine) {
                    await manualProductSync();
                    productList = await getProductsSync();
                } else {
                    productList = await getProductsSync();
                }
                setProducts(productList || []);
                setLoading(false);
            } catch (err) {
                navigate('/subscriptionplan');
            }
        };
        loadInitialData();

        if (!selectedTable && draftCarts.length > 0) {
            const maxTable = Math.max(...draftCarts.map(d => d.tableNo), 0);
            setSelectedTable(maxTable + 1);
        } else if (!selectedTable) {
            setSelectedTable(1);
        }

        // Check printer service on load (optional)
        const checkPrinter = async () => {
            try {
                const isAvailable = await checkService();
                if (isAvailable) {
                    const printerList = await listPrinters();
                    console.log('✅ Printer service available:', printerList);
                } else {
                    console.warn('⚠️ Printer service not available');
                }
            } catch (error) {
                console.error('Printer check failed:', error);
            }
        };
        checkPrinter();
    }, []);

    useEffect(() => {
        if (barcodeRef.current) barcodeRef.current.focus();
    }, []);

    // ---------- Cart Functions ----------
    const addToCart = (product) => {
        const currentCart = receiptInfo?.saleItems || [];
        const existing = currentCart.find(i => i.productID === product.productID);
        let updatedCart;
        if (existing) {
            updatedCart = currentCart.map(i =>
                i.productID === product.productID ? { ...i, quantity: i.quantity + 1 } : i
            );
        } else {
            updatedCart = [...currentCart, { ...product, quantity: 1, discount: 0, tax: 0 }];
        }
        dispatch(setReceiptInfo({ receiptInfo: { saleItems: updatedCart } }));
    };

    const updateQuantity = (productID, qty) => {
        const currentCart = receiptInfo?.saleItems || [];
        const updated = currentCart.map(i =>
            i.productID === productID ? { ...i, quantity: Math.max(1, Number(qty)) } : i
        );
        dispatch(setReceiptInfo({ receiptInfo: { saleItems: updated } }));
    };

    const removeFromCart = (productID) => {
        const currentCart = receiptInfo?.saleItems || [];
        const filtered = currentCart.filter(i => i.productID !== productID);
        dispatch(setReceiptInfo({ receiptInfo: { saleItems: filtered } }));
    };

    const handleBarcodeSubmit = () => {
        const scanned = barcodeValue.trim();
        if (!scanned) return;
        const product = products.find(p => p.barcode === scanned);
        if (product) {
            addToCart(product);
            setBarcodeValue('');
        } else {
            dispatch(showAlert({ open: true, message: 'Product not found', severity: 'warning' }));
        }
    };

    // ---------- KOT Functions ----------
    const handleSaveKOT = () => {
        if (!receiptInfo?.saleItems?.length) {
            dispatch(showAlert({ open: true, message: 'Cart is empty!', severity: 'warning' }));
            return;
        }
        const existing = draftCarts.find(d => d.tableNo === selectedTable);
        if (existing) {
            dispatch(updateDraftCart({ tableNo: selectedTable, saleItems: receiptInfo.saleItems }));
        } else {
            dispatch(saveDraftCart(selectedTable));
        }
        dispatch(showAlert({ open: true, message: `KOT saved for Table ${selectedTable}`, severity: 'success' }));
    };

    const handleLoadKOT = (tableNo) => {
        const hasItems = receiptInfo?.saleItems?.length > 0;
        const confirmAction = () => {
            dispatch(loadDraftCart(tableNo));
            setSelectedTable(tableNo);
            setKOTModalOpen(false);
        };
        if (hasItems) {
            dispatch(showConfirmDialog({
                title: 'Replace Cart?',
                message: 'Your current cart will be replaced. Continue?',
                confirmText: 'Yes, Replace',
                cancelText: 'Cancel',
                confirmColor: 'warning',
                onConfirm: confirmAction
            }));
        } else {
            confirmAction();
        }
    };

    const handleDeleteKOT = (tableNo) => {
        dispatch(deleteDraftCart(tableNo));
    };

    const handleNewOrder = () => {
        dispatch(setReceiptInfo({ receiptInfo: { saleItems: [] } }));
        const newTable = draftCarts.length ? Math.max(...draftCarts.map(d => d.tableNo), 0) + 1 : 1;
        setSelectedTable(newTable);
    };

    // ---------- Payment Functions ----------
    const handleCheckout = () => {
        setPaymentModalOpen(true);
    };

    const handlePaymentSuccess = () => {
        setPaymentModalOpen(false);
    };

    const handlePaymentClose = () => {
        setPaymentModalOpen(false);
    };

    // ---------- UI Functions ----------
    const toggleCartDrawer = () => setCartDrawerOpen(!isCartDrawerOpen);

    const filteredProducts = useMemo(() => {
        if (!searchInput) return products;
        const lower = searchInput.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(lower) ||
            p.barcode?.includes(searchInput)
        );
    }, [products, searchInput]);

    const refreshProducts = async () => {
        setLoading(true);
        if (navigator.onLine) {
            await manualProductSync();
            const updated = await getProductsSync();
            setProducts(updated || []);
            dispatch(showAlert({ open: true, message: 'Products refreshed!', severity: 'success' }));
        } else {
            dispatch(showAlert({ open: true, message: 'Offline – using cached products', severity: 'info' }));
        }
        setLoading(false);
    };

    // ---------- PRINT FUNCTIONS ----------

    // ---------- PRINT FUNCTIONS ----------

    // 1. Print KOT for a specific table
    const handlePrintKOT = async (tableNo, items) => {
        if (!items?.length) {
            dispatch(showAlert({
                open: true,
                message: 'No items to print!',
                severity: 'warning'
            }));
            return;
        }

        try {
            const kotNo = `KOT${Date.now().toString().slice(-6)}`;
            const totalAmount = items.reduce((sum, item) => sum + ((item.salePrice || item.price || 0) * item.quantity), 0);

            const result = await printReceipt({
                type: 'kot',
                storeInfo: {
                    storeName: basicSettings?.storeName || 'My Store',
                    address: basicSettings?.address || 'Store Address',
                    gstin: basicSettings?.gstin || '-'
                },
                items: items.map(item => ({
                    name: item.name,
                    barcode: item.barcode || '-',
                    quantity: item.quantity,
                    price: item.salePrice || item.price || 0,
                })),
                tableNo: tableNo,
                kotNo: kotNo,
                subtotal: totalAmount,  // Pass subtotal here
                itemCount: items.length  // Pass item count here
            });

            if (result.success) {
                dispatch(showAlert({
                    open: true,
                    message: `✅ KOT printed for Table ${tableNo}`,
                    severity: 'success'
                }));
            } else {
                throw new Error(result.error || 'Print failed');
            }
        } catch (error) {
            dispatch(showAlert({
                open: true,
                message: `❌ Print failed: ${error.message}`,
                severity: 'error'
            }));
        }
    };

    // 2. Print current order (KOT for current cart)
    const handlePrintOrder = async () => {
        if (!receiptInfo?.saleItems?.length) {
            dispatch(showAlert({
                open: true,
                message: 'Cart is empty!',
                severity: 'warning'
            }));
            return;
        }

        try {
            const kotNo = `KOT${Date.now().toString().slice(-6)}`;
            const totalAmount = receiptInfo.saleItems.reduce((sum, item) => sum + ((item.salePrice || item.price || 0) * item.quantity), 0);

            const result = await printReceipt({
                type: 'kot',
                storeInfo: {
                    storeName: basicSettings?.storeName || 'My Store',
                    address: basicSettings?.address || 'Store Address',
                    gstin: basicSettings?.gstin || '-'
                },
                items: receiptInfo.saleItems.map(item => ({
                    name: item.name,
                    barcode: item.barcode || '-',
                    quantity: item.quantity,
                    price: item.salePrice || item.price || 0,
                })),
                tableNo: selectedTable,
                kotNo: kotNo,
                subtotal: totalAmount,  // Pass subtotal here
                itemCount: receiptInfo.saleItems.length  // Pass item count here
            });

            if (result.success) {
                dispatch(showAlert({
                    open: true,
                    message: `✅ KOT printed for Table ${selectedTable}`,
                    severity: 'success'
                }));
            } else {
                throw new Error(result.error || 'Print failed');
            }
        } catch (error) {
            dispatch(showAlert({
                open: true,
                message: `❌ Print failed: ${error.message}`,
                severity: 'error'
            }));
        }
    };

    // 3. Print Sale Receipt (called after successful payment)
    const handlePrintReceipt = async (saleData) => {
        try {
            const totalAmount = saleData.items.reduce((sum, item) => sum + ((item.salePrice || item.price || 0) * item.quantity), 0);

            const result = await printReceipt({
                type: 'sale',
                storeInfo: {
                    storeName: basicSettings?.storeName || 'My Store',
                    address: basicSettings?.address || 'Store Address',
                    gstin: basicSettings?.gstin || '-'
                },
                items: saleData.items.map(item => ({
                    name: item.name,
                    barcode: item.barcode || '-',
                    quantity: item.quantity,
                    price: item.salePrice || item.price || 0,
                })),
                sale: {
                    billNo: saleData.billNo || `BILL-${Date.now()}`,
                    saleTime: new Date().toLocaleString(),
                    userName: saleData.userName || 'Cashier',
                    customerName: saleData.customerName || '',
                    mobileNumber: saleData.mobileNumber || '',
                    totalAmount: totalAmount,
                    cgst: saleData.cgst || 0,
                    sgst: saleData.sgst || 0,
                    halfGstRate: saleData.halfGstRate || 0,
                    netAmount: saleData.netAmount || totalAmount
                },
                itemCount: saleData.items.length  // Pass item count here
            });

            if (result.success) {
                console.log('✅ Sale receipt printed successfully');
                return result;
            } else {
                throw new Error(result.error || 'Print failed');
            }
        } catch (error) {
            console.error('❌ Receipt print error:', error);
            dispatch(showAlert({
                open: true,
                message: `❌ Receipt print failed: ${error.message}`,
                severity: 'error'
            }));
            throw error;
        }
    };

    // 4. Test Printer
    const handleTestPrinter = async () => {
        try {
            const result = await testPrinter();
            if (result.success) {
                dispatch(showAlert({
                    open: true,
                    message: '✅ Test print successful!',
                    severity: 'success'
                }));
            } else {
                throw new Error(result.error || 'Test failed');
            }
        } catch (error) {
            dispatch(showAlert({
                open: true,
                message: `❌ Test print failed: ${error.message}`,
                severity: 'error'
            }));
        }
    };

    return (
        <Box
            sx={{
                height: 'calc(100vh - 80px)',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#f4f6f8',
                p: 1,
                width: 'auto',
                mx: { xs: -2, sm: -5 },
            }}
        >
            {/* Header */}
            <Paper
                elevation={0}
                sx={{
                    p: 1.5,
                    mb: 1.5,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1.5,
                }}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 36, height: 36 }}>
                        <RestaurantIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">POS</Typography>
                </Stack>

                <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />

                <Chip
                    icon={<ReceiptIcon />}
                    label={`Table ${selectedTable || '--'}`}
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 'bold',
                        '& .MuiChip-icon': { color: 'white' },
                    }}
                />

                <Stack direction="row" spacing={1} sx={{ flex: 1, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                        onClick={handleSaveKOT}
                    >
                        Save KOT
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                        onClick={() => setKOTModalOpen(true)}
                    >
                        View KOTs
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        color="success"
                        onClick={handleNewOrder}
                        sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
                    >
                        New Order
                    </Button>

                    {/* Print Buttons */}
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<PrintIcon />}
                        onClick={handlePrintOrder}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                        }}
                    >
                        Print KOT
                    </Button>

                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleTestPrinter}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                        }}
                    >
                        Test Printer
                    </Button>

                    <IconButton
                        size="small"
                        onClick={() => setPrinterSettingsOpen(true)}
                        sx={{ color: 'white' }}
                    >
                        <SettingsIcon />
                    </IconButton>

                    {isMobile && (
                        <Badge badgeContent={receiptInfo?.saleItems?.length || 0} color="error" sx={{ ml: 'auto' }}>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={toggleCartDrawer}
                                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                            >
                                <ShoppingCartIcon />
                            </Button>
                        </Badge>
                    )}
                </Stack>
            </Paper>

            {/* Table Layout Section - Saved KOTs */}
            {showTableLayout && draftCarts.length > 0 && (
                <Paper
                    elevation={2}
                    sx={{
                        p: 2,
                        mb: 1.5,
                        borderRadius: 3,
                        bgcolor: 'white',
                    }}
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <TableBarIcon color="primary" />
                            <Typography variant="h6" fontWeight="bold">
                                Active Tables ({draftCarts.length})
                            </Typography>
                        </Stack>
                        <IconButton
                            size="small"
                            onClick={() => setShowTableLayout(false)}
                            sx={{ color: 'text.secondary' }}
                        >
                            <Typography variant="caption" sx={{ mr: 0.5 }}>Hide</Typography>
                        </IconButton>
                    </Stack>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: 'repeat(2, 1fr)',
                                sm: 'repeat(3, 1fr)',
                                md: 'repeat(4, 1fr)',
                                lg: 'repeat(6, 1fr)',
                            },
                            gap: 2,
                        }}
                    >
                        {draftCarts.map((draft) => (
                            <TableCard
                                key={draft.tableNo}
                                tableNo={draft.tableNo}
                                items={draft.saleItems}
                                isSelected={selectedTable === draft.tableNo}
                                onSelect={() => handleLoadKOT(draft.tableNo)}
                                onDelete={() => handleDeleteKOT(draft.tableNo)}
                                storeInfo={basicSettings}
                                onPrintKOT={handlePrintKOT}
                            />
                        ))}
                    </Box>
                </Paper>
            )}

            {/* Show Tables Button when layout is hidden */}
            {!showTableLayout && draftCarts.length > 0 && (
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<TableBarIcon />}
                    onClick={() => setShowTableLayout(true)}
                    sx={{
                        mb: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                    }}
                >
                    Show Active Tables ({draftCarts.length})
                </Button>
            )}

            {/* Main Grid */}
            <Grid container spacing={1} sx={{ flex: 1, minHeight: 0, width: '100%', margin: 0 }}>
                {/* Product Grid */}
                <Grid size={{ xs: 12, md: 8, lg: 8 }} sx={{ height: '100%' }}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 1.5,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 3,
                            bgcolor: 'white',
                            overflow: 'hidden',
                        }}
                    >
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" mb={1.5}>
                            <Autocomplete
                                value={null}
                                onChange={(_, newValue) => {
                                    if (newValue) {
                                        addToCart(newValue);
                                        setSearchInput('');
                                    }
                                }}
                                inputValue={searchInput}
                                onInputChange={(_, val) => setSearchInput(val)}
                                options={filteredProducts}
                                getOptionLabel={(opt) => `${opt.name}${opt.barcode ? ` (${opt.barcode})` : ''}`}
                                isOptionEqualToValue={(opt, val) => opt.productID === val.productID}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search products"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <Box sx={{ ml: 1, mr: -1 }}>
                                                    <SearchIcon color="action" />
                                                </Box>
                                            ),
                                            endAdornment: (
                                                <>
                                                    {loading && <CircularProgress size={20} />}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                )}
                                sx={{ flex: 2 }}
                            />

                            <TextField
                                inputRef={barcodeRef}
                                value={barcodeValue}
                                onChange={(e) => setBarcodeValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleBarcodeSubmit()}
                                label="Scan Barcode"
                                size="small"
                                placeholder="Type or scan"
                                sx={{ flex: 1, minWidth: 150 }}
                                InputProps={{
                                    startAdornment: (
                                        <Box sx={{ ml: 1, mr: -1 }}>
                                            <QrCodeScannerIcon color="action" />
                                        </Box>
                                    ),
                                    endAdornment: (
                                        <IconButton onClick={handleBarcodeSubmit} size="small" edge="end">
                                            <SearchIcon />
                                        </IconButton>
                                    ),
                                }}
                            />

                            <IconButton
                                onClick={refreshProducts}
                                disabled={loading}
                                sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 1 }}
                            >
                                <RefreshIcon color={loading ? 'disabled' : 'primary'} />
                            </IconButton>
                        </Stack>

                        <Box sx={{ flex: 1, overflow: 'auto', pt: 0.5 }}>
                            {filteredProducts.length === 0 ? (
                                <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
                                    No products found
                                </Typography>
                            ) : (
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                                        gap: 1.5,
                                    }}
                                >
                                    {filteredProducts.map(product => (
                                        <ProductCard
                                            key={product.productID}
                                            product={product}
                                            isInCart={receiptInfo?.saleItems?.some(i => i.productID === product.productID)}
                                            onClick={addToCart}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                {/* Cart Panel */}
                {!isMobile && (
                    <Grid size={{ md: 4, lg: 4 }} sx={{ height: '100%' }}>
                        <CartPanel
                            cartItems={receiptInfo?.saleItems || []}
                            totalAmount={receiptInfo?.totalAmount || 0}
                            totalItems={receiptInfo?.totalItems || 0}
                            subtotal={receiptInfo?.totalAmount || 0}
                            cgst={receiptInfo?.cgst || 0}
                            sgst={receiptInfo?.sgst || 0}
                            netAmount={receiptInfo?.netAmount || receiptInfo?.totalAmount || 0}
                            halfGstRate={receiptInfo?.halfGstRate || 0}
                            onCheckout={handleCheckout}
                            onUpdateQuantity={updateQuantity}
                            onRemoveItem={removeFromCart}
                            onPrintOrder={handlePrintOrder}
                        />
                    </Grid>
                )}
            </Grid>

            {/* Mobile Cart Drawer */}
            {isMobile && (
                <Drawer
                    anchor="bottom"
                    open={isCartDrawerOpen}
                    onClose={toggleCartDrawer}
                    PaperProps={{
                        sx: {
                            maxHeight: '75vh',
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                            p: 2,
                        },
                    }}
                >
                    <CartPanel
                        cartItems={receiptInfo?.saleItems || []}
                        totalAmount={receiptInfo?.totalAmount || 0}
                        totalItems={receiptInfo?.totalItems || 0}
                        onCheckout={() => { toggleCartDrawer(); handleCheckout(); }}
                        onUpdateQuantity={updateQuantity}
                        onRemoveItem={removeFromCart}
                        onPrintOrder={handlePrintOrder}
                    />
                </Drawer>
            )}

            {/* KOT Manager Modal */}
            <KOTManager
                open={isKOTModalOpen}
                onClose={() => setKOTModalOpen(false)}
                drafts={draftCarts}
                onLoad={handleLoadKOT}
                onDelete={handleDeleteKOT}
            />

            {/* Payment Modal */}
            <Dialog
                open={paymentModalOpen}
                onClose={handlePaymentClose}
                fullWidth
                maxWidth="sm"
                scroll="body"
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogContent sx={{ p: 0 }}>
                    <ReceiptPrintWrapper
                        onClose={handlePaymentClose}
                        onSuccess={handlePaymentSuccess}
                        tableNo={selectedTable}
                        onPrintReceipt={handlePrintReceipt}
                    />
                </DialogContent>
            </Dialog>
            <PrinterSettings
                open={printerSettingsOpen}
                onClose={() => setPrinterSettingsOpen(false)}
            />
        </Box>
    );
};

export default SalesPOSPage;