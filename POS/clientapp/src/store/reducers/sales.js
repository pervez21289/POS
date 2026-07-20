// store/reducers/sales.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSettingsSync } from '../../hooks/useProductSync';



// Async thunk to load GST
export const loadBasicSettings = createAsyncThunk('sales/loadBasicSettings', async () => {
    const data = await getSettingsSync();
    return data;
});

// Load from localStorage
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

// Compute receipt info including GST
const computeReceiptInfo = (receiptInfo, taxAmount = 0) => {
    const totalAmount = receiptInfo?.saleItems?.reduce(
        (sum, i) => sum + i.costPrice * i.quantity,
        0
    ) || 0;

    const discountAmount = receiptInfo?.saleItems?.reduce(
        (sum, i) => sum + (i.discountAmount || 0) * i.quantity,
        0
    ) || 0;

    

    const halfGstRate = taxAmount / 2;
    const cgst = (totalAmount * halfGstRate) / 100;
    const sgst = (totalAmount * halfGstRate) / 100;

    const netAmount = totalAmount + cgst + sgst;
    const totalItems = receiptInfo?.saleItems?.reduce((sum, i) => sum + i.quantity, 0) || 0;

    return {
        ...receiptInfo,
        halfGstRate,
        totalAmount,
        taxAmount,
        cgst,
        sgst,
        netAmount,
        totalItems
    };
};

const initialState = {
    receiptInfo: { cart: [], saleID: null },
    isSearch: true,
    draftCarts: loadDraftsFromStorage(),
    basicSettings:null // default GST, will update from settings API
};

const sales = createSlice({
    name: 'sales',
    initialState,
    reducers: {
        setReceiptInfo(state, action) {
            state.receiptInfo = computeReceiptInfo(action.payload.receiptInfo, state?.basicSettings?.gst);
        },
        resetReceiptInfo(state) {
            state.receiptInfo = { cart: [] };
        },
        setIsSearch(state, action) {
            state.isSearch = action.payload;
        },
        setGstRate(state, action) {
            state.gstRate = action.payload || 0;
            // recompute if we already have saleItems
            if (state.receiptInfo?.saleItems?.length > 0) {
                state.receiptInfo = computeReceiptInfo(state.receiptInfo, state.gstRate);
            }
        },
        saveDraftCart(state, action) {
            if (state.receiptInfo.saleItems?.length > 0) {
                const newDraft = {
                    tableNo: action.payload,
                    saleItems: JSON.parse(JSON.stringify(state.receiptInfo.saleItems)),
                    savedAt: new Date().toISOString()
                };
                state.draftCarts.push(newDraft);
                saveDraftsToStorage(state.draftCarts);
                state.receiptInfo = { cart: [] };
            }
        },
        updateDraftCart(state, action) {
            const { tableNo, saleItems } = action.payload;
            const index = state.draftCarts.findIndex(d => d.tableNo === tableNo);

            if (index !== -1) {
                state.draftCarts[index] = {
                    ...state.draftCarts[index],
                    saleItems: JSON.parse(JSON.stringify(saleItems)),
                    savedAt: new Date().toISOString()
                };
                saveDraftsToStorage(state.draftCarts);
            }
        },
        loadDraftCart(state, action) {
            const draft = state.draftCarts.find(d => d.tableNo === action.payload);
            if (draft) {
                const receiptInfo = { saleItems: draft.saleItems };
                state.receiptInfo = computeReceiptInfo(receiptInfo, state.gstRate);
            }
        },
        deleteDraftCart(state, action) {
            state.draftCarts = state.draftCarts.filter(d => d.tableNo !== action.payload);
            saveDraftsToStorage(state.draftCarts);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadBasicSettings.fulfilled, (state, action) => {
            state.basicSettings = action.payload;
        });
    }
});

export default sales.reducer;
export const {
    setReceiptInfo,
    setIsSearch,
    resetReceiptInfo,
    saveDraftCart,
    loadDraftCart,
    deleteDraftCart,
    updateDraftCart,
    setGstRate
} = sales.actions;
