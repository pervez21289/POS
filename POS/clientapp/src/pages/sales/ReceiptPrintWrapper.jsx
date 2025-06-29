import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import SalesReceipt from './SalesReceipt';
import { useDispatch, useSelector } from 'react-redux';

const ReceiptPrintWrapper = ({ receiptInfo }) => {
    const printRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [paymentMode, setPaymentMode] = useState('Cash');

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
        if (!mobileNumber) return;

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


    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" mb={2}>Receipt Details</Typography>

            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Mobile Number"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                    
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
                <Grid item xs={12} sm={4}>
                    <Select
                        fullWidth
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="Cash">Cash</MenuItem>
                        <MenuItem value="Card">Card</MenuItem>
                        <MenuItem value="UPI">UPI</MenuItem>
                    </Select>
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
                <Button variant="contained" onClick={handlePrint}>
                    🖨 Print Receipt
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => dispatch(openDrawer({ drawerOpen: false }))}>
                    ⬅ Back to Sale Page
                </Button>
            </Box>
        </Box>
    );
};

export default ReceiptPrintWrapper;
