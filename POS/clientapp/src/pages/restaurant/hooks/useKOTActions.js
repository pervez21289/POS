import { useDispatch } from 'react-redux';
import { setReceiptInfo, saveDraftCart, loadDraftCart, deleteDraftCart, updateDraftCart } from '../../../store/reducers/sales';
import { showAlert } from '../../../store/reducers/alert';
import { showConfirmDialog } from '../../../store/reducers/confirm';

// Save/load/delete of per-table draft carts (KOTs), and starting a fresh order.
export default function useKOTActions({ receiptInfo, draftCarts, selectedTable, setSelectedTable, setKOTModalOpen }) {
    const dispatch = useDispatch();

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

    return { handleSaveKOT, handleLoadKOT, handleDeleteKOT, handleNewOrder };
}
