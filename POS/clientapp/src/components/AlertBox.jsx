// clientapp/src/components/Drawer.jsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Snackbar, Alert
} from '@mui/material';
import { showAlert } from "./../store/reducers/alert";
import { useDispatch } from 'react-redux';

const AlertBox = () => {
    const { alertData } = useSelector((state) => state.alert);
    const dispatch = useDispatch();

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={alertData.open}
            autoHideDuration={3000}
            onClose={() => dispatch(showAlert({ ...alertData, open: false }))}
        >
            <Alert
                severity={alertData.severity}
                variant="filled"
                elevation={6}
            >
                {alertData.message}
            </Alert>
        </Snackbar>
    );
};

export default AlertBox;