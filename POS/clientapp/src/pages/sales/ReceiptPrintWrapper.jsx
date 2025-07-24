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
import { useGetBasicSettingsQuery } from './../../services/basicSettingAPI';
import { useMediaQuery, useTheme } from '@mui/material';

import SalesReceipt from './SalesReceipt';

const ReceiptPrintWrapper = ({ receiptInfo }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // or 'md'
    const { data, isLoading } = useGetBasicSettingsQuery();
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
        if (window.ReactNativeWebView) {
            handlePrintMobile();
        } else {
            handlePrintWeb();
        }
    };




    const handlePrintMobile = () => {
      
        const receiptHTML = generateTextReceipt();
        window.ReactNativeWebView?.postMessage(receiptHTML);
      };

  
    const handlePrintWeb = () => {
        const textToPrint = generateTextReceipt(); // Make sure it's 32 characters per line for 58mm

        const printWindow = window.open('', '', 'width=320,height=600'); // 58mm ~ 320px

        const html = `
        <html>
            <head>
                <title>Print Receipt</title>
                <style>
                    @media print {
                        @page {
                            margin: 0;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                        }
                        pre {
                            margin: 0;
                            padding: 0;
                        }
                    }

                    body {
                        font-family: 'Courier New', monospace;
                        margin: 0;
                        padding: 0;
                         font-size: 12px;
                    }

                    
                </style>
            </head>
            <body>
                <pre>${textToPrint}</pre>
            </body>
        </html>
    `;

        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();

        // Give time for styles to load before printing
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        };
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

            const saleD = await createSale(sale).unwrap();
            setSaleId(saleD?.billNo);
            dispatch(setReceiptInfo({ receiptInfo: { cart: [] } }));
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
        console.log("store", data);
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


  

    const generateTextReceipt = () => {
        const LINE_WIDTH = 42;

        const padRight = (text, length) => (text + ' '.repeat(length)).slice(0, length);
        const padLeft = (text, length) => (' '.repeat(length) + text).slice(-length);
        const center = (text) => {
            const space = Math.floor((LINE_WIDTH - text.length) / 2);
            return ' '.repeat(space) + text;
        };

        const lines = [];

        // Header
        lines.push(center(data?.[0].storeName || 'Store Name'));
        lines.push(center(data?.[0].address || 'Store Address'));
        lines.push(center(`GST: ${data?.[0].gstin || '-'}`));
        lines.push('-'.repeat(LINE_WIDTH));

        // Info
        lines.push(`Bill#: ${saleId}  Date: ${receiptInfo?.saleTime || ''}`);
        lines.push(`Cashier: ${receiptInfo?.userName}`);
        lines.push(`Name: ${customerName}`);
        lines.push(`Mobile: ${mobileNumber}`);
        lines.push('-'.repeat(LINE_WIDTH));
        lines.push('Barcode     Qty  Rate   Total');
        // Items
        receiptInfo?.cart?.forEach(item => {
            lines.push(item.name.slice(0, LINE_WIDTH));
            const qty = padLeft(item.quantity.toString(), 2);
            const price = padLeft(item.price.toFixed(2), 6);
            const total = padLeft((item.quantity * (item.price - (item.discount || 0))).toFixed(2), 7);
            lines.push(`${padRight(item.barcode || '-', 10)} ${qty} x ${price} ${total}`);
        });

        lines.push('-'.repeat(LINE_WIDTH));

        // Summary
        lines.push(`${padRight('Subtotal:', 24)}${padLeft(receiptInfo?.totalAmount?.toFixed(2), 8)}`);
        lines.push(`${padRight('Discount:', 24)}${padLeft(receiptInfo?.discountAmount?.toFixed(2), 8)}`);
        lines.push(`${padRight('Tax:', 24)}${padLeft(receiptInfo?.taxAmount?.toFixed(2), 8)}`);
        lines.push(`${padRight('Total Payable:', 24)}${padLeft(`₹${receiptInfo?.net?.toFixed(2)}`, 8)}`);
        lines.push(`${padRight('Total Items:', 24)}${padLeft(receiptInfo?.cart?.reduce((s, i) => s + i.quantity, 0), 8)}`);

        lines.push('-'.repeat(LINE_WIDTH));
        lines.push(center('Thank you! Visit again.'));

        return lines.join('\n');
    };







    return (
        <>
            <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" mb={2}>Receipt Details</Typography>

                {/* Scrollable content area */}
                <Box sx={{ flex: 1, overflowY: 'auto', pr: 1, pb: 10 }}>
                    {!saleId &&
                        <Grid container spacing={2} alignItems="flex-start">
                            <Grid item xs={12} sm={2} lg={4}>
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
                                    aria-label="Payment"
                                    name="Payment"
                                >
                                    <ToggleButton size="small" value="1">Cash</ToggleButton>
                                    <ToggleButton size="small" value="2">UPI</ToggleButton>
                                    <ToggleButton size="small" value="3">Card</ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                        </Grid>
                    }

                    <Box mt={2}>
                        <SalesReceipt
                            ref={printRef}
                            receiptInfo={receiptInfo}
                            className="receipt"
                            saleId={saleId}
                            customerName={customerName}
                            mobileNumber={mobileNumber}
                        />
                    </Box>
                </Box>

                {/* Fixed bottom button section */}
                <Box
                    sx={{
                        position: {
                            xs: 'fixed',  // on mobile (xs = 0px and up)
                            sm: 'fixed',  // optionally on tablets too
                            md: 'sticky', // desktop and up
                        },
                        bottom: {
                            xs: 70,    // apply bottom: 10px only on mobile (xs & sm)
                            md: 'auto',
                        },
                        left: 0,
                        right: 0,
                        width: '100%',
                        zIndex: 10,
                        py: 2,
                        px: 2,
                        backgroundColor: '#fff',
                        borderTop: '1px solid #ccc',
                        boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
                        paddingBottom: { xs: 'env(safe-area-inset-bottom, 60px)', sm: 2 },
                        display: { xs: 'flex'}, // Show only on mobile
                        gap: 2,
                    }}
                
                  
                    gap={2}
                >
                    {!saleId && (
                        <Button variant="contained" onClick={handleCheckout}>
                            🖨 Submit
                        </Button>
                    )}
                    {saleId && (
                        <Button variant="contained" onClick={handlePrint}>
                            🖨 Print Receipt
                        </Button>
                    )}
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
