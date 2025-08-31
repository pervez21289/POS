import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, Grid, MenuItem, Select, TextField, Typography, Table, TableBody, TableCell, TableRow, TableHead,
    RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import { setDrawerComponent } from "./../../store/reducers/drawer";
import SaleService from './../../services/SaleService';
import { useDispatch, useSelector } from 'react-redux';
import { useCreateSaleMutation } from './../../services/salesApi';
import { setReceiptInfo } from "./../../store/reducers/sales";
import Snackbar from '@mui/material/Snackbar';
import CartPage from './CartPage';
import { useMediaQuery, useTheme } from '@mui/material';
import { mobileStickyBottomBarStyles } from '../../components/commonStyles';
import SalesReceipt from './SalesReceipt';
import { db } from '../../data/db';
import { formatDateTime } from '../../utils/common'; 
import PaymentMode from './PaymentMode';
import { showAlert } from "./../../store/reducers/alert";

const ReceiptPrintWrapper = () => {
    const { receiptInfo } = useSelector((state) => state.sales);
    const { userDetails } = useSelector((state) => state.users);
    
   
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
                billNo: await generateInvoiceNumber(),
                userID: 0, // Replace with actual user
                totalAmount: receiptInfo?.totalAmount,
                discountAmount: receiptInfo?.discountAmount,
                taxAmount: receiptInfo?.taxAmount,
                paymentStatus: 1,
                notes: receiptInfo?.notes,
                mobileNumber: mobileNumber,
                customerName: customerName,
                PaymentModeID: PaymentModeID,
                saleItems: receiptInfo.saleItems,
                saleTime: formatDateTime(new Date()),
                userName: userDetails?.name || '',
            };
           
            await addBill(sale);
            dispatch(setReceiptInfo({
                receiptInfo: sale
            }));
            setOpenDialog(false);
            dispatch(showAlert({ open: true, message: 'Payment successfully completed!', severity: 'success' }));
        }
    }

    const addBill = async (sale) => {

            await db.bills.add({
                createdAt: new Date(),
                sales: sale,
                isSynced: false
            });
        console.log('Bill saved locally!');
    };


    const generateInvoiceNumber = async () => {
        const now = new Date();

        const year = String(now.getFullYear()).slice(2); // "25"
        const month = String(now.getMonth() + 1).padStart(2, '0'); // "08"
        const day = String(now.getDate()).padStart(2, '0'); // "02"

        const datePart = `${year}${month}${day}`;

        const lastSynced = await db.bills.orderBy('id').reverse().first();
        const lastSyncedId = lastSynced?.id ?? 1;

        return `INV${datePart}${lastSyncedId}`;
    };

    const gotoCart = () => {

        dispatch(
            setDrawerComponent({
                DrawerComponentChild: CartPage,
                drawerOpen: true
            })
        );

    };

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
                    <Button variant="contained" onClick={gotoCart}>
                        Go To Cart
                        
                    </Button>
                 
                </Box>)}

            </Box>


            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                fullWidth
                maxWidth="sm"
                scroll="body" // Enables scroll on mobile
            >
                <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Payment Details
                </DialogTitle>

                <DialogContent sx={{ px: 2 }}>
                    {/* Payment Mode */}
                    <Typography variant="subtitle1" gutterBottom>
                        Payment Mode
                    </Typography>
                    <PaymentMode PaymentModeID={PaymentModeID} setPaymentModeID={setPaymentModeID}></PaymentMode>
            
                    {paymentModeError && (
                        <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                            {paymentModeError}
                        </Typography>
                    )}

                    {/* Mobile Number */}
                    <TextField
                        fullWidth
                        type="tel" // better semantic HTML for phone numbers
                        label="Mobile Number"
                        inputMode="numeric"
                        value={mobileNumber}
                        onChange={(e) => {
                            const value = e.target.value;

                            // Allow only digits
                            if (!/^\d*$/.test(value)) return;

                            setMobileNumber(value);

                            // Validate mobile number only if it's 10 digits
                            if (value.length === 10) {
                                if (!/^[6-9]\d{9}$/.test(value)) {
                                    setMobileError('Invalid mobile number');
                                    setCustomerName('');
                                } else {
                                    setMobileError('');
                                    handleMobileSearch(value); // async call to backend or local state search
                                }
                            } else {
                                setMobileError(''); // Clear error if still typing
                            }
                        }}
                        error={!!mobileError}
                        helperText={mobileError || ' '}
                        sx={{ my: 2 }}
                        inputProps={{ maxLength: 10 }} // prevent typing more than 10 digits
                    />


                    {/* Customer Name */}
                    <TextField
                        fullWidth
                        label="Customer Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        disabled={!!customerId}
                    />
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 2,
                        pb: 2,
                        flexDirection: { xs: 'column-reverse', sm: 'row' },
                        gap: 1
                    }}
                >
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => setOpenDialog(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleCheckout}
                    >
                        Proceed
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
}

export default ReceiptPrintWrapper;
