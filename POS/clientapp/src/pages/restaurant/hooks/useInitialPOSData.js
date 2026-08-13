import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPlan } from '../../../store/reducers/users';
import PaymentService from '../../../services/PaymentService';
import { getProductsSync } from '../../../hooks/useProductSync'; // only import getProductsSync
import { checkService, listPrinters } from '../receiptPrinter';
import { loadBasicSettings } from '../../../store/reducers/sales';

export default function useInitialPOSData({ draftCarts, selectedTable, setSelectedTable, barcodeRef }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // start with true to show loader

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // 1. Check plan (this might be heavy, but it's needed)
                const plan = await PaymentService.GetCurrentActivePlan();
                dispatch(setPlan(plan));
                dispatch(loadBasicSettings());
                if (plan?.planStatus !== 'Active') {
                    navigate('/subscriptionplan');
                    return;
                }

                // 2. Load products ONLY from local IndexedDB – no API sync
                const productList = await getProductsSync();
                setProducts(productList || []);
            } catch (err) {
                // If anything fails, redirect to subscription plan (existing behaviour)
                navigate('/subscriptionplan');
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();

        // 3. Table selection logic (unchanged)
        if (!selectedTable && draftCarts.length > 0) {
            const maxTable = Math.max(...draftCarts.map(d => d.tableNo), 0);
            setSelectedTable(maxTable + 1);
        } else if (!selectedTable) {
            setSelectedTable(1);
        }

        // 4. Printer check (non-blocking, unchanged)
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

    // Focus barcode input (unchanged)
    useEffect(() => {
        if (barcodeRef.current) barcodeRef.current.focus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { products, setProducts, loading, setLoading };
}