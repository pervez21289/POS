import React, { useEffect, useState, useMemo } from 'react';
import {
    Box, Typography, Divider,
    Table, TableBody, TableCell, TableRow, TableHead,
    TableContainer, Card, Stack, IconButton, Button, TextField
} from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptPrintWrapper from './ReceiptPrintWrapper'
import { useDispatch, useSelector } from 'react-redux';
import { setDrawerComponent } from "./../../store/reducers/drawer";
import { setReceiptInfo, setIsSearch } from "./../../store/reducers/sales";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const CartPage = ({ removeFromCart, updateQty }) => {
    const fontSize = '12px';
    const [notes, setNotes] = useState('');
    const [cart, setCart] = useState([]);
    const { receiptInfo } = useSelector((state) => state.sales);
    const dispatch = useDispatch();

    const handleCheckout = async () => {
        try {

            dispatch(
                setDrawerComponent({
                    DrawerComponentChild: ReceiptPrintWrapper,
                    drawerProps: {
                        receiptInfo: { ...receiptInfo }
                    },
                    drawerOpen: true
                })
            );

            dispatch(setIsSearch(true));
        } catch (error) {
            console.error('Error saving sale:', error);
        }
    };


    return (
        <Card sx={{ flex: 2, p: 2, boxShadow: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <ShoppingCartIcon color="warning" />
                <Typography variant="h6" fontWeight={600}>
                    Cart
                </Typography>
            </Stack>
            {receiptInfo?.cart?.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                    Cart is empty
                </Typography>
            ) : (
                <TableContainer sx={{ maxHeight: 260 }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontSize }}>Barcode</TableCell>
                                <TableCell sx={{ fontSize }} align="right">Price</TableCell>
                                <TableCell sx={{ fontSize }} align="right">Discount</TableCell>
                                <TableCell sx={{ fontSize }} align="center">Qty</TableCell>
                                <TableCell sx={{ fontSize }} align="right">Subtotal</TableCell>
                                <TableCell sx={{ fontSize }} align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {receiptInfo?.cart?.map((item, index) => (
                                <React.Fragment key={index}>
                                    <TableRow>
                                        <TableCell colSpan={6} sx={{ p: 0, fontWeight: 'bold', fontSize, borderBottom: 'none' }}>
                                            {item.name}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow key={item.productID}>
                                        <TableCell sx={{ p: 0, fontSize }}>{item.barcode}</TableCell>
                                        <TableCell align="right" sx={{ p: 0, fontSize }}>{item.price.toFixed(2)}</TableCell>
                                        <TableCell align="right" sx={{ p: 0, fontSize }}>
                                            {item.discount?.toFixed(2)}{item.discountPercent ? ` (${item.discountPercent}%)` : ''}
                                        </TableCell>
                                        <TableCell sx={{ fontSize }} align="right">
                                            <Stack direction="row" alignItems="center" spacing={0.5} justifyContent="flex-end">
                                                <TextField
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const newQty = parseInt(e.target.value);
                                                        updateQty(item.productID, newQty);
                                                    }}
                                                    type="number"
                                                    size="small"
                                                    inputProps={{
                                                        min: 1,
                                                        style: { textAlign: 'center' },
                                                    }}
                                                    sx={{ width: 80 }} // Set input width
                                                    onFocus={() => dispatch(setIsSearch(true))}
                                                    onBlur={() => dispatch(setIsSearch(false))}
                                                />
                                            </Stack>
                                        </TableCell>



                                        <TableCell align="right" sx={{ p: 0, fontSize }}>
                                            {isNaN(item.quantity)?0: (item.quantity * (item.price - (item.discount || 0))).toFixed(2)}
                                        </TableCell>
                                        <TableCell align="right" sx={{ p: 0, fontSize }}>
                                            <IconButton color="error" onClick={() => removeFromCart(item.productID)}>
                                                <ClearIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}


            <TextField
                label="Notes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                fullWidth
                multiline
                minRows={1}
                sx={{ mt: 2 }}
            />

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                        Total: <Typography component="span" variant="h6" color="primary.main">&#8377;{receiptInfo?.net?.toFixed(2)}</Typography><br />
                        Items: <Typography component="span" fontWeight={600}>{receiptInfo?.totalItems}</Typography>
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                        Discount: {receiptInfo?.discountAmount?.toFixed(2)} | Tax: {receiptInfo?.taxAmount?.toFixed(2)}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={receiptInfo?.cart?.length === 0}
                    onClick={handleCheckout}
                    sx={{ minWidth: 140, fontWeight: 600 }}
                >
                    Checkout
                </Button>
            </Stack>

        </Card>
    );
}

export default CartPage;