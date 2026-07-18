import React from 'react';
import { Paper, Typography, Stack, Chip, IconButton, Button, Avatar, Divider, Badge, useTheme } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PrintIcon from '@mui/icons-material/Print';

// Top gradient bar: current table, KOT/order actions, printing actions, and (on mobile) the cart toggle.
const POSHeader = ({
    selectedTable,
    isMobile,
    cartItemCount,
    onSaveKOT,
    onViewKOTs,
    onNewOrder,
    onPrintOrder,
    onTestPrinter,
    onOpenPrinterSettings,
    onToggleCartDrawer,
}) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                p: 1.5,
                mb: 1.5,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1.5,
            }}
        >
            <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 36, height: 36 }}>
                    <RestaurantIcon />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">POS</Typography>
            </Stack>

            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />

            <Chip
                icon={<ReceiptIcon />}
                label={`Table ${selectedTable || '--'}`}
                sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold',
                    '& .MuiChip-icon': { color: 'white' },
                }}
            />

            <Stack direction="row" spacing={1} sx={{ flex: 1, flexWrap: 'wrap' }}>
                <Button
                    variant="contained"
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                    onClick={onSaveKOT}
                >
                    Save KOT
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                    onClick={onViewKOTs}
                >
                    View KOTs
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={onNewOrder}
                    sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
                >
                    New Order
                </Button>

                {/* Print Buttons */}
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<PrintIcon />}
                    onClick={onPrintOrder}
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                    }}
                >
                    Print KOT
                </Button>

                <Button
                    variant="contained"
                    size="small"
                    onClick={onTestPrinter}
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                    }}
                >
                    Test Printer
                </Button>

                <IconButton
                    size="small"
                    onClick={onOpenPrinterSettings}
                    sx={{ color: 'white' }}
                >
                    <SettingsIcon />
                </IconButton>

                {isMobile && (
                    <Badge badgeContent={cartItemCount || 0} color="error" sx={{ ml: 'auto' }}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={onToggleCartDrawer}
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                        >
                            <ShoppingCartIcon />
                        </Button>
                    </Badge>
                )}
            </Stack>
        </Paper>
    );
};

export default POSHeader;
