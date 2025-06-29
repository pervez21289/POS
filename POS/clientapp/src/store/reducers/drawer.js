// types
import { createSlice ,createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    drawerOpen: false,
    DrawerComponentChild: null
};



const drawer = createSlice({
    name: 'drawer',
    initialState,
    reducers: {
        openDrawer(state, action) {
            state.drawerOpen = action.payload.drawerOpen;
        },
        setDrawerComponent(state, action) {
            state.DrawerComponentChild = action.payload.DrawerComponentChild;
        },
    }
   
});

export default drawer.reducer;

export const {openDrawer,setDrawerComponent} = drawer.actions;
