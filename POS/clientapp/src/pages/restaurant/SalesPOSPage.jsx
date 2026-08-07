import React, { useState, useMemo, useRef } from 'react';
import { Box, Grid, Drawer, Dialog, DialogContent, Stack, Typography, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useDispatch, useSelector } from 'react-redux';
import useIsMobile from '../../components/useIsMobile';
import CartPanel from './CartPanel';
import KOTManager from './KOTManager';
import ReceiptPrintWrapper from './ReceiptPrintWrapper';
import PrinterSettings from '../../components/PrinterSettings';
import POSHeader from './POSHeader';
import ActiveTablesSection from './ActiveTablesSection';
import ProductPanel from './ProductPanel';
import useInitialPOSData from './hooks/useInitialPOSData';
import useCartActions from './hooks/useCartActions';
import useKOTActions from './hooks/useKOTActions';
import usePrintActions from './hooks/usePrintActions';
import { manualProductSync, getProductsSync } from '../../hooks/useProductSync';
import { showAlert } from '../../store/reducers/alert';

const SalesPOSPage = () => {
    const dispatch = useDispatch();
    const isMobile = useIsMobile();

    const { receiptInfo, draftCarts, basicSettings } = useSelector(state => state.sales);

    // ---------- Local UI state ----------
    const [printerSettingsOpen, setPrinterSettingsOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [selectedTable, setSelectedTable] = useState(null);
    const [isKOTModalOpen, setKOTModalOpen] = useState(false);
    const [isCartDrawerOpen, setCartDrawerOpen] = useState(false);
    // Active tables take up real estate the product grid needs on a phone,
    // so start collapsed on mobile; desktop keeps its previous default.
    const [showTableLayout, setShowTableLayout] = useState(() => !isMobile);
    const [barcodeValue, setBarcodeValue] = useState('');
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const barcodeRef = useRef(null);

    // ---------- Data loading / startup ----------
    const { products, setProducts, loading, setLoading } = useInitialPOSData({
        draftCarts,
        selectedTable,
        setSelectedTable,
        barcodeRef,
    });

    // ---------- Cart / KOT / Print logic ----------
    const { addToCart, updateQuantity, removeFromCart, submitBarcode } = useCartActions({ receiptInfo, products });
    const { handleSaveKOT, handleLoadKOT, handleDeleteKOT, handleNewOrder } = useKOTActions({
        receiptInfo, draftCarts, selectedTable, setSelectedTable, setKOTModalOpen,
    });


    const { handlePrintKOT, handlePrintOrder, handlePrintReceipt, handleTestPrinter } = usePrintActions({
        basicSettings, receiptInfo, selectedTable,
    });

    const handleBarcodeSubmit = () => {
        if (submitBarcode(barcodeValue)) setBarcodeValue('');
    };

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

    const handleCheckout = () => setPaymentModalOpen(true);
    const handlePaymentSuccess = () => setPaymentModalOpen(false);
    const handlePaymentClose = () => setPaymentModalOpen(false);

    const cartItems = receiptInfo?.saleItems || [];
    const cartTotal = receiptInfo?.netAmount || receiptInfo?.totalAmount || 0;
    const showMobileCartBar = isMobile && cartItems.length > 0 && !isCartDrawerOpen;

    const onOpenPrinterSettings = () => {
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView?.postMessage('OPEN_SETTINGS');
        }
        else {
            setPrinterSettingsOpen(true);
        }
    }

    return (
        <Box
            sx={{
                height: 'calc(100vh - 80px)',
                display: 'flex',
                flexDirection: 'column',
                px: 2,          // left & right padding
                pt: 0,
                width: 'auto',
                mx: { xs: -2, sm: -5 },
                // leave room so the sticky bottom cart bar never covers the last product row
                pb: showMobileCartBar ? '72px' : 1,
            }}
        >
            <POSHeader
                selectedTable={selectedTable}
                isMobile={isMobile}
                cartItemCount={cartItems.length}
                onSaveKOT={handleSaveKOT}
                onViewKOTs={() => {
                    setShowTableLayout(!showTableLayout);   // expand the active tables section

                }}
                onNewOrder={handleNewOrder}
                onPrintOrder={handlePrintOrder}
                onTestPrinter={handleTestPrinter}
                onOpenPrinterSettings={() => onOpenPrinterSettings()}
                onToggleCartDrawer={toggleCartDrawer}
            />

            {/* Main Grid: left column (active tables + products) sits beside a
                right column that CartPanel fills top-to-bottom, independent of
                whatever height the active-tables strip takes above the grid. */}
            <Grid container spacing={1} sx={{ flex: 1, minHeight: 0, width: '100%', margin: 0 }}>
                {/* Left column: active tables + product panel */}
                <Grid
                    size={{ xs: 12, md: 8, lg: 7 }}
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}
                >
                    <ActiveTablesSection
                        draftCarts={draftCarts}
                        selectedTable={selectedTable}
                        showTableLayout={showTableLayout}
                        onToggleShow={setShowTableLayout}
                        onSelectTable={handleLoadKOT}
                        onDeleteTable={handleDeleteKOT}
                        onPrintKOT={handlePrintKOT}
                    />
                    <Box sx={{ flex: 1, minHeight: 0 }}>
                        <ProductPanel
                            filteredProducts={filteredProducts}
                            searchInput={searchInput}
                            onSearchInputChange={setSearchInput}
                            onSelectProduct={addToCart}
                            barcodeRef={barcodeRef}
                            barcodeValue={barcodeValue}
                            onBarcodeValueChange={setBarcodeValue}
                            onBarcodeSubmit={handleBarcodeSubmit}
                            loading={loading}
                            onRefresh={refreshProducts}
                            cartItems={cartItems}
                            onAddToCart={addToCart}
                        />
                    </Box>
                </Grid>

                {/* Cart Panel (desktop) — full height of the row */}
                {!isMobile && (
                    <Grid size={{ md: 4, lg: 5 }} sx={{ height: '100%' }}>
                        <CartPanel
                            cartItems={cartItems}
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

            {/* Mobile Cart Drawer - FIXED: Added onClose prop */}
            {isMobile && (
                <Drawer
                    anchor="bottom"
                    open={isCartDrawerOpen}
                    onClose={toggleCartDrawer}
                    PaperProps={{
                        sx: { maxHeight: '85vh', borderTopLeftRadius: 16, borderTopRightRadius: 16, p: 2 },
                    }}
                >
                    <CartPanel
                        cartItems={cartItems}
                        totalAmount={receiptInfo?.totalAmount || 0}
                        totalItems={receiptInfo?.totalItems || 0}
                        subtotal={receiptInfo?.totalAmount || 0}
                        cgst={receiptInfo?.cgst || 0}
                        sgst={receiptInfo?.sgst || 0}
                        netAmount={receiptInfo?.netAmount || receiptInfo?.totalAmount || 0}
                        halfGstRate={receiptInfo?.halfGstRate || 0}
                        onCheckout={() => { toggleCartDrawer(); handleCheckout(); }}
                        onUpdateQuantity={updateQuantity}
                        onRemoveItem={removeFromCart}
                        onPrintOrder={handlePrintOrder}
                        isMobile={true}
                        onClose={toggleCartDrawer}  // <-- THIS WAS MISSING
                    />
                </Drawer>
            )}

            {/* Sticky bottom cart bar (mobile only, shown once something's in the cart) —
                a tiny badge tucked in the header is easy to miss; a persistent bar at the
                thumb-reachable bottom of the screen is the standard, discoverable pattern. */}
            {showMobileCartBar && (
                <Box
                    onClick={toggleCartDrawer}
                    sx={{
                        position: 'fixed',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        bgcolor: 'primary.main',
                        color: 'white',
                        px: 2,
                        py: 1.5,
                        pb: 'calc(12px + env(safe-area-inset-bottom))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        boxShadow: '0 -4px 12px rgba(0,0,0,0.2)',
                        cursor: 'pointer',
                    }}
                >
                    <Stack direction="row" spacing={1.25} alignItems="center">
                        <Badge badgeContent={cartItems.length} color="error">
                            <ShoppingCartIcon />
                        </Badge>
                        <Typography fontWeight="bold" sx={{ fontSize: '0.9rem' }}>
                            {cartItems.length} item{cartItems.length > 1 ? 's' : ''}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography fontWeight="bold">₹{cartTotal.toFixed(2)}</Typography>
                        <Typography variant="body2" sx={{ textDecoration: 'underline' }}>
                            View Cart
                        </Typography>
                    </Stack>
                </Box>
            )}

            {/* KOT Manager Modal */}

            <KOTManager
                open={isKOTModalOpen}
                onClose={() => setKOTModalOpen(false)}
                drafts={draftCarts}
                onLoad={handleLoadKOT}
                onDelete={handleDeleteKOT}
                onPrintKOT={handlePrintKOT}
            />

            {/* Payment Modal */}
            <Dialog
                open={paymentModalOpen}
                onClose={handlePaymentClose}
                fullWidth
                maxWidth="sm"
                fullScreen={isMobile}
                scroll="body"
                PaperProps={{ sx: { borderRadius: isMobile ? 0 : 3 } }}
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