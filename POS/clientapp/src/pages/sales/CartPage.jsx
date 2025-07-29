import React, { useState } from 'react';
import {
    Box, Typography, Divider, Card, Stack,
    IconButton, Button, TextField, useMediaQuery, Paper,
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody, FormControlLabel, Switch
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptPrintWrapper from './ReceiptPrintWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { setDrawerComponent } from "../../store/reducers/drawer";
import { setReceiptInfo, setIsSearch } from "../../store/reducers/sales";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import useIsMobile from './../../components/useIsMobile';

const CartPage = () => {
    const [notes, setNotes] = useState('');
    const dispatch = useDispatch();
    const { receiptInfo, isSearch } = useSelector((state) => state.sales);
    const isMobile = useIsMobile();
    const fontSize = isMobile ? '11px' : '12px';

    const updateQty = (productID, qty) => {
        const currentCart = receiptInfo?.cart ?? [];
        const updatedCart = currentCart.map((i) =>
            i.productID === productID ? { ...i, quantity: Math.max(1, Number(qty)) } : i
        );
        dispatch(setReceiptInfo({ receiptInfo: { cart: updatedCart } }));
    };

    const removeFromCart = (productID) => {
        const currentCart = receiptInfo?.cart ?? [];
        const updatedCart = currentCart.filter((i) => i.productID !== productID);
        dispatch(setReceiptInfo({ receiptInfo: { cart: updatedCart } }));
    };

    const handleCheckout = () => {
        dispatch(
            setDrawerComponent({
                DrawerComponentChild: ReceiptPrintWrapper,
                drawerOpen: true
            })
        );
        dispatch(setIsSearch(true));
    };

    const renderMobileCart = () => (
        <Stack spacing={2}>
            {receiptInfo?.cart?.map((item) => (
                <Paper key={item.productID} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography fontWeight="bold">{item.name}</Typography>
                            <Typography variant="body2" color="text.secondary">Barcode: {item.barcode}</Typography>
                            <Typography variant="body2">Price: ₹{item.costPrice.toFixed(2)}</Typography>
                            <Typography variant="body2">Discount: ₹ {item.discountAmount?.toFixed(2)}{item.discountPercent ? ` (${item.discountPercent}%)` : ''}</Typography>
                            <Typography variant="body2">Subtotal: ₹{(item.quantity * (item.price - (item.discount || 0))).toFixed(2)}</Typography>
                        </Box>
                        <IconButton color="error" onClick={() => removeFromCart(item.productID)}>
                            <ClearIcon />
                        </IconButton>
                    </Stack>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mt={1}>
                        <IconButton onClick={() => updateQty(item.productID, item.quantity - 1)} disabled={item.quantity <= 1}>
                            <RemoveIcon />
                        </IconButton>
                        <TextField
                            value={item.quantity}
                            onChange={(e) => updateQty(item.productID, parseInt(e.target.value) || 1)}
                            type="number"
                            size="small"
                            inputProps={{ min: 1, style: { textAlign: 'center' } }}
                            sx={{ width: 60 }}
                        />
                        <IconButton onClick={() => updateQty(item.productID, item.quantity + 1)}>
                            <AddIcon />
                        </IconButton>
                    </Stack>
                </Paper>
            ))}
        </Stack>
    );

    const renderDesktopCart = () => (
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
                    {receiptInfo?.cart?.map((item) => (
                        <React.Fragment key={item.productID}>
                            <TableRow>
                                <TableCell colSpan={6} sx={{ p: 0.5, fontWeight: 'bold', fontSize, borderBottom: 'none' }}>
                                    {item.name}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ p: 0.5, fontSize }}>{item.barcode}</TableCell>
                                <TableCell align="right" sx={{ p: 0.5, fontSize }}>{item.costPrice?.toFixed(2)}</TableCell>
                                <TableCell align="right" sx={{ p: 0.5, fontSize }}>
                                    {item.discountAmount?.toFixed(2)}{item.discountPercent ? ` (${item.discountPercent}%)` : ''}
                                </TableCell>
                                <TableCell align="center" sx={{ fontSize }}>
                                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                                        <IconButton
                                            size="small"
                                            onClick={() => updateQty(item.productID, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <RemoveIcon fontSize="small" />
                                        </IconButton>
                                        <TextField
                                            value={item.quantity}
                                            onChange={(e) => updateQty(item.productID, parseInt(e.target.value) || 1)}
                                            type="number"
                                            size="small"
                                            inputProps={{
                                                min: 1,
                                                style: { textAlign: 'center', fontSize }
                                            }}
                                            sx={{ width: 60 }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => updateQty(item.productID, item.quantity + 1)}
                                        >
                                            <AddIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                                <TableCell align="right" sx={{ p: 0.5, fontSize }}>
                                    {(item.quantity *item.price ).toFixed(2)}
                                </TableCell>
                                <TableCell align="right" sx={{ p: 0.5, fontSize }}>
                                    <IconButton color="error" onClick={() => removeFromCart(item.productID)}>
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Card sx={{ p: isMobile ? 1.5 : 3, boxShadow: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <ShoppingCartIcon color="warning" />
                    <Typography
                        variant="h6"
                        fontSize={isMobile ? '1.2rem' : '1.5rem'}
                        fontWeight={600}
                    >
                        Cart
                    </Typography>
                </Stack>

                <FormControlLabel
                    control={
                        <Switch
                            checked={!isSearch}
                            onChange={() => dispatch(setIsSearch(!isSearch))}
                            size="small"
                        />
                    }
                    label="Barcode Search"
                    labelPlacement="start"
                    sx={{ ml: 'auto' }}
                />
            </Stack>

            {receiptInfo?.cart?.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                    Cart is empty
                </Typography>
            ) : (
                isMobile ? renderMobileCart() : renderDesktopCart()
            )}

         

            <Divider sx={{ my: 2 }} />

            <Stack direction={isMobile ? 'column' : 'row'} spacing={2} justifyContent="space-between" alignItems={isMobile ? 'flex-start' : 'center'}>
                <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                        Total:{' '}
                        <Typography component="span" variant="h6" color="primary.main">
                            ₹{receiptInfo?.net?.toFixed(2)}
                        </Typography><br />
                        Items:{' '}
                        <Typography component="span" fontWeight={600}>
                            {receiptInfo?.totalItems}
                        </Typography>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Discount: ₹{receiptInfo?.discountAmount?.toFixed(2)} | Tax: ₹{receiptInfo?.taxAmount?.toFixed(2)}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth={isMobile}
                    disabled={receiptInfo?.cart?.length === 0}
                    onClick={handleCheckout}
                    sx={{ minWidth: isMobile ? '100%' : 140, fontWeight: 600 }}
                >
                    Checkout
                </Button>
            </Stack>
        </Card>
    );
};

export default CartPage;
