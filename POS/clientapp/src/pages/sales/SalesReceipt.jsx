import React from 'react';
import { Box, Button } from '@mui/material';
import { mobileStickyBottomBarStyles } from '../../components/commonStyles';
import { useDispatch, useSelector } from 'react-redux';
import { openDrawer } from "./../../store/reducers/drawer";
import { setReceiptInfo } from "./../../store/reducers/sales";
import { printReceipt } from './../restaurant/receiptPrinter';


const SalesReceipt = React.forwardRef(({ receiptInfo }, ref) => {
    const { basicSettings } = useSelector((state) => state.sales);

    const fontSize = '11px';
    const dispatch = useDispatch();

    const handlePrint = async () => {
        debugger;
        // Build the items array exactly like in ReceiptPrintWrapper
        const items = receiptInfo?.saleItems?.map(item => ({
            name: item.name,
            barcode: item.barcode || '-',
            quantity: item.quantity,
            price: item.salePrice || item.price || 0,
        })) || [];

        // Prepare the same params structure
        const params = {
            type: 'sale',
            sale: receiptInfo,           // the full sale object
            items: items,
            storeInfo: basicSettings,
            // Optional overrides:
            lineWidth: 32,               // to match your existing 32‑char layout
            // upiId, payeeName, etc. – these will be taken from stored config automatically
        };

        try {
            await printReceipt(params);
        } catch (error) {
            console.error('Print failed:', error);
            // Optionally show a user-friendly alert
        }

        // After printing, close the drawer and clear cart (same as before)
        dispatch(openDrawer({ drawerOpen: false }));
        dispatch(setReceiptInfo({ receiptInfo: { saleItems: [] } }));
    };

    return (
        <Box sx={{ flex: 1, overflowY: 'auto', pr: 1, pb: 10 }}>
            <Box mt={2}>
                <div ref={ref} style={{ fontFamily: 'Courier New, monospace', padding: 0, margin: 0 }}>
                    <p style={{ fontSize: '12px', fontWeight: 'bolder', textAlign: 'center', margin: 0 }}>{basicSettings?.storeName}</p>
                    <p style={{ fontSize, textAlign: 'center', margin: 0, fontWeight: 'bold' }}>{basicSettings?.address}</p>
                    <p style={{ fontSize, textAlign: 'center', margin: 0, fontWeight: 'bold' }}>GST: {basicSettings?.gstin}</p>

                    {receiptInfo.billNo && (
                        <>
                            <hr style={{ margin: '4px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ fontSize, fontWeight: 'bold' }}>Bill#: {receiptInfo?.billNo}</p>
                                    <p style={{ fontSize, fontWeight: 'bold' }}>Date: {receiptInfo?.saleTime}</p>
                                    <p style={{ fontSize, fontWeight: 'bold' }}>Cashier: {receiptInfo?.userName}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize, fontWeight: 'bold' }}>Name: {receiptInfo?.customerName}</p>
                                    <p style={{ fontSize, fontWeight: 'bold' }}>Mobile: {receiptInfo?.mobileNumber}</p>
                                </div>
                            </div>
                        </>
                    )}

                    <hr style={{ margin: '4px 0' }} />
                    <table style={{ width: '100%', fontSize, borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ fontSize: '13px', fontWeight: 'bolder',  textAlign: 'left' }}>Barcode</th>
                                <th style={{ fontSize: '13px', fontWeight: 'bolder', textAlign: 'center' }}>Qty</th>
                                <th style={{ fontSize: '13px', fontWeight: 'bolder', textAlign: 'right' }}>Rate</th>
                                <th style={{ fontSize: '13px', fontWeight: 'bolder', textAlign: 'right' }}>Total</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {receiptInfo?.saleItems?.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td colSpan="4" style={{ fontWeight: 'bold', fontSize, paddingTop: '4px' }}>
                                            {item.name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontSize, fontWeight: 'bold' }}>{item.barcode || '-'}</td>
                                        <td style={{ fontSize, fontWeight: 'bold', textAlign: 'center' }}>{item.quantity}</td>
                                        <td style={{ fontSize, fontWeight: 'bold', textAlign: 'right' }}>{item.costPrice?.toFixed(2)}</td>
                                        <td style={{ fontSize, fontWeight: 'bold', textAlign: 'right' }}>
                                            {(item?.quantity * item?.price).toFixed(2)}
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>

                    <hr style={{ margin: '10px 0' }} />
                    <table style={{ width: '100%', fontSize }}>
                        <tbody>
                            <tr>
                                <td colSpan="3" style={{ fontSize, fontWeight: 'bold' }}>Subtotal</td>
                                <td style={{ fontSize, fontWeight: 'bold', textAlign: 'right' }}>₹{receiptInfo?.totalAmount?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan="3" style={{ fontSize, fontWeight: 'bold' }}>CGST</td>
                                <td style={{ fontSize, fontWeight: 'bold', textAlign: 'right' }}>({receiptInfo?.halfGstRate?.toFixed(2)}%) ₹{receiptInfo?.cgst?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan="3" style={{ fontSize, fontWeight: 'bold' }}>SGST</td>
                                <td style={{ fontSize, fontWeight: 'bold', textAlign: 'right' }}>({receiptInfo?.halfGstRate?.toFixed(2)}%) ₹{receiptInfo?.sgst?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan="3" style={{ fontSize, fontWeight: 'bold' }}>Items</td>
                                <td style={{ fontSize, fontWeight: 'bold', textAlign: 'right' }}>{receiptInfo?.totalItems}</td>
                            </tr>
                            
                        </tbody>
                    </table>

                  
                    <hr style={{ margin: '10px 0' }} />
                    <table style={{ width: '100%', fontSize }}>
                        <tbody>
                            
                            <tr>
                                <td colSpan="3" style={{ fontWeight: 'bold', fontSize: '15px' }}>Total Payable</td>
                                <td style={{ fontWeight: 'bold', fontSize: '15px', textAlign: 'right' }}>₹{receiptInfo?.netAmount?.toFixed(2)}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </Box>

            {receiptInfo.billNo && (
                <Box sx={mobileStickyBottomBarStyles} gap={2}>
                    <Button variant="contained" onClick={handlePrint}>🖨 Print Receipt</Button>
                </Box>
            )}
        </Box>
    );
});

export default SalesReceipt;
