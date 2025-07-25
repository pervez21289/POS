// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  imageModalOpen: false
};

// ==============================|| SLICE - MENU ||============================== //

const propertydetails = createSlice({
  name: 'propertydetails',
  initialState,
  reducers: {
    openImageModal(state, action) {
      state.imageModalOpen = action.payload.imageModalOpen;
    }
  }
});

export default propertydetails.reducer;

export const { openImageModal } = propertydetails.actions;
