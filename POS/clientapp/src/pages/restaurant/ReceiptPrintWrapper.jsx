import React, { useState } from 'react';
import {
    Box, Button, TextField, Typography, CircularProgress,
    Stack, Divider
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setReceiptInfo } from "./../../store/reducers/sales";
import { showAlert } from "./../../store/reducers/alert";
import SaleService from './../../services/SaleService';
import { db } from '../../data/db';
import { formatDateTime } from '../../utils/common';
import PaymentMode from './PaymentMode';
import { printReceipt } from './receiptPrinter';

const ReceiptPrintWrapper = ({ onClose, onSuccess, tableNo }) => {
    const { receiptInfo, basicSettings } = useSelector(state => state.sales);
    const { userDetails } = useSelector((state) => state.users);
    const dispatch = useDispatch();

    const [PaymentModeID, setPaymentModeID] = useState(null);
    const [mobileError, setMobileError] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerId, setCustomerId] = useState(null);
    const [paymentModeError, setPaymentModeError] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle mobile search
    const handleMobileSearch = async (value) => {
        try {
            const customer = await SaleService.GetCustomerByNumber(value);
            setCustomerName(customer.customerName);
            setCustomerId(customer.id);
        } catch (error) {
            console.error(error);
        }
    };

    const printReceipts = (sale) => {
        // Print KOT first
        // const kotNo = `KOT${Date.now().toString().slice(-6)}`;
        // printReceipt({
        //     type: 'kot',
        //     items: sale.saleItems.map(item => ({
        //         name: item.name,
        //         barcode: item.barcode || '-',
        //         quantity: item.quantity,
        //         price: item.salePrice || item.price || 0,
        //     })),
        //     storeInfo: basicSettings,
        //     tableNo: sale.tableNo || 'N/A',
        //     kotNo: kotNo,
        //     subtotal: sale.totalAmount || 0,
        //     title: 'Kitchen Order',
        //     useIframe: false,
        // });

        // Print Bill after a short delay
       
            printReceipt({
                type: 'sale',
                sale: sale,
                items: sale.saleItems.map(item => ({
                    name: item.name,
                    barcode: item.barcode || '-',
                    quantity: item.quantity,
                    price: item.salePrice || item.price || 0,
                })),
                storeInfo: basicSettings,
                title: 'Receipt',
            });
       
    };

    // Handle checkout (payment)
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
        debugger;
        setLoading(true);
        try {
            const sale = {
                billNo: await generateInvoiceNumber(),
                userID: 0,
                totalAmount: receiptInfo?.totalAmount || 0,
                discountAmount: receiptInfo?.discountAmount || 0,
                taxAmount: receiptInfo?.taxAmount || 0,
                paymentStatus: 1,
                notes: receiptInfo?.notes || '',
                mobileNumber: mobileNumber,
                customerName: customerName,
                PaymentModeID: PaymentModeID,
                saleItems: receiptInfo?.saleItems || [],
                saleTime: formatDateTime(new Date()),
                userName: userDetails?.name || '',
                tableNo: tableNo || 'N/A',
                cgst: receiptInfo?.cgst || 0,
                sgst: receiptInfo?.sgst || 0,
                netAmount: receiptInfo?.netAmount || 0,
                halfGstRate: receiptInfo?.halfGstRate || 0
            };

            await addBill(sale);
            dispatch(setReceiptInfo({ receiptInfo: sale }));
            dispatch(showAlert({ open: true, message: 'Payment successfully completed!', severity: 'success' }));

            // Clear cart and close modal
            setTimeout(() => {
                printReceipts(sale);
                dispatch(setReceiptInfo({ receiptInfo: { saleItems: [] } }));
                if (onSuccess) onSuccess();
                if (onClose) onClose();
            }, 100);
        } catch (error) {
            console.error('Payment error:', error);
            dispatch(showAlert({ open: true, message: 'Payment failed. Please try again.', severity: 'error' }));
        } finally {
            setLoading(false);
        }
    };

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
        const year = String(now.getFullYear()).slice(2);
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const datePart = `${year}${month}${day}`;

        const lastSynced = await db.bills.orderBy('id').reverse().first();
        const lastSyncedId = lastSynced?.id ?? 1;

        return `INV${datePart}${lastSyncedId}`;
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                💳 Payment Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Stack spacing={3}>
                {/* Payment Mode */}
                <Box>
                    <PaymentMode
                        PaymentModeID={PaymentModeID}
                        setPaymentModeID={setPaymentModeID}
                    />
                    {paymentModeError && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                            {paymentModeError}
                        </Typography>
                    )}
                </Box>

                {/* Mobile Number */}
                <TextField
                    fullWidth
                    type="tel"
                    label="Mobile Number"
                    inputMode="numeric"
                    value={mobileNumber}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (!/^\d*$/.test(value)) return;

                        setMobileNumber(value);

                        if (value.length === 10) {
                            if (!/^[6-9]\d{9}$/.test(value)) {
                                setMobileError('Invalid mobile number');
                                setCustomerName('');
                            } else {
                                setMobileError('');
                                handleMobileSearch(value);
                            }
                        } else {
                            setMobileError('');
                        }
                    }}
                    error={!!mobileError}
                    helperText={mobileError || ' '}
                    inputProps={{ maxLength: 10 }}
                />

                {/* Customer Name */}
                <TextField
                    fullWidth
                    label="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    disabled={!!customerId}
                />

                {/* Total Amount */}
                <Box sx={{ textAlign: 'center', py: 1 }}>
                    <Typography variant="body1" color="text.secondary">
                        Total Amount
                    </Typography>
                    <Typography variant="h4" color="primary.main" fontWeight="bold">
                        ₹{receiptInfo?.netAmount?.toFixed(2) || '0.00'}
                    </Typography>
                </Box>

                {/* Actions */}
                <Stack direction="row" spacing={2}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={onClose}
                        disabled={loading}
                        sx={{ py: 1.5 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleCheckout}
                        disabled={loading}
                        sx={{
                            py: 1.5,
                            background: `linear-gradient(135deg, #1976d2 0%, #1565c0 100%)`,
                            '&:hover': {
                                background: `linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)`,
                            },
                        }}
                        startIcon={loading && <CircularProgress size={20} color="inherit" />}
                    >
                        {loading ? 'Processing...' : 'Proceed'}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};

export default ReceiptPrintWrapper;