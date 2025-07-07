import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Button
} from '@mui/material';
import { hideConfirmDialog } from '../store/reducers/confirm';

const ConfirmBox = () => {
    const {
        open,
        title,
        message,
        confirmText,
        cancelText,
        confirmColor,
        onConfirm
    } = useSelector(state => state.confirm);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(hideConfirmDialog());
    };

    const handleConfirm = async () => {

        debugger;
        if (onConfirm) {
            await onConfirm();
        }
        dispatch(hideConfirmDialog());
    };

    return open&&(
         <Dialog open={open||false} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="inherit">
                    {cancelText || 'Cancel'}
                </Button>
                <Button
                    onClick={handleConfirm}
                    color={confirmColor }
                    variant="contained"
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmBox;
