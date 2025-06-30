import React from 'react';
import {
    Box, Typography, Divider,
    Table, TableBody, TableCell, TableRow, TableHead
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

const SalesReceipt = (receiptInfo) => {
    const fontSize = '10px';

    return (
        <Box sx={{ p:5, fontFamily: 'monospace', width: 300, border: '1px solid #ccc', fontSize }}>
            <Typography align="center" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                VISHAL MEGA MART
            </Typography>
            <Typography align="center" sx={{ fontSize }}>DEHRADUN-2</Typography>
            <Divider sx={{ my: 0.5 }} />

            <Typography sx={{ fontSize }}>Bill No: {receiptInfo?.billNo}</Typography>
            <Typography sx={{ fontSize }}>Date: {receiptInfo?.dateTime}</Typography>
            <Typography sx={{ fontSize }}>User ID: {receiptInfo?.userId}</Typography>
            <Divider sx={{ my: 0.5 }} />

            <Table size="small" sx={{ fontSize }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ p: 0.5, fontSize }}>Barcode</TableCell>
                        <TableCell align="right" sx={{ p: 0.5, fontSize }}>Qty</TableCell>
                        <TableCell align="right" sx={{ p: 0.5, fontSize }}>Rate</TableCell>
                        <TableCell align="right" sx={{ p: 0.5, fontSize }}>Amount</TableCell>
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
                            <TableRow sx={{ p: 0 }} >
                            
                                <TableCell sx={{ p: 0, borderTop: 'none', fontSize }}>{item.barcode || '-'}</TableCell>
                                <TableCell align="right" sx={{ p: 0, borderTop: 'none', fontSize }}>{item.qty}</TableCell>
                                <TableCell align="right" sx={{ p: 0, borderTop: 'none', fontSize }}>₹{item.price.toFixed(2)}</TableCell>
                                <TableCell align="right" sx={{ p: 0, borderTop: 'none', fontSize }}>
                                    ₹{(item.qty * (item.price - (item.discount || 0))).toFixed(2)}
                                </TableCell>
                            </TableRow>
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>

            <Divider sx={{ my: 0.5 }} />

            <Table size="small">
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={4} sx={{ p: 0.5, fontSize }}>Subtotal</TableCell>
                        <TableCell align="right" sx={{ p: 0.5, fontSize }}>₹{receiptInfo?.total?.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={4} sx={{ p: 0.5, fontSize }}>Discount</TableCell>
                        <TableCell align="right" sx={{ p: 0.5, fontSize }}>₹{receiptInfo?.discount?.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={4} sx={{ p: 0.5, fontSize }}>Tax</TableCell>
                        <TableCell align="right" sx={{ p: 0.5, fontSize }}>₹{receiptInfo?.tax?.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={4} sx={{ p: 0.5, fontWeight: 'bold', fontSize }}>Total Payable</TableCell>
                        <TableCell align="right" sx={{ p: 0.5, fontWeight: 'bold', fontSize }}>₹{receiptInfo?.net?.toFixed(2)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <Divider sx={{ my: 0.5 }} />
            <Typography align="center" sx={{ fontSize, mt: 1 }}>Thank you! Visit again.</Typography>
        </Box>
    );
};

export default SalesReceipt;
