import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, InputLabel, Stack, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import SalesReceipt from './SalesReceipt';
import { useDispatch, useSelector } from 'react-redux';
import { useCreateSaleMutation } from './../../services/salesApi';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const ReceiptPrintWrapper = ({ receiptInfo }) => {
    const printRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [paymentMode, setPaymentMode] = useState('1');
    const [mobileError, setMobileError] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerId, setCustomerId] = useState(null);

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
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
        if (receiptInfo === null) {
            const sale = {
                userID: 3, // Replace with actual user
                totalAmount: receiptInfo?.total,
                discountAmount: receiptInfo?.discount,
                taxAmount: receiptInfo?.tax,
                paymentStatus: 1,
                notes: receiptInfo?.notes,
                mobileNumber: mobileNumber,
                customerName: customerName,
                PaymentModeID: paymentMode,
                saleItems: cart.map(i => ({
                    productID: i.productID,
                    quantity: i.qty,
                    unitPrice: i.price,
                    discount: i.discount,
                    tax: i.tax
                }))
            };
            const saleId = await createSale(sale).unwrap();
            handlePrint();
        }
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" mb={2}>Receipt Details</Typography>

            <Grid container spacing={2} alignItems="flex-start">
                <Grid item xs={12} sm={6}>
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
                    />

                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Customer Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        disabled={!!customerId}
                    />
                </Grid>

                <Grid item xs={12} lg={4}>
                        <ToggleButtonGroup
                            color="primary"
                            value={paymentMode}
                            exclusive
                            onChange={(e) => setPaymentMode(e.target.value)}
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

            <Box ref={printRef} mt={4}>
                <SalesReceipt
                    {...receiptInfo}
                    customerName={customerName}
                    mobileNumber={mobileNumber}
                    paymentMode={paymentMode}
                />
            </Box>

            <Box mt={4} display="flex" gap={2}>
                <Button variant="contained" onClick={handleCheckout}>
                    🖨 Save/Print Receipt
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => dispatch(openDrawer({ drawerOpen: false }))}>
                    ⬅ Back to Sale Page
                </Button>
            </Box>
        </Box>
    );
};

export default ReceiptPrintWrapper;
