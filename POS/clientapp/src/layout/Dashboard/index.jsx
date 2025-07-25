import { useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Snackbar, Alert, Toolbar } from '@mui/material';
import { useSelector } from 'react-redux';

// project imports
import Drawer from './Drawer';
import Header from './Header';
import Footer from './Footer';
import Loader from 'components/Loader';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import DrawerComponent from './../../components/Drawer';
import AlertBox from './../../components/AlertBox';
import ConfirmBox from './../../components/ConfirmBox';
// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardLayout() {
    const { pathname } = useLocation();
    const { menuMasterLoading } = useGetMenuMaster();
    const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));
    const { userDetails } = useSelector((state) => state.users);
 
    // set media wise responsive drawer
    useEffect(() => {
        handlerDrawerOpen(!downXL);
    }, [downXL]);

    if (menuMasterLoading) return <Loader />;

    return userDetails ? (
        <>
            <Box sx={{ display: 'flex', width: '100%' }}>
                <Header />
                <Drawer />
                <Box
                    component="main"
                    sx={{
                        width: 'calc(100% - 260px)',
                        flexGrow: 1,
                        p: { xs: 2, sm: 3 }
                    }}
                >
                    <Toolbar sx={{ mt: 'inherit' }} />
                    <Box
                        sx={{
                            px: { xs: 0, sm: 2 },
                            position: 'relative',
                            minHeight: 'calc(100vh - 110px)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {/*{pathname !== '/apps/profiles/account/my-account' && <Breadcrumbs />}*/}
                        <Outlet />
                        <Footer />
                    </Box>
                </Box>
            </Box>
            <DrawerComponent />
            <AlertBox></AlertBox>
            <ConfirmBox></ConfirmBox>
        </>
       
    ) : (
        <Navigate to="/login" />
    );
}