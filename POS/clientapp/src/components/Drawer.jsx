// clientapp/src/components/Drawer.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
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
                        xs: '100vw',  // Full width on extra-small (mobile)
                        sm: '100vw',  // Full width on small screens
                        md: '50vw',   // 50% width on medium and up
                    },
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute', // Fixed typo
                    bottom: { xs: 0, md: 'auto' }, // Bottom only on mobile
                    right: 0, // Ensure it aligns properly when anchored to right
                },
            }}
            anchor="right"
            open={drawerOpen}
            onClose={() => dispatch(openDrawer({ drawerOpen: false }))}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    overflowY: 'auto',
                    px: 2, // optional horizontal padding
                    pb: {
                        xs: '80px', // 80px padding on mobile
                        md: 0      // no extra padding on medium and up
                    },
                }}
            >
                {DrawerComponentChild ? <DrawerComponentChild {...drawerProps} /> : null}

                </Box>
        </MuiDrawer>

    );
};

export default DrawerComponent;
