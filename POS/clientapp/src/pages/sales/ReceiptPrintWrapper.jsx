import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, InputLabel, Stack, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import SalesReceipt from './SalesReceipt';
import { useDispatch, useSelector } from 'react-redux';
import { useCreateSaleMutation } from './../../services/salesApi';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { setReceiptInfo } from "./../../store/reducers/sales";
import { openDrawer } from "./../../store/reducers/drawer";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const ReceiptPrintWrapper = ({ receiptInfo }) => {
    const printRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [PaymentModeID, setPaymentModeID] = useState('1');
    const [mobileError, setMobileError] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerId, setCustomerId] = useState(null);
    const [createSale] = useCreateSaleMutation();
    const [saleId, setSaleId] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handlePrint = () => {
        window.print();
    };


    // Called on blur or Enter
    const handleMobileSearch = async () => {
     

        try {
            const res = await axios.get(`/api/customers/by-mobile?mobile=${mobileNumber}`);
            const customer = res.data;
            setCustomerName(customer.name);
            setCustomerId(customer.id);
        } catch (error) {
            if (error.response?.status === 404) {
                // Not found – optionally prompt to create
                const name = prompt("Customer not found. Enter customer name to add:");
                if (name) {
                    const [firstName, ...rest] = name.split(' ');
                    const lastName = rest.join(' ');
                    const response = await axios.post(`/api/customers`, {
                        firstName,
                        lastName,
                        mobile: mobileNumber
                    });
                    setCustomerName(response.data.name);
                    setCustomerId(response.data.id);
                }
            } else {
                console.error("Lookup failed", error);
            }
        }
    };


    const handleCheckout = async () => {

        const mobileRegex = /^[6-9]\d{9}$/;

        if (!mobileRegex.test(mobileNumber) || mobileNumber === '') {
            setMobileError('Invalid mobile number');
            return;
        }
        debugger;
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
                    discount: i.discount,
                    tax: i.tax
                }))
            };
            const data = await createSale(sale).unwrap();
            setSaleId(data);
           
            dispatch(setReceiptInfo({ receiptInfo: null }));
            setOpenSnackbar(true);
           // handlePrint();
        }
    }

    return (
        <>
            <Box sx={{ p: 3 }}>
                <Typography variant="h5" mb={2}>Receipt Details</Typography>

                <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} sm={2} lg={4}>
                        <TextField
                            fullWidth
                            label="Mobile Number"
                            value={mobileNumber}
                            onChange={(e) => {
                                const value = e.target.value;
                                setMobileNumber(value);

                                // Clear error when user starts typing
                                if (mobileError && /^[6-9]\d{9}$/.test(value)) {
                                    setMobileError('');
                                }
                            }}
                            onBlur={() => {
                                if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
                                    setMobileError('Invalid mobile number');
                                } else {
                                    setMobileError('');
                                    handleMobileSearch();
                                }
                            }}
                            error={mobileError}
                            helperText={mobileError || ' '}
                            disabled={!!saleId}
                        />

                    </Grid>

                    <Grid item xs={12} sm={6} lg={4}>
                        <TextField
                            fullWidth
                            label="Customer Name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            disabled={!!customerId && !!saleId}

                        />
                    </Grid>

                    <Grid item xs={12} lg={4}>
                        <ToggleButtonGroup
                            color="primary"
                            value={PaymentModeID}
                            exclusive
                            onChange={(e) => setPaymentModeID(e.target.value)}
                            aria-label="Platform"
                            name="Parking"
                        >
                            <ToggleButton size="small" name="Parking" color="info" value="1">
                                Cash
                            </ToggleButton>
                            <ToggleButton size="small" name="Parking" color="success" value="2">
                                UPI
                            </ToggleButton>
                            <ToggleButton size="small" name="Parking" color="success" value="3">
                                Card
                            </ToggleButton>
                        </ToggleButtonGroup>

                    </Grid>


                </Grid>

                <Box id="printSection" ref={printRef} mt={4}>
                    <SalesReceipt
                        receiptInfo={receiptInfo}
                        Bill={saleId}
                    />
                </Box>

                <Box mt={4} display="flex" gap={2}>
                    {!saleId && <Button variant="contained" onClick={handleCheckout}>
                        🖨 Submit
                    </Button>
                    }
                    {saleId && <Button variant="contained" onClick={handlePrint}>
                        🖨 Print Receipt
                    </Button>}
                    <Button variant="outlined" color="secondary" onClick={() => dispatch(openDrawer({ drawerOpen: false }))}>
                        ⬅ Back to Sale Page
                    </Button>
                </Box>
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
            >
                <MuiAlert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    Sale saved successfully!
                </MuiAlert>
            </Snackbar>
        </>
    );
};

export default ReceiptPrintWrapper;
