import React from 'react';
import {
    Box, Paper, Typography, Divider, IconButton, TextField,
    Stack, Button, Badge, Chip, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import PrintIcon from '@mui/icons-material/Print';

const CartPanel = ({
    cartItems,
    totalAmount,
    totalItems,
    onCheckout,
    onUpdateQuantity,
    onRemoveItem,
    onPrintOrder,
    subtotal = 0,
    cgst = 0,
    sgst = 0,
    netAmount = 0,
    halfGstRate = 0,
    isMobile = false,
}) => {
    const computedSubtotal = subtotal || cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const computedNet = netAmount || totalAmount;

    return (
        <Paper
            elevation={2}
            sx={{
                p: isMobile ? 1.5 : 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                bgcolor: 'white',
                overflow: 'hidden',
            }}
        >
            {/* Header */}

            {isMobile ? (
                <Box sx={{ flex: 1, overflow: 'auto', mt: 1 }}>
                    {cartItems.length === 0 ? (
                        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                            Cart is empty
                        </Typography>
                    ) : (
                        <Stack spacing={1}>
                            {cartItems.map((item) => (
                                <Paper
                                    key={item.productID}
                                    variant="outlined"
                                    sx={{ p: 1.25, borderRadius: 2 }}
                                >
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                                        <Box sx={{ minWidth: 0, flex: 1 }}>
                                            <Typography fontWeight={600} noWrap sx={{ fontSize: '0.82rem' }}>
                                                {item.name}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.7rem' }} color="text.secondary">
                                                ₹{item.price.toFixed(2)} each
                                            </Typography>
                                        </Box>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => onRemoveItem(item.productID)}
                                            sx={{ width: 36, height: 36, flexShrink: 0 }}
                                        >
                                            <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>

                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <IconButton
                                                onClick={() => onUpdateQuantity(item.productID, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                sx={{
                                                    width: 36, height: 36,
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: 1.5,
                                                }}
                                            >
                                                <RemoveIcon fontSize="small" />
                                            </IconButton>
                                            <Typography fontWeight="bold" sx={{ minWidth: 24, textAlign: 'center', fontSize: '0.85rem' }}>
                                                {item.quantity}
                                            </Typography>
                                            <IconButton
                                                onClick={() => onUpdateQuantity(item.productID, item.quantity + 1)}
                                                sx={{
                                                    width: 36, height: 36,
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: 1.5,
                                                }}
                                            >
                                                <AddIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                        <Typography fontWeight="bold" color="primary.main" sx={{ fontSize: '0.85rem' }}>
                                            ₹{(item.quantity * item.price).toFixed(2)}
                                        </Typography>
                                    </Stack>
                                </Paper>
                            ))}
                        </Stack>
                    )}
                </Box>
            ) : (
                <TableContainer sx={{ flex: 1, overflow: 'auto', mt: 1 }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Barcode</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Item</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Qty</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Rate</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Total</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cartItems.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                        <Typography color="text.secondary">Cart is empty</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                cartItems.map((item) => (
                                    <TableRow key={item.productID} hover>
                                        <TableCell sx={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>
                                            {item.barcode || '-'}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
                                            {item.name}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => onUpdateQuantity(item.productID, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <RemoveIcon fontSize="small" />
                                                </IconButton>
                                                <TextField
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        onUpdateQuantity(item.productID, parseInt(e.target.value) || 1)
                                                    }
                                                    type="number"
                                                    size="small"
                                                    inputProps={{
                                                        min: 1,
                                                        style: { textAlign: 'center', width: 32, padding: '2px' },
                                                    }}
                                                    sx={{ width: 45, '& .MuiInputBase-root': { height: 28 } }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    onClick={() => onUpdateQuantity(item.productID, item.quantity + 1)}
                                                >
                                                    <AddIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontSize: '0.7rem' }}>
                                            ₹{item.price.toFixed(2)}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                                            ₹{(item.quantity * item.price).toFixed(2)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => onRemoveItem(item.productID)}
                                            >
                                                <DeleteOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Divider sx={{ my: 1 }} />

            {/* Summary */}
            <Box sx={{ px: 1 }}>
                <Stack spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" fontWeight="bold">Subtotal</Typography>
                        <Typography variant="body2" fontWeight="bold">₹{computedSubtotal.toFixed(2)}</Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">
                            CGST {halfGstRate > 0 ? `(${halfGstRate.toFixed(2)}%)` : ''}
                        </Typography>
                        <Typography variant="body2">₹{cgst.toFixed(2)}</Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">
                            SGST {halfGstRate > 0 ? `(${halfGstRate.toFixed(2)}%)` : ''}
                        </Typography>
                        <Typography variant="body2">₹{sgst.toFixed(2)}</Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Items</Typography>
                        <Typography variant="body2" fontWeight="bold">{totalItems}</Typography>
                    </Stack>

                    <Divider sx={{ my: 0.5 }} />

                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
                        <Typography variant="subtitle1" fontWeight="bold">Total Payable</Typography>
                        <Typography variant="h6" color="primary.main" fontWeight="bold">
                            ₹{computedNet.toFixed(2)}
                        </Typography>
                    </Stack>
                </Stack>
            </Box>

            {/* Footer with Print and Checkout buttons */}
            <Stack spacing={1} sx={{ mt: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={cartItems.length === 0}
                    onClick={onCheckout}
                    sx={{
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        fontSize: '1rem',
                        background: `linear-gradient(135deg, #1976d2 0%, #1565c0 100%)`,
                        '&:hover': {
                            background: `linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)`,
                        },
                    }}
                >
                    Proceed to Payment
                </Button>
            </Stack>
        </Paper>
    );
};

export default CartPanel;