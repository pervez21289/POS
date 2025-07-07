import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    open: false,
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    confirmColor: '',
    onConfirm: null,
};

const confirm = createSlice({
    name: 'confirm',
    initialState,
    reducers: {
        showConfirmDialog: (state, action) => {
            return { open: true, ...action.payload };
        },
        hideConfirmDialog: () => initialState,
    },
});

export const { showConfirmDialog, hideConfirmDialog } = confirm.actions;
export default confirm.reducer;
