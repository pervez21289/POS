import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, Dialog, DialogTitle, DialogContent, DialogActions ,Divider, Grid, MenuItem, Select, TextField, Typography, Table, TableBody, TableCell, TableRow, TableHead,
    RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import { useReactToPrint } from "react-to-print";
import SaleService from './../../services/SaleService';
import { useDispatch, useSelector } from 'react-redux';
import { useCreateSaleMutation } from './../../services/salesApi';
import { setReceiptInfo } from "./../../store/reducers/sales";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useMediaQuery, useTheme } from '@mui/material';
import { mobileStickyBottomBarStyles } from '../../components/commonStyles';
import SalesReceipt from './SalesReceipt';


const ReceiptPrintWrapper = () => {
    const { receiptInfo, isSearch } = useSelector((state) => state.sales);
    const theme = useTheme();
   
    const printRef = useRef();
    
    const dispatch = useDispatch();

    const [PaymentModeID, setPaymentModeID] = useState(null);
    const [mobileError, setMobileError] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerId, setCustomerId] = useState(null);
    const [createSale] = useCreateSaleMutation();
    const [saleId, setSaleId] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [paymentModeError, setPaymentModeError] = useState('');

    // Called on blur or Enter
    const handleMobileSearch = async (value) => {
        try {
            const customer = await SaleService.GetCustomerByNumber(value);
            setCustomerName(customer.customerName);
            setCustomerId(customer.id);
        } catch (error) {

        }
    };


    const handleCheckout = async () => {

        if (!PaymentModeID) {
            setPaymentModeError('Please select a payment mode');
            return;
        }

        const mobileRegex = /^[6-9]\d{9}$/;

        if (!mobileRegex.test(mobileNumber) || mobileNumber === '') {
            setMobileError('Invalid mobile number');
            return;
        }

       

        if (receiptInfo) {
            const sale = {
                userID: 3, // Replace with actual user
                totalAmount: receiptInfo?.totalAmount,
                discountAmount: receiptInfo?.discountAmount,
                taxAmount: receiptInfo?.taxAmount,
                paymentStatus: 1,
                notes: receiptInfo?.notes,
                mobileNumber: mobileNumber,
                customerName: customerName,
                PaymentModeID: PaymentModeID,
                saleItems: receiptInfo.cart.map(i => ({
                    productID: i.productID,
                    quantity: i.quantity,
                    price: i.price,
                    costPrice: i.costPrice,
                    discount: i.discountAmount,
                    tax: i.tax
                }))
            };

            const saleD = await createSale(sale).unwrap();
            dispatch(setReceiptInfo({
                receiptInfo: saleD
            }));
            setOpenDialog(false);
            setOpenSnackbar(true);
            //handlePrint();
            // handlePrint();
        }
    }

    return (
        <>
            <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" mb={2}>Receipt Details</Typography>

                {/* Scrollable content area */}
               
                        <SalesReceipt
                            ref={printRef}
                            receiptInfo={receiptInfo}
                            className="receipt"
                            customerName={customerName}
                            mobileNumber={mobileNumber}
                        />
                    

                {/* Fixed bottom button section */}
                {!receiptInfo.billNo && (<Box
                    sx={mobileStickyBottomBarStyles}
                    gap={2}
                >

                    <Button variant="contained" onClick={() => { setPaymentModeID(null); setMobileNumber(''); setCustomerName(''); setOpenDialog(true); }}>
                           Payment
                        </Button>
                 
                </Box>)}

            </Box>


            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Payment Details</DialogTitle>
                <DialogContent>

                    <Typography variant="subtitle1" >Payment Mode</Typography>
                    <RadioGroup
                        row
                        value={PaymentModeID}
                        onChange={(e) => {
                            const value = e.target.value;
                            setPaymentModeID(value);
                            if (!value) {
                                setPaymentModeError('Please select a payment mode');
                                return;
                            } else {
                                setPaymentModeError('');

                            }

                        }}
                    >
                        <FormControlLabel value="1" control={<Radio />} label="UPI" />
                        <FormControlLabel value="2" control={<Radio />} label="Cash" />
                        <FormControlLabel value="3" control={<Radio />} label="Card" />

                    </RadioGroup>
                    {paymentModeError && (
                        <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                            {paymentModeError}
                        </Typography>
                    )}
                    <TextField
                        fullWidth
                        label="Mobile Number"
                        value={mobileNumber}
                        onChange={(e) => {
                            const value = e.target.value;
                            setMobileNumber(value);
                            if (!/^[6-9]\d{9}$/.test(value)) {
                                setMobileError('Invalid mobile number');
                                setCustomerName('');
                            } else {
                                setMobileError('');
                                handleMobileSearch(value);
                            }
                        }}
                        error={!!mobileError}
                        helperText={mobileError || ' '}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Customer Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        disabled={!!customerId}
                    />
                 
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={() => {
                        
                        handleCheckout();
                    }}>
                        Proceed
                    </Button>
                </DialogActions>
            </Dialog>


            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <MuiAlert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    Sale saved successfully!
                </MuiAlert>
            </Snackbar>
        </>
    );
}

export default ReceiptPrintWrapper;
