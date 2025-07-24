// clientapp/src/components/Drawer.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MuiDrawer from '@mui/material/Drawer';
import { openDrawer } from "./../store/reducers/drawer";

const DrawerComponent = () => {
    const { drawerOpen, DrawerComponentChild, drawerProps } = useSelector((state) => state.drawer);
    const dispatch = useDispatch();

    return (
        <MuiDrawer
            style={{ zIndex: 1250 }}
            PaperProps={{
                sx: {
                    width: {
                        xs: '100vw',  // Full width on mobile
                        sm: '100vw',  // Optional: keep full width on small tablets
                        md: '50vw',   // 50% width on medium and up
                    },
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    Position: 'relative',   
                },
            }}
            anchor="right"
            open={drawerOpen}
            onClose={() => dispatch(openDrawer({ drawerOpen: false }))}
        >
            {DrawerComponentChild ? <DrawerComponentChild {...drawerProps} /> : null}
        </MuiDrawer>
    );
};

export default DrawerComponent;
