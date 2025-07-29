// store/reducers/sales.js
import { createSlice } from '@reduxjs/toolkit';

// Load from localStorage (on first load)
const loadDraftsFromStorage = () => {
    try {
        const data = localStorage.getItem('draftCarts');
        return data ? JSON.parse(data) : [];
    } catch (err) {
        console.error("Failed to load drafts from localStorage", err);
        return [];
    }
};

const saveDraftsToStorage = (draftCarts) => {
    try {
        localStorage.setItem('draftCarts', JSON.stringify(draftCarts));
    } catch (err) {
        console.error("Failed to save drafts to localStorage", err);
    }
};

const computeReceiptInfo = (receiptInfo) => {
    const totalAmount = receiptInfo?.cart.reduce((sum, i) => sum + i.costPrice * i.quantity, 0);
    const discountAmount = receiptInfo?.cart.reduce((sum, i) => sum + (i.discountAmount || 0) * i.quantity, 0);
    const taxAmount = receiptInfo?.cart.reduce((sum, i) => sum + (i.tax || 0), 0);
    const net = totalAmount - discountAmount + taxAmount;
    const totalItems = receiptInfo?.cart.reduce((sum, i) => sum + i.quantity, 0);

    return {
        ...receiptInfo,
        totalAmount,
        discountAmount,
        taxAmount,
        net,
        totalItems,
    };
};

const initialState = {
    receiptInfo: { cart: [], saleID: null },
    isSearch: true,
    draftCarts: loadDraftsFromStorage()
};

const sales = createSlice({
    name: 'drawer',
    initialState,
    reducers: {
        setReceiptInfo(state, action) {
            state.receiptInfo = computeReceiptInfo(action.payload.receiptInfo);
        },
        resetReceiptInfo(state) {
            state.receiptInfo = { cart: [] };
        },
        setIsSearch(state, action) {
            state.isSearch = action.payload;
        },
        saveDraftCart(state) {
            if (state.receiptInfo.cart.length > 0) {
                const newDraft = {
                    id: Date.now(),
                    cart: JSON.parse(JSON.stringify(state.receiptInfo.cart)),
                    savedAt: new Date().toISOString()
                };
                state.draftCarts.push(newDraft);
                saveDraftsToStorage(state.draftCarts); 
                state.receiptInfo = { cart: [] };
            }
        },
        loadDraftCart(state, action) {
            const draft = state.draftCarts.find(d => d.id === action.payload);
            if (draft) {
                const receiptInfo = { cart: draft.cart };
                state.receiptInfo = computeReceiptInfo(receiptInfo);
            }
        },
        deleteDraftCart(state, action) {
            state.draftCarts = state.draftCarts.filter(d => d.id !== action.payload);
            saveDraftsToStorage(state.draftCarts); 
        }
    }
});

export default sales.reducer;
export const {
    setReceiptInfo,
    setIsSearch,
    resetReceiptInfo,
    saveDraftCart,
    loadDraftCart,
    deleteDraftCart
} = sales.actions;
