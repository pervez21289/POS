import {
    printReceipt,
    testPrinter,
    generateReceiptText,
    printViaBrowser,
    getStoredConfig,
    getStoredPrinter,
    generateReceiptHTML
} from '../receiptPrinter';
import { useSelector } from 'react-redux';
// Helper to get print method from localStorage
const getPrintMethod = () => localStorage.getItem('pos_print_method') || 'service';

const usePrintActions = ({ basicSettings, receiptInfo, selectedTable }) => {
    // Generic print dispatcher
    const printWithMethod = async (params, servicePrinterName = null) => {
        const method = getPrintMethod();
        const config = getStoredConfig();
        const lineWidth = config?.lineWidth || 28;

        // Merge store info from basicSettings
        const fullParams = {
            ...params,
            storeInfo: {
                storeName: basicSettings?.storeName || 'Store Name',
                address: basicSettings?.address || 'Store Address',
                gstin: basicSettings?.gstin || '-'
            },
            lineWidth: params.lineWidth || lineWidth
        };

        if (method === 'browser') {
            const logoUrl = basicSettings?.logoUrl || '';
            const html = await generateReceiptHTML({
                ...fullParams,
                logoUrl,
                // upiId/payeeName let generateReceiptHTML build a dynamic UPI QR (with the
                // correct bill amount) itself. If Printer Settings already has a UPI ID saved,
                // omit these and it'll be picked up from there automatically.
                upiId: basicSettings?.upiId,
                payeeName: basicSettings?.storeName,
            });
            printViaBrowser(html, config, true); // pass isHtml=true
            return { success: true, method: 'browser' };
        } else {
            // Service mode
            const printerName = servicePrinterName || getStoredPrinter();
            if (!printerName) {
                throw new Error('No default printer selected. Please set one in Printer Settings.');
            }
            return await printReceipt({ ...fullParams, printerName, payeeName: basicSettings?.storeName });
        }
    };

    // ---------- KOT print ----------


    const draftCarts = useSelector(state => state.sales.draftCarts);
    const handlePrintKOT = async (kotData) => {
        try {
            let tableNo, items, kotNo;

            // ----- Handle number (tableNo only) -----
            if (typeof kotData === 'number') {
                tableNo = kotData;
                const draft = draftCarts.find(d => d.tableNo === tableNo);
                if (!draft) throw new Error(`No draft for table ${tableNo}`);
                items = draft.saleItems || [];
                kotNo = draft.kotNo || 'KOT-' + Date.now();
            }
            // ----- Handle object -----
            else if (kotData && typeof kotData === 'object') {
                tableNo = kotData.tableNo || selectedTable;
                items = kotData.items || [];
                kotNo = kotData.kotNo || 'KOT-' + Date.now();

                // If items are missing, recover from Redux
                if (!items || items.length === 0) {
                    const draft = draftCarts.find(d => d.tableNo === tableNo);
                    if (draft?.saleItems?.length) {
                        items = draft.saleItems;
                    }
                }
            } else {
                throw new Error('Invalid kotData: expected number or object');
            }

            // ----- Normalise items -----
            const normalizedItems = items.map(item => ({
                name: item.name || item.productName || item.itemName || 'Unknown',
                quantity: item.quantity ?? item.qty ?? 0,
                price: item.price ?? 0,
                barcode: item.barcode || ''
            }));

            // ----- Print -----
            const params = {
                type: 'kot',
                items: normalizedItems,
                tableNo,
                kotNo
            };
            return await printWithMethod(params);
        } catch (error) {
            console.error('KOT print failed:', error);
            throw error;
        }
    };



    // ---------- Order Summary (for table) ----------
    const handlePrintOrder = async () => {
        try {
            const items = receiptInfo?.saleItems || [];
            if (items.length === 0) {
                alert('No items to print.');
                return;
            }

            const params = {
                type: 'summary',
                items,
                tableNo: selectedTable,
                subtotal: receiptInfo?.totalAmount || 0,
                itemCount: receiptInfo?.totalItems || items.length
            };
            const result = await printWithMethod(params);
            console.log('Order summary printed:', result);
            return result;
        } catch (error) {
            console.error('Order print failed:', error);
            throw error;
        }
    };

    // ---------- Final Sale Receipt ----------
    const handlePrintReceipt = async (saleData) => {
        try {
            const params = {
                type: 'sale',
                sale: saleData || receiptInfo,
                items: (saleData?.saleItems || receiptInfo?.saleItems) || []
            };
            const result = await printWithMethod(params);
            console.log('Sale receipt printed:', result);
            return result;
        } catch (error) {
            console.error('Receipt print failed:', error);
            throw error;
        }
    };

    // ---------- Test printer ----------
    const handleTestPrinter = async () => {
        const method = getPrintMethod();
        if (method === 'browser') {
            const testText = `
========================================
           TEST PRINT
========================================
Method: Browser Print
Date: ${new Date().toLocaleString()}
========================================
If you can read this, your browser print
is working correctly.
========================================
            `;
            printViaBrowser(testText);
            return { success: true, method: 'browser' };
        } else {
            try {
                const printerName = getStoredPrinter();
                if (!printerName) {
                    throw new Error('No default printer selected.');
                }
                return await testPrinter(printerName);
            } catch (error) {
                console.error('Test print failed:', error);
                throw error;
            }
        }
    };

    return {
        handlePrintKOT,
        handlePrintOrder,
        handlePrintReceipt,
        handleTestPrinter,
    };
};

export default usePrintActions;