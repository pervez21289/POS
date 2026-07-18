import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPlan } from '../../../store/reducers/users';
import PaymentService from '../../../services/PaymentService';
import { manualProductSync, getProductsSync } from '../../../hooks/useProductSync';
import { checkService, listPrinters } from '../receiptPrinter';

// Handles the page's one-time startup work:
// - verifies the active subscription plan (redirects if not active)
// - loads the product catalog (syncing first if online)
// - picks a sensible default table number
// - checks printer service availability (best-effort, non-blocking)
// - focuses the barcode input
export default function useInitialPOSData({ draftCarts, selectedTable, setSelectedTable, barcodeRef }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const plan = await PaymentService.GetCurrentActivePlan();
                dispatch(setPlan(plan));
                if (plan?.planStatus !== 'Active') {
                    navigate('/subscriptionplan');
                    return;
                }
                if (navigator.onLine) {
                    await manualProductSync();
                }
                const productList = await getProductsSync();
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (barcodeRef.current) barcodeRef.current.focus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { products, setProducts, loading, setLoading };
}
