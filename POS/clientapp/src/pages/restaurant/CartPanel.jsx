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
}) => {
    const computedSubtotal = subtotal || cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const computedNet = netAmount || totalAmount;

    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                bgcolor: 'white',
                overflow: 'hidden',
            }}
        >
            {/* Header – removed Print button from here */}
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <Badge badgeContent={totalItems} color="primary" showZero>
                    <ShoppingCartCheckoutIcon color="action" />
                </Badge>
                <Typography variant="h6" fontWeight="bold" sx={{ flex: 1 }}>
                    Cart
                </Typography>
                <Chip label={`${totalItems} items`} size="small" variant="outlined" />
            </Stack>

            <Divider />

            {/* Item Table */}
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
                                    <TableCell sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                                        {item.barcode || '-'}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
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
                                    <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                                        ₹{item.price.toFixed(2)}
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
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
                {onPrintOrder && (
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<PrintIcon />}
                        onClick={onPrintOrder}
                        disabled={cartItems.length === 0}
                        sx={{
                            borderRadius: 2,
                            py: 1.2,
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            borderColor: '#1976d2',
                            color: '#1976d2',
                            '&:hover': {
                                borderColor: '#1565c0',
                                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                            },
                        }}
                    >
                        Print Order
                    </Button>
                )}
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