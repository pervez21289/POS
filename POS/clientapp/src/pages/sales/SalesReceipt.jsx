// components/Receipt.js
import React, { useEffect } from 'react';
import { Box, Typography, Divider } from '@mui/material';

const SalesReceipt = (recieptInfo) => {

    //useEffect(() => {
    //    debugger;
    //    var data = recieptInfo;

    //}, [recieptInfo]);

    return (
        <Box sx={{ p: 2, fontFamily: 'monospace', width: 300, border: '1px solid #ccc' }}>
            <Typography align="center" variant="h6">VISHAL MEGA MART</Typography>
            <Typography align="center">DEHRADUN-2</Typography>
            <Divider sx={{ my: 1 }} />

            <Typography>Bill No: {recieptInfo?.billNo}</Typography>
            <Typography>Date: {recieptInfo?.dateTime}</Typography>
            <Typography>User ID: {recieptInfo?.userId}</Typography>
            <Divider sx={{ my: 1 }} />

            {recieptInfo.cart?.map((item, index) => (
                <Box key={index} display="flex" justifyContent="space-between">
                    <Typography variant="body2">{item.name}</Typography>
                    <Typography variant="body2">₹{item.price} × {item.qty}</Typography>
                </Box>
            ))}
            <Divider sx={{ my: 1 }} />
            <Typography>Subtotal: ₹{recieptInfo.total?.toFixed(2)}</Typography>
            <Typography>Discount: ₹{recieptInfo.discount?.toFixed(2)}</Typography>
            <Typography>Tax: ₹{recieptInfo.tax?.toFixed(2)}</Typography>
            <Typography fontWeight="bold">Total Payable: ₹{recieptInfo.net?.toFixed(2)}</Typography>
        </Box>
    );
};

export default SalesReceipt;
