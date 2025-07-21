import React, { useEffect } from 'react';
import {
    Box, Typography, Divider,
    Table, TableBody, TableCell, TableRow, TableHead,
    TableContainer, Paper
} from '@mui/material';

import {
    useGetBasicSettingsQuery
} from './../../services/basicSettingAPI';

const SalesReceipt = React.forwardRef(({ receiptInfo, saleId, mobileNumber, customerName }, ref) => {
    const { data, isLoading } = useGetBasicSettingsQuery();
    const fontSize = '10px';
    const totalItems = receiptInfo?.cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    if (isLoading) return <Typography>Loading...</Typography>;

    return (
        <Box ref={ref} sx={{ fontFamily: 'Courier New, monospace', p: 0,m:0 }}>
            <Typography align="center" sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                {data?.[0].storeName}
            </Typography>
            <Typography align="center" sx={{ fontSize }}>{data?.[0].address}</Typography>
            <Typography align="center" sx={{ fontSize }}>GST: {data?.[0].gstin}</Typography>
            <Divider sx={{ my: 0.5 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <Typography align="left" sx={{ fontSize }}>Bill#: {saleId}</Typography>
                    <Typography align="left" sx={{ fontSize }}>Date: {receiptInfo?.saleTime}</Typography>
                    <Typography align="left" sx={{ fontSize }}>Cashier: {receiptInfo?.userName}</Typography>
                </Box>
                <Box textAlign="right">
                    <Typography sx={{ p:0, fontSize }}>Name: {customerName}</Typography>
                    <Typography sx={{ p:0, fontSize }}>Mobile: {mobileNumber}</Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 0.5 }} />

            <TableContainer
            
                sx={{
                    maxHeight: 'none',
                    overflow: 'visible',
                    boxShadow: 'none',
                    p:0 
                }}
            >
                <Table size="small" sx={{ fontSize, width: '100%',p:0 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{  fontSize, backgroundColor: '#fff' }}>Barcode</TableCell>
                            <TableCell align="center" sx={{  fontSize, backgroundColor: '#fff' }}>Qty</TableCell>
                            <TableCell align="right" sx={{  fontSize, backgroundColor: '#fff' }}>Rate</TableCell>
                          
                            <TableCell align="right" sx={{  fontSize, backgroundColor: '#fff' }}>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {receiptInfo?.cart?.map((item, index) => (
                            <React.Fragment key={index}>
                                <TableRow>
                                    <TableCell colSpan={5} sx={{  pb: 0, fontWeight: 'bold', fontSize, borderBottom: 'none' }}>
                                        {item.name}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{  fontSize }}>{item.barcode || '-'}</TableCell>
                                    <TableCell align="center" sx={{ fontSize }}>{item.quantity}</TableCell>
                                    <TableCell align="right" sx={{  fontSize }}>{item.price.toFixed(2)}</TableCell>
                                  
                                    <TableCell align="right" sx={{  fontSize }}>
                                        {(item.quantity * (item?.price - (item.discount || 0))).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Divider sx={{ my: 1 }} />

            {/* Rest of the code remains the same */}
            <Table size="small" sx={{ fontSize }}>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={3} sx={{ p: 0, fontSize }}>Subtotal</TableCell>
                        <TableCell align="right" sx={{ p: 0, fontSize }}>₹{receiptInfo?.totalAmount?.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={3} sx={{ p: 0, fontSize }}>Discount</TableCell>
                        <TableCell align="right" sx={{ p: 0, fontSize }}>₹{receiptInfo?.discountAmount?.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={3} sx={{ p: 0, fontSize }}>Tax</TableCell>
                        <TableCell align="right" sx={{ p: 0, fontSize }}>₹{receiptInfo?.taxAmount?.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={3} sx={{ p: 0, fontWeight: 'bold', fontSize }}>Total Payable</TableCell>
                        <TableCell align="right" sx={{ p: 0, fontWeight: 'bold', fontSize }}>₹{receiptInfo?.net?.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={3} sx={{ p: 0, fontSize }}>Items</TableCell>
                        <TableCell align="right" sx={{ p: 0, fontSize }}>{totalItems}</TableCell>
                    </TableRow>

                </TableBody>
            </Table>

            <Divider sx={{ my: 0.5 }} />
            <Typography align="center" sx={{ fontSize, mt: 1 }}>Thank you! Visit again.</Typography>
        </Box>
    );
});

export default SalesReceipt;