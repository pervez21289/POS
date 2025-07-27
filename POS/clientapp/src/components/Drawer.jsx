// clientapp/src/components/Drawer.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import { openDrawer } from "./../store/reducers/drawer";

const DrawerComponent = () => {
    const { drawerOpen, DrawerComponentChild, drawerProps } = useSelector((state) => state.drawer);
    const dispatch = useDispatch();

    const toggleDrawer = (open) => () => {
        dispatch(openDrawer({ drawerOpen: open }));
    };

    return (
        <SwipeableDrawer
            style={{ zIndex: 1250 }}
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
            disableDiscovery={false} // allow edge swipe to open
            disableSwipeToOpen={false} // enable swipe gestures
            PaperProps={{
                sx: {
                    width: {
                        xs: '100vw', // Full width on mobile
                        sm: '100vw',
                        md: '50vw',  // 50% on md and up
                    },
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: { xs: 0, md: 'auto' },
                    right: 0,
                },
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    overflowY: 'auto',
                    px: 2,
                    pb: {
                        xs: '80px',
                        md: 0
                    },
                }}
            >
                {DrawerComponentChild ? <DrawerComponentChild {...drawerProps} /> : null}
            </Box>
        </SwipeableDrawer>
    );
};

export default DrawerComponent;
