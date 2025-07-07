// types
import { createSlice ,createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    alertData: {}
};


const alert = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        showAlert(state, action) {
            state.alertData = action.payload;
        },
       
    }
   
});

export default alert.reducer;

export const { showAlert } = alert.actions;
