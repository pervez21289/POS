// types
import { createSlice ,createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    receiptInfo: null
};



const sales = createSlice({
    name: 'drawer',
    initialState,
    reducers: {
        
        setReceiptInfo(state, action) {
            state.receiptInfo = action.payload.receiptInfo;
        },
    }
   
});

export default sales.reducer;

export const { setReceiptInfo } = sales.actions;
