import React, { useState, useMemo, useRef } from 'react';
import { Box, Grid, Drawer, Dialog, DialogContent } from '@mui/material';
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
    const [showTableLayout, setShowTableLayout] = useState(true);
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
            <POSHeader
                selectedTable={selectedTable}
                isMobile={isMobile}
                cartItemCount={receiptInfo?.saleItems?.length || 0}
                onSaveKOT={handleSaveKOT}
                onViewKOTs={() => setKOTModalOpen(true)}
                onNewOrder={handleNewOrder}
                onPrintOrder={handlePrintOrder}
                onTestPrinter={handleTestPrinter}
                onOpenPrinterSettings={() => setPrinterSettingsOpen(true)}
                onToggleCartDrawer={toggleCartDrawer}
            />

            <ActiveTablesSection
                draftCarts={draftCarts}
                selectedTable={selectedTable}
                showTableLayout={showTableLayout}
                onToggleShow={setShowTableLayout}
                onSelectTable={handleLoadKOT}
                onDeleteTable={handleDeleteKOT}
                onPrintKOT={handlePrintKOT}
            />

            {/* Main Grid */}
            <Grid container spacing={1} sx={{ flex: 1, minHeight: 0, width: '100%', margin: 0 }}>
                {/* Product Panel */}
                <Grid size={{ xs: 12, md: 8, lg: 8 }} sx={{ height: '100%' }}>
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
                        cartItems={receiptInfo?.saleItems || []}
                        onAddToCart={addToCart}
                    />
                </Grid>

                {/* Cart Panel (desktop) */}
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
                        sx: { maxHeight: '75vh', borderTopLeftRadius: 16, borderTopRightRadius: 16, p: 2 },
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
