import { useDispatch } from 'react-redux';
import { showAlert } from '../../../store/reducers/alert';
import { printReceipt, testPrinter } from '../receiptPrinter';

const buildStoreInfo = (basicSettings) => ({
    storeName: basicSettings?.storeName || 'My Store',
    address: basicSettings?.address || 'Store Address',
    gstin: basicSettings?.gstin || '-',
});

const mapItems = (items) => items.map(item => ({
    name: item.name,
    barcode: item.barcode || '-',
    quantity: item.quantity,
    price: item.salePrice || item.price || 0,
}));

const sumItems = (items) => items.reduce((sum, item) => sum + ((item.salePrice || item.price || 0) * item.quantity), 0);

// All printer interactions: KOT for a given table, KOT for the current cart,
// the final sale receipt, and the printer self-test.
export default function usePrintActions({ basicSettings, receiptInfo, selectedTable }) {
    const dispatch = useDispatch();

    const printKOTFor = async (tableNo, items) => {
        if (!items?.length) {
            dispatch(showAlert({ open: true, message: 'No items to print!', severity: 'warning' }));
            return;
        }
        try {
            const kotNo = `KOT${Date.now().toString().slice(-6)}`;
            const totalAmount = sumItems(items);

            const result = await printReceipt({
                type: 'kot',
                storeInfo: buildStoreInfo(basicSettings),
                items: mapItems(items),
                tableNo,
                kotNo,
                subtotal: totalAmount,
                itemCount: items.length,
            });

            if (result.success) {
                dispatch(showAlert({ open: true, message: `✅ KOT printed for Table ${tableNo}`, severity: 'success' }));
            } else {
                throw new Error(result.error || 'Print failed');
            }
        } catch (error) {
            dispatch(showAlert({ open: true, message: `❌ Print failed: ${error.message}`, severity: 'error' }));
        }
    };

    // Print KOT for a specific table (used by TableCard's print button)
    const handlePrintKOT = (tableNo, items) => printKOTFor(tableNo, items);

    // Print KOT for the current cart / selected table
    const handlePrintOrder = () => {
        if (!receiptInfo?.saleItems?.length) {
            dispatch(showAlert({ open: true, message: 'Cart is empty!', severity: 'warning' }));
            return;
        }
        return printKOTFor(selectedTable, receiptInfo.saleItems);
    };

    // Print the final sale receipt (called after successful payment)
    const handlePrintReceipt = async (saleData) => {
        try {
            const totalAmount = sumItems(saleData.items);

            const result = await printReceipt({
                type: 'sale',
                storeInfo: buildStoreInfo(basicSettings),
                items: mapItems(saleData.items),
                sale: {
                    billNo: saleData.billNo || `BILL-${Date.now()}`,
                    saleTime: new Date().toLocaleString(),
                    userName: saleData.userName || 'Cashier',
                    customerName: saleData.customerName || '',
                    mobileNumber: saleData.mobileNumber || '',
                    totalAmount,
                    cgst: saleData.cgst || 0,
                    sgst: saleData.sgst || 0,
                    halfGstRate: saleData.halfGstRate || 0,
                    netAmount: saleData.netAmount || totalAmount,
                },
                itemCount: saleData.items.length,
            });

            if (result.success) {
                console.log('✅ Sale receipt printed successfully');
                return result;
            }
            throw new Error(result.error || 'Print failed');
        } catch (error) {
            console.error('❌ Receipt print error:', error);
            dispatch(showAlert({ open: true, message: `❌ Receipt print failed: ${error.message}`, severity: 'error' }));
            throw error;
        }
    };

    const handleTestPrinter = async () => {
        try {
            const result = await testPrinter();
            if (result.success) {
                dispatch(showAlert({ open: true, message: '✅ Test print successful!', severity: 'success' }));
            } else {
                throw new Error(result.error || 'Test failed');
            }
        } catch (error) {
            dispatch(showAlert({ open: true, message: `❌ Test print failed: ${error.message}`, severity: 'error' }));
        }
    };

    return { handlePrintKOT, handlePrintOrder, handlePrintReceipt, handleTestPrinter };
}
