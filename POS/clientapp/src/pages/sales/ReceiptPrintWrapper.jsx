import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, InputLabel, Stack,Divider, Grid, MenuItem, Select, TextField, Typography, Table, TableBody, TableCell, TableRow, TableHead,
    TableContainer, Paper } from '@mui/material';
import SaleService from './../../services/SaleService';
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
            const fontSize = '10px';
    const totalItems = receiptInfo?.cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
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
    const handleMobileSearch = async (value) => {
        try {
            const customer = await SaleService.GetCustomerByNumber(value);
            setCustomerName(customer.customerName);
            setCustomerId(customer.id);
        } catch (error) {
            
        }
    };


    const handleCheckout = async () => {

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
                    discount: i.discount,
                    tax: i.tax
                }))
            };
         
            const data = await createSale(sale).unwrap();
            setSaleId(data?.billNo);
            dispatch(setReceiptInfo({ receiptInfo: null }));
            setOpenSnackbar(true);
           // handlePrint();
        }
    }

    useEffect(() => {
       
        if (receiptInfo && receiptInfo.billNo) {
            setSaleId(receiptInfo.billNo);
            setMobileNumber(receiptInfo.mobileNumber || '');
            setCustomerName(receiptInfo.customerName || '');
            setPaymentModeID(receiptInfo.paymentModeID || '1');
        }

    }, [receiptInfo.billNo]);

    return (
        <>
            <Box sx={{ height: '100vh',  display: 'flex', flexDirection: 'column' }}>
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
                                if (!/^[6-9]\d{9}$/.test(value)) {
                                    setMobileError('Invalid mobile number');
                                    setCustomerName('');
                                } else {
                                    setMobileError('');
                                    handleMobileSearch(value);
                                }
                            }}
                            onBlur={() => {
                                if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
                                    setMobileError('Invalid mobile number');
                                } else {
                                    setMobileError('');
                                    handleMobileSearch(mobileNumber);
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
                            disabled={!!customerId}

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
            <Typography align="center" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                {receiptInfo?.companyName}
            </Typography>
            <Typography align="center" sx={{ fontSize }}>DEHRADUN-2</Typography>
            <Divider sx={{ my: 0.5 }} />

            <Typography sx={{ fontSize }}>Bill No: {saleId}</Typography>
            <Typography sx={{ fontSize }}>Date: {receiptInfo?.saleTime}</Typography>
            <Typography sx={{ fontSize }}>Cashier: {receiptInfo?.userName}</Typography>
            <Divider sx={{ my: 0.5 }} />

            <TableContainer
                component={Paper}
                        sx={{
                            maxHeight: 'none',
                            overflow: 'visible',
                            boxShadow: 'none'
                        }}
            >
                <Table size="small" sx={{ fontSize, width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ p: 0.5, fontSize, backgroundColor: '#fff' }}>Barcode</TableCell>
                            <TableCell align="right" sx={{ p: 0.5, fontSize, backgroundColor: '#fff' }}>Qty</TableCell>
                            <TableCell align="right" sx={{ p: 0.5, fontSize, backgroundColor: '#fff' }}>Rate</TableCell>
                            <TableCell align="right" sx={{ p: 0.5, fontSize, backgroundColor: '#fff' }}>Discount</TableCell>
                            <TableCell align="right" sx={{ p: 0.5, fontSize, backgroundColor: '#fff' }}>Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {receiptInfo?.cart?.map((item, index) => (
                            <React.Fragment key={index}>
                                <TableRow>
                                    <TableCell colSpan={5} sx={{ p: 0.5, pb: 0, fontWeight: 'bold', fontSize, borderBottom: 'none' }}>
                                        {item.name}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ p: 0.5, fontSize }}>{item.barcode || '-'}</TableCell>
                                    <TableCell align="right" sx={{ p: 0.5, fontSize }}>{item.quantity}</TableCell>
                                    <TableCell align="right" sx={{ p: 0.5, fontSize }}>{item.price.toFixed(2)}</TableCell>
                                    <TableCell align="right" sx={{ p: 0.5, fontSize }}>{item.discount.toFixed(2)}</TableCell>
                                    <TableCell align="right" sx={{ p: 0.5, fontSize }}>
                                        {(item.quantity * (item?.price - (item.discount || 0))).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Divider sx={{ my: 1 }} />

            {/* Rest of the code remains the same */}
            <Table size="small" sx={{ fontSize }}>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={3} sx={{ p: 0.5, fontSize }}>Subtotal</TableCell>
                        <TableCell align="right" sx={{ p: 0.5, fontSize }}>₹{receiptInfo?.totalAmount?.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={3} sx={{ p: 0.5, fontSize }}>Discount</TableCell>
                        <TableCell align="right" sx={{ p: 0.5, fontSize }}>₹{receiptInfo?.discountAmount?.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={3} sx={{ p: 0.5, fontSize }}>Tax</TableCell>
                        <TableCell align="right" sx={{ p: 0.5, fontSize }}>₹{receiptInfo?.taxAmount?.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={3} sx={{ p: 0.5, fontWeight: 'bold', fontSize }}>Total Payable</TableCell>
                        <TableCell align="right" sx={{ p: 0.5, fontWeight: 'bold', fontSize }}>₹{receiptInfo?.net?.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={3} sx={{ p: 0.5, fontSize }}>Items</TableCell>
                        <TableCell align="right" sx={{ p: 0.5, fontSize }}>{totalItems}</TableCell>
                    </TableRow>

                </TableBody>
            </Table>

            <Divider sx={{ my: 0.5 }} />
            <Typography align="center" sx={{ fontSize, mt: 1 }}>Thank you! Visit again.</Typography>
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
