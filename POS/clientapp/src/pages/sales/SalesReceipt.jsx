import React, { useEffect, useRef, useState } from 'react';
import { useGetBasicSettingsQuery } from './../../services/basicSettingAPI';
import {
    Box, Button
} from '@mui/material';
import { mobileStickyBottomBarStyles } from '../../components/commonStyles';
import { setReceiptInfo } from "./../../store/reducers/sales";
import { useDispatch } from 'react-redux';
import { openDrawer } from "./../../store/reducers/drawer";
const SalesReceipt = React.forwardRef(({ receiptInfo }, ref) => {
    const { data, isLoading } = useGetBasicSettingsQuery();
    const fontSize = '11px';
    const totalItems = receiptInfo?.cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const dispatch = useDispatch();

    const handlePrint = () => {
        if (window.ReactNativeWebView) {
            handlePrintMobile();
        } else {
            handlePrintWeb();
        }

        dispatch(setReceiptInfo({ receiptInfo: { cart: [] } }));
        dispatch(openDrawer({ drawerOpen: false }));

    };


    const handlePrintMobile = () => {

        const receiptHTML = generateTextReceipt();
        window.ReactNativeWebView?.postMessage(receiptHTML);
    };


    const handlePrintWeb = () => {
        const textToPrint = generateTextReceipt();

        const printWindow = window.open('', '_blank', 'width=320,height=600');

        if (!printWindow) return;

        printWindow.document.write(`
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
        <body onload="window.print(); window.close();">
            <pre>${textToPrint}</pre>
        </body>
        </html>
    `);
        printWindow.document.close();
    };

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
        lines.push(`Bill#: ${receiptInfo?.billNo}  Date: ${receiptInfo?.saleTime || ''}`);
        lines.push(`Cashier: ${receiptInfo?.userName}`);
        lines.push(`Name: ${receiptInfo?.customerName}`);
        lines.push(`Mobile: ${receiptInfo?.mobileNumber}`);
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

    if (isLoading) return <p>Loading...</p>;

    return (
        <Box sx={{ flex: 1, overflowY: 'auto', pr: 1, pb: 10 }}>


            <Box mt={2}>
                <div ref={ref} style={{ fontFamily: 'Courier New, monospace', padding: 0, margin: 0 }}>
                    <p style={{ fontSize: '12px', fontWeight: 'bolder', textAlign: 'center', margin: 0 }}>{data[0]?.storeName}</p>
                    <p style={{ fontSize, textAlign: 'center', margin: 0, fontWeight: 'bold' }}>{data[0]?.address}</p>
                    <p style={{ fontSize, textAlign: 'center', margin: 0, fontWeight: 'bold' }}>GST: {data[0]?.gstin}</p>
                    

                    {receiptInfo.billNo && (<><hr style={{ margin: '4px 0' }} /><div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ fontSize, fontWeight: 'bold' }}>Bill#: {receiptInfo?.billNo}</p>
                            <p style={{ fontSize, fontWeight: 'bold' }}>Date: {receiptInfo?.saleTime}</p>
                            <p style={{ fontSize, fontWeight: 'bold' }}>Cashier: {receiptInfo?.userName}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize, fontWeight: 'bold' }}>Name: {receiptInfo?.customerName}</p>
                            <p style={{ fontSize, fontWeight: 'bold' }}>Mobile: {receiptInfo?.mobileNumber}</p>
                        </div>
                    </div></>)
                    }
                    <hr style={{ margin: '4px 0' }} />

                    <table style={{ width: '100%', fontSize, borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ fontSize, textAlign: 'left' }}>Barcode</th>
                                <th style={{ fontSize, textAlign: 'center' }}>Qty</th>
                                <th style={{ fontSize, textAlign: 'right' }}>Rate</th>
                                <th style={{ fontSize, textAlign: 'right' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receiptInfo?.cart?.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td colSpan="4" style={{ fontWeight: 'bold', fontSize, borderBottom: 'none', paddingTop: '4px' }}>
                                            {item.name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontSize, fontWeight: 'bold' }}>{item.barcode || '-'}</td>
                                        <td style={{ fontSize, fontWeight: 'bold', textAlign: 'center' }}>{item.quantity}</td>
                                        <td style={{ fontSize, fontWeight: 'bold', textAlign: 'right' }}>{item.price.toFixed(2)}</td>
                                        <td style={{ fontSize, fontWeight: 'bold', textAlign: 'right' }}>
                                            {(item.quantity * (item?.price - (item.discount || 0))).toFixed(2)}
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
                                <td colSpan="3" style={{ fontSize, fontWeight: 'bold' }}>Discount</td>
                                <td style={{ fontSize, fontWeight: 'bold', textAlign: 'right' }}>₹{receiptInfo?.discountAmount?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan="3" style={{ fontSize, fontWeight: 'bold' }}>Tax</td>
                                <td style={{ fontSize, fontWeight: 'bold', textAlign: 'right' }}>₹{receiptInfo?.taxAmount?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan="3" style={{ fontWeight: 'bold', fontSize }}>Total Payable</td>
                                <td style={{ fontWeight: 'bold', fontSize, textAlign: 'right' }}>₹{receiptInfo?.net?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan="3" style={{ fontSize, fontWeight: 'bold' }}>Items</td>
                                <td style={{ fontSize, fontWeight: 'bold', textAlign: 'right' }}>{totalItems}</td>
                            </tr>
                        </tbody>
                    </table>

                    <hr style={{ margin: '4px 0' }} />
                    <p style={{ fontSize, fontWeight: 'bold', textAlign: 'center', marginTop: '8px' }}>Thank you! Visit again.</p>
                </div>
                
            </Box>

            {receiptInfo.billNo && (<Box
                sx={mobileStickyBottomBarStyles}
                gap={2}
            >


                <Button variant="contained" onClick={handlePrint}>
                    🖨 Print Receipt
                </Button>

            </Box>)}
        </Box>
    );
});

export default SalesReceipt;
