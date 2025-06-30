// clientapp/src/components/Drawer.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MuiDrawer from '@mui/material/Drawer';
import { openDrawer } from "./../store/reducers/drawer";

const DrawerComponent = () => {
    const { drawerOpen, DrawerComponentChild, drawerProps } = useSelector((state) => state.drawer);
    const dispatch = useDispatch();

    return (
        <MuiDrawer style={{ zIndex: 1250 }} PaperProps={{
            sx: {
                width: '50vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            },
        }} anchor="right" open={drawerOpen} onClose={() => dispatch(openDrawer({ drawerOpen: false }))} >
            {DrawerComponentChild ? <DrawerComponentChild {...drawerProps} /> : null}
        </MuiDrawer>
    );
};

export default DrawerComponent;