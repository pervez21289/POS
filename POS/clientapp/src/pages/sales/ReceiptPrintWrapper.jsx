import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, InputLabel, Stack,Divider, Grid, MenuItem, Select, TextField, Typography, Table, TableBody, TableCell, TableRow, TableHead,
    TableContainer, Paper
} from '@mui/material';
import { useReactToPrint } from "react-to-print";
import SaleService from './../../services/SaleService';
import { useDispatch, useSelector } from 'react-redux';
import { useCreateSaleMutation } from './../../services/salesApi';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { setReceiptInfo } from "./../../store/reducers/sales";
import { openDrawer } from "./../../store/reducers/drawer";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import SalesReceipt from './SalesReceipt';

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

    //const handlePrint = () => {
    //    window.print();
    //};


    const handlePrint = useReactToPrint({
        content: () => {

            if (!printRef.current) {
                alert("Receipt not ready for printing yet!");
            }
            return printRef.current;
        },
        contentRef: printRef,
        documentTitle: "Restaurant Bill",
        pageStyle: `
      @media print {
        body {
          font-size: 12px;
        }
        table {
          page-break-inside: auto;
        }
        tr {
          page-break-inside: avoid;
          page-break-after: auto;
        }
        thead {
          display: table-header-group;
        }
        tfoot {
          display: table-footer-group;
        }
      }
    `
    });

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

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault(); // Prevent default browser print
                handlePrint();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handlePrint]);

    return (
        <>
            <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" mb={2}>Receipt Details</Typography>

                {!saleId &&<Grid container spacing={2} alignItems="flex-start">
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
                }
               
                <SalesReceipt ref={printRef} receiptInfo={receiptInfo}  saleId={saleId} customerName={customerName} mobileNumber={mobileNumber }></SalesReceipt>
                
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
}

export default ReceiptPrintWrapper;
