import React, { useEffect } from 'react';
import {
    Box, Typography, Divider,
    Table, TableBody, TableCell, TableRow, TableHead
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

const SalesReceipt = ({ receiptInfo, Bill }) => {
    const fontSize = '10px';

    //useEffect(() => {
    //    debugger;
    //    var ddd = receiptInfo;
    //    var dddd = Bill;
    //}, [Bill])

    return (
        <Box sx={{ p:5, fontFamily: 'monospace', width: 400, border: '1px solid #ccc', fontSize }}>
            <Typography align="center" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                {receiptInfo?.companyName}
            </Typography>
            <Typography align="center" sx={{ fontSize }}>DEHRADUN-2</Typography>
            <Divider sx={{ my: 0.5 }} />

            <Typography sx={{ fontSize }}>Bill No: {Bill ? Bill?.billNo: receiptInfo.billNo}</Typography>
            <Typography sx={{ fontSize }}>Date: {receiptInfo?.saleTime}</Typography>
            <Typography sx={{ fontSize }}>Cashier: {receiptInfo?.userName}</Typography>
            <Divider sx={{ my: 0.5 }} />

            <Table size="small" sx={{ fontSize }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ p: 0.5, fontSize }}>Barcode</TableCell>
                        <TableCell align="right" sx={{ p: 0.5, fontSize }}>Qty</TableCell>
                        <TableCell align="right" sx={{ p: 0.5, fontSize }}>Rate</TableCell>
                        <TableCell align="right" sx={{ p: 0.5, fontSize }}>Discount</TableCell>
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
                        <TableRow key={index}>
                           
                            <TableCell sx={{ p: 0.5, fontSize }}>
                          
                                   
                                        {item.barcode || '-'}
                                   
                                
                            </TableCell>
                                <TableCell align="right" sx={{ p: 0.5, fontSize }}>{item.quantity}</TableCell>
                                <TableCell align="right" sx={{ p: 0.5, fontSize }}>₹{item.price.toFixed(2)}</TableCell>
                                <TableCell align="right" sx={{ p: 0.5, fontSize }}>₹{item.discount.toFixed(2)}</TableCell>
                            <TableCell align="right" sx={{ p: 0.5, fontSize }}>
                                    ₹{(item.quantity * (item?.price - (item.discount || 0))).toFixed(2)}
                            </TableCell>
                            </TableRow>
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>

            <Divider sx={{ my: 1 }} />

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
                </TableBody>
            </Table>


            <Divider sx={{ my: 0.5 }} />
            <Typography align="center" sx={{ fontSize, mt: 1 }}>Thank you! Visit again.</Typography>
        </Box>
    );
};

export default SalesReceipt;
