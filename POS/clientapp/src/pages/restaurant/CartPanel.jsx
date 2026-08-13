import React from 'react';
import {
    Box, Typography, Divider, IconButton,
    Stack, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

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
    onClose,
}) => {
    const theme = useTheme();
    const computedSubtotal = subtotal || cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const computedNet = netAmount || totalAmount;

    // Common text styles for dark, bold text
    const darkText = { color: theme.palette.text.primary, fontWeight: 500 };
    const labelText = { color: theme.palette.text.primary, fontWeight: 400 };

    if (isMobile) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    bgcolor: 'white',
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        p: 2,
                        pb: 1,
                        borderBottom: '1px solid #eaeaea',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexShrink: 0,
                    }}
                >
                    <Typography variant="h6" fontWeight={700} sx={darkText}>
                        Cart ({totalItems})
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Item List */}
                <Box sx={{ flex: 1, overflow: 'auto', px: 2, py: 1 }}>
                    {cartItems.length === 0 ? (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                color: theme.palette.text.primary,
                            }}
                        >
                            <ShoppingCartIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                            <Typography sx={darkText}>Cart is empty</Typography>
                        </Box>
                    ) : (
                        <Stack spacing={1.5}>
                            {cartItems.map((item) => (
                                <Paper
                                    key={item.productID}
                                    elevation={0}
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        border: '1px solid #eaeaea',
                                    }}
                                >
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography fontWeight={600} noWrap fontSize="0.9rem" sx={darkText}>
                                                {item.name}
                                            </Typography>
                                            <Typography variant="caption" sx={{ ...labelText, fontSize: '0.75rem' }}>
                                                ₹{item.price.toFixed(2)}
                                            </Typography>
                                        </Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => onRemoveItem(item.productID)}
                                            sx={{ color: 'grey.600' }}
                                        >
                                            <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>

                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ mt: 1 }}
                                    >
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <IconButton
                                                size="small"
                                                onClick={() => onUpdateQuantity(item.productID, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                sx={{
                                                    border: '1px solid #d0d0d0',
                                                    borderRadius: 1,
                                                    width: 28,
                                                    height: 28,
                                                }}
                                            >
                                                <RemoveIcon fontSize="small" />
                                            </IconButton>
                                            <Typography sx={{ minWidth: 28, textAlign: 'center', fontSize: '0.9rem', ...darkText }}>
                                                {item.quantity}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                onClick={() => onUpdateQuantity(item.productID, item.quantity + 1)}
                                                sx={{
                                                    border: '1px solid #d0d0d0',
                                                    borderRadius: 1,
                                                    width: 28,
                                                    height: 28,
                                                }}
                                            >
                                                <AddIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                        <Typography fontWeight={700} color="primary.main" sx={{ ...darkText, color: 'primary.main' }}>
                                            ₹{(item.quantity * item.price).toFixed(2)}
                                        </Typography>
                                    </Stack>
                                </Paper>
                            ))}
                        </Stack>
                    )}
                </Box>

                {/* Summary & Checkout – fixed at bottom */}
                <Box
                    sx={{
                        borderTop: '1px solid #eaeaea',
                        bgcolor: 'white',
                        px: 2,
                        py: 1.5,
                        pb: 'env(safe-area-inset-bottom, 16px)',
                        flexShrink: 0,
                    }}
                >
                    <Stack spacing={0.5}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" sx={labelText}>Subtotal</Typography>
                            <Typography variant="body2" sx={darkText}>₹{computedSubtotal.toFixed(2)}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" sx={labelText}>
                                CGST {halfGstRate > 0 ? `(${halfGstRate.toFixed(2)}%)` : ''}
                            </Typography>
                            <Typography variant="body2" sx={darkText}>₹{cgst.toFixed(2)}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" sx={labelText}>
                                SGST {halfGstRate > 0 ? `(${halfGstRate.toFixed(2)}%)` : ''}
                            </Typography>
                            <Typography variant="body2" sx={darkText}>₹{sgst.toFixed(2)}</Typography>
                        </Stack>
                        <Divider sx={{ my: 0.5 }} />
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1" fontWeight={700} sx={darkText}>Total</Typography>
                            <Typography variant="h6" fontWeight={800} color="primary.main">
                                ₹{computedNet.toFixed(2)}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={cartItems.length === 0}
                        onClick={onCheckout}
                        sx={{
                            mt: 1.5,
                            borderRadius: 2,
                            py: 1.5,
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '1rem',
                            background: 'linear-gradient(to right, #0055FF, #00D4FF)',
                            '&:hover': {
                                background: 'linear-gradient(to right, #0044CC, #00B8E6)',
                            },
                        }}
                    >
                        Proceed to Payment
                    </Button>
                </Box>
            </Box>
        );
    }

    // --- Desktop version ---
    return (
        <Paper
            elevation={2}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                bgcolor: 'white',
                overflow: 'hidden',
                p: 2,
            }}
        >
            {/* Header */}
            <Typography variant="h6" fontWeight={700} sx={darkText} gutterBottom>
                Cart ({totalItems})
            </Typography>

            {/* Item Table */}
            <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: theme.palette.text.primary }}>
                                Item
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.7rem', color: theme.palette.text.primary }}>
                                Qty
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.7rem', color: theme.palette.text.primary }}>
                                Price
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.7rem', color: theme.palette.text.primary }}>
                                Total
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.7rem', color: theme.palette.text.primary }}>
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cartItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                    <Typography sx={darkText}>Cart is empty</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            cartItems.map((item) => (
                                <TableRow key={item.productID} hover>
                                    <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', ...darkText }}>
                                        {item.name}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                                            <IconButton
                                                size="small"
                                                onClick={() => onUpdateQuantity(item.productID, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                sx={{ border: '1px solid #d0d0d0', borderRadius: 1, width: 24, height: 24 }}
                                            >
                                                <RemoveIcon fontSize="small" />
                                            </IconButton>
                                            <Typography sx={{ minWidth: 24, textAlign: 'center', fontSize: '0.8rem', ...darkText }}>
                                                {item.quantity}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                onClick={() => onUpdateQuantity(item.productID, item.quantity + 1)}
                                                sx={{ border: '1px solid #d0d0d0', borderRadius: 1, width: 24, height: 24 }}
                                            >
                                                <AddIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontSize: '0.8rem', ...darkText }}>
                                        ₹{item.price.toFixed(2)}
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.8rem', ...darkText }}>
                                        ₹{(item.quantity * item.price).toFixed(2)}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            onClick={() => onRemoveItem(item.productID)}
                                            sx={{ color: '#d32f2f' }}
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

            {/* Summary & Actions */}
            <Box sx={{ mt: 2, borderTop: '1px solid #eaeaea', pt: 2 }}>
                <Stack spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={labelText}>Subtotal</Typography>
                        <Typography variant="body2" sx={darkText}>₹{computedSubtotal.toFixed(2)}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={labelText}>
                            CGST {halfGstRate > 0 ? `(${halfGstRate.toFixed(2)}%)` : ''}
                        </Typography>
                        <Typography variant="body2" sx={darkText}>₹{cgst.toFixed(2)}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={labelText}>
                            SGST {halfGstRate > 0 ? `(${halfGstRate.toFixed(2)}%)` : ''}
                        </Typography>
                        <Typography variant="body2" sx={darkText}>₹{sgst.toFixed(2)}</Typography>
                    </Stack>
                    <Divider sx={{ my: 0.5 }} />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" fontWeight={700} sx={darkText}>Total</Typography>
                        <Typography variant="h6" fontWeight={800} color="primary.main">
                            ₹{computedNet.toFixed(2)}
                        </Typography>
                    </Stack>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                    <Button
                        variant="outlined"
                        startIcon={<PrintIcon />}
                        disabled={cartItems.length === 0}
                        onClick={onPrintOrder}
                        sx={{ flex: 1, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                    >
                        Print
                    </Button>
                    <Button
                        variant="contained"
                        disabled={cartItems.length === 0}
                        onClick={onCheckout}
                        sx={{
                            flex: 2,
                            borderRadius: 2,
                            py: 1.2,
                            textTransform: 'none',
                            fontWeight: 700,
                            background: 'linear-gradient(to right, #0055FF, #00D4FF)',
                            '&:hover': {
                                background: 'linear-gradient(to right, #0044CC, #00B8E6)',
                            },
                        }}
                    >
                        Checkout
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
};

export default CartPanel;