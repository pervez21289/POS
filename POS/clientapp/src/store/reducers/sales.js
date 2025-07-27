// types
import { createSlice ,createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    receiptInfo: { cart: [], saleID :null},
    isSearch:false
};



const sales = createSlice({
    name: 'drawer',
    initialState,
    reducers: {
        
        setReceiptInfo(state, action) {
            const receiptInfo = action.payload.receiptInfo;
            const totalAmount = receiptInfo?.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
            const discountAmount = receiptInfo?.cart.reduce((sum, i) => sum + (i.discount || 0) * i.quantity, 0);
            const taxAmount = receiptInfo?.cart.reduce((sum, i) => sum + (i.tax || 0), 0);
            const net = totalAmount - discountAmount + taxAmount;
            const totalItems = receiptInfo?.cart.reduce((sum, i) => sum + i.quantity, 0);
            const receiptInfoData = { ...receiptInfo, totalAmount, discountAmount, taxAmount, net, totalItems };
            state.receiptInfo = receiptInfoData;
        },
        resetReceiptInfo: (state) => {
            state.receiptInfo = { cart: [] };
        },
        setIsSearch(state, action) {
            state.isSearch = action.payload;
        }
    }
   
});

export default sales.reducer;
export const { setReceiptInfo, setIsSearch, resetReceiptInfo } = sales.actions;
