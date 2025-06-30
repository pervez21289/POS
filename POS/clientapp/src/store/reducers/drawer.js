// types
import { createSlice ,createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    drawerOpen: false,
    DrawerComponentChild: null,
    drawerProps: {}
};



const drawer = createSlice({
    name: 'drawer',
    initialState,
    reducers: {
        openDrawer(state, action) {
            debugger;
            state.drawerOpen = action.payload.drawerOpen;
        },
        setDrawerComponent(state, action) {
            state.DrawerComponentChild = action.payload.DrawerComponentChild;
            state.drawerProps = action.payload.drawerProps || {};
            state.drawerOpen = action.payload.drawerOpen;
        },
    }
   
});

export default drawer.reducer;

export const {openDrawer,setDrawerComponent} = drawer.actions;
