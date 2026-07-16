import React from 'react';
import { Box, Button } from '@mui/material';
import { mobileStickyBottomBarStyles } from '../../components/commonStyles';
import { useDispatch, useSelector } from 'react-redux';
import { openDrawer } from "./../../store/reducers/drawer";
import { setReceiptInfo } from "./../../store/reducers/sales";
import { printReceipt, isElectron } from '../../utils/electronPrint';


const SalesReceipt = React.forwardRef(({ receiptInfo }, ref) => {
    const { basicSettings } = useSelector((state) => state.sales);

    const fontSize = '11px';
    const dispatch = useDispatch();

    const handlePrint = () => {
        if (window.ReactNativeWebView) {
            handlePrintMobile();
        } else {
            handlePrintWeb();
        }
        dispatch(openDrawer({ drawerOpen: false }));
        dispatch(setReceiptInfo({ receiptInfo: { saleItems: [] } }));
    };

    const handlePrintMobile = () => {
        const receiptHTML = generateTextReceipt();
        window.ReactNativeWebView?.postMessage(receiptHTML);
    };

    const handlePrintWeb = async () => {
        const textToPrint = generateTextReceipt();
        
        // Check if running in Electron to determine HTML format
        const isInElectron = window.electronPOS !== undefined;
        
        const htmlContent = `
        <html>
        <head>
            <title>Receipt</title>
            <style>
                @media print {
                    @page { margin: 0; }
                    body { margin: 0; font-family: monospace; font-size: 12px; }
                }
                body { font-family: monospace; white-space: pre; font-size: 12px; }
            </style>
        </head>
        <body${isInElectron ? '' : ' onload="window.print(); window.close();"'}>
            <pre>${textToPrint}</pre>
        </body>
        </html>
    `;
        
        // Use Electron print if available, otherwise fallback to browser popup
        await printReceipt(htmlContent);
    };

    const generateTextReceipt = () => {
        const LINE_WIDTH = 32;
        const padRight = (text, length) => (text + ' '.repeat(Math.max(length - text.length, 0))).slice(0, length);
        const padLeft = (text, length) => (' '.repeat(Math.max(length - text.length, 0)) + text).slice(-length);
        const center = (text) => {
            const space = Math.floor((LINE_WIDTH - text.length) / 2);
            return ' '.repeat(Math.max(space, 0)) + text;
        };
        const safeText = (text) => (text || '').toString().slice(0, LINE_WIDTH);
        const lines = [];

        // Header
        lines.push(center(safeText(basicSettings?.storeName || 'Store Name')));
        lines.push(center(safeText(basicSettings?.address || 'Store Address')));
        lines.push(center(`GST: ${safeText(basicSettings?.gstin || '-')}`));
        lines.push('-'.repeat(LINE_WIDTH));

        // Info
        lines.push(`Bill#: ${receiptInfo?.billNo || ''}`);
        lines.push(`Date: ${receiptInfo?.saleTime || ''}`);
        lines.push(`Cashier: ${receiptInfo?.userName || ''}`);
        if (receiptInfo.customerName) lines.push(`Name: ${receiptInfo?.customerName || ''}`);
        lines.push(`Mobile: ${receiptInfo?.mobileNumber || ''}`);
        lines.push('-'.repeat(LINE_WIDTH));
        lines.push('Item       Qty   Rt     Tot');

        // Items
        receiptInfo?.saleItems?.forEach(item => {
            lines.push(safeText(item.name));
            const qty = padLeft(item.quantity?.toString() || '0', 2);
            const rate = padLeft(item.price?.toFixed(0) || '0', 4);
            const total = padLeft((item.quantity * item.price ).toFixed(0), 7);
            const barcode = padRight(item.barcode || '-', 10);
            lines.push(`${barcode} ${qty} ${rate} ${total}`);
        });

        lines.push('-'.repeat(LINE_WIDTH));

        // Summary
        lines.push(`${padRight('Subtotal:', 16)}${padLeft(receiptInfo?.totalAmount?.toFixed(2) || '0.00', 14)}`);
        lines.push(`${padRight(`CGST:`, 16)}${padLeft(receiptInfo?.cgst?.toFixed(2) || '0.00', 14)}`);
        lines.push(`${padRight(`SGST:`, 16)}${padLeft(receiptInfo?.sgst?.toFixed(2) || '0.00', 14)}`);
        lines.push(`${padRight(`Items:`, 16)}${padLeft(receiptInfo?.totalItems.toString() || '0.00', 14)}`);
        lines.push('-'.repeat(LINE_WIDTH));
        lines.push(`${padRight('Total Payable:', 16)}${padLeft(`Rs.${receiptInfo?.netAmount?.toFixed(2) || '0.00'}`, 14)}`);
        lines.push('-'.repeat(LINE_WIDTH));
        lines.push(center('Thank you!'));
        lines.push(center('Visit again!'));

        return lines.join('\n');
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
