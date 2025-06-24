import React from 'react';
import {
    Box, Typography, Divider,
    Table, TableBody, TableCell, TableRow, TableHead
} from '@mui/material';

const SalesReceipt = ({ cart, billNo, dateTime, userId, total, discount, tax, net }) => {
    const rightCell = { p: 0.5, textAlign: 'right', fontSize: '10px' };
    const itemCell = { p: 0.5, fontSize: '10px', maxWidth: 140, wordWrap: 'break-word' };

    return (
        <Box sx={{ p: 1, fontFamily: 'monospace', width: 300, border: '1px solid #ccc', fontSize: '10px' }}>
            <Typography align="center" sx={{ fontSize: '12px', fontWeight: 'bold' }}>VISHAL MEGA MART</Typography>
            <Typography align="center" sx={{ fontSize: '10px' }}>DEHRADUN-2</Typography>
            <Divider sx={{ my: 0.5 }} />

            <Typography sx={{ fontSize: '10px' }}>Bill No: {billNo}</Typography>
            <Typography sx={{ fontSize: '10px' }}>Date: {dateTime}</Typography>
            <Typography sx={{ fontSize: '10px' }}>User ID: {userId}</Typography>
            <Divider sx={{ my: 0.5 }} />

            {/* Item Table */}
            <Table size="small" sx={{ fontSize: '10px' }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={itemCell}>Item</TableCell>
                        <TableCell sx={rightCell}>Qty</TableCell>
                        <TableCell sx={rightCell}>Rate</TableCell>
                        <TableCell sx={rightCell}>Amt</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cart?.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell sx={itemCell}>{item.name}</TableCell>
                            <TableCell sx={rightCell}>{item.qty}</TableCell>
                            <TableCell sx={rightCell}>₹{item.price.toFixed(2)}</TableCell>
                            <TableCell sx={rightCell}>
                                ₹{(item.qty * (item.price - (item.discount || 0))).toFixed(2)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Divider sx={{ my: 0.5 }} />

            {/* Totals Table */}
            <Table size="small" sx={{ fontSize: '10px' }}>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={3} sx={rightCell}>Subtotal</TableCell>
                        <TableCell sx={rightCell}>₹{total?.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={3} sx={rightCell}>Discount</TableCell>
                        <TableCell sx={rightCell}>₹{discount?.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={3} sx={rightCell}>Tax</TableCell>
                        <TableCell sx={rightCell}>₹{tax?.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={3} sx={{ ...rightCell, fontWeight: 'bold' }}>Total</TableCell>
                        <TableCell sx={{ ...rightCell, fontWeight: 'bold' }}>₹{net?.toFixed(2)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <Divider sx={{ my: 0.5 }} />
            <Typography align="center" sx={{ fontSize: '10px', mt: 1 }}>Thank you! Visit again.</Typography>
        </Box>
    );
};

export default SalesReceipt;
